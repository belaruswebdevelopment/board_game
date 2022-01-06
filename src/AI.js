import { CompareCards, EvaluateCard } from "./bot_logic/BotCardLogic";
import { CheckHeuristicsForCoinsPlacement } from "./bot_logic/BotConfig";
import { isCardNotAction } from "./Card";
import { suitsConfig } from "./data/SuitData";
import { AddCoinToPouchProfit, DiscardAnyCardFromPlayerBoardProfit, DiscardCardFromBoardProfit, DiscardCardProfit, GetEnlistmentMercenariesProfit, GetMjollnirProfitProfit, PickCampCardHoldaProfit, PickDiscardCardProfit, PlaceCardsProfit, PlaceEnlistmentMercenariesProfit, StartEnlistmentMercenariesProfit, UpgradeCoinVidofnirVedrfolnirProfit } from "./helpers/ProfitHelpers";
import { moveBy, moveValidators } from "./MoveValidator";
import { HasLowestPriority } from "./Priority";
import { CurrentScoring } from "./Score";
import { ConfigNames, MoveNames, Phases, RusCardTypes, Stages } from "./typescript/enums";
/**
 * <h3>Возвращает массив возможных ходов для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для доступных ходов.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Массив возможных мувов у ботов.
 */
export const enumerate = (G, ctx) => {
    var _a, _b;
    // todo Allow Pick Hero and all acions from hero pick to this phase
    //make false for standard bot
    const enableAdvancedBot = true, uniqueArr = [], activeStageOfCurrentPlayer = (_b = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) !== null && _b !== void 0 ? _b : `default`, advancedString = `advanced`, isAdvancedExist = Object.keys(moveBy[ctx.phase])
        .some((key) => key.includes(advancedString));
    let moves = [], flag = true;
    // todo Fix it, now just for bot can do RANDOM move
    const botMoveArguments = [];
    for (const stage in moveBy[ctx.phase]) {
        if (Object.prototype.hasOwnProperty.call(moveBy[ctx.phase], stage)) {
            if (ctx.phase === Phases.PickCards && stage.startsWith(`default`)) {
                continue;
            }
            if (stage.includes(activeStageOfCurrentPlayer)
                && (!isAdvancedExist || stage.includes(advancedString) === enableAdvancedBot)) {
                // todo Sync players and bots validations in one places
                const moveName = moveBy[ctx.phase][stage], [minValue, maxValue] = moveValidators[moveName].getRange({ G, ctx }), hasGetValue = Object.prototype.hasOwnProperty.call(moveValidators[moveName], `getValue`);
                let argValue;
                let argArray;
                for (let id = minValue; id < maxValue; id++) {
                    // todo sync bot moves options with profit UI options for players (same logic without UI)
                    let type = undefined;
                    if (stage === Stages.UpgradeCoin) {
                        // todo fix for Uline???
                        type = `board`;
                    }
                    if (!moveValidators[moveName].validate({ G, ctx, id, type })) {
                        continue;
                    }
                    if (hasGetValue) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        argArray = moveValidators[moveName].getValue({ G, ctx, id });
                        moves.push({ move: moveName, args: [argArray] });
                    }
                    else {
                        argValue = id;
                        moves.push({ move: moveName, args: [argValue] });
                    }
                }
            }
        }
    }
    if (moves.length > 0) {
        return moves;
    }
    if (ctx.phase === Phases.PickCards && activeStageOfCurrentPlayer === `default` && ctx.activePlayers === null) {
        // todo Fix it, now just for bot can do RANDOM move
        let pickCardOrCampCard = `card`;
        if (G.expansions.thingvellir.active
            && (ctx.currentPlayer === G.publicPlayersOrder[0]
                || (!G.campPicked && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)))) {
            pickCardOrCampCard = Math.floor(Math.random() * 2) ? `card` : `camp`;
        }
        if (pickCardOrCampCard === `card`) {
            const tavern = G.taverns[G.currentTavern];
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
                    moves.push({
                        move: MoveNames.ClickCardMove,
                        args: [i],
                    });
                }
                flag = true;
            }
        }
        else {
            for (let j = 0; j < G.campNum; j++) {
                if (G.camp[j] !== null) {
                    botMoveArguments.push([j]);
                }
            }
            moves.push({
                move: MoveNames.ClickCampCardMove,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
    }
    if (enableAdvancedBot && ctx.phase === Phases.PlaceCoins) {
        moves = [];
        const hasLowestPriority = HasLowestPriority(G, Number(ctx.currentPlayer));
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
        const allCoinsOrder = G.botData.allCoinsOrder, handCoins = G.publicPlayers[Number(ctx.currentPlayer)].handCoins;
        for (let i = 0; i < allCoinsOrder.length; i++) {
            const hasTrading = allCoinsOrder[i].some((coinId) => { var _a; return Boolean((_a = handCoins[coinId]) === null || _a === void 0 ? void 0 : _a.isTriggerTrading); });
            if (tradingProfit < 0) {
                if (hasTrading) {
                    continue;
                }
                moves.push({
                    move: MoveNames.BotsPlaceAllCoinsMove,
                    args: [allCoinsOrder[i]],
                });
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
                        moves.push({
                            move: MoveNames.BotsPlaceAllCoinsMove,
                            args: [G.botData.allCoinsOrder[i]],
                        });
                        //console.log(`#` + i.toString().padStart(2) + `: ` + allCoinsOrder[i].map(item => handCoins[item].value));
                    }
                }
            }
            else {
                moves.push({
                    move: MoveNames.BotsPlaceAllCoinsMove,
                    args: [allCoinsOrder[i]],
                });
            }
        }
        //console.log(moves);
    }
    // todo Fix it, now just for bot can do RANDOM move
    if (activeStageOfCurrentPlayer === Stages.PlaceCards || ctx.phase === Phases.EndTier) {
        PlaceCardsProfit(G, ctx, botMoveArguments);
        moves.push({
            move: MoveNames.PlaceCardMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (ctx.phase === Phases.GetMjollnirProfit) {
        const totalSuitsRanks = [];
        GetMjollnirProfitProfit(G, ctx, totalSuitsRanks);
        botMoveArguments.push([Object.values(suitsConfig)[totalSuitsRanks
                .indexOf(Math.max(...totalSuitsRanks))].suit]);
        moves.push({
            move: MoveNames.GetMjollnirProfitMove,
            args: [...botMoveArguments[0]],
        });
    }
    if (ctx.phase === Phases.BrisingamensEndGame) {
        DiscardAnyCardFromPlayerBoardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: MoveNames.DiscardCardFromPlayerBoardMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (ctx.phase === Phases.EnlistmentMercenaries) {
        if (G.drawProfit === ConfigNames.StartOrPassEnlistmentMercenaries) {
            StartEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            if (Math.floor(Math.random() * botMoveArguments.length) === 0) {
                moves.push({
                    move: MoveNames.StartEnlistmentMercenariesMove,
                    args: [],
                });
            }
            else {
                moves.push({
                    move: MoveNames.PassEnlistmentMercenariesMove,
                    args: [],
                });
            }
        }
        else if (G.drawProfit === ConfigNames.EnlistmentMercenaries) {
            GetEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            moves.push({
                move: MoveNames.GetEnlistmentMercenariesMove,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
        else if (G.drawProfit === ConfigNames.PlaceEnlistmentMercenaries) {
            PlaceEnlistmentMercenariesProfit(G, ctx, botMoveArguments);
            moves.push({
                move: MoveNames.PlaceEnlistmentMercenariesMove,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
    }
    if (ctx.phase === Phases.PlaceCoinsUline) {
        for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                botMoveArguments.push([j]);
            }
        }
        moves.push({
            move: MoveNames.ClickHandCoinMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
        moves.push({
            move: MoveNames.ClickBoardCoinMove,
            args: [G.currentTavern + 1],
        });
    }
    if (activeStageOfCurrentPlayer === Stages.PlaceTradingCoinsUline) {
        for (let j = 0; j < G.publicPlayers[Number(ctx.currentPlayer)].handCoins.length; j++) {
            if (G.publicPlayers[Number(ctx.currentPlayer)].handCoins[j] !== null) {
                botMoveArguments.push([j]);
            }
        }
        moves.push({
            move: MoveNames.ClickHandCoinMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
        if (G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.tavernsNum]) {
            moves.push({
                move: MoveNames.ClickBoardCoinMove,
                args: [G.tavernsNum + 1],
            });
        }
        else {
            moves.push({
                move: MoveNames.ClickBoardCoinMove,
                args: [G.tavernsNum],
            });
        }
    }
    if (activeStageOfCurrentPlayer === Stages.AddCoinToPouch) {
        AddCoinToPouchProfit(G, ctx, botMoveArguments);
        moves.push({
            move: MoveNames.AddCoinToPouchMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (activeStageOfCurrentPlayer === Stages.UpgradeCoinVidofnirVedrfolnir) {
        UpgradeCoinVidofnirVedrfolnirProfit(G, ctx, botMoveArguments);
        moves.push({
            move: MoveNames.UpgradeCoinVidofnirVedrfolnirMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    // TODO FIX It's not activeStageOfCurrentPlayer it's for Others players!!!
    // if (ctx.activePlayers.find/findIndex === "discardSuitCard") {
    if (ctx.phase === Phases.PickCards && ctx.activePlayers !== null && activeStageOfCurrentPlayer === `default`) {
        // TODO Fix this (only for quick bot actions)
        // todo Bot can't do async turns...?
        const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
        if (config !== undefined && config.suit !== undefined) {
            for (let p = 0; p < G.publicPlayers.length; p++) {
                if (p !== Number(ctx.currentPlayer) && G.publicPlayers[p].stack[0] !== undefined) {
                    for (let i = 0; i < G.publicPlayers[p].cards[config.suit].length; i++) {
                        for (let j = 0; j < 1; j++) {
                            if (G.publicPlayers[p].cards[config.suit][i] !== undefined) {
                                if (G.publicPlayers[p].cards[config.suit][i].type !== RusCardTypes.HERO) {
                                    const points = G.publicPlayers[p].cards[config.suit][i].points;
                                    if (points !== null) {
                                        botMoveArguments.push([points]);
                                    }
                                }
                            }
                        }
                    }
                    const minValue = Math.min(...botMoveArguments);
                    const minCardIndex = G.publicPlayers[p].cards[config.suit].findIndex((card) => card.type !== RusCardTypes.HERO && card.points === minValue);
                    if (minCardIndex !== -1) {
                        moves.push({
                            move: MoveNames.DiscardSuitCardFromPlayerBoardMove,
                            args: [config.suit, p, minCardIndex],
                        });
                    }
                }
            }
        }
    }
    if (activeStageOfCurrentPlayer === Stages.DiscardCardFromBoard) {
        DiscardCardFromBoardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: MoveNames.DiscardCardMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (activeStageOfCurrentPlayer === Stages.PickDiscardCard) {
        PickDiscardCardProfit(G, ctx, botMoveArguments);
        moves.push({
            move: MoveNames.PickDiscardCardMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (ctx.numPlayers === 2) {
        if (activeStageOfCurrentPlayer === Stages.DiscardCard) {
            DiscardCardProfit(G, ctx, botMoveArguments);
            moves.push({
                move: MoveNames.DiscardCard2PlayersMove,
                args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
            });
        }
    }
    if (activeStageOfCurrentPlayer === Stages.PickCampCardHolda) {
        PickCampCardHoldaProfit(G, ctx, botMoveArguments);
        moves.push({
            move: MoveNames.ClickCampCardHoldaMove,
            args: [...botMoveArguments[Math.floor(Math.random() * botMoveArguments.length)]],
        });
    }
    if (moves.length === 0 && ctx.phase !== null) {
        // todo Fix for bot no moves if have artefact with not pick new hero and get artifact with get new hero (he can pick hero by it's action)
        console.log(`ALERT: bot has ${moves.length} moves.Phase: ${ctx.phase}`);
    }
    return moves;
};
/**
* <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
* <p>Применения:</p>
* <ol>
* <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
* </oL>
*
* @todo Саше: сделать описание функции и параметров.
* @param G
* @param ctx
* @returns
*/
export const iterations = (G, ctx) => {
    const maxIter = G.botData.maxIter;
    if (ctx.phase === Phases.PickCards) {
        const currentTavern = G.taverns[G.currentTavern];
        if (currentTavern.filter((card) => card !== null).length === 1) {
            return 1;
        }
        const cardIndex = currentTavern.findIndex((card) => card !== null), tavernCard = currentTavern[cardIndex];
        if (currentTavern.every((card) => card === null || (isCardNotAction(card) && tavernCard !== null && isCardNotAction(tavernCard)
            && card.suit === tavernCard.suit && CompareCards(card, tavernCard) === 0))) {
            return 1;
        }
        let efficientMovesCount = 0;
        for (let i = 0; i < currentTavern.length; i++) {
            const tavernCard = currentTavern[i];
            if (tavernCard === null) {
                continue;
            }
            if (currentTavern.some((card) => CompareCards(tavernCard, card) === -1)) {
                continue;
            }
            if (G.decks[0].length > 18) {
                if (tavernCard && isCardNotAction(tavernCard)) {
                    if (CompareCards(tavernCard, G.averageCards[tavernCard.suit]) === -1
                        && currentTavern.some((card) => card !== null
                            && CompareCards(card, G.averageCards[tavernCard.suit]) > -1)) {
                        continue;
                    }
                }
            }
            efficientMovesCount++;
            if (efficientMovesCount > 1) {
                return maxIter;
            }
        }
        if (efficientMovesCount === 1) {
            return 1;
        }
    }
    return maxIter;
};
/**
 * <h3>Возвращает цели игры для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для определения целей.</li>
 * </ol>
 *
 * @returns
 */
export const objectives = () => ({
    isEarlyGame: {
        checker: (G) => {
            return G.decks[0].length > 0;
        },
        weight: -100.0,
    },
    /*isWeaker: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] < top2 && top2 < top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.85 * top1);
            }
            return false;
        },
        weight: 0.01,
    },*/
    /*isSecond: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] === top2 && top2 < top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.90 * top1);
            }
            return false;
        },
        weight: 0.1,
    },*/
    /*isEqual: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length))
            {
                return false;
            }
            if (G.taverns[0].some(card => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                totalScore.push(Scoring(G.publicPlayers[i]));
            }
            const [top1, top2]: number[] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] < top2 && top2 === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(0.90 * top1);
            }
            return false;

        },
        weight: 0.1,
    },*/
    isFirst: {
        checker: (G, ctx) => {
            if (ctx.phase !== Phases.PickCards) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some((card) => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(1.05 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
    isStronger: {
        checker: (G, ctx) => {
            if (ctx.phase !== Phases.PickCards) {
                return false;
            }
            if (G.decks[G.decks.length - 1].length < (G.botData.deckLength - 2 * G.tavernsNum * G.taverns[0].length)) {
                return false;
            }
            if (G.taverns[0].some((card) => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                totalScore.push(CurrentScoring(G.publicPlayers[i]));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2);
            if (totalScore[Number(ctx.currentPlayer)] === top1) {
                return totalScore[Number(ctx.currentPlayer)] >= Math.floor(1.10 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
});
/**
 * <h3>ДОБАВИТЬ ОПИСАНИЕ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>ДОБАВИТЬ ПРИМЕНЕНИЯ.</li>
 * </oL>
 *
 * @todo Саше: сделать описание функции и параметров.
 * @param G
 * @param ctx
 * @returns
 */
export const playoutDepth = (G, ctx) => {
    if (G.decks[G.decks.length - 1].length < G.botData.deckLength) {
        return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 20;
    }
    return 3 * G.tavernsNum * G.taverns[0].length + 4 * ctx.numPlayers + 2;
};
