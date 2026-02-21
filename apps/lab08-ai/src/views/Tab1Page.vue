<template>
  <ion-page>
    <ion-content class="ai-bg">
      <div class="ai-header">
        <img class="ai-logo" src="./gemini.png" alt="AI Bot" />
        <h1 class="ai-title">Lab08: Gemini Vision</h1>
        <p class="ai-sub">By Peerathat</p>
      </div>

      <input
        ref="fileEl"
        type="file"
        accept="image/*"
        hidden
        @change="onFileChange"
      />

      <div class="btn-wrap">
        <ion-button expand="block" @click="fileEl?.click()"
          >เลือกไฟล์ภาพ</ion-button
        >
        <ion-button expand="block" color="secondary" @click="onTakePhoto"
          >ถ่ายภาพ</ion-button
        >
      </div>

      <ion-img v-if="previewUrl" :src="previewUrl" class="preview fade-in" />

      <ion-button
        expand="block"
        class="analyze-btn"
        :disabled="!img || loading"
        @click="onAnalyze"
      >
        วิเคราะห์ภาพด้วย AI
      </ion-button>

      <div v-if="loading" class="ai-loading">
        <div class="ring"></div>
        <p>กำลังวิเคราะห์...</p>
      </div>

      <transition name="anime">
        <div v-if="result" class="result-card">
          <h2>ผลลัพธ์ AI</h2>

          <p><strong>คำบรรยาย:</strong> {{ result.caption }}</p>

          <p><strong>แท็ก:</strong></p>
          <ul>
            <li v-for="(t, i) in result.tags" :key="i">{{ t }}</li>
          </ul>

          <p v-if="result.objects"><strong>วัตถุที่พบ:</strong></p>
          <ul v-if="result.objects">
            <li v-for="(o, i) in result.objects" :key="i">
              {{ o.name }}
            </li>
          </ul>

          <p><strong>ความปลอดภัย:</strong></p>
          <p>{{ result.safety?.isSensitive ? "⚠ อ่อนไหว" : "ปลอดภัย" }}</p>
        </div>
      </transition>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";
import { PhotoService } from "../core/photo.service";
import { GeminiVisionService } from "../core/gemini.service";

const fileEl = ref(null);
const img = ref(null);
const previewUrl = ref("");
const result = ref(null);
const loading = ref(false);

const onFileChange = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  img.value = await PhotoService.fromFile(file);
  previewUrl.value = URL.createObjectURL(file);
};

const onTakePhoto = async () => {
  loading.value = true;
  const p = await PhotoService.fromCamera();
  img.value = p;
  previewUrl.value = `data:${p.mimeType};base64,${p.base64}`;
  loading.value = false;
};

const onAnalyze = async () => {
  loading.value = true;
  result.value = await GeminiVisionService.analyze(img.value);
  loading.value = false;
};
</script>

<style scoped>

.ai-bg {
  --ion-background-color: #050b18;
  background: radial-gradient(circle at top, #0e1d3a 0%, #050b18 60%);
  color: white;
  padding: 20px;
  min-height: 100vh;
  position: relative;
}

.ai-bg::before {
  content: "";
  position: absolute;
  inset: 0;
  opacity: 0.25;
  animation: starMove 25s linear infinite;
}
@keyframes starMove {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(-300px);
  }
}

.ai-header {
  text-align: center;
  margin-bottom: 20px;
}
.ai-logo {
  width: 80px;
  filter: drop-shadow(0 0 10px #58afff);
}
.ai-title {
  font-size: 28px;
  font-weight: 700;
  color: #6bc3ff;
  text-shadow: 0 0 16px #3388ff;
}
.ai-sub {
  color: #9cc9ff;
  margin-top: -4px;
}

.btn-wrap {
  display: flex;
  justify-content: center;
  gap: 12px;
}
.analyze-btn {
  margin-top: 12px;
  background: linear-gradient(90deg, #007bff, #00c6ff);
  color: white;
  border-radius: 10px;
  box-shadow: 0 0 12px #1da1ff;
}

.preview {
  border-radius: 14px;
  margin-top: 18px;
  box-shadow: 0 0 20px #339dff77;
}

.fade-in {
  animation: fade 0.6s ease-out;
}
@keyframes fade {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.ai-loading {
  text-align: center;
  margin-top: 20px;
}
.ring {
  width: 80px;
  height: 80px;
  border: 4px solid #1d2f50;
  border-top: 4px solid #4ecbff;
  border-radius: 50%;
  margin: 0 auto 10px;
  animation: spin 1.1s linear infinite;
}
@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}

.result-card {
  color: white;
  margin-top: 20px;
  padding: 16px;
  border-radius: 16px;
  background: rgba(26, 43, 91, 0.4);
  backdrop-filter: blur(10px);
  box-shadow: 0 0 20px #0e98f5aa;
}

.anime-enter-from {
  opacity: 0;
  transform: scale(0.8) rotate(-4deg);
}
.anime-enter-active {
  transition: all 0.4s ease-out;
}
.anime-enter-to {
  opacity: 1;
  transform: scale(1) rotate(0deg);
}
</style>