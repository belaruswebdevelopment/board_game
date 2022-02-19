import { IsMercenaryCard } from "../Camp";
import { AddDataToLog } from "../Logging";
import { HeroNames, LogTypes, Phases, Stages } from "../typescript/enums";
import { DrawCurrentProfit } from "./ActionHelpers";
/**
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @param G
 * @param ctx
 */
export const AfterLastTavernEmptyActions = (G) => {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G);
        }
        else {
            return CheckEndTierActionsOrEndGameLastActions(G);
        }
    }
    else {
        return {
            next: Phases.PlaceCoins,
        };
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
 */
export const CheckAndStartPlaceCoinsUlineOrPickCardsPhase = (G) => {
    const ulinePlayerIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.everyTurn !== undefined)));
    if (ulinePlayerIndex !== -1) {
        return {
            next: Phases.PlaceCoinsUline,
        };
    }
    else {
        return {
            next: Phases.PickCards,
        };
    }
};
/**
 * <h3>Проверяет необходимость старта действий по выкладке монет при наличии героя Улина.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckAndStartUlineActionsOrContinue = (G, ctx) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)], ulinePlayerIndex = G.publicPlayers.findIndex((findPlayer) => Boolean(findPlayer.buffs.find((buff) => buff.everyTurn !== undefined)));
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin = player.boardCoins[G.currentTavern];
            if (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) {
                const tradingCoinPlacesLength = player.boardCoins.filter((coin, index) => index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) !== Stages.PlaceTradingCoinsUline
                        && tradingCoinPlacesLength === 2) {
                        const handCoinsLength = player.handCoins.filter((coin) => coin !== null).length;
                        player.actionsNum =
                            G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum : handCoinsLength;
                    }
                }
            }
        }
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
 */
export const CheckEndGameLastActions = (G) => {
    if (!G.decks[0].length && G.decks[1].length) {
        return {
            next: Phases.GetDistinctions,
        };
    }
    else {
        if (G.expansions.thingvellir.active) {
            const brisingamensBuffIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.discardCardEndGame !== undefined)));
            if (brisingamensBuffIndex !== -1) {
                return {
                    next: Phases.BrisingamensEndGame,
                };
            }
            const mjollnirBuffIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.getMjollnirProfit !== undefined)));
            if (mjollnirBuffIndex !== -1) {
                return {
                    next: Phases.GetMjollnirProfit,
                };
            }
        }
        return true;
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
* @param ctx
*/
export const CheckEndTierActionsOrEndGameLastActions = (G) => {
    const yludIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.find((buff) => buff.endTier !== undefined)));
    if (yludIndex !== -1) {
        return {
            next: Phases.EndTier,
        };
    }
    else {
        return CheckEndGameLastActions(G);
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
 * @param ctx
 */
const CheckEnlistmentMercenaries = (G) => {
    let count = false;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards.filter((card) => IsMercenaryCard(card)).length) {
            count = true;
            break;
        }
    }
    if (count) {
        return {
            next: Phases.EnlistmentMercenaries,
        };
    }
    else {
        return CheckEndTierActionsOrEndGameLastActions(G);
    }
};
export const ClearPlayerPickedCard = (G, ctx) => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = null;
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
export const EndTurnActions = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
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
 * @param ctx
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = (G, ctx) => {
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i], playerCards = Object.values(player.cards).flat(), thrud = playerCards.find((card) => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex = player.cards[thrud.suit].findIndex((card) => card.name === HeroNames.Thrud);
            player.cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog(G, LogTypes.GAME, `Герой Труд игрока ${player.nickname} уходит с игрового поля.`);
        }
    }
};
export const StartOrEndActions = (G, ctx) => {
    var _a;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player.actionsNum) {
        player.actionsNum--;
    }
    if (ctx.activePlayers === null
        || ctx.activePlayers !== null && ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(ctx.currentPlayer)]) !== undefined) {
        player.stack.shift();
        DrawCurrentProfit(G, ctx);
    }
};
//# sourceMappingURL=GameHooksHelpers.js.map