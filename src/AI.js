import { CompareCards } from "./bot_logic/BotCardLogic";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { GetValidator } from "./MoveValidator";
import { CurrentScoring } from "./Score";
import { BuffNames, ConfigNames, ErrorNames, GameModeNames, PhaseNames, RusCardTypeNames, StageNames } from "./typescript/enums";
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
    const moves = [], player = G.publicPlayers[Number(ctx.currentPlayer)];
    let playerId;
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const phase = ctx.phase;
    if (phase !== null) {
        // TODO Add MythologicalCreature moves
        const currentStage = (_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)];
        let activeStageOfCurrentPlayer = currentStage !== null && currentStage !== void 0 ? currentStage : `default`;
        if (activeStageOfCurrentPlayer === `default`) {
            let _exhaustiveCheck;
            switch (phase) {
                case PhaseNames.ChooseDifficultySoloMode:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.ChooseDifficultySoloModeAndvari:
                    if (G.soloGameAndvariStrategyVariantLevel === null) {
                        activeStageOfCurrentPlayer = StageNames.default1;
                    }
                    else if (G.soloGameAndvariStrategyLevel === null) {
                        activeStageOfCurrentPlayer = StageNames.default2;
                    }
                    break;
                case PhaseNames.Bids:
                    switch (G.mode) {
                        case GameModeNames.Basic:
                        case GameModeNames.Multiplayer:
                            activeStageOfCurrentPlayer = StageNames.default3;
                            break;
                        case GameModeNames.Solo1:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = StageNames.default3;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = StageNames.default4;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре.`);
                            }
                            break;
                        case GameModeNames.SoloAndvari:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = StageNames.default3;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = StageNames.default5;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре Андвари.`);
                            }
                            break;
                        default:
                            _exhaustiveCheck = G.mode;
                            throw new Error(`Нет такого режима игры.`);
                            return _exhaustiveCheck;
                    }
                    break;
                case PhaseNames.BidUline:
                    // TODO Add BotPlaceCoinUline and others moves only for bots?!
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.TavernsResolution:
                    switch (G.mode) {
                        case GameModeNames.Basic:
                        case GameModeNames.Multiplayer:
                            if (ctx.activePlayers === null) {
                                let pickCardOrCampCard = `card`;
                                if (G.expansions.thingvellir.active && (ctx.currentPlayer === G.publicPlayersOrder[0]
                                    || (!G.campPicked && CheckPlayerHasBuff(player, BuffNames.GoCamp)))) {
                                    pickCardOrCampCard = Math.floor(Math.random() * 2) ? `card` : `camp`;
                                }
                                if (pickCardOrCampCard === `card`) {
                                    activeStageOfCurrentPlayer = StageNames.default1;
                                }
                                else {
                                    activeStageOfCurrentPlayer = StageNames.default2;
                                }
                            }
                            break;
                        case GameModeNames.Solo1:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = StageNames.default1;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = StageNames.default3;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре.`);
                            }
                            break;
                        case GameModeNames.SoloAndvari:
                            if (ctx.currentPlayer === `0`) {
                                activeStageOfCurrentPlayer = StageNames.default1;
                            }
                            else if (ctx.currentPlayer === `1`) {
                                activeStageOfCurrentPlayer = StageNames.default4;
                            }
                            else {
                                throw new Error(`Не может быть игроков больше 2-х в соло игре Андвари.`);
                            }
                            break;
                        default:
                            _exhaustiveCheck = G.mode;
                            throw new Error(`Нет такого режима игры.`);
                            return _exhaustiveCheck;
                    }
                    break;
                case PhaseNames.EnlistmentMercenaries:
                    if (G.drawProfit === ConfigNames.StartOrPassEnlistmentMercenaries) {
                        if (G.publicPlayersOrder.length === 1 || Math.floor(Math.random() * 2) === 0) {
                            activeStageOfCurrentPlayer = StageNames.default1;
                        }
                        else {
                            activeStageOfCurrentPlayer = StageNames.default2;
                        }
                    }
                    else if (G.drawProfit === null) {
                        activeStageOfCurrentPlayer = StageNames.default3;
                    }
                    break;
                case PhaseNames.PlaceYlud:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.TroopEvaluation:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.BrisingamensEndGame:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                case PhaseNames.GetMjollnirProfit:
                    activeStageOfCurrentPlayer = StageNames.default1;
                    break;
                default:
                    _exhaustiveCheck = phase;
                    throw new Error(`Нет такой фазы.`);
                    return _exhaustiveCheck;
            }
            if (ctx.activePlayers !== null) {
                activeStageOfCurrentPlayer = StageNames.discardSuitCard;
                // TODO Bot can't do async turns...?
                for (let p = 0; p < ctx.numPlayers; p++) {
                    const playerP = G.publicPlayers[p];
                    if (playerP === undefined) {
                        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, p);
                    }
                    if (p !== Number(ctx.currentPlayer) && playerP.stack[0] !== undefined) {
                        playerId = p;
                        break;
                    }
                }
            }
        }
        if (activeStageOfCurrentPlayer === `default`) {
            throw new Error(`Variable 'activeStageOfCurrentPlayer' can't be 'default'.`);
        }
        // TODO Add smart bot logic to get move arguments from getValue() (now it's random move mostly)
        const validator = GetValidator(phase, activeStageOfCurrentPlayer);
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
                    moveValues = [moveValue.coinId, moveValue.type];
                }
                else if (`suit` in moveValue) {
                    moveValues = [moveValue.suit, moveValue.cardId];
                }
                else if (`playerId` in moveValue) {
                    moveValues = [moveValue.cardId];
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
            console.log(`ALERT: bot has '${moves.length}' moves. Phase: '${phase}'.`);
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
* @returns Итерации.
*/
export const iterations = (G, ctx) => {
    const maxIter = G.botData.maxIter;
    if (ctx.phase === PhaseNames.TavernsResolution) {
        const currentTavern = G.taverns[G.currentTavern];
        if (currentTavern.filter((card) => card !== null).length === 1) {
            return 1;
        }
        const cardIndex = currentTavern.findIndex((card) => card !== null), tavernNotNullCard = currentTavern[cardIndex];
        if (tavernNotNullCard === undefined) {
            throw new Error(`Отсутствует карта с id '${cardIndex}' в текущей таверне '1'.`);
        }
        if (currentTavern.every((card) => card === null || (card.type === RusCardTypeNames.Dwarf_Card && tavernNotNullCard !== null
            && tavernNotNullCard.type === RusCardTypeNames.Dwarf_Card
            && card.suit === tavernNotNullCard.suit && CompareCards(card, tavernNotNullCard) === 0))) {
            return 1;
        }
        let efficientMovesCount = 0;
        for (let i = 0; i < currentTavern.length; i++) {
            const tavernCard = currentTavern[i];
            if (tavernCard === undefined) {
                throw new Error(`Отсутствует карта с id '${cardIndex}' в текущей таверне '2'.`);
            }
            if (tavernCard === null) {
                continue;
            }
            if (currentTavern.some((card) => CompareCards(tavernCard, card) === -1)) {
                continue;
            }
            const deck0 = G.secret.decks[0];
            if (deck0.length > 18) {
                if (tavernCard.type === RusCardTypeNames.Dwarf_Card) {
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
// TODO Move same logic in one place?!
/**
 * <h3>Возвращает цели игры для ботов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется ботами для определения целей.</li>
 * </ol>
 *
 * @returns Цели.
 */
export const objectives = () => ({
    isEarlyGame: {
        checker: (G) => G.secret.decks[0].length > 0,
        weight: -100.0,
    },
    // TODO Move same logic in one func?!
    /* isWeaker: {
        checker: (G: IMyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const tavern0: CanBeNullType<DeckCardTypes>[] = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(player));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndef<number> = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer < top2 && top2 < top1) {
                return totalScoreCurPlayer >= Math.floor(0.85 * top1);
            }
            return false;
        },
        weight: 0.01,
    }, */
    /* isSecond: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const tavern0: CanBeNullType<DeckCardTypes>[] = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(player));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndef<number> = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer === top2 && top2 < top1) {
                return totalScoreCurPlayer >= Math.floor(0.90 * top1);
            }
            return false;
        },
        weight: 0.1,
    }, */
    /* isEqual: {
        checker: (G: MyGameState, ctx: Ctx): boolean => {
            if (ctx.phase !== Phases.PlaceCoins) {
                return false;
            }
            const tavern0: CanBeNullType<DeckCardTypes>[] = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card: TavernCardTypes): boolean => card === null)) {
                return false;
            }
            const totalScore: number[] = [];
            for (let i: number = 0; i < ctx.numPlayers; i++) {
                const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(player));
            }
            const [top1, top2]: number[] =
                totalScore.sort((a: number, b: number): number => b - a).slice(0, 2),
                totalScoreCurPlayer: CanBeUndef<number> = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer < top2 && top2 === top1) {
                return totalScoreCurPlayer >= Math.floor(0.90 * top1);
            }
            return false;

        },
        weight: 0.1,
    }, */
    isFirst: {
        checker: (G, ctx) => {
            if (ctx.phase !== PhaseNames.TavernsResolution) {
                return false;
            }
            const tavern0 = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card) => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(G, player));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2), totalScoreCurPlayer = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer === top1) {
                if (top2 === undefined) {
                    throw new Error(`В массиве общего счёта отсутствует счёт топ '2' игрока.`);
                }
                return totalScoreCurPlayer >= Math.floor(1.05 * top2);
            }
            return false;
        },
        weight: 0.5,
    },
    isStronger: {
        checker: (G, ctx) => {
            if (ctx.phase !== PhaseNames.TavernsResolution) {
                return false;
            }
            const tavern0 = G.taverns[0];
            if (G.secret.decks[1].length < (G.botData.deckLength - 2 * G.tavernsNum * tavern0.length)) {
                return false;
            }
            if (tavern0.some((card) => card === null)) {
                return false;
            }
            const totalScore = [];
            for (let i = 0; i < ctx.numPlayers; i++) {
                const player = G.publicPlayers[i];
                if (player === undefined) {
                    return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
                }
                totalScore.push(CurrentScoring(G, player));
            }
            const [top1, top2] = totalScore.sort((a, b) => b - a).slice(0, 2), totalScoreCurPlayer = totalScore[Number(ctx.currentPlayer)];
            if (totalScoreCurPlayer === undefined) {
                throw new Error(`В массиве общего счёта отсутствует счёт текущего игрока с id '${ctx.currentPlayer}'.`);
            }
            if (totalScoreCurPlayer === top1) {
                if (top2 === undefined) {
                    throw new Error(`В массиве общего счёта отсутствует счёт топ '2' игрока.`);
                }
                return totalScoreCurPlayer >= Math.floor(1.10 * top2);
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
 * @returns Глубина.
 */
export const playoutDepth = (G, ctx) => {
    const tavern0 = G.taverns[0];
    if (G.secret.decks[1].length < G.botData.deckLength) {
        return 3 * G.tavernsNum * tavern0.length + 4 * ctx.numPlayers + 20;
    }
    return 3 * G.tavernsNum * tavern0.length + 4 * ctx.numPlayers + 2;
};
//# sourceMappingURL=AI.js.map