import { AutoActionFunctionNames, BuffNames, GiantNames, GiantScoringFunctionNames, GodNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, SuitNames, ValkyryNames, ValkyryScoringFunctionNames } from "../typescript/enums";
import type { GiantConfigType, GodConfigType, IGiantData, IGodData, IMythicalAnimalData, IValkyryData, MythicalAnimalConfigType, ValkyryConfigType } from "../typescript/interfaces";

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir: IGiantData = {
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
const Hrungnir: IGiantData = {
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
const Skymir: IGiantData = {
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
const Surt: IGiantData = {
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
const Thrivaldi: IGiantData = {
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
const Freyja: IGodData = {
    name: GodNames.Freyja,
    points: 15,
    godPower: (): void => {
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
const Frigg: IGodData = {
    name: GodNames.Frigg,
    points: 12,
    godPower: (): void => {
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
const Loki: IGodData = {
    name: GodNames.Loki,
    points: 8,
    godPower: (): void => {
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
const Odin: IGodData = {
    name: GodNames.Odin,
    points: 0,
    godPower: (): void => {
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
const Thor: IGodData = {
    name: GodNames.Thor,
    points: 8,
    godPower: (): void => {
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
const Durathor: IMythicalAnimalData = {
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
const Garm: IMythicalAnimalData = {
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
const Hraesvelg: IMythicalAnimalData = {
    name: MythicalAnimalNames.Hraesvelg,
    suit: SuitNames.blacksmith,
    ability: (): void => {
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
const Nidhogg: IMythicalAnimalData = {
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
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Brynhildr: IValkyryData = {
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
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Hildr: IValkyryData = {
    name: ValkyryNames.Hildr,
    buff: {
        name: BuffNames.CountDistinctionAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.HildrScoring,
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Olrun: IValkyryData = {
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
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Sigrdrifa: IValkyryData = {
    name: ValkyryNames.Sigrdrifa,
    buff: {
        name: BuffNames.CountPickedHeroAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.SigrdrifaScoring,
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Svafa: IValkyryData = {
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
