import { CreateCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CreatePriority } from "../Priority";
import { CoinTypeNames, ErrorNames, GameModeNames, LogTypeNames, SpecialCardNames, SuitNames } from "../typescript/enums";
import { AddCardToPlayer } from "./CardHelpers";
import { DiscardTradingCoin, GetMaxCoinValue } from "./CoinHelpers";
import { CheckAndMoveThrudAction } from "./HeroActionHelpers";
import { AddActionsToStack } from "./StackHelpers";
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
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const BlacksmithDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        const card = G.specialCardsDeck.find((card) => card.name === SpecialCardNames.ChiefBlacksmith);
        if (card === undefined) {
            throw new Error(`В игре отсутствует обязательная карта '${SpecialCardNames.ChiefBlacksmith}'.`);
        }
        AddCardToPlayer(G, ctx, card);
        G.distinctions[SuitNames.blacksmith] = undefined;
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия кузнецов карту '${card.type}' '${SpecialCardNames.ChiefBlacksmith}' во фракцию '${SuitNames.blacksmith}'.`);
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
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const ExplorerDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
            AddActionsToStack(G, ctx, [StackData.pickDistinctionCardSoloBot()]);
        }
        else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            AddActionsToStack(G, ctx, [StackData.pickDistinctionCardSoloBotAndvari()]);
        }
        else {
            AddActionsToStack(G, ctx, [StackData.pickDistinctionCard()]);
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
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const HunterDistinctionAwarding = (G, ctx, playerId) => {
    if (G.tierToEnd !== 0) {
        const player = G.publicPlayers[playerId], privatePlayer = G.players[playerId];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
        }
        if (privatePlayer === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerId);
        }
        const [type, tradingCoinIndex] = DiscardTradingCoin(G, ctx, playerId), coin = CreateCoin({
            isOpened: true,
            isTriggerTrading: true,
            value: 3,
        });
        let _exhaustiveCheck;
        switch (type) {
            case CoinTypeNames.Hand:
                if (G.mode === GameModeNames.Multiplayer) {
                    privatePlayer.handCoins[tradingCoinIndex] = coin;
                }
                player.handCoins[tradingCoinIndex] = coin;
                break;
            case CoinTypeNames.Board:
                if (G.mode === GameModeNames.Multiplayer) {
                    privatePlayer.boardCoins[tradingCoinIndex] = coin;
                }
                player.boardCoins[tradingCoinIndex] = coin;
                break;
            default:
                _exhaustiveCheck = type;
                throw new Error(`Не существует такого типа монеты.`);
                return _exhaustiveCheck;
        }
        G.distinctions[SuitNames.hunter] = undefined;
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
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const MinerDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        const currentPriorityValue = player.priority.value;
        player.priority = CreatePriority({
            value: 6,
            isExchangeable: false,
        });
        G.distinctions[SuitNames.miner] = undefined;
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' обменял по знаку отличия горняков свой кристалл '${currentPriorityValue}' на особый кристалл '6'.`);
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
 * @returns Количество очков по преимуществу по конкретной фракции.
 */
export const WarriorDistinctionAwarding = (G, ctx, playerId) => {
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    if (G.tierToEnd !== 0) {
        if (G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`) {
            AddActionsToStack(G, ctx, [StackData.upgradeCoinWarriorDistinctionSoloBot()]);
        }
        else if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            AddActionsToStack(G, ctx, [StackData.upgradeCoinWarriorDistinctionSoloBotAndvari()]);
        }
        else {
            AddActionsToStack(G, ctx, [StackData.upgradeCoinWarriorDistinction()]);
        }
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' получил по знаку отличия воинов возможность улучшить одну из своих монет на '+5':`);
    }
    else {
        return GetMaxCoinValue(player);
    }
    return 0;
};
/**
 * <h3>Завершение получения преимущества по фракции воинов или разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце 1-й эпохи, когда получается преимущество по фракции воинов или разведчиков.</li>
 * <li>В конце игры, когда получается преимущество по фракции воинов или разведчиков.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const EndWarriorOrExplorerDistinctionIfCoinUpgraded = (G) => {
    // todo Move to distinction phase hook?
    if (Object.values(G.distinctions).length) {
        // TODO Rework in suit name distinctions and delete not by if but by current distinction suit
        const isDistinctionWarrior = G.distinctions[SuitNames.warrior] !== undefined;
        if (isDistinctionWarrior) {
            G.distinctions[SuitNames.warrior] = undefined;
        }
        else if (!isDistinctionWarrior && G.distinctions[SuitNames.explorer] !== undefined) {
            G.distinctions[SuitNames.explorer] = undefined;
        }
    }
};
//# sourceMappingURL=DistinctionAwardingHelpers.js.map