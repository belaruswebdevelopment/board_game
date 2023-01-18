import { ArtefactNames, CardTypeRusNames, CommonStageNames, DrawNames, GameModeNames, LogTypeNames, SuitNames } from "../../typescript/enums";
import { AddCoinToPouchAction, DiscardSuitCardAction } from "../CampActions";
describe(`Test AddCoinToPouchAction method`, () => {
    it(`should add first coin isOpened=false to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        AddCoinToPouchAction({ G, ctx }, 0);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add first coin isOpened=true to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        AddCoinToPouchAction({ G, ctx }, 0);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add first coin to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=true)`, () => {
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
                    ],
                },
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        AddCoinToPouchAction({ G, ctx }, 0);
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
                            value: 2,
                        },
                        null,
                    ],
                    handCoins: [
                        null,
                        {
                            value: 3,
                        },
                    ],
                },
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=false)`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        AddCoinToPouchAction({ G, ctx }, 0);
        expect(G).toEqual({
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=true)`, () => {
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
                    ],
                },
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
                    buffs: [
                        {
                            everyTurn: true,
                        },
                    ],
                    handCoins: [
                        {
                            isOpened: false,
                            value: 3,
                        },
                    ],
                    stack: [
                        {
                            stageName: CommonStageNames.AddCoinToPouch,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        AddCoinToPouchAction({ G, ctx }, 0);
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
                            value: 2,
                        },
                        {
                            isOpened: true,
                            value: 3,
                        },
                    ],
                    handCoins: [
                        null,
                    ],
                },
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't add coin to pouch because all coins are on the pouch and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
            },
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    boardCoins: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            AddCoinToPouchAction({ G, ctx }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.VidofnirVedrfolnir}'.`);
    });
    it(`shouldn't add undefined coin to pouch (multiplayer=false) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                    handCoins: [],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            AddCoinToPouchAction({ G, ctx }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't add undefined coin to pouch (multiplayer=true) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Multiplayer,
            tavernsNum: 3,
            players: {
                0: {
                    handCoins: [],
                    boardCoins: [
                        {},
                        {},
                        {},
                        null,
                    ],
                },
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            AddCoinToPouchAction({ G, ctx }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            AddCoinToPouchAction({ G, ctx }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
    });
    it(`shouldn't add null coin to pouch (multiplayer=true) and must throw Error`, () => {
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
                },
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            AddCoinToPouchAction({ G, ctx }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
    });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`, () => {
        const G = {
            mode: GameModeNames.Basic,
            tavernsNum: 3,
            players: {
                0: {},
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
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            AddCoinToPouchAction({ G, ctx }, 0);
        }).toThrowError(`Монета с id '0' в руке текущего игрока с id '0' не может быть закрытой для него.`);
    });
});
describe(`Test DiscardSuitCardAction method`, () => {
    it(`should discard warrior card to cards discard`, () => {
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
                },
            },
            discardCardsDeck: [],
            logData: [],
        };
        DiscardSuitCardAction({ G, myPlayerID: `0` }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    stack: [],
                },
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
                },
            ],
        });
    });
    it(`should discard warrior mercenary player card to camp cards discard`, () => {
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
                },
            },
            discardCampCardsDeck: [],
            logData: [],
        };
        DiscardSuitCardAction({ G, myPlayerID: `0` }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    stack: [],
                },
            },
            discardCampCardsDeck: [
                {
                    type: CardTypeRusNames.MercenaryPlayerCard,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт лагеря.`,
                },
            ],
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't discard warrior hero card to discard and must throw Error`, () => {
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
                },
            },
        };
        expect(() => {
            DiscardSuitCardAction({ G, myPlayerID: `0` }, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${CardTypeRusNames.HeroCard}'.`);
    });
});
//# sourceMappingURL=CampActions.test.js.map