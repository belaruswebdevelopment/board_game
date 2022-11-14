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
export const UpgradeCoinActions = ({ G, ctx, playerID, ...rest }, coinId, type) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const stack = player.stack[0];
    if (stack === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FirstStackActionIsUndefined, playerID);
    }
    const value = stack.value;
    if (value === undefined) {
        throw new Error(`У игрока с id '${playerID}' в стеке действий отсутствует обязательный параметр 'config.value'.`);
    }
    UpgradeCoinAction({ G, ctx, playerID, ...rest }, false, value, coinId, type);
    return value;
};
//# sourceMappingURL=CoinActionHelpers.js.map