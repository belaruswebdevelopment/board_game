import { AutoActionFunctionNames, GameNames, HeroBuffNames, HeroDescriptionNames, HeroNames, HeroScoringFunctionNames, MultiSuitCardNames, SuitNames } from "../typescript/enums";
import { AllStackData } from "./StackData";
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Aegur = {
    name: HeroNames.Aegur,
    description: HeroDescriptionNames.Aegur,
    game: GameNames.Basic,
    suit: SuitNames.blacksmith,
    rank: 2,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Andumia = {
    name: HeroNames.Andumia,
    description: HeroDescriptionNames.Andumia,
    game: GameNames.Thingvellir,
    points: 12,
    validators: {
        pickDiscardCardToStack: {},
    },
    stack: {
        player: [AllStackData.pickDiscardCardAndumia()],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [12],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Aral = {
    name: HeroNames.Aral,
    description: HeroDescriptionNames.Aral,
    game: GameNames.Basic,
    suit: SuitNames.hunter,
    rank: 2,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Astrid = {
    name: HeroNames.Astrid,
    description: HeroDescriptionNames.Astrid,
    game: GameNames.Basic,
    scoringRule: {
        name: HeroScoringFunctionNames.AstridScoring,
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Bonfur = {
    name: HeroNames.Bonfur,
    description: HeroDescriptionNames.Bonfur,
    game: GameNames.Basic,
    suit: SuitNames.blacksmith,
    rank: 3,
    pickValidators: {
        discardCard: {
            suit: SuitNames.blacksmith,
        },
    },
    stack: {
        player: [AllStackData.discardCardFromBoardBonfur()],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Crovax_The_Doppelganger = {
    name: HeroNames.Crovax_The_Doppelganger,
    description: HeroDescriptionNames.Crovax_The_Doppelganger,
    game: GameNames.Thingvellir,
    points: 25,
    pickValidators: {
        discardCard: {
            suit: null,
        },
    },
    stack: {
        player: [AllStackData.discardCardFromBoardCrovaxTheDoppelganger()],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [25],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dagda = {
    name: HeroNames.Dagda,
    description: HeroDescriptionNames.Dagda,
    game: GameNames.Basic,
    suit: SuitNames.hunter,
    rank: 3,
    pickValidators: {
        discardCard: {
            suit: SuitNames.hunter,
            number: 2,
        },
    },
    stack: {
        player: [AllStackData.discardCardFromBoardDagda()],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Aesir = {
    name: HeroNames.Dwerg_Aesir,
    description: HeroDescriptionNames.Dwerg_Aesir,
    game: GameNames.Basic,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [1],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Bergelmir = {
    name: HeroNames.Dwerg_Bergelmir,
    description: HeroDescriptionNames.Dwerg_Bergelmir,
    game: GameNames.Basic,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [1],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Jungir = {
    name: HeroNames.Dwerg_Jungir,
    description: HeroDescriptionNames.Dwerg_Jungir,
    game: GameNames.Basic,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [1],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Sigmir = {
    name: HeroNames.Dwerg_Sigmir,
    description: HeroDescriptionNames.Dwerg_Sigmir,
    game: GameNames.Basic,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [1],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Ymir = {
    name: HeroNames.Dwerg_Ymir,
    description: HeroDescriptionNames.Dwerg_Ymir,
    game: GameNames.Basic,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [1],
    },
};
// TODO For Solo game `Replace the coin of value 2 at the start of the game with a coin of value 9 and add 7 points to the final Bravery Value.`
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Grid = {
    name: HeroNames.Grid,
    description: HeroDescriptionNames.Grid,
    game: GameNames.Basic,
    points: 7,
    stack: {
        player: [AllStackData.upgradeCoin(7)],
        soloBot: [AllStackData.upgradeCoinSoloBot(7)],
        soloBotAndvari: [AllStackData.upgradeCoinSoloBotAndvari(7)],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [7],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Holda = {
    name: HeroNames.Holda,
    description: HeroDescriptionNames.Holda,
    game: GameNames.Thingvellir,
    points: 12,
    buff: {
        name: HeroBuffNames.GoCampOneTime,
    },
    validators: {
        pickCampCardToStack: {},
    },
    stack: {
        player: [AllStackData.pickCampCardHolda()],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [12],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Hourya = {
    name: HeroNames.Hourya,
    description: HeroDescriptionNames.Hourya,
    game: GameNames.Basic,
    suit: SuitNames.explorer,
    rank: 1,
    points: 20,
    pickValidators: {
        conditions: {
            suitCountMin: {
                suit: SuitNames.explorer,
                value: 5,
            },
        },
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Idunn = {
    name: HeroNames.Idunn,
    description: HeroDescriptionNames.Idunn,
    game: GameNames.Basic,
    suit: SuitNames.explorer,
    rank: 1,
    points: 7,
    scoringRule: {
        name: HeroScoringFunctionNames.IdunnScoring,
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Jarika = {
    name: HeroNames.Jarika,
    description: HeroDescriptionNames.Jarika,
    game: GameNames.Basic,
    points: 8,
    buff: {
        name: HeroBuffNames.UpgradeCoin,
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [8],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Khrad = {
    name: HeroNames.Khrad,
    description: HeroDescriptionNames.Khrad,
    game: GameNames.Thingvellir,
    points: 4,
    actions: {
        name: AutoActionFunctionNames.UpgradeMinCoinAction,
        params: [10],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [4],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Kraal = {
    name: HeroNames.Kraal,
    description: HeroDescriptionNames.Kraal,
    game: GameNames.Basic,
    suit: SuitNames.warrior,
    rank: 2,
    points: 7,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Lokdur = {
    name: HeroNames.Lokdur,
    description: HeroDescriptionNames.Lokdur,
    game: GameNames.Basic,
    suit: SuitNames.miner,
    rank: 1,
    points: 3,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Olwin = {
    name: HeroNames.Olwin,
    description: HeroDescriptionNames.Olwin,
    game: GameNames.Thingvellir,
    points: 9,
    stack: {
        player: [AllStackData.placeMultiSuitsCards(MultiSuitCardNames.OlwinsDouble)],
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [9],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Skaa = {
    name: HeroNames.Skaa,
    description: HeroDescriptionNames.Skaa,
    game: GameNames.Basic,
    points: 17,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [17],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Tarah = {
    name: HeroNames.Tarah,
    description: HeroDescriptionNames.Tarah,
    game: GameNames.Basic,
    suit: SuitNames.warrior,
    rank: 1,
    points: 14,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
// TODO For Solo Game `She is the most formidable opponent since she will always be present in your army to try to complete the guard lines and recruit the Dwerg brothers.During the countdown, she returns to the Command Zone and adds 13 points to the Final Bravery Value.`
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Thrud = {
    name: HeroNames.Thrud,
    description: HeroDescriptionNames.Thrud,
    game: GameNames.Basic,
    points: 13,
    stack: {
        player: [AllStackData.placeThrudHero()],
        soloBot: [AllStackData.placeThrudHeroSoloBot()],
        soloBotAndvari: [AllStackData.placeThrudHeroSoloBotAndvari()],
    },
    buff: {
        name: HeroBuffNames.MoveThrud,
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [13],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Uline = {
    name: HeroNames.Uline,
    description: HeroDescriptionNames.Uline,
    game: GameNames.Basic,
    points: 9,
    actions: {
        name: AutoActionFunctionNames.GetClosedCoinIntoPlayerHandAction,
    },
    buff: {
        name: HeroBuffNames.EveryTurn,
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [9],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Ylud = {
    name: HeroNames.Ylud,
    description: HeroDescriptionNames.Ylud,
    game: GameNames.Basic,
    buff: {
        name: HeroBuffNames.EndTier,
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Zolkur = {
    name: HeroNames.Zolkur,
    description: HeroDescriptionNames.Zolkur,
    game: GameNames.Thingvellir,
    points: 10,
    buff: {
        name: HeroBuffNames.UpgradeNextCoin,
    },
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [10],
    },
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Zoral = {
    name: HeroNames.Zoral,
    description: HeroDescriptionNames.Zoral,
    game: GameNames.Basic,
    suit: SuitNames.miner,
    rank: 3,
    points: 1,
    scoringRule: {
        name: HeroScoringFunctionNames.BasicHeroScoring,
        params: [0],
    },
};
/**
 * <h3>Конфиг героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 */
export const heroesConfig = {
    Kraal,
    Tarah,
    Aral,
    Dagda,
    Lokdur,
    Zoral,
    Aegur,
    Bonfur,
    Hourya,
    Idunn,
    Astrid,
    Dwerg_Aesir,
    Dwerg_Bergelmir,
    Dwerg_Jungir,
    Dwerg_Sigmir,
    Dwerg_Ymir,
    Grid,
    Skaa,
    Thrud,
    Uline,
    Ylud,
    Jarika,
    Crovax_The_Doppelganger,
    Andumia,
    Holda,
    Khrad,
    Olwin,
    Zolkur,
};
/**
 * <h3>Конфиг героев для выбора соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании списка героев для выбора соло ботом при инициализации игры.</li>
 * </ol>
 */
export const soloGameHeroesForBotConfig = {
    Dwerg_Aesir,
    Dwerg_Bergelmir,
    Dwerg_Jungir,
    Dwerg_Sigmir,
    Dwerg_Ymir,
};
/**
 * <h3>Конфиг героев для выбора игроком в соло игре.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании списка героев для выбора игроком в соло игре при инициализации игры.</li>
 * </ol>
 */
export const soloGameHeroesForPlayerConfig = {
    Kraal,
    Tarah,
    Aral,
    Dagda,
    Lokdur,
    Zoral,
    Aegur,
    Bonfur,
    Hourya,
    Idunn,
};
/**
 * <h3>Конфиг героев для выбора уровня сложности.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании списка героев для выбора уровня сложности для соло бота при инициализации игры.</li>
 * </ol>
 */
export const soloGameDifficultyLevelHeroesConfig = {
    Astrid,
    Grid,
    Skaa,
    Thrud,
    Uline,
    Ylud,
};
/**
 * <h3>Конфиг героев для лёгких стратегий соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при выборе лёгких стратегий для соло бота Андвари при инициализации игры.</li>
 * </ol>
 */
export const soloGameAndvariEasyStrategyHeroesConfig = {
    Bonfur,
    Hourya,
    Kraal,
    Zoral,
    Dagda,
};
/**
 * <h3>Конфиг героев для сложных стратегий соло бота Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при выборе сложных стратегий для соло бота Андвари при инициализации игры.</li>
 * </ol>
 */
export const soloGameAndvariHardStrategyHeroesConfig = {
    Lokdur,
    Idunn,
    Tarah,
    Aral,
    Aegur,
};
/**
 * <h3>Конфиг героев для выбора игроками в соло игре с соло ботом Андвари.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании героев для выбора игроками в соло игре с соло ботом Андвари при инициализации игры.</li>
 * </ol>
 */
export const soloGameAndvariHeroesForPlayersConfig = {
    Astrid,
    Dwerg_Aesir,
    Dwerg_Bergelmir,
    Dwerg_Jungir,
    Dwerg_Sigmir,
    Dwerg_Ymir,
    Grid,
    Skaa,
    Thrud,
    Uline,
    Ylud,
};
//# sourceMappingURL=HeroData.js.map