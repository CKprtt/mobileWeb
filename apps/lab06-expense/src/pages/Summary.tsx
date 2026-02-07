import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
} from "@ionic/react";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "./Summary.css";

interface Expense {
  id: string;
  title: string;
  amount: number;
  type: string;
  category: string;
}

const Summary: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomeTotal, setIncomeTotal] = useState(0);
  const [expenseTotal, setExpenseTotal] = useState(0);

  useEffect(() => {
    const q = query(collection(db, "expenses"), orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: Expense[] = [];
      let income = 0;
      let expense = 0;

      snapshot.forEach((doc) => {
        const data: any = doc.data();
        items.push({
          id: doc.id,
          title: data.title,
          amount: data.amount,
          type: data.type,
          category: data.category,
        });

        if (data.type === "income") income += data.amount;
        if (data.type === "expense") expense += data.amount;
      });

      setExpenses(items);
      setIncomeTotal(income);
      setExpenseTotal(expense);
    });

    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>รายรับ–รายจ่าย</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding summary-container">
        {/* แสดงสรุปยอด */}
        <div style={{ marginBottom: "20px" }}>
          <h2>สรุปยอดรวม</h2>
          <p>รายรับรวม: {incomeTotal.toLocaleString()} บาท</p>
          <p>รายจ่ายรวม: {expenseTotal.toLocaleString()} บาท</p>
          <hr />
        </div>

        {/* รายการ */}
        <IonList>
          {expenses.map((item) => (
            <IonItem key={item.id}>
              <IonLabel>
                <h2>{item.title}</h2>
                <p>หมวดหมู่: {item.category}</p>
                <p>
                  {item.type === "income"
                    ? `+ ${item.amount} บาท`
                    : `- ${item.amount} บาท`}
                </p>
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Summary;
