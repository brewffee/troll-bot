import { Message } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { xp } from '../models/xp';

export const MessageXP = new TrollEvent(client, {
  name: 'MessageXP',
  description: 'adds XP based upon user message',
  type: 'messageXP',
  run: async (_client: TrollClient, message: Message) => {
    if (message.author.bot) return;
    const xpEntry = await xp.findOne({ id: message.author.id });

    if (xpEntry) {
      if ((Date.now() - xpEntry.earnedAt) / 1000 < 30) return; //console.log('already earned in the last 30s!');
      console.log('giving manually earned xp ' + JSON.stringify({ $set: { xp: xpEntry.xp + 1, earnedAt: Date.now() } }) + ` xpEntry.xp: ${xpEntry.xp}`);
      await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp + 1, earnedAt: Date.now() } })
    } else {
      await (new xp({ id: message.author.id, xp: 1 })).save()
    }
  },
});