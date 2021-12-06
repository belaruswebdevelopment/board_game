import {BuildCoins, ICoin} from "./Coin";
import {initialPlayerCoinsConfig} from "./data/CoinData";
import {CurrentScoring} from "./Score";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog, LogTypes} from "./Logging";
import {suitsConfig} from "./data/SuitData";
import {CampDeckCardTypes, DeckCardTypes, MyGameState} from "./GameSetup";
import {Ctx} from "boardgame.io";
import {IPriority} from "./Priority";
import {ICard, isCardNotAction} from "./Card";
import {IHero} from "./Hero";
import {IArtefactCampCard} from "./Camp";
import {IBuff, IConditions, IVariants} from "./data/HeroData";

export type PlayerCardsType = ICard | IArtefactCampCard | IHero;

export interface IBuffs {
    // everyTurn?: string,
    // upgradeNextCoin?: string,
    // upgradeCoin?: number,
    // goCampOneTime?: boolean,
    // goCamp?: boolean,
    // noHero?: boolean,
    // getMjollnirProfit?: boolean,
    // discardCardEndGame?: boolean,
    [name: string]: string | number | boolean,
}

export interface IConfig {
    conditions?: IConditions,
    buff?: IBuff,
    number?: number,
    coinId?: number,
    suit?: string,
    coin?: string,
    value?: number,
    drawName?: string,
    stageName?: string,
    isTrading?: boolean,
    name?: string,
}

export interface IStack {
    actionName: string,
    variants?: IVariants,
    config?: IConfig,
    playerId?: number,
}

export interface IPlayer {
    handCoins: ICoin[],
    boardCoins: ICoin[],
}

export interface IPublicPlayer {
    nickname: string,
    cards: PlayerCardsType[][],
    heroes: IHero[],
    campCards: CampDeckCardTypes[],
    handCoins: (null | ICoin)[],
    boardCoins: (null | ICoin)[],
    stack: IStack[],
    priority: IPriority,
    buffs: IBuffs,
    selectedCoin: undefined | number,
    pickedCard: null | DeckCardTypes | CampDeckCardTypes | IHero,
}

interface ICreatePublicPlayer {
    nickname: string,
    cards: PlayerCardsType[][],
    heroes?: IHero[],
    campCards?: CampDeckCardTypes[],
    handCoins: ICoin[],
    boardCoins: ICoin[],
    stack?: IStack[],
    priority: IPriority,
    buffs?: IBuffs,
    selectedCoin?: undefined,
    pickedCard?: null,
}

/**
 * <h3>Создание игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @constructor
 */
const CreatePlayer = ({
                          handCoins,
                          boardCoins,
                      }: IPlayer = {} as IPlayer): IPlayer => ({
    handCoins,
    boardCoins,
});

/**
 *
 * <h3>Создание игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param nickname Никнейм.
 * @param cards Массив карт.
 * @param heroes Массив героев.
 * @param campCards Массив карт кэмпа.
 * @param nickname Никнейм.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param stack Стэк действий.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @param pickedCard Выбранная карта.
 * @constructor
 */
const CreatePublicPlayer = ({
                                nickname,
                                cards,
                                heroes = [],
                                campCards = [],
                                handCoins,
                                boardCoins,
                                stack = [],
                                priority,
                                buffs = {},
                                selectedCoin,
                                pickedCard = null,
                            }: ICreatePublicPlayer = {} as ICreatePublicPlayer): IPublicPlayer => ({
    nickname,
    cards,
    campCards,
    heroes,
    handCoins,
    boardCoins,
    stack,
    priority,
    buffs,
    selectedCoin,
    pickedCard,
});

/**
 * <h3>Создаёт всех игроков (приватные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @constructor
 */
export const BuildPlayer = (): IPlayer => CreatePlayer({
    handCoins: BuildCoins(initialPlayerCoinsConfig,
        {isInitial: true, isTriggerTrading: false}),
    boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
} as IPlayer);

/**
 * <h3>Создаёт всех игроков (публичные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param playersNum Количество игроков.
 * @param suitsNum Количество фракций.
 * @param nickname Никнейм.
 * @param priority Кристалл.
 * @constructor
 */
export const BuildPublicPlayer = (playersNum: number, suitsNum: number, nickname: string, priority: IPriority):
    IPublicPlayer =>
    CreatePublicPlayer({
        nickname,
        cards: Array(suitsNum).fill(Array(0)),
        handCoins: BuildCoins(initialPlayerCoinsConfig,
            {isInitial: true, isTriggerTrading: false}),
        boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
        priority,
    } as ICreatePublicPlayer);

/**
 * <h3>Проверяет базовый порядок хода игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при необходимости выставления монет на игровое поле.</li>
 * <li>Происходит при необходимости выставления монет на игровое поле при наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const CheckPlayersBasicOrder = (G: MyGameState, ctx: Ctx): void => {
    G.publicPlayersOrder = [];
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        if (G.publicPlayers[i].buffs.everyTurn === "Uline") {
            G.publicPlayersOrder.push(i);
        }
    }
};

/**
 * <h3>Добавляет взятую карту в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты из текущей таверны.</li>
 * <li>Происходит при взятии карты из карт преимущества по разведчикам в конце 1 эпохи.</li>
 * <li>Происходит при взятии карты из сброса при активации героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 * @constructor
 */
export const AddCardToPlayer = (G: MyGameState, ctx: Ctx, card: DeckCardTypes): boolean => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = card;
    if (isCardNotAction(card)) {
        const suitIndex: number = GetSuitIndexByName(card.suit);
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitIndex].push(card);
        AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
        выбрал карту '${card.name}'.`);
        return true;
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    выбрал карту '${card.name}'.`);
    return false;

};

/**
 * <h3>Добавляет взятую из кэмпа карту в массив карт кэмпа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при взятии карты кэмпа игроком.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
export const AddCampCardToPlayer = (G: MyGameState, ctx: Ctx, card: CampDeckCardTypes): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].campCards.push(card);
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    выбрал карту кэмпа ${card.name}.`);
};

/**
 * <h3>Добавляет карту кэмпа в конкретную фракцию игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении карты кэмпа в конкретную фракцию игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта кэмпа.
 * @constructor
 */
export const AddCampCardToPlayerCards = (G: MyGameState, ctx: Ctx, card: IArtefactCampCard): void => {
    const suitId: number = GetSuitIndexByName(card.suit);
    if (suitId !== -1) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].push(card);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
        выбрал карту кэмпа '${card.name}' во фракцию ${suitsConfig[card.suit].suitName}.`);
    }
};

/**
 * <h3>Добавляет героя в массив героев игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
export const AddHeroCardToPlayerHeroCards = (G: MyGameState, ctx: Ctx, hero: IHero): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = hero;
    hero.active = false;
    G.publicPlayers[Number(ctx.currentPlayer)].heroes.push(hero);
    AddDataToLog(G, LogTypes.PUBLIC, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
    выбрал героя ${hero.name}.`);
};

/**
 * <h3>Добавляет героя в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при добавлении героя на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param hero Герой.
 * @constructor
 */
export const AddHeroCardToPlayerCards = (G: MyGameState, ctx: Ctx, hero: IHero): void => {
    const suitId: number = GetSuitIndexByName(hero.suit);
    if (suitId !== -1) {
        G.publicPlayers[Number(ctx.currentPlayer)].cards[suitId].push(hero);
        AddDataToLog(G, LogTypes.PRIVATE, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} 
        добавил героя ${hero.name} во фракцию ${suitsConfig[hero.suit].suitName}.`);
    }
};

/**
 * <h3>Добавляет карту в массив потенциальных карт для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при подсчёте потенциального скоринга для ботов.</li>
 * </ol>
 *
 * @param cards Массив потенциальных карт для ботов.
 * @param card Карта.
 */
export const AddCardToCards = (cards: PlayerCardsType[][], card: PlayerCardsType): void => {
    const suitIndex: number = GetSuitIndexByName(card.suit);
    if (suitIndex) {
        cards[suitIndex].push(card);
    }
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param playerId
 * @constructor
 */
export const IsTopPlayer = (G: MyGameState, playerId: number): boolean => {
    const score: number = CurrentScoring(G.publicPlayers[playerId]);
    return G.publicPlayers.every((player: IPublicPlayer): boolean => CurrentScoring(player) <= score);
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров
 * @param G
 * @param currentPlayerId Id текущего игрока.
 * @constructor
 */
/*export const GetTop1PlayerId = (G: MyGameState, currentPlayerId: number): number => {
    let top1PlayerId: number = G.publicPlayers.findIndex((player: IPublicPlayer, index: number): boolean =>
        IsTopPlayer(G, index));
    if (G.publicPlayersOrder.indexOf(currentPlayerId) > G.publicPlayersOrder.indexOf(top1PlayerId)) {
        top1PlayerId = -1;
    }
    return top1PlayerId;
};*/

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: Добавить описание для функции и параметров.
 * @param G
 * @param top1PlayerId Id текущего игрока.
 * @constructor
 */
/*export const GetTop2PlayerId = (G: MyGameState, top1PlayerId: number): number => {
    const playersScore: number[] = G.publicPlayers.map((player: IPublicPlayer): number => CurrentScoring(player)),
        maxScore: number = Math.max(...playersScore);
    let top2PlayerId: number,
        temp: number;
    if (playersScore.filter(score => score === maxScore).length === 1) {
        temp = playersScore.sort((a, b) => b - a)[1];
        top2PlayerId = G.publicPlayers.findIndex(player => CurrentScoring(player) === temp);
    } else {
        top2PlayerId = G.publicPlayers.findIndex((player: IPublicPlayer, index: number): boolean => index !== top1PlayerId
            && IsTopPlayer(G, index));
    }
    if (G.publicPlayersOrder.indexOf(top1PlayerId) > G.publicPlayersOrder.indexOf(top2PlayerId)) {
        top2PlayerId = -1;
    }
    return top2PlayerId;
};*/
