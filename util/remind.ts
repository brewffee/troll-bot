import { TextChannel } from 'discord.js';
import { Reminder } from '../models/Reminder';
import { client } from '../TrollClient';

// Populate the client.reminders map with all reminders from the database
export const loadReminders = async () => {
  Reminder.find({}).then((items) => {
    for (const i of items) {
      client.reminders.set(i.id, i);
    }
  });
};

// Check the client.reminders map every second and send reminders
export const checkReminders = async () => {
  return setInterval(() => {
    for (const { id, reminder, time, direct } of client.reminders.values()) {
      if (time <= Date.now()) {
        // if the reminder is too late, express that (todo)
        let offset = Date.now() - time,
          isLate = offset > 300000;

        if (direct) {
          client.users.fetch(id).then((user) => {
            user.send(reminder); // format (todo)
          });
        } else {
          client.channels.fetch(id).then((channel) => {
            (channel as TextChannel).send(reminder); // format (todo)
          });
        }

        // delete the reminder from the db and client.reminders
        client.reminders.delete(id);
        Reminder.deleteOne({ id }, (err) => {
          if (err) throw err;
        });
      }
    }
  }, 1000);
}