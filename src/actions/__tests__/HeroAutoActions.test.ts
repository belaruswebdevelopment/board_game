import type { Ctx } from "boardgame.io";
import { DrawNames, LogTypeNames, StageNames } from "../../typescript/enums";
import type { IMyGameState, IPlayer, IPublicPlayer, IStack } from "../../typescript/interfaces";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction } from "../HeroAutoActions";

describe(`Test AddPickHeroAction method`, (): void => {
    it(`should add pick hero action to stack`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [] as IStack[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        AddPickHeroAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 1);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {
                            stageName: StageNames.PickHero,
                            drawName: DrawNames.PickHero,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' должен выбрать нового героя.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
});

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
