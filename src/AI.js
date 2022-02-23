import { CompareCards } from "./bot_logic/BotCardLogic";
import { isCardNotActionAndNotNull } from "./Card";
import { GetValidator } from "./MoveValidator";
import { CurrentScoring } from "./Score";
import { ConfigNames, Phases, Stages } from "./typescript/enums";
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
    var _a;
    const moves = [];
    let playerId;
    if (ctx.phase !== null) {
        const currentStage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)];
        let activeStageOfCurrentPlayer = currentStage !== undefined ? currentStage : `default`;
        if (activeStageOfCurrentPlayer === `default`) {
            if (ctx.phase === Phases.PlaceCoins) {
                activeStageOfCurrentPlayer = Stages.Default3;
            }
            else if (ctx.phase === Phases.PlaceCoinsUline) {
                // TODO Add BotPlaceCoinUline and others moves only for bots?!
                activeStageOfCurrentPlayer = Stages.Default1;
            }
            else if (ctx.phase === Phases.PickCards) {
                if (ctx.activePlayers === null) {
                    let pickCardOrCampCard = `card`;
                    if (G.expansions.thingvellir.active
                        && (ctx.currentPlayer === G.publicPlayersOrder[0]
                            || (!G.campPicked
                                && Boolean(G.publicPlayers[Number(ctx.currentPlayer)].buffs
                                    .find((buff) => buff.goCamp !== undefined))))) {
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
                    activeStageOfCurrentPlayer = Stages.DiscardSuitCard;
                    // TODO Bot can't do async turns...?
                    const config = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].config;
                    if (config !== undefined && config.suit !== undefined) {
                        for (let p = 0; p < G.publicPlayers.length; p++) {
                            if (p !== Number(ctx.currentPlayer) && G.publicPlayers[p].stack[0] !== undefined) {
                                playerId = p;
                                break;
                            }
                        }
                    }
                }
            }
            else if (ctx.phase === Phases.EnlistmentMercenaries) {
                if (G.drawProfit === ConfigNames.StartOrPassEnlistmentMercenaries) {
                    if (G.publicPlayersOrder.length === 1 || Math.floor(Math.random() * 2) === 0) {
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
            else if (ctx.phase === Phases.EndTier) {
                activeStageOfCurrentPlayer = Stages.Default1;
            }
            else if (ctx.phase === Phases.GetDistinctions) {
                activeStageOfCurrentPlayer = Stages.Default1;
            }
            else if (ctx.phase === Phases.BrisingamensEndGame) {
                activeStageOfCurrentPlayer = Stages.Default1;
            }
            else if (ctx.phase === Phases.GetMjollnirProfit) {
                activeStageOfCurrentPlayer = Stages.Default1;
            }
        }
        if (activeStageOfCurrentPlayer !== `default`) {
            // TODO Add smart bot logic to get move arguments from getValue() (now it's random move mostly)
            const validator = GetValidator(ctx.phase, activeStageOfCurrentPlayer);
            if (validator !== null) {
                const moveName = validator.moveName, moveRangeData = validator.getRange(G, ctx, playerId), moveValue = validator.getValue(G, ctx, moveRangeData);
                let moveValues = [];
                if (typeof moveValue === `number`) {
                    moveValues = [moveValue];
                }
                else if (typeof moveValue === `string`) {
                    moveValues = [moveValue];
                }
                else if (typeof moveValue === `object` && !Array.isArray(moveValue) && moveValue !== null) {
                    if (`coinId` in moveValue) {
                        moveValues = [moveValue.coinId, moveValue.type, moveValue.isInitial];
                    }
                    else if (`playerId` in moveValue) {
                        moveValues = [moveValue.suit, moveValue.playerId, moveValue.cardId];
                    }
                    else if (`suit` in moveValue) {
                        moveValues = [moveValue.suit, moveValue.cardId];
                    }
                }
                else if (moveValue === null) {
                    moveValues = [];
                }
                else if (Array.isArray(moveValue)) {
                    moveValues = [moveValue];
                }
                moves.push({
                    move: moveName,
                    args: moveValues,
                });
            }
            if (moves.length === 0) {
                console.log(`ALERT: bot has ${moves.length} moves.Phase: ${ctx.phase}`);
            }
        }
        else {
            throw new Error(`Variable 'activeStageOfCurrentPlayer' can't be 'default'.`);
        }
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
        if (currentTavern.every((card) => card === null || (isCardNotActionAndNotNull(card) && isCardNotActionAndNotNull(tavernCard)
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
                if (isCardNotActionAndNotNull(tavernCard)) {
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