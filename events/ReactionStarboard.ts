import { MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import { client, type TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { starboard } from '../models/Starboard';

export const ReactionStarboard = new TrollEvent(client, {
  name: 'ReactionStarboard',
  description: 'add messages to a starboard if it reaches a certain amount of star reactions',
  type: 'messageReactionAdd',
  run: async (client: TrollClient, reaction: MessageReaction, user: User) => {
    if (reaction.emoji.name != '⭐' || reaction.count != 3 || reaction.message.channel.id == '970366685771079810') return;
    const starboardMessage = await starboard.findOne({ message_id: reaction.message.id });

    if (starboardMessage) return; // already in the starboard
    
    const starboardChannel = client.channels.cache.get('970366685771079810') as TextChannel;
    const embed = new MessageEmbed()
      .setTitle(user.tag)
      .setDescription(`${reaction.message.content}\n\n[Jump to message](${reaction.message.url})`)
      .setColor('#ffd700')
      .setFooter({ text: `#${(reaction.message.channel as TextChannel).name}` })
      .setTimestamp(reaction.message.createdTimestamp);

    return starboardChannel.send({ embeds: [embed] })
      .then(async () => await starboard.create({ message_id: reaction.message.id }));
  },
});
