import { TrollClient } from './TrollClient';

interface EventOptions {
  name: string;
  description: string;
  type: string;
  run: Function;
}

export class TrollEvent {
  public info: EventOptions;
  constructor(client: TrollClient, info: EventOptions) {
    Object.defineProperty(this, 'client', { value: client, enumerable: false });
    this.info = info;
  }
}