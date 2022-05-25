import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { CardNames, CoinTypeNames, LogTypes, SuitNames } from "../typescript/enums";
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
export const BlacksmithDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        const card = G.additionalCardsDeck.find((card) => card.name === CardNames.ChiefBlacksmith);
        if (card === undefined) {
            throw new Error(`В игре отсутствует обязательная карта '${CardNames.ChiefBlacksmith}'.`);
        }
        player.pickedCard = card;
        player.cards[SuitNames.BLACKSMITH].push(card);
        G.distinctions[SuitNames.BLACKSMITH] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' получил по знаку отличия кузнецов карту '${CardNames.ChiefBlacksmith}'.`);
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
export const ExplorerDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDistinctionCard()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
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
export const HunterDistinctionAwarding = (G, ctx, playerId) => {
    if (G.tierToEnd !== 0) {
        const player = G.publicPlayers[playerId], privatePlayer = G.players[playerId];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
        }
        if (privatePlayer === undefined) {
            throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${playerId}'.`);
        }
        const [type, tradingCoinIndex] = DiscardTradingCoin(G, playerId), coin = CreateCoin({
            isOpened: true,
            isTriggerTrading: true,
            value: 3,
        });
        if (type === CoinTypeNames.Board) {
            if (G.multiplayer) {
                privatePlayer.boardCoins[tradingCoinIndex] = coin;
            }
            player.boardCoins[tradingCoinIndex] = coin;
        }
        else if (type === CoinTypeNames.Hand) {
            if (G.multiplayer) {
                privatePlayer.handCoins[tradingCoinIndex] = coin;
            }
            player.handCoins[tradingCoinIndex] = coin;
        }
        else {
            throw new Error(`Не существует типа монеты - '${type}'.`);
        }
        G.distinctions[SuitNames.HUNTER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' обменял по знаку отличия охотников свою монету с номиналом '0' на особую монету с номиналом '3'.`);
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
export const MinerDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        const currentPriorityValue = player.priority.value;
        player.priority = CreatePriority({
            value: 6,
            isExchangeable: false,
        });
        G.distinctions[SuitNames.MINER] = undefined;
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' обменял по знаку отличия горняков свой кристалл '${currentPriorityValue}' на особый кристалл '6'.`);
    }
    else {
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
export const WarriorDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    if (G.tierToEnd !== 0) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.upgradeCoinWarriorDistinction()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' получил по знаку отличия воинов возможность улучшить одну из своих монет на '+5':`);
    }
    else {
        return GetMaxCoinValue(G, playerId);
    }
    return 0;
};
//# sourceMappingURL=DistinctionAwardingHelpers.js.map