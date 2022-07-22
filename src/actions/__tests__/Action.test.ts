import type { Ctx } from "boardgame.io";
import { suitsConfig } from "../../data/SuitData";
import { ArtefactNames, BuffNames, DrawNames, GameNames, HeroNames, LogTypeNames, PhaseNames, RoyalOfferingNames, RusCardTypeNames, RusSuitNames, StageNames, SuitNames, TavernNames } from "../../typescript/enums";
import type { CampDeckCardType, DeckCardTypes, IArtefactCampCard, IArtefactPlayerCampCard, IBuffs, IDwarfCard, IHeroCard, IHeroPlayerCard, IMercenaryCampCard, IMercenaryPlayerCard, IMyGameState, IPublicPlayer, IPublicPlayers, IRoyalOfferingCard, PlayerCardType, SuitPropertyType, TavernCardType } from "../../typescript/interfaces";
import { DiscardAnyCardFromPlayerBoardAction, DiscardCardFromTavernAction, GetEnlistmentMercenariesAction, GetMjollnirProfitAction, PassEnlistmentMercenariesAction, PickDiscardCardAction, PlaceEnlistmentMercenariesAction } from "../Actions";

describe(`Test DiscardAnyCardFromPlayerBoardAction method`, (): void => {
    it(`should remove non-hero discarded card from player's cards to cards discard`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.Warrior,
                            } as IDwarfCard,
                        ],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            discardCardsDeck: [],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, SuitNames.Warrior, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    buffs: [] as IBuffs[],
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
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${BuffNames.DiscardCardEndGame}'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should remove artefact discarded card from player's cards to camp cards discard`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                name: ArtefactNames.Brisingamens,
                                description: `Test`,
                            } as IArtefactPlayerCampCard,
                        ],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>;
        DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, SuitNames.Warrior, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    name: ArtefactNames.Brisingamens,
                    description: `Test`,
                } as IArtefactCampCard,
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
        } as Pick<IMyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>);
    });
    it(`should remove mercenary player discarded card from player's cards to camp cards discard`, ():
        void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.Warrior,
                            } as IMercenaryPlayerCard,
                        ],
                    },
                    buffs: [
                        {
                            discardCardEndGame: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>;
        DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, SuitNames.Warrior, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                } as IMercenaryPlayerCard,
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
        } as Pick<IMyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>);
    });
    it(`shouldn't remove hero discarded card from player's cards and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    cards: {
                        warrior: [
                            {},
                        ] as PlayerCardType[],
                    },
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, SuitNames.Warrior, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${RusCardTypeNames.Hero_Card}'.`);
    });
    it(`shouldn't remove non-exists player's card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    cards: {
                        warrior: [] as PlayerCardType[],
                    } as SuitPropertyType<PlayerCardType[]>,
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, SuitNames.Warrior, 0);
        }).toThrowError(`В массиве карт игрока с id '0' отсутствует выбранная карта во фракции '${RusSuitNames['warrior']}' с id '0': это должно проверяться в MoveValidator.`);
    });
});

describe(`Test DiscardCardFromTavernAction method`, (): void => {
    it(`should remove non-null card from tavern`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as IPublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [
                    {
                        name: `Test`,
                        suit: SuitNames.Warrior,
                    },
                ],
            ] as TavernCardType[][],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`
            | `tavernCardDiscarded2Players`>;
        DiscardCardFromTavernAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as IPublicPlayer,
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
            ] as DeckCardTypes[],
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
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`>);
    });
    it(`shouldn't remove null card from tavern and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as IPublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [null],
            ],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `taverns` | `logData`>;
        expect((): void => {
            DiscardCardFromTavernAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, 0);
        }).toThrowError(`Не удалось сбросить карту с id '0' из таверны`);
    });
    it(`shouldn't remove non-exists card from tavern and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as IPublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [],
            ],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `currentTavern` | `taverns` | `logData`>;
        expect((): void => {
            DiscardCardFromTavernAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, 0);
        }).toThrowError(`В текущей таверне с id '0' отсутствует карта с id '0'.`);
    });
});

describe(`Test GetEnlistmentMercenariesAction method`, (): void => {
    it(`should get mercenary card from player's camp cards to place`, (): void => {
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
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        GetEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        } as Ctx, 0);
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
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' во время фазы 'enlistmentMercenaries' выбрал наёмника 'Test'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`shouldn't remove non-exists player's camp card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [] as CampDeckCardType[],
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            GetEnlistmentMercenariesAction(G as IMyGameState, {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx, 0);
        }).toThrowError(`В массиве карт лагеря игрока с id '0' отсутствует выбранная карта с id '0': это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't remove null card from tavern and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [
                        {},
                    ],
                } as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            GetEnlistmentMercenariesAction(G as IMyGameState, {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx, 0);
        }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypeNames.Mercenary_Card}'.`);
    });
});

describe(`Test GetMjollnirProfitAction method`, (): void => {
    it(`should get suit for end game Mjollnir profit`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            getMjollnirProfit: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        GetMjollnirProfitAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, SuitNames.Hunter);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            suitIdForMjollnir: SuitNames.Hunter,
                        },
                    ],
                } as IPublicPlayer,
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
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test PassEnlistmentMercenariesAction method`, (): void => {
    it(`should first player pass on the beginning of 'enlistmentMercenaries' phase`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        PassEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        } as Ctx);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' пасанул во время фазы '${PhaseNames.EnlistmentMercenaries}'.`,
                },
            ],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test PickDiscardCardAction method`, (): void => {
    it(`should pick non-action discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as IHeroCard[],
                    cards: {
                        warrior: [] as PlayerCardType[],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as IBuffs,
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                },
            ] as DeckCardTypes[],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        PickDiscardCardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as IHeroCard[],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.Warrior,
                            } as IDwarfCard,
                        ],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
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
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should pick action discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {},
                    ],
                } as IPublicPlayer,
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

                } as IRoyalOfferingCard,
            ],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        PickDiscardCardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
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
                } as IPublicPlayer,
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

                } as IRoyalOfferingCard,
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
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should add action to stack if actionsNum = 2`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as IHeroCard[],
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [] as PlayerCardType[],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.Warrior,
                } as IDwarfCard,
            ],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        PickDiscardCardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as IHeroCard[],
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
                            } as IDwarfCard,
                        ],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
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
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should move thrud`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.Hunter,
                            name: HeroNames.Thrud,
                        } as IHeroCard,
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
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    suit: SuitNames.Hunter,
                    name: `Test`,
                } as IDwarfCard,
            ],
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>;
        PickDiscardCardAction(G as IMyGameState, {
            currentPlayer: `0`,
        } as Ctx, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.Hunter,
                            name: HeroNames.Thrud,
                        } as IHeroCard,
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
                } as IPublicPlayer,
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
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`shouldn't remove non-exists discard card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
            },
            discardCardsDeck: [],
        } as Pick<IMyGameState, `publicPlayers` | `discardCardsDeck`>;
        expect((): void => {
            PickDiscardCardAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, 0);
        }).toThrowError(`В массиве колоды сброса отсутствует выбранная карта с id '0': это должно проверяться в MoveValidator.`);
    });
});

describe(`Test PlaceEnlistmentMercenariesAction method`, (): void => {
    it(`should get mercenary card from player's camp cards to place`, (): void => {
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
                        } as IMercenaryCampCard,
                    ],
                    heroes: [] as IHeroCard[],
                    cards: {
                        blacksmith: [] as PlayerCardType[],
                        miner: [] as PlayerCardType[],
                    },
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        PlaceEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        } as Ctx, SuitNames.Blacksmith);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [] as CampDeckCardType[],
                    heroes: [] as IHeroCard[],
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
                        miner: [] as PlayerCardType[],
                    },
                    buffs: [] as IBuffs[],
                } as IPublicPlayer,
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
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`should get mercenary card from player's camp cards to place and move Thrud`, (): void => {
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
                            } as IHeroPlayerCard,
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: true,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<IMyGameState, `publicPlayers` | `logData`>;
        PlaceEnlistmentMercenariesAction(G as IMyGameState, {
            currentPlayer: `0`,
            phase: PhaseNames.EnlistmentMercenaries,
        } as Ctx, SuitNames.Warrior);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [] as CampDeckCardType[],
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
                            } as IMercenaryPlayerCard,
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: true,
                        },
                    ],
                } as IPublicPlayer,
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
        } as Pick<IMyGameState, `publicPlayers` | `logData`>);
    });
    it(`shouldn't get non-mercenary card from player's camp cards to place and must throw Error`, ():
        void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
            } as IPublicPlayers,
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            PlaceEnlistmentMercenariesAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, SuitNames.Blacksmith);
        }).toThrowError(`Выбранная карта должна быть с типом '${RusCardTypeNames.Mercenary_Card}'.`);
    });
    it(`shouldn't get mercenary card which not exists in player's camp cards to place and must throw Error`,
        (): void => {
            const G = {
                publicPlayers: {
                    0: {
                        nickname: `Dan`,
                        campCards: [
                            {
                                name: ``,
                                variants: {},
                            } as IMercenaryCampCard,
                        ],
                        cards: {
                            explorer: [] as PlayerCardType[],
                        },
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<IMyGameState, `publicPlayers` | `logData`>;
            expect((): void => {
                PlaceEnlistmentMercenariesAction(G as IMyGameState, {
                    currentPlayer: `0`,
                } as Ctx, SuitNames.Explorer);
            }).toThrowError(`У игрока с id '0' в массиве карт лагеря отсутствует выбранная карта.`);
        });
    it(`shouldn't use non-existing suit in picked mercenary card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
            },
        } as Pick<IMyGameState, `publicPlayers`>;
        expect((): void => {
            PlaceEnlistmentMercenariesAction(G as IMyGameState, {
                currentPlayer: `0`,
            } as Ctx, SuitNames.Hunter);
        }).toThrowError(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${SuitNames.Hunter}'.`);
    });
});
