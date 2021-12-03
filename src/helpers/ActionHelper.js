"use strict";
exports.__esModule = true;
exports.EndAction = void 0;
var MovesHelpers_1 = require("./MovesHelpers");
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
var EndAction = function (G, ctx, isTrading) {
    (0, MovesHelpers_1.AfterBasicPickCardActions)(G, ctx, isTrading);
};
exports.EndAction = EndAction;
