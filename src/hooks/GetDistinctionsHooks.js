import { RefillCamp } from "../Camp";
import { CheckDistinction } from "../Distinction";
/**
 * <h3>Определяет порядок получения преимуществ при начале фазы 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckAndResolveDistinctionOrders = (G, ctx) => {
    CheckDistinction(G, ctx);
    const distinctions = Object.values(G.distinctions).filter((distinction) => distinction !== null && distinction !== undefined);
    if (distinctions.every((distinction) => distinction !== null && distinction !== undefined)) {
        G.publicPlayersOrder = distinctions;
    }
};
/**
 * <h3>Проверяет необходимость завершения фазы 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом получении преимуществ в фазе 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
* @param ctx
 * @returns
 */
export const CheckEndDistinctionsPhase = (G, ctx) => {
    if (G.publicPlayersOrder.length) {
        if (!G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
            return Object.values(G.distinctions).every((distinction) => distinction === undefined);
        }
    }
};
/**
 * <h3>Проверяет необходимость завершения хода в фазе 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с наёмником в фазе 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckNextDistinctionTurn = (G, ctx) => {
    if (!G.publicPlayers[Number(ctx.currentPlayer)].stack.length) {
        return true;
    }
};
/**
 * <h3>Действия при завершении фазы 'getDistinctions'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'getDistinctions'.</li>
 * </ol>
 *
 * @param G
 */
export const EndDistinctionPhaseActions = (G) => {
    if (G.expansions.thingvellir.active) {
        RefillCamp(G);
    }
    G.publicPlayersOrder = [];
};
//# sourceMappingURL=GetDistinctionsHooks.js.map