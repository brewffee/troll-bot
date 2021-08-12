import { Message, MessageReaction, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { xp } from '../xp';

export const DownvoteEvent = new TrollEvent(client, {
  name: 'DownvoteEvent',
  description: 'removes xp when downvoted',
  type: 'downvote',
  run: async (client: TrollClient, reaction: MessageReaction) => {
    const message = reaction.message as Message;
    const xpEntry = await xp.findOne({ id: message.author.id });
    
    if (xpEntry) {
      await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp - 1 } })
    } else {
      await (new xp({ id: message.author.id, xp: -1 })).save()
    }
  },
});