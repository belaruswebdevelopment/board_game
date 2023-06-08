import { AutoActionFunctionNames, GiantBuffNames, GiantDescriptionNames, GiantNames, GiantScoringFunctionNames, GodBuffNames, GodDescriptionNames, GodNames, MultiSuitCardNames, MythicalAnimalBuffNames, MythicalAnimalDescriptionNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, SuitNames, ValkyryBuffNames, ValkyryDescriptionNames, ValkyryNames, ValkyryScoringFunctionNames } from "../typescript/enums";
import { AllStackData } from "./StackData";
/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir = {
    name: GiantNames.Gymir,
    description: GiantDescriptionNames.Gymir,
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
    name: GiantNames.Hrungnir,
    description: GiantDescriptionNames.Hrungnir,
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
const Skymir = {
    name: GiantNames.Surt,
    description: GiantDescriptionNames.Skymir,
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
const Surt = {
    name: GiantNames.Surt,
    description: GiantDescriptionNames.Surt,
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
    name: GiantNames.Thrivaldi,
    description: GiantDescriptionNames.Thrivaldi,
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
const Freyja = {
    name: GodNames.Freyja,
    description: GodDescriptionNames.Freyja,
    points: 15,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodFreyja,
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
    description: GodDescriptionNames.Frigg,
    points: 12,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodFrigg,
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
    description: GodDescriptionNames.Loki,
    points: 8,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodLoki,
    },
};
// TODO Remove all swapped hero's buffs and for Uline!
// TODO If Odin swap Olwin which doubles on the player's table => next who pick it can't pick doubles!?
// TODO Odin swap only neutral heroes!!!
/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Odin = {
    name: GodNames.Odin,
    description: GodDescriptionNames.Odin,
    points: 0,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodOdin,
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
    description: GodDescriptionNames.Thor,
    points: 8,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodThor,
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
    description: MythicalAnimalDescriptionNames.Durathor,
    playerSuit: SuitNames.hunter,
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
    name: MythicalAnimalNames.Garm,
    description: MythicalAnimalDescriptionNames.Garm,
    points: 9,
    rank: 2,
    playerSuit: SuitNames.explorer,
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
    name: MythicalAnimalNames.Hraesvelg,
    description: MythicalAnimalDescriptionNames.Hraesvelg,
    playerSuit: SuitNames.blacksmith,
    stack: {
        player: [AllStackData.placeMultiSuitsCards(MultiSuitCardNames.Gullinbursti)],
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
    description: MythicalAnimalDescriptionNames.Nidhogg,
    points: 5,
    playerSuit: SuitNames.warrior,
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
    description: MythicalAnimalDescriptionNames.Ratatosk,
    points: 2,
    playerSuit: SuitNames.miner,
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
    name: ValkyryNames.Brynhildr,
    description: ValkyryDescriptionNames.Brynhildr,
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
    name: ValkyryNames.Hildr,
    description: ValkyryDescriptionNames.Hildr,
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
    name: ValkyryNames.Olrun,
    description: ValkyryDescriptionNames.Olrun,
    buff: {
        name: ValkyryBuffNames.CountPickedCardClassRankAmount,
    },
    stack: {
        player: [AllStackData.chooseSuitOlrun()],
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
    description: ValkyryDescriptionNames.Sigrdrifa,
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
    name: ValkyryNames.Svafa,
    description: ValkyryDescriptionNames.Svafa,
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