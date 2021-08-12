import { Message, MessageReaction, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { xp } from '../xp';

export const DownvoteRetract = new TrollEvent(client, {
  name: 'DownvoteRetract',
  description: 'gives back xp when downvote is removed',
  type: 'messageReactionRemove',
  run: async (client: TrollClient, reaction: MessageReaction) => {
    if (reaction.emoji.name !== 'downvote') return;
    const message = reaction.message as Message;
    const xpEntry = await xp.findOne({ id: message.author.id });

    if (xpEntry) {
      await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp + 1 } })
    } else {
      await (new xp({ id: message.author.id, xp: 0 })).save()
    }
  },
});