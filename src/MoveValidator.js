import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { isCardNotAction } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { TotalRank } from "./helpers/ScoreHelpers";
import { IsCanPickHeroWithConditionsValidator, IsCanPickHeroWithDiscardCardsFromPlayerBoardValidator } from "./move_validators/IsCanPickCurrentHeroValidator";
import { HasLowestPriority } from "./Priority";
import { ConfigNames, HeroNames, MoveNames, Phases, RusCardTypes, Stages, ValidatorNames } from "./typescript/enums";
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
    if (coinData.type === "hand") {
        const handCoinPosition = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
            .filter((coin, index) => coin === null && index <= coinData.coinId).length;
        if (!((_a = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
            .filter((coin) => coin !== null)[handCoinPosition - 1]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
            return true;
        }
    }
    else {
        if (!((_b = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[coinData.coinId]) === null || _b === void 0 ? void 0 : _b.isTriggerTrading)) {
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
    if (validator !== undefined) {
        if (typeof id === `number`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `string`) {
            isValid = ValidateByValues(id, validator.getRange(G, ctx));
        }
        else if (typeof id === `object` && !Array.isArray(id) && id !== null) {
            if (`suit` in id) {
                isValid = ValidateByObjectSuitIdValues(id, validator.getRange(G, ctx));
            }
            else if (`coinId` in id) {
                isValid = ValidateByObjectCoinIdTypeIsInitialValues(id, validator.getRange(G, ctx));
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
            break;
    }
    return validator;
};
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 * @TODO Саше: сделать описание функции и параметров.
 */
export const moveValidators = {
    // TODO Add all validators to all moves
    BotsPlaceAllCoinsMoveValidator: {
        getRange: (G) => {
            let moveMainArgs = [];
            if (G !== undefined) {
                moveMainArgs = G.botData.allCoinsOrder;
            }
            return moveMainArgs;
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
                                allCoinsOrder[i].filter((coinIndex) => handCoins[coinIndex] !== null
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    && handCoins[coinIndex].value > maxCoin.value).length <= 1;
                        }
                        if (hasPositionForMinCoin) {
                            isMinCoinsOnPosition = handCoins.filter((coin) => coin !== null
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                && coin.value < minCoin.value).length <= 1;
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
            // TODO FIx it!
            return [];
        },
        moveName: MoveNames.BotsPlaceAllCoinsMove,
        validate: () => true,
    },
    ClickBoardCoinMoveValidator: {
        getRange: (G, ctx) => {
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                // TODO Make it simple!?
                for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
                    if (j < G.tavernsNum) {
                        if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j] === null) {
                            if (ctx.phase === Phases.PlaceCoins
                                || (ctx.phase === Phases.PlaceCoinsUline && j === G.currentTavern + 1)) {
                                moveMainArgs.push(j);
                            }
                        }
                        else {
                            if (ctx.phase === Phases.PlaceCoins) {
                                moveMainArgs.push(j);
                            }
                        }
                    }
                    else {
                        if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j] === null) {
                            if (ctx.phase !== Phases.PlaceCoinsUline
                                && (ctx.phase === Phases.PlaceCoins || (ctx.activePlayers
                                    && ctx.activePlayers[Number(ctx.currentPlayer)] ===
                                        Stages.PlaceTradingCoinsUline))) {
                                moveMainArgs.push(j);
                            }
                        }
                        else {
                            if (ctx.phase === Phases.PlaceCoins || (ctx.activePlayers
                                && ctx.activePlayers[Number(ctx.currentPlayer)] ===
                                    Stages.PlaceTradingCoinsUline)) {
                                moveMainArgs.push(j);
                            }
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickBoardCoinMove,
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[id] === null;
            }
            return isValid;
        },
    },
    ClickCampCardMoveValidator: {
        getRange: (G) => {
            const moveMainArgs = [];
            if (G !== undefined) {
                for (let j = 0; j < G.campNum; j++) {
                    const campCard = G.camp[j];
                    if (campCard !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCampCardMove,
        validate: (G, ctx) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                isValid = G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                    || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)));
            }
            return isValid;
        },
    },
    ClickCardMoveValidator: {
        getRange: (G) => {
            const moveMainArgs = [];
            if (G !== undefined) {
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO How to currentMoveArguments here? Check it because it has no null cards!!!
            const uniqueArr = [], tavern = G.taverns[G.currentTavern];
            let flag = true;
            for (let i = 0; i < tavern.length; i++) {
                const tavernCard = tavern[i];
                if (tavernCard === null) {
                    continue;
                }
                if (tavern.some((card) => CompareCards(tavernCard, card) < 0)) {
                    continue;
                }
                const isCurrentCardWorse = EvaluateCard(G, ctx, tavernCard, i, tavern) < 0, isExistCardNotWorse = tavern.some((card) => (card !== null)
                    && (EvaluateCard(G, ctx, tavernCard, i, tavern) >= 0));
                if (isCurrentCardWorse && isExistCardNotWorse) {
                    continue;
                }
                const uniqueArrLength = uniqueArr.length;
                for (let j = 0; j < uniqueArrLength; j++) {
                    const uniqueCard = uniqueArr[j];
                    if (isCardNotAction(tavernCard) && isCardNotAction(uniqueCard)
                        && tavernCard.suit === uniqueCard.suit
                        && CompareCards(tavernCard, uniqueCard) === 0) {
                        flag = false;
                        break;
                    }
                }
                if (flag) {
                    uniqueArr.push(tavernCard);
                    return i;
                }
                flag = true;
            }
            // TODO FIX it!
            return -1;
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
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.distinctions[suit] === ctx.currentPlayer) {
                            if (ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos]) {
                                moveMainArgs.push(suit);
                                break;
                            }
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickDistinctionCardMove,
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `string`) {
                isValid = Object.keys(G.distinctions).includes(id)
                    && G.distinctions[id] === ctx.currentPlayer
                    && ctx.currentPlayer === ctx.playOrder[ctx.playOrderPos];
            }
            return isValid;
        }
    },
    ClickHandCoinMoveValidator: {
        getRange: (G, ctx) => {
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
                    if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                        if (ctx.phase === Phases.PlaceCoins || ctx.phase === Phases.PlaceCoinsUline
                            || (ctx.activePlayers && ctx.activePlayers[Number(ctx.currentPlayer)] ===
                                Stages.PlaceTradingCoinsUline)) {
                            moveMainArgs.push(j);
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHandCoinMove,
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
                isValid = G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin === undefined
                    && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[id] !== null;
            }
            return isValid;
        },
    },
    DiscardCardFromPlayerBoardMoveValidator: {
        getRange: (G, ctx) => {
            const moveMainArgs = {};
            if (G !== undefined && ctx !== undefined) {
                for (let i = 0;; i++) {
                    let isExit = true;
                    for (const suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i] !== undefined) {
                                isExit = false;
                                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][i].type !==
                                    RusCardTypes.HERO) {
                                    moveMainArgs[suit] = [];
                                    moveMainArgs[suit].push(i);
                                }
                            }
                        }
                    }
                    if (isExit) {
                        break;
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, suitNames = [];
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitNames.push(suit);
                }
            }
            suitName = suitNames[Math.floor(Math.random() * suitNames.length)];
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        moveName: MoveNames.DiscardCardFromPlayerBoardMove,
        validate: () => true,
    },
    DiscardCard2PlayersMoveValidator: {
        getRange: (G) => {
            const moveMainArgs = [];
            if (G !== undefined) {
                for (let j = 0; j < G.drawSize; j++) {
                    if (G.taverns[G.currentTavern][j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.DiscardCard2PlayersMove,
        validate: (G, ctx) => {
            let isValid = false;
            if (ctx !== undefined) {
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1];
            }
            return isValid;
        },
    },
    GetEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => {
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                const mercenaries = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => card.type === RusCardTypes.MERCENARY);
                for (let j = 0; j < mercenaries.length; j++) {
                    moveMainArgs.push(j);
                }
            }
            return moveMainArgs;
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
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length) {
                            moveMainArgs.push(suit);
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments, totalSuitsRanks = [];
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            for (let j = 0; j < moveArguments.length; j++) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                const suit = moveArguments[j];
                totalSuitsRanks.push(G.publicPlayers[Number(ctx.currentPlayer)]
                    .cards[suit].reduce(TotalRank, 0) * 2);
            }
            return Object.values(suitsConfig)[totalSuitsRanks
                .indexOf(Math.max(...totalSuitsRanks))].suit;
        },
        moveName: MoveNames.GetMjollnirProfitMove,
        validate: () => true,
    },
    PassEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: MoveNames.PassEnlistmentMercenariesMove,
        validate: (G, ctx) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => card.type === RusCardTypes.MERCENARY).length;
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            }
            return isValid;
        },
    },
    PlaceEnlistmentMercenariesMoveValidator: {
        getRange: (G, ctx) => {
            var _a;
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
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
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceEnlistmentMercenariesMove,
        validate: () => true,
    },
    StartEnlistmentMercenariesMoveValidator: {
        getRange: () => null,
        getValue: () => null,
        moveName: MoveNames.StartEnlistmentMercenariesMove,
        validate: (G, ctx) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined) {
                const mercenariesCount = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => card.type === RusCardTypes.MERCENARY).length;
                isValid = ctx.playOrderPos === 0 && ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1]
                    && mercenariesCount > 0;
            }
            return isValid;
        },
    },
    // start
    AddCoinToPouchMoveValidator: {
        getRange: (G, ctx) => {
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
                    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
                        && G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
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
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                for (let j = 0; j < G.campNum; j++) {
                    if (G.camp[j] !== null) {
                        moveMainArgs.push(j);
                    }
                }
            }
            return moveMainArgs;
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
            var _a, _b, _c, _d;
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                const handCoins = G.publicPlayers[Number(ctx.currentPlayer)].handCoins
                    .filter((coin) => coin !== null);
                let handCoinIndex = -1;
                for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
                    // TODO Check .? for all coins!!! and delete AS
                    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.everyTurn === HeroNames.Uline
                        && G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j] === null) {
                        handCoinIndex++;
                        const handCoinId = G.publicPlayers[Number(ctx.currentPlayer)]
                            .handCoins.findIndex((coin) => {
                            var _a, _b;
                            return (coin === null || coin === void 0 ? void 0 : coin.value) === ((_a = handCoins[handCoinIndex]) === null || _a === void 0 ? void 0 : _a.value)
                                && (coin === null || coin === void 0 ? void 0 : coin.isInitial) === ((_b = handCoins[handCoinIndex]) === null || _b === void 0 ? void 0 : _b.isInitial);
                        });
                        if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[handCoinId]
                            && !((_a = G.publicPlayers[Number(ctx.currentPlayer)]
                                .handCoins[handCoinId]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading)) {
                            moveMainArgs.push({
                                coinId: j,
                                type: `hand`,
                                isInitial: (_b = handCoins[handCoinIndex]) === null || _b === void 0 ? void 0 : _b.isInitial,
                            });
                        }
                    }
                    else if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]
                        && !((_c = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _c === void 0 ? void 0 : _c.isTriggerTrading)) {
                        moveMainArgs.push({
                            coinId: j,
                            type: `board`,
                            isInitial: (_d = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j]) === null || _d === void 0 ? void 0 : _d.isInitial,
                        });
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            // TODO Check add TYPE!?
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickCoinToUpgradeMove,
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                isValid = CoinUpgradeValidation(G, ctx, id);
            }
            return isValid;
        },
    },
    ClickHeroCardMoveValidator: {
        getRange: (G) => {
            const moveMainArgs = [];
            if (G !== undefined) {
                for (let i = 0; i < G.heroes.length; i++) {
                    if (G.heroes[i].active) {
                        moveMainArgs.push(i);
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.ClickHeroCardMove,
        validate: (G, ctx, id) => {
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `number`) {
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
            }
            return isValid;
        },
    },
    DiscardCardMoveValidator: {
        getRange: (G, ctx) => {
            const moveMainArgs = {};
            if (G !== undefined && ctx !== undefined) {
                const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config, pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                if (config !== undefined) {
                    for (const suit in suitsConfig) {
                        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                            if (suit !== config.suit
                                && !(G.drawProfit === ConfigNames.DagdaAction
                                    && G.actionsNum === 1 && pickedCard !== null
                                    && `suit` in pickedCard && suit === pickedCard.suit)) {
                                const last = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].length - 1;
                                if (G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][last].type !==
                                    RusCardTypes.HERO) {
                                    moveMainArgs[suit] = [];
                                    moveMainArgs[suit].push(last);
                                }
                            }
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            let suitName = ``;
            for (const suit in moveArguments) {
                if (Object.prototype.hasOwnProperty.call(moveArguments, suit)) {
                    suitName = suit;
                }
            }
            return {
                suit: suitName,
                cardId: moveArguments[suitName][Math.floor(Math.random() * moveArguments[suitName].length)],
            };
        },
        moveName: MoveNames.DiscardCardMove,
        validate: () => true,
    },
    // DiscardSuitCardFromPlayerBoardMoveValidator: {
    //     // TODO FIX IT!!!!!!
    //     getRange: (G?: IMyGameState, ctx?: Ctx): ICurrentMoveArguments => currentMoveArguments,
    //     // getValue: (G: IMyGameState, ctx: Ctx, currentMoveArguments: MoveValidatorGetRangeTypes):
    // ValidMoveIdParamTypes => {
    //     //     const moveArguments: number[] = currentMoveArguments as number[];
    //     //     return [moveArguments[Math.floor(Math.random() * moveArguments.length)]];
    //     // },
    // moveName: MoveNames.DiscardSuitCardFromPlayerBoardMove,
    //     validate: (): boolean => true, // TODO Check it
    // },
    PickDiscardCardMoveValidator: {
        getRange: (G) => {
            const moveMainArgs = [];
            if (G !== undefined) {
                for (let j = 0; j < G.discardCardsDeck.length; j++) {
                    moveMainArgs.push(j);
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PickDiscardCardMove,
        validate: () => true,
    },
    PlaceCardMoveValidator: {
        getRange: (G, ctx) => {
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                for (const suit in suitsConfig) {
                    if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
                        const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
                        if (pickedCard === null || ("suit" in pickedCard && suit !== pickedCard.suit)) {
                            const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                            if (config !== undefined) {
                                moveMainArgs.push(suit);
                            }
                        }
                    }
                }
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.PlaceCardMove,
        validate: () => true, // TODO Check it
    },
    UpgradeCoinVidofnirVedrfolnirMoveValidator: {
        // TODO Rework if Uline in play or no 1 coin in game(& add param isInitial ?)
        getRange: (G, ctx) => {
            const moveMainArgs = [];
            if (G !== undefined && ctx !== undefined) {
                const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                if (config !== undefined) {
                    for (let j = G.tavernsNum; j <
                        G.publicPlayers[Number(ctx.currentPlayer)].boardCoins.length; j++) {
                        const coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[j];
                        if (coin !== null) {
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
            }
            return moveMainArgs;
        },
        getValue: (G, ctx, currentMoveArguments) => {
            const moveArguments = currentMoveArguments;
            return moveArguments[Math.floor(Math.random() * moveArguments.length)];
        },
        moveName: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
        validate: (G, ctx, id) => {
            var _a;
            let isValid = false;
            if (G !== undefined && ctx !== undefined && id !== undefined && typeof id === `object` && id !== null
                && `coinId` in id) {
                isValid = ((_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config) === null || _a === void 0 ? void 0 : _a.coinId) !== id.coinId
                    && CoinUpgradeValidation(G, ctx, id);
            }
            return isValid;
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
        default1: moveValidators.ClickHandCoinMoveValidator,
        default2: moveValidators.ClickBoardCoinMoveValidator,
    },
    pickCards: {
        default1: moveValidators.ClickCardMoveValidator,
        default2: moveValidators.ClickCampCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        // discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeCards: moveValidators.PlaceCardMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
        discardCard: moveValidators.DiscardCard2PlayersMoveValidator,
        // TODO Fix it!
        placeTradingCoinsUline: moveValidators.ClickHandCoinMoveValidator,
        // PlaceTradingCoinsUline: moveValidators.ClickBoardCoinMove,
    },
    enlistmentMercenaries: {
        default1: moveValidators.StartEnlistmentMercenariesMoveValidator,
        default2: moveValidators.PassEnlistmentMercenariesMoveValidator,
        default3: moveValidators.GetEnlistmentMercenariesMoveValidator,
        default4: moveValidators.PlaceEnlistmentMercenariesMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        // discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeCards: moveValidators.PlaceCardMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    endTier: {
        default1: moveValidators.PlaceCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        // discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeCards: moveValidators.PlaceCardMoveValidator,
        upgradeCoin: moveValidators.ClickCoinToUpgradeMoveValidator,
        upgradeVidofnirVedrfolnirCoin: moveValidators.UpgradeCoinVidofnirVedrfolnirMoveValidator,
        // end
    },
    getDistinctions: {
        default1: moveValidators.ClickDistinctionCardMoveValidator,
        // start
        addCoinToPouch: moveValidators.AddCoinToPouchMoveValidator,
        discardBoardCard: moveValidators.DiscardCardMoveValidator,
        // discardSuitCard: moveValidators.DiscardSuitCardFromPlayerBoardMoveValidator,
        pickCampCardHolda: moveValidators.ClickCampCardHoldaMoveValidator,
        pickDiscardCard: moveValidators.PickDiscardCardMoveValidator,
        pickHero: moveValidators.ClickHeroCardMoveValidator,
        placeCards: moveValidators.PlaceCardMoveValidator,
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
const ValidateByObjectCoinIdTypeIsInitialValues = (value, values) => {
    return values.findIndex((coin) => value.coinId === coin.coinId && value.type === coin.type && value.isInitial === coin.isInitial) !== -1;
};
const ValidateByObjectSuitIdValues = (value, values) => values[value.suit].includes(value.cardId);
//# sourceMappingURL=MoveValidator.js.map