import { Motion } from "@capacitor/motion";
import type { AccelSample } from "./types";


export class MotionService {
  private remove?: () => Promise<void>;


  async start(cb: (s: AccelSample) => void): Promise<void> {
    if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceMotionEvent as any).requestPermission();
        if (permission !== 'granted') {
          alert("กรุณากด 'อนุญาต' (Allow) เพื่อให้แอปนับรอบได้");
          return;
        }
      } catch (error) {
        console.error("iOS Permission Error:", error);
      }
    }


    const listener = await Motion.addListener("accel", (event: any) => {
      const a = event.acceleration;
      if (!a) return;
      cb({
        ax: a.x ?? 0,
        ay: a.y ?? 0,
        az: a.z ?? 0,
        t: Date.now(),
      });
    });


    this.remove = () => listener.remove();
  }


  async stop(): Promise<void> {
    if (this.remove) {
      await this.remove();
      this.remove = undefined;
    }
  }
}
