
import { GuildMember, TextChannel } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';
import { UserData } from '../models/User';

export const MemberUpdateEvent = new TrollEvent(client, {
  name: 'MemberUpdateEvent',
  description: 'checks the rules stuff',
  type: 'guildMemberUpdate',
  run: async (client: TrollClient, oldMember: GuildMember, newMember: GuildMember) => {
    if (oldMember.pending && !newMember.pending) {
      newMember.roles.add(client.config.memberRole);
      (client.channels.cache.get(client.config.general) as TextChannel).send(`${newMember}, you have been trolled !!!11!!11111!1`);

      // create db entry
      await new UserData({
        id: newMember.user.id,
        xp: 0,
        balance: 0,
        lastEarned: 0,
        lastGamble: 0,
        lastDaily: 0,
      }).save();
    }
  },
});
