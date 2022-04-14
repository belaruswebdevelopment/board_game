import { ArtefactNames, BuffNames, DrawNames, LogTypes, Stages, SuitNames } from "../../typescript/enums";
import { AddPickHeroAction, DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../CampAutoActions";
describe(`Test AddPickHeroAction method`, () => {
    it(`should add pick hero action to stack`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [],
                },
            },
            logData: [],
        };
        AddPickHeroAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {
                            config: {
                                stageName: Stages.PickHero,
                                drawName: DrawNames.PickHero,
                            },
                        }
                    ],
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' должен выбрать нового героя.`,
                },
            ],
        });
    });
});
describe(`Test DiscardTradingCoinAction method`, () => {
    it(`should discard trading coin isOpened=true from board (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: true,
                            isTriggerTrading: true,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=false from board (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: false,
                            isTriggerTrading: true,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard closed trading coin from board (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                    ],
                    buffs: [],
                },
            },
            logData: [],
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard opened trading coin from board (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                    buffs: [],
                },
            },
            logData: [],
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                    boardCoins: [
                        null,
                    ],
                    buffs: [],
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=true from board if player has Uline but trading coin on the board (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: true,
                            isTriggerTrading: true,
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
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
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
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=false from board if player has Uline but trading coin on the board (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: false,
                            isTriggerTrading: true,
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
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
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
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but opened (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isTriggerTrading: true,
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
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but closed (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
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
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [],
                    handCoins: [
                        {
                            isTriggerTrading: true,
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
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
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
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard closed trading coin from hand if player has Uline but trading coin in the hand (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
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
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin isOpened=true from hand if player has Uline but trading coin in the hand (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    handCoins: [
                        {
                            isTriggerTrading: true,
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
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard trading coin if player hasn't trading coin and must throw Error (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [],
                    buffs: [],
                },
            },
        };
        expect(() => {
            DiscardTradingCoinAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`У игрока с id '0' на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player hasn't trading coin and must throw Error (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
        };
        expect(() => {
            DiscardTradingCoinAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`У игрока с id '0' на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin and must throw Error (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
        };
        expect(() => {
            DiscardTradingCoinAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin and must throw Error (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
        };
        expect(() => {
            DiscardTradingCoinAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
    });
});
describe(`Test FinishOdroerirTheMythicCauldronAction method`, () => {
    it(`should finish odroerirTheMythicCauldron action`, () => {
        const G = {
            odroerirTheMythicCauldron: true,
        };
        FinishOdroerirTheMythicCauldronAction(G);
        expect(G).toEqual({
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
        }, ctx = {
            currentPlayer: `0`,
            numPlayers: 2,
        };
        StartDiscardSuitCardAction(G, ctx);
        expect(G).toEqual({
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
                            playerId: 1,
                        },
                    ],
                },
            },
        });
        expect(ctx).toEqual({
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
        }, ctx = {
            currentPlayer: `0`,
            numPlayers: 3,
        };
        StartDiscardSuitCardAction(G, ctx);
        expect(G).toEqual({
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
                            playerId: 2,
                        },
                    ],
                },
            },
        });
        expect(ctx).toEqual({
            currentPlayer: `0`,
            numPlayers: 3,
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't add all active players without warriors cards to stage and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {},
                1: {
                    cards: {
                        warrior: [],
                    },
                },
            },
        }, ctx = {
            currentPlayer: `0`,
            numPlayers: 2,
        };
        expect(() => {
            StartDiscardSuitCardAction(G, ctx);
        }).toThrowError(`Должны быть игроки с картами в фракции '${SuitNames.WARRIOR}'.`);
    });
});
describe(`Test StartVidofnirVedrfolnirAction method`, () => {
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=true value=3 (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=false value=3 (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 closed coins value=3 (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=true value=3 (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [],
                },
            },
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins, but 1 isTriggerTrading, value=5 (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins, but 1 isTriggerTrading, value=5 (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isOpened: false,
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins if player has Uline (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin just on the pouch and 1 coin in player's hands after trading) if player has Uline (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin just on the pouch and 1 coin in player's hands after trading) if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (0 coin on the pouch because trading coin was discarded and just 1 coin in player's hands) if player has Uline (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (0 coin on the pouch because trading coin was discarded and just 1 coin in player's hands) if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins (0 coin on the pouch because trading isn't happened and more then 2 coins in player's hands) if player has Uline (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 2 coins (0 coin on the pouch because trading isn't happened and more then 2 coins in player's hands) if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin on the pouch because trading was happened and more then 1 coins in player's hands) if player has Uline (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin on the pouch because trading was happened and more then 1 coins in player's hands) if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            value: 2,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 if player has Uline (if multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 /all public board coin just opened by effect of adding coin to pouch Uline/ if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: false,
                        },
                        {
                            value: 3,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
                        },
                        {
                            value: 3,
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: false,
                        },
                        {
                            value: 3,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
                        },
                        {
                            value: 3,
                            isTriggerTrading: false,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 /some public board coin just opened by effect of adding coin to pouch Uline/ if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
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
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 if player has Uline (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
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
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
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
                            isTriggerTrading: false,
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
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 if player has Uline (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
                            isTriggerTrading: false,
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
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [],
                },
            },
        };
        StartVidofnirVedrfolnirAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
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
                            isTriggerTrading: false,
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
                            isTriggerTrading: false,
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
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't have 0 coins in player's hands and 0 coins on the pouch if player has Uline (if multiplayer=false) and must throw Error`, () => {
        const G = {
            multiplayer: false,
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
        };
        expect(() => {
            StartVidofnirVedrfolnirAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`При наличии бафа '${BuffNames.EveryTurn}' всегда должно быть действие добавления монет в кошель, если обе ячейки для монет пустые.`);
    });
    it(`shouldn't have closed coins on the pouch (if multiplayer=false) and must throw Error`, () => {
        const G = {
            multiplayer: false,
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
                            isTriggerTrading: false,
                        },
                    ],
                    handCoins: [],
                    buffs: [],
                    stack: [],
                },
            },
        };
        expect(() => {
            StartVidofnirVedrfolnirAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`В массиве монет игрока с id '0' на поле не должна быть закрыта монета в кошеле с id '3'.`);
    });
    it(`shouldn't have 0 coins on the pouch if player hasn't Uline (if multiplayer=false) and must throw Error`, () => {
        const G = {
            multiplayer: false,
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
        };
        expect(() => {
            StartVidofnirVedrfolnirAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}', а не '0' монет(ы).`);
    });
    it(`shouldn't have 0 coins on the pouch if player hasn't Uline (if multiplayer=true) and must throw Error`, () => {
        const G = {
            multiplayer: true,
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
        };
        expect(() => {
            StartVidofnirVedrfolnirAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}', а не '0' монет(ы).`);
    });
});
//# sourceMappingURL=CampAutoActions.test.js.map