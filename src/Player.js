import { BuildCoins } from "./Coin";
import { initialPlayerCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { BuffNames, ErrorNames, PhaseNames } from "./typescript/enums";
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
 * @param multiplayer Является ли игра мультиплеером.
 * @param soloBot Является ли игрок соло ботом.
 * @returns Публичные данные игрока.
 */
export const BuildPublicPlayer = (nickname, priority, multiplayer) => {
    const cards = {}, giantTokenSuits = {};
    let suit;
    for (suit in suitsConfig) {
        cards[suit] = [];
        giantTokenSuits[suit] = null;
    }
    let handCoins = [];
    if (multiplayer) {
        handCoins = Array(initialPlayerCoinsConfig.length).fill({});
    }
    else {
        handCoins = BuildCoins(initialPlayerCoinsConfig, {
            isInitial: true,
        });
    }
    return CreatePublicPlayer({
        nickname,
        cards,
        giantTokenSuits,
        handCoins,
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
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (ctx.phase !== PhaseNames.BidUline) {
            if (G.solo || (!G.solo && !CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
                G.publicPlayersOrder.push(String(i));
            }
        }
        else {
            if (!G.solo && CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
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
 * @param nickname Никнейм.
 * @param cards Массив карт.
 * @param heroes Массив героев.
 * @param campCards Массив карт лагеря.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param stack Стэк действий.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @returns Публичные данные игрока.
 */
const CreatePublicPlayer = ({ nickname, cards, giantTokenSuits, heroes = [], campCards = [], mythologicalCreatureCards = [], handCoins, boardCoins, stack = [], priority, buffs = [], selectedCoin = null, } = {}) => ({
    nickname,
    cards,
    giantTokenSuits,
    campCards,
    mythologicalCreatureCards,
    heroes,
    handCoins,
    boardCoins,
    stack,
    priority,
    buffs,
    selectedCoin,
});
//# sourceMappingURL=Player.js.map