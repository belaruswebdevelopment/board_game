import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames, SuitNames } from "../typescript/enums";
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
 * @returns
 */
export const AddBuffToPlayer = ({ G, ctx, playerID, ...rest }, buff, value) => {
    if (buff !== undefined) {
        const player = G.publicPlayers[Number(playerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
        }
        player.buffs.push({
            [buff.name]: value !== null && value !== void 0 ? value : true,
        });
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' получил баф '${buff.name}'.`);
    }
};
/**
 * <h3>Действия, связанные с изменением значения бафа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости изменить значение бафа игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param buffName Баф.
 * @param value Новое значение бафа.
 * @returns
 */
export const ChangeBuffValue = ({ G, ctx, playerID, ...rest }, buffName, value) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const buffIndex = player.buffs.findIndex((buff) => buff[buffName] !== undefined);
    if (buffIndex === -1) {
        throw new Error(`У игрока в массиве бафов отсутствует баф '${buffName}' с id ${buffIndex}.`);
    }
    player.buffs[buffIndex] = {
        [buffName]: value,
    };
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `У игрок '${player.nickname}' изменилось значение бафа '${buffName}' на новое - '${value}'.`);
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
export const CheckPlayerHasBuff = ({ G, ctx, playerID, ...rest }, buffName) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    return player.buffs.find((buff) => buff[buffName] !== undefined) !== undefined;
};
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
* @returns
*/
export const DeleteBuffFromPlayer = ({ G, ctx, playerID, ...rest }, buffName) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const buffIndex = player.buffs.findIndex((buff) => buff[buffName] !== undefined);
    if (buffIndex === -1) {
        throw new Error(`У игрока с id ${playerID} в массиве бафов отсутствует баф '${buffName}' с id ${buffIndex}.`);
    }
    player.buffs.splice(buffIndex, 1);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' потерял баф '${buffName}'.`);
};
/**
 * <h3>Действия, связанные с получением значения бафа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости получения значения бафа игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param buffName Баф.
 * @returns
 */
export const GetBuffValue = ({ G, ctx, playerID, ...rest }, buffName) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, playerID);
    }
    const buff = player.buffs.find((buff) => buff[buffName] !== undefined);
    if (buff === undefined) {
        throw new Error(`У игрока в массиве бафов отсутствует баф '${buffName}'.`);
    }
    const buffValue = buff[buffName];
    if (buffValue === undefined) {
        throw new Error(`У игрока в массиве бафов отсутствует значение у бафа '${buffName}'.`);
    }
    return buffValue;
};
//# sourceMappingURL=BuffHelpers.js.map