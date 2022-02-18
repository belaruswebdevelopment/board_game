import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript_enums/enums";
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
 * @param buff Баф.
 * @param value Значение бафа.
 */
export const AddBuffToPlayer = (G, ctx, buff, value) => {
    if (buff !== undefined) {
        const player = G.publicPlayers[Number(ctx.currentPlayer)];
        player.buffs.push({
            [buff.name]: value !== null && value !== void 0 ? value : true,
        });
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил баф '${buff.name}'.`);
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
export const DeleteBuffFromPlayer = (G, ctx, buffName) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], buffIndex = player.buffs.findIndex((buff) => buff[buffName] !== undefined);
    if (buffIndex !== -1) {
        player.buffs.splice(buffIndex, 1);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} потерял баф '${buffName}'.`);
    }
    else {
        // TODO Log error?
    }
};
/**
 * <h3>Действия, связанные с отображением профита.</h3>
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
 */
export const DrawCurrentProfit = (G, ctx) => {
    var _a, _b;
    const player = G.publicPlayers[Number(ctx.currentPlayer)], config = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        player.actionsNum = (_b = config.number) !== null && _b !== void 0 ? _b : 1;
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
 * <h3>Действия, связанные со стартом конкретной стадии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале действий, требующих старта конкретной стадии.</li>
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
        AddDataToLog(G, LogTypes.GAME, `Начало стадии ${config.stageName}.`);
    }
    else if (ctx.activePlayers !== null && ctx.activePlayers[Number(ctx.currentPlayer)]) {
        // TODO Is it need!?
        (_b = ctx.events) === null || _b === void 0 ? void 0 : _b.endStage();
    }
};
/**
 * <h3>Действия, связанные с сбросом карты из таверны при выборе карты кэмпа при игре на 2-х игроков.</h3>
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