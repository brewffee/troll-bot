
import { GuildAuditLogsEntry, GuildMember, TextChannel, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

export const MemberLeaveEvent = new TrollEvent(client, {
  name: 'MemberLeaveEvent',
  description: 'leave messages',
  type: 'guildMemberRemove',
  run: async (client: TrollClient, member: GuildMember) => {
    const channel = client.channels.cache.get('840829257004875789')! as TextChannel;
    setTimeout(async () => {
      const { action, target }: GuildAuditLogsEntry = (await member.guild.fetchAuditLogs()).entries.first()!;
      if ((target as User).id === member.user.id && ['MEMBER_KICK', 'MEMBER_BAN_ADD'].includes(action)) {
        switch (action) {
          case 'MEMBER_BAN_ADD':
            channel.send(`wont be hearing from ${member.user.username} anymore <:troll:841760436042203138>`);
            break;
          case 'MEMBER_KICK':
            channel.send(`${member.user.username} got blasted lmaooo`);
            break;
        }
        return;
      } else {
        if (!member.pending) channel.send(`${member.user.username} left what the fuck man :(`);
      }
    }, 1000);
  },
});
