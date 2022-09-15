import { Message } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { UserData } from '../models/User';

export const MessageXP = new TrollEvent(client, {
  name: 'MessageXP',
  description: 'adds XP based upon user message',
  type: 'messageXP',
  run: async (_client: TrollClient, message: Message) => {
    /*if (message.author.bot) return;
    const user = await UserData.findOne({ id: message.author.id });

    if ((Date.now() - user.lastEarned) / 1000 > 15) return;

    await UserData.findOneAndUpdate(
      { id: message.author.id }, 
      { $inc: { xp: 1 }, lastEarned: Date.now() }
    );
    */
  },
});