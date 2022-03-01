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
    [/\b(y((o+u'?r+e?)|(o+|e|a))( are)? m((o+ther+)|(o+|u)m)(m+y+)?)/gi, 'i am doing your mother', './images/mother.png'],
    [/\bbu+s{2,}y+/gi, 'hnng <:cum:841142405846925312>'],
    [/\bto+p+/gi, '*bottom'],
    [/🥺|https:\/\/discord\.com\/assets\/6bca769662f755d33514d1f5304c617d\.svg/gi, 'what the fuck is "🥺" i dont speak bottom'],
    [/\b((amo+n?g+)|s+u+s+|impost|vent|pretender|cre+wma+te|medbay|electrical)/gi, 'SUSSY!', './images/amogsus.png']
  ],
  botRole: '841267799787438090',
  memberRole: '841295461486428200',
  adminRole: '842802299675213824',
  modRole: '842802567499219005',
}