import type { Ctx } from "boardgame.io";
import { BuffNames, DrawNames, LogTypes, Stages } from "../../typescript/enums";
import type { IMyGameState, IPublicPlayer } from "../../typescript/interfaces";
import { AddPickHeroAction, DiscardTradingCoinAction, GetClosedCoinIntoPlayerHandAction } from "../AutoActions";

describe(`Test AddPickHeroAction method`, (): void => {
    it(`should add pick hero action to stack`, (): void => {
        const G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    stack: [],
                } as Pick<IPublicPlayer, `nickname` | `stack`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        AddPickHeroAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
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
                } as Pick<IPublicPlayer, `nickname` | `stack`>,
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan должен выбрать нового героя.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test DiscardTradingCoinAction method`, (): void => {
    it(`should discard trading coin from board`, (): void => {
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
                } as Pick<IPublicPlayer, `nickname` | `boardCoins` | `buffs`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
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
                } as Pick<IPublicPlayer, `nickname` | `boardCoins` | `buffs`>,
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board`, ():
        void => {
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
                } as Pick<IPublicPlayer, `nickname` | `boardCoins` | `buffs`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
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
                } as Pick<IPublicPlayer, `nickname` | `boardCoins` | `buffs`>,
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand`, (): void => {
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
                } as Pick<IPublicPlayer, `nickname` | `boardCoins` | `handCoins` | `buffs`>,
            ],
            logData: [],
        } as Pick<IMyGameState, `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
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
                } as Pick<IPublicPlayer, `nickname` | `boardCoins` | `handCoins` | `buffs`>,
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard trading coin if player hasn't trading coin`, (): void => {
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
                } as Pick<IPublicPlayer, `boardCoins` | `buffs`>,
            ],
        };
        expect((): void => {
            DiscardTradingCoinAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx);
        }).toThrowError(`У игрока не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin`, (): void => {
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
                } as Pick<IPublicPlayer, `boardCoins` | `handCoins` | `buffs`>,
            ],
        };
        expect((): void => {
            DiscardTradingCoinAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx);
        }).toThrowError(`У игрока в 'handCoins' отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
    });
});

describe(`Test GetClosedCoinIntoPlayerHandAction method`, (): void => {
    it(`should return all board coins to hand`, (): void => {
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
                } as Pick<IPublicPlayer, `handCoins` | `boardCoins`>,
            ],
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern`>;
        GetClosedCoinIntoPlayerHandAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
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
                } as Pick<IPublicPlayer, `handCoins` | `boardCoins`>,
            ],
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern`>);
    });
});
