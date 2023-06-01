import { suitsConfig } from "../../data/SuitData";
import { ArtefactDescriptionNames, ArtefactNames, CampBuffNames, CardTypeRusNames, CommonBuffNames, CommonStageNames, DrawNames, EnlistmentMercenariesStageNames, HeroNames, LogTypeNames, PhaseNames, RoyalOfferingNames, SuitNames, SuitRusNames, TavernNames } from "../../typescript/enums";
import type { CampDeckCardType, Ctx, DiscardCampCardType, DiscardDeckCardType, ExpansionsType, HeroCard, MyFnContextWithMyPlayerID, MyGameState, PlayerBoardCardType, PlayerBuffs, PlayerStack, PublicPlayer, PublicPlayers, SuitPropertyType, TavernWithoutExpansionArray } from "../../typescript/interfaces";
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
                } as PublicPlayer,
            },
            discardCardsDeck: [],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
            SuitNames.warrior, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
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
                    text: `Карта '${CardTypeRusNames.DwarfPlayerCard}' 'Test' убрана в сброс из-за эффекта карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Brisingamens}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
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
                } as PublicPlayer,
            },
            discardCampCardsDeck: [],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
            SuitNames.warrior, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as PublicPlayer,
            },
            discardCampCardsDeck: [
                {
                    type: CardTypeRusNames.ArtefactPlayerCard,
                    name: ArtefactNames.Vegvisir,
                    description: ArtefactDescriptionNames.Vegvisir,
                },
            ] as DiscardCampCardType[],
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
                } as PublicPlayer,
            },
            discardCampCardsDeck: [],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCampCardsDeck` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
            SuitNames.warrior, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
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
                    text: `Карта '${CardTypeRusNames.MercenaryPlayerCard}' 'Test' убрана в сброс из-за эффекта карты '${CardTypeRusNames.ArtefactCard}' '${ArtefactNames.Brisingamens}'.`,
                },
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' потерял баф '${CampBuffNames.DiscardCardEndGame}'.`,
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
                                type: CardTypeRusNames.HeroPlayerCard,
                            },
                        ],
                    },
                } as PublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
                SuitNames.warrior, 0);
        }).toThrowError(`Сброшенная карта не может быть с типом '${CardTypeRusNames.HeroPlayerCard}'.`);
    });
    it(`shouldn't remove non-exists player's card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    },
                } as PublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardAnyCardFromPlayerBoardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
                SuitNames.warrior, 0);
        }).toThrowError(`В массиве карт игрока с id '0' отсутствует выбранная карта во фракции '${SuitRusNames.warrior}' с id '0': это должно проверяться в MoveValidator.`);
    });
});

describe(`Test DiscardCardFromTavernAction method`, (): void => {
    it(`should remove non-null card from tavern`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [
                    {
                        type: CardTypeRusNames.DwarfCard,
                        name: `Test`,
                        playerSuit: SuitNames.warrior,
                    },
                    null,
                    null,
                ] as TavernWithoutExpansionArray,
                [null, null, null],
                [null, null, null],
            ],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`
            | `tavernCardDiscarded2Players`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ],
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ] as DiscardDeckCardType[],
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`>);
    });
    it(`should remove non-null card from tavern for 2 players game`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [
                    {
                        type: CardTypeRusNames.DwarfCard,
                        name: `Test`,
                        playerSuit: SuitNames.warrior,
                    },
                    null,
                    null,
                ] as TavernWithoutExpansionArray,
                [null, null, null],
                [null, null, null],
            ],
            discardCardsDeck: [],
            tavernCardDiscarded2Players: false,
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`
            | `tavernCardDiscarded2Players`>,
            ctx = {
                numPlayers: 2,
                currentPlayer: `0`,
            } as Ctx;
        DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ],
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ] as DiscardDeckCardType[],
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `taverns` | `currentTavern`>);
    });
    it(`shouldn't remove null card from tavern and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `taverns` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        }).toThrowError(`В массиве карт текущей таверны с id '0' не может не быть карты с id '0'.`);
    });
    it(`shouldn't remove non-exists card from tavern and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            currentTavern: 0,
            taverns: [
                [null, null, null],
                [null, null, null],
                [null, null, null],
            ],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `currentTavern` | `taverns` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            DiscardCardFromTavernAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        }).toThrowError(`В массиве карт текущей таверны с id '0' отсутствует карта с id '0'.`);
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
                            type: CardTypeRusNames.MercenaryCard,
                            name: `Test`,
                            variants: {},
                        },
                    ],
                    stack: [
                        {},
                    ],
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        GetEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
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
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' во время фазы '${PhaseNames.EnlistmentMercenaries}' выбрал наёмника 'Test'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
    });
    it(`shouldn't remove non-exists player's camp card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [] as CampDeckCardType[],
                } as PublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        expect((): void => {
            GetEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        }).toThrowError(`В массиве карт лагеря игрока с id '0' отсутствует выбранная карта с id '0': это должно проверяться в MoveValidator.`);
    });
    it(`shouldn't remove null card from tavern and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    campCards: [
                        {},
                    ],
                } as PublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        expect((): void => {
            GetEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        }).toThrowError(`Выбранная карта должна быть с типом '${CardTypeRusNames.MercenaryCard}'.`);
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
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        GetMjollnirProfitAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, SuitNames.hunter);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    buffs: [
                        {
                            suitIdForMjollnir: SuitNames.hunter,
                        },
                    ],
                } as PublicPlayer,
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
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test PassEnlistmentMercenariesAction method`, (): void => {
    it(`should first player pass on the beginning of 'enlistmentMercenaries' phase`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        PassEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                } as PublicPlayer,
            },
            logData: [
                {
                    type: LogTypeNames.Game,
                    text: `Игрок 'Dan' пасанул во время фазы '${PhaseNames.EnlistmentMercenaries}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `logData`>);
    });
});

describe(`Test PickDiscardCardAction method`, (): void => {
    it(`should pick dwarf discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    } as SuitPropertyType<PlayerBoardCardType[]>,
                    buffs: [] as PlayerBuffs[],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    name: `Test`,
                    playerSuit: SuitNames.warrior,
                },
            ] as DiscardDeckCardType[],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
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
                    buffs: [] as PlayerBuffs[],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>);
    });
    it(`should pick dwarf player discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
                    cards: {
                        warrior: [] as PlayerBoardCardType[],
                    } as SuitPropertyType<PlayerBoardCardType[]>,
                    buffs: [] as PlayerBuffs[],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfPlayerCard,
                    name: `Test`,
                    suit: SuitNames.warrior,
                },
            ] as DiscardDeckCardType[],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    heroes: [] as HeroCard[],
                    cards: {
                        warrior: [
                            {
                                type: CardTypeRusNames.DwarfPlayerCard,
                                name: `Test`,
                                suit: SuitNames.warrior,
                            },
                        ],
                    },
                    buffs: [] as PlayerBuffs[],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>);
    });
    it(`should pick action discarded card from discard deck`, (): void => {
        const G = {
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    stack: [
                        {},
                    ],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
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
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>);
    });
    it(`should move thrud`, (): void => {
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
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
            discardCardsDeck: [
                {
                    type: CardTypeRusNames.DwarfCard,
                    playerSuit: SuitNames.hunter,
                    name: `Test`,
                },
            ] as DiscardDeckCardType[],
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        PickDiscardCardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
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
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
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
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck` | `logData` | `expansions`>);
    });
    it(`shouldn't remove non-exists discard card and must throw Error`, (): void => {
        const G = {
            publicPlayers: {
                0: {} as PublicPlayer,
            },
            discardCardsDeck: [],
        } as Pick<MyGameState, `publicPlayers` | `discardCardsDeck`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            PickDiscardCardAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID, 0);
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
                    heroes: [] as HeroCard[],
                    cards: {
                        blacksmith: [] as PlayerBoardCardType[],
                        miner: [] as PlayerBoardCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `expansions` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
            SuitNames.blacksmith);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [] as CampDeckCardType[],
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
                    heroes: [] as HeroCard[],
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
                        miner: [] as PlayerBoardCardType[],
                    },
                    buffs: [] as PlayerBuffs[],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
            logData: [
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.MercenaryPlayerCard}' 'Test' во фракцию '${suitsConfig[SuitNames.blacksmith].suitName}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `expansions` | `logData`>);
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
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
            logData: [],
        } as Pick<MyGameState, `publicPlayers` | `expansions` | `logData`>,
            ctx = {
                currentPlayer: `0`,
                phase: PhaseNames.EnlistmentMercenaries,
            } as Ctx;
        PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
            SuitNames.warrior);
        expect(G).toStrictEqual({
            publicPlayers: {
                0: {
                    nickname: `Dan`,
                    campCards: [] as CampDeckCardType[],
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
                        } as PlayerStack,
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
                        ] as PlayerBoardCardType[],
                    },
                    buffs: [
                        {
                            moveThrud: SuitNames.warrior,
                        },
                    ],
                } as PublicPlayer,
            },
            expansions: {
                Idavoll: {
                    active: false,
                },
            } as ExpansionsType,
            logData: [
                {
                    type: LogTypeNames.Public,
                    text: `Игрок 'Dan' выбрал карту '${CardTypeRusNames.MercenaryPlayerCard}' 'Test' во фракцию '${suitsConfig[SuitNames.warrior].suitName}'.`,
                },
            ],
        } as Pick<MyGameState, `publicPlayers` | `expansions` | `logData`>);
    });
    it(`shouldn't get non-mercenary card to place and must throw Error`, ():
        void => {
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
                } as PublicPlayer,
            } as PublicPlayers,
        } as MyGameState,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
                SuitNames.blacksmith);
        }).toThrowError(`Выбранная карта должна быть с типом '${CardTypeRusNames.MercenaryCard}'.`);
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
                            },
                        ],
                        cards: {
                            explorer: [] as PlayerBoardCardType[],
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
                    } as PublicPlayer,
                },
                logData: [],
            } as Pick<MyGameState, `publicPlayers` | `logData`>,
                ctx = {
                    currentPlayer: `0`,
                } as Ctx;
            expect((): void => {
                PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
                    SuitNames.warrior);
            }).toThrowError(`У игрока с id '0' в массиве карт лагеря отсутствует выбранная карта.`);
        });
    it(`shouldn't use non-existing suit in picked mercenary card and must throw Error`, (): void => {
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
                } as PublicPlayer,
            },
        } as Pick<MyGameState, `publicPlayers`>,
            ctx = {
                currentPlayer: `0`,
            } as Ctx;
        expect((): void => {
            PlaceEnlistmentMercenariesAction({ G, ctx, myPlayerID: `0` } as MyFnContextWithMyPlayerID,
                SuitNames.hunter);
        }).toThrowError(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${SuitNames.hunter}'.`);
    });
});
