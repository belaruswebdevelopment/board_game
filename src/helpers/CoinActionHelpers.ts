import type { Ctx } from "boardgame.io";
import { UpgradeCoinAction } from "../actions/CoinActions";
import { ThrowMyError } from "../Error";
import { CoinTypeNames, ErrorNames } from "../typescript/enums";
import type { CanBeUndef, IMyGameState, IPublicPlayer, IStack } from "../typescript/interfaces";

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
export const UpgradeCoinActions = (G: IMyGameState, ctx: Ctx, coinId: number, type: CoinTypeNames): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack: CanBeUndef<IStack> = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.FirstStackActionIsUndefined);
    }
    const value: CanBeUndef<number> = stack.value;
    if (value === undefined) {
        throw new Error(`У игрока с id '${ctx.currentPlayer}' в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction(G, ctx, false, value, coinId, type);
    return value;
};
