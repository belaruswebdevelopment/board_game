import { ArtefactNames, CardTypeRusNames, CommonStageNames, DrawNames, GameModeNames, LogTypeNames, SuitNames } from "../../typescript/enums";
import type { Ctx, DiscardCampCardType, DwarfDeckCardType, MyFnContextWithMyPlayerID, MyGameState, Player, PlayerBoardCardType, PublicPlayer, PublicPlayerCoinType, Stack } from "../../typescript/interfaces";
import { AddCoinToPouchAction, DiscardSuitCardAction } from "../CampActions";

describe(`Test AddCoinToPouchAction method`, (): void => {
    it(`should add first coin isOpened=false to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isOpened: false,
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
                        },
                    ] as Stack[],
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
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
                        },
                    ],
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode` | `logData`>);
    });
    it(`should add first coin isOpened=true to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {
                            isOpened: true,
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
                        },
                    ] as Stack[],
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
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
                        },
                    ],
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode` | `logData`>);
    });
    it(`should add first coin to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=true)`, (): void => {
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
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                        null,
                    ],
                    handCoins: [
                        {},
                        {},
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
                        },
                    ],
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
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
                        null,
                    ],
                    handCoins: [
                        null,
                        {
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
                        {},
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
                        },
                    ],
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode` | `logData`>);
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isOpened: false,
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
                        },
                    ] as Stack[],
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
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
                    handCoins: [
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
                        },
                    ],
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode` | `logData`>);
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=true)`, (): void => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                } as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
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
                    handCoins: [
                        {
                            isOpened: false,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                    ],
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
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
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [
                        null,
                    ],
                } as Player,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            isTriggerTrading: false,
                            value: 2,
                        },
                        {
                            isOpened: true,
                            isTriggerTrading: false,
                            value: 3,
                        },
                    ],
                    handCoins: [
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
                        },
                    ],
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode` | `logData`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't add coin to pouch because all coins are on the pouch and must throw Error`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as Player,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [] as PublicPlayerCoinType[],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`В массиве монет игрока с id '0' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.VidofnirVedrfolnir}'.`);
        });
    it(`shouldn't add undefined coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as Player,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ],
                        handCoins: [] as PublicPlayerCoinType[],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
        });
    it(`shouldn't add undefined coin to pouch (multiplayer=true) and must throw Error`,
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
                            null,
                        ],
                    } as Player,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as Player,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ],
                        handCoins: [
                            null,
                        ],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=true) and must throw Error`,
        (): void => {
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
                        ],
                        handCoins: [
                            null,
                        ],
                    } as Player,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as Player,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ],
                        handCoins: [
                            {},
                        ],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`Монета с id '0' в руке текущего игрока с id '0' не может быть закрытой для него.`);
        });
});

describe(`Test DiscardSuitCardAction method`, (): void => {
    it(`should discard warrior card to cards discard`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.DwarfPlayerCard,
                                name: `Test`,
                                suit: SuitNames.warrior,
                            },
                        ],
                    },
                    stack: [
                        {
                            playerId: `0`,
                        },
                    ],
                } as PublicPlayer,
            },
            discardCardsDeck: [],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        DiscardSuitCardAction({ G, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                    stack: [] as Stack[],
                } as PublicPlayer,
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ] as DwarfDeckCardType[],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should discard warrior mercenary player card to camp cards discard`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.MercenaryPlayerCard,
                                name: `Test`,
                                suit: SuitNames.warrior,
                            },
                        ],
                    },
                    stack: [
                        {
                            playerId: `0`,
                        },
                    ],
                } as PublicPlayer,
            },
            discardCampCardsDeck: [],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>;
        DiscardSuitCardAction({ G, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                    stack: [] as Stack[],
                } as PublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    type: CardTypeRusNames.MercenaryPlayerCard,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ] as DiscardCampCardType[],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт лагеря.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard warrior hero card to discard and must throw Error`,
        (): void => {
            const G = {
                publicPlayers: {
                    0: {
                        cards: {
                            warrior: [
                                {
                                    type: CardTypeRusNames.DwarfPlayerCard,
                                },
                            ],
                        },
                    } as PublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers`>;
            expect((): void => {
                DiscardSuitCardAction({ G, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`Сброшенная карта не может быть с типом '${CardTypeRusNames.HeroCard}'.`);
        });
});
