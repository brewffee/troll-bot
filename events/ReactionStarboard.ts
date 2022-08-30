import { MessageAttachment, MessageReaction, TextChannel, User } from 'discord.js';
import { starboard } from '../models/Starboard';
import { client, type TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

const STAR_REQUIREMENT = 2;

export const ReactionStarboard = new TrollEvent(client, {
  name: 'ReactionStarboard',
  description: 'add messages to a starboard if it reaches a certain amount of star reactions',
  type: 'messageReactionAdd',
  run: async (client: TrollClient, messageReaction: MessageReaction, user: User) => {

    const reaction = await messageReaction.fetch();
    const message = await reaction.message.fetch();
  
    const reactionUserCache = await reaction.users.fetch();
    const reactionCount = reactionUserCache.has(message.author.id) ? reaction.count - 1 : reaction.count;

    if (reaction.emoji.name != '⭐' || reactionCount < STAR_REQUIREMENT || message.channel.id == '970366685771079810') return;

    // check if the message is already in the starboard
    const starboardMessageData = await starboard.findOne({ message_id: message.id });
    console.log ('starboardMessageData', starboardMessageData);

    // define shit to make it look nicer lul
    const starboardChannel = client.channels.cache.get('970366685771079810') as TextChannel;
    const starCount = `**${reactionCount}**⭐ `;
    const channelName = `${message.channel as TextChannel} `;
    const displayName = message.member.nickname ? `**${message.member.nickname}** (${message.author.tag})` : `**${message.author.tag}**`;

    if (starboardMessageData) { // already in the starboard
      if (reactionCount <= starboardMessageData.star_count) return;
      const starboardMessage = await starboardChannel.messages.fetch(starboardMessageData.starboard_message_id);
      return starboardMessage.edit({ content: starCount + channelName + displayName + '\n' + starboardMessageData.content })
        .then(async () => await starboard.findOneAndUpdate({ message_id: message.id }, { star_count: reactionCount }));
    }

    // trim message content; get first attachment
    let messageContent = message.content.length > 1024 ? message.content.substring(0, 1021) + '...' : message.content;
    const files = message.attachments.size > 0 ? [message.attachments.first()] : undefined;

    // handle overflow files
    const fileCount = message.attachments.size;    
    if (fileCount > 1) {
        messageContent += '\n*+' + (fileCount - 1) + ' file' + (fileCount > 2 ? 's' : '') + '*';
    }

    // handle added stickers (filter out JSON stickers)
    const sticker = message.stickers.first();
    if (sticker) { 
        // check if sticker url ends in JSON or PNG
        if (sticker.url.endsWith('.png')) {
            files.push(new MessageAttachment(sticker.url));
        } else {
            messageContent += '* and 1 sticker*';
        }
    }

    // get message embeds for copying
    // const embeds = message.embeds;
 
    // constuct everything, send message and the files
    return starboardChannel.send({ content: starCount + channelName + displayName + '\n' + messageContent, files, allowedMentions: { users: [] } })
      .then(async (starboardMessage) => await starboard.create(
        { message_id: message.id, starboard_message_id: starboardMessage.id, content: messageContent, star_count: reactionCount }
      ));
  },
});
