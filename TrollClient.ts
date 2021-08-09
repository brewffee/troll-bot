import { BufferResolvable, ChannelResolvable, Client, Collection, Snowflake } from 'discord.js';
import { readdir } from 'fs';
import { TrollCommand } from './TrollCommand';
import { TrollEvent } from './TrollEvent';

interface TrollConfig {
  troll: string;
  suffix: string;
  reddit: string[]; // enable feature disabling later :P
  iconChannel: ChannelResolvable;
  general: Snowflake;
  responses: Array<[RegExp, string, BufferResolvable | null]>;
  botRole: Snowflake;
  memberRole: Snowflake;
  adminRole: Snowflake;
  modRole: Snowflake;
}

export class TrollClient extends Client {
  public commands = new Collection<string, TrollCommand>();
  public load: Function;
  public config!: TrollConfig;
  constructor() {
    super({ intents: 3655 });
    this.load = (config: TrollConfig) => {
      this.config = config;
      readdir(`./out/commands`, (err, files) => {
        if (err) throw err;
        files.filter((f) => f.endsWith('.js')).forEach((file) => {
          const command = Object.values(require(`./commands/${file}`))[0] as TrollCommand;
          this.commands.set(command.info.name, command);
        });
      });
      readdir('./out/events', (err, files) => {
        if (err) throw err;
        files.filter((f) => f.endsWith('.js')).forEach((file) => {
          const event = Object.values(require(`./events/${file}`))[0] as TrollEvent;
          this.on(event.info.type, event.info.run.bind(null, this));
        });
      });
      this.login();
    };
  }
}

export const client = new TrollClient();

client.load({ // create a separate config.js for this later
  troll: '<:troll:841760436042203138>',
  suffix: '<:troll:841760436042203138>',
  reddit: [
    '<:rsilver:843164309735735316>',
    '<:rgold:843160855234215968>',
    '<:rplat:843164215786340442>',
    '<:wholesome:843164215346069546>'
  ],
  iconChannel: '841159137781874698',
  general: '840829257004875789',
  responses: [
    [/\b(y((o+u'?r+e?)|(o+|e|a))( are)? m((o+ther+)|(o+|u)m)(m+y+)?)/gi, 'i am doing your mother', './images/mother.png'],
    [/\bbu+s{2,}y+/gi, 'hnng <:cum:841142405846925312>'],
    [/\bto+p+/gi, '*bottom'],
    [/🥺|https:\/\/discord\.com\/assets\/6bca769662f755d33514d1f5304c617d\.svg/gi, 'what the fuck is "🥺" i dont speak bottom'],
    [/\b((amo+n?g+)|s+u+(s+|ß+)|impost|vent|pretender|cre+wma+te|medbay|electrical)/gi, 'SUSSY!', './images/amogsus.png']
  ],
  botRole: '841267799787438090',
  memberRole: '841295461486428200',
  adminRole: '842802299675213824',
  modRole: '842802567499219005',
});