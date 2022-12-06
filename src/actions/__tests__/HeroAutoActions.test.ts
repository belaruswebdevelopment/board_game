import { CommonStageNames, DrawNames, GameModeNames, LogTypeNames } from "../../typescript/enums";
import type { Ctx, IMyGameState, IPlayer, IPublicPlayer, IStack, MyFnContextWithMyPlayerID } from "../../typescript/interfaces";
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
        } as Pick<IMyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        AddPickHeroAction({ G, ctx } as MyFnContextWithMyPlayerID, 1);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {
                            stageName: CommonStageNames.ClickHeroCard,
                            drawName: DrawNames.PickHero,
                            priority: 1,
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
            mode: GameModeNames.Basic,
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
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        GetClosedCoinIntoPlayerHandAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
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
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>);
    });
    it(`should return all closed board coins to hand (multiplayer=true)`, (): void => {
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
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        GetClosedCoinIntoPlayerHandAction({ G, ctx } as MyFnContextWithMyPlayerID);
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
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>);
    });
    it(`should return all isOpened=true board coins to hand (multiplayer=true)`, (): void => {
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
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        GetClosedCoinIntoPlayerHandAction({ G, ctx } as MyFnContextWithMyPlayerID);
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
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>);
    });
});

// TODO Add tests for UpgradeMinCoinAction
