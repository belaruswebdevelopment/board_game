import { UpgradeCoinAction } from "../actions/CoinActions";
import { ChangeIsOpenedCoinStatus, IsCoin } from "../Coin";
import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { CoinTypeNames, ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames } from "../typescript/enums";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff, DeleteBuffFromPlayer } from "./BuffHelpers";
import { AddActionsToStack } from "./StackHelpers";
/**
 * <h3>Активирует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается базовый выбор карты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const ActivateTrading = ({ G, ctx, playerID, ...rest }) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const boardCoinCurrentTavern = player.boardCoins[G.currentTavern];
    if (boardCoinCurrentTavern === undefined) {
        throw new Error(`В массиве монет игрока с id '${playerID}' отсутствует монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if ((boardCoinCurrentTavern !== null && !IsCoin(boardCoinCurrentTavern))
        || (IsCoin(boardCoinCurrentTavern) && !boardCoinCurrentTavern.isOpened)) {
        throw new Error(`В массиве монет игрока с id '${playerID}' на поле не может быть закрыта монета текущей таверны с id '${G.currentTavern}'.`);
    }
    if (IsCoin(boardCoinCurrentTavern) && boardCoinCurrentTavern.isTriggerTrading) {
        StartTrading({ G, ctx, playerID, ...rest });
    }
};
/**
 * <h3>Стартует обмен монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда заканчивается ход игрока.</li>
 * <li>Когда заканчивается ход соло бота.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isSoloBotEndRound Является ли данное действие в конце хода соло бота.
 * @returns
 */
export const StartTrading = ({ G, ctx, playerID, ...rest }, isSoloBotEndRound = false) => {
    // TODO For solo mode check coins openings
    const privatePlayer = G.players[Number(playerID)], player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PrivatePlayerWithCurrentIdIsUndefined, playerID);
    }
    const tradingCoins = [];
    for (let i = G.tavernsNum; i < player.boardCoins.length; i++) {
        if (G.mode === GameModeNames.Multiplayer || (G.mode === GameModeNames.Solo && playerID === `1`)
            || (G.mode === GameModeNames.SoloAndvari && playerID === `1`)) {
            const privateBoardCoin = privatePlayer.boardCoins[i];
            if (privateBoardCoin === undefined) {
                throw new Error(`В массиве монет приватного игрока с id '${playerID}' на поле отсутствует монета с id '${i}'.`);
            }
            if (!IsCoin(privateBoardCoin)) {
                throw new Error(`В массиве монет приватного игрока с id '${playerID}' на поле не может не быть монеты с id '${i}'.`);
            }
            if (!privateBoardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(privateBoardCoin, true);
            }
            player.boardCoins[i] = privateBoardCoin;
        }
        const boardCoin = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerID}' на поле отсутствует монета с id '${i}'.`);
        }
        if (boardCoin === null) {
            throw new Error(`В массиве монет игрока с id '${playerID}' на поле не может не быть монеты с id '${i}'.`);
        }
        if (!IsCoin(boardCoin)) {
            throw new Error(`В массиве монет игрока с id '${playerID}' на поле не может быть закрыта монета с id '${i}'.`);
        }
        if (IsCoin(boardCoin)) {
            if (!boardCoin.isOpened) {
                ChangeIsOpenedCoinStatus(boardCoin, true);
            }
            if (!(G.mode === GameModeNames.Solo && playerID === `1` && isSoloBotEndRound)) {
                if (boardCoin.isTriggerTrading) {
                    throw new Error(`В массиве монет игрока с id '${playerID}' на поле не может быть обменная монета с id '${i}'.`);
                }
            }
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
                || G.mode === GameModeNames.SoloAndvari) || (G.mode === GameModeNames.Solo
                && (playerID === `1` && isSoloBotEndRound && !boardCoin.isTriggerTrading)
                || (playerID === `1` && !isSoloBotEndRound && !boardCoin.isTriggerTrading)
                || playerID === `0` && !isSoloBotEndRound)) {
                tradingCoins.push(boardCoin);
            }
        }
    }
    if (!isSoloBotEndRound
        || (G.mode === GameModeNames.Solo && playerID === `1` && tradingCoins.length === 1 && isSoloBotEndRound)) {
        const soloBotOnlyOneCoinTrading = G.mode === GameModeNames.Solo && playerID === `1` && tradingCoins.length === 1 && isSoloBotEndRound;
        Trading({ G, ctx, playerID, ...rest }, tradingCoins, soloBotOnlyOneCoinTrading);
    }
};
/**
 * <h3>Активация обмена монет с рынка.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Вызывается после выбора базовой карты игроком, если выложены монета, активирующая обмен монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param tradingCoins Монеты для обмена.
 * @param soloBotOnlyOneCoinTrading У соло бота доступна только 1 монета для обмена с рынка.
 * @returns
 */
