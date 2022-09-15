import { Message, MessageReaction, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { UserData } from '../models/User';

export const ReactionXP = new TrollEvent(client, {
  name: 'ReactionXP',
  description: 'adds xp based upon troll\'s reaction',
  type: 'messageReactionAdd',
  run: async (client: TrollClient, reaction: MessageReaction, user: User) => {
    if (['downvote', 'upvote'].includes(reaction.emoji.name)) return client.emit('voteAdd', reaction);
    const isTroll = user === client.user;
    if (!isTroll || reaction.emoji.name === 'cakeday') return;
    const message = reaction.message as Message;
    const userDB = await UserData.findOne({ id: message.author.id });
    const reactionValues = {
      rplat: 30,
      rgold: 20,
      rsilver: 10,
      wholesome: 6,
    } as Record<string, number>;

    if (!isTroll && (Date.now() - userDB.lastEarned) / 1000 < 15) return; 
    
    let increment = reactionValues[reaction.emoji.name!] - 1;
    await UserData.findOneAndUpdate(
      { id: message.author.id },
      { $inc: { xp: increment }, lastEarned: Date.now() },
    );
  },
});