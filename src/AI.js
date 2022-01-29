import { CompareCards } from "./bot_logic/BotCardLogic";
import { isCardNotAction } from "./Card";
import { moveBy, moveValidators } from "./MoveValidator";
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
    // TODO Fix it, now just for bot can do RANDOM move
    const moves = [];
    let activeStageOfCurrentPlayer = (_b = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) !== null && _b !== void 0 ? _b : `default`;
    if (activeStageOfCurrentPlayer === `default`) {
        if (ctx.phase === Phases.PlaceCoins) {
            activeStageOfCurrentPlayer = Stages.Default3;
        }
        else if (ctx.phase === Phases.PlaceCoinsUline) {
            // TODO BotPlaceCoinUline
            if (G.publicPlayers[Number(ctx.currentPlayer)].selectedCoin !== undefined) {
                activeStageOfCurrentPlayer = Stages.Default1;
            }
            else {
                activeStageOfCurrentPlayer = Stages.Default2;
                // TODO Fix this: args: [G.currentTavern + 1]
            }
        }
        else if (ctx.phase === Phases.PickCards) {
            if (ctx.activePlayers === null) {
                let pickCardOrCampCard = `card`;
                if (G.expansions.thingvellir.active
                    && (ctx.currentPlayer === G.publicPlayersOrder[0]
                        || (!G.campPicked
                            && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)))) {
                    pickCardOrCampCard = Math.floor(Math.random() * 2) ? `card` : `camp`;
                }
                if (pickCardOrCampCard === `card`) {
                    activeStageOfCurrentPlayer = Stages.Default1;
                }
                else {
                    activeStageOfCurrentPlayer = Stages.Default2;
                }
            }
            else {
                // TODO Fix this (only for quick bot actions)
                // TODO Bot can't do async turns...?
                // TODO Move it to ProfitHelpers
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
                                                // G.currentMoveArguments.push(points);
                                            }
                                        }
                                    }
                                }
                            }
                            const minValue = Math.min(...G.currentMoveArguments);
                            const minCardIndex = G.publicPlayers[p].cards[config.suit].findIndex((card) => card.type !== RusCardTypes.HERO && card.points === minValue);
                            if (minCardIndex !== -1) {
                                // moves.push({
                                //     move: MoveNames.DiscardSuitCardFromPlayerBoardMove,
                                //     args: [config.suit, p, minCardIndex],
                                // });
                                break;
                            }
                        }
                    }
                }
            }
        }
        else if (ctx.phase === Phases.EnlistmentMercenaries) {
            if (G.drawProfit === ConfigNames.StartOrPassEnlistmentMercenaries) {
                if (Math.floor(Math.random() * G.currentMoveArguments.length) === 0) {
                    activeStageOfCurrentPlayer = Stages.Default1;
                }
                else {
                    activeStageOfCurrentPlayer = Stages.Default2;
                }
            }
            else if (G.drawProfit === ConfigNames.EnlistmentMercenaries) {
                activeStageOfCurrentPlayer = Stages.Default3;
            }
            else if (G.drawProfit === ConfigNames.PlaceEnlistmentMercenaries) {
                activeStageOfCurrentPlayer = Stages.Default4;
            }
        }
    }
    else {
        if (activeStageOfCurrentPlayer === Stages.PlaceTradingCoinsUline) {
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
    }
    // TODO Add smart bot logic to get move arguments from getValue() (now it's random move mostly)
    const moveName = moveBy[ctx.phase][activeStageOfCurrentPlayer], moveValue = moveValidators[moveName].getValue(G, ctx);
    let moveValues = [];
    if (typeof moveValue === `number`) {
        moveValues = [moveValue];
    }
    else if (typeof moveValue === `string`) {
        moveValues = [moveValue];
    }
    else if (typeof moveValue === `object` && !Array.isArray(moveValue) && moveValue !== null) {
        if (`suit` in moveValue) {
            moveValues = [moveValue.suit, moveValue.cardId];
        }
        else if (`coinId` in moveValue) {
            moveValues = [moveValue.coinId, moveValue.type, moveValue.isInitial];
        }
    }
    else if (moveValue === null) {
        moveValues = [];
    }
    moves.push({
        move: moveName,
        args: moveValues,
    });
    if (moves.length === 0 && ctx.phase !== null) {
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
* @TODO Саше: сделать описание функции и параметров.
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
 * @TODO Саше: сделать описание функции и параметров.
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
//# sourceMappingURL=AI.js.map