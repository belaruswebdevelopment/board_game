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
 * @param context
 * @returns
 */
export const DrawCurrentProfit = ({ G, ctx, myPlayerID, events, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const stack = player.stack[0];
    if (stack !== undefined) {
        AddDataToLog({ G, ctx, events, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' должен получить преимущества от действия '${stack.drawName}'.`);
        StartOrEndActionStage({ G, ctx, myPlayerID, events, ...rest }, stack);
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
 * @param context
 * @param stack Стек действий.
 * @returns
 */
const StartOrEndActionStage = ({ G, ctx, myPlayerID, events, ...rest }, stack) => {
    var _a;
    if (stack.stageName !== undefined) {
        events.setActivePlayers({
            currentPlayer: stack.stageName,
        });
        AddDataToLog({ G, ctx, events, ...rest }, LogTypeNames.Game, `Начало стадии '${stack.stageName}'.`);
    }
    else if (((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(myPlayerID)]) !== undefined) {
        events.endStage();
    }
};
//# sourceMappingURL=ActionHelpers.js.map