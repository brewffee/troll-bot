import { GuildAuditLogsEntry, GuildAuditLogsResolvable, GuildMember, TextChannel, User } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { UserData } from '../models/User';

export const MemberLeaveEvent = new TrollEvent(client, {
  name: 'MemberLeaveEvent',
  description: 'leave messages',
  type: 'guildMemberRemove',
  run: async (client: TrollClient, member: GuildMember) => {
    const channel = client.channels.cache.get(client.config.general)! as TextChannel;
    setTimeout(async () => {
      const { action, target } = <GuildAuditLogsEntry<GuildAuditLogsResolvable>>(await member.guild.fetchAuditLogs()).entries.first()!;
      if ((target as User).id === member.user.id && ['MEMBER_KICK', 'MEMBER_BAN_ADD'].includes(action)) {
        switch (action) {
          case 'MEMBER_BAN_ADD':
            channel.send(`wont be hearing from ${member.user.username} anymore ${client.config.troll}`);
            break;
          case 'MEMBER_KICK':
            channel.send(`${member.user.username} got ejected :000`);
            break;
        }
      } else {
        if (!member.pending) channel.send(`${member.user.username} left what the fuck man :(`);
      }
      
      await UserData.findOneAndDelete({ id: member.user.id });      
    }, 1000);
  },
});
