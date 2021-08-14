import { Message, MessageReaction, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { xp } from '../models/xp';

export const VoteAddEvent = new TrollEvent(client, {
  name: 'VoteEvent',
  description: 'removes/adds xp when voted',
  type: 'voteAdd',
  run: async (_client: TrollClient, reaction: MessageReaction) => {
    const message = reaction.message as Message;
    if (message.author.bot || reaction.users.cache.has(message.author.id)) return;
    const xpEntry = await xp.findOne({ id: message.author.id });

    const change = reaction.emoji.name === 'upvote' ? 1 : -1;
    if (xpEntry) {
      await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: xpEntry.xp + change } })
    } else {
      await (new xp({ id: message.author.id, xp: change })).save()
    }
  },
});