import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { IsMercenaryCampCard } from "./Camp";
import { IsCardNotActionAndNotNull } from "./Card";
import { isCoin } from "./Coin";
import { suitsConfig } from "./data/SuitData";
import { IsHeroCard } from "./Hero";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { TotalRank } from "./score_helpers/ScoreHelpers";
import { ConfigNames, MoveNames, Phases, ValidatorNames } from "./typescript/enums";
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @param coinId
 * @param type
 * @returns
 */
export const CoinUpgradeValidation = (G, ctx, coinData) => {
    var _a, _b;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (coinData.type === "hand") {
        const handCoinPosition = player.boardCoins.filter((coin, index) => coin === null && index <= coinData.coinId).length;
        if (!((_a = player.handCoins.filter((coin) => isCoin(coin))[handCoinPosition - 1]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
            return true;
        }
    }
    else {
        if (!((_b = player.boardCoins[coinData.coinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
            return true;
        }
    }
    return false;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param obj Параметры валидации мува.
 * @returns Валидный ли мув.
 */
export const IsValidMove = (G, ctx, stage, id) => {
    const validator = GetValidator(ctx.phase, stage);
    let isValid = false;
    if (validator !== null) {
        if (typeof id === `number`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `string`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx));
            }
            else if (`playerId` in id) {
                isValid = ValidateByObjectSuitCardIdPlayerIdValues(id, validator.getRange(G, ctx, id.playerId));
            }
            else if (`suit` in id) {
                isValid = ValidateByObjectSuitCardIdValues(id, validator.getRange(G, ctx));
            }
        }
        else {
            isValid = true;
        }
        if (isValid) {
            return validator.validate(G, ctx, id);
        }
    }
    return isValid;
};
export const GetValidator = (phase, stage) => {
    let validator;
    switch (phase) {
        case Phases.PlaceCoins:
            validator = moveBy[phase][stage];
            break;
        case Phases.PlaceCoinsUline:
            validator = moveBy[phase][stage];
            break;
        case Phases.PickCards:
            validator = moveBy[phase][stage];
            break;
        case Phases.EnlistmentMercenaries:
            validator = moveBy[phase][stage];
            break;
        case Phases.EndTier:
            validator = moveBy[phase][stage];
            break;
        case Phases.GetDistinctions:
            validator = moveBy[phase][stage];
            break;
        case Phases.BrisingamensEndGame:
            validator = moveBy[phase][stage];
            break;
        case Phases.GetMjollnirProfit:
            validator = moveBy[phase][stage];
            break;
        default:
            throw new Error(`Нет такого валидатора.`);
    }
    return validator;
};
// TODO MOVE ALL SAME VALIDATING LOGIC FROM GET RANGE/GET VALUE TO VALIDATE!
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators = {
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G) => {
            if (G !== undefined) {
                return G.botData.allCoinsOrder;
            }
            else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const allCoinsOrder = currentMoveArguments, hasLowestPriority = HasLowestPriority(G, Number(ctx.currentPlayer));
            let resultsForCoins = CheckHeuristicsForCoinsPlacement(G, ctx);
            if (hasLowestPriority) {
                resultsForCoins = resultsForCoins.map((num, index) => index === 0 ? num - 20 : num);
            }
            const minResultForCoins = Math.min(...resultsForCoins), maxResultForCoins = Math.max(...resultsForCoins), tradingProfit = G.decks[G.decks.length - 1].length > 9 ? 1 : 0;
            let [positionForMinCoin, positionForMaxCoin] = [-1, -1];
            if (minResultForCoins <= 0) {
                positionForMinCoin = resultsForCoins.indexOf(minResultForCoins);
            }
            if (maxResultForCoins >= 0) {
                positionForMaxCoin = resultsForCoins.indexOf(maxResultForCoins);
            }
            const handCoins = G.publicPlayers[Number(ctx.currentPlayer)].handCoins;
            for (let i = 0; i < allCoinsOrder.length; i++) {
                const hasTrading = allCoinsOrder[i].some((coinId) => { var _a; return Boolean((_a = handCoins[coinId]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading); });
                if (tradingProfit < 0) {
                    if (hasTrading) {
                        continue;
                    }
                    return allCoinsOrder[i];
                }
                else if (tradingProfit > 0) {
                    if (!hasTrading) {
                        continue;
                    }
                    const hasPositionForMaxCoin = positionForMaxCoin !== -1, hasPositionForMinCoin = positionForMinCoin !== -1, maxCoin = handCoins[allCoinsOrder[i][positionForMaxCoin]], minCoin = handCoins[allCoinsOrder[i][positionForMinCoin]];
                    if (maxCoin && minCoin) {
                        let isTopCoinsOnPosition = false, isMinCoinsOnPosition = false;
                        if (hasPositionForMaxCoin) {
                            isTopCoinsOnPosition =
                                allCoinsOrder[i].filter((coinIndex) => {
                                    const handCoin = handCoins[coinIndex];
                                    return isCoin(handCoin) && handCoin.value > maxCoin.value;
                                }).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition = handCoins.filter((coin) => isCoin(coin) && coin.value < minCoin.value).length <= 1;
                        }
                        if (isTopCoinsOnPosition && isMinCoinsOnPosition) {
                            return allCoinsOrder[i];
                            //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                        }
                    }
                }
                else {
                    return allCoinsOrder[i];
                }
            }
            throw new Error(`Отсутствует вариант выкладки монет для ботов.`);
        },
        moveName: MoveNames.BotsPlaceAllCoinsMove,
        validate: () => true,
    },
    ClickBoardCoinMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.boardCoins.length; j++) {
                    if (player.selectedCoin !== null || (player.selectedCoin === null
                        && isCoin(player.boardCoins[j]))) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickBoardCoinMove,
        validate: () => true,
    },
    ClickCampCardMoveValidator: {
        getRange: (G) => {
            if (G !== undefined) {
                const moveMainArgs = [];
                for (let j = 0; j < G.campNum; j++) {
                    const campCard = G.camp[j];
                    if (campCard !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCampCardMove,
        validate: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                return G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                    || (!G.campPicked && G.publicPlayers[Number(ctx.currentPlayer)].buffs
                        .find((buff) => buff.goCamp !== undefined) !== undefined));
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
    },
    ClickCardMoveValidator: {
        getRange: (G) => {
            if (G !== undefined) {
                const moveMainArgs = [];
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, uniqueArr = [], tavern = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < moveArguments.length; i++) {
                const tavernCard = tavern[moveArguments[i]];
                if (tavernCard === null) {
                    continue;
                }
                if (tavern.some((card) => CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse = EvaluateCard(G, ctx, tavernCard, moveArguments[i], tavern) < 0, isExistCardNotWorse = tavern.some((card) => (card !== null)
                    && (EvaluateCard(G, ctx, tavernCard, moveArguments[i], tavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard = uniqueArr[j];
                    if (IsCardNotActionAndNotNull(tavernCard) && IsCardNotActionAndNotNull(uniqueCard)
                        && tavernCard.suit === uniqueCard.suit
                        && CompareCards(tavernCard, uniqueCard) === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    uniqueArr.push(tavernCard);
                    return moveArguments[i];
                }
                flag = true;
            }
            throw new Error(`Отсутствует вариант выбора карты из таверны для ботов.`);
        },
        moveName: MoveNames.ClickCardMove,
        validate: () => true,
    },
    ClickCardToPickDistinctionMoveValidator: {
        getRange: () => {
            const moveMainArgs = [];
            for (let j = 0; j < 3; j++) {
                moveMainArgs.push(j);
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCardToPickDistinctionMove,
        validate: () => true,
    },
    ClickDistinctionCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [];
                let suit;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.distinctions[suit] === ctx.currentPlayer) {
                            if (ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos]) {
                                moveMainArgs.push(suit);
                                break;
                            }
                        }
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickDistinctionCardMove,
        validate: () => true,
    },
    ClickHandCoinMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (isCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandCoinMove,
        validate: () => true,
    },
    ClickHandCoinUlineMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (isCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandCoinUlineMove,
        validate: () => true,
    },
    ClickHandTradingCoinUlineMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (isCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandTradingCoinUlineMove,
        validate: () => true,
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G, ctx) => {
            var _a;
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = {};
                for (let i = 0;; i++) {
                    let isExit = true, suit;
                    for (suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            const player = G.publicPlayers[Number(ctx.currentPlayer)];
                            if (player.cards[suit][i] !== undefined) {
                                isExit = false;
                                if (!IsHeroCard(player.cards[suit][i])) {
                                    moveMainArgs[suit] = [];
                                    (_a = moveMainArgs[suit]) === null || _a === void 0 ? void 0 : _a.push(i);
                                }
                            }
                        }
                    }
                    if (isExit) {
                        break;
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, suitNames = [];
            let suit;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNames.push(suit);
                }
            }
            const suitName = suitNames[Math.floor(Math.random() * suitNames.length)], moveArgument = moveArguments[suitName];
            if (moveArgument !== undefined) {
                return {
                    suit: suitName,
                    cardId: moveArgument[Math.floor(Math.random() * moveArgument.length)],
                };
            }
            else {
                throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
            }
        },
        moveName: MoveNames.DiscardCardFromPlayerBoardMove,
        validate: () => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G) => {
            if (G !== undefined) {
                const moveMainArgs = [];
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.DiscardCard2PlayersMove,
        validate: () => true,
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], mercenaries = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => IsMercenaryCampCard(card));
                for (let j = 0; j < mercenaries.length; j++) {
                    moveMainArgs.push(j);
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.GetEnlistmentMercenariesMove,
        validate: () => true,
    },
    GetMjollnirProfitMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [];
                let suit;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, totalSuitsRanks = [];
            for (let j = 0; j < moveArguments.length; j++) {
                totalSuitsRanks.push(G.publicPlayers[Number(ctx.currentPlayer)]
                    .cards[moveArguments[j]].reduce(TotalRank, 0) * 2);
            }
            const index = totalSuitsRanks.indexOf(Math.max(...totalSuitsRanks));
            if (index !== -1) {
                return moveArguments[index];
            }
            else {
                throw new Error(`Должна быть хотя бы одна фракция с максимальным количеством шевронов.`);
            }
        },
        moveName: MoveNames.GetMjollnirProfitMove,
        validate: () => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: MoveNames.PassEnlistmentMercenariesMove,
        validate: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => IsMercenaryCampCard(card)).length;
                return ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => {
            var _a;
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [];
                let suit;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const card = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (card !== null && `variants` in card) {
                            if (card.variants !== undefined) {
                                if (suit === ((_a = card.variants[suit]) === null || _a === void 0 ? void 0 : _a.suit)) {
                                    moveMainArgs.push(suit);
                                }
                            }
                        }
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceEnlistmentMercenariesMove,
        validate: () => true,
    },
    PlaceYludHeroMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [];
                let suit;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        moveMainArgs.push(suit);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceYludHeroMove,
        validate: () => true,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: MoveNames.StartEnlistmentMercenariesMove,
        validate: () => true,
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
                for (let j = 0; j < player.handCoins.length; j++) {
                    if (player.buffs.find((buff) => buff.everyTurn !== undefined) !==
                        undefined && isCoin(player.handCoins[j])) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.AddCoinToPouchMove,
        validate: () => true,
    },
    ClickCampCardHoldaMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [];
                for (let j = 0; j < G.campNum; j++) {
                    if (G.camp[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCampCardHoldaMove,
        validate: () => true,
    },
    ClickCoinToUpgradeMoveValidator: {
        // TODO Rework if Uline in play or no 1 coin in game (& add param isInitial?)
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)], handCoins = player.handCoins.filter((coin) => isCoin(coin));
                let handCoinIndex = -1;
                for (let j = 0; j < player.boardCoins.length; j++) {
                    const boardCoin = player.boardCoins[j];
                    if (player.buffs.find((buff) => buff.everyTurn !== undefined) !== undefined && boardCoin === null) {
                        handCoinIndex++;
                        const handCoinNotNull = handCoins[handCoinIndex], handCoinId = player.handCoins.findIndex((coin) => isCoin(handCoinNotNull) && (coin === null || coin === void 0 ? void 0 : coin.value) === handCoinNotNull.value
                            && coin.isInitial === handCoinNotNull.isInitial);
                        if (handCoinId !== -1) {
                            const handCoin = player.handCoins[handCoinId];
                            if (isCoin(handCoin) && !handCoin.isTriggerTrading) {
                                moveMainArgs.push({
                                    coinId: j,
                                    type: `hand`,
                                    isInitial: handCoin.isInitial,
                                });
                            }
                        }
                    }
                    else if (isCoin(boardCoin) && !boardCoin.isTriggerTrading) {
                        moveMainArgs.push({
                            coinId: j,
                            type: `board`,
                            isInitial: boardCoin.isInitial,
                        });
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G, ctx, id) => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                return CoinUpgradeValidation(G, ctx, id);
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G) => {
            if (G !== undefined) {
                const moveMainArgs = [];
                for (let i = 0; i < G.heroes.length; i++) {
                    if (G.heroes[i].active) {
                        moveMainArgs.push(i);
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHeroCardMove,
        validate: (G, ctx, id) => {
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                let isValid = false;
                const validators = G.heroes[id].validators;
                if (validators !== undefined) {
                    for (const validator in validators) {
                        if (Object.prototype.hasOwnProperty.call(validators, validator)) {
                            switch (validator) {
                                case ValidatorNames.Conditions:
                                    isValid = IsCanPickHeroWithConditionsValidator(G, ctx, id);
                                    break;
                                case ValidatorNames.DiscardCard:
                                    isValid = IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator(G, ctx, id);
                                    break;
                                default:
                                    isValid = true;
                                    break;
                            }
                        }
                    }
                }
                else {
                    isValid = true;
                }
                return isValid;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G, ctx) => {
            var _a;
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = {}, player = G.publicPlayers[Number(ctx.currentPlayer)], config = player.stack[0].config, pickedCard = player.pickedCard;
                if (config !== undefined) {
                    let suit;
                    for (suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            if (suit !== config.suit && !(G.drawProfit === ConfigNames.DagdaAction
                                && player.actionsNum === 1 && pickedCard !== null && `suit` in pickedCard
                                && suit === pickedCard.suit)) {
                                const last = player.cards[suit].length - 1;
                                if (last !== -1 && !IsHeroCard(player.cards[suit][last])) {
                                    moveMainArgs[suit] = [];
                                    (_a = moveMainArgs[suit]) === null || _a === void 0 ? void 0 : _a.push(last);
                                }
                            }
                        }
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, suitNamesArray = [];
            let suit;
            for (suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNamesArray.push(suit);
                }
            }
            const suitName = suitNamesArray[Math.floor(Math.random() * suitNamesArray.length)], moveArgument = moveArguments[suitName];
            if (moveArgument !== undefined) {
                return {
                    suit: suitName,
                    cardId: moveArgument[Math.floor(Math.random() * moveArgument.length)],
                };
            }
            else {
                throw new Error(`Отсутствует обязательный параметр 'moveArguments[suitName]'.`);
            }
        },
        moveName: MoveNames.DiscardCardMove,
        validate: () => true,
    },
    DiscardSuitCardFromPlayerBoardMoveValidator: {
        getRange: (G, ctx, playerId) => {
            if (G !== undefined && ctx !== undefined && playerId !== undefined) {
                const player = G.publicPlayers[playerId], config = player.stack[0].config;
                if (config !== undefined && config.suit !== undefined) {
                    if (player.stack[0] !== undefined) {
                        const moveMainArgs = {
                            playerId: playerId,
                            suit: config.suit,
                            cards: [],
                        };
                        for (let i = 0; i < player.cards[config.suit].length; i++) {
                            if (player.cards[config.suit][i] !== undefined) {
                                if (!IsHeroCard(player.cards[config.suit][i])) {
                                    moveMainArgs.cards.push(i);
                                }
                            }
                        }
                        return moveMainArgs;
                    }
                    else {
                        throw new Error(`'player.stack[0]' is undefined.`);
                    }
                }
                else {
                    throw new Error(`'config' and/or 'config.suit' is undefined.`);
                }
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'playerId' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, player = G.publicPlayers[moveArguments.playerId];
            let minCardIndex = 0, minCardValue = player.cards[moveArguments.suit][0].points;
            // TODO Check if array not empty and FOR ALL VALIDATORS TOO!!!
            moveArguments.cards.forEach((value, index) => {
                const cardPoints = player.cards[moveArguments.suit][value].points;
                if (cardPoints !== null && minCardValue !== null) {
                    if (cardPoints < minCardValue) {
                        minCardIndex = index;
                        minCardValue = cardPoints;
                    }
                }
                else {
                    throw new Error(`Фракция должна иметь параметр 'points'.`);
                }
            });
            return {
                playerId: moveArguments.playerId,
                suit: moveArguments.suit,
                cardId: moveArguments.cards[minCardIndex],
            };
        },
        moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
        // TODO validate Not bot playerId === ctx.currentPlayer & for Bot playerId exists in playersNum and card not hero?
        validate: () => true,
    },
    PickDiscardCardMoveValidator: {
        getRange: (G) => {
            if (G !== undefined) {
                const moveMainArgs = [];
                for (let j = 0; j < G.discardCardsDeck.length; j++) {
                    moveMainArgs.push(j);
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PickDiscardCardMove,
        validate: () => true,
    },
    PlaceOlwinCardMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [];
                let suit;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceOlwinCardMove,
        validate: () => true,
    },
    PlaceThrudHeroMoveValidator: {
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [];
                let suit;
                for (suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceThrudHeroMove,
        validate: () => true,
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        // TODO Rework if Uline in play or no 1 coin in game(& add param isInitial ?)
        getRange: (G, ctx) => {
            if (G !== undefined && ctx !== undefined) {
                const moveMainArgs = [], player = G.publicPlayers[Number(ctx.currentPlayer)], config = player.stack[0].config;
                if (config !== undefined) {
                    for (let j = G.tavernsNum; j < player.boardCoins.length; j++) {
                        const coin = player.boardCoins[j];
                        if (isCoin(coin)) {
                            if (!coin.isTriggerTrading && config.coinId !== j) {
                                moveMainArgs.push({
                                    coinId: j,
                                    type: `board`,
                                    isInitial: coin.isInitial,
                                });
                            }
                        }
                    }
                }
                return moveMainArgs;
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' is undefined.`);
            }
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G, ctx, id) => {
            var _a;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                return ((_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config) === null || _a === void 0 ? void 0 : _a.coinId) !== id.coinId
                    && CoinUpgradeValidation(G, ctx, id);
            }
            else {
                throw new Error(`Function param 'G' and/or 'ctx' and/or 'id' is undefined.`);
            }
        },
    },
    // end
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveBy = {
    placeCoins: {
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
        default3: moveValidators.BotsPlaceAllCoinsMoveValidator,
    },
    placeCoinsUline: {
        default1: moveValidators.ClickHandCoinUlineMoveValidator,
    },
    pickCards: {
        default1: moveValidators.ClickCardMoveValidator,
        default2: moveValidators.ClickCampCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        discardCard: moveValidators.DiscardCard2PlayersMoveValidator,
        placeTradingCoinsUline: moveValidators.ClickHandTradingCoinUlineMoveValidator,
    },
    enlistmentMercenaries: {
        default1: moveValidators.StartEnlistmentMercenariesMoveValidator,
        default2: moveValidators.PassEnlistmentMercenariesMoveValidator,
        default3: moveValidators.GetEnlistmentMercenariesMoveValidator,
        default4: moveValidators.PlaceEnlistmentMercenariesMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    endTier: {
        default1: moveValidators.PlaceYludHeroMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    getDistinctions: {
        default1: moveValidators.ClickDistinctionCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeOlwinCards: moveValidators.PlaceOlwinCardMoveValidator,
        placeThrudHero: moveValidators.PlaceThrudHeroMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        pickDistinctionCard: moveValidators.ClickCardToPickDistinctionMoveValidator,
    },
    brisingamensEndGame: {
        default1: moveValidators.DiscardCardFromPlayerBoardMoveValidator,
    },
    getMjollnirProfit: {
        default1: moveValidators.GetMjollnirProfitMoveValidator,
    },
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @TODO Саше: сделать описание функции и параметров.
 * @param num
 * @param values
 * @returns
 */
const ValidateByValues = (value, values) => values.includes(value);
const ValidateByObjectCoinIdTypeIsInitialValues = (value, values) => values.findIndex((coin) => value.coinId === coin.coinId && value.type === coin.type && value.isInitial === coin.isInitial) !== -1;
const ValidateByObjectSuitCardIdValues = (value, values) => {
    const objectSuitCardIdValues = values[value.suit];
    return objectSuitCardIdValues !== undefined && objectSuitCardIdValues.includes(value.cardId);
};
const ValidateByObjectSuitCardIdPlayerIdValues = (value, values) => values.suit === value.suit
    && values.playerId === value.playerId && values.cards.includes(value.cardId);
//# sourceMappingURL=MoveValidator.js.map