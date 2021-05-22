import { Message } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { ArgumentType, TrollCommand } from '../TrollCommand';
import { TrollEvent } from '../TrollEvent';

export const MessageEvent = new TrollEvent(client, {
  name: 'MessageEvent',
  description: 'emj',
  type: 'message',
  run: async (client: TrollClient, message: Message) => {
    if (message.author.bot) return;
    const data = message.content.split(/ +/g);
    if (!data[0].endsWith(client.config.suffix)) return console.log('does not! emit response');
    const [args, flags] = data.slice(1).reduce(
      ([args, flags], argument) => {
        const match = /^(--?)([\w\d]+)(?:=(.+))?$/.exec(argument);
        if (match) flags?.set(match[2].toLowerCase(), match[3] || true);
        else args.push(argument);
        return [args, flags];
      },
      [new Array(), new Map()]
    );
    const commandName = data[0].replace(client.config.suffix, '').toLowerCase();
    const command = client.commands.get(commandName) ?? client.commands.find(({ info: { aliases } }) => !!aliases?.includes(commandName));
    console.log({
      args: args,
      commandName: commandName,
      isCommand: Boolean(command),
      flags: flags,
    });

    if (!command) return;

    const resolved = await Promise.all(resolveArguments(args, command, message));
    command.run(message, resolved, flags);
  },
});

const resolveArguments = (args: string[], command: TrollCommand, message: Message): Promise<ArgumentType>[] => {
  return args.map(async (argument: string, index) => {
    const argumentType = command.info.arguments![index]?.type;
    if (!argumentType) return null;

    if (argumentType === 'STRING') return argument;

    if (argumentType === 'NUMBER') return parseInt(argument) || null;

    if (argumentType === 'CHANNEL') {
      const mention = argument.match(/^<#(\d+)>$/)?.[1] as string;
      const id = argument.match(/\d{17,19}/)?.[0] as string;
      return message.guild?.channels.cache.get(mention ?? id) ?? message.guild?.channels.cache.find(({ name }) => name.toLowerCase() === argument.toLowerCase()) ?? null;
    }

    if (argumentType === 'ROLE') {
      const mention = argument.match(/^<@&(\d+)>$/)?.[1] as string;
      const id = argument.match(/\d{17,19}/)?.[0] as string;
      return message.guild?.roles.cache.get(mention ?? id) ?? message.guild?.channels.cache.find(({ name }) => name.toLowerCase() === argument.toLowerCase()) ?? null;
    }

    if (argumentType === 'MEMBER' || argumentType === 'USER') {
      const mention = argument.match(/^<@!?(\d+)>$/)?.[1] as string;
      const id = argument.match(/\d{17,19}/)?.[0] as string;
      const getMember = () =>
        message.guild?.members
          .fetch(mention ?? id)
          .then((member) => (argumentType === 'USER' ? member.user : member))
          .catch(() =>
            !mention && !id
              ? message.guild?.members
                  .fetch({ query: argument })
                  .then((members) => (argumentType === 'USER' ? members.first()?.user : members.first()))
                  .catch(() => null)
              : null
          );

      return argumentType === 'USER' ? message.client.users.fetch(mention ?? id).catch(getMember) : getMember();
    }
  });
};
