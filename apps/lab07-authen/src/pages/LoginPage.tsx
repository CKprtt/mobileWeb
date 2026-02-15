import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonText,
} from "@ionic/react";

import { useState } from "react";
import { useHistory } from "react-router-dom";
import { authService } from "../auth/auth-service";

const LoginPage: React.FC = () => {
  const history = useHistory();

  const [mode, setMode] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [verificationId, setVerificationId] = useState<string | null>(null);
  const [otp, setOtp] = useState("");

  const [error, setError] = useState<string | null>(null);

  const goHome = () => history.replace("/tab1");

  const handleEmailLogin = async () => {
    try {
      await authService.loginWithEmailPassword({ email, password });
      goHome();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await authService.loginWithGoogle();
      goHome();
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handlePhoneStart = async () => {
    try {
      const result = await authService.startPhoneLogin({
        phoneNumberE164: phone,
      });
      setVerificationId(result.verificationId);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleConfirmOtp = async () => {
    try {
      if (!verificationId) return;
      await authService.confirmPhoneCode({
        verificationId,
        verificationCode: otp,
      });
      goHome();
    } catch (e: any) {
      setError(e.message);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">

        <IonSegment
          value={mode}
          onIonChange={(e) =>
            setMode(e.detail.value as "email" | "phone")
          }
        >
          <IonSegmentButton value="email">
            <IonLabel>Email</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="phone">
            <IonLabel>Phone</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {mode === "email" && (
          <>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                value={email}
                onIonChange={(e) => setEmail(e.detail.value ?? "")}
              />
            </IonItem>

            <IonItem>
              <IonLabel position="stacked">Password</IonLabel>
              <IonInput
                type="password"
                value={password}
                onIonChange={(e) => setPassword(e.detail.value ?? "")}
              />
            </IonItem>

            <IonButton expand="block" onClick={handleEmailLogin}>
              Login Email/Password
            </IonButton>

            <IonButton expand="block" fill="outline" onClick={handleGoogleLogin}>
              Login Google
            </IonButton>
          </>
        )}

        {mode === "phone" && (
          <>
            {!verificationId ? (
              <>
                <IonItem>
                  <IonLabel position="stacked">Phone (+66xxxx)</IonLabel>
                  <IonInput
                    value={phone}
                    onIonChange={(e) => setPhone(e.detail.value ?? "")}
                  />
                </IonItem>

                <IonButton expand="block" onClick={handlePhoneStart}>
                  Login by Phone
                </IonButton>

                <div id="recaptcha-container"></div>
              </>
            ) : (
              <>
                <IonItem>
                  <IonLabel position="stacked">OTP</IonLabel>
                  <IonInput
                    value={otp}
                    onIonChange={(e) => setOtp(e.detail.value ?? "")}
                  />
                </IonItem>

                <IonButton expand="block" onClick={handleConfirmOtp}>
                  Confirm OTP
                </IonButton>
              </>
            )}
          </>
        )}

        {error && (
          <IonText color="danger">
            <p>{error}</p>
          </IonText>
        )}
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;