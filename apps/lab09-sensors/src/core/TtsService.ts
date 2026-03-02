import { TextToSpeech } from "@capacitor-community/text-to-speech";

export class TtsService {
  private isSpeaking = false;

  async speak(text: string): Promise<void> {
    if (!text) return;


    try {
      this.isSpeaking = true;


      await TextToSpeech.speak({
        text,
        lang: "th-TH",   
        rate: 1.0,
        pitch: 1.0,
        volume: 1.0,
      });


    } catch (error) {
      console.error("TTS Error:", error);
    } finally {
      this.isSpeaking = false;
    }
  }

  async stop(): Promise<void> {
    try {
      await TextToSpeech.stop();
      this.isSpeaking = false;
    } catch (error) {
      console.error("TTS Stop Error:", error);
    }
  }

  get speaking(): boolean {
    return this.isSpeaking;
  }
}
