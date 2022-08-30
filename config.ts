import { TrollConfig } from "./TrollClient";

export const config: TrollConfig = {
  troll: '<:troll:891744450752163891>',
  suffix: '<:troll:891744450752163891>',
  cake: '<:cakeday:874408986936492082>',
  coin: '<:rcoin:876254633813749780>',
  reddit: [
    '<:rsilver:843164309735735316>',
    '<:rgold:843160855234215968>',
    '<:rplat:843164215786340442>',
    '<:wholesome:843164215346069546>'
  ],
  general: '840829257004875789',
  responses: [
    // if anyone wants to rewrite these regexes PLEASE PR holy shit they're bad
    [/\b(y((o+u('|’)?r+e?)|(o+|e|a))( +are)? +m((o+ther+)|(o+|u)m)(m+y+)?)/gi, 'i am doing your mother', './images/mother.png'],
    [/\b((amo+n?g+)|s+u+s+|impost|vent|pretender|cre+wma+te|medbay|electrical)/gi, 'SUSSY!', './images/amogsus.png'],
    [/.{500,}/g, ' ', './images/myreaction.png'],
  ],
  botRole: '841267799787438090',
  memberRole: '841295461486428200',
  adminRole: '842802299675213824',
  modRole: '842802567499219005',
}

/* modules 

format for modules:

//IF ENABLED
//  feature: {...}
//IF DISABLED
//  feature: false | null | undefined

export const config: TrollConfig = {
  suffix: '<:troll:891744450752163891>',
  reactions: {
    birthday: '<:cakeday:874408986936492082>',
    awards: {
      giveXP: true, // this will error if you don't have the xp module enabled
      types: ['rsilver', 'rgold', 'rplat', 'wholesome'],
      values: [15, 10, 5, 3],
    },
    voting: { // will error without xp module enabled
      emojis: ['downvote', 'upvote'], // down and up
      values: [-1, 1],
    }
  },
  autoResponder: {
    expressions: [
      /\b(y((o+u('|’)?r+e?)|(o+|e|a))( +are)? +m((o+ther+)|(o+|u)m)(m+y+)?)/gi,
      /\b((amo+n?g+)|s+u+s+|impost|vent|pretender|cre+wma+te|medbay|electrical)/gi,
      /.{500}/g,
    ],
    responses: [
      'i am doing your mother',
      'SUSSY!',
      ' ', // allow null
    ],
    attachments: [ // look for ./images/{name}.png, if not found then use the full value
      'mother',
      'amogsus',
      'myreaction',
    ],
  },
  roles: {
    bot: '841267799787438090',
    member: '841295461486428200',
    admin: '842802299675213824',
    mod: '842802567499219005',
  },
  welcomer: {
    waitForVerification: true, // with this disabled, server rules and security levels are ignored
    greetings: [
      '{member}, you have been trolled !!!11!!11111!1'
    ],
    farewells: {
      leave: [
        '{memberName} left what the fuck man :('
      ],
      ban: [ // if ban is disabled, default to leave
        'wont be hearing from {member} anymore {troll}'
      ], 
      kick: [ // if kick is disabled, but ban isnt, default to ban; otherwise, leave
        '{member} got ejected :000'
      ]
    }
  },
  xp: {
    cooldown: 30, // in seconds
    amount: 1 // amount of xp to give for each message
  },
  starboard: { 
    channel: '841295461486428200',
    emoji: '<:star:874408986936492082>',
    minStars: 3,
    awardXP: 5, // per star reward
  },
  economy: {
    currency: '<:rcoin:876254633813749780>',
    gambling: {
      minBet: 1,
      maxBet: 'all',
      odds: 50, // percent chance, can also set to 'house' for a 0 percent chance of winning :troll:
    },
    daily: {
      payout: 250,
      events: {
        types: ['tax', 'bills', 'gas', 'rob', 'lost'] // allow pos and neg events
        // values: -0.02% of bal, -100, -50, -600, -300  
      }  
    },
    begging: {
      odds: 75, // mostly successful
      // people: [...]
      actions: {
        // successful: [...]
        // unsuccessful: [...]
      }
      amounts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 18, 22, 25, 30, 32, 36, 40, 45, 50, 56, 100, 125, 150, 200, 250, 500],
    }
  }
}

// convert this junk into a user friendly config file, maybe some yaml or json




*/