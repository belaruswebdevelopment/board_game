import { ArtefactNames, CommonStageNames, ConfigNames, DrawNames, GameModeNames, HeroBuffNames, LogTypeNames, SuitNames } from "../../typescript/enums";
import type { CoinType, Ctx, IPlayer, IPublicPlayer, MyFnContextWithMyPlayerID, MyGameState, PlayerBuffs, PlayerCardType, PublicPlayerCoinType, Stack } from "../../typescript/interfaces";
import { DiscardTradingCoinAction, FinishOdroerirTheMythicCauldronAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction } from "../CampAutoActions";

describe(`Test DiscardTradingCoinAction method`, (): void => {
    it(`should discard trading coin isOpened=true from board (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: true,
                            isTriggerTrading: true,
                        },
                    ],
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        null,
                    ],
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard trading coin isOpened=false from board (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: false,
                            isTriggerTrading: true,
                        },
                    ],
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        null,
                    ],
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard closed trading coin from board (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
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
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
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
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard opened trading coin from board (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
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
                            value: 0,
                        },
                    ],
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
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
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard trading coin isOpened=true from board if player has Uline but trading coin on the board (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: true,
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
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
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
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard trading coin isOpened=false from board if player has Uline but trading coin on the board (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {
                            isOpened: false,
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
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
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
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but opened (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
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
                            value: 0,
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
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
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
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard trading coin from board if player has Uline but trading coin on the board but closed (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
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
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
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
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard trading coin from hand if player has Uline but trading coin in the hand (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [] as PublicPlayerCoinType[],
                    handCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
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
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [] as PublicPlayerCoinType[],
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
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard closed trading coin from hand if player has Uline but trading coin in the hand (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                    boardCoins: [] as PublicPlayerCoinType[],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    handCoins: [
                        {},
                    ],
                    boardCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
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
                    handCoins: [
                        null,
                    ],
                    boardCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    it(`should discard trading coin isOpened=true from hand if player has Uline but trading coin in the hand (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                    boardCoins: [] as PublicPlayerCoinType[],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    handCoins: [
                        {
                            isTriggerTrading: true,
                            value: 0,
                        },
                    ],
                    boardCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
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
                    handCoins: [
                        null,
                    ],
                    boardCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' сбросил монету активирующую обмен.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode` | `logData`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard trading coin if player hasn't trading coin and must throw Error (multiplayer=false)`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                players: {
                    0: {} as IPlayer,
                },
                publicPlayers: {
                    0: {
                        boardCoins: [] as PublicPlayerCoinType[],
                        buffs: [] as PlayerBuffs[],
                    } as IPublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers` | `players` | `mode`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
            }).toThrowError(`У игрока с id '0' на столе не может отсутствовать обменная монета.`);
        });
    it(`shouldn't discard trading coin if player hasn't trading coin and must throw Error (multiplayer=true)`,
        (): void => {
            const G = {
                mode: GameModeNames.Multiplayer,
                players: {
                    0: {
                        boardCoins: [] as PublicPlayerCoinType[],
                    } as IPlayer,
                },
                publicPlayers: {
                    0: {
                        boardCoins: [] as PublicPlayerCoinType[],
                        buffs: [] as PlayerBuffs[],
                    } as IPublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers` | `players` | `mode`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
            }).toThrowError(`У игрока с id '0' на столе не может отсутствовать обменная монета.`);
        });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin and must throw Error (multiplayer=false)`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                players: {
                    0: {} as IPlayer,
                },
                publicPlayers: {
                    0: {
                        boardCoins: [] as PublicPlayerCoinType[],
                        handCoins: [] as PublicPlayerCoinType[],
                        buffs: [
                            {
                                everyTurn: true,
                            },
                        ],
                    } as IPublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers` | `players` | `mode`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
            }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует обменная монета при наличии бафа '${HeroBuffNames.EveryTurn}'.`);
        });
    it(`shouldn't discard trading coin if player has Uline but player hasn't trading coin and must throw Error (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            players: {
                0: {
                    boardCoins: [],
                    handCoins: [],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [] as PublicPlayerCoinType[],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardTradingCoinAction({ G, ctx } as MyFnContextWithMyPlayerID);
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует обменная монета при наличии бафа '${HeroBuffNames.EveryTurn}'.`);
    });
});

describe(`Test FinishOdroerirTheMythicCauldronAction method`, (): void => {
    it(`should finish odroerirTheMythicCauldron action`, (): void => {
        const G = {
            odroerirTheMythicCauldron: true,
        } as Pick<MyGameState, `odroerirTheMythicCauldron`>,
            ctx: Ctx = {} as Ctx;
        FinishOdroerirTheMythicCauldronAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            odroerirTheMythicCauldron: false,
        } as Pick<MyGameState, `odroerirTheMythicCauldron`>);
    });
});

describe(`Test StartDiscardSuitCardAction method`, (): void => {
    it(`should add active players with warriors cards to stage`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
                1: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
                numPlayers: 2,
            } as Ctx;
        StartDiscardSuitCardAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            publicPlayers: {
                0: {} as IPublicPlayer,
                1: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [
                        {
                            playerId: `1`,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>);
        expect(ctx).toEqual({
            currentPlayer: `0`,
            numPlayers: 2,
        } as Ctx);
    });
    it(`shouldn't add active player without warriors cards to stage`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
                1: {
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    stack: [] as Stack[],
                } as IPublicPlayer,
                2: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
                numPlayers: 3,
            } as Ctx;
        StartDiscardSuitCardAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            publicPlayers: {
                0: {} as IPublicPlayer,
                1: {
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    stack: [] as Stack[],
                } as IPublicPlayer,
                2: {
                    cards: {
                        warrior: [
                            {},
                        ],
                    },
                    stack: [
                        {
                            playerId: `2`,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>);
        expect(ctx).toEqual({
            currentPlayer: `0`,
            numPlayers: 3,
        } as Ctx);
    });
    // Unreal Errors to reproduce
    it(`shouldn't add all active players without warriors cards to stage and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
                1: {
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
                numPlayers: 2,
            } as Ctx;
        expect((): void => {
            StartDiscardSuitCardAction({ G, ctx } as MyFnContextWithMyPlayerID);
        }).toThrowError(`Должны быть игроки с картами в фракции '${SuitNames.warrior}'.`);
    });
});

describe(`Test StartVidofnirVedrfolnirAction method`, (): void => {
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=true value=3 (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=false value=3 (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 2 closed coins value=3 (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {},
                        {},
                    ],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [] as PlayerBuffs[],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 2 coins isOpened=true value=3 (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [] as PlayerBuffs[],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                2,
                                3,
                            ],
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 2 coins, but 1 isTriggerTrading, value=5 (multiplayer=false)`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as IPlayer,
                },
                publicPlayers: {
                    0: {
                        boardCoins: [
                            {},
                            {},
                            {},
                            {
                                isOpened: true,
                                isTriggerTrading: true,
                                value: 0,
                            },
                            {
                                isOpened: true,
                                isTriggerTrading: false,
                                value: 3,
                            },
                        ],
                        handCoins: [] as PublicPlayerCoinType[],
                        buffs: [] as PlayerBuffs[],
                        stack: [] as Stack[],
                    } as IPublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
            expect(G).toEqual({
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as IPlayer,
                },
                publicPlayers: {
                    0: {
                        boardCoins: [
                            {},
                            {},
                            {},
                            {
                                isOpened: true,
                                isTriggerTrading: true,
                                value: 0,
                            },
                            {
                                isOpened: true,
                                isTriggerTrading: false,
                                value: 3,
                            },
                        ],
                        handCoins: [] as PublicPlayerCoinType[],
                        buffs: [] as PlayerBuffs[],
                        stack: [
                            {
                                coinId: undefined,
                                configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                                drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                                priority: 0,
                                stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                                valueArray: [
                                    5,
                                ],
                            },
                        ],
                    } as IPublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
        });
    it(`should start VidofnirVedrfolnir action for 2 coins, but 1 isTriggerTrading, value=5 (multiplayer=true)`,
        (): void => {
            const G = {
                mode: GameModeNames.Multiplayer,
                tavernsNum: 3,
                players: {
                    0: {
                        handCoins: [] as PublicPlayerCoinType[],
                        boardCoins: [
                            {},
                            {},
                            {},
                            {
                                isOpened: false,
                                isTriggerTrading: true,
                                value: 0,
                            },
                            {
                                isOpened: false,
                                isTriggerTrading: false,
                                value: 3,
                            },
                        ],
                    } as IPlayer,
                },
                publicPlayers: {
                    0: {
                        boardCoins: [
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        buffs: [] as PlayerBuffs[],
                        stack: [] as Stack[],
                    } as IPublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
            expect(G).toEqual({
                mode: GameModeNames.Multiplayer,
                tavernsNum: 3,
                players: {
                    0: {
                        handCoins: [] as PublicPlayerCoinType[],
                        boardCoins: [
                            {},
                            {},
                            {},
                            {
                                isOpened: true,
                                isTriggerTrading: true,
                                value: 0,
                            },
                            {
                                isOpened: true,
                                isTriggerTrading: false,
                                value: 3,
                            },
                        ],
                    } as IPlayer,
                },
                publicPlayers: {
                    0: {
                        boardCoins: [
                            {},
                            {},
                            {},
                            {
                                isOpened: true,
                                isTriggerTrading: true,
                                value: 0,
                            },
                            {
                                isOpened: true,
                                isTriggerTrading: false,
                                value: 3,
                            },
                        ],
                        buffs: [] as PlayerBuffs[],
                        stack: [
                            {
                                coinId: undefined,
                                configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                                drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                                priority: 0,
                                stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                                valueArray: [
                                    5,
                                ],
                            },
                        ],
                    } as IPublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
        });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                5,
                            ],
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {},
                    ],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [] as PlayerBuffs[],
                    stack: [
                        {
                            coinId: undefined,
                            configName: ConfigNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            drawName: DrawNames.StartChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            priority: 0,
                            stageName: CommonStageNames.ChooseCoinValueForVidofnirVedrfolnirUpgrade,
                            valueArray: [
                                5,
                            ],
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 2 coins if player has Uline (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 2 coins if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin just on the pouch and 1 coin in player's hands after trading) if player has Uline (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin just on the pouch and 1 coin in player's hands after trading) if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 1 coins (0 coin on the pouch because trading coin was discarded and just 1 coin in player's hands) if player has Uline (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ] as CoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 1 coins (0 coin on the pouch because trading coin was discarded and just 1 coin in player's hands) if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 2 coins (0 coin on the pouch because trading isn't happened and more then 2 coins in player's hands) if player has Uline (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 2 coins (0 coin on the pouch because trading isn't happened and more then 2 coins in player's hands) if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        null,
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin on the pouch because trading was happened and more then 1 coins in player's hands) if player has Uline (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start AddCoinToPouch action for 1 coins (1 coin on the pouch because trading was happened and more then 1 coins in player's hands) if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [
                        {
                            isTriggerTrading: false,
                            value: 0,
                        },
                        {
                            isTriggerTrading: false,
                            value: 4,
                        },
                    ],
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        null,
                        null,
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            priority: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 if player has Uline (if multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            stageName: CommonStageNames.UpgradeCoinVidofnirVedrfolnir,
                            value: 3,
                            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 /all public board coin just opened by effect of adding coin to pouch Uline/ if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            stageName: CommonStageNames.UpgradeCoinVidofnirVedrfolnir,
                            value: 3,
                            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 2 coins value=3 /some public board coin just opened by effect of adding coin to pouch Uline/ if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {},
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            stageName: CommonStageNames.UpgradeCoinVidofnirVedrfolnir,
                            value: 3,
                            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 if player has Uline (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            stageName: CommonStageNames.UpgradeCoinVidofnirVedrfolnir,
                            value: 5,
                            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    it(`should start VidofnirVedrfolnir action for 1 coins (1 is discarded coin=null), value=5 if player has Uline (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {},
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [] as PublicPlayerCoinType[],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [
                        {
                            coinId: undefined,
                            stageName: CommonStageNames.UpgradeCoinVidofnirVedrfolnir,
                            value: 5,
                            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't have 0 coins in player's hands and 0 coins on the pouch if player has Uline (if multiplayer=false) and must throw Error`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        }).toThrowError(`При наличии бафа '${HeroBuffNames.EveryTurn}' всегда должно быть столько действий добавления монет в кошель, сколько ячеек для монет в кошеле пустые.`);
    });
    it(`shouldn't have closed coins on the pouch (if multiplayer=false) and must throw Error`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {},
                        {
                            value: 3,
                            isTriggerTrading: false,
                        },
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        }).toThrowError(`В массиве монет игрока с id '0' на поле не должна быть закрыта монета в кошеле с id '3'.`);
    });
    it(`shouldn't have 0 coins on the pouch if player hasn't Uline (if multiplayer=false) and must throw Error`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        }).toThrowError(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}', а не '0' монет(ы).`);
    });
    it(`shouldn't have 0 coins on the pouch if player hasn't Uline (if multiplayer=true) and must throw Error`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [] as PublicPlayerCoinType[],
                } as IPlayer,
            },
            publicPlayers: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    buffs: [] as PlayerBuffs[],
                    stack: [] as Stack[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            StartVidofnirVedrfolnirAction({ G, ctx } as MyFnContextWithMyPlayerID);
        }).toThrowError(`У игрока должно быть ровно 1-2 монеты в кошеле для обмена для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}', а не '0' монет(ы).`);
    });
});
