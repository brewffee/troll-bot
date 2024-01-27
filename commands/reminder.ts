import { Message, User } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { Reminder } from '../models/Reminder';
import ms from 'ms';

export const ReminderCommand = new TrollCommand(client, {
  name: 'remindme',
  aliases: ['remind', 'reminder'],
  description: 'set a reminder for yourself',
  arguments: [ // remindme --dm 2d do the thing
    { name: 'Time', type: 'STRING', required: true },
    { name: 'Message', type: 'STRING', required: true },
  ],
  async run(message: Message, args: [string, string], flags: Map<'dm', string>) {
    const time = args[0], // '2d', '1w', '12h',
      msg = args[1],      // 'do the thing'
      offset = ms(time);  // 172800000

    const rm = new Reminder({
      id: message.author.id,
      reminder: msg,
      time: Date.now() + offset,
      channel: flags.has('dm') ? null : message.channel.id,
      direct: flags.has('dm'),
    });

    await rm.save();

    // add to client.reminders
    client.reminders.set(rm.id, rm);
    message.channel.send(`ok i'll remind you ${msg} in ${ms(offset, { long: true })}`);
  }
});
