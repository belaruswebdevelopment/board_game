import type { Ctx } from "boardgame.io";
import { BuildCoins } from "./Coin";
import { initialPlayerCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { BuffNames, Phases } from "./typescript/enums";
import type { ICreatePublicPlayer, IMyGameState, IPlayer, IPriority, IPublicPlayer, OptionalSuitPropertyTypes, PlayerCardsType, RequiredSuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

/**
 * <h3>Создаёт всех игроков (приватные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @returns Приватные данные игрока.
 */
export const BuildPlayer = (): IPlayer => CreatePlayer({
    handCoins: BuildCoins(initialPlayerCoinsConfig, {
        isInitial: true,
        isTriggerTrading: false,
    }),
    boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
});

/**
 * <h3>Создаёт всех игроков (публичные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param nickname Никнейм.
 * @param priority Кристалл.
 * @returns Публичные данные игрока.
 */
export const BuildPublicPlayer = (nickname: string, priority: IPriority): IPublicPlayer => {
    const cards: OptionalSuitPropertyTypes<PlayerCardsType[]> = {};
    let suit: SuitTypes;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            cards[suit] = [];
        }
    }
    return CreatePublicPlayer({
        nickname,
        cards: cards as RequiredSuitPropertyTypes<PlayerCardsType[]>,
        handCoins: BuildCoins(initialPlayerCoinsConfig,
            { isInitial: true, isTriggerTrading: false }),
        boardCoins: Array(initialPlayerCoinsConfig.length).fill(null),
        priority,
    });
};

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
*/
export const CheckPlayersBasicOrder = (G: IMyGameState, ctx: Ctx): void => {
    G.publicPlayersOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: IPublicPlayer = G.publicPlayers[i];
        if (ctx.phase !== Phases.PlaceCoinsUline) {
            if (!CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                G.publicPlayersOrder.push(String(i));
            }
        } else {
            if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                G.publicPlayersOrder.push(String(i));
            }
        }
    }
};

/**
 * <h3>Создание приватных данных игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @returns Приватные данные игрока.
 */
const CreatePlayer = ({
    handCoins,
    boardCoins,
}: IPlayer = {} as IPlayer): IPlayer => ({
    handCoins,
    boardCoins,
});

/**
 * <h3>Создание публичных данных игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех игроков при инициализации игры.</li>
 * </ol>
 *
 * @param actionsNum Количество действий.
 * @param nickname Никнейм.
 * @param cards Массив карт.
 * @param heroes Массив героев.
 * @param campCards Массив карт кэмпа.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param stack Стэк действий.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @param pickedCard Выбранная карта.
 * @returns Публичные данные игрока.
 */
const CreatePublicPlayer = ({
    actionsNum = 0,
    nickname,
    cards,
    heroes = [],
    campCards = [],
    handCoins,
    boardCoins,
    stack = [],
    priority,
    buffs = [],
    selectedCoin = null,
    pickedCard = null,
}: ICreatePublicPlayer = {} as ICreatePublicPlayer): IPublicPlayer => ({
    actionsNum,
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
