import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames, SuitNames } from "../typescript/enums";
import type { AllBuffNames, BuffType, BuffValueType, CanBeUndefType, IPublicPlayer, MyFnContextWithMyPlayerID, PlayerBuffs } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с добавлением бафов игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * <li>При выборе конкретных артефактов, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param context
 * @param buff Баф.
 * @param value Значение бафа.
 * @returns
 */
export const AddBuffToPlayer = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, buff?: BuffType,
    value?: BuffValueType): void => {
    if (buff !== undefined) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                myPlayerID);
        }
        player.buffs.push({
            [buff.name]: value ?? true,
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
 * @param context
 * @param buffName Баф.
 * @param value Новое значение бафа.
 * @returns
 */
export const ChangeBuffValue = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, buffName: AllBuffNames,
    value: SuitNames): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const buffIndex: number =
        player.buffs.findIndex((buff: PlayerBuffs): boolean => buff[buffName] !== undefined);
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
 * @param context
 * @param buffName Баф.
 * @returns
 */
export const CheckPlayerHasBuff = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, buffName: AllBuffNames):
    boolean => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    return player.buffs.find((buff: PlayerBuffs): boolean => buff[buffName] !== undefined) !== undefined;
};

/**
* <h3>Действия, связанные с удалением бафов у игрока.</h3>
* <p>Применения:</p>
* <ol>
* <li>>В любой ситуации, требующей удаления конкретного бафа у игрока.</li>
* </ol>
*
* @param context
* @param buffName Баф.
* @returns
*/
export const DeleteBuffFromPlayer = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    buffName: AllBuffNames): void => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const buffIndex: number =
        player.buffs.findIndex((buff: PlayerBuffs): boolean => buff[buffName] !== undefined);
    if (buffIndex === -1) {
        throw new Error(`У игрока с id ${myPlayerID} в массиве бафов отсутствует баф '${buffName}' с id ${buffIndex}.`);
    }
    const amount = 1,
        removedBuffs: PlayerBuffs[] = player.buffs.splice(buffIndex, 1);
    if (amount !== removedBuffs.length) {
        throw new Error(`Недостаточно бафов в массиве бафов игрока с id '${myPlayerID}': требуется - '${amount}', в наличии - '${removedBuffs.length}'.`);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Игрок '${player.nickname}' потерял баф '${buffName}'.`);
};

/**
 * <h3>Действия, связанные с получением значения бафа игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости получения значения бафа игрока.</li>
 * </ol>
 *
 * @param context
 * @param buffName Баф.
 * @returns
 */
export const GetBuffValue = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, buffName: AllBuffNames):
    BuffValueType => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const buff: CanBeUndefType<PlayerBuffs> =
        player.buffs.find((buff: PlayerBuffs): boolean => buff[buffName] !== undefined);
    if (buff === undefined) {
        throw new Error(`У игрока в массиве бафов отсутствует баф '${buffName}'.`);
    }
    const buffValue: CanBeUndefType<BuffValueType> = buff[buffName];
    if (buffValue === undefined) {
        throw new Error(`У игрока в массиве бафов отсутствует значение у бафа '${buffName}'.`);
    }
    return buffValue;
};
