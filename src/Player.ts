import { BuildInitialCoins } from "./Coin";
import { initialCoinsConfig } from "./data/CoinData";
import { suitsConfig } from "./data/SuitData";
import { AssertBoardCoins, AssertHandCoins, AssertPrivateBoardCoins } from "./is_helpers/AssertionTypeHelpers";
import { SuitNames } from "./typescript/enums";
import type { CanBeNullType, CreatePublicPlayerFromData, PlayerBoardCardType, Priority, PrivatePlayer, PublicPlayer, PublicPlayerCoinType, SuitPropertyType } from "./typescript/interfaces";

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
    return CreatePrivatePlayer({
        boardCoins,
        handCoins: BuildInitialCoins(),
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
        boardCoins,
        cards,
        giantTokenSuits,
        handCoins,
        nickname,
        priority,
    });
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
export const CreatePrivatePlayer = ({
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
 * @param boardCoins Массив монет на столе.
 * @param buffs Бафы.
 * @param campCards Массив карт лагеря.
 * @param cards Массив карт.
 * @param currentCoinsScore Текущий счёт монет.
 * @param currentMaxCoinValue Текущее значение максимальной монеты.
 * @param giantTokenSuits Состояние токенов Гигантов.
 * @param handCoins Массив монет в руке.
 * @param heroes Массив героев.
 * @param mythologicalCreatureCards Массив карт мифических существ.
 * @param nickname Никнейм.
 * @param priority Кристалл.
 * @param selectedCoin Выбранная монета.
 * @param stack Стек действий.
 * @returns Публичные данные игрока.
 */
export const CreatePublicPlayer = ({
    boardCoins,
    buffs = [],
    campCards = [],
    cards,
    currentCoinsScore = 14,
    currentMaxCoinValue = 5,
    giantTokenSuits,
    handCoins,
    heroes = [],
    mythologicalCreatureCards = [],
    nickname,
    priority,
    selectedCoin = null,
    stack = [],
}: CreatePublicPlayerFromData): PublicPlayer => ({
    boardCoins,
    buffs,
    campCards,
    cards,
    currentCoinsScore,
    currentMaxCoinValue,
    giantTokenSuits,
    handCoins,
    heroes,
    mythologicalCreatureCards,
    nickname,
    priority,
    selectedCoin,
    stack,
});
