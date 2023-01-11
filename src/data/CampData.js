import { ArtefactDescriptionNames, ArtefactNames, ArtefactScoringFunctionNames, AutoActionFunctionNames, CampBuffNames, SuitNames } from "../typescript/enums";
import { AllStackData } from "./StackData";
/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Brisingamens = {
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
const Draupnir = {
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
const FafnirBaleygr = {
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
const Gjallarhorn = {
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
const Hofud = {
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
const Hrafnsmerki = {
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
const Jarnglofi = {
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
const Megingjord = {
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
const Mjollnir = {
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
const OdroerirTheMythicCauldron = {
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
const Svalinn = {
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
const Vegvisir = {
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
const VidofnirVedrfolnir = {
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
export const mercenariesConfig = [
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
export const artefactsConfig = {
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
//# sourceMappingURL=CampData.js.map