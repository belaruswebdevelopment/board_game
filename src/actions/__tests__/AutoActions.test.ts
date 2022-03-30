import type { Ctx } from "boardgame.io";
import { BuffNames, DrawNames, LogTypes, Stages } from "../../typescript/enums";
import type { CoinType, IBuffs, IMyGameState, IPlayer, IPublicPlayer, IStack, PublicPlayerBoardCoinTypes } from "../../typescript/interfaces";
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
    it(`should discard trading coin from board (multiplayer=false)`, (): void => {
        const G = {
            multiplayer: false,
            players: {
                0: {} as IPlayer,
            },
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
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {} as IPlayer,
            },
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
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>);
    });
    it(`should discard trading coin from board (multiplayer=true)`, (): void => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                    ],
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                } as IPlayer,
            },
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
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>);
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board (multiplayer=false)`, ():
        void => {
        const G = {
            multiplayer: false,
            players: {
                0: {} as IPlayer,
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
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {} as IPlayer,
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
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>);
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but opened (multiplayer=true)`, ():
        void => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                        },
                    ],
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>);
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but closed (multiplayer=true)`, ():
        void => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                        },
                    ],
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [
                        null,
                    ],
                } as IPlayer,
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
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>);
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand (multiplayer=false)`, (): void => {
        const G = {
            multiplayer: false,
            players: {
                0: {} as IPlayer,
            },
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
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: false,
            players: {
                0: {} as IPlayer,
            },
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
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>);
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand (multiplayer=true)`, (): void => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: true,
                        },
                    ],
                    boardCoins: [] as CoinType[],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>;
        DiscardTradingCoinAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx);
        expect(G).toEqual({
            multiplayer: true,
            players: {
                0: {
                    handCoins: [
                        null,
                    ],
                    boardCoins: [],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
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
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer` | `logData`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard trading coin if player hasn't trading coin (multiplayer=false)`, (): void => {
        const G = {
            multiplayer: false,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer`>;
        expect((): void => {
            DiscardTradingCoinAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx);
        }).toThrowError(`У игрока на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player hasn't trading coin (multiplayer=true)`, (): void => {
        const G = {
            multiplayer: true,
            players: {
                0: {
                    boardCoins: [] as CoinType[],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [] as PublicPlayerBoardCoinTypes[],
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer`>;
        expect((): void => {
            DiscardTradingCoinAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx);
        }).toThrowError(`У игрока на столе не может отсутствовать обменная монета.`);
    });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin (multiplayer=false)`,
        (): void => {
            const G = {
                multiplayer: false,
                players: {
                    0: {} as IPlayer,
                },
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
            } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer`>;
            expect((): void => {
                DiscardTradingCoinAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx);
            }).toThrowError(`В массиве монет игрока в руке отсутствует обменная монета при наличии бафа '${BuffNames.EveryTurn}'.`);
        });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin (multiplayer=true)`,
        (): void => {
            const G = {
                multiplayer: true,
                players: {
                    0: {
                        boardCoins: [],
                        handCoins: [],
                    } as IPlayer,
                },
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
            } as Pick<IMyGameState, `publicPlayers` | `players` | `multiplayer`>;
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
    it(`should return all board coins to hand (multiplayer=true)`, (): void => {
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
                } as IPublicPlayer,
            },
            currentTavern: 0,
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `players` | `multiplayer`>);
    });
});
