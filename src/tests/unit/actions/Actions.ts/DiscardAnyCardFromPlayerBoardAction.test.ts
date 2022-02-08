import { Ctx } from "boardgame.io";
import { DiscardAnyCardFromPlayerBoardAction } from "../../../../actions/Actions";
import { LogTypes, RusCardTypes } from "../../../../typescript/enums";
import { IMyGameState } from "../../../../typescript/game_data_interfaces";

describe(`Test DiscardAnyCardFromPlayerBoardAction method`, () => {
    let G: Pick<Partial<IMyGameState>, `publicPlayers` | `discardCardsDeck` | `logData`>;
    beforeEach(() => {
        G = {
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [],
                    campCards: [],
                    handCoins: [],
                    heroes: [],
                    pickedCard: null,
                    priority: {
                        isExchangeable: true,
                        value: 5
                    },
                    selectedCoin: undefined,
                    stack: [],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 10,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.HERO,
                                suit: `warrior`,
                                rank: 1,
                                points: 8,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                        ]
                    },
                    buffs: {
                        discardCardEndGame: true,
                    },
                },
                {
                    nickname: `Dan`,
                    boardCoins: [],
                    campCards: [],
                    handCoins: [],
                    heroes: [],
                    pickedCard: null,
                    priority: {
                        isExchangeable: true,
                        value: 5
                    },
                    selectedCoin: undefined,
                    stack: [],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 10,
                                name: `Test`,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.HERO,
                                suit: `warrior`,
                                rank: 1,
                                points: 8,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                        ]
                    },
                    buffs: {
                        discardCardEndGame: true,
                    },
                },
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: `warrior`,
                    rank: 1,
                    points: 9,
                    name: ``,
                    game: `basic`,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: ``,
                },
            ],
        };
    });
    it(`should remove non-hero discarded card from player's cards`, () => {
        DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, { currentPlayer: '1' } as Ctx, `warrior`, 1);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [],
                    campCards: [],
                    handCoins: [],
                    heroes: [],
                    pickedCard: null,
                    priority: {
                        isExchangeable: true,
                        value: 5
                    },
                    selectedCoin: undefined,
                    stack: [],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 10,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.HERO,
                                suit: `warrior`,
                                rank: 1,
                                points: 8,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                        ]
                    },
                    buffs: {
                        discardCardEndGame: true,
                    },
                },
                {
                    nickname: `Dan`,
                    boardCoins: [],
                    campCards: [],
                    handCoins: [],
                    heroes: [],
                    pickedCard: null,
                    priority: {
                        isExchangeable: true,
                        value: 5
                    },
                    selectedCoin: undefined,
                    stack: [],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.HERO,
                                suit: `warrior`,
                                rank: 1,
                                points: 8,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                        ]
                    },
                    buffs: {},
                },
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: `warrior`,
                    rank: 1,
                    points: 9,
                    name: ``,
                    game: `basic`,
                    tier: 0,
                    path: ``,
                },
                {
                    type: RusCardTypes.BASIC,
                    suit: `warrior`,
                    rank: 1,
                    points: 10,
                    name: `Test`,
                    game: `basic`,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: ``,
                },
                {
                    type: LogTypes.GAME,
                    value: `Игрок Dan сбросил карту Test в колоду сброса.`,
                },
                {
                    type: LogTypes.GAME,
                    value: "Игрок Dan потерял баф 'discardCardEndGame'.",
                },
            ],
        });
    });
    it(`shouldn't remove hero discarded card from player's cards`, () => {
        DiscardAnyCardFromPlayerBoardAction(G as IMyGameState, { currentPlayer: '1' } as Ctx, `warrior`, 2);
        expect(G).toEqual({
            publicPlayers: [
                {
                    nickname: `Dan`,
                    boardCoins: [],
                    campCards: [],
                    handCoins: [],
                    heroes: [],
                    pickedCard: null,
                    priority: {
                        isExchangeable: true,
                        value: 5
                    },
                    selectedCoin: undefined,
                    stack: [],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 10,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.HERO,
                                suit: `warrior`,
                                rank: 1,
                                points: 8,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                        ]
                    },
                    buffs: {
                        discardCardEndGame: true,
                    },
                },
                {
                    nickname: `Dan`,
                    boardCoins: [],
                    campCards: [],
                    handCoins: [],
                    heroes: [],
                    pickedCard: null,
                    priority: {
                        isExchangeable: true,
                        value: 5
                    },
                    selectedCoin: undefined,
                    stack: [],
                    cards: {
                        warrior: [
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 12,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.BASIC,
                                suit: `warrior`,
                                rank: 1,
                                points: 10,
                                name: `Test`,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                            {
                                type: RusCardTypes.HERO,
                                suit: `warrior`,
                                rank: 1,
                                points: 8,
                                name: ``,
                                game: `basic`,
                                tier: 0,
                                path: ``,
                            },
                        ]
                    },
                    buffs: {
                        discardCardEndGame: true,
                    },
                },
            ],
            discardCardsDeck: [
                {
                    type: RusCardTypes.BASIC,
                    suit: `warrior`,
                    rank: 1,
                    points: 9,
                    name: ``,
                    game: `basic`,
                    tier: 0,
                    path: ``,
                },
            ],
            logData: [
                {
                    type: LogTypes.GAME,
                    value: ``,
                },
                {
                    type: LogTypes.ERROR,
                    value: `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`,
                },
            ],
        });
    });
});
