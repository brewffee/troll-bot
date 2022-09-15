import { Message, MessageReaction, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { UserData } from '../models/User'; 

export const VoteAddEvent = new TrollEvent(client, {
  name: 'VoteEvent',
  description: 'removes/adds xp when voted',
  type: 'voteAdd',
  run: async (_client: TrollClient, reaction: MessageReaction) => {
    if (!['downvote', 'upvote'].includes(reaction.emoji.name)) return;
    const message = reaction.message as Message;
    if (message.author.bot || reaction.users.cache.has(message.author.id)) return;

    await UserData.findOneAndUpdate(
      { id: message.author.id },
      { $inc: { xp: reaction.emoji.name === 'upvote' ? 5 : -100 } },
    );
  },
});