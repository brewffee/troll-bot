import { Message } from 'discord.js';
import { client } from '../TrollClient';
import { TrollCommand } from '../TrollCommand';
import { wallet } from '../models/Wallet';

export const BegCommand = new TrollCommand(client, {
  name: 'beg',
  description: 'ask for money (L poor)',
  async run(message: Message) {
    try {
      let curWallet = await wallet.findOne({ id: message.author.id });

      // 3/4 chance of success
      let isSuccessful = Math.random() < 0.75;

      let people = [
        'a homeless person',
        'Elon Musk',
        'your mother',
        'your father',
        'Donald Trump',
        'i',
        'Low Tier God',
        'Doge',
        'Ben Shapiro',
        'Mr. Krabs',
        'aw hell naw my boy spunch bop',
        'Jonesy',
        'Eminem',
        'mocha',
        'some guy',
        'the impostor from among us',
        'ma man failes',
        'SkyBlueSeagull',
        'NBA Youngboy',
        'Chris Pratt',
        'CJ',
        'Patrick Bateman',
        'Soulja Boy',
        'Snoop Dogg',
        'sans undertale',
        'Jimmy Neutron',
        'Rick Astley',
        'Ayman',
        'Will Smith',
        'Schlatt',
        'Jambo',
        'Wheels',
        'your oomfie',
        'your mutual',
        'the killer fish from san diego',
        'John Wick',
        'John Cena',
        'The Rock',
        'Minecraft Steve',
        'a Minecraft Villager',
        'a Piglin',
        'goopert',
        'King Bach',
        'Tyler Fortnite Ninja Blevins',
        'Fortnite Wife',
        'Foundation',
        'PETA',
        'u/dankmemez23130980',
        'Shrek',
        'Hillary Clinton',
        'an ugly fuckin cat',
        'Mariah Carey',
        'Faileses himself',
        'crewmate',
        'JACOB',
        'Mr Black',
        'Mr. White',
        'Heisenburg',
        'Walter White',
        'JESSE',
        'Gus',
        'bat man',
        'joker',
        'society',
        'Mario',
        'Luigi',
        'Waluigi',
        'Dream',
        'Justin Trudeau',
        'Obama',
        'Slenderman',
        'CSGO Terrorist',
        'CSGO Counter-Terrorist',
        'Twitter',
        'DaBaby',
        'Jar Jar Binks',
        'Joe',
        'Joe Biden',
        'Peter Griffin',
      ];

      let actions = {
        successful: [
          'gave you',
          'tipped you',
          'handed you',
          'brought you',
          'tossed you',
          'gifted you',
          'loaned you',
          'gave you a small loan of',
          'handed you a briefcase containing',
          'awarded you a whopping',
          'presented you with',
          'asked you to sing a song. you did well, and they gave you',
          'gave you a reddit gold and',
          'gave you a reddit platinum and',
          'gave you a reddit silver and',
        ],
        unsuccessful: [
          'robbed you of',
          'ran away with',
          'pickpocketed you of your',
          'stole your',
          'bullied you into giving',
          'took your',          
      ]}

      let amounts = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 22, 25, 30, 32, 36, 40, 45, 50, 56, 100, 125, 150, 200, 250, 500];

      let outcome = [
        people[Math.floor(Math.random() * people.length)], // person
        isSuccessful 
        ? actions.successful[Math.floor(Math.random() * actions.successful.length)] 
        : actions.unsuccessful[Math.floor(Math.random() * actions.unsuccessful.length)], // gave you/took your
        amounts[Math.floor(Math.random() * amounts.length)] // X coins
      ];

      let response = `**${outcome[0]}** ${outcome[1]} **${outcome[2]}** coins `;
      if (!isSuccessful) response += client.config.troll;

      if (isSuccessful) {
        if (curWallet)
          await wallet.findOneAndUpdate({ id: message.author.id }, { $set: { balance: curWallet.balance + (outcome[2] as number)} });
        else
          await (new wallet({ id: message.author.id, balance: outcome[2]})).save();
      } else {
        if (curWallet)
          await wallet.findOneAndUpdate({ id: message.author.id }, { $set: { balance: outcome[2] > curWallet.balance ? 0 : curWallet.balance - (outcome[2] as number)} });
        else
          response = `**${outcome[0]}** tried to rob you of your money, but you're broke as fuck! lmfao !!!`;
      }
      
      message.channel.send(response);
      
    } catch (error) {
      return { code: 'ERROR', error: error };
    } finally {
      return { code: 'INFO', details: `${message.member} ran command "${(this as any).info.name}"` };
    }
  }
});
