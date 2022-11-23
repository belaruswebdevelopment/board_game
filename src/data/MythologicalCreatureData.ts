import { AutoActionFunctionNames, GiantBuffNames, GiantNames, GiantScoringFunctionNames, GodNames, MultiSuitCardNames, MythicalAnimalBuffNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, SuitNames, ValkyryBuffNames, ValkyryNames, ValkyryScoringFunctionNames } from "../typescript/enums";
import type { GiantConfigType, GodConfigType, IGiantData, IGodData, IMythicalAnimalData, IValkyryData, MythicalAnimalConfigType, MythologicalCreatureConfigType, ValkyryConfigType } from "../typescript/interfaces";
import { StackData } from "./StackData";

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir: IGiantData = {
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
const Hrungnir: IGiantData = {
    description: ``,
    name: GiantNames.Hrungnir,
    placedSuit: SuitNames.miner,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantHrungnir,
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
const Skymir: IGiantData = {
    description: ``,
    name: GiantNames.Surt,
    placedSuit: SuitNames.hunter,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantSkymir,
    },
    actions: {
        name: AutoActionFunctionNames.AddMythologyCreatureCardsSkymirAction,
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
const Surt: IGiantData = {
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
const Thrivaldi: IGiantData = {
    description: ``,
    name: GiantNames.Thrivaldi,
    placedSuit: SuitNames.blacksmith,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantThrivaldi,
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
const Freyja: IGodData = {
    description: ``,
    name: GodNames.Freyja,
    points: 15,
    godPower: (): void => {
        // TODO
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Frigg: IGodData = {
    description: ``,
    name: GodNames.Frigg,
    points: 12,
    godPower: (): void => {
        // TODO
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Loki: IGodData = {
    description: ``,
    name: GodNames.Loki,
    points: 8,
    godPower: (): void => {
        // TODO
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Odin: IGodData = {
    description: ``,
    name: GodNames.Odin,
    points: 0,
    godPower: (): void => {
        // TODO
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Thor: IGodData = {
    description: ``,
    name: GodNames.Thor,
    points: 8,
    godPower: (): void => {
        // TODO
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Durathor: IMythicalAnimalData = {
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
const Garm: IMythicalAnimalData = {
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
const Hraesvelg: IMythicalAnimalData = {
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
const Nidhogg: IMythicalAnimalData = {
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
const Ratatosk: IMythicalAnimalData = {
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
const Brynhildr: IValkyryData = {
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
const Hildr: IValkyryData = {
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
const Olrun: IValkyryData = {
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
const Sigrdrifa: IValkyryData = {
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
const Svafa: IValkyryData = {
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
export const giantConfig: GiantConfigType = {
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
export const godConfig: GodConfigType = {
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
export const mythicalAnimalConfig: MythicalAnimalConfigType = {
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
export const valkyryConfig: ValkyryConfigType = {
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
export const mythologicalCreatureConfig: MythologicalCreatureConfigType = {
    2: 9,
    3: 9,
    4: 12,
    5: 15,
};
