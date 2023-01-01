import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndefType, IPublicPlayer, MyFnContextWithMyPlayerID, Stack } from "../typescript/interfaces";

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
export const DrawCurrentProfit = ({ G, ctx, myPlayerID, events, ...rest }: MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, events, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const stack: CanBeUndefType<Stack> = player.stack[0];
    if (stack !== undefined) {
        AddDataToLog({ G, ctx, events, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' должен получить преимущества от действия '${stack.drawName}'.`);
        StartOrEndActionStage({ G, ctx, myPlayerID, events, ...rest }, stack);
        if (stack.configName !== undefined) {
            G.drawProfit = stack.configName;
        } else {
            G.drawProfit = null;
        }
    } else {
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
const StartOrEndActionStage = ({ G, ctx, myPlayerID, events, ...rest }: MyFnContextWithMyPlayerID, stack: Stack):
    void => {
    if (stack.stageName !== undefined) {
        events.setActivePlayers({
            currentPlayer: stack.stageName,
        });
        AddDataToLog({ G, ctx, events, ...rest }, LogTypeNames.Game, `Начало стадии '${stack.stageName}'.`);
    } else if (ctx.activePlayers?.[Number(myPlayerID)] !== undefined) {
        events.endStage();
    }
};
