import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
/**
 * <h3>Действия, связанные с добавлением бафов игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * <li>При выборе конкретных артефактов, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Баф карты.
 */
export const AddBuffToPlayer = (G, ctx, buff) => {
    if (buff !== undefined) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs[buff.name] = buff.value;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} получил баф '${buff.name}'.`);
    }
};
// TODO Rework it!?
export const AddGetDistinctionsActionToStack = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [{}]);
};
// TODO Rework it!?
export const AddPickCardActionToStack = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [{}]);
};
/**
 * <h3>Действия, связанные с отрисовкой профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * <li>При выборе конкретных карт кэмпа, дающих профит.</li>
 * <li>При выборе конкретных карт улучшения монет, дающих профит.</li>
 * <li>При игровых моментах, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawCurrentProfit = (G, ctx, config) => {
    var _a;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        G.actionsNum = (_a = config.number) !== null && _a !== void 0 ? _a : 1;
        if (config.name !== undefined) {
            G.drawProfit = config.name;
        }
        else {
            G.drawProfit = ``;
        }
    }
    else {
        G.drawProfit = ``;
    }
};
/**
 * <h3>Действия, связанные со стартом стэйджа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале экшенов, требующих старта стэйджа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
const StartOrEndActionStage = (G, ctx, config) => {
    var _a, _b;
    if (config.stageName !== undefined) {
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setStage(config.stageName);
        AddDataToLog(G, LogTypes.GAME, `Начало стэйджа ${config.stageName}.`);
    }
    else if (ctx.activePlayers !== null && ctx.activePlayers[ctx.currentPlayer]) {
        // TODO Not end for Hofud action?
        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.endStage();
    }
};
/**
 * <h3>Действия, связанные с дискардом карты из таверны при пике карты кэмпа при игре на 2-х игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выбора карт кэмпа, если играет 2-а игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardCardFromTavernActionFor2Players = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.discardTavernCard()]);
};
//# sourceMappingURL=ActionHelpers.js.map