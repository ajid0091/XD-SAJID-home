export interface RelayItem {
  id: number;
  name: string;
  place: 'inside' | 'outside';
  type: 'light' | 'fan' | 'other';
  state: 'ON' | 'OFF';
}

export const INITIAL_RELAYS: Record<number, RelayItem> = {
  1: { id: 1, name: 'Bedroom Light', place: 'inside', type: 'light', state: 'OFF' },
  2: { id: 2, name: 'Bedroom Fan', place: 'inside', type: 'fan', state: 'OFF' },
  3: { id: 3, name: 'Kitchen Light', place: 'inside', type: 'light', state: 'OFF' },
  4: { id: 4, name: 'Living Room Light', place: 'inside', type: 'light', state: 'ON' },
  5: { id: 5, name: 'Bathroom Light', place: 'inside', type: 'light', state: 'OFF' },
  6: { id: 6, name: 'Water Pump', place: 'inside', type: 'other', state: 'OFF' },
  7: { id: 7, name: 'Outdoor Light', place: 'outside', type: 'light', state: 'ON' },
  8: { id: 8, name: 'Spare 1', place: 'inside', type: 'other', state: 'OFF' },
  9: { id: 9, name: 'Room 2 Light', place: 'inside', type: 'light', state: 'OFF' },
  10: { id: 10, name: 'Room 2 Fan', place: 'inside', type: 'fan', state: 'OFF' },
  11: { id: 11, name: 'Dining Light', place: 'inside', type: 'light', state: 'ON' },
  12: { id: 12, name: 'Balcony Light', place: 'outside', type: 'light', state: 'OFF' },
  13: { id: 13, name: 'Garage Light', place: 'outside', type: 'light', state: 'OFF' },
  14: { id: 14, name: 'Exhaust Fan', place: 'inside', type: 'fan', state: 'OFF' },
  15: { id: 15, name: 'Garden Light', place: 'outside', type: 'light', state: 'ON' },
  16: { id: 16, name: 'Spare 2', place: 'inside', type: 'other', state: 'OFF' },
};

export interface ScheduledTask {
  id: number;
  type: 'delayed' | 'toggle';
  relays: number[];
  detail: string;
}

export class SmartHomeManager {
  private relays: Record<number, RelayItem>;
  private tasks: Map<number, { timer: NodeJS.Timeout | number; task: ScheduledTask }> = new Map();
  private nextTaskId = 1;
  private onStateChange?: (relays: Record<number, RelayItem>, tasks: ScheduledTask[]) => void;
  private isConnected = true;

  constructor(listener?: (relays: Record<number, RelayItem>, tasks: ScheduledTask[]) => void) {
    this.relays = { ...INITIAL_RELAYS };
    this.onStateChange = listener;
  }

  public setListener(listener: (relays: Record<number, RelayItem>, tasks: ScheduledTask[]) => void) {
    this.onStateChange = listener;
    this.notify();
  }

  private notify() {
    if (this.onStateChange) {
      const activeTasks = Array.from(this.tasks.values()).map((t) => t.task);
      this.onStateChange({ ...this.relays }, activeTasks);
    }
  }

  public getRelays(): Record<number, RelayItem> {
    return { ...this.relays };
  }

  public setRelay(id: number, state: 'ON' | 'OFF'): boolean {
    if (this.relays[id]) {
      this.relays[id] = { ...this.relays[id], state };
      this.notify();
      return true;
    }
    return false;
  }

  public setBatchRelays(ids: number[], state: 'ON' | 'OFF'): void {
    ids.forEach((id) => {
      if (this.relays[id]) {
        this.relays[id] = { ...this.relays[id], state };
      }
    });
    this.notify();
  }

  public delayedSet(ids: number[], state: 'ON' | 'OFF', delaySeconds: number): number {
    const id = this.nextTaskId++;
    const task: ScheduledTask = {
      id,
      type: 'delayed',
      relays: ids,
      detail: `${delaySeconds}s delay to ${state}`,
    };

    const timer = setTimeout(() => {
      this.setBatchRelays(ids, state);
      this.tasks.delete(id);
      this.notify();
    }, delaySeconds * 1000);

    this.tasks.set(id, { timer, task });
    this.notify();
    return id;
  }

  public toggleRepeat(ids: number[], intervalSeconds: number, toggles = 0): number {
    const id = this.nextTaskId++;
    let count = 0;
    let currentState: 'ON' | 'OFF' = 'ON';

    const task: ScheduledTask = {
      id,
      type: 'toggle',
      relays: ids,
      detail: `Toggle every ${intervalSeconds}s (times: ${toggles === 0 ? 'infinite' : toggles})`,
    };

    this.setBatchRelays(ids, currentState);
    count++;

    const timer = setInterval(() => {
      currentState = currentState === 'ON' ? 'OFF' : 'ON';
      this.setBatchRelays(ids, currentState);
      count++;

      if (toggles > 0 && count >= toggles) {
        clearInterval(timer);
        this.tasks.delete(id);
        this.notify();
      }
    }, intervalSeconds * 1000);

    this.tasks.set(id, { timer, task });
    this.notify();
    return id;
  }

  public cancelSchedules(relayIds?: number[]): void {
    for (const [id, entry] of this.tasks.entries()) {
      if (!relayIds || relayIds.length === 0 || entry.task.relays.some((r) => relayIds.includes(r))) {
        clearTimeout(entry.timer as NodeJS.Timeout);
        clearInterval(entry.timer as NodeJS.Timeout);
        this.tasks.delete(id);
      }
    }
    this.notify();
  }
}
