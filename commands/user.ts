import { Message, MessageEmbed, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { getStats, getEcoStats, getLevels } from '../util/dbUtil';

export const UserCommand = new TrollCommand(client, {
  name: 'user',
  description: 'check out people\'s stuff',
  arguments: [{ name: 'User', type: 'USER', required: false }],
  async run(message: Message, args: [User]) {
    try {
      const user = (args[0] || message.author);
      const member = await message.guild.members.fetch(user.id);

      if (!member) {
        message.channel.send('if they\'re not in this server then idgaf');
        return;
      } else if (member.user.bot) {
        message.channel.send('no bots (for now)');
        return;
      } else if (!await getStats(user.id)) {
        message.channel.send('their profile deadass dont exist yet');
        return;
      }

      // debug above later ???


      const stats = await getStats(user.id);
      const eco = await getEcoStats(user.id);

      const { reddit } = client.config;
      const award = (x: number) => x === 1 ? `${reddit[2]} ` : x === 2 ? `${reddit[1]} ` : x === 3 ? `${reddit[0]} ` : '';

      // if they joined before december 9th, 2021, they're an og member
      const og = member.joinedTimestamp < 1639040000000;


      const profileEmbed = new MessageEmbed({ 
        title: `${user.username}'s profile`,
        thumbnail: { url: user.displayAvatarURL() },
        fields: [
          { name: 'XP', value: `${stats.xp}`, inline: true },
          { name: 'Level', value: `${getLevels(stats.xp).value} (${getLevels(stats.xp).progression}%)`, inline: true },
          { name: 'Balance', value: `${client.config.coin} ${eco.balance}`, inline: true },
          { name: 'Ranks', value: `${og ? reddit[2] + ' **OG MEMBER**\n\n' : '' }${award(stats.place)}#${stats.place} (xp), ${award(eco.place)}#${eco.place} (eco)`, inline: true },
          { name: 'Roles', value: `${member?.roles.cache.filter(r => ![message.guild.id, '841295461486428200'].includes(r.id)).sort((a, b) => b.position - a.position).map(r => r.toString()).join(', ')}`, inline: true },

          { name: 'Joined', value: `<t:${Math.trunc(member.joinedAt as any / 1000)}:R>`, inline: true },
        ],
      })

      message.channel.send({ embeds: [profileEmbed] });

    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member!.user.username} ran command "${(this as any).info.name}"` };
    }
  },
});
