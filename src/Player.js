import { BuildCoins } from "./Coin";
import { initialPlayerCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { BuffNames, Phases } from "./typescript/enums";
/**
 * <h3>Создаёт всех игроков (приватные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @returns Приватные данные игрока.
 */
export const BuildPlayer = () => CreatePlayer({
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
export const BuildPublicPlayer = (nickname, priority) => {
    const cards = {};
    let suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            cards[suit] = [];
        }
    }
    return CreatePublicPlayer({
        nickname,
        cards: cards,
        handCoins: BuildCoins(initialPlayerCoinsConfig, { isInitial: true, isTriggerTrading: false }),
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
export const CheckPlayersBasicOrder = (G, ctx) => {
    G.publicPlayersOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player !== undefined) {
            if (ctx.phase !== Phases.PlaceCoinsUline) {
                if (!CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                    G.publicPlayersOrder.push(String(i));
                }
            }
            else {
                if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
                    G.publicPlayersOrder.push(String(i));
                }
            }
        }
        else {
            throw new Error(`В массиве игроков отсутствует игрок ${i}.`);
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
const CreatePlayer = ({ handCoins, boardCoins, } = {}) => ({
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
const CreatePublicPlayer = ({ actionsNum = 0, nickname, cards, heroes = [], campCards = [], handCoins, boardCoins, stack = [], priority, buffs = [], selectedCoin = null, pickedCard = null, } = {}) => ({
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
//# sourceMappingURL=Player.js.map