<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title class="ion-text-center">Lab9 | Ionic Sensors</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding content-bg">
      <div v-if="showSummary" class="summary-screen">
        <div class="summary-card">
          <div class="summary-icon">🏆</div>
          <h2 class="summary-title">สรุปผลการออกกำลังกาย</h2>

          <div class="summary-grid">
            <div class="summary-item highlight">
              <div class="summary-label">จำนวนครั้ง (ที่ถูกต้อง)</div>
              <div class="summary-value primary">
                {{ state?.repDisplay ?? 0 }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">ยกพลาด</div>
              <div class="summary-value danger">
                {{ state?.stats.repsBad ?? 0 }}
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">ความเร็วเฉลี่ย</div>
              <div class="summary-value">
                {{ state?.stats.avgRepMs ?? 0 }} ms
              </div>
            </div>
            <div class="summary-item">
              <div class="summary-label">อัตราความแม่นยำ</div>
              <div class="summary-value success">{{ accuracy }}%</div>
            </div>
          </div>

          <ion-button
            expand="block"
            size="large"
            color="primary"
            class="action-btn restart-btn"
            @click="restart"
          >
            ▶ เริ่มใหม่
          </ion-button>
        </div>
      </div>

      <div v-else>
        <ion-card class="stat-card ion-text-center">
          <ion-card-header>
            <ion-card-subtitle>จำนวนครั้ง (ที่ถูกต้อง)</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content class="card-body">
            <div class="display-number count-color">
              {{ state?.repDisplay ?? 0 }}
            </div>
          </ion-card-content>
        </ion-card>

        <div
          v-if="state?.stats.lastMessage"
          class="feedback-badge"
          :class="
            state.stats.lastMessage === 'OK' ? 'bg-success' : 'bg-warning'
          "
        >
          {{ state.stats.lastMessage }}
        </div>

        <ion-grid>
          <ion-row>
            <ion-col size="6">
              <div class="mini-stat">
                <small>ยกพลาด</small>
                <div class="text-danger">{{ state?.stats.repsBad ?? 0 }}</div>
              </div>
            </ion-col>
            <ion-col size="6">
              <div class="mini-stat">
                <small>ความเร็วเฉลี่ย</small>
                <div>{{ state?.stats.avgRepMs ?? 0 }}ms</div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <div class="button-group">
          <ion-button
            v-if="!isRunning"
            expand="block"
            size="large"
            color="success"
            class="action-btn"
            @click="start"
          >
            ▶ เริ่มต้น
          </ion-button>
          <ion-button
            v-if="isRunning"
            expand="block"
            size="large"
            fill="outline"
            color="danger"
            class="action-btn"
            @click="stop"
          >
            ■ หยุด
          </ion-button>
        </div>
      </div>
    </ion-content>

    <ion-footer class="ion-text-center ion-padding footer">
      รหัสนักศึกษา: 673380231-5 นายพีรธัช ผันอากาศ
    </ion-footer>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
} from "@ionic/vue";
import { MotionService } from "../core/MotionService";
import { TtsService } from "../core/TtsService";
import { ArmWorkoutEngine } from "../core/ArmWorkoutEngine";
import type { WorkoutState } from "../core/types";

const state = ref<WorkoutState | null>(null);
const isRunning = ref(false);
const showSummary = ref(false);
const engine = new ArmWorkoutEngine();
const motion = new MotionService();
const tts = new TtsService();

const accuracy = computed(() => {
  const good = state.value?.repDisplay ?? 0;
  const bad = state.value?.stats.repsBad ?? 0;
  const total = good + bad;
  if (total === 0) return 0;
  return Math.round((good / total) * 100);
});

onMounted(() => {
  engine.onChange((s) => {
    state.value = s;
    if (s.stats.lastMessage === "OK") {
      tts.speak(s.repDisplay.toString());
    } else if (
      s.stats.lastMessage &&
      s.stats.lastMessage !== "READY" &&
      s.stats.lastMessage !== "OK"
    ) {
      tts.speak(s.stats.lastMessage);
    }
  });
});

async function start() {
  try {
    await motion.start((s) => engine.process(s));

    await tts.speak("เริ่มกายบริหารแขน");
    engine.start();
    isRunning.value = true;
    showSummary.value = false;
  } catch (error) {
    console.error("Start Error:", error);
    alert(
      "ไม่สามารถเข้าถึงเซนเซอร์ได้ กรุณาลองใหม่อีกครั้ง หรือเช็กการตั้งค่า Safari",
    );
  }
}

async function stop() {
  await motion.stop();
  engine.stop();
  await tts.speak("หยุดการทำงาน");
  isRunning.value = false;
  showSummary.value = true;
}

function restart() {
  showSummary.value = false;
}
</script>

<style scoped>
.content-bg {
  --background: #f0f6ff;
}

.stat-card {
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(59, 130, 246, 0.12);
  margin-bottom: 14px;
  background: white;
  border: 1.5px solid #e0eeff;
}
.card-body {
  height: 130px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.display-number {
  font-size: 72px;
  font-weight: 900;
  letter-spacing: -2px;
}
.count-color {
  color: #2563eb;
}

.feedback-badge {
  text-align: center;
  padding: 10px 16px;
  margin: 0 4px 14px;
  border-radius: 14px;
  color: white;
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.5px;
}
.bg-success {
  background: linear-gradient(135deg, #10b981, #059669);
}
.bg-warning {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.mini-stat {
  background: white;
  padding: 14px 10px;
  border-radius: 18px;
  text-align: center;
  border: 1.5px solid #dbeafe;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.07);
}
.mini-stat small {
  color: #64748b;
  font-size: 12px;
}
.mini-stat div {
  font-size: 22px;
  font-weight: 800;
  color: #1e40af;
  margin-top: 4px;
}
.text-danger {
  color: #ef4444 !important;
}

.button-group {
  margin-top: 10px;
}
.action-btn {
  height: 60px;
  font-weight: 800;
  font-size: 16px;
  --border-radius: 18px;
  margin-top: 10px;
  letter-spacing: 0.5px;
}

.summary-screen {
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 10px;
}
.summary-card {
  background: white;
  border-radius: 28px;
  padding: 30px 24px 24px;
  width: 100%;
  box-shadow: 0 12px 40px rgba(37, 99, 235, 0.13);
  border: 1.5px solid #dbeafe;
  text-align: center;
}
.summary-icon {
  font-size: 52px;
  margin-bottom: 8px;
}
.summary-title {
  font-size: 20px;
  font-weight: 800;
  color: #1e3a8a;
  margin: 0 0 24px;
  letter-spacing: -0.3px;
}
.summary-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 24px;
}
.summary-item {
  background: #f0f6ff;
  border-radius: 16px;
  padding: 16px 10px;
  border: 1.5px solid #dbeafe;
}
.summary-item.highlight {
  grid-column: 1 / -1;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  border-color: #93c5fd;
}
.summary-label {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 6px;
}
.summary-value {
  font-size: 32px;
  font-weight: 900;
  color: #1e40af;
  letter-spacing: -1px;
}
.summary-item.highlight .summary-value {
  font-size: 52px;
}
.summary-value.danger {
  color: #ef4444;
  font-size: 28px;
}
.summary-value.success {
  color: #10b981;
  font-size: 28px;
}
.restart-btn {
  height: 60px;
  font-weight: 800;
  --border-radius: 18px;
}

.footer {
  font-size: 13px;
  color: #94a3b8;
}
</style>
