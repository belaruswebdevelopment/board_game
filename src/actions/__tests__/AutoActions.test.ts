import type { Ctx } from "boardgame.io";
import { BuffNames, DrawNames, LogTypes, Stages } from "../../typescript/enums";
import type { CoinType, IBuffs, IMyGameState, IPublicPlayer, IStack, PublicPlayerBoardCoinTypes } from "../../typescript/interfaces";
import { AddPickHeroAction, DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, GetClosedCoinIntoPlayerHandAction } from "../AutoActions";

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
        } as Ctx);
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
                } as IPublicPlayer,
            },
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
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                        },
                    ],
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        null,
                    ],
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
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
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
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
                } as IPublicPlayer,
            },
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
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
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
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
                    handCoins: [
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
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
            publicPlayers: {
                0: {
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            DiscardTradingCoinAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx);
        }).toThrowError(`У игрока не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
                    handCoins: [] as CoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            DiscardTradingCoinAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx);
        }).toThrowError(`В массиве монет игрока в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
    });
});

describe(`Test FinishOdroerirTheMythicCauldronAction method`, (): void => {
    it(`should finish odroerirTheMythicCauldron action`, (): void => {
        const G = {
            odroerirTheMythicCauldron: true,
        } as Pick<IMyGameState, `odroerirTheMythicCauldron`>;
        FinishOdroerirTheMythicCauldronAction(G as IMyGameState);
        expect(G).toEqual({
            odroerirTheMythicCauldron: false,
        } as Pick<IMyGameState, `odroerirTheMythicCauldron`>);
    });
});

describe(`Test GetClosedCoinIntoPlayerHandAction method`, (): void => {
    it(`should return all board coins to hand`, (): void => {
        const G = {
            publicPlayers: {
                0: {
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern`>;
        GetClosedCoinIntoPlayerHandAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            publicPlayers: {
                0: {
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern`>);
    });
});
