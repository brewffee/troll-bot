import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';

// Still needed momentarily for migration
import { xp } from '../models/xp';
import { daily } from '../models/DailyCoins';
import { wallet } from '../models/Wallet';
import { cooldown } from '../models/GamblingCooldown';

import { UserData } from '../models/User';

export const MigrateCommand = new TrollCommand(client, {
  name: 'migrate',
  aliases: ['m'],
  description: 'move data from one database to another',
  accessibility: {
    owner: true,
  },
  async run(message: Message, _1, flags: Map<string, string>) {
    try {
      const msg = await message.channel.send('migrating...');
      // for everyone, loop through each model and save it to the new database
      const members = await message.guild.members.fetch();
      for (const member of members.values()) {
        console.log('migrating ', member.user.tag);
        const user = member.user;
        
        const karma = (await xp.findOne({ id: user.id }));
        const coins = (await wallet.findOne({ id: user.id }));
        const lastDaily = (await daily.findOne({ id: user.id }));
        const lastGamble = (await cooldown.findOne({ id: user.id }));

        const data = {
          id: user.id,
          karma: karma?.xp ?? 0,
          coins: coins?.balance ?? 0,
          lastDaily: lastDaily?.collectedAt ?? 0,
          lastGamble: lastGamble?.time ?? 0,
        };

        console.log('data for user: ', data);

        // save to new database
        const newUser = new UserData({
          id: data.id,
          xp: data.karma,
          balance: data.coins,
          lastEarned: 0,
          lastGamble: data.lastGamble,
          lastDaily: data.lastDaily,
        });

        console.log('saving user to new database');

        await newUser.save();

        console.log('saved user to new database');
      }
      msg.edit('done!');
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
