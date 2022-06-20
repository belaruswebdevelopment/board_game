import { IsMercenaryCampCard } from "../Camp";
import { AddDataToLog } from "../Logging";
import { BuffNames, HeroNames, LogTypes, Phases } from "../typescript/enums";
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
    const deck = G.secret.decks[G.secret.decks.length - G.tierToEnd];
    if (deck === undefined) {
        throw new Error(`Отсутствует колода карт текущей эпохи '${G.secret.decks.length - G.tierToEnd}'.`);
    }
    if (deck.length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G, ctx);
        }
        else {
            return StartEndTierPhaseOrEndGameLastActions(G);
        }
    }
    else {
        return Phases.PlaceCoins;
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
        return Phases.GetMjollnirProfit;
    }
};
/**
 * <h3>Проверяет необходимость начала фазы 'placeCoinsUline' или фазы 'pickCards'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'placeCoinsUline' или фаза 'pickCards'.</li>
 * </ol>
 *
 * @param G
 * @returns
 */
export const StartPlaceCoinsUlineOrPickCardsPhase = (G) => {
    const ulinePlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EveryTurn));
    if (!G.solo && ulinePlayerIndex !== -1) {
        return Phases.PlaceCoinsUline;
    }
    else {
        return Phases.PickCards;
    }
};
/**
 * <h3>Проверяет необходимость начала фазы 'placeCoinsUline' или фазы 'pickCards' или фазы 'EndTier' или фазы конца игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'placeCoinsUline' или фаза 'pickCards' или фаза 'EndTier' или фазы конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartPlaceCoinsUlineOrPickCardsOrEndTierPhaseOrEndGameLastActionsPhase = (G, ctx) => {
    const isLastTavern = G.tavernsNum - 1 === G.currentTavern;
    if (isLastTavern) {
        return AfterLastTavernEmptyActions(G, ctx);
    }
    else {
        return StartPlaceCoinsUlineOrPickCardsPhase(G);
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
 * @returns
 */
export const StartEndGameLastActions = (G) => {
    const deck1 = G.secret.decks[0], deck2 = G.secret.decks[1];
    if (deck1 === undefined) {
        throw new Error(`Отсутствует колода карт '1' эпохи.`);
    }
    if (deck2 === undefined) {
        throw new Error(`Отсутствует колода карт '2' эпохи.`);
    }
    if (!deck1.length && deck2.length) {
        return Phases.GetDistinctions;
    }
    else {
        if (G.expansions.thingvellir.active) {
            const brisingamensBuffIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.DiscardCardEndGame));
            if (brisingamensBuffIndex !== -1) {
                return Phases.BrisingamensEndGame;
            }
            const mjollnirBuffIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.GetMjollnirProfit));
            if (mjollnirBuffIndex !== -1) {
                return Phases.GetMjollnirProfit;
            }
        }
    }
};
/**
* <h3>Проверка начала фазы 'endTier' или фазы конца игры.</h3>
* <p>Применения:</p>
* <ol>
* <li>После завершения всех карт в деке каждой эпохи.</li>
* <li>После завершения фазы 'enlistmentMercenaries'.</li>
* </ol>
*
* @param G
* @returns
*/
export const StartEndTierPhaseOrEndGameLastActions = (G) => {
    const yludIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.EndTier));
    if (yludIndex !== -1) {
        return Phases.EndTier;
    }
    else {
        return StartEndGameLastActions(G);
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
            throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
        }
        if (player.campCards.filter((card) => IsMercenaryCampCard(card)).length) {
            count = true;
            break;
        }
    }
    if (count) {
        return Phases.EnlistmentMercenaries;
    }
    else {
        return StartEndTierPhaseOrEndGameLastActions(G);
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
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    player.pickedCard = null;
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
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    if (!player.stack.length && !player.actionsNum) {
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
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G) => {
    const thrudPlayerIndex = Object.values(G.publicPlayers).findIndex((player) => CheckPlayerHasBuff(player, BuffNames.MoveThrud));
    if (thrudPlayerIndex !== -1) {
        const player = G.publicPlayers[thrudPlayerIndex];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${thrudPlayerIndex}'.`);
        }
        const playerCards = Object.values(player.cards).flat(), thrud = playerCards.find((card) => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex = player.cards[thrud.suit].findIndex((card) => card.name === HeroNames.Thrud);
            if (thrudIndex === -1) {
                throw new Error(`У игрока с id '${thrudPlayerIndex}' отсутствует обязательная карта героя '${HeroNames.Thrud}'.`);
            }
            player.cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypes.Game, `Герой '${HeroNames.Thrud}' игрока '${player.nickname}' уходит с игрового поля.`);
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
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует ${G.solo && ctx.currentPlayer === `1` ? `соло бот` : `текущий игрок`} с id '${ctx.currentPlayer}'.`);
    }
    // TODO Why i need it?!
    if (player.actionsNum) {
        player.actionsNum--;
    }
    if (ctx.activePlayers === null || ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) !== undefined) {
        player.stack.shift();
        CheckPickHero(G, ctx);
        DrawCurrentProfit(G, ctx);
    }
};
//# sourceMappingURL=GameHooksHelpers.js.map