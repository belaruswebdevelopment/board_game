import type { Ctx } from "boardgame.io";
import { ArtefactNames, DrawNames, LogTypes, RusCardTypes, Stages, SuitNames } from "../../typescript/enums";
import type { DeckCardTypes, DiscardCampCardTypes, IMyGameState, IPlayer, IPublicPlayer, IStack, PlayerCardTypes, PublicPlayerCoinTypes } from "../../typescript/interfaces";
import { AddCoinToPouchAction, DiscardSuitCardAction } from "../CampActions";

describe(`Test AddCoinToPouchAction method`, (): void => {
    it(`should add first coin isOpened=false to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, (): void => {
        const G = {
            multiplayer: false,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ] as IStack[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
        AddCoinToPouchAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            multiplayer: false,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.Game,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `tavernsNum` | `multiplayer` | `logData`>);
    });
    it(`should add first coin isOpened=true to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, (): void => {
        const G = {
            multiplayer: false,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ] as IStack[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
        AddCoinToPouchAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            multiplayer: false,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.Game,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `tavernsNum` | `multiplayer` | `logData`>);
    });
    it(`should add first coin to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=true)`, (): void => {
        const G = {
            multiplayer: true,
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
                } as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
        AddCoinToPouchAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            multiplayer: true,
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
                } as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                        {
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.Game,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `tavernsNum` | `multiplayer` | `logData`>);
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=false)`, (): void => {
        const G = {
            multiplayer: false,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ] as IStack[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
        AddCoinToPouchAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            multiplayer: false,
            tavernsNum: 3,
            players: {
                0: {} as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.Game,
                    value: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `tavernsNum` | `multiplayer` | `logData`>);
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=true)`, (): void => {
        const G = {
            multiplayer: true,
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
                } as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
        AddCoinToPouchAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            multiplayer: true,
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
                } as IPlayer,
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 1,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                        {
                            config: {
                                coinId: undefined,
                                stageName: Stages.UpgradeVidofnirVedrfolnirCoin,
                                value: 3,
                                drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                            },
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.Game,
                    value: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `players` | `tavernsNum` | `multiplayer` | `logData`>);
    });
    // Unreal Errors to reproduce
    it(`shouldn't add coin to pouch because all coins are on the pouch and must throw Error`,
        (): void => {
            const G = {
                multiplayer: false,
                tavernsNum: 3,
                players: {
                    0: {} as IPlayer,
                },
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        boardCoins: [] as PublicPlayerCoinTypes[],
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
            }).toThrowError(`В массиве монет игрока с id '0' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
        });
    it(`shouldn't add undefined coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                multiplayer: false,
                tavernsNum: 3,
                players: {
                    0: {} as IPlayer,
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
                        handCoins: [] as PublicPlayerCoinTypes[],
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
        });
    it(`shouldn't add undefined coin to pouch (multiplayer=true) and must throw Error`,
        (): void => {
            const G = {
                multiplayer: true,
                tavernsNum: 3,
                players: {
                    0: {
                        handCoins: [] as PublicPlayerCoinTypes[],
                        boardCoins: [
                            {},
                            {},
                            {},
                            null,
                        ],
                    } as IPlayer,
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
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                multiplayer: false,
                tavernsNum: 3,
                players: {
                    0: {} as IPlayer,
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
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=true) and must throw Error`,
        (): void => {
            const G = {
                multiplayer: true,
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
                    } as IPlayer,
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
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
            }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
        });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`,
        (): void => {
            const G = {
                multiplayer: false,
                tavernsNum: 3,
                players: {
                    0: {} as IPlayer,
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
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
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
                                name: `Test`,
                                suit: SuitNames.Warrior,
                            },
                        ],
                    },
                    stack: [
                        {
                            playerId: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
            discardCardsDeck: [],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        DiscardSuitCardAction(G as IMyGameState, {
            playerID: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardTypes[],
                    },
                    stack: [] as IStack[],
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ] as DeckCardTypes[],
            logData: [
                {
                    type: LogTypes.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should discard warrior mercenary player card to camp cards discard`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.Warrior,
                                variants: {},
                            },
                        ],
                    },
                    stack: [
                        {
                            playerId: 0,
                        },
                    ],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>;
        DiscardSuitCardAction(G as IMyGameState, {
            playerID: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardTypes[],
                    },
                    stack: [] as IStack[],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                    variants: {},
                },
            ] as DiscardCampCardTypes[],
            logData: [
                {
                    type: LogTypes.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт лагеря.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>);
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
                                    active: false,
                                },
                            ],
                        },
                    } as IPublicPlayer,
                },
            } as Pick<IMyGameState, `publicPlayers`>;
            expect((): void => {
                DiscardSuitCardAction(G as IMyGameState, {
                    playerID: `0`,
                } as Ctx, 0);
            }).toThrowError(`Сброшенная карта не может быть с типом '${RusCardTypes.Hero}'.`);
        });
});
