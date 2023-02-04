import { BuildInitialCoins } from "./Coin";
import { initialCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { AssertBoardCoins, AssertHandCoins, AssertPrivateBoardCoins } from "./is_helpers/AssertionTypeHelpers";
import { GameModeNames, HeroBuffNames, PhaseNames, SuitNames } from "./typescript/enums";
import type { CanBeNullType, CreatePublicPlayerType, FnContext, PlayerBoardCardType, Priority, PrivatePlayer, PublicPlayer, PublicPlayerCoinType, SuitPropertyType } from "./typescript/interfaces";

/**
 * <h3>Создаёт всех игроков (приватные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @returns Приватные данные игрока.
 */
export const BuildPlayer = (): PrivatePlayer => {
    const boardCoins: null[] = Array(initialCoinsConfig.length).fill(null);
    AssertPrivateBoardCoins(boardCoins);
    return CreatePlayer({
        handCoins: BuildInitialCoins(),
        boardCoins,
    });
};

/**
 * <h3>Создаёт всех игроков (публичные данные).</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param nickname Никнейм.
 * @param priority Кристалл.
 * @param isPrivate Должны ли монеты быть приватными.
 * @returns Публичные данные игрока.
 */
export const BuildPublicPlayer = (nickname: string, priority: Priority, isPrivate: boolean): PublicPlayer => {
    const cards: SuitPropertyType<PlayerBoardCardType[]> = {} as SuitPropertyType<PlayerBoardCardType[]>,
        giantTokenSuits: SuitPropertyType<CanBeNullType<boolean>> = {} as SuitPropertyType<CanBeNullType<boolean>>;
    let suit: SuitNames;
    for (suit in suitsConfig) {
        cards[suit] = [];
        giantTokenSuits[suit] = null;
    }
    let handCoins: PublicPlayerCoinType[] = [];
    if (isPrivate) {
        handCoins = Array(initialCoinsConfig.length).fill({});
    } else {
        handCoins = BuildInitialCoins();
    }
    AssertHandCoins(handCoins);
    const boardCoins: null[] = Array(initialCoinsConfig.length).fill(null);
    AssertBoardCoins(boardCoins);
    return CreatePublicPlayer({
        nickname,
        cards,
        giantTokenSuits,
        handCoins,
        boardCoins,
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
* @param context
* @returns
*/
export const CheckPlayersBasicOrder = ({ G, ctx, ...rest }: FnContext): void => {
    G.publicPlayersOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (ctx.phase !== PhaseNames.BidUline) {
            if (G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari
                || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                    && !CheckPlayerHasBuff({ G, ctx, myPlayerID: String(i), ...rest },
                        HeroBuffNames.EveryTurn))) {
                G.publicPlayersOrder.push(String(i));
            }
        } else {
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(i), ...rest },
                    HeroBuffNames.EveryTurn)) {
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
 * @param boardCoins Массив монет на столе.
 * @param handCoins Массив монет в руке.
 * @returns Приватные данные игрока.
 */
const CreatePlayer = ({
    boardCoins,
    handCoins,
}: PrivatePlayer): PrivatePlayer => ({
    boardCoins,
    handCoins,
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
 * @param giantTokenSuits Состояние токенов Гигантов.
 * @param heroes Массив героев.
 * @param campCards Массив карт лагеря.
 * @param mythologicalCreatureCards Массив карт мифических существ.
 * @param handCoins Массив монет в руке.
 * @param boardCoins Массив монет на столе.
 * @param stack Стек действий.
 * @param priority Кристалл.
 * @param buffs Бафы.
 * @param selectedCoin Выбранная монета.
 * @returns Публичные данные игрока.
 */
const CreatePublicPlayer = ({
    nickname,
    cards,
    giantTokenSuits,
    heroes = [],
    campCards = [],
    mythologicalCreatureCards = [],
    handCoins,
    boardCoins,
    stack = [],
    priority,
    buffs = [],
    selectedCoin = null,
}: CreatePublicPlayerType): PublicPlayer => ({
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
