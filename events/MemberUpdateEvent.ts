
import { GuildMember, TextChannel } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { TrollEvent } from '../TrollEvent';

export const MemberUpdateEvent = new TrollEvent(client, {
  name: 'MemberUpdateEvent',
  description: 'checks the rules stuff',
  type: 'guildMemberUpdate',
  run: async (client: TrollClient, oldMember: GuildMember, newMember: GuildMember) => {
    if (oldMember.pending && !newMember.pending) {
      newMember.roles.add('841295461486428200');
      (client.channels.cache.get('840829257004875789') as TextChannel).send(`${newMember}, you have been trolled !!!11!!11111!1`);
    }
    //console.log([oldMember.pending, newMember.pending]);
  },
});
