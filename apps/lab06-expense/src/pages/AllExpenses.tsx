import { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  IonSpinner,
} from "@ionic/react";
import { db } from "../firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { useHistory } from "react-router-dom";
import "./AllExpenses.css";

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
  note: string;
  createdAt: any;
}

const AllExpenses: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const history = useHistory();

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Expense[];

      setExpenses(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายการทั้งหมด</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding all-expenses-container">
        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <IonSpinner name="crescent" />
          </div>
        )}

        {/* No Data */}
        {!loading && expenses.length === 0 && (
          <p className="no-data">ยังไม่มีข้อมูล</p>
        )}

        {/* Table */}
        {!loading && expenses.length > 0 && (
          <IonGrid>
            <IonRow className="expense-header-row">
              <IonCol>ชื่อรายการ</IonCol>
              <IonCol>จำนวนเงิน</IonCol>
              <IonCol>ประเภท</IonCol>
              <IonCol>หมายเหตุ</IonCol>
              <IonCol>แก้ไข</IonCol>
            </IonRow>

            {expenses.map((item) => (
              <IonRow key={item.id} className="expense-row">
                <IonCol className="expense-text">{item.title}</IonCol>
                <IonCol className="expense-text">{item.amount}</IonCol>
                <IonCol
                  className="expense-text"
                  style={{
                    color: item.type === "income" ? "#00c853" : "#ff5252",
                  }}
                >
                  {item.type === "income" ? "รายรับ" : "รายจ่าย"}
                </IonCol>
                <IonCol className="expense-text">{item.note}</IonCol>
                <IonCol className="edit-col">
                  <IonButton
                    size="small"
                    fill="outline"
                    className="edit-btn"
                    onClick={() => history.push(`/edit/${item.id}`)}
                  >
                    แก้ไข
                  </IonButton>
                </IonCol>
              </IonRow>
            ))}
          </IonGrid>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AllExpenses;
