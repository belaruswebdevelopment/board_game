import {AfterBasicPickCardActions} from "./MovesHelpers";
import {MyGameState} from "../GameSetup";
import {Ctx} from "boardgame.io";

/**
 * <h3>Завершение текущего экшена.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает после завершения каждого экшена.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {boolean} isTrading Является ли действие обменом монет (трейдингом).
 * @constructor
 */
export const EndAction = (G: MyGameState, ctx: Ctx, isTrading: boolean): void => {
    AfterBasicPickCardActions(G, ctx, isTrading);
};
