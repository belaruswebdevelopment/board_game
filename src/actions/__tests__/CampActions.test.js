import { ArtefactNames, DrawNames, LogTypeNames, RusCardTypeNames, StageNames, SuitNames } from "../../typescript/enums";
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '2' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '2' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 2,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '2' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '3' ?? ???????? ????????????.`,
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
                            stageName: StageNames.AddCoinToPouch,
                            number: 1,
                            drawName: DrawNames.AddCoinToPouchVidofnirVedrfolnir,
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
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ?????????????? ???????????? ?????????????????? '3' ?? ???????? ????????????.`,
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
        }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ???? ?????????? ?????????????????????? ?????????? ?????? ???????????????????? ?? ???????????? ?????? ???????????????? ?????????????????? '${ArtefactNames.Vidofnir_Vedrfolnir}'.`);
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
        }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ?????????????????????? ?????????????????? ???????????? ?? id '0': ?????? ???????????? ?????????????????????? ?? MoveValidator.`);
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
        }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ?????????????????????? ?????????????????? ???????????? ?? id '0': ?????? ???????????? ?????????????????????? ?? MoveValidator.`);
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
        }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ???? ?????????? ???? ???????? ???????????? ?? id '0'.`);
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
        }).toThrowError(`?? ?????????????? ?????????? ???????????? ?? id '0' ?? ???????? ???? ?????????? ???? ???????? ???????????? ?? id '0'.`);
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
        }).toThrowError(`???????????? ?? id '0' ?? ???????? ???????????????? ???????????? ?? id '0' ???? ?????????? ???????? ???????????????? ?????? ????????.`);
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
                                suit: SuitNames.Warrior,
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
                    suit: SuitNames.Warrior,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ???????????????? ?????????? 'Test' ?? ???????????? ???????????? ????????.`,
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
                                suit: SuitNames.Warrior,
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
                    suit: SuitNames.Warrior,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `?????????? 'Dan' ???????????????? ?????????? 'Test' ?? ???????????? ???????????? ???????? ????????????.`,
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
                            {},
                        ],
                    },
                },
            },
        };
        expect(() => {
            DiscardSuitCardAction(G, {
                playerID: `0`,
            }, 0);
        }).toThrowError(`???????????????????? ?????????? ???? ?????????? ???????? ?? ?????????? '${RusCardTypeNames.Hero_Card}'.`);
    });
});
//# sourceMappingURL=CampActions.test.js.map