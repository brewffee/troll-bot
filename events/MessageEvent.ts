import { Message } from 'discord.js';
import { client, TrollClient } from '../TrollClient';
import { ArgumentType, TrollCommand } from '../TrollCommand';
import { TrollEvent } from '../TrollEvent';

export const MessageEvent = new TrollEvent(client, {
  name: 'MessageEvent',
  description: 'Emitted when there\'s a message, duh.',
  type: 'messageCreate',
  run: async (client: TrollClient, message: Message) => {
    // Ignore messages from bots and system messages
    // TODO: start accepting dm messages, requires some reworking
    if (message.author.bot || !message.member || message.system) return;

    // REACTIONS
    // TODO: move to config 
    if (/(toledo)|(csh)|(car seat headrest)/gi.test(message.content))
      message.react('<:downvote:875415662489653289>');
    if (/(((da+y) of )?(bi+r+(th?|f)))|((bi+r+(th?|f))(-| )?)|(ca+ke+\9?)|b(-| )?da+y/gi.test(message.content))
      message.react(client.config.cake);

    // TODO: move reaction chance to config
    // TODO: don't rely on reddit, name the config key something else
    Math.floor(Math.random() * 10) === 1
      ? message.react(client.config.reddit[Math.floor(Math.random() * 4)])
      : null

    // MESSAGE XP
    client.emit('messageXP', message);

    // RESPONDER
    if (!message.content.endsWith(client.config.suffix))
      return client.emit('responder', message);
      
    // COMMANDS
    // Extract the command, along with its args and flags, from the message content
    // TODO: add prefix support, and ensure 
    const data = message.content.replace(client.config.suffix, '').trim().split(/ +/g);
    const [args, flags] = data.slice(1).reduce(([args, flags], argument) => {
        const match = /^(--?)([\w\d]+)(?:=(.+))?$/.exec(argument);
        if (match) flags?.set(match[2].toLowerCase(), match[3] || true);
        else (args as string[]).push(argument);
        return [args, flags];
      },
      [[], new Map()]
    );

    // Check for the command in the client's Collection and resolve its arguments
    // TODO: resolve flags
    const commandName = data[0].toLowerCase();
    const command = client.commands.get(commandName) ?? client.commands.find(({ info: { aliases } }) => !!aliases?.includes(commandName));
    if (!command || !command.isAuthorized(message)) return;
    const resolved = await Promise.all(resolveArguments(args, command, message));

    // Run the command and report timings/errors
    const start = performance.now();
    command.run(message, resolved, flags).catch(e => console.log(`[${commandName}] Ran erroneously, error shown below:\n${e}`));
    const end = performance.now();
    console.log(`[${commandName}] Ran successfully, took ${end - start} ms`);
  },
});

// Resolves given arguments into usable objects 
const resolveArguments = (args: string[], command: TrollCommand, message: Message): Promise<ArgumentType>[] => {
  return args.map(async (argument: string, index) => {
    const argumentType = command.info.arguments?.[index]?.type ?? false;
    if (!argumentType) return null;
    switch (argumentType) {
      case 'STRING': {
        return argument;
      }
      case 'NUMBER': { // Should we be rounding these ?
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
              : message.guild?.members.fetch((mention ?? id)!)
            : null;
            // Disabling the string search for now as it is looser than I'd prefer
            // Use string comparison later
            /*message.guild?.members
              .fetch({ query: argument, limit: 1 })
              .then((members) => {
                const member = members.first();
                if (!member) return null;
                if (argumentType === 'USER') return member?.user;
                return member;
              })
              .catch(() => null);*/
        return memberOrUser;
      }
    }
  });
};
