import { UpgradeCoinAction } from "../actions/CoinActions";
import { ThrowMyError } from "../Error";
import { CoinTypeNames, ErrorNames } from "../typescript/enums";
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
export const UpgradeCoinActions = (G, ctx, coinId, type) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        throw new Error(`В массиве стека действий игрока с id '${ctx.currentPlayer}' отсутствует '0' действие.`);
    }
    const value = stack.value;
    if (value === undefined) {
        throw new Error(`У игрока с id '${ctx.currentPlayer}' в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction(G, ctx, false, value, coinId, type);
    return value;
};
//# sourceMappingURL=CoinActionHelpers.js.map