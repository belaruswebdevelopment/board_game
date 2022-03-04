import { BuffNames, DrawNames, LogTypes, Stages } from "../../typescript/enums";
import { AddPickHeroAction, DiscardTradingCoinAction, GetClosedCoinIntoPlayerHandAction } from "../AutoActions";
describe(`Test AddPickHeroAction method`, () => {
    it(`should add pick hero action to stack`, () => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    stack: [],
                },
            ],
            logData: [],
        };
        AddPickHeroAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            publicPlayers: [
                {
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
            ],
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
    it(`should discard trading coin from board`, () => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [],
                },
            ],
            logData: [],
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [],
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board`, () => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            ],
            logData: [],
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand`, () => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    handCoins: [
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: true,
                            value: 0,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            ],
            logData: [],
        };
        DiscardTradingCoinAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    handCoins: [
                        null,
                        null,
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard trading coin if player hasn't trading coin`, () => {
        const G = {
            publicPlayers: [
                {
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [],
                },
            ],
        };
        expect(() => {
            DiscardTradingCoinAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`У игрока не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin`, () => {
        const G = {
            publicPlayers: [
                {
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    handCoins: [
                        null,
                        null,
                        null,
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                },
            ],
        };
        expect(() => {
            DiscardTradingCoinAction(G, {
                currentPlayer: `0`,
            });
        }).toThrowError(`У игрока в 'handCoins' отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
    });
});
describe(`Test GetClosedCoinIntoPlayerHandAction method`, () => {
    it(`should return all board coins to hand`, () => {
        const G = {
            publicPlayers: [
                {
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    handCoins: [
                        null,
                        null,
                        null,
                        null,
                        null,
                    ],
                },
            ],
            currentTavern: 0,
        };
        GetClosedCoinIntoPlayerHandAction(G, {
            currentPlayer: `0`,
        });
        expect(G).toEqual({
            publicPlayers: [
                {
                    boardCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                        null,
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isInitial: true,
                            isTriggerTrading: true,
                            value: 0,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 5,
                        },
                        {
                            isInitial: true,
                            isTriggerTrading: false,
                            value: 4,
                        },
                        null,
                    ],
                },
            ],
            currentTavern: 0,
        });
    });
});
//# sourceMappingURL=AutoActions.test.js.map