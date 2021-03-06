import { GiantScoring, MythicalAnimalScoring, ValkyryScoring } from "../score_helpers/MythologicalCreatureScoringHelpers";
import { AutoActionFunctionNames, BuffNames, GiantNames, GodNames, MythicalAnimalNames, SuitNames, ValkyryNames } from "../typescript/enums";
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir = {
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
const Hrungnir = {
    name: GiantNames.Hrungnir,
    placedSuit: SuitNames.Miner,
    // TODO Add +2 to upgrade coin during next trading coin upgrade or for each coin on player board...?!
    // actions: {
    //     name: AddValueToCoin.name,
    // },
    scoringRule: () => 0,
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
    placedSuit: SuitNames.Hunter,
    // TODO Get 2 random(?) mythological creatures cards form it's deck?!
    // actions: {
    //     name: GetMythologicalCreaturesCards.name,
    // },
    scoringRule: () => 0,
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
const Thrivaldi = {
    name: GiantNames.Thrivaldi,
    placedSuit: SuitNames.Blacksmith,
    actions: {
        name: AutoActionFunctionNames.AddPickHeroAction,
    },
    scoringRule: () => 0,
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
const Garm = {
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
const Hraesvelg = {
    name: MythicalAnimalNames.Hraesvelg,
    suit: SuitNames.Blacksmith,
    ability: () => {
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
const Nidhogg = {
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
const Ratatosk = {
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
const Brynhildr = {
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
const Hildr = {
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
const Olrun = {
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
const Sigrdrifa = {
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
const Svafa = {
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