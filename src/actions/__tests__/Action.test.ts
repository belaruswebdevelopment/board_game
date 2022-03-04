import type { Ctx } from "boardgame.io";
import { heroesConfig } from "../../data/HeroData";
import { suitsConfig } from "../../data/SuitData";
import { tavernsConfig } from "../../Tavern";
import { BuffNames, ConfigNames, DrawNames, GameNames, HeroNames, LogTypes, Phases, RusCardTypes, Stages, SuitNames } from "../../typescript/enums";
import type { ILogData, IMyGameState, IPublicPlayer } from "../../typescript/interfaces";
import { DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickDiscardCard, PlaceEnlistmentMercenariesAction } from "../Actions";

describe(`Test DiscardAnyCardFromPlayerBoardAction method`, (): void => {
    it(`should remove non-hero discarded card from player's cards`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 10,
                                name: `Test`,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                } as Pick<IPublicPlayer, `cards` | `buffs` | `nickname`>,
            ],
            discardCardsDeck: [],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>;
        DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, SuitNames.WARRIOR, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `cards` | `buffs` | `nickname`>,
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 10,
                    name: `Test`,
                    game: GameNames.Basic,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan потерял баф '${BuffNames.DiscardCardEndGame}'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan отправил карту 'Test' в колоду сброса.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`shouldn't remove hero discarded card from player's cards and must throw Error`, (): void => {
        const G = {
            publicPlayers: [
                {
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.HERO,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 8,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                                active: true,
                            },
                        ],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                } as Pick<IPublicPlayer, `cards`>,
            ],
        };
        expect((): void => {
            DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, SuitNames.WARRIOR, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    });
});

describe(`Test DiscardCardFromTavernAction method`, (): void => {
    it(`should remove non-null card from tavern`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                } as Pick<IPublicPlayer, `nickname`>,
            ],
            currentTavern: 0,
            taverns: [
                [
                    {
                        type: RusCardTypes.BASIC,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 10,
                        name: `Test`,
                        game: GameNames.Basic,
                        tier: 0,
                        path: ``,
                    },
                    null,
                    null,
                    null,
                    null,
                ],
                [null, null, null, null, null],
                [null, null, null, null, null],
            ],
            discardCardsDeck: [],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData` | `taverns` | `currentTavern`>;
        DiscardCardFromTavernAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                },
            ],
            currentTavern: 0,
            taverns: [
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 10,
                    name: `Test`,
                    game: GameNames.Basic,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan отправил в колоду сброса карту из таверны:`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Карта 'Test' из таверны ${tavernsConfig[0].name} убрана в сброс.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`>);
    });
    it(`shouldn't remove null card from tavern and must throw Error`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                } as Pick<IPublicPlayer, `nickname`>,
            ],
            currentTavern: 0,
            taverns: [
                [null, null, null, null, null],
                [null, null, null, null, null],
                [null, null, null, null, null],
            ],
            logData: [],
        } as Pick<IMyGameState, `currentTavern` | `taverns` | `logData`>;
        expect((): void => {
            DiscardCardFromTavernAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, 0);
        }).toThrowError(`Не удалось сбросить лишнюю карту из таверны.`);
    });
});

describe(`Test GetEnlistmentMercenariesAction method`, (): void => {
    it(`should get mercenary card from player's camp cards to place`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                            },
                        },
                    ],
                    pickedCard: null,
                    stack: [
                        {
                            config: {
                                name: ConfigNames.EnlistmentMercenaries,
                                drawName: DrawNames.EnlistmentMercenaries,
                            },
                        },
                    ],
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `pickedCard` | `stack`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        GetEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                            },
                        },
                    ],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        game: GameNames.Thingvellir,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            blacksmith: {
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                            },
                        },
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.EnlistmentMercenaries,
                                drawName: DrawNames.EnlistmentMercenaries,
                            },
                        },
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan во время фазы 'enlistmentMercenaries' выбрал наёмника 'Test'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    // Unreal to reproduce
    // it(`shouldn't remove null card from tavern and must throw Error`, (): void => {
    //     expect((): void => {
    //         GetEnlistmentMercenariesAction(G as IMyGameState, {
    //             currentPlayer: `0`,
    //             phase: Phases.EnlistmentMercenaries,
    //         } as Ctx, 0);
    //     }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
    // });
});

describe(`Test GetMjollnirProfitAction method`, (): void => {
    it(`should get suit for end game Mjollnir profit`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    buffs: [
                        {
                            getMjollnirProfit: true,
                        },
                    ],
                } as Pick<IPublicPlayer, `nickname` | `buffs`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        GetMjollnirProfitAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, SuitNames.HUNTER);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    buffs: [
                        {
                            suitIdForMjollnir: SuitNames.HUNTER,
                        },
                    ],
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan получил баф '${BuffNames.SuitIdForMjollnir}'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan потерял баф '${BuffNames.GetMjollnirProfit}'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan выбрал фракцию ${suitsConfig[SuitNames.HUNTER].suitName} для эффекта артефакта Mjollnir.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test PassEnlistmentMercenariesAction method`, (): void => {
    it(`should first player pass on the beginning of 'enlistmentMercenaries' phase`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                } as Pick<IPublicPlayer, `nickname`>,
            ],
            logData: [] as ILogData[],
        };
        PassEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        } as Ctx);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan пасанул во время фазы '${Phases.EnlistmentMercenaries}'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test PickDiscardCard method`, (): void => {
    it(`should pick non-action discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    pickedCard: null,
                    heroes: [],
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `pickedCard` | `heroes` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 10,
                    name: `Test`,
                    game: GameNames.Basic,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>;
        PickDiscardCard(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    pickedCard: {
                        type: RusCardTypes.BASIC,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 10,
                        name: `Test`,
                        game: GameNames.Basic,
                        tier: 0,
                        path: ``,
                    },
                    heroes: [],
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 10,
                                name: `Test`,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `pickedCard` | `heroes` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.WARRIOR].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan взял карту 'Test' из колоды сброса.`,
                },
            ],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>);
    });
    it(`should pick action discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    pickedCard: null,
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                    ],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `pickedCard` | `stack`>,
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.ACTION,
                    value: 5,
                    stack: [
                        {
                            config: {
                                name: ConfigNames.UpgradeCoin,
                                stageName: Stages.UpgradeCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        }
                    ],
                    name: `Test`,
                },
            ],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>;
        PickDiscardCard(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    pickedCard: {
                        type: RusCardTypes.ACTION,
                        value: 5,
                        stack: [
                            {
                                config: {
                                    name: ConfigNames.UpgradeCoin,
                                    stageName: Stages.UpgradeCoin,
                                    value: 5,
                                    drawName: DrawNames.UpgradeCoin,
                                },
                            },
                        ],
                        name: `Test`,
                    },
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                        {
                            config: {
                                name: ConfigNames.UpgradeCoin,
                                stageName: Stages.UpgradeCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `pickedCard` | `stack`>,
            ],
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan взял карту 'Test' из колоды сброса.`,
                },
            ],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>);
    });
    it(`should pick artefact discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: null,
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.ARTEFACT,
                    tier: 0,
                    path: ``,
                    name: `Test`,
                    description: `Test`,
                    game: GameNames.Thingvellir,
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 13,
                    buff: undefined,
                    validators: undefined,
                    actions: undefined,
                    stack: undefined,
                },
            ],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>;
        PickDiscardCard(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.ARTEFACT,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        description: `Test`,
                        game: GameNames.Thingvellir,
                        suit: SuitNames.EXPLORER,
                        rank: 1,
                        points: 13,
                        buff: undefined,
                        validators: undefined,
                        actions: undefined,
                        stack: undefined,
                    },
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [
                            {
                                type: RusCardTypes.ARTEFACT,
                                tier: 0,
                                path: ``,
                                name: `Test`,
                                description: `Test`,
                                game: GameNames.Thingvellir,
                                suit: SuitNames.EXPLORER,
                                rank: 1,
                                points: 13,
                                buff: undefined,
                                validators: undefined,
                                actions: undefined,
                                stack: undefined,
                            },
                        ],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypes.PRIVATE,
                    value: `Игрок Dan выбрал карту кэмпа 'Test' во фракцию ${suitsConfig[SuitNames.EXPLORER].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan взял карту 'Test' из колоды сброса.`,
                },
            ],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>);
    });
    it(`shouldn't add action to stack if actionsNum = 1`, (): void => {
        const G = {
            publicPlayers: [
                {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: null,
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 10,
                    name: `Test`,
                    game: GameNames.Basic,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>;
        PickDiscardCard(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.BASIC,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 10,
                        name: `Test`,
                        game: GameNames.Basic,
                        tier: 0,
                        path: ``,
                    },
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 10,
                                name: `Test`,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            }
                        ],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.WARRIOR].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan взял карту 'Test' из колоды сброса.`,
                },
            ],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>);
    });
    it(`should pick hero`, (): void => {
        const G = {
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: null,
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.HUNTER,
                                rank: 1,
                                points: null,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        miner: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.MINER,
                                rank: 1,
                                points: 0,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        blacksmith: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        explorer: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.EXPLORER,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 10,
                    name: `Test`,
                    game: GameNames.Basic,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>;
        PickDiscardCard(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.BASIC,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 10,
                        name: `Test`,
                        game: GameNames.Basic,
                        tier: 0,
                        path: ``,
                    },
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.PickHero,
                                drawName: DrawNames.PickHero,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 10,
                                name: `Test`,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        hunter: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.HUNTER,
                                rank: 1,
                                points: null,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        miner: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.MINER,
                                rank: 1,
                                points: 0,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        blacksmith: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        explorer: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.EXPLORER,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.WARRIOR].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan должен выбрать нового героя.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan взял карту 'Test' из колоды сброса.`,
                },
            ],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>);
    });
    it(`should move thrud`, (): void => {
        const G = {
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.HUNTER,
                            rank: 1,
                            points: null,
                            type: RusCardTypes.HERO,
                            name: HeroNames.Thrud,
                            game: GameNames.Basic,
                            description: heroesConfig.Thrud.description,
                            active: true,
                        },
                    ],
                    pickedCard: null,
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                suit: SuitNames.HUNTER,
                                rank: 1,
                                points: null,
                                type: RusCardTypes.HERO,
                                name: HeroNames.Thrud,
                                game: GameNames.Basic,
                                description: heroesConfig.Thrud.description,
                                active: true,
                            },
                        ],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`>,
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                    name: `Test`,
                    game: GameNames.Basic,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>;
        PickDiscardCard(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: [
                {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.HUNTER,
                            rank: 1,
                            points: null,
                            type: RusCardTypes.HERO,
                            name: HeroNames.Thrud,
                            game: GameNames.Basic,
                            description: heroesConfig.Thrud.description,
                            active: true,
                        },
                    ],
                    pickedCard: {
                        type: RusCardTypes.BASIC,
                        suit: SuitNames.HUNTER,
                        rank: 1,
                        points: null,
                        name: `Test`,
                        game: GameNames.Basic,
                        tier: 0,
                        path: ``,
                    },
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: 2,
                            },
                        },
                        {
                            variants: {
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                                hunter: {
                                    suit: SuitNames.HUNTER,
                                    rank: 1,
                                    points: null,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: null,
                                },
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: null,
                                },
                                miner: {
                                    suit: SuitNames.MINER,
                                    rank: 1,
                                    points: null,
                                },
                            },
                            config: {
                                stageName: Stages.PlaceThrudHero,
                                name: ConfigNames.PlaceThrudHero,
                                drawName: DrawNames.Thrud,
                                suit: SuitNames.HUNTER,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.PickDiscardCard,
                                name: ConfigNames.BrisingamensAction,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.HUNTER,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                game: GameNames.Basic,
                                tier: 0,
                                path: ``,
                            },
                        ],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                } as Pick<IPublicPlayer, `actionsNum` | `nickname` | `heroes` | `pickedCard` | `stack` | `cards`>,
            ],
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.HUNTER].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan взял карту 'Test' из колоды сброса.`,
                },
            ],
        } as Pick<IMyGameState, `discardCardsDeck` | `logData`>);
    });
});

