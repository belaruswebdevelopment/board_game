import { AutoActionFunctionNames, BuffNames, GiantNames, GiantScoringFunctionNames, GodNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, SuitNames, ValkyryNames, ValkyryScoringFunctionNames } from "../typescript/enums";
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir = {
    name: GiantNames.Gymir,
    placedSuit: SuitNames.explorer,
    scoringRule: {
        name: GiantScoringFunctionNames.GymirScoring,
    },
};
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Hrungnir = {
    name: GiantNames.Hrungnir,
    placedSuit: SuitNames.miner,
    // TODO Add +2 to upgrade coin during next trading coin upgrade or for each coin on player board...?!
    // actions: {
    //     name: AddValueToCoin.name,
    // },
    scoringRule: {
        name: GiantScoringFunctionNames.BasicGiantScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Skymir = {
    name: GiantNames.Surt,
    placedSuit: SuitNames.hunter,
    // TODO Get 2 random(?) mythological creatures cards form it's deck?!
    // actions: {
    //     name: GetMythologicalCreaturesCards.name,
    // },
    scoringRule: {
        name: GiantScoringFunctionNames.BasicGiantScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Surt = {
    name: GiantNames.Surt,
    placedSuit: SuitNames.warrior,
    scoringRule: {
        name: GiantScoringFunctionNames.SurtScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Thrivaldi = {
    name: GiantNames.Thrivaldi,
    placedSuit: SuitNames.blacksmith,
    actions: {
        name: AutoActionFunctionNames.AddPickHeroAction,
    },
    scoringRule: {
        name: GiantScoringFunctionNames.BasicGiantScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Freyja = {
    name: GodNames.Freyja,
    points: 15,
    godPower: () => {
        // TODO You can swap cards from all taverns into another taverns?!
    },
};
/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Frigg = {
    name: GodNames.Frigg,
    points: 12,
    godPower: () => {
        // TODO Get 3 cards form 1 or 2 tier decks and choose 1?!
    },
};
/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Loki = {
    name: GodNames.Loki,
    points: 8,
    godPower: () => {
        // TODO Put Loki token on tavern card and discard or take it?!
    },
};
/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Odin = {
    name: GodNames.Odin,
    points: 0,
    godPower: () => {
        // TODO You can one swap neutral/all hero to another hero?!
    },
};
/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Thor = {
    name: GodNames.Thor,
    points: 8,
    godPower: () => {
        // TODO You can not discard card one time?!
    },
};
/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Durathor = {
    name: MythicalAnimalNames.Durathor,
    suit: SuitNames.hunter,
    buff: {
        name: BuffNames.DagdaDiscardOnlyOneCards,
    },
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.BasicMythicalAnimalScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Garm = {
    name: MythicalAnimalNames.Garm,
    points: 9,
    rank: 2,
    suit: SuitNames.explorer,
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.GarmScoring,
    },
};
/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Hraesvelg = {
    name: MythicalAnimalNames.Hraesvelg,
    suit: SuitNames.blacksmith,
    ability: () => {
        // TODO Add Gullinbursti to your dwarf's player board
    },
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.BasicMythicalAnimalScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Nidhogg = {
    name: MythicalAnimalNames.Nidhogg,
    points: 5,
    suit: SuitNames.warrior,
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.NidhoggScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Ratatosk = {
    name: MythicalAnimalNames.Ratatosk,
    points: 2,
    suit: SuitNames.miner,
    buff: {
        name: BuffNames.RatatoskFinalScoring,
    },
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.BasicMythicalAnimalScoring,
        params: [0],
    },
};
/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Brynhildr = {
    name: ValkyryNames.Brynhildr,
    // TODO For biggest coin in all/different taverns?!
    buff: {
        name: BuffNames.CountDistinctionAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.BrynhildrScoring,
    },
};
/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Hildr = {
    name: ValkyryNames.Hildr,
    buff: {
        name: BuffNames.CountDistinctionAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.HildrScoring,
    },
};
/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Olrun = {
    name: ValkyryNames.Olrun,
    // TODO For each pick/set of all/different suits?!
    buff: {
        name: BuffNames.CountDistinctionAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.OlrunScoring,
    },
};
/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Sigrdrifa = {
    name: ValkyryNames.Sigrdrifa,
    buff: {
        name: BuffNames.CountPickedHeroAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.SigrdrifaScoring,
    },
};
/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Svafa = {
    name: ValkyryNames.Svafa,
    // TODO For biggest coin opened in tavern/or biggest exchange coin?!
    buff: {
        name: BuffNames.CountDistinctionAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.SvafaScoring,
    },
};
/**
 * <h3>Конфиг Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Мифических существ при инициализации игры.</li>
 * </ol>
 */
export const giantConfig = {
    Gymir,
    Hrungnir,
    Skymir,
    Surt,
    Thrivaldi,
};
/**
 * <h3>Конфиг Богов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Богов при инициализации игры.</li>
 * </ol>
 */
export const godConfig = {
    Freyja,
    Frigg,
    Loki,
    Odin,
    Thor,
};
/**
 * <h3>Конфиг Мифических животных.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Мифических животных при инициализации игры.</li>
 * </ol>
 */
export const mythicalAnimalConfig = {
    Durathor,
    Garm,
    Hraesvelg,
    Nidhogg,
    Ratatosk,
};
/**
 * <h3>Конфиг Валькирий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Валькирий при инициализации игры.</li>
 * </ol>
 */
export const valkyryConfig = {
    Brynhildr,
    Hildr,
    Olrun,
    Sigrdrifa,
    Svafa,
};
//# sourceMappingURL=MythologicalCreatureData.js.map