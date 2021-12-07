import { AfterBasicPickCardActions } from "./MovesHelpers";
/**
 * <h3>Завершение текущего экшена.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает после завершения каждого экшена.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {boolean} isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
 */
export var EndAction = function (G, ctx, isTrading) {
    AfterBasicPickCardActions(G, ctx, isTrading);
};
