import { ArtefactNames, CardTypeRusNames, CommonStageNames, DrawNames, GameModeNames, LogTypeNames, SuitNames } from "../../typescript/enums";
import type { CoinType, Ctx, DiscardCampCardType, DiscardDeckCardType, MyFnContextWithMyPlayerID, MyGameState, PlayerBoardCardType, PlayerStack, PrivatePlayer, PublicPlayer, PublicPlayerCoinType } from "../../typescript/interfaces";
import { AddCoinToPouchAction, DiscardSuitCardAction } from "../CampActions";

describe(`Test AddCoinToPouchAction method`, (): void => {
    it(`should add first coin isOpened=false to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as PrivatePlayer,
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
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ] as PublicPlayerCoinType[],
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
        AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as PrivatePlayer,
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
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
                        {
                            value: 3,
                        },
                    ] as PublicPlayerCoinType[],
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
                    text: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode` | `logData`>);
    });
    it(`should add first coin isOpened=true to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as PrivatePlayer,
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
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ] as PublicPlayerCoinType[],
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
        AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as PrivatePlayer,
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
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
                        {
                            value: 3,
                        },
                    ] as PublicPlayerCoinType[],
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
                    text: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
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
                            value: 2,
                        },
                        {
                            value: 3,
                        },
                    ] as CoinType[],
                } as PrivatePlayer,
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
                    ] as PublicPlayerCoinType[],
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
        AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
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
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
                        {
                            value: 3,
                        },
                    ] as CoinType[],
                } as PrivatePlayer,
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
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
                        {},
                    ] as PublicPlayerCoinType[],
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
                    text: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `players` | `tavernsNum` | `mode` | `logData`>);
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=false)`, (): void => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as PrivatePlayer,
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
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ] as PublicPlayerCoinType[],
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
        AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {} as PrivatePlayer,
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
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [
                        null,
                    ] as PublicPlayerCoinType[],
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
                    text: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
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
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ] as CoinType[],
                } as PrivatePlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ] as PublicPlayerCoinType[],
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
        AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [
                        null,
                    ] as CoinType[],
                } as PrivatePlayer,
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [
                        {},
                        {},
                        {},
                        {
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [
                        null,
                    ] as PublicPlayerCoinType[],
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
                    text: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
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
                    0: {} as PrivatePlayer,
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
                AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`В массиве монет игрока с id '0' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.VidofnirVedrfolnir}'.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as PrivatePlayer,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ] as PublicPlayerCoinType[],
                        handCoins: [
                            null,
                        ] as PublicPlayerCoinType[],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
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
                        ] as CoinType[],
                        handCoins: [
                            null,
                        ] as CoinType[],
                    } as PrivatePlayer,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ] as PublicPlayerCoinType[],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                mode: GameModeNames.Basic,
                tavernsNum: 3,
                players: {
                    0: {} as PrivatePlayer,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ] as PublicPlayerCoinType[],
                        handCoins: [
                            {},
                        ] as PublicPlayerCoinType[],
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `tavernsNum` | `players` | `mode` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                AddCoinToPouchAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
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
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                    stack: [] as PlayerStack[],
                } as PublicPlayer,
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfPlayerCard,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ] as DiscardDeckCardType[],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Карта '${CardTypeRusNames.DwarfPlayerCard}' 'Test' убрана в сброс из-за выбора карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Hofud}'.`,
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
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                    stack: [] as PlayerStack[],
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
                    text: `Карта '${CardTypeRusNames.MercenaryPlayerCard}' 'Test' убрана в сброс из-за выбора карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Hofud}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>);
    });
    it(`shouldn't discard warrior hero card to discard and must throw Error`,
        (): void => {
            const G = {
                publicPlayers: {
                    0: {
                        cards: {
                            warrior: [
                                {
                                    type: CardTypeRusNames.HeroPlayerCard,
                                },
                            ],
                        },
                    } as PublicPlayer,
                },
            } as Pick<MyGameState, `publicPlayers`>;
            expect((): void => {
                DiscardSuitCardAction({ G, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
            }).toThrowError(`Сброшенная карта не может быть с типом '${CardTypeRusNames.HeroPlayerCard}'.`);
        });
});
