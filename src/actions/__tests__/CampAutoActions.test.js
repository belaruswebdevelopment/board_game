import { ArtefactNames, CoinRusNames, CommonStageNames, ConfigNames, DrawNames, GameModeNames, HeroBuffNames, LogTypeNames, SuitNames } from "../../typescript/enums";
import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../CampAutoActions";
describe(`Test DiscardTradingCoinAction method`, () => {
    it(`should discard trading coin isOpened=true from board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: true,
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=false from board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard closed trading coin from board (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {},
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard opened trading coin from board (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            value: 0,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=true from board if player has Uline but trading coin on the board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: true,
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=false from board if player has Uline but trading coin on the board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but opened (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            value: 0,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but closed (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {},
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [],
                    handCoins: [
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [],
                    handCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard closed trading coin from hand if player has Uline but trading coin in the hand (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    handCoins: [
                        {},
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=true from hand if player has Uline but trading coin in the hand (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            value: 0,
                        },
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    handCoins: [
                        {
                            value: 0,
                        },
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin isOpened=true from board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: true,
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin isOpened=false from board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard closed special trading coin from board (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {},
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard opened special trading coin from board (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            value: 3,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin isOpened=true from board if player has Uline but trading coin on the board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: true,
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin isOpened=false from board if player has Uline but trading coin on the board (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin from board if player has Uline but trading coin on the board but opened (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin from board if player has Uline but trading coin on the board but closed (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [
                        {},
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin from hand if player has Uline but trading coin in the hand (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    boardCoins: [],
                    handCoins: [
                        {
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    boardCoins: [],
                    handCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special closed trading coin from hand if player has Uline but trading coin in the hand (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        {
                            isOpened: false,
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    handCoins: [
                        {},
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard special trading coin isOpened=true from hand if player has Uline but trading coin in the hand (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        {
                            type: CoinRusNames.SpecialTriggerTrading,
                            value: 3,
                        },
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 35,
                    handCoins: [
                        {
                            value: 3,
                        },
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    currentCoinsScore: 32,
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard trading coin if player hasn't trading coin and must throw Error (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [],
                    buffs: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`У игрока с id '0' на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player hasn't trading coin and must throw Error (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [],
                    buffs: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`У игрока с id '0' на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin and must throw Error (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [],
                    handCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует обменная монета при наличии бафа '${HeroBuffNames.EveryTurn}'.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin and must throw Error (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [],
                    handCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [],
                    handCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardTradingCoinAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует обменная монета при наличии бафа '${HeroBuffNames.EveryTurn}'.`);
    });
});
describe(`Test FinishOdroerirTheMythicCauldronAction method`, () => {
    it(`should finish odroerirTheMythicCauldron action`, () => {
        const G = {
            odroerirTheMythicCauldron: true,
        }, ctx = {};
        FinishOdroerirTheMythicCauldronAction({ G, ctx });
        expect(G).toStrictEqual({
            odroerirTheMythicCauldron: false,
        });
    });
});
describe(`Test StartDiscardSuitCardAction method`, () => {
    it(`should add active players with warriors cards to stage`, () => {
        const G = {
            publicPlayers: {
                0: {},
                1: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
        }, ctx = {
            currentPlayer: `0`,
            numPlayers: 2,
        };
        StartDiscardSuitCardAction({ G, ctx });
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {},
                1: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [
                        {
                            playerId: `1`,
                            priority: 0,
                        },
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
        });
        expect(ctx).toStrictEqual({
            currentPlayer: `0`,
            numPlayers: 2,
        });
    });
    it(`shouldn't add active player without warriors cards to stage`, () => {
        const G = {
            publicPlayers: {
                0: {},
                1: {
                    cards: {
                        warrior: [],
                    },
                    stack: [],
                },
                2: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
        }, ctx = {
            currentPlayer: `0`,
            numPlayers: 3,
        };
        StartDiscardSuitCardAction({ G, ctx });
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {},
                1: {
                    cards: {
                        warrior: [],
                    },
                    stack: [],
                },
                2: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [
                        {
                            playerId: `2`,
                            priority: 0,
                        },
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
        });
        expect(ctx).toStrictEqual({
            currentPlayer: `0`,
            numPlayers: 3,
        });
    });
    it(`should have 0 players without warriors cards and must log it`, () => {
        const G = {
            publicPlayers: {
                0: {},
                1: {
                    cards: {
                        warrior: [],
                    },
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
            numPlayers: 2,
        };
        StartDiscardSuitCardAction({ G, ctx });
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {},
                1: {
                    cards: {
                        warrior: [],
                    },
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Нет игроков с картами во фракции '${SuitNames.warrior}'.`,
                },
            ],
        });
        expect(ctx).toStrictEqual({
            currentPlayer: `0`,
            numPlayers: 2,
        });
    });
});
// TODO Can't be discarded coin but can be 1 trading coin on the pouch for Uline and no Uline.
describe(`Test StartVidofnirVedrfolnirAction method`, () => {
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=true value=3 (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=false value=3 (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 closed coins value=3 (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {},
                        {},
                    ],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=true value=3 (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins, but 1 isTriggerTrading, value=5 (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            isOpened: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            isOpened: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                5,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins, but 1 isTriggerTrading, value=5 (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            isOpened: false,
                            value: 0,
                        },
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {},
                        {},
                    ],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            isOpened: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            type: CoinRusNames.InitialTriggerTrading,
                            isOpened: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                5,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                5,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {},
                    ],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                5,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins if player has Uline (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins if player has Uline (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin just on the pouch and 1 coin in player's hands after trading) if player has Uline (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            value: 2,
                        },
                    ],
                    handCoins: [
                        {
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            value: 2,
                        },
                    ],
                    handCoins: [
                        {
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin just on the pouch and 1 coin in player's hands after trading) if player has Uline (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            value: 2,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            value: 2,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            value: 2,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            value: 2,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins (0 coin on the pouch because trading isn't happened and more then 2 coins in player's hands) if player has Uline (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins (0 coin on the pouch because trading isn't happened and more then 2 coins in player's hands) if player has Uline (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin on the pouch because trading was happened and more then 1 coins in player's hands) if player has Uline (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin on the pouch because trading was happened and more then 1 coins in player's hands) if player has Uline (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            value: 2,
                        },
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            value: 2,
                        },
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            value: 0,
                        },
                        {
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            value: 2,
                        },
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            value: 2,
                        },
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 if player has Uline (if multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 /all public board coin just opened by effect of adding coin to pouch Uline/ if player has Uline (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 /some public board coin just opened by effect of adding coin to pouch Uline/ if player has Uline (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {},
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                },
            },
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't have 0 coins in player's hands and 0 coins on the pouch if player has Uline (if multiplayer=false) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`При наличии бафа '${HeroBuffNames.EveryTurn}' всегда должно быть столько действий добавления монет в кошель, сколько ячеек для монет в кошеле пустые.`);
    });
    it(`shouldn't have closed coins on the pouch (if multiplayer=false) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {},
                        {
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`В массиве монет игрока с id '0' на поле не должна быть закрыта монета в кошеле с id '3'.`);
    });
    it(`shouldn't have 0 coins on the pouch if player hasn't Uline (if multiplayer=false) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.VidofnirVedrfolnir}', а не '0' монет(ы).`);
    });
    it(`shouldn't have 0 coins on the pouch if player hasn't Uline (if multiplayer=true) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [],
                    stack: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            StartVidofnirVedrfolnirAction({ G, ctx, myPlayerID: `0` });
        }).toThrowError(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.VidofnirVedrfolnir}', а не '0' монет(ы).`);
    });
});
//# sourceMappingURL=CampAutoActions.test.js.map