"use strict";
exports.__esModule = true;
exports.GetSuitIndexByName = void 0;
var SuitData_1 = require("../data/SuitData");
/**
 * <h3>Вычисляет индекс указанной фракции.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется повсеместно в проекте для вычисления индекса конкретной фракции.</li>
 * </ol>
 *
 * @param suitName Название фракции.
 * @returns {number} Индекс фракции.
 * @constructor
 */
var GetSuitIndexByName = function (suitName) { return Object.keys(SuitData_1.suitsConfig).indexOf(suitName); };
exports.GetSuitIndexByName = GetSuitIndexByName;
