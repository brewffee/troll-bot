import { MessageEmbed, MessageReaction, TextChannel, User } from 'discord.js';
import { client, type TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { starboard } from '../models/Starboard';

export const ReactionStarboard = new TrollEvent(client, {
  name: 'ReactionStarboard',
  description: 'add messages to a starboard if it reaches a certain amount of star reactions',
  type: 'messageReactionAdd',
  run: async (client: TrollClient, reaction: MessageReaction, user: User) => {
    const reactionCount = reaction.users.cache.has(reaction.message.author.id) ? reaction.count - 1 : reaction.count;
    if (reaction.emoji.name != '⭐' || reactionCount != 3 || reaction.message.channel.id == '970366685771079810') return;
    const starboardMessage = await starboard.findOne({ message_id: reaction.message.id });

    if (starboardMessage) return; // already in the starboard
    
    const starboardChannel = client.channels.cache.get('970366685771079810') as TextChannel;
    let description = reaction.message.content.length > 1024 ? reaction.message.content.substring(0, 1021) + '...' : reaction.message.content;
    if (reaction.message.stickers.size > 0) description += `\n*contains sticker*`; 
    const embed = new MessageEmbed()
      .setAuthor({ name: reaction.message.author.tag, iconURL: reaction.message.author.displayAvatarURL() })
      .setDescription(`${description}\n\n[Jump to message](${reaction.message.url})`)
      .setColor('#ffd700')
      .setFooter({ text: `#${(reaction.message.channel as TextChannel).name}` })
      .setTimestamp(reaction.message.createdTimestamp);

    const firstAttachment = reaction.message.attachments.first();
    if (firstAttachment?.proxyURL.endsWith('.png') || firstAttachment?.proxyURL.endsWith('.gif')) embed.setImage(reaction.message.attachments.first()!.proxyURL);
    else if (firstAttachment?.proxyURL.endsWith('.mp4')) embed.setDescription(`${embed.description}\n\n*contains video*`);

    return starboardChannel.send({ embeds: [embed] })
      .then(async () => await starboard.create({ message_id: reaction.message.id }));
  },
});
