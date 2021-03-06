import { GiantScoring, MythicalAnimalScoring, ValkyryScoring } from "../score_helpers/MythologicalCreatureScoringHelpers";
import { AutoActionFunctionNames, BuffNames, GiantNames, GodNames, MythicalAnimalNames, SuitNames, ValkyryNames } from "../typescript/enums";
import type { IGiantConfig, IGiantData, IGodConfig, IGodData, IMythicalAnimalConfig, IMythicalAnimalData, IValkyryConfig, IValkyryData } from "../typescript/interfaces";

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir: IGiantData = {
    name: GiantNames.Gymir,
    placedSuit: SuitNames.Explorer,
    scoringRule: GiantScoring,
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
    placedSuit: SuitNames.Miner,
    // TODO Add +2 to upgrade coin during next trading coin upgrade or for each coin on player board...?!
    // actions: {
    //     name: AddValueToCoin.name,
    // },
    scoringRule: (): number => 0,
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
    placedSuit: SuitNames.Hunter,
    // TODO Get 2 random(?) mythological creatures cards form it's deck?!
    // actions: {
    //     name: GetMythologicalCreaturesCards.name,
    // },
    scoringRule: (): number => 0,
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
    placedSuit: SuitNames.Warrior,
    scoringRule: GiantScoring,
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
    placedSuit: SuitNames.Blacksmith,
    actions: {
        name: AutoActionFunctionNames.AddPickHeroAction,
    },
    scoringRule: (): number => 0,
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
    suit: SuitNames.Hunter,
    buff: {
        name: BuffNames.DagdaDiscardOnlyOneCards,
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
    suit: SuitNames.Explorer,
    scoringRule: MythicalAnimalScoring,
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
    suit: SuitNames.Blacksmith,
    ability: (): void => {
        // TODO Add Gullinbursti to your dwarf's player board
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
    suit: SuitNames.Warrior,
    scoringRule: MythicalAnimalScoring,
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
    suit: SuitNames.Miner,
    buff: {
        name: BuffNames.RatatoskFinalScoring,
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
    scoringRule: ValkyryScoring,
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
    scoringRule: ValkyryScoring,
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
    scoringRule: ValkyryScoring,
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
    scoringRule: ValkyryScoring,
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
    scoringRule: ValkyryScoring,
};

/**
 * <h3>Конфиг Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Мифических существ при инициализации игры.</li>
 * </ol>
 */
export const giantConfig: IGiantConfig = {
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
export const godConfig: IGodConfig = {
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
export const mythicalAnimalConfig: IMythicalAnimalConfig = {
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
export const valkyryConfig: IValkyryConfig = {
    Brynhildr,
    Hildr,
    Olrun,
    Sigrdrifa,
    Svafa,
};
