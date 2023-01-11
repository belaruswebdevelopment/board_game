import { CommonStageNames, DrawNames, GameModeNames, LogTypeNames } from "../../typescript/enums";
import type { Ctx, MyFnContextWithMyPlayerID, MyGameState, Player, PublicPlayer, Stack } from "../../typescript/interfaces";
import { AddPickHeroAction, GetClosedCoinIntoPlayerHandAction } from "../HeroAutoActions";

describe(`Test AddPickHeroAction method`, (): void => {
    it(`should add pick hero action to stack`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [] as Stack[],
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
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
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' должен выбрать нового героя.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test GetClosedCoinIntoPlayerHandAction method`, (): void => {
    it(`should return all board coins to hand (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {} as Player,
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
                } as PublicPlayer,
            },
            currentTavern: 0,
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        GetClosedCoinIntoPlayerHandAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {} as Player,
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
                } as PublicPlayer,
            },
            currentTavern: 0,
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>);
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
                } as Player,
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
                } as PublicPlayer,
            },
            currentTavern: 0,
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>,
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
                } as Player,
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
                } as PublicPlayer,
            },
            currentTavern: 0,
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>);
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
                } as Player,
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
                } as PublicPlayer,
            },
            currentTavern: 0,
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>,
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
                } as Player,
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
                } as PublicPlayer,
            },
            currentTavern: 0,
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `players` | `mode`>);
    });
});

// TODO Add tests for UpgradeMinCoinAction
