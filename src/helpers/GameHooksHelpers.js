import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { BuffNames, ErrorNames, HeroNames, LogTypeNames, PhaseNames, RusCardTypeNames } from "../typescript/enums";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { CheckPickHero } from "./HeroHelpers";
/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const AfterLastTavernEmptyActions = (G, ctx) => {
    const isLastRound = ctx.numPlayers < 4 ? ((G.round === 3 || G.round === 6) ? true : false) :
        ((G.round === 2 || G.round === 5) ? true : false), currentDeck = G.secret.decks[G.secret.decks.length - G.tierToEnd - Number(isLastRound)];
    if (currentDeck === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentTierDeckIsUndefined);
    }
    if (currentDeck.length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G, ctx);
        }
        else {
            return StartEndTierPhaseOrEndGameLastActions(G, ctx);
        }
    }
    else {
        return PhaseNames.Bids;
    }
};
/**
 * <h3>Проверяет необходимость начала фазы 'getMjollnirProfit'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'getMjollnirProfit'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const StartGetMjollnirProfitPhase = (G) => {
    const buffIndex = Object.values(G.publicPlayers).findIndex((playerB) => CheckPlayerHasBuff(playerB, BuffNames.GetMjollnirProfit));
    if (buffIndex !== -1) {
        return PhaseNames.GetMjollnirProfit;
    }
};
/**
 * <h3>Проверяет необходимость начала фазы 'Ставки Улина' или фазы 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'Ставки Улина' или фаза 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const StartBidUlineOrTavernsResolutionPhase = (G) => {
    const ulinePlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EveryTurn));
    if (!G.solo && ulinePlayerIndex !== -1) {
        return PhaseNames.BidUline;
    }
    else {
        return PhaseNames.TavernsResolution;
    }
};
/**
 * <h3>Проверяет необходимость начала фазы 'Ставки Улина' или фазы 'Посещение таверн' или фазы 'EndTier' или фазы конца игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'Ставки Улина' или фаза 'Посещение таверн' или фаза 'EndTier' или фазы конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartBidUlineOrTavernsResolutionOrEndTierPhaseOrEndGameLastActionsPhase = (G, ctx) => {
    const isLastTavern = G.tavernsNum - 1 === G.currentTavern;
    if (isLastTavern) {
        return AfterLastTavernEmptyActions(G, ctx);
    }
    else {
        return StartBidUlineOrTavernsResolutionPhase(G);
    }
};
/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения действий в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Название новой фазы игры.
 */
export const StartEndGameLastActions = (G, ctx) => {
    const deck1 = G.secret.decks[0], deck2 = G.secret.decks[1];
    if (deck1 === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 0);
    }
    if (deck2 === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.DeckIsUndefined, 1);
    }
    if (!deck1.length && deck2.length) {
        return PhaseNames.TroopEvaluation;
    }
    else {
        if (G.expansions.thingvellir.active) {
            const brisingamensBuffIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
            if (brisingamensBuffIndex !== -1) {
                return PhaseNames.BrisingamensEndGame;
            }
            const mjollnirBuffIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
            if (mjollnirBuffIndex !== -1) {
                return PhaseNames.GetMjollnirProfit;
            }
        }
    }
};
/**
* <h3>Проверка начала фазы 'Поместить Труд' или фазы конца игры.</h3>
* <p>Применения:</p>
* <ol>
* <li>После завершения всех карт в деке каждой эпохи.</li>
* <li>После завершения фазы 'enlistmentMercenaries'.</li>
* </ol>
*
* @param G
* @param ctx
* @returns
*/
export const StartEndTierPhaseOrEndGameLastActions = (G, ctx) => {
    const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
    if (yludIndex !== -1) {
        return PhaseNames.PlaceYlud;
    }
    else {
        return StartEndGameLastActions(G, ctx);
    }
};
/**
 * <h3>Проверяет есть ли у игроков наёмники для начала их вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии у игроков наёмников в конце текущей эпохи.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
const CheckEnlistmentMercenaries = (G, ctx) => {
    let count = false;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (player.campCards.filter((card) => card.type === RusCardTypeNames.Mercenary_Card).length) {
            count = true;
            break;
        }
    }
    if (count) {
        return PhaseNames.EnlistmentMercenaries;
    }
    else {
        return StartEndTierPhaseOrEndGameLastActions(G, ctx);
    }
};
/**
 * <h3>Действия очистки выбранной карты игроком при завершении хода в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в любой фазе.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const ClearPlayerPickedCard = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
};
/**
 * <h3>Завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фаз конца игры.</li>
 * </ol>
 *
 * @param ctx
 */
export const EndGame = (ctx) => {
    var _a;
    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endGame();
};
/**
 * <h3>Проверяет необходимость завершения хода в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверке завершения любой фазы.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const EndTurnActions = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (!player.stack.length) {
        return true;
    }
};
/**
 * <h3>Удаляет Труд в конце игры с поля игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце матча после всех игровых событий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G, ctx) => {
    const thrudPlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.MoveThrud));
    if (thrudPlayerIndex !== -1) {
        const player = G.publicPlayers[thrudPlayerIndex];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, thrudPlayerIndex);
        }
        const playerCards = Object.values(player.cards).flat(), thrud = playerCards.find((card) => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex = player.cards[thrud.suit].findIndex((card) => card.name === HeroNames.Thrud);
            if (thrudIndex === -1) {
                throw new Error(`У игрока с id '${thrudPlayerIndex}' отсутствует обязательная карта героя '${HeroNames.Thrud}'.`);
            }
            player.cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypeNames.Game, `Герой '${HeroNames.Thrud}' игрока '${player.nickname}' уходит с игрового поля.`);
        }
    }
};
/**
 * <h3>Действия старта или завершения действий при завершении мува в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в любой фазе.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartOrEndActions = (G, ctx) => {
    var _a, _b, _c, _d;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (ctx.activePlayers === null || ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) !== undefined) {
        player.stack.shift();
        // TODO Fix all if (stack === undefined) { throw new Error(`В массиве стека действий игрока отсутствует '0' действие.`); }
        if ((((_b = player.stack[0]) === null || _b === void 0 ? void 0 : _b.priority) === undefined)
            || (((_c = player.stack[0]) === null || _c === void 0 ? void 0 : _c.priority) !== undefined && ((_d = player.stack[0]) === null || _d === void 0 ? void 0 : _d.priority) > 1)) {
            CheckPickHero(G, ctx);
        }
        DrawCurrentProfit(G, ctx);
    }
};
//# sourceMappingURL=GameHooksHelpers.js.map