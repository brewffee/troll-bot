import { Message } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { ArgumentType, TrollCommand } from '../TrollCommand';
import { TrollEvent } from '../TrollEvent';

export const MessageEvent = new TrollEvent(client, {
  name: 'MessageEvent',
  description: 'Emitted when there\'s a message, duh.',
  type: 'messageCreate',
  run: async (client: TrollClient, message: Message) => {
    if (message.author.bot || !message.member || message.system) return;
    // REACTIONS
    if (/(((da+y) of )?(bi+r+(th?|f)))|((bi+r+(th?|f))(-| )?)|(ca+ke+\9?)|b(-| )?da+y/gi.test(message.content)) {
      message.react(client.config.cake);
    }
    Math.floor(Math.random() * 10) === 1
      ? message.react(client.config.reddit[Math.floor(Math.random() * 4)])
      : null
    // XP
    client.emit('messageXP', message);
    // RESPONDER
    if (!message.content.endsWith(client.config.suffix))
      return client.emit('responder', message);
    // COMMANDS
    const data = message.content.replace(client.config.suffix, '').trim().split(/ +/g);
    const [args, flags] = data.slice(1).reduce(
      ([args, flags], argument) => {
        const match = /^(--?)([\w\d]+)(?:=(.+))?$/.exec(argument);
        if (match) flags?.set(match[2].toLowerCase(), match[3] || true);
        else args.push(argument);
        return [args, flags];
      },
      [new Array(), new Map()]
    );
    const commandName = data[0].toLowerCase();
    const command = client.commands.get(commandName) ?? client.commands.find(({ info: { aliases } }) => !!aliases?.includes(commandName));
    /*console.log({
      args: args,
      commandName: commandName,
      isCommand: Boolean(command),
      flags: flags,
    });*/

    if (!command) return;
    // define a variable from the command's return value and create a logger later :)
    // finally making SOME use of Result type LOL
    const resolved = await Promise.all(resolveArguments(args, command, message));
    command.isAuthorized(message) ? console.log(await command.run(message, resolved, flags)) : message.channel.send('you cant do that buddy');
  },
});

const resolveArguments = (args: string[], command: TrollCommand, message: Message): Promise<ArgumentType>[] => {
  return args.map(async (argument: string, index) => {
    const argumentType = command.info.arguments![index]?.type;
    if (!argumentType) return null;
    switch (argumentType) {
      case 'STRING': {
        return argument;
      }
      case 'NUMBER': {
        return Math.round(Number(argument)) || null;
      }
      case 'CHANNEL': {
        const mention = argument.match(/^<#(\d{17,18})>$/)?.[1] as string;
        const id = argument.match(/\d{17,18}/)?.[0] as string;
        return message.guild?.channels.cache.get(mention ?? id) ?? message.guild?.channels.cache.find(({ name }) => name.toLowerCase() === argument.toLowerCase()) ?? null;
      }
      case 'ROLE': {
        const mention = argument.match(/^<@&(\d{17,18})>$/)?.[1] as string;
        const id = argument.match(/\d{17,18}/)?.[0] as string;
        return message.guild?.roles.cache.get(mention ?? id) ?? message.guild?.channels.cache.find(({ name }) => name.toLowerCase() === argument.toLowerCase()) ?? null;
      }
      case 'MEMBER':
      case 'USER': {
        const mention = argument.match(/^<@!?(\d{17,18})>$/)?.[1];
        const id = argument.match(/\d{17,18}/)?.[0];
        const memberOrUser =
          mention || id
            ? argumentType === 'USER'
              ? message.client.users.fetch((mention ?? id)!)
              : message.guild.members.fetch((mention ?? id)!)
            : message.guild.members
              .fetch({ query: argument, limit: 1 })
              .then((members) => {
                const member = members.first();
                if (!member) return null;
                if (argumentType === 'USER') return member?.user;
                return member;
              })
              .catch(() => null);
        return memberOrUser;
      }
    }
  });
};
