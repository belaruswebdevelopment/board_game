import type { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/CoinActions";
import { CoinTypes } from "../typescript/enums";
import type { IMyGameState, IPublicPlayer, IStack } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с улучшением монет от действий улучшающих монеты.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип обменной монеты.
 * @returns Значение на которое улучшается монета.
 */
export const UpgradeCoinActions = (G: IMyGameState, ctx: Ctx, coinId: number, type: CoinTypes): number => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const stack: IStack | undefined = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const value: number | undefined = stack.config?.value;
    if (value === undefined) {
        throw new Error(`У игрока с id '${ctx.currentPlayer}' в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction(G, ctx, false, value, coinId, type);
    return value;
};
