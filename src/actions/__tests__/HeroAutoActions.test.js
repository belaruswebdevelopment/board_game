import { GetClosedCoinIntoPlayerHandAction } from "../HeroAutoActions";
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
    it(`should return all closed board coins to hand (multiplayer=true)`, () => {
        const G = {
            multiplayer: true,
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
            multiplayer: true,
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