import { Message } from "discord.js";
import { client } from "../TrollClient";
import { TrollCommand } from "../TrollCommand";

export const TestCommand = new TrollCommand(client, {
  names: ['test', 'alias'],
  description: 'Test command',
  argCount: undefined,
  usage: '',
  // permissions: {
  //  client: ['MANAGE_MESSAGES'],
  //  user: ['MANAGE_EMOJIS']
  // },
  // accessibility: {
  //   owner: true
  // },
  run(message: Message) {
    try {
      message.channel.send('<:water:689488678380503041>')
    } catch (error) {
      return { code: 'ERROR', error: error }
    } finally {
      return { code: 'INFO', details: '${user} ran command "${command.constructir}"' }
    }
  }
})
