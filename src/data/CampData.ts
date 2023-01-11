import { ArtefactDescriptionNames, ArtefactNames, ArtefactScoringFunctionNames, AutoActionFunctionNames, CampBuffNames, SuitNames } from "../typescript/enums";
import type { ArtefactCampCardData, ArtefactConfig, MercenariesConfig } from "../typescript/interfaces";
import { AllStackData } from "./StackData";

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Brisingamens: ArtefactCampCardData = {
    name: ArtefactNames.Brisingamens,
    description: ArtefactDescriptionNames.Brisingamens,
    tier: 1,
    buff: {
        name: CampBuffNames.DiscardCardEndGame,
    },
    validators: {
        pickDiscardCardToStack: {},
    },
    stack: {
        player: [
            AllStackData.pickDiscardCardBrisingamens(),
            AllStackData.pickDiscardCardBrisingamens(3),
        ],
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Draupnir: ArtefactCampCardData = {
    name: ArtefactNames.Draupnir,
    description: ArtefactDescriptionNames.Draupnir,
    tier: 0,
    scoringRule: {
        name: ArtefactScoringFunctionNames.DraupnirScoring,
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const FafnirBaleygr: ArtefactCampCardData = {
    name: ArtefactNames.FafnirBaleygr,
    description: ArtefactDescriptionNames.FafnirBaleygr,
    tier: 0,
    buff: {
        name: CampBuffNames.GoCamp,
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Gjallarhorn: ArtefactCampCardData = {
    name: ArtefactNames.Gjallarhorn,
    description: ArtefactDescriptionNames.Gjallarhorn,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.AddPickHeroAction,
        params: [2],
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Hofud: ArtefactCampCardData = {
    name: ArtefactNames.Hofud,
    description: ArtefactDescriptionNames.Hofud,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.StartDiscardSuitCardAction,
    },
    stack: {
        player: [AllStackData.discardSuitCardHofud()],
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Hrafnsmerki: ArtefactCampCardData = {
    name: ArtefactNames.Hrafnsmerki,
    description: ArtefactDescriptionNames.Hrafnsmerki,
    tier: 1,
    scoringRule: {
        name: ArtefactScoringFunctionNames.HrafnsmerkiScoring,
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Jarnglofi: ArtefactCampCardData = {
    name: ArtefactNames.Jarnglofi,
    description: ArtefactDescriptionNames.Jarnglofi,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.DiscardTradingCoinAction,
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [24],
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Megingjord: ArtefactCampCardData = {
    name: ArtefactNames.Megingjord,
    description: ArtefactDescriptionNames.Megingjord,
    tier: 0,
    buff: {
        name: CampBuffNames.NoHero,
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [28],
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Mjollnir: ArtefactCampCardData = {
    name: ArtefactNames.Mjollnir,
    description: ArtefactDescriptionNames.Mjollnir,
    tier: 1,
    buff: {
        name: CampBuffNames.GetMjollnirProfit,
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.MjollnirScoring,
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const OdroerirTheMythicCauldron: ArtefactCampCardData = {
    name: ArtefactNames.OdroerirTheMythicCauldron,
    description: ArtefactDescriptionNames.OdroerirTheMythicCauldron,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.FinishOdroerirTheMythicCauldronAction,
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.OdroerirTheMythicCauldronScoring,
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Svalinn: ArtefactCampCardData = {
    name: ArtefactNames.Svalinn,
    description: ArtefactDescriptionNames.Svalinn,
    tier: 0,
    scoringRule: {
        name: ArtefactScoringFunctionNames.SvalinnScoring,
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Vegvisir: ArtefactCampCardData = {
    name: ArtefactNames.Vegvisir,
    description: ArtefactDescriptionNames.Vegvisir,
    tier: 0,
    playerSuit: SuitNames.explorer,
    rank: 1,
    points: 13,
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const VidofnirVedrfolnir: ArtefactCampCardData = {
    name: ArtefactNames.VidofnirVedrfolnir,
    description: ArtefactDescriptionNames.VidofnirVedrfolnir,
    tier: 0,
    actions: {
        name: AutoActionFunctionNames.StartVidofnirVedrfolnirAction,
    },
    scoringRule: {
        name: ArtefactScoringFunctionNames.BasicArtefactScoring,
        params: [0],
    },
};

/**
 * <h3>Конфиг карт наёмников для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов для лагеря при инициализации игры.</li>
 * </ol>
 */
export const mercenariesConfig: MercenariesConfig = [
    [
        {
            warrior: {
                suit: SuitNames.warrior,
                rank: 1,
                points: 6,
            },
            explorer: {
                suit: SuitNames.explorer,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: SuitNames.warrior,
                rank: 1,
                points: 6,
            },
            blacksmith: {
                suit: SuitNames.blacksmith,
                rank: 1,
                points: null,
            },
        },
        {
            hunter: {
                suit: SuitNames.hunter,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.explorer,
                rank: 1,
                points: 6,
            },
        },
        {
            hunter: {
                suit: SuitNames.hunter,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.miner,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: SuitNames.blacksmith,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.miner,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: SuitNames.warrior,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: SuitNames.explorer,
                rank: 1,
                points: 11,
            },
        },
    ],
    [
        {
            hunter: {
                suit: SuitNames.hunter,
                rank: 1,
                points: null,
            },
            blacksmith: {
                suit: SuitNames.blacksmith,
                rank: 1,
                points: null,
            },
        },
        {
            warrior: {
                suit: SuitNames.warrior,
                rank: 1,
                points: 6,
            },
            miner: {
                suit: SuitNames.miner,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: SuitNames.blacksmith,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.explorer,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: SuitNames.warrior,
                rank: 1,
                points: 6,
            },
            hunter: {
                suit: SuitNames.hunter,
                rank: 1,
                points: null,
            },
        },
        {
            explorer: {
                suit: SuitNames.explorer,
                rank: 1,
                points: 8,
            },
            miner: {
                suit: SuitNames.miner,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: SuitNames.warrior,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: SuitNames.explorer,
                rank: 1,
                points: 11,
            },
        },
    ],
];

/**
 * <h3>Конфиг карт артефактов для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов для лагеря при инициализации игры.</li>
 * </ol>
 */
export const artefactsConfig: ArtefactConfig = {
    Brisingamens,
    Draupnir,
    FafnirBaleygr,
    Gjallarhorn,
    Hofud,
    Hrafnsmerki,
    Jarnglofi,
    Megingjord,
    Mjollnir,
    OdroerirTheMythicCauldron,
    Svalinn,
    Vegvisir,
    VidofnirVedrfolnir,
};
