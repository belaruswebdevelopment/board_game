import { RemoveThrudFromPlayerBoardAfterGameEnd } from "../Hero";
import { DrawNames, HeroNames, Phases, RusCardTypes, Stages } from "../typescript/enums";
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
    var _a, _b;
    (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.endPhase();
    (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.endGame();
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
    const ulinePlayerIndex = G.publicPlayers.findIndex((player) => player.buffs.everyTurn === HeroNames.Uline);
    if (ulinePlayerIndex !== -1) {
        if (ulinePlayerIndex === Number(ctx.currentPlayer)) {
            const coin = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins[G.currentTavern];
            if (coin === null || coin === void 0 ? void 0 : coin.isTriggerTrading) {
                const tradingCoinPlacesLength = G.publicPlayers[Number(ctx.currentPlayer)].boardCoins
                    .filter((coin, index) => index >= G.tavernsNum && coin === null).length;
                if (tradingCoinPlacesLength > 0) {
                    if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[ctx.currentPlayer]) !== Stages.PlaceTradingCoinsUline
                        && tradingCoinPlacesLength === 2) {
                        const handCoinsLength = G.publicPlayers[Number(ctx.currentPlayer)]
                            .handCoins.filter((coin) => coin !== null).length;
                        G.actionsNum = G.suitsNum - G.tavernsNum <= handCoinsLength ? G.suitsNum - G.tavernsNum :
                            handCoinsLength;
                    }
                }
            }
        }
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
    const ulinePlayerIndex = G.publicPlayers
        .findIndex((player) => player.buffs.everyTurn === HeroNames.Uline);
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
 * <h3>Выполняет основные действия после того как опустела последняя таверна.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После того как опустела последняя таверна.</li>
 * </oL>
 *
 * @param G
 * @param ctx
 */
export const AfterLastTavernEmptyActions = (G, ctx) => {
    if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
        if (G.expansions.thingvellir.active) {
            return CheckEnlistmentMercenaries(G, ctx);
        }
        else {
            return CheckEndTierActionsOrEndGameLastActions(G, ctx);
        }
    }
    else {
        return {
            next: Phases.PlaceCoins,
        };
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
const CheckEnlistmentMercenaries = (G, ctx) => {
    let count = false;
    for (let i = 0; i < G.publicPlayers.length; i++) {
        if (G.publicPlayers[i].campCards
            .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
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
        return CheckEndTierActionsOrEndGameLastActions(G, ctx);
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
export const CheckEndTierActionsOrEndGameLastActions = (G, ctx) => {
    const yludIndex = G.publicPlayers.findIndex((player) => player.buffs.endTier === DrawNames.Ylud);
    if (yludIndex !== -1) {
        return {
            next: Phases.EndTier,
        };
    }
    else {
        return CheckEndGameLastActions(G, ctx);
    }
};
/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения экшенов в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckEndGameLastActions = (G, ctx) => {
    if (!G.decks[0].length && G.decks[1].length) {
        return {
            next: Phases.GetDistinctions,
        };
    }
    else {
        if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
            console.log('ERRORS!');
            // TODO FIx it can't change G in endIf hooks
            RemoveThrudFromPlayerBoardAfterGameEnd(G, ctx);
        }
        let isNewPhase = false, buffIndex;
        if (G.expansions.thingvellir.active) {
            if (ctx.phase !== Phases.BrisingamensEndGame && ctx.phase !== Phases.GetMjollnirProfit) {
                buffIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.discardCardEndGame));
                if (buffIndex !== -1) {
                    isNewPhase = true;
                    return {
                        next: Phases.BrisingamensEndGame,
                    };
                }
            }
            if (ctx.phase !== Phases.GetMjollnirProfit && !isNewPhase) {
                buffIndex = G.publicPlayers.findIndex((player) => Boolean(player.buffs.getMjollnirProfit));
                if (buffIndex !== -1) {
                    isNewPhase = true;
                    return {
                        next: Phases.GetMjollnirProfit,
                    };
                }
            }
        }
        if (!isNewPhase) {
            EndGame(ctx);
        }
    }
};
//# sourceMappingURL=GameHooksHelpers.js.map