import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { Capacitor } from "@capacitor/core";

export class HapticsService {
  async success() {
    if (Capacitor.getPlatform() === "ios") {
      await Haptics.impact({ style: ImpactStyle.Medium });
    } else {
      await Haptics.notification({ type: NotificationType.Success });
    }
  }

  async warning() {
    if (Capacitor.getPlatform() === "ios") {
      await Haptics.impact({ style: ImpactStyle.Heavy });
    } else {
      await Haptics.notification({ type: NotificationType.Warning });
    }
  }
}