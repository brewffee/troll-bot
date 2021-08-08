import { BufferResolvable, ChannelResolvable, Client, Collection } from 'discord.js';
import { readdir } from 'fs';
import { TrollCommand } from './TrollCommand';
import { TrollEvent } from './TrollEvent';

interface TrollConfig {
  suffix: string;
  reddit: string[];
  iconChannel: ChannelResolvable;
  responses: Array<[RegExp, string, BufferResolvable | null]>;
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
client.load({ 
  suffix: '<:troll:841760436042203138>',
  reddit: [  
    '<:rsilver:843164309735735316>',
    '<:rgold:843160855234215968>',
    '<:rplat:843164215786340442>',
    '<:wholesome:843164215346069546>'
  ],
  iconChannel: '841159137781874698',
  responses: [
    [/\b(y((o+u'?r+e?)|(o+|e|a))( are)? m((o+ther+)|(o+|u)m)(m+y+)?)/gi, 'i am doing your mother', 'https://pbs.twimg.com/media/E0qYJZLWYAE6_7C.png'],
    [/\bbu+s{2,}y+/gi, 'hnng <:cum:841142405846925312>', null],
    [/\bto+p+/gi, '*bottom', null],
    [/🥺|https:\/\/discord\.com\/assets\/6bca769662f755d33514d1f5304c617d\.svg/gi, 'what the fuck is "🥺" i dont speak bottom', null],
    [/\b((amo+n?g+)|s+u+(s+|ß+)|impost|vent|pretender|cre+wma+te|medbay|electrical)/gi, 'SUSSY!', 'https://geixcowo.ga/amogsus.png']
  ]
});
