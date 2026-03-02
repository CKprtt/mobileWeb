import type { AccelSample, WorkoutState } from "./types";

export class ArmWorkoutEngine {
  private listeners = new Set<(s: WorkoutState) => void>();
  private lastUpTime = 0;
  private lastRepTime = 0;
  private peak = 0;
  private valley = 0;
  private phase: "WAIT_UP" | "WAIT_DOWN" = "WAIT_UP";

  state: WorkoutState = {
    status: "IDLE",
    repDisplay: 0,
    stats: {
      repsTotal: 0,
      repsOk: 0,
      repsBad: 0,
      score: 0,
      avgRepMs: 0,
      lastMessage: '',
    },
  };

  onChange(cb: (s: WorkoutState) => void) {
    this.listeners.add(cb);
    cb(this.clone());
    return () => this.listeners.delete(cb);
  }


  private emit() {
    const snap = this.clone();
    this.listeners.forEach((cb) => cb(snap));
  }


  private clone(): WorkoutState {
    return JSON.parse(JSON.stringify(this.state));
  }

  start() {
    this.state = {
      status: "RUNNING",
      repDisplay: 0,
      stats: {
        repsTotal: 0,
        repsOk: 0,
        repsBad: 0,
        score: 0,
        avgRepMs: 0,
        lastMessage: 'READY',
      },
    };
    this.phase = "WAIT_UP";
    this.peak = 0;
    this.valley = 0;
    this.emit();
  }

  stop() {
    this.state.status = "STOPPED";
    this.emit();
  }

  process(sample: AccelSample) {
    if (this.state.status !== "RUNNING") return;


    const y = sample.ay; 
    const side = Math.abs(sample.ax) + Math.abs(sample.az); 

    const UP_TH = 2.0;     
    const DOWN_TH = -1.5;   
    const MIN_ROM = 3.5;    
    const MIN_MS = 700;     
    const MAX_MS = 4000;   
    const SIDE_TH = 5.0;   

    if (this.phase === "WAIT_UP") {
      this.peak = Math.max(this.peak, y);
      if (y > UP_TH) {
        this.phase = "WAIT_DOWN";
        this.lastUpTime = sample.t;
      }
    }
    else {
      this.valley = Math.min(this.valley, y);


      if (y < DOWN_TH) {
        const currentTime = sample.t;
        const repMs = currentTime - this.lastRepTime;
      
        this.state.stats.repsTotal++;

        const rom = this.peak - this.valley;
        let isOk = true;
        let msg = "OK";

        if (side > SIDE_TH) {
          isOk = false;
          msg = "กรุณายกแนวตั้ง";
        } else if (rom < MIN_ROM) {
          isOk = false;
          msg = "ยกแขนต่ำเกินไป";
        } else if (this.lastRepTime > 0 && repMs < MIN_MS) {
          isOk = false;
          msg = "เร็วเกินไป";
        } else if (this.lastRepTime > 0 && repMs > MAX_MS) {
          isOk = false;
          msg = "ช้าเกินไป";
        }

        if (isOk) {
          this.state.repDisplay++;
          this.state.stats.repsOk++;
          this.state.stats.score += 10; 
         
          if (this.lastRepTime > 0) {
            this.state.stats.avgRepMs = this.state.stats.avgRepMs === 0
              ? repMs
              : Math.round((this.state.stats.avgRepMs + repMs) / 2);
          }
        } else {
          this.state.stats.repsBad++;
        }

        this.state.stats.lastMessage = msg;
        this.lastRepTime = currentTime;
       
        this.phase = "WAIT_UP";
        this.peak = 0;
        this.valley = 0;
        this.emit();
      }
    }
  }
}
