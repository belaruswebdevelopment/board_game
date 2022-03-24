import { suitsConfig } from "../../data/SuitData";
import { ArtefactNames, BuffNames, ConfigNames, DrawNames, GameNames, HeroNames, LogTypes, Phases, RusCardTypes, Stages, SuitNames, TavernNames } from "../../typescript/enums";
import { DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickDiscardCard, PlaceEnlistmentMercenariesAction } from "../Actions";
describe(`Test DiscardAnyCardFromPlayerBoardAction method`, () => {
    it(`should remove non-hero discarded card from player's cards to cards discard`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                            },
                        ],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                },
            },
            discardCardsDeck: [],
            logData: [],
        };
        DiscardAnyCardFromPlayerBoardAction(G, {
            currentPlayer: `0`,
        }, SuitNames.WARRIOR, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan отправил карту 'Test' в колоду сброса карт.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan потерял баф '${BuffNames.DiscardCardEndGame}'.`,
                },
            ],
        });
    });
    it(`should remove artefact discarded card from player's cards to camp cards discard`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                name: ArtefactNames.Brisingamens,
                                description: `Test`,
                                tier: 0,
                            },
                        ],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                },
            },
            discardCampCardsDeck: [],
            logData: [],
        };
        DiscardAnyCardFromPlayerBoardAction(G, {
            currentPlayer: `0`,
        }, SuitNames.WARRIOR, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCampCardsDeck: [
                {
                    name: ArtefactNames.Brisingamens,
                    description: `Test`,
                    tier: 0,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan отправил карту '${ArtefactNames.Brisingamens}' в колоду сброса карт лагеря.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan потерял баф '${BuffNames.DiscardCardEndGame}'.`,
                },
            ],
        });
    });
    it(`should remove mercenary player discarded card from player's cards to camp cards discard`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                variants: {},
                                suit: SuitNames.WARRIOR,
                            },
                        ],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                },
            },
            discardCampCardsDeck: [],
            logData: [],
        };
        DiscardAnyCardFromPlayerBoardAction(G, {
            currentPlayer: `0`,
        }, SuitNames.WARRIOR, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCampCardsDeck: [
                {
                    name: `Test`,
                    variants: {},
                    suit: SuitNames.WARRIOR,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan отправил карту 'Test' в колоду сброса карт лагеря.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan потерял баф '${BuffNames.DiscardCardEndGame}'.`,
                },
            ],
        });
    });
    it(`shouldn't remove hero discarded card from player's cards and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    cards: {
                        warrior: [
                            {
                                active: false,
                            },
                        ],
                    },
                },
            },
        };
        expect(() => {
            DiscardAnyCardFromPlayerBoardAction(G, {
                currentPlayer: `0`,
            }, SuitNames.WARRIOR, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    });
    it(`shouldn't remove non-exists player's card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    cards: {
                        warrior: [],
                    },
                },
            },
        };
        expect(() => {
            DiscardAnyCardFromPlayerBoardAction(G, {
                currentPlayer: `0`,
            }, SuitNames.WARRIOR, 0);
        }).toThrowError(`В массиве карт игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    });
});
describe(`Test DiscardCardFromTavernAction method`, () => {
    it(`should remove non-null card from tavern`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [
                    {
                        name: `Test`,
                    },
                ],
            ],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        };
        DiscardCardFromTavernAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [null],
            ],
            discardCardsDeck: [
                {
                    name: `Test`,
                },
            ],
            tavernCardDiscarded2Players: true,
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan отправил в колоду сброса карту из таверны:`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Карта 'Test' из таверны ${TavernNames.LaughingGoblin} убрана в сброс.`,
                },
            ],
        });
    });
    it(`shouldn't remove null card from tavern and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [null],
            ],
            logData: [],
        };
        expect(() => {
            DiscardCardFromTavernAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`Не удалось сбросить карту 0 из таверны`);
    });
    it(`shouldn't remove non-exists card from tavern and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [],
            ],
            logData: [],
        };
        expect(() => {
            DiscardCardFromTavernAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В текущей таверне отсутствует карта 0.`);
    });
});
describe(`Test GetEnlistmentMercenariesAction method`, () => {
    it(`should get mercenary card from player's camp cards to place`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            name: `Test`,
                            tier: 0,
                            variants: {},
                        },
                    ],
                    pickedCard: null,
                    stack: [
                        {},
                    ],
                },
            },
            logData: [],
        };
        GetEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            name: `Test`,
                            tier: 0,
                            variants: {},
                        },
                    ],
                    pickedCard: {
                        name: `Test`,
                        tier: 0,
                        variants: {},
                    },
                    stack: [
                        {},
                        {
                            config: {
                                name: ConfigNames.PlaceEnlistmentMercenaries,
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan во время фазы 'enlistmentMercenaries' выбрал наёмника 'Test'.`,
                },
            ],
        });
    });
    it(`shouldn't remove non-exists player's camp card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [],
                },
            },
        };
        expect(() => {
            GetEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
                phase: Phases.EnlistmentMercenaries,
            }, 0);
        }).toThrowError(`В массиве карт лагеря игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't remove null card from tavern and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [
                        {},
                    ],
                    pickedCard: null,
                },
            },
        };
        expect(() => {
            GetEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
                phase: Phases.EnlistmentMercenaries,
            }, 0);
        }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
    });
});
describe(`Test GetMjollnirProfitAction method`, () => {
    it(`should get suit for end game Mjollnir profit`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            getMjollnirProfit: true,
                        },
                    ],
                },
            },
            logData: [],
        };
        GetMjollnirProfitAction(G, {
            currentPlayer: `0`,
        }, SuitNames.HUNTER);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            suitIdForMjollnir: SuitNames.HUNTER,
                        },
                    ],
                },
            },
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
                    value: `Игрок Dan выбрал фракцию ${suitsConfig[SuitNames.HUNTER].suitName} для эффекта артефакта 'Mjollnir'.`,
                },
            ],
        });
    });
});
describe(`Test PassEnlistmentMercenariesAction method`, () => {
    it(`should first player pass on the beginning of 'enlistmentMercenaries' phase`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            logData: [],
        };
        PassEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        });
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan пасанул во время фазы '${Phases.EnlistmentMercenaries}'.`,
                },
            ],
        });
    });
});
describe(`Test PickDiscardCard method`, () => {
    it(`should pick non-action discarded card from discard deck`, () => {
        const G = {
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    pickedCard: null,
                    heroes: [],
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.WARRIOR,
                },
            ],
            logData: [],
        };
        PickDiscardCard(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    pickedCard: {
                        name: `Test`,
                        suit: SuitNames.WARRIOR,
                    },
                    heroes: [],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.WARRIOR,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
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
        });
    });
    it(`should pick action discarded card from discard deck`, () => {
        const G = {
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    pickedCard: null,
                    stack: [
                        {},
                    ],
                },
            },
            discardCardsDeck: [
                {
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
        };
        PickDiscardCard(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    pickedCard: {
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
                    stack: [
                        {},
                        {
                            config: {
                                name: ConfigNames.UpgradeCoin,
                                stageName: Stages.UpgradeCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        },
                    ],
                },
            },
            discardCardsDeck: [
                {
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
        });
    });
    it(`should add action to stack if actionsNum = 2`, () => {
        const G = {
            publicPlayers: {
                0: {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: null,
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.WARRIOR,
                },
            ],
            logData: [],
        };
        PickDiscardCard(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    actionsNum: 2,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: {
                        name: `Test`,
                        suit: SuitNames.WARRIOR,
                    },
                    stack: [
                        {},
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
                                name: `Test`,
                                suit: SuitNames.WARRIOR,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
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
        });
    });
    it(`should pick hero`, () => {
        const G = {
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: null,
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                rank: 1,
                            },
                        ],
                        miner: [
                            {
                                rank: 1,
                            },
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            },
                        ],
                        explorer: [
                            {
                                rank: 1,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                },
            ],
            logData: [],
        };
        PickDiscardCard(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [],
                    pickedCard: {
                        name: `Test`,
                        rank: 1,
                        suit: SuitNames.WARRIOR,
                    },
                    stack: [
                        {},
                        {
                            config: {
                                stageName: Stages.PickHero,
                                drawName: DrawNames.PickHero,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                            },
                        ],
                        hunter: [
                            {
                                rank: 1,
                            },
                        ],
                        miner: [
                            {
                                rank: 1,
                            },
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            },
                        ],
                        explorer: [
                            {
                                rank: 1,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
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
        });
    });
    it(`should move thrud`, () => {
        const G = {
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.HUNTER,
                            name: HeroNames.Thrud,
                        },
                    ],
                    pickedCard: null,
                    stack: [
                        {},
                    ],
                    cards: {
                        hunter: [
                            {
                                suit: SuitNames.HUNTER,
                                name: HeroNames.Thrud,
                            },
                        ],
                    },
                },
            },
            discardCardsDeck: [
                {
                    suit: SuitNames.HUNTER,
                    name: `Test`,
                },
            ],
            logData: [],
        };
        PickDiscardCard(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.HUNTER,
                            name: HeroNames.Thrud,
                        },
                    ],
                    pickedCard: {
                        suit: SuitNames.HUNTER,
                        name: `Test`,
                    },
                    stack: [
                        {},
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
                    ],
                    cards: {
                        hunter: [
                            {
                                suit: SuitNames.HUNTER,
                                name: `Test`,
                            },
                        ],
                    },
                },
            },
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
        });
    });
    it(`shouldn't remove non-exists discard card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {},
            },
            discardCardsDeck: [],
        };
        expect(() => {
            PickDiscardCard(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В массиве колоды сброса отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    });
});
describe(`Test PlaceEnlistmentMercenariesAction method`, () => {
    it(`should get mercenary card from player's camp cards to place`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            tier: 0,
                            path: ``,
                            name: `Test`,
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
                        tier: 0,
                        path: ``,
                        name: `Test`,
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
                    cards: {
                        blacksmith: [],
                        miner: [],
                    },
                    buffs: [],
                },
            },
            logData: [],
        };
        PlaceEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        }, SuitNames.BLACKSMITH);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARYPLAYERCARD,
                        suit: SuitNames.BLACKSMITH,
                        rank: 1,
                        points: null,
                        name: `Test`,
                        tier: 0,
                        path: ``,
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
                    cards: {
                        blacksmith: [
                            {
                                type: RusCardTypes.MERCENARYPLAYERCARD,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
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
                        miner: [],
                    },
                    buffs: [],
                },
            },
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
        });
    });
    it(`should get mercenary card from player's camp cards to place and pick hero`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            tier: 0,
                            path: ``,
                            name: `Test`,
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
                        tier: 0,
                        path: ``,
                        name: `Test`,
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
                        {},
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                rank: 1,
                            },
                        ],
                        miner: [
                            {
                                rank: 1,
                            },
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            },
                        ],
                        explorer: [
                            {
                                rank: 1,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
            logData: [],
        };
        PlaceEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        }, SuitNames.WARRIOR);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARYPLAYERCARD,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 6,
                        name: `Test`,
                        tier: 0,
                        path: ``,
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
                        {},
                        {
                            config: {
                                stageName: Stages.PickHero,
                                drawName: DrawNames.PickHero,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.MERCENARYPLAYERCARD,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                tier: 0,
                                path: ``,
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
                        hunter: [
                            {
                                rank: 1,
                            },
                        ],
                        miner: [
                            {
                                rank: 1,
                            },
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            },
                        ],
                        explorer: [
                            {
                                rank: 1,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
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
        });
    });
    it(`should get mercenary card from player's camp cards to place and move Thrud`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            tier: 0,
                            path: ``,
                            name: `Test`,
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
                        tier: 0,
                        path: ``,
                        name: `Test`,
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
                        {},
                    ],
                    cards: {
                        warrior: [
                            {
                                suit: SuitNames.WARRIOR,
                                name: HeroNames.Thrud,
                            },
                        ],
                    },
                },
            },
            logData: [],
        };
        PlaceEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        }, SuitNames.WARRIOR);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARYPLAYERCARD,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 6,
                        name: `Test`,
                        tier: 0,
                        path: ``,
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
                        {},
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
                                type: RusCardTypes.MERCENARYPLAYERCARD,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                tier: 0,
                                path: ``,
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
                    },
                },
            },
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
        });
    });
    it(`should get new mercenary card from player's camp cards to place`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            tier: 0,
                            variants: {},
                        },
                        {
                            tier: 0,
                            path: ``,
                            name: `Test`,
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
                        tier: 0,
                        path: ``,
                        name: `Test`,
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
                        {},
                    ],
                    cards: {
                        blacksmith: [],
                        miner: [],
                    },
                    buffs: [],
                },
            },
            logData: [],
        };
        PlaceEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        }, SuitNames.BLACKSMITH);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            tier: 0,
                            variants: {},
                        },
                    ],
                    heroes: [],
                    pickedCard: {
                        type: RusCardTypes.MERCENARYPLAYERCARD,
                        suit: SuitNames.BLACKSMITH,
                        rank: 1,
                        points: null,
                        name: `Test`,
                        tier: 0,
                        path: ``,
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
                        {},
                        {
                            config: {
                                name: ConfigNames.EnlistmentMercenaries,
                                drawName: DrawNames.EnlistmentMercenaries,
                            },
                        }
                    ],
                    cards: {
                        blacksmith: [
                            {
                                type: RusCardTypes.MERCENARYPLAYERCARD,
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                tier: 0,
                                path: ``,
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
                        miner: [],
                    },
                    buffs: [],
                },
            },
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
        });
    });
    it(`shouldn't get non-mercenary card from player's camp cards to place and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    pickedCard: {},
                },
            },
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
            }, SuitNames.BLACKSMITH);
        }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
    });
    it(`shouldn't get mercenary card which not exists in player's camp cards to place and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            tier: 0,
                            name: ``,
                            variants: {},
                        },
                    ],
                    pickedCard: {
                        tier: 0,
                        path: ``,
                        name: `Test`,
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
                        explorer: [],
                    },
                },
            },
            logData: [],
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
            }, SuitNames.EXPLORER);
        }).toThrowError(`У игрока в массиве карт лагеря отсутствует выбранная карта.`);
    });
    it(`shouldn't use non-existing suit in picked mercenary card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    pickedCard: {
                        tier: 0,
                        variants: {},
                    },
                },
            },
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
            }, SuitNames.HUNTER);
        }).toThrowError(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${SuitNames.HUNTER}'.`);
    });
});
//# sourceMappingURL=Action.test.js.map