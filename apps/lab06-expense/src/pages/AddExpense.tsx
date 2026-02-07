import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
} from "@ionic/react";

import { useState } from "react";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useHistory } from "react-router-dom";
import "./AddExpense.css";

const AddExpense: React.FC = () => {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const saveExpense = async () => {
    await addDoc(collection(db, "expenses"), {
      title,
      amount: Number(amount),
      type,
      category,
      note,
      createdAt: new Date(),
    });

    history.push("/AllExpenses");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>เพิ่มรายการรายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding add-expense-container">
        <IonInput
          label="ชื่อรายการ"
          labelPlacement="floating"
          value={title}
          onIonChange={(e) => setTitle(e.detail.value!)}
        />

        <IonInput
          label="จำนวนเงิน"
          labelPlacement="floating"
          type="number"
          value={amount}
          onIonChange={(e) => setAmount(Number(e.detail.value))}
        />

        <IonSelect
          label="ประเภท"
          value={type}
          onIonChange={(e) => setType(e.detail.value)}
        >
          <IonSelectOption value="income">รายรับ</IonSelectOption>
          <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
        </IonSelect>

        <IonInput
          label="หมวดหมู่"
          labelPlacement="floating"
          value={category}
          onIonChange={(e) => setCategory(e.detail.value!)}
        />

        <IonTextarea
          label="หมายเหตุ"
          labelPlacement="floating"
          value={note}
          onIonChange={(e) => setNote(e.detail.value!)}
        />

        <IonButton expand="block" className="save-btn" onClick={saveExpense}>
          บันทึกข้อมูล
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default AddExpense;
