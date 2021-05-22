"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// JS CODE
const { Client, MessageAttachment, Intents, version } = require('discord.js');
console.log(version);
const TrollClient = new Client({ intents: Intents.ALL });
TrollClient.autoResponses = [
    [/y((o+u'?r+e?)|(o+|e|a))( are)? m((o+ther+)|(o+|u)m)(m+y+)?/gi, 'i am doing your mother', 'https://pbs.twimg.com/media/E0qYJZLWYAE6_7C.png'],
    [/bu+s{2,}y+/gi, 'hnng <:cum:841142405846925312>', null],
    [/🥺|https:\/\/discord\.com\/assets\/6bca769662f755d33514d1f5304c617d\.svg/gi, 'what the fuck is "🥺" i dont speak bottom', null],
    [/(amo+n?g+)|sus+|impost|vent|pretender|cre+wma+te|medbay|electrical/gi, 'SUSSY!', 'https://geixcowo.ga/amogsus.png']
];
TrollClient.redditAwards = [
    '<:rsilver:843164309735735316>',
    '<:rgold:843160855234215968>',
    '<:rplat:843164215786340442>',
    '<:wholesome:843164215346069546>'
];
TrollClient.on('guildMemberAdd', (member) => {
    if (member.user.bot) {
        return member.roles.add('841267799787438090');
    }
    else {
        member.roles.add('841295461486428200');
        TrollClient.channels.cache.get('840829257004875789').send(`${member}, you have been trolled !!!11!!11111!1`);
    }
});
TrollClient.on('guildMemberRemove', (member) => {
    const channel = TrollClient.channels.cache.get('840829257004875789');
    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
        const { action, target } = (yield member.guild.fetchAuditLogs()).entries.first();
        if (target.id === member.user.id) {
            switch (action) {
                case 'MEMBER_BAN_ADD':
                    channel.send(`wont be hearing from ${member.user.username} anymore <:troll:841760436042203138>`);
                    break;
                case 'MEMBER_KICK':
                    channel.send(`${member.user.username} got blasted lmaooo`);
                    break;
            }
            return;
        }
        else {
            channel.send(`${member.user.username} left what the fuck man :(`);
        }
    }), 1000);
});
TrollClient.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.content === 'test<:troll:841760436042203138>')
        return message.reply('helo', { allowedMentions: { repliedUser: false } });
    if (message.content === '<:troll:841760436042203138>help')
        return message.channel.send('hi im troll. i do nothing rn lol get fucked');
}));
TrollClient.on('message', (message) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (() => __awaiter(void 0, void 0, void 0, function* () {
            var _a, _b;
            if (message.author.bot)
                return;
            const imageRegex = /(https?:\/\/.+\.(jpe?g|png|webp)(\?.+)?)/i;
            const iconChannel = TrollClient.channels.cache.get('841159137781874698');
            const chance = Math.floor(Math.random() * 2);
            if (imageRegex.test(((_b = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a.first()) === null || _b === void 0 ? void 0 : _b.url) || message.content) && message.channel === iconChannel) {
                return chance === 1
                    ? message.channel.send('changed the guild icon').then(() => { var _a, _b; return message.guild.setIcon(((_b = (_a = message.attachments) === null || _a === void 0 ? void 0 : _a.first()) === null || _b === void 0 ? void 0 : _b.url) || message.content); })
                    : message.channel.send('hah! shit luck');
            }
            else if (message.channel === iconChannel) {
                return message.channel.send('that file isnt a supported image! supported types are: jpg, jpeg, png, and webp');
            }
            TrollClient.autoResponses.forEach((i) => {
                // console.log(`response: ${i[1]} to message ${message.content}: ${i[0].test(message.content)}`)
                if (i[0].test(message.content)) {
                    // console.log('a');
                    message.channel.send(i[1], i[2] ? new MessageAttachment(i[2]) : null);
                    // throw new Error('Autoresponse ' + i[1]); 
                }
            });
            const reactionChance = Math.floor(Math.random() * 10);
            return reactionChance === 1
                ? message.react(TrollClient.redditAwards[Math.floor(Math.random() * 4)])
                : null;
        }))();
    }
    catch (error) {
        console.log(error.message);
    }
}));
TrollClient.login(process.env.DISCORD_TOKEN);
//# sourceMappingURL=troll.js.map