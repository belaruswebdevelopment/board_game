import {AfterBasicPickCardActions} from "./MovesHelpers";

/**
 * Завершение текущего экшена.
 * Применения:
 * 1) Срабатывает после завершения каждого экшена.
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
 */
export const EndAction = (G, ctx, isTrading = null) => {
    AfterBasicPickCardActions(G, ctx, isTrading);
};
