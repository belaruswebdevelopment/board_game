import type { Ctx } from "boardgame.io";
import type { IMyGameState, IPlayer, IPublicPlayer } from "../../typescript/interfaces";
import { GetClosedCoinIntoPlayerHandAction } from "../HeroAutoActions";

describe(`Test GetClosedCoinIntoPlayerHandAction method`, (): void => {
    it(`should return all board coins to hand (multiplayer=false)`, (): void => {
        const G = {
            multiplayer: false,
            players: {
                0: {} as IPlayer,
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `multiplayer`>;
        GetClosedCoinIntoPlayerHandAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {} as IPlayer,
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `multiplayer`>);
    });
    it(`should return all closed board coins to hand (multiplayer=true)`, (): void => {
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
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `multiplayer`>;
        GetClosedCoinIntoPlayerHandAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
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
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `multiplayer`>);
    });
    it(`should return all isOpened=true board coins to hand (multiplayer=true)`, (): void => {
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
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `multiplayer`>;
        GetClosedCoinIntoPlayerHandAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
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
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `multiplayer`>);
    });
});

// TODO Add tests for UpgradeMinCoinAction
