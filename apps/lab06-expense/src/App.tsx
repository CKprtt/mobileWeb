import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { statsChart, addCircle, listCircle } from "ionicons/icons";

import AllExpenses from "./pages/AllExpenses";
import Summary from "./pages/Summary";
import AddExpense from "./pages/AddExpense";
import EditExpense from "./pages/EditExpense";

/* Core CSS */
import "@ionic/react/css/core.css";
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/palettes/dark.system.css";

import "./theme/variables.css";

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonTabs>
        {/* ---------------- Routes ---------------- */}
        <IonRouterOutlet>
          <Route exact path="/AllExpenses">
            <AllExpenses />
          </Route>

          <Route exact path="/Summary">
            <Summary />
          </Route>

          {/* หน้าเพิ่มรายรับ–รายจ่าย */}
          <Route exact path="/Add">
            <AddExpense />
          </Route>

          {/* Redirect หน้าแรก */}
          <Route exact path="/">
            <Redirect to="/AllExpenses" />
          </Route>

          {/* หน้าแก้ไข */}
          <Route exact path="/edit/:id">
            <EditExpense />
          </Route>
        </IonRouterOutlet>

        {/* ---------------- Tab Bar ---------------- */}
        <IonTabBar slot="bottom">
          <IonTabButton tab="AllExpenses" href="/AllExpenses">
            <IonIcon icon={listCircle} />
            <IonLabel>รายการ</IonLabel>
          </IonTabButton>

          <IonTabButton tab="Add" href="/Add">
            <IonIcon icon={addCircle} />
            <IonLabel>เพิ่มข้อมูล</IonLabel>
          </IonTabButton>

          <IonTabButton tab="Summary" href="/Summary">
            <IonIcon icon={statsChart} />
            <IonLabel>สรุป</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonTabs>
    </IonReactRouter>
  </IonApp>
);

export default App;