describe(`Test PlaceEnlistmentMercenariesAction method`, (): void => {
    it(`should get mercenary card from player's camp cards to place`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: ``,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                            },
                        },
                    ],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        game: GameNames.Thingvellir,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            blacksmith: {
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                            },
                        },
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        PlaceEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        } as Ctx, SuitNames.BLACKSMITH);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: ``,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                    ],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        suit: SuitNames.BLACKSMITH,
                        rank: 1,
                        points: null,
                        name: `Test`,
                        tier: 0,
                        path: ``,
                        game: GameNames.Thingvellir,
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                        {
                            config: {
                                name: ConfigNames.EnlistmentMercenaries,
                                drawName: DrawNames.EnlistmentMercenaries,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [
                            {
                                type: RusCardTypes.MERCENARY,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.BLACKSMITH].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan во время фазы 'Enlistment Mercenaries' завербовал наёмника 'Test'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`should get mercenary card from player's camp cards to place and pick hero`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: ``,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                            },
                        },
                    ],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        game: GameNames.Thingvellir,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            blacksmith: {
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                            },
                        },
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.HUNTER,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        miner: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.MINER,
                                rank: 1,
                                points: 0,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        blacksmith: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        explorer: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.EXPLORER,
                                rank: 1,
                                points: 11,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        PlaceEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        } as Ctx, SuitNames.WARRIOR);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: ``,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                    ],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 6,
                        name: `Test`,
                        tier: 0,
                        path: ``,
                        game: GameNames.Thingvellir,
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.PickHero,
                                drawName: DrawNames.PickHero,
                            },
                        },
                        {
                            config: {
                                name: ConfigNames.EnlistmentMercenaries,
                                drawName: DrawNames.EnlistmentMercenaries,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.MERCENARY,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        hunter: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.HUNTER,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        miner: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.MINER,
                                rank: 1,
                                points: 0,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        blacksmith: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        explorer: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: SuitNames.EXPLORER,
                                rank: 1,
                                points: 11,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.WARRIOR].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan во время фазы 'Enlistment Mercenaries' завербовал наёмника 'Test'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan должен выбрать нового героя.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`should get mercenary card from player's camp cards to place and move Thrud`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                    ],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        game: GameNames.Thingvellir,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            explorer: {
                                suit: SuitNames.EXPLORER,
                                rank: 1,
                                points: 8,
                            },
                        },
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 9,
                                type: RusCardTypes.HERO,
                                name: HeroNames.Thrud,
                                game: GameNames.Basic,
                                description: heroesConfig.Thrud.description,
                                active: true,
                            },
                        ],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `pickedCard` | `stack` | `cards`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        PlaceEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        } as Ctx, SuitNames.WARRIOR);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 6,
                        name: `Test`,
                        tier: 0,
                        path: ``,
                        game: GameNames.Thingvellir,
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                        {
                            variants: {
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                                hunter: {
                                    suit: SuitNames.HUNTER,
                                    rank: 1,
                                    points: null,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: null,
                                },
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: null,
                                },
                                miner: {
                                    suit: SuitNames.MINER,
                                    rank: 1,
                                    points: null,
                                },
                            },
                            config: {
                                stageName: Stages.PlaceThrudHero,
                                name: ConfigNames.PlaceThrudHero,
                                drawName: DrawNames.Thrud,
                                suit: SuitNames.WARRIOR,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.MERCENARY,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `pickedCard` | `stack` | `cards`>,
            ],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.WARRIOR].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan во время фазы 'Enlistment Mercenaries' завербовал наёмника 'Test'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`shouldn't get new mercenary card from player's camp cards to place`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                            },
                        },
                    ],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        game: GameNames.Thingvellir,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            blacksmith: {
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                            },
                        },
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        PlaceEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        } as Ctx, SuitNames.BLACKSMITH);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    campCards: [],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        suit: SuitNames.BLACKSMITH,
                        rank: 1,
                        points: null,
                        name: `Test`,
                        tier: 0,
                        path: ``,
                        game: GameNames.Thingvellir,
                    },
                    stack: [
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                    cards: {
                        warrior: [],
                        hunter: [],
                        miner: [],
                        blacksmith: [
                            {
                                type: RusCardTypes.MERCENARY,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                            },
                        ],
                        explorer: [],
                    },
                    buffs: [],
                } as Pick<IPublicPlayer, `nickname` | `campCards` | `heroes` | `pickedCard` | `stack` | `cards`
                    | `buffs`>,
            ],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок Dan выбрал карту 'Test' во фракцию ${suitsConfig[SuitNames.BLACKSMITH].suitName}.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan во время фазы 'Enlistment Mercenaries' завербовал наёмника 'Test'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't get non-mercenary card from player's camp cards to place and must throw Error`, ():
        void => {
        const G = {
            publicPlayers: [
                {
                    pickedCard: {
                        type: RusCardTypes.ARTEFACT,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        description: `Test`,
                        game: GameNames.Thingvellir,
                        suit: SuitNames.EXPLORER,
                        rank: 1,
                        points: 13,
                        buff: undefined,
                        validators: undefined,
                        actions: undefined,
                        stack: undefined,
                    },
                } as Pick<IPublicPlayer, `pickedCard`>,
            ],
        };
        expect((): void => {
            PlaceEnlistmentMercenariesAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, SuitNames.BLACKSMITH);
        }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
    });
    it(`shouldn't get mercenary card which not exists in player's camp cards to place and must throw Error`,
        (): void => {
            const G = {
                publicPlayers: [
                    {
                        nickname: `Dan`,
                        campCards: [
                            {
                                type: RusCardTypes.MERCENARY,
                                tier: 0,
                                path: ``,
                                name: ``,
                                game: GameNames.Thingvellir,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.WARRIOR,
                                        rank: 1,
                                        points: 6,
                                    },
                                    explorer: {
                                        suit: SuitNames.EXPLORER,
                                        rank: 1,
                                        points: 8,
                                    },
                                },
                            },
                        ],
                        pickedCard: {
                            type: RusCardTypes.MERCENARY,
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            game: GameNames.Thingvellir,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.EXPLORER,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                        cards: {
                            warrior: [],
                            hunter: [],
                            miner: [],
                            blacksmith: [],
                            explorer: [],
                        },
                    } as Pick<IPublicPlayer, `nickname` | `campCards` | `pickedCard` | `cards`>,
                ],
                logData: [],
            } as Pick<IMyGameState, `logData`>;
            expect((): void => {
                PlaceEnlistmentMercenariesAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, SuitNames.EXPLORER);
            }).toThrowError(`У игрока в 'campCards' отсутствует выбранная карта.`);
        });
    it(`shouldn't use non-existing suit in picked mercenary card and must throw Error`, (): void => {
        const G = {
            publicPlayers: [
                {
                    pickedCard: {
                        type: RusCardTypes.MERCENARY,
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        game: GameNames.Thingvellir,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            blacksmith: {
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                            },
                        },
                    },
                } as Pick<IPublicPlayer, `pickedCard`>,
            ],
        };
        expect((): void => {
            PlaceEnlistmentMercenariesAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, SuitNames.HUNTER);
        }).toThrowError(`У выбранной карты отсутствует обязательный параметр 'variants[suit]'.`);
    });
    // Unreal to reproduce
    // it(`shouldn't exists mercenary card with non-existing param 'stack[0].variants' and must throw Error`,
    //     (): void => {
    //         expect((): void => {
    //             PlaceEnlistmentMercenariesAction(G as IMyGameState, {
    //                 currentPlayer: `0`,
    //                 phase: Phases.EnlistmentMercenaries,
    //             } as Ctx, SuitNames.BLACKSMITH);
    //         }).toThrowError(`У выбранной карты отсутствует обязательный параметр 'stack[0].variants'.`);
    //     });
});
