import { useEffect, useState } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonAvatar
} from "@ionic/react";

import { authService } from "../auth/auth-service";
import type { AuthUser } from "../auth/auth-interface";
import { useHistory } from "react-router-dom";

const Tab1: React.FC = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const history = useHistory();

  useEffect(() => {
    const loadUser = async () => {
      const u = await authService.getCurrentUser();
      setUser(u);
    };
    loadUser();
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    history.replace("/login");
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>หน้าหลัก</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        {user && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>ข้อมูลผู้ใช้งาน</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>

              {user.photoUrl && (
                <IonAvatar style={{ marginBottom: "10px" }}>
                  <img src={user.photoUrl} alt="profile" />
                </IonAvatar>
              )}

              <p><strong>UID:</strong> {user.uid}</p>
              {user.email && <p><strong>Email:</strong> {user.email}</p>}
              {user.phoneNumber && <p><strong>Phone:</strong> {user.phoneNumber}</p>}
              {user.displayName && <p><strong>Name:</strong> {user.displayName}</p>}

              <IonButton expand="block" color="danger" onClick={handleLogout}>
                Logout
              </IonButton>

            </IonCardContent>
          </IonCard>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Tab1;