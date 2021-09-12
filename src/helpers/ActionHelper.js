import {AfterBasicPickCardActions} from "./MovesHelpers";

/**
 * <h3>Завершение текущего экшена.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает после завершения каждого экшена.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
 */
export const EndAction = (G, ctx, isTrading = null) => {
    AfterBasicPickCardActions(G, ctx, isTrading);
};
