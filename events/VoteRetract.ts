import { Message, MessageReaction, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { xp } from '../models/xp';

export const VoteRetractEvent = new TrollEvent(client, {
  name: 'VoteRetract',
  description: 'removes/adds xp when vote is removed',
  type: 'messageReactionRemove',
  run: async (_client: TrollClient, reaction: MessageReaction) => {
    if (!['downvote', 'upvote'].includes(reaction.emoji.name)) return;
    const message = reaction.message as Message;
    if (message.author.bot || reaction.users.cache.has(message.author.id)) return;
    const xpEntry = await xp.findOne({ id: message.author.id });

    const change = reaction.emoji.name === 'upvote' ? -1 : 1;
    if (xpEntry) {
      await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp + change } })
    } else {
      await (new xp({ id: message.author.id, xp: change })).save()
    }
  },
});