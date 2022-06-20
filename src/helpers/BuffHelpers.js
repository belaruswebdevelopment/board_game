import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
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
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
        }
        player.buffs.push({
            [buff.name]: value !== null && value !== void 0 ? value : true,
        });
        AddDataToLog(G, LogTypes.Game, `Игрок '${player.nickname}' получил баф '${buff.name}'.`);
    }
};
/**
 * <h3>Действия, связанные с проверкой наличия конкретного бафа у игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В любой ситуации, требующей наличия конкретного бафа у игрока.</li>
 * </ol>
 *
 * @param player Игрок.
 * @param buffName Баф.
 * @returns
 */
export const CheckPlayerHasBuff = (player, buffName) => player.buffs.find((buff) => buff[buffName] !== undefined) !== undefined;
/**
* <h3>Действия, связанные с удалением бафов у игрока.</h3>
* <p>Применения:</p>
* <ol>
* <li>>В любой ситуации, требующей удаления конкретного бафа у игрока.</li>
* </ol>
*
* @param G
* @param ctx
* @param buffName Баф.
*/
export const DeleteBuffFromPlayer = (G, ctx, buffName) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const buffIndex = player.buffs.findIndex((buff) => buff[buffName] !== undefined);
    if (buffIndex === -1) {
        throw new Error(`У игрока в массиве бафов отсутствует баф '${buffName}'.`);
    }
    player.buffs.splice(buffIndex, 1);
    AddDataToLog(G, LogTypes.Game, `Игрок '${player.nickname}' потерял баф '${buffName}'.`);
};
//# sourceMappingURL=BuffHelpers.js.map