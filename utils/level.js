const levels = [
    "Unrated",
    "Bronze V",
    "Bronze IV",
    "Bronze III",
    "Bronze II",
    "Bronze I",
    "Silver V",
    "Silver IV",
    "Silver III",
    "Silver II",
    "Silver I",
    "Gold V",
    "Gold IV",
    "Gold III",
    "Gold II",
    "Gold I",
    "Platinum V",
    "Platinum IV",
    "Platinum III",
    "Platinum II",
    "Platinum I",
    "Diamond V",
    "Diamond IV",
    "Diamond III",
    "Diamond II",
    "Diamond I",
    "Ruby V",
    "Ruby IV",
    "Ruby III",
    "Ruby II",
    "Ruby I",
];

const icons = [
    "210267171-d7b7de5f-a68a-4ff9-ada4-494d49df8ada",//Unrated
    "210267173-050d1ae9-a17b-4a7f-a2cf-be0a4c3794be",//Bronze
    "210267175-31d16c69-3b1b-4c59-9648-0e6222f1189e",
    "210267177-c3352b7b-a028-47ef-bf1f-6c1f601934d8",
    "210267178-ecb687ac-83b9-4754-905e-daadf6042eea",
    "210267180-4aec3248-d91c-4566-8027-220ede31a199",
    "210267181-c99dd3ad-d3d4-41c9-a65e-6158b36e2f4e",//Silver
    "210267182-a9e62d9c-648c-41d3-a80a-a36227a69583",
    "210385925-6a901eb1-f650-4b10-b864-e39c2e342e47",
    "210267183-afc94124-07ee-4554-903e-7cfef5f769ab",
    "210267184-2faa7096-0748-4cd2-8e7a-8804b79d1dd2",
    "210267185-9f93420d-aeeb-48bd-a687-7b33fb1d7b48",//Gold
    "210267186-92a7a422-a907-4bad-aa0c-2c339034942a",
    "210267190-a3fb0ae7-d575-44b2-a35b-2eff9b6e2cda",
    "210267191-8919b300-9918-453e-9590-0b9a4bfec25d",
    "210267193-4b493b79-dbc4-4b0c-b924-da7779b8e597",
    "210267196-b8ef2574-03df-420a-b8a1-df79a44fbe39",//Platinum
    "210267198-60dbb9e5-8bf4-433c-9565-1d9f72530ac0",
    "210267200-a646b82b-d7a3-41d1-a195-96b9995266dd",
    "210267201-ca0b5435-a654-44ea-a036-4d6f7869a859",
    "210267204-28917812-529d-44b5-ab18-97d55ad1a880",
    "210267206-980ed030-5b16-44c3-bb49-9dad4bd7c7a6",//Diamond
    "210267207-d37e6c80-7082-4bf7-87bc-5279a7a2fe16",
    "210267209-60558608-82c2-40b3-a28e-7fe596a3f3ef",
    "210267211-68ba02d5-2a56-4117-8812-05d32dd7a927",
    "210267212-bd1f3385-dea6-4746-a875-770edafc8941",
    "210267213-44ee961e-d0b3-4a12-84a6-47a9b3bbcc61",//Ruby
    "210267215-d07c4fc8-2074-4c80-b945-ca4a73113b3e",
    "210267216-cd07fcec-4250-4b4e-8a86-1f2d43f5c905",
    "210267220-6ce41883-4148-4933-a65f-11a93d37fc57",
    "210267221-53ce6ecb-e190-489f-b2b0-1c01f45c53c2",
];

const colors = [
    '464646',
    // '2d2d2d',//Unrated
    'ad5600',//Bronze
    '435f7a',//Silver
    'ec9a00',//Gold
    '27e2a4',//Platinum
    '00b4fc',//Diamond
    'ff0062',//Ruby
];

const emojis = [
    "<:unrated:1140676109135003779>",
    "<:bronze_5:1140676033109049517>",
    "<:bronze_4:1140676029669703721>",
    "<:bronze_3:1140676026423324734>",
    "<:bronze_2:1140676022870749284>",
    "<:bronze_1:1140676020970717245>",
    "<:silver_5:1140676106207371364>",
    "<:silver_4:1140676104412213308>",
    "<:silver_3:1140676101006430340>",
    "<:silver_2:1140676099370659931>",
    "<:silver_1:1140676095394447390>",
    "<:gold_5:1140676063257690223>",
    "<:gold_4:1140676057838653561>",
    "<:gold_3:1140676054441263164>",
    "<:gold_2:1140676051702403203>",
    "<:gold_1:1140676048418254928>",
    "<:platinum_5:1140676077912604837>",
    "<:platinum_4:1140676075878355034>",
    "<:platinum_3:1140676071881183284>",
    "<:platinum_2:1140676068492193883>",
    "<:platinum_1:1140676066529247332>",
    "<:diamond_5:1140676046170095660>",
    "<:diamond_4:1140676043045351454>",
    "<:diamond_3:1140676039547306026>",
    "<:diamond_2:1140676038138019840>",
    "<:diamond_1:1140676034832904263>",
    "<:ruby_5:1140676092185821334>",
    "<:ruby_4:1140676090101256373>",
    "<:ruby_3:1140676086657728683>",
    "<:ruby_2:1140676084044669048>",
    "<:ruby_1:1140676081939124364>",
];

export function get_icon(level) {
    return `https://user-images.githubusercontent.com/97784561/${icons[level]}.png`;
}

export function get_level(level) {
    return levels[level];
}

export function get_emoji(level) {
    return emojis[level];
}

export function get_color(level) {
    if (level == 0){ return colors[0] }
    else if (level >= 1 && level <= 5) { return colors[1] }
    else if (level >= 6 && level <= 10) { return colors[2] }
    else if (level >= 11 && level <= 15) { return colors[3] }
    else if (level >= 15 && level <= 20) { return colors[4] }
    else if (level >= 20 && level <= 25) { return colors[5] }
    else if (level >= 25 && level <= 30) { return colors[6] }
}
