import type { Ctx } from "boardgame.io";
import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { CardNames, CoinTypeNames, ErrorNames, LogTypeNames, SuitNames } from "../typescript/enums";
import type { CanBeUndef, ICoin, IMyGameState, IPlayer, IPublicPlayer, ISpecialCard } from "../typescript/interfaces";
import { DiscardTradingCoin, GetMaxCoinValue } from "./CoinHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

/**
 * <h3>Получение преимущества по фракции кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции кузнецов.</li>
 * <li>В конце игры, когда получается преимущество по фракции кузнецов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns
 */
export const BlacksmithDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        const card: CanBeUndef<ISpecialCard> = G.specialCardsDeck.find((card: ISpecialCard): boolean =>
            card.name === CardNames.ChiefBlacksmith);
        if (card === undefined) {
            throw new Error(`В игре отсутствует обязательная карта '${CardNames.ChiefBlacksmith}'.`);
        }
        player.pickedCard = card;
        player.cards[SuitNames.Blacksmith].push(card);
        G.distinctions[SuitNames.Blacksmith] = undefined;
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия кузнецов карту '${CardNames.ChiefBlacksmith}'.`);
        CheckAndMoveThrudAction(G, ctx, card);
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции разведчиков.</li>
 * <li>В конце игры, когда получается преимущество по фракции разведчиков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns
 */
export const ExplorerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        if (G.solo && ctx.currentPlayer === `1`) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDistinctionCardSoloBot()]);
        } else {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDistinctionCard()]);
        }
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции охотников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции охотников.</li>
 * <li>В конце игры, когда получается преимущество по фракции охотников.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns
 */
export const HunterDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    if (G.tierToEnd !== 0) {
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId],
            privatePlayer: CanBeUndef<IPlayer> = G.players[playerId];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
        }
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${playerId}'.`);
        }
        const [type, tradingCoinIndex]: [CoinTypeNames, number] = DiscardTradingCoin(G, playerId),
            coin: ICoin = CreateCoin({
                isOpened: true,
                isTriggerTrading: true,
                value: 3,
            });
        if (type === CoinTypeNames.Board) {
            if (G.multiplayer) {
                privatePlayer.boardCoins[tradingCoinIndex] = coin;
            }
            player.boardCoins[tradingCoinIndex] = coin;
        } else if (type === CoinTypeNames.Hand) {
            if (G.multiplayer) {
                privatePlayer.handCoins[tradingCoinIndex] = coin;
            }
            player.handCoins[tradingCoinIndex] = coin;
        } else {
            throw new Error(`Не существует типа монеты - '${type}'.`);
        }
        G.distinctions[SuitNames.Hunter] = undefined;
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' обменял по знаку отличия охотников свою монету с номиналом '0' на особую монету с номиналом '3'.`);
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции горняков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции горняков.</li>
 * <li>В конце игры, когда получается преимущество по фракции горняков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns
 */
export const MinerDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        const currentPriorityValue: number = player.priority.value;
        player.priority = CreatePriority({
            value: 6,
            isExchangeable: false,
        });
        G.distinctions[SuitNames.Miner] = undefined;
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' обменял по знаку отличия горняков свой кристалл '${currentPriorityValue}' на особый кристалл '6'.`);
    } else {
        if (player.priority.value === 6) {
            return 3;
        }
    }
    return 0;
};

/**
 * <h3>Получение преимущества по фракции воинов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции воинов.</li>
 * <li>В конце игры, когда получается преимущество по фракции воинов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id игрока.
 * @returns
 */
export const WarriorDistinctionAwarding = (G: IMyGameState, ctx: Ctx, playerId: number): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinWarriorDistinction()]);
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия воинов возможность улучшить одну из своих монет на '+5':`);
    } else {
        return GetMaxCoinValue(player);
    }
    return 0;
};
