import { Message, MessageReaction, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import mongoose from 'mongoose';
import { TrollEvent } from '../TrollEvent';
import { xp } from '../xp';

export const ReactionXP = new TrollEvent(client, {
  name: 'ReactionXP',
  description: 'adds xp based upon troll\'s reaction',
  type: 'messageReactionAdd',
  run: async (client: TrollClient, reaction: MessageReaction, user: User) => {
    const isTroll = user === client.user;
    if (!isTroll) return;
    const message = reaction.message as Message;
    const xpEntry = await xp.findOne({ id: message.author.id });
    const reactionValues = {
      rplat: 15,
      rgold: 10,
      rsilver: 5,
      wholesome: 3,
    } as Record<string, number>;

    if (!isTroll && (Date.now() - xpEntry.earnedAt) / 1000 < 30) return; // console.log('already earned in the last 30s!');
    let increment = reactionValues[reaction.emoji.name!] - 1;
    await xp.findOneAndUpdate({ id: message.author.id }, { $set: { xp: (xpEntry.xp ?? 0) + increment } })
  },
});