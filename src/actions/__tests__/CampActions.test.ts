import type { Ctx } from "boardgame.io";
import { ArtefactNames, DrawNames, LogTypeNames, RusCardTypeNames, StageNames, SuitNames } from "../../typescript/enums";
import type { DeckCardTypes, DiscardCampCardType, IMyGameState, IPlayer, IPublicPlayer, IStack, PlayerCardType, PublicPlayerCoinType } from "../../typescript/interfaces";
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                        {
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '2' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                        {
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '2' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                        {
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '2' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                        {
                            coinId: undefined,
                            stageName: StageNames.UpgradeVidofnirVedrfolnirCoin,
                            value: 3,
                            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '3' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                        {
                            coinId: undefined,
                            stageName: StageNames.UpgradeVidofnirVedrfolnirCoin,
                            value: 3,
                            drawName: DrawNames.UpgradeCoinVidofnirVedrfolnir,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '3' ?? ???????? ????????????.`,
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
                        boardCoins: [] as PublicPlayerCoinType[],
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
            }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ???? ?????????? ?????????????????????? ?????????? ?????? ???????????????????? ?? ???????????? ?????? ???????????????? ?????????????????? '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
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
                        handCoins: [] as PublicPlayerCoinType[],
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `tavernsNum` | `players` | `multiplayer` | `logData`>;
            expect((): void => {
                AddCoinToPouchAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, 0);
            }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ?????????????????????? ?????????????????? ???????????? ?? id '0': ?????? ???????????? ?????????????????????? ?? MoveValidator.`);
        });
    it(`shouldn't add undefined coin to pouch (multiplayer=true) and must throw Error`,
        (): void => {
            const G = {
                multiplayer: true,
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
            }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ?????????????????????? ?????????????????? ???????????? ?? id '0': ?????? ???????????? ?????????????????????? ?? MoveValidator.`);
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
            }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ???? ?????????? ???? ???????? ???????????? ?? id '0'.`);
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
            }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ???? ?????????? ???? ???????? ???????????? ?? id '0'.`);
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
            }).toThrowError(`???????????? ?? id '0' ?? ???????? ???????????????? ???????????? ?? id '0' ???? ?????????? ???????? ???????????????? ?????? ????????.`);
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
                        warrior: [] as PlayerCardType[],
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
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ???????????????? ?????????? 'Test' ?? ???????????? ???????????? ????????.`,
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
                        warrior: [] as PlayerCardType[],
                    },
                    stack: [] as IStack[],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ] as DiscardCampCardType[],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ???????????????? ?????????? 'Test' ?? ???????????? ???????????? ???????? ????????????.`,
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
                                {},
                            ],
                        },
                    } as IPublicPlayer,
                },
            } as Pick<IMyGameState, `publicPlayers`>;
            expect((): void => {
                DiscardSuitCardAction(G as IMyGameState, {
                    playerID: `0`,
                } as Ctx, 0);
            }).toThrowError(`???????????????????? ?????????? ???? ?????????? ???????? ?? ?????????? '${RusCardTypeNames.Hero_Card}'.`);
        });
});
