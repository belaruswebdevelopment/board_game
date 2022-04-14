import { ArtefactNames, DrawNames, LogTypes, RusCardTypes, Stages, SuitNames } from "../../typescript/enums";
import { AddCoinToPouchAction, DiscardSuitCardAction } from "../CampActions";
describe(`Test AddCoinToPouchAction method`, () => {
    it(`should add first coin isOpened=false to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                    ],
                },
            },
            logData: [],
        };
        AddCoinToPouchAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            multiplayer: false,
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
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add first coin isOpened=true to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                    ],
                },
            },
            logData: [],
        };
        AddCoinToPouchAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            multiplayer: false,
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
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add first coin to pouch of 2 necessary coins and add next AddCoinToPouchAction to stack (multiplayer=true)`, () => {
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
                            config: {
                                stageName: Stages.AddCoinToPouch,
                                number: 2,
                                drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
                            },
                        },
                    ],
                },
            },
            logData: [],
        };
        AddCoinToPouchAction(G, {
            currentPlayer: `0`,
        }, 0);
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
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' положил монету ценностью '2' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=false)`, () => {
        const G = {
            multiplayer: false,
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
                    ],
                },
            },
            logData: [],
        };
        AddCoinToPouchAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            multiplayer: false,
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
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        });
    });
    it(`should add last coin to pouch and start VidofnirVedrfolnir action (multiplayer=true)`, () => {
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
                },
            },
            logData: [],
        };
        AddCoinToPouchAction(G, {
            currentPlayer: `0`,
        }, 0);
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
                },
            },
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' положил монету ценностью '3' в свой кошель.`,
                },
            ],
        });
    });
    // Unreal Errors to reproduce
    it(`shouldn't add coin to pouch because all coins are on the pouch and must throw Error`, () => {
        const G = {
            multiplayer: false,
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
        };
        expect(() => {
            AddCoinToPouchAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' на столе отсутствует место для добавления в кошель для действия артефакта '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
    });
    it(`shouldn't add undefined coin to pouch (multiplayer=false) and must throw Error`, () => {
        const G = {
            multiplayer: false,
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
        };
        expect(() => {
            AddCoinToPouchAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't add undefined coin to pouch (multiplayer=true) and must throw Error`, () => {
        const G = {
            multiplayer: true,
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
        };
        expect(() => {
            AddCoinToPouchAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке отсутствует выбранная монета с id '0': это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`, () => {
        const G = {
            multiplayer: false,
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
        };
        expect(() => {
            AddCoinToPouchAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
    });
    it(`shouldn't add null coin to pouch (multiplayer=true) and must throw Error`, () => {
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
        };
        expect(() => {
            AddCoinToPouchAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В массиве монет игрока с id '0' в руке не может не быть монеты с id '0'.`);
    });
    it(`shouldn't add null coin to pouch (multiplayer=false) and must throw Error`, () => {
        const G = {
            multiplayer: false,
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
        };
        expect(() => {
            AddCoinToPouchAction(G, {
                currentPlayer: `0`,
            }, 0);
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
                                name: `Test`,
                            },
                        ],
                    },
                    stack: [
                        {
                            playerId: 0,
                        },
                    ],
                },
            },
            discardCardsDeck: [],
            logData: [],
        };
        DiscardSuitCardAction(G, {
            playerID: `0`,
        }, 0);
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
                    name: `Test`,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
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
                                name: `Test`,
                                suit: SuitNames.WARRIOR,
                                variants: {},
                            },
                        ],
                    },
                    stack: [
                        {
                            playerId: 0,
                        },
                    ],
                },
            },
            discardCampCardsDeck: [],
            logData: [],
        };
        DiscardSuitCardAction(G, {
            playerID: `0`,
        }, 0);
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
                    name: `Test`,
                    suit: SuitNames.WARRIOR,
                    variants: {},
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт лагеря.`,
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
                                active: false,
                            },
                        ],
                    },
                },
            },
        };
        expect(() => {
            DiscardSuitCardAction(G, {
                playerID: `0`,
            }, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    });
});
//# sourceMappingURL=CampActions.test.js.map