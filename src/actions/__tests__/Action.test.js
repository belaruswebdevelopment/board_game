import { suitsConfig } from "../../data/SuitData";
import { ArtefactNames, BuffNames, DrawNames, GameNames, HeroNames, LogTypeNames, PhaseNames, RoyalOfferingNames, RusCardTypeNames, RusSuitNames, StageNames, SuitNames, TavernNames } from "../../typescript/enums";
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
                                name: `Test`,
                                suit: SuitNames.Warrior,
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
        };
        DiscardAnyCardFromPlayerBoardAction(G, {
            currentPlayer: `0`,
        }, SuitNames.Warrior, 0);
        expect(G).toEqual({
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
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${BuffNames.DiscardCardEndGame}'.`,
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
                                name: ArtefactNames.Brisingamens,
                                description: `Test`,
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
        };
        DiscardAnyCardFromPlayerBoardAction(G, {
            currentPlayer: `0`,
        }, SuitNames.Warrior, 0);
        expect(G).toEqual({
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
                    name: ArtefactNames.Brisingamens,
                    description: `Test`,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту '${ArtefactNames.Brisingamens}' в колоду сброса карт лагеря.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${BuffNames.DiscardCardEndGame}'.`,
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
                                name: `Test`,
                                suit: SuitNames.Warrior,
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
        };
        DiscardAnyCardFromPlayerBoardAction(G, {
            currentPlayer: `0`,
        }, SuitNames.Warrior, 0);
        expect(G).toEqual({
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
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт лагеря.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${BuffNames.DiscardCardEndGame}'.`,
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
                            {},
                        ],
                    },
                },
            },
        };
        expect(() => {
            DiscardAnyCardFromPlayerBoardAction(G, {
                currentPlayer: `0`,
            }, SuitNames.Warrior, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${RusCardTypeNames.Hero_Card}'.`);
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
        };
        expect(() => {
            DiscardAnyCardFromPlayerBoardAction(G, {
                currentPlayer: `0`,
            }, SuitNames.Warrior, 0);
        }).toThrowError(`В массиве карт игрока с id '0' отсутствует выбранная карта во фракции '${RusSuitNames['warrior']}' с id '0': это должно проверяться в MoveValidator.`);
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
                        name: `Test`,
                        suit: SuitNames.Warrior,
                    },
                ],
            ],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        };
        DiscardCardFromTavernAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            currentTavern: 0,
            taverns: [
                [null],
            ],
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ],
            tavernCardDiscarded2Players: true,
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил в колоду сброса карту из таверны:`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Карта 'Test' из таверны ${TavernNames.LaughingGoblin} убрана в сброс.`,
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
            ],
            logData: [],
        };
        expect(() => {
            DiscardCardFromTavernAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`Не удалось сбросить карту с id '0' из таверны`);
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
            ],
            logData: [],
        };
        expect(() => {
            DiscardCardFromTavernAction(G, {
                currentPlayer: `0`,
            }, 0);
        }).toThrowError(`В текущей таверне с id '0' отсутствует карта с id '0'.`);
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
        };
        GetEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            name: `Test`,
                            variants: {},
                        },
                    ],
                    stack: [
                        {},
                        {
                            config: {
                                drawName: DrawNames.PlaceEnlistmentMercenaries,
                            },
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' во время фазы 'enlistmentMercenaries' выбрал наёмника 'Test'.`,
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
        };
        expect(() => {
            GetEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            }, 0);
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
        };
        expect(() => {
            GetEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            }, 0);
        }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypeNames.Mercenary_Card}'.`);
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
        };
        GetMjollnirProfitAction(G, {
            currentPlayer: `0`,
        }, SuitNames.Hunter);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            suitIdForMjollnir: SuitNames.Hunter,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' получил баф '${BuffNames.SuitIdForMjollnir}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${BuffNames.GetMjollnirProfit}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' выбрал фракцию '${suitsConfig[SuitNames.Hunter].suitName}' для эффекта артефакта '${ArtefactNames.Mjollnir}'.`,
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
        };
        PassEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        });
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                },
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' пасанул во время фазы '${PhaseNames.EnlistmentMercenaries}'.`,
                },
            ],
        });
    });
});
describe(`Test PickDiscardCardAction method`, () => {
    it(`should pick non-action discarded card from discard deck`, () => {
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
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ],
            logData: [],
        };
        PickDiscardCardAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.Warrior,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' взял карту 'Test' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.Warrior].suitName}'.`,
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
            discardCardsDeck: [
                {
                    stack: [
                        {
                            stageName: StageNames.UpgradeCoin,
                            value: 5,
                            drawName: DrawNames.UpgradeCoin,
                        }
                    ],
                    name: RoyalOfferingNames.PlusFive,
                    value: 5,
                },
            ],
            logData: [],
        };
        PickDiscardCardAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {},
                        {
                            config: {
                                stageName: StageNames.UpgradeCoin,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        },
                    ],
                },
            },
            discardCardsDeck: [
                {
                    stack: [
                        {
                            stageName: StageNames.UpgradeCoin,
                            value: 5,
                            drawName: DrawNames.UpgradeCoin,
                        }
                    ],
                    name: RoyalOfferingNames.PlusFive,
                    value: 5,
                },
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' взял карту 'Test' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: "Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.",
                },
            ],
        });
    });
    it(`should add action to stack if actionsNum = 2`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [],
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ],
            logData: [],
        };
        PickDiscardCardAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [],
                    stack: [
                        {},
                        {
                            config: {
                                stageName: StageNames.PickDiscardCard,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.Warrior,
                            },
                        ],
                    },
                    buffs: [],
                },
            },
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' взял карту 'Test' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.Warrior].suitName}'.`,
                },
            ],
        });
    });
    /* it(`should pick hero`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [] as IHeroCard[],
                    pickedCard: null,
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        miner: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        explorer: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                    } as RequiredSuitPropertyTypes<PlayerCardsType[]>,
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                } as ICard,
            ],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        PickDiscardCardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    actionsNum: 1,
                    nickname: `Dan`,
                    heroes: [] as IHeroCard[],
                    pickedCard: {
                        name: `Test`,
                        rank: 1,
                        suit: SuitNames.WARRIOR,
                    } as ICard,
                    stack: [
                        {},
                        {
                            config: {
                                stageName: Stages.PickHero,
                                drawName: DrawNames.PickHero,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                            } as ICard,
                        ],
                        hunter: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        miner: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        explorer: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                    } as RequiredSuitPropertyTypes<PlayerCardsType[]>,
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.WARRIOR].suitName}'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' должен выбрать нового героя.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' взял карту 'Test' из колоды сброса.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    }); */
    it(`should move thrud`, () => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.Hunter,
                            name: HeroNames.Thrud,
                        },
                    ],
                    stack: [
                        {},
                    ],
                    cards: {
                        hunter: [
                            {
                                suit: SuitNames.Hunter,
                                name: HeroNames.Thrud,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: true,
                        },
                    ],
                },
            },
            discardCardsDeck: [
                {
                    suit: SuitNames.Hunter,
                    name: `Test`,
                },
            ],
            logData: [],
        };
        PickDiscardCardAction(G, {
            currentPlayer: `0`,
        }, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.Hunter,
                            name: HeroNames.Thrud,
                        },
                    ],
                    stack: [
                        {},
                        {
                            mercenaryVariants: {
                                blacksmith: {
                                    suit: SuitNames.Blacksmith,
                                    rank: 1,
                                    points: null,
                                },
                                hunter: {
                                    suit: SuitNames.Hunter,
                                    rank: 1,
                                    points: null,
                                },
                                explorer: {
                                    suit: SuitNames.Explorer,
                                    rank: 1,
                                    points: null,
                                },
                                warrior: {
                                    suit: SuitNames.Warrior,
                                    rank: 1,
                                    points: null,
                                },
                                miner: {
                                    suit: SuitNames.Miner,
                                    rank: 1,
                                    points: null,
                                },
                            },
                            config: {
                                stageName: StageNames.PlaceThrudHero,
                                drawName: DrawNames.PlaceThrudHero,
                            },
                        },
                    ],
                    cards: {
                        hunter: [
                            {
                                suit: SuitNames.Hunter,
                                name: `Test`,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: true,
                        },
                    ],
                },
            },
            discardCardsDeck: [],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' взял карту 'Test' из колоды сброса.`,
                },
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.Hunter].suitName}'.`,
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
        };
        expect(() => {
            PickDiscardCardAction(G, {
                currentPlayer: `0`,
            }, 0);
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
                                    suit: SuitNames.Warrior,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.Blacksmith,
                                    rank: 1,
                                    points: null,
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
            logData: [],
        };
        PlaceEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        }, SuitNames.Blacksmith);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [],
                    heroes: [],
                    cards: {
                        blacksmith: [
                            {
                                type: RusCardTypeNames.Mercenary_Player_Card,
                                suit: SuitNames.Blacksmith,
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
            logData: [
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.Blacksmith].suitName}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' во время фазы '${PhaseNames.EnlistmentMercenaries}' завербовал наёмника 'Test'.`,
                },
            ],
        });
    });
    /* it(`should get mercenary card from player's camp cards to place and pick hero`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [
                        {
                            tier: 0,
                            path: ``,
                            name: `Test`,
                            variants: {
                                warrior: {
                                    suit: SuitNames.WARRIOR,
                                    rank: 1,
                                    points: 6,
                                },
                                blacksmith: {
                                    suit: SuitNames.BLACKSMITH,
                                    rank: 1,
                                    points: null,
                                },
                            },
                        } as IMercenaryCampCard,
                    ],
                    heroes: [] as IHeroCard[],
                    pickedCard: {
                        tier: 0,
                        path: ``,
                        name: `Test`,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            blacksmith: {
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                            },
                        },
                    } as IMercenaryCampCard,
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [],
                        hunter: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        miner: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        explorer: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                    } as RequiredSuitPropertyTypes<PlayerCardsType[]>,
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        PlaceEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: Phases.EnlistmentMercenaries,
        } as Ctx, SuitNames.WARRIOR);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [] as CampDeckCardTypes[],
                    heroes: [] as IHeroCard[],
                    pickedCard: {
                        type: RusCardTypes.MERCENARYPLAYERCARD,
                        suit: SuitNames.WARRIOR,
                        rank: 1,
                        points: 6,
                        name: `Test`,
                        tier: 0,
                        path: ``,
                        game: GameNames.Thingvellir,
                        variants: {
                            warrior: {
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                            },
                            blacksmith: {
                                suit: SuitNames.BLACKSMITH,
                                rank: 1,
                                points: null,
                            },
                        },
                    },
                    stack: [
                        {},
                        {
                            config: {
                                stageName: Stages.PickHero,
                                drawName: DrawNames.PickHero,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.MERCENARYPLAYERCARD,
                                suit: SuitNames.WARRIOR,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.WARRIOR,
                                        rank: 1,
                                        points: 6,
                                    },
                                    blacksmith: {
                                        suit: SuitNames.BLACKSMITH,
                                        rank: 1,
                                        points: null,
                                    },
                                },
                            },
                        ],
                        hunter: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        miner: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        blacksmith: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                        explorer: [
                            {
                                rank: 1,
                            } as ICard,
                        ],
                    },
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypes.PUBLIC,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.WARRIOR].suitName}'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' во время фазы '${Phases.EnlistmentMercenaries}' завербовал наёмника 'Test'.`,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок 'Dan' должен выбрать нового героя.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    }); */
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
                                    suit: SuitNames.Warrior,
                                    rank: 1,
                                    points: 6,
                                },
                                explorer: {
                                    suit: SuitNames.Explorer,
                                    rank: 1,
                                    points: 8,
                                },
                            },
                        },
                    ],
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [
                            {
                                suit: SuitNames.Warrior,
                                name: HeroNames.Thrud,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: true,
                        },
                    ],
                },
            },
            logData: [],
        };
        PlaceEnlistmentMercenariesAction(G, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        }, SuitNames.Warrior);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [],
                    stack: [
                        {},
                        {
                            mercenaryVariants: {
                                blacksmith: {
                                    suit: SuitNames.Blacksmith,
                                    rank: 1,
                                    points: null,
                                },
                                hunter: {
                                    suit: SuitNames.Hunter,
                                    rank: 1,
                                    points: null,
                                },
                                explorer: {
                                    suit: SuitNames.Explorer,
                                    rank: 1,
                                    points: null,
                                },
                                warrior: {
                                    suit: SuitNames.Warrior,
                                    rank: 1,
                                    points: null,
                                },
                                miner: {
                                    suit: SuitNames.Miner,
                                    rank: 1,
                                    points: null,
                                },
                            },
                            config: {
                                stageName: StageNames.PlaceThrudHero,
                                drawName: DrawNames.PlaceThrudHero,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypeNames.Mercenary_Player_Card,
                                suit: SuitNames.Warrior,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
                                variants: {
                                    warrior: {
                                        suit: SuitNames.Warrior,
                                        rank: 1,
                                        points: 6,
                                    },
                                    explorer: {
                                        suit: SuitNames.Explorer,
                                        rank: 1,
                                        points: 8,
                                    },
                                },
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: true,
                        },
                    ],
                },
            },
            logData: [
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.Warrior].suitName}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' во время фазы '${PhaseNames.EnlistmentMercenaries}' завербовал наёмника 'Test'.`,
                },
            ],
        });
    });
    it(`shouldn't get non-mercenary card from player's camp cards to place and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {},
            },
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
            }, SuitNames.Blacksmith);
        }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypeNames.Mercenary_Card}'.`);
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
                },
            },
            logData: [],
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
            }, SuitNames.Explorer);
        }).toThrowError(`У игрока с id '0' в массиве карт лагеря отсутствует выбранная карта.`);
    });
    it(`shouldn't use non-existing suit in picked mercenary card and must throw Error`, () => {
        const G = {
            publicPlayers: {
                0: {},
            },
        };
        expect(() => {
            PlaceEnlistmentMercenariesAction(G, {
                currentPlayer: `0`,
            }, SuitNames.Hunter);
        }).toThrowError(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${SuitNames.Hunter}'.`);
    });
});
//# sourceMappingURL=Action.test.js.map