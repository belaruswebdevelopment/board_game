import { suitsConfig } from "../../data/SuitData";
import { ArtefactDescriptionNames, ArtefactNames, CampBuffNames, CardTypeRusNames, CommonBuffNames, CommonStageNames, DrawNames, GameNames, HeroNames, LogTypeNames, PhaseNames, RoyalOfferingNames, SuitNames, SuitRusNames, TavernNames } from "../../typescript/enums";
import type { ArtefactPlayerCampCard, CampCardType, CanBeNullType, Ctx, DwarfCard, DwarfDeckCardType, HeroCard, HeroPlayerCard, IPublicPlayer, IPublicPlayers, MercenaryCampCard, MercenaryPlayerCampCard, MyFnContextWithMyPlayerID, MyGameState, PlayerBuffs, PlayerCardType, RoyalOfferingCard, SuitPropertyType } from "../../typescript/interfaces";
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
                                type: CardTypeRusNames.Dwarf_Card,
                                name: `Test`,
                                suit: SuitNames.warrior,
                            } as DwarfCard,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardAnyCardFromPlayerBoardAction({ G, ctx } as MyFnContextWithMyPlayerID,
            SuitNames.warrior, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.Dwarf_Card,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ] as DwarfDeckCardType[],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should remove artefact discarded card from player's cards to camp cards discard`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.Artefact_Player_Card,
                                name: ArtefactNames.Vegvisir,
                                description: ArtefactDescriptionNames.Vegvisir,
                            } as ArtefactPlayerCampCard,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardAnyCardFromPlayerBoardAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.warrior, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    type: CardTypeRusNames.Artefact_Player_Card,
                    name: ArtefactNames.Vegvisir,
                    description: ArtefactDescriptionNames.Vegvisir,
                } as ArtefactPlayerCampCard,
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту '${ArtefactNames.Brisingamens}' в колоду сброса карт лагеря.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>);
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
                                type: CardTypeRusNames.Mercenary_Player_Card,
                                name: `Test`,
                                suit: SuitNames.warrior,
                            } as MercenaryPlayerCampCard,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardAnyCardFromPlayerBoardAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.warrior, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    type: CardTypeRusNames.Mercenary_Player_Card,
                    name: `Test`,
                    suit: SuitNames.warrior,
                } as MercenaryPlayerCampCard,
            ],
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' отправил карту 'Test' в колоду сброса карт лагеря.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>);
    });
    it(`shouldn't remove hero discarded card from player's cards and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.Hero_Player_Card,
                            },
                        ] as PlayerCardType[],
                    },
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardAnyCardFromPlayerBoardAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.warrior, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${CardTypeRusNames.Hero_Player_Card}'.`);
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
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardAnyCardFromPlayerBoardAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.warrior, 0);
        }).toThrowError(`В массиве карт игрока с id '0' отсутствует выбранная карта во фракции '${SuitRusNames.warrior}' с id '0': это должно проверяться в MoveValidator.`);
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
                        type: CardTypeRusNames.Dwarf_Card,
                        name: `Test`,
                        suit: SuitNames.warrior,
                    },
                ] as CanBeNullType<DwarfDeckCardType>[],
                [],
                [],
            ],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`
            | `tavernCardDiscarded2Players`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardCardFromTavernAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as IPublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [null] as CanBeNullType<DwarfDeckCardType>[],
                [],
                [],
            ],
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.Dwarf_Card,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ] as DwarfDeckCardType[],
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`>);
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
                [null] as CanBeNullType<DwarfDeckCardType>[],
                [],
                [],
            ],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `taverns` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardCardFromTavernAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        }).toThrowError(`Не удалось сбросить карту с id '0' из текущей таверны с id '0'.`);
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
                [],
                [],
            ],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `taverns` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardCardFromTavernAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        }).toThrowError(`В текущей таверне с id '0' отсутствует карта для сброса с id '0'.`);
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
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        GetEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
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
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
    });
    it(`shouldn't remove non-exists player's camp card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [] as CampCardType[],
                } as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        expect((): void => {
            GetEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
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
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        expect((): void => {
            GetEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        }).toThrowError(`Выбранная карта должна быть с типом '${CardTypeRusNames.Mercenary_Card}'.`);
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
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        GetMjollnirProfitAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.hunter);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            suitIdForMjollnir: SuitNames.hunter,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' получил баф '${CommonBuffNames.SuitIdForMjollnir}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' потерял баф '${CampBuffNames.GetMjollnirProfit}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' выбрал фракцию '${suitsConfig[SuitNames.hunter].suitName}' для эффекта артефакта '${ArtefactNames.Mjollnir}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
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
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        PassEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID);
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
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test PickDiscardCardAction method`, (): void => {
    it(`should pick non-action discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
                    cards: {
                        warrior: [] as PlayerCardType[],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ] as DwarfDeckCardType[],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.warrior,
                            } as DwarfCard,
                        ],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as PlayerBuffs[],
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
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.warrior].suitName}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
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
                    stack: {
                        player: [
                            {
                                stageName: CommonStageNames.ClickCoinToUpgrade,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        ],
                    },
                    name: RoyalOfferingNames.PlusFive,
                    value: 5,

                } as RoyalOfferingCard,
            ],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {},
                        {
                            config: {
                                stageName: CommonStageNames.ClickCoinToUpgrade,
                                value: 5,
                                drawName: DrawNames.UpgradeCoin,
                            },
                        },
                    ],
                } as IPublicPlayer,
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
                    name: RoyalOfferingNames.PlusFive,
                    value: 5,

                } as RoyalOfferingCard,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should add action to stack if actionsNum = 2`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
                    stack: [
                        {},
                    ],
                    cards: {
                        warrior: [] as PlayerCardType[],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    name: `Test`,
                    suit: SuitNames.warrior,
                } as DwarfCard,
            ],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
                    stack: [
                        {},
                        {
                            config: {
                                stageName: CommonStageNames.PickDiscardCard,
                                drawName: DrawNames.Brisingamens,
                                number: undefined,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                name: `Test`,
                                suit: SuitNames.warrior,
                            } as DwarfCard,
                        ],
                    } as SuitPropertyType<PlayerCardType[]>,
                    buffs: [] as PlayerBuffs[],
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
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.warrior].suitName}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`should move thrud`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.hunter,
                            name: HeroNames.Thrud,
                        } as HeroCard,
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
                } as IPublicPlayer,
            },
            discardCardsDeck: [
                {
                    suit: SuitNames.hunter,
                    name: `Test`,
                } as DwarfCard,
            ],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [
                        {
                            suit: SuitNames.hunter,
                            name: HeroNames.Thrud,
                        } as HeroCard,
                    ],
                    stack: [
                        {},
                        {
                            mercenaryVariants: {
                                blacksmith: {
                                    suit: SuitNames.blacksmith,
                                    rank: 1,
                                    points: null,
                                },
                                hunter: {
                                    suit: SuitNames.hunter,
                                    rank: 1,
                                    points: null,
                                },
                                explorer: {
                                    suit: SuitNames.explorer,
                                    rank: 1,
                                    points: null,
                                },
                                warrior: {
                                    suit: SuitNames.warrior,
                                    rank: 1,
                                    points: null,
                                },
                                miner: {
                                    suit: SuitNames.miner,
                                    rank: 1,
                                    points: null,
                                },
                            },
                            config: {
                                stageName: CommonStageNames.PlaceThrudHero,
                                drawName: DrawNames.PlaceThrudHero,
                            },
                        },
                    ],
                    cards: {
                        hunter: [
                            {
                                suit: SuitNames.hunter,
                                name: `Test`,
                            },
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.hunter,
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
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.hunter].suitName}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>);
    });
    it(`shouldn't remove non-exists discard card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
            },
            discardCardsDeck: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            PickDiscardCardAction({ G, ctx } as MyFnContextWithMyPlayerID, 0);
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
                        } as MercenaryCampCard,
                    ],
                    heroes: [] as HeroCard[],
                    cards: {
                        blacksmith: [] as PlayerCardType[],
                        miner: [] as PlayerCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        PlaceEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.blacksmith);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [] as CampCardType[],
                    heroes: [] as HeroCard[],
                    cards: {
                        blacksmith: [
                            {
                                type: CardTypeRusNames.Mercenary_Player_Card,
                                suit: SuitNames.blacksmith,
                                rank: 1,
                                points: null,
                                name: `Test`,
                                path: ``,
                            },
                        ],
                        miner: [] as PlayerCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.blacksmith].suitName}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' во время фазы '${PhaseNames.EnlistmentMercenaries}' завербовал наёмника 'Test'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
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
                        {},
                    ],
                    cards: {
                        warrior: [
                            {
                                suit: SuitNames.warrior,
                                name: HeroNames.Thrud,
                            } as HeroPlayerCard,
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.warrior,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        PlaceEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.warrior);
        expect(G).toEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [] as CampCardType[],
                    stack: [
                        {},
                        {
                            mercenaryVariants: {
                                blacksmith: {
                                    suit: SuitNames.blacksmith,
                                    rank: 1,
                                    points: null,
                                },
                                hunter: {
                                    suit: SuitNames.hunter,
                                    rank: 1,
                                    points: null,
                                },
                                explorer: {
                                    suit: SuitNames.explorer,
                                    rank: 1,
                                    points: null,
                                },
                                warrior: {
                                    suit: SuitNames.warrior,
                                    rank: 1,
                                    points: null,
                                },
                                miner: {
                                    suit: SuitNames.miner,
                                    rank: 1,
                                    points: null,
                                },
                            },
                            config: {
                                stageName: CommonStageNames.PlaceThrudHero,
                                drawName: DrawNames.PlaceThrudHero,
                            },
                        },
                    ],
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.Mercenary_Player_Card,
                                suit: SuitNames.warrior,
                                rank: 1,
                                points: 6,
                                name: `Test`,
                                tier: 0,
                                path: ``,
                                game: GameNames.Thingvellir,
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
                            } as MercenaryPlayerCampCard,
                        ],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.warrior,
                        },
                    ],
                } as IPublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Public,
                    value: `Игрок 'Dan' выбрал карту 'Test' во фракцию '${suitsConfig[SuitNames.warrior].suitName}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    value: `Игрок 'Dan' во время фазы '${PhaseNames.EnlistmentMercenaries}' завербовал наёмника 'Test'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
    });
    it(`shouldn't get non-mercenary card from player's camp cards to place and must throw Error`, ():
        void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
            } as IPublicPlayers,
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            PlaceEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.blacksmith);
        }).toThrowError(`Выбранная карта должна быть с типом '${CardTypeRusNames.Mercenary_Card}'.`);
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
                            } as MercenaryCampCard,
                        ],
                        cards: {
                            explorer: [] as PlayerCardType[],
                        },
                    } as IPublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                PlaceEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.explorer);
            }).toThrowError(`У игрока с id '0' в массиве карт лагеря отсутствует выбранная карта.`);
        });
    it(`shouldn't use non-existing suit in picked mercenary card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as IPublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            PlaceEnlistmentMercenariesAction({ G, ctx } as MyFnContextWithMyPlayerID, SuitNames.hunter);
        }).toThrowError(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${SuitNames.hunter}'.`);
    });
});
