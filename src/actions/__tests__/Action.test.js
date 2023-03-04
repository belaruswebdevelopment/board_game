import { suitsConfig } from "../../data/SuitData";
import { ArtefactDescriptionNames, ArtefactNames, CampBuffNames, CardTypeRusNames, CommonBuffNames, CommonStageNames, DrawNames, EnlistmentMercenariesStageNames, HeroNames, LogTypeNames, PhaseNames, RoyalOfferingNames, SuitNames, SuitRusNames, TavernNames } from "../../typescript/enums";
import { DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickDiscardCardAction, PlaceEnlistmentMercenariesAction } from "../Actions";
describe(`Test DiscardAnyCardFromPlayerBoardAction method`, () => {
    it(`should remove non-hero discarded card from player's cards to cards discard`, () => {
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
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                },
            },
            discardCardsDeck: [],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` }, SuitNames.warrior, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfPlayerCard,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Карта '${CardTypeRusNames.DwarfPlayerCard}' 'Test' убрана в сброс из-за эффекта карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Brisingamens}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
                },
            ],
        });
    });
    it(`should remove artefact discarded card from player's cards to camp cards discard`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.ArtefactPlayerCard,
                                name: ArtefactNames.Vegvisir,
                                description: ArtefactDescriptionNames.Vegvisir,
                            },
                        ],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                },
            },
            discardCampCardsDeck: [],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` }, SuitNames.warrior, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCampCardsDeck: [
                {
                    type: CardTypeRusNames.ArtefactPlayerCard,
                    name: ArtefactNames.Vegvisir,
                    description: ArtefactDescriptionNames.Vegvisir,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Карта '${CardTypeRusNames.ArtefactPlayerCard}' '${ArtefactNames.Vegvisir}' убрана в сброс из-за эффекта карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Brisingamens}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
                },
            ],
        });
    });
    it(`should remove mercenary player discarded card from player's cards to camp cards discard`, () => {
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
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                },
            },
            discardCampCardsDeck: [],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` }, SuitNames.warrior, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
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
                    text: `Карта '${CardTypeRusNames.MercenaryPlayerCard}' 'Test' убрана в сброс из-за эффекта карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Brisingamens}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
                },
            ],
        });
    });
    it(`shouldn't remove hero discarded card from player's cards and must throw Error`, () => {
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
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` }, SuitNames.warrior, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${CardTypeRusNames.HeroPlayerCard}'.`);
    });
    it(`shouldn't remove non-exists player's card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    cards: {
                        warrior: [],
                    },
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` }, SuitNames.warrior, 0);
        }).toThrowError(`В массиве карт игрока с id '0' отсутствует выбранная карта во фракции '${SuitRusNames.warrior}' с id '0': это должно проверяться в MoveValidator.`);
    });
});
describe(`Test DiscardCardFromTavernAction method`, () => {
    it(`should remove non-null card from tavern`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [
                    {
                        type: CardTypeRusNames.DwarfCard,
                        name: `Test`,
                        playerSuit: SuitNames.warrior,
                    },
                ],
                [],
                [],
            ],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` }, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [null],
                [],
                [],
            ],
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ],
            tavernCardDiscarded2Players: false,
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' должен сбросить в колоду сброса карту из текущей таверны:`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Карта '${CardTypeRusNames.DwarfCard}' 'Test' из таверны ${TavernNames.LaughingGoblin} убрана в сброс.`,
                },
            ],
        });
    });
    it(`should remove non-null card from tavern for 2 players game`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [
                    {
                        type: CardTypeRusNames.DwarfCard,
                        name: `Test`,
                        playerSuit: SuitNames.warrior,
                    },
                ],
                [],
                [],
            ],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        }, ctx = {
            numPlayers: 2,
            currentPlayer: `0`,
        };
        DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` }, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [null],
                [],
                [],
            ],
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ],
            tavernCardDiscarded2Players: true,
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' должен сбросить в колоду сброса карту из текущей таверны:`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Карта '${CardTypeRusNames.DwarfCard}' 'Test' из таверны ${TavernNames.LaughingGoblin} убрана в сброс.`,
                },
            ],
        });
    });
    it(`shouldn't remove null card from tavern and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [null],
                [],
                [],
            ],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` }, 0);
        }).toThrowError(`В массиве карт текущей таверны с id '0' не может не быть карты с id '0'.`);
    });
    it(`shouldn't remove non-exists card from tavern and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [],
                [],
                [],
            ],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` }, 0);
        }).toThrowError(`В массиве карт текущей таверны с id '0' отсутствует карта с id '0'.`);
    });
});
describe(`Test GetEnlistmentMercenariesAction method`, () => {
    it(`should get mercenary card from player's camp cards to place`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: CardTypeRusNames.MercenaryCard,
                            name: `Test`,
                            variants: {},
                        },
                    ],
                    stack: [
                        {},
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        };
        GetEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            type: CardTypeRusNames.MercenaryCard,
                            name: `Test`,
                            variants: {},
                        },
                    ],
                    stack: [
                        {
                            priority: 0,
                        },
                        {
                            stageName: EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries,
                            drawName: DrawNames.PlaceEnlistmentMercenaries,
                            priority: 0,
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                name: `Test`,
                                variants: {},
                            },
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' во время фазы '${PhaseNames.EnlistmentMercenaries}' выбрал наёмника 'Test'.`,
                },
            ],
        });
    });
    it(`shouldn't remove non-exists player's camp card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        };
        expect(() => {
            GetEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, 0);
        }).toThrowError(`В массиве карт лагеря игрока с id '0' отсутствует выбранная карта с id '0': это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't remove null card from tavern and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [
                        {},
                    ],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        };
        expect(() => {
            GetEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, 0);
        }).toThrowError(`Выбранная карта должна быть с типом '${CardTypeRusNames.MercenaryCard}'.`);
    });
});
describe(`Test GetMjollnirProfitAction method`, () => {
    it(`should get suit for end game Mjollnir profit`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            getMjollnirProfit: true,
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        GetMjollnirProfitAction({ G, ctx, myPlayerID: `0` }, SuitNames.hunter);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            suitIdForMjollnir: SuitNames.hunter,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' получил баф '${CommonBuffNames.SuitIdForMjollnir}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' потерял баф '${CampBuffNames.GetMjollnirProfit}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' выбрал фракцию '${suitsConfig[SuitNames.hunter].suitName}' для эффекта артефакта '${ArtefactNames.Mjollnir}'.`,
                },
            ],
        });
    });
});
describe(`Test PassEnlistmentMercenariesAction method`, () => {
    it(`should first player pass on the beginning of 'enlistmentMercenaries' phase`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        };
        PassEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` });
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' пасанул во время фазы '${PhaseNames.EnlistmentMercenaries}'.`,
                },
            ],
        });
    });
});
describe(`Test PickDiscardCardAction method`, () => {
    it(`should pick dwarf discarded card from discard deck`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [],
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` }, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [],
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.DwarfPlayerCard,
                                name: `Test`,
                                suit: SuitNames.warrior,
                                points: null,
                                rank: 1,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' взял карту '${CardTypeRusNames.DwarfCard}' 'Test' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.DwarfPlayerCard}' 'Test' во фракцию '${suitsConfig[SuitNames.warrior].suitName}'.`,
                },
            ],
        });
    });
    it(`should pick dwarf player discarded card from discard deck`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [],
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfPlayerCard,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` }, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [],
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.DwarfPlayerCard,
                                name: `Test`,
                                suit: SuitNames.warrior,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' взял карту '${CardTypeRusNames.DwarfPlayerCard}' 'Test' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.DwarfPlayerCard}' 'Test' во фракцию '${suitsConfig[SuitNames.warrior].suitName}'.`,
                },
            ],
        });
    });
    it(`should pick action discarded card from discard deck`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {},
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [
                {
                    stack: {
                        player: [
                            {
                                stageName: CommonStageNames.ClickCoinToUpgrade,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        ],
                    },
                    type: CardTypeRusNames.RoyalOfferingCard,
                    name: RoyalOfferingNames.PlusFive,
                    upgradeValue: 5,
                },
            ],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` }, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {
                            priority: 0,
                        },
                        {
                            priority: 0,
                            stageName: CommonStageNames.ClickCoinToUpgrade,
                            value: 5,
                            drawName: DrawNames.UpgradeCoin,
                        },
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [
                {
                    stack: {
                        player: [
                            {
                                priority: 0,
                                stageName: CommonStageNames.ClickCoinToUpgrade,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        ],
                    },
                    type: CardTypeRusNames.RoyalOfferingCard,
                    name: RoyalOfferingNames.PlusFive,
                    upgradeValue: 5,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' взял карту '${CardTypeRusNames.RoyalOfferingCard}' '${RoyalOfferingNames.PlusFive}' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.RoyalOfferingCard}' '${RoyalOfferingNames.PlusFive}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Карта '${CardTypeRusNames.RoyalOfferingCard}' '${RoyalOfferingNames.PlusFive}' убрана в сброс после применения её эффекта.`,
                },
            ],
        });
    });
    it(`should move thrud`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            playerSuit: SuitNames.hunter,
                            name: HeroNames.Thrud,
                        },
                    ],
                    stack: [
                        {},
                    ],
                    cards: {
                        hunter: [
                            {
                                suit: SuitNames.hunter,
                                name: HeroNames.Thrud,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.hunter,
                        },
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    playerSuit: SuitNames.hunter,
                    name: `Test`,
                },
            ],
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` }, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            playerSuit: SuitNames.hunter,
                            name: HeroNames.Thrud,
                        },
                    ],
                    stack: [
                        {
                            priority: 0,
                        },
                        {
                            priority: 2,
                            name: HeroNames.Thrud,
                            stageName: CommonStageNames.PlaceThrudHero,
                            drawName: DrawNames.PlaceThrudHero,
                        },
                    ],
                    cards: {
                        hunter: [
                            {
                                type: CardTypeRusNames.DwarfPlayerCard,
                                suit: SuitNames.hunter,
                                name: `Test`,
                                points: null,
                                rank: 1,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.hunter,
                        },
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' взял карту '${CardTypeRusNames.DwarfCard}' 'Test' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.DwarfPlayerCard}' 'Test' во фракцию '${suitsConfig[SuitNames.hunter].suitName}'.`,
                },
            ],
        });
    });
    it(`shouldn't remove non-exists discard card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {},
            },
            discardCardsDeck: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            PickDiscardCardAction({ G, ctx, myPlayerID: `0` }, 0);
        }).toThrowError(`В массиве колоды сброса отсутствует выбранная карта с id '0': это должно проверяться в MoveValidator.`);
    });
});
describe(`Test PlaceEnlistmentMercenariesAction method`, () => {
    it(`should get mercenary card from player's camp cards to place`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            path: ``,
                            name: `Test`,
                            variants: {
                                warrior: {
                                    suit: SuitNames.warrior,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.blacksmith,
                                    rank: 1,
                                    points: null,
                                },
                            },
                        },
                    ],
                    stack: [
                        {
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                    ],
                    heroes: [],
                    cards: {
                        blacksmith: [],
                        miner: [],
                    },
                    buffs: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        };
        PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, SuitNames.blacksmith);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            name: `Test`,
                            path: ``,
                            playerSuit: SuitNames.blacksmith,
                            points: null,
                            rank: 1,
                            type: CardTypeRusNames.MercenaryCard,
                            variants: {
                                blacksmith: {
                                    points: null,
                                    rank: 1,
                                    suit: SuitNames.blacksmith,
                                },
                                warrior: {
                                    points: 6,
                                    rank: 1,
                                    suit: SuitNames.warrior,
                                },
                            },
                        },
                    ],
                    stack: [
                        {
                            priority: 0,
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                playerSuit: SuitNames.blacksmith,
                                rank: 1,
                                points: null,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                        {
                            priority: 0,
                            stageName: EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries,
                            drawName: DrawNames.PlaceEnlistmentMercenaries,
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                playerSuit: SuitNames.blacksmith,
                                rank: 1,
                                points: null,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                    ],
                    heroes: [],
                    cards: {
                        blacksmith: [
                            {
                                type: CardTypeRusNames.MercenaryPlayerCard,
                                suit: SuitNames.blacksmith,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                path: ``,
                            },
                        ],
                        miner: [],
                    },
                    buffs: [],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            logData: [
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту лагеря '${CardTypeRusNames.MercenaryCard}' 'Test'.`,
                },
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.MercenaryPlayerCard}' 'Test' во фракцию '${suitsConfig[SuitNames.blacksmith].suitName}'.`,
                },
            ],
        });
    });
    it(`should get mercenary card from player's camp cards to place and move Thrud`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            path: ``,
                            name: `Test`,
                            variants: {
                                warrior: {
                                    suit: SuitNames.warrior,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.explorer,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                    ],
                    stack: [
                        {
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                suit: SuitNames.warrior,
                                name: HeroNames.Thrud,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.warrior,
                        },
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        };
        PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, SuitNames.warrior);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            name: `Test`,
                            path: ``,
                            playerSuit: SuitNames.warrior,
                            points: 6,
                            rank: 1,
                            type: CardTypeRusNames.MercenaryCard,
                            variants: {
                                blacksmith: {
                                    points: null,
                                    rank: 1,
                                    suit: SuitNames.blacksmith,
                                },
                                warrior: {
                                    points: 6,
                                    rank: 1,
                                    suit: SuitNames.warrior,
                                },
                            },
                        },
                    ],
                    stack: [
                        {
                            priority: 0,
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                playerSuit: SuitNames.warrior,
                                rank: 1,
                                points: 6,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                        {
                            drawName: DrawNames.PlaceThrudHero,
                            name: HeroNames.Thrud,
                            priority: 2,
                            stageName: CommonStageNames.PlaceThrudHero,
                        },
                        {
                            priority: 0,
                            stageName: EnlistmentMercenariesStageNames.PlaceEnlistmentMercenaries,
                            drawName: DrawNames.PlaceEnlistmentMercenaries,
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                playerSuit: SuitNames.warrior,
                                rank: 1,
                                points: 6,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.MercenaryPlayerCard,
                                suit: SuitNames.warrior,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                path: ``,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.warrior,
                        },
                    ],
                },
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            },
            logData: [
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту лагеря '${CardTypeRusNames.MercenaryCard}' 'Test'.`,
                },
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.MercenaryPlayerCard}' 'Test' во фракцию '${suitsConfig[SuitNames.warrior].suitName}'.`,
                },
            ],
        });
    });
    it(`shouldn't get non-mercenary card to place and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    stack: [
                        {
                            card: {
                                type: CardTypeRusNames.DwarfCard,
                            },
                        },
                    ],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, SuitNames.blacksmith);
        }).toThrowError(`Выбранная карта должна быть с типом '${CardTypeRusNames.MercenaryCard}'.`);
    });
    it(`shouldn't get mercenary card which not exists in player's camp cards to place and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            name: ``,
                            variants: {},
                        },
                    ],
                    cards: {
                        explorer: [],
                    },
                    stack: [
                        {
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            logData: [],
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, SuitNames.warrior);
        }).toThrowError(`У игрока с id '0' в массиве карт лагеря отсутствует выбранная карта.`);
    });
    it(`shouldn't use non-existing suit in picked mercenary card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {
                    stack: [
                        {
                            card: {
                                type: CardTypeRusNames.MercenaryCard,
                                path: ``,
                                name: `Test`,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.blacksmith,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        },
                    ],
                },
            },
        }, ctx = {
            currentPlayer: `0`,
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` }, SuitNames.hunter);
        }).toThrowError(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${SuitNames.hunter}'.`);
    });
});
//# sourceMappingURL=Action.test.js.map