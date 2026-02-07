import { useEffect, useState } from "react";
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
  IonAlert,
} from "@ionic/react";

import { db } from "../firebase";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";

import { useParams, useHistory } from "react-router-dom";
import "./EditExpense.css";

interface RouteParams {
  id: string;
}

const EditExpense: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState("expense");
  const [category, setCategory] = useState("");
  const [note, setNote] = useState("");

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  /* ----------------------------------------
   *  โหลดข้อมูลรายการ จาก Firestore
   * ---------------------------------------- */
  useEffect(() => {
    const loadData = async () => {
      const docRef = doc(db, "expenses", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        const d = snap.data();
        setTitle(d.title);
        setAmount(d.amount);
        setType(d.type);
        setCategory(d.category);
        setNote(d.note);
      }
    };
    loadData();
  }, [id]);

  /* ----------------------------------------
   *  อัปเดตข้อมูล
   * ---------------------------------------- */
  const updateExpense = async () => {
    const docRef = doc(db, "expenses", id);

    await updateDoc(docRef, {
      title,
      amount,
      type,
      category,
      note,
    });

    history.push("/AllExpenses"); // กลับไปหน้ารายการ
  };

  /* ----------------------------------------
   *  ลบข้อมูล
   * ---------------------------------------- */
  const deleteExpense = async () => {
    const docRef = doc(db, "expenses", id);
    await deleteDoc(docRef);

    history.push("/AllExpenses");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>แก้ไขรายการ</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding edit-expense-container">
        <IonInput
          label="ชื่อรายการ"
          value={title}
          onIonChange={(e) => setTitle(e.detail.value!)}
        ></IonInput>

        <IonInput
          className="ion-margin-top"
          label="จำนวนเงิน"
          type="number"
          value={amount}
          onIonChange={(e) => setAmount(Number(e.detail.value!))}
        ></IonInput>

        <IonSelect
          label="ประเภท"
          value={type}
          onIonChange={(e) => setType(e.detail.value)}
          className="ion-margin-top"
        >
          <IonSelectOption value="income">รายรับ</IonSelectOption>
          <IonSelectOption value="expense">รายจ่าย</IonSelectOption>
        </IonSelect>

        <IonInput
          className="ion-margin-top"
          label="หมวดหมู่"
          value={category}
          onIonChange={(e) => setCategory(e.detail.value!)}
        ></IonInput>

        <IonTextarea
          className="ion-margin-top"
          label="หมายเหตุ"
          value={note}
          onIonChange={(e) => setNote(e.detail.value!)}
        ></IonTextarea>

        <IonButton
          expand="block"
          className="update-btn"
          onClick={updateExpense}
        >
          อัปเดตข้อมูล
        </IonButton>

        <IonButton
          expand="block"
          className="delete-btn"
          onClick={() => setShowDeleteConfirm(true)}
        >
          ลบรายการ
        </IonButton>

        {/* Alert ยืนยันก่อนลบ */}
        <IonAlert
          isOpen={showDeleteConfirm}
          header="ยืนยันการลบ"
          message="คุณต้องการลบข้อมูลนี้จริงหรือไม่?"
          buttons={[
            {
              text: "ยกเลิก",
              role: "cancel",
            },
            {
              text: "ลบ",
              role: "destructive",
              handler: deleteExpense,
            },
          ]}
          onDidDismiss={() => setShowDeleteConfirm(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditExpense;