const Trading = ({ G, ctx, playerID, ...rest }, tradingCoins, soloBotOnlyOneCoinTrading = false) => {
    const length = tradingCoins.length;
    if (!soloBotOnlyOneCoinTrading && length !== 2) {
        throw new Error(`В массиве обменных монет игрока с id '${playerID}' должно быть ровно '2' монеты, а не '${length}'.`);
    }
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    const coinsValues = tradingCoins.map((coin) => coin.value), coinsMinValue = Math.min(...coinsValues), coinsMaxValue = Math.max(...coinsValues);
    let upgradingCoinId, coinMinIndex = -1, coinMaxIndex = -1, value;
    if (soloBotOnlyOneCoinTrading) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Активирован обмен монеты с ценностью '${coinsMinValue}' соло бота с id '1'.`);
    }
    else {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Активирован обмен монет с ценностью ('${coinsMinValue}' и '${coinsMaxValue}') ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока`} '${player.nickname}'.`);
    }
    for (let i = 0; i < tradingCoins.length; i++) {
        const tradingCoin = tradingCoins[i];
        if (tradingCoin === undefined) {
            throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока`} с id '${playerID}' отсутствует монета с id '${i}'.`);
        }
        if (tradingCoin.value === coinsMinValue && coinMinIndex === -1) {
            coinMinIndex = i;
            if (soloBotOnlyOneCoinTrading) {
                break;
            }
        }
        else if (tradingCoin.value === coinsMaxValue && coinMaxIndex === -1) {
            coinMaxIndex = i;
        }
    }
    if (coinMinIndex === -1) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока`} с id '${playerID}' не найдена минимальная монета с значением '${coinsMinValue}'.`);
    }
    if (!soloBotOnlyOneCoinTrading && coinMaxIndex === -1) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока`} с id '${playerID}' не найдена максимальная монета с значением '${coinsMaxValue}'.`);
    }
    const minTradingCoin = tradingCoins[coinMinIndex];
    if (minTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока`} с id '${playerID}' отсутствует минимальная монета с id '${coinMinIndex}'.`);
    }
    const maxTradingCoin = tradingCoins[coinMaxIndex];
    if (!soloBotOnlyOneCoinTrading && maxTradingCoin === undefined) {
        throw new Error(`В массиве обменных монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока`} с id '${playerID}' отсутствует максимальная монета с id '${coinMaxIndex}'.`);
    }
    // TODO Check solo bot randomly picked concrete coin (or must always pick isInitial)!?
    if (!soloBotOnlyOneCoinTrading && (coinsMinValue === coinsMaxValue &&
        ((maxTradingCoin !== undefined && maxTradingCoin.isInitial) || minTradingCoin.isInitial))) {
        AddActionsToStack({ G, ctx, playerID, ...rest }, [StackData.pickConcreteCoinToUpgrade(coinsMaxValue, coinsMaxValue)]);
        DrawCurrentProfit({ G, ctx, playerID, ...rest });
    }
    else {
        if (((G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1`)
            || CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, HeroBuffNames.UpgradeNextCoin)) {
            upgradingCoinId = G.tavernsNum + coinMinIndex;
            if ((G.mode === GameModeNames.SoloAndvari && playerID === `1`)
                && (minTradingCoin.value + coinsMaxValue) > 25) {
                value = 5;
            }
            else {
                value = soloBotOnlyOneCoinTrading ? 1 : coinsMaxValue;
            }
            if (CheckPlayerHasBuff({ G, ctx, playerID, ...rest }, HeroBuffNames.UpgradeNextCoin)) {
                DeleteBuffFromPlayer({ G, ctx, playerID, ...rest }, HeroBuffNames.UpgradeNextCoin);
            }
        }
        else {
            upgradingCoinId = G.tavernsNum + coinMaxIndex;
            value = coinsMinValue;
        }
        UpgradeCoinAction({ G, ctx, playerID, ...rest }, true, value, upgradingCoinId, CoinTypeNames.Board);
    }
};
//# sourceMappingURL=TradingHelpers.js.map