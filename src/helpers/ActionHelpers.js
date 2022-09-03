import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames } from "../typescript/enums";
/**
 * <h3>Действия, связанные с отображением профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * <li>При выборе конкретных карт лагеря, дающих профит.</li>
 * <li>При выборе конкретных карт улучшения монет, дающих профит.</li>
 * <li>При игровых моментах, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const DrawCurrentProfit = (G, ctx) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack !== undefined) {
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' должен получить преимущества от действия '${stack.drawName}'.`);
        StartOrEndActionStage(G, ctx, stack);
        if (stack.configName !== undefined) {
            G.drawProfit = stack.configName;
        }
        else {
            G.drawProfit = null;
        }
    }
    else {
        G.drawProfit = null;
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
 * @param stack Стек действий героя.
 * @returns
 */
const StartOrEndActionStage = (G, ctx, stack) => {
    var _a, _b, _c;
    if (stack.stageName !== undefined) {
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({
            currentPlayer: stack.stageName,
        });
        AddDataToLog(G, LogTypeNames.Game, `Начало стадии '${stack.stageName}'.`);
    }
    else if (((_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)]) !== undefined) {
        (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.endStage();
    }
};
//# sourceMappingURL=ActionHelpers.js.map