import type { Ctx } from "boardgame.io";
import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndefType, IMyGameState, IPublicPlayer, IStack } from "../typescript/interfaces";

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
 */
export const DrawCurrentProfit = (G: IMyGameState, ctx: Ctx): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndefType<IStack> = player.stack[0];
    if (stack !== undefined) {
        AddDataToLog(G, LogTypeNames.Game, `Игрок '${player.nickname}' должен получить преимущества от действия '${stack.drawName}'.`);
        StartOrEndActionStage(G, ctx, stack);
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
 * @param G
 * @param ctx
 * @param stack Стек действий героя.
 */
const StartOrEndActionStage = (G: IMyGameState, ctx: Ctx, stack: IStack): void => {
    if (stack.stageName !== undefined) {
        ctx.events?.setActivePlayers({
            currentPlayer: stack.stageName,
        });
        AddDataToLog(G, LogTypeNames.Game, `Начало стадии '${stack.stageName}'.`);
    } else if (ctx.activePlayers?.[Number(ctx.currentPlayer)] !== undefined) {
        ctx.events?.endStage();
    }
};
