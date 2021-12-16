import {AddCardToCards, IPublicPlayer, IStack, PlayerCardsType} from "./Player";
import {ISuit, ISuitConfig, suitsConfig} from "./data/SuitData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog, LogTypes} from "./Logging";
import {tavernsConfig} from "./Tavern";
import {DeckCardTypes, MyGameState, TavernCardTypes} from "./GameSetup";
import {Ctx} from "boardgame.io";
import {IActionCardConfig} from "./data/ActionCardData";

// todo add LogTypes.ERROR logging to Sasha's functions

/**
 * <h3>Интерфейс для карты дворфа.</h3>
 */
export interface ICard {
    type: string,
    suit: string,
    rank: number,
    points: null | number,
    name: string,
    game: string,
    tier: number,
    path: string,
}

/**
 * <h3>Интерфейс для создания карты дворфа.</h3>
 */
export interface ICreateCard {
    type?: string,
    suit: string,
    rank: number,
    points: null | number,
    name?: string,
    game?: string,
    tier?: number,
    path?: string,
}

/**
 * <h3>Интерфейс для карты улучшения монеты.</h3>
 */
export interface IActionCard {
    type: string,
    value: number,
    stack: IStack[],
    name: string,
}

/**
 * <h3>Интерфейс для создания карты улучшения монеты.</h3>
 */
interface ICreateActionCard {
    type?: string,
    value: number,
    stack: IStack[],
    name: string,
}

/**
 * <h3>Интерфейс для создания "средней" карты фракции.</h3>
 */
interface ICreateAverageSuitCard {
    suit: string,
    rank: number,
    points: number,
}

/**
 * <h3>Интерфейс "средней" карты фракции.</h3>
 */
export interface IAverageSuitCardData {
    players: number,
    tier: number,
}

/**
 * <h3>Интерфейс для конфига дек.</h3>
 */
export interface IDeckConfig {
    suits: ISuitConfig,
    actions: IActionCardConfig[],
}

/**
 * <h3>Проверка, является ли объект картой дворфа или картой обмена монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param {DeckCardTypes} card Карта.
 * @returns {card is ICard} Является ли объект картой дворфа, а не картой обмена монеты.
 */
export const isCardNotAction = (card: DeckCardTypes): card is ICard => (card as ICard).suit !== undefined;

/**
 * <h3>Создание карты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @param {string | undefined} type Тип.
 * @param {string} suit Фракция.
 * @param {number | null} rank Шевроны.
 * @param {number | null} points Очки.
 * @param {string | undefined} name Название.
 * @param {string | undefined} game Игра/дополнение.
 * @param {number | undefined} tier Эпоха.
 * @param {string | undefined} path URL путь.
 * @returns {ICard} Карта дворфа.
 * @constructor
 */
export const CreateCard = ({
                               type = "базовая",
                               suit,
                               rank,
                               points,
                               name = "",
                               game = "",
                               tier = 0,
                               path = "",
                           }: ICreateCard = {} as ICreateCard): ICard => ({
    type,
    suit,
    rank,
    points,
    name,
    game,
    tier,
    path,
});

/**
 * <h3>Создание карты улучшения монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт улучшения монеты во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param value Значение.
 * @param action Действие.
 * @param name Название.
 * @param {string | undefined} type Тип.
 * @param {number} value Значение.
 * @param {IStack[]} stack Действие.
 * @param {string} name Название.
 * @returns {IActionCard} Карта обмена монеты.
 * @constructor
 */
const CreateActionCard = ({
                              type = "улучшение монеты",
                              value,
                              stack,
                              name,
                          }: ICreateActionCard = {} as ICreateActionCard): IActionCard => ({
    type,
    value,
    stack,
    name,
});

/**
 * <h3>Создаёт все карты и карты улучшения монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @param {IDeckConfig} deckConfig Конфиг карт.
 * @param {IAverageSuitCardData} data Данные для создания карт.
 * @returns {DeckCardTypes[]} Все карты дворфов и обмена монет.
 * @constructor
 */
