import { DrawNames, GameModeNames, LogTypeNames, StageNames } from "../../typescript/enums";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction } from "../HeroAutoActions";
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
        }, 1);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {
                            stageName: StageNames.pickHero,
                            drawName: DrawNames.PickHero,
                            priority: 1,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' должен выбрать нового героя.`,
                },
            ],
        });
    });
});
describe(`Test GetClosedCoinIntoPlayerHandAction method`, () => {
    it(`should return all board coins to hand (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
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
            mode: GameModeNames.Basic,
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
    it(`should return all closed board coins to hand (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        {
                            isOpened: false,
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
            mode: GameModeNames.Multiplayer,
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
                            isOpened: false,
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
                    handCoins: [
                        {},
                    ],
                },
            },
            currentTavern: 0,
        });
    });
    it(`should return all isOpened=true board coins to hand (multiplayer=true)`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            value: 2,
                        },
                        {
                            isOpened: true,
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
                        {
                            isOpened: true,
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
            mode: GameModeNames.Multiplayer,
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
                            isOpened: true,
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
                    handCoins: [
                        {
                            isOpened: true,
                            value: 0,
                        },
                    ],
                },
            },
            currentTavern: 0,
        });
    });
});
// TODO Add tests for UpgradeMinCoinAction
//# sourceMappingURL=HeroAutoActions.test.js.map