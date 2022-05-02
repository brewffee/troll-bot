import { MessageAttachment, MessageReaction, TextChannel, User } from 'discord.js';
import { starboard } from '../models/Starboard';
import { client, type TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

const STAR_REQUIREMENT = 2;

export const ReactionStarboard = new TrollEvent(client, {
  name: 'ReactionStarboard',
  description: 'add messages to a starboard if it reaches a certain amount of star reactions',
  type: 'messageReactionAdd',
  run: async (client: TrollClient, reaction: MessageReaction, user: User) => {
    const reactionCount = reaction.users.cache.has(reaction.message.author.id) ? reaction.count - 1 : reaction.count;
    if (reaction.emoji.name != '⭐' || reactionCount < STAR_REQUIREMENT || reaction.message.channel.id == '970366685771079810') return;
    const starboardMessageData = await starboard.findOne({ message_id: reaction.message.id });

    // define shit to make it look nicer lul
    const starboardChannel = client.channels.cache.get('970366685771079810') as TextChannel;
    const starCount = `**${reactionCount}**⭐ `;
    const channelName = `${reaction.message.channel as TextChannel} `;
    const displayName = reaction.message.member.nickname ? `**${reaction.message.member.nickname}** (${reaction.message.author.tag})` : `**${reaction.message.author.tag}**`;

    if (starboardMessageData) { // already in the starboard
      if (reactionCount <= starboardMessageData.star_count) return;
      const starboardMessage = await starboardChannel.messages.fetch(starboardMessageData.starboard_message_id);

      return starboardMessage.edit({ content: starCount + channelName + displayName + '\n' + starboardMessageData.content })
        .then(async () => await starboard.findOneAndUpdate({ message_id: reaction.message.id }, { star_count: reactionCount }));
    }

    // trim message content; get first attachment
    let messageContent = reaction.message.content.length > 1024 ? reaction.message.content.substring(0, 1021) + '...' : reaction.message.content;
    const files = reaction.message.attachments.size > 0 ? [reaction.message.attachments.first()] : undefined;

    // handle overflow files
    const fileCount = reaction.message.attachments.size;    
    if (fileCount > 1) {
        messageContent += '\n*+' + (fileCount - 1) + ' file' + (fileCount > 2 ? 's' : '') + '*';
    }

    // handle added stickers (filter out JSON stickers)
    const sticker = reaction.message.stickers.first();
    if (sticker) { 
        // check if sticker url ends in JSON or PNG
        if (sticker.url.endsWith('.png')) {
            files.push(new MessageAttachment(sticker.url));
        } else {
            messageContent += '* and 1 sticker*';
        }
    }

    // get message embeds for copying
    const embeds = reaction.message.embeds;

    // constuct everything, send message and the files
    return starboardChannel.send({ content: starCount + channelName + displayName + '\n' + messageContent, files, embeds })
      .then(async (message) => await starboard.create({ message_id: reaction.message.id, starboard_message_id: message.id, content: messageContent, star_count: reactionCount }));
  },
});