export const BuildCards = (deckConfig: IDeckConfig, data: IAverageSuitCardData): DeckCardTypes[] => {
    const cards: DeckCardTypes[] = [];
    for (const suit in suitsConfig) {
        const points: number | number[] = deckConfig.suits[suit].pointsValues()[data.players][data.tier];
        let count: number = 0;
        if (Array.isArray(points)) {
            count = points.length;
        } else {
            count = points;
        }
        for (let j: number = 0; j < count; j++) {
            const rank: number | number[] = deckConfig.suits[suit].ranksValues()[data.players][data.tier];
            cards.push(CreateCard({
                suit: deckConfig.suits[suit].suit,
                rank: Array.isArray(rank) ? rank[j] : 1,
                points: Array.isArray(points) ? points[j] : null,
                name: `(фракция: ${suitsConfig[deckConfig.suits[suit].suit].suitName}, шевронов: 
                ${Array.isArray(rank) ? rank[j] : 1}, очков: ${Array.isArray(points) ? points[j] + ")" : "нет)"}`,
            } as ICreateCard));
        }
    }
    for (let i: number = 0; i < deckConfig.actions.length; i++) {
        for (let j: number = 0; j < deckConfig.actions[i].amount()[data.players][data.tier]; j++) {
            cards.push(CreateActionCard({
                value: deckConfig.actions[i].value,
                stack: deckConfig.actions[i].stack,
                name: `улучшение монеты на +${deckConfig.actions[i].value}`,
            } as ICreateActionCard));
        }
    }
    return cards;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {ISuit} suitConfig Конфиг карт дворфов.
 * @param {IAverageSuitCardData} data
 * @returns {ICard} "Средняя" карта дворфа.
 * @constructor
 */
export const GetAverageSuitCard = (suitConfig: ISuit, data: IAverageSuitCardData): ICard => {
    const avgCard: ICard = CreateCard({
            suit: suitConfig.suit,
            rank: 0,
            points: 0
        } as ICreateAverageSuitCard),
        rank: number | number[] = suitConfig.ranksValues()[data.players][data.tier],
        points: number | number[] = suitConfig.pointsValues()[data.players][data.tier];
    let count: number = Array.isArray(points) ? points.length : points;
    if (avgCard.points !== null) {
        for (let i: number = 0; i < count; i++) {
            avgCard.rank += Array.isArray(rank) ? rank[i] : 1;
            avgCard.points += Array.isArray(points) ? points[i] : 1;
        }
        avgCard.rank /= count;
        avgCard.points /= count;
    }
    return avgCard;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {TavernCardTypes} card1 Первая карта.
 * @param {TavernCardTypes} card2 Вторая карта.
 * @returns {number} Сравнительное значение.
 * @constructor
 */
export const CompareCards = (card1: TavernCardTypes, card2: TavernCardTypes): number => {
    if (card1 === null || card2 === null) {
        return 0;
    }
    if (isCardNotAction(card1) && isCardNotAction(card2)) {
        if (card1.suit === card2.suit) {
            const result: number = (card1.points !== undefined && card1.points !== null ?
                card1.points : 1) - (card2.points !== undefined && card2.points !== null ? card2.points : 1);
            if (result === 0) {
                return result;
            }
            return result > 0 ? 1 : -1;
        }
    }
    return 0;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {number} Профит карты.
 * @constructor
 */
/*export const CardProfitForPlayer = (G: MyGameState, ctx: Ctx): number => {
    if (IsTopPlayer(G, Number(ctx.currentPlayer))) {
        let top2PlayerId: number = GetTop2PlayerId(G, Number(ctx.currentPlayer));
        if (top2PlayerId === -1) {
            return 0;
        }
        return 0;
    }
    let top1PlayerId: number = GetTop1PlayerId(G, Number(ctx.currentPlayer));
    if (top1PlayerId === -1) {
        return 0;
    }
    return 0;
};*/

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {IPublicPlayer} player Игрок.
 * @param {PlayerCardsType | IActionCard} card Карта.
 * @returns {number} Потенциальное значение.
 * @constructor
 */
export const PotentialScoring = ({
                                     player = {} as IPublicPlayer,
                                     card = {} as TavernCardTypes,
                                 }): number => {
    let score: number = 0,
        potentialCards: PlayerCardsType[][] = [];
    for (let i: number = 0; i < player.cards.length; i++) {
        potentialCards[i] = [];
        for (let j: number = 0; j < player.cards[i].length; j++) {
            AddCardToCards(potentialCards, player.cards[i][j]);
        }
    }
    if (card !== null && "suit" in card) {
        AddCardToCards(potentialCards, CreateCard(card));
    }
    let i: number = 0;
    for (const suit in suitsConfig) {
        score += suitsConfig[suit].scoringRule(potentialCards[i]);
        i++;
    }
    if (card !== null && "value" in card) {
        score += card.value;
    }
    for (let i: number = 0; i < player.boardCoins.length; i++) {
        score += player.boardCoins[i]?.value ?? 0;
        score += player.handCoins[i]?.value ?? 0;
    }
    return score;
};

/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {ICard} compareCard Карта для сравнения.
 * @param {number} cardId Id карты.
 * @param {TavernCardTypes[]} tavern Таверна.
 * @returns {number} Сравнительное значение.
 * @constructor
 */
export const EvaluateCard = (G: MyGameState, ctx: Ctx, compareCard: TavernCardTypes, cardId: number,
                             tavern: TavernCardTypes[]): number => {
    // todo check it and fix -1
    let suitId: number = -1;
    if (compareCard !== null && "suit" in compareCard) {
        suitId = GetSuitIndexByName(compareCard.suit);
        if (G.decks[0].length >= G.botData.deckLength - G.tavernsNum * G.drawSize) {
            return CompareCards(compareCard, G.averageCards[suitId]);
        }
    }
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        let temp: number[][] = tavern.map((card: TavernCardTypes): number[] =>
                G.publicPlayers.map((player: IPublicPlayer): number =>
                    PotentialScoring({player, card: card!}))),
            result: number = temp[cardId][Number(ctx.currentPlayer)];
        temp.splice(cardId, 1);
        temp.forEach((player: number[]): number[] => player.splice(Number(ctx.currentPlayer), 1));
        return result - Math.max(...temp.map((player: number[]): number => Math.max(...player)));
    }
    return CompareCards(compareCard, G.averageCards[suitId]);
};
/**
 * <h3>Убирает карту из таверны в стопку сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игре на 2-х игроков убирает не выбранную карту.</li>
 * <li>Убирает оставшуюся карту при выборе карты из кэмпа.</li>
 * <li>Игрок убирает одну карту при игре на двух игроков, если выбирает карту из кэмпа.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {number} discardCardIndex Индекс сбрасываемой карты в таверне.
 * @returns {boolean} Сброшена ли карта из таверны.
 * @constructor
 */
export const DiscardCardFromTavern = (G: MyGameState, discardCardIndex: number): boolean => {
    const discardedCard: TavernCardTypes = G.taverns[G.currentTavern][discardCardIndex];
    if (discardedCard !== null) {
        G.discardCardsDeck.push(discardedCard);
        G.taverns[G.currentTavern][discardCardIndex] = null;
        AddDataToLog(G, LogTypes.GAME, `Карта ${discardedCard.name} из таверны 
        ${tavernsConfig[G.currentTavern].name} убрана в сброс.`);
        const additionalDiscardCardIndex: number =
            G.taverns[G.currentTavern].findIndex((card: TavernCardTypes): boolean => card !== null);
        if (additionalDiscardCardIndex !== -1) {
            AddDataToLog(G, LogTypes.GAME, `Дополнительная карта из таверны 
            ${tavernsConfig[G.currentTavern].name} должна быть убрана в сброс из-за пика артефакта Jarnglofi.`);
            DiscardCardFromTavern(G, additionalDiscardCardIndex);
        }
        return true;
    }
    AddDataToLog(G, LogTypes.ERROR, "ОШИБКА: Не удалось сбросить лишнюю карту из таверны.");
    return false;
};
