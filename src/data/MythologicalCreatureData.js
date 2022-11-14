import { AutoActionFunctionNames, GiantBuffNames, GiantNames, GiantScoringFunctionNames, GodNames, MultiSuitCardNames, MythicalAnimalBuffNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, SuitNames, ValkyryBuffNames, ValkyryNames, ValkyryScoringFunctionNames } from "../typescript/enums";
import { StackData } from "./StackData";
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir = {
    description: ``,
    name: GiantNames.Gymir,
    placedSuit: SuitNames.explorer,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantGymir,
    },
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
    description: ``,
    name: GiantNames.Hrungnir,
    placedSuit: SuitNames.miner,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantHrungnir,
    },
    actions: {
        name: AutoActionFunctionNames.AddPlusTwoValueToAllCoinsAction,
    },
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
    description: ``,
    name: GiantNames.Surt,
    placedSuit: SuitNames.hunter,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantSkymir,
    },
    actions: {
        name: AutoActionFunctionNames.AddMythologyCreatureCardsSkymirAction,
    },
    stack: {
        player: [StackData.getMythologyCardSkymir()],
    },
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
    description: ``,
    name: GiantNames.Surt,
    placedSuit: SuitNames.warrior,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantSurt,
    },
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
    description: ``,
    name: GiantNames.Thrivaldi,
    placedSuit: SuitNames.blacksmith,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantThrivaldi,
    },
    // TODO Add it!
    // buff: {
    //     name: BuffNames.HasOneNotCountHero,
    // },
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
    description: ``,
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
    description: ``,
    name: GodNames.Frigg,
    points: 12,
    godPower: () => {
        // TODO Get 3 cards form 1 or 2 tier decks (or discard deck...?!) and choose 1?!
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
    description: ``,
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
    description: ``,
    name: GodNames.Odin,
    points: 0,
    godPower: () => {
        // TODO You can one swap neutral(!)/all hero to another hero?!
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
    description: ``,
    name: GodNames.Thor,
    points: 8,
    godPower: () => {
        // TODO You can not discard card one time or all time?!
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
    description: ``,
    name: MythicalAnimalNames.Durathor,
    suit: SuitNames.hunter,
    buff: {
        name: MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards,
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
    description: ``,
    name: MythicalAnimalNames.Garm,
    points: 9,
    rank: 2,
    suit: SuitNames.explorer,
    buff: {
        name: MythicalAnimalBuffNames.ExplorerDistinctionGetSixCards,
    },
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
    description: ``,
    name: MythicalAnimalNames.Hraesvelg,
    suit: SuitNames.blacksmith,
    stack: {
        player: [StackData.placeMultiSuitsCards(MultiSuitCardNames.Gullinbursti)],
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
    description: ``,
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
    description: ``,
    name: MythicalAnimalNames.Ratatosk,
    points: 2,
    suit: SuitNames.miner,
    buff: {
        name: MythicalAnimalBuffNames.RatatoskFinalScoring,
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
    description: ``,
    name: ValkyryNames.Brynhildr,
    buff: {
        name: ValkyryBuffNames.CountBidWinnerAmount,
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
    description: ``,
    name: ValkyryNames.Hildr,
    buff: {
        name: ValkyryBuffNames.CountDistinctionAmount,
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
    description: ``,
    name: ValkyryNames.Olrun,
    buff: {
        name: ValkyryBuffNames.CountPickedCardClassRankAmount,
    },
    stack: {
        player: [StackData.chooseSuitOlrun()],
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
    description: ``,
    name: ValkyryNames.Sigrdrifa,
    buff: {
        name: ValkyryBuffNames.CountPickedHeroAmount,
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
    description: ``,
    name: ValkyryNames.Svafa,
    buff: {
        name: ValkyryBuffNames.CountBettermentAmount,
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
/**
 * <h3>Конфиг Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Мифических существ при инициализации игры.</li>
 * </ol>
 */
export const mythologicalCreatureConfig = {
    2: 9,
    3: 9,
    4: 12,
    5: 15,
};
//# sourceMappingURL=MythologicalCreatureData.js.map