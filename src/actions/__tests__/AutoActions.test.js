import { BuffNames, DrawNames, LogTypes, Stages } from "../../typescript/enums";
import { AddPickHeroAction, DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, GetClosedCoinIntoPlayerHandAction } from "../AutoActions";
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
                    value: `Игрок Dan должен выбрать нового героя.`,
                },
            ],
        });
    });
});
describe(`Test DiscardTradingCoinAction method`, () => {
    it(`should discard trading coin from board (multiplayer=false)`, () => {
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
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from board (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
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
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board (multiplayer=false)`, () => {
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
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
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
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
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
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
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
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: true,
                        },
                    ],
                    boardCoins: [],
                },
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
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
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard trading coin if player hasn't trading coin (multiplayer=false)`, () => {
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
        }).toThrowError(`У игрока на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player hasn't trading coin (multiplayer=true)`, () => {
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
        }).toThrowError(`У игрока на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin (multiplayer=false)`, () => {
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
        }).toThrowError(`В массиве монет игрока в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin (multiplayer=true)`, () => {
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
        }).toThrowError(`В массиве монет игрока в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
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
describe(`Test GetClosedCoinIntoPlayerHandAction method`, () => {
    it(`should return all board coins to hand (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 0,
                        },
                    ],
                    handCoins: [
                        null,
                    ],
                },
            },
            currentTavern: 0,
        };
        GetClosedCoinIntoPlayerHandAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            value: 0,
                        },
                    ],
                },
            },
            currentTavern: 0,
        });
    });
    it(`should return all board coins to hand (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        {
                            value: 0,
                        },
                    ],
                    handCoins: [
                        null,
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        {},
                    ],
                },
            },
            currentTavern: 0,
        };
        GetClosedCoinIntoPlayerHandAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            value: 0,
                        },
                    ],
                },
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        null,
                    ],
                },
            },
            currentTavern: 0,
        });
    });
});
//# sourceMappingURL=AutoActions.test.js.map