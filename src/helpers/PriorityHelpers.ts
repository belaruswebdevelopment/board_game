import { ThrowMyError } from "../Error";
import { AssertAllPriorityValue } from "../is_helpers/AssertionTypeHelpers";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames } from "../typescript/enums";
import type { AllPriorityValueType, CanBeUndefType, FnContext, MyFnContextWithMyPlayerID, Priority, PublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Определяет наличие у выбранного игрока наименьшего кристалла.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для ботов при определении приоритета выставления монет.</li>
 * </ol>
 *
 * @param context
 * @returns Имеет ли игрок наименьший кристалл.
 */
export const HasLowestPriority = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): boolean => {
    const tempPriorities: AllPriorityValueType[] =
        Object.values(G.publicPlayers).map((player: PublicPlayer): AllPriorityValueType =>
            player.priority.value),
        minPriority: number = Math.min(...tempPriorities),
        player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    AssertAllPriorityValue(minPriority);
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    return player.priority.value === minPriority;
};

/**
 * <h3>Изменяет приоритет игроков для выбора карт из текущей таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце фазы выбора карт.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const ChangePlayersPriorities = ({ G, ctx, ...rest }: FnContext): void => {
    if (G.exchangeOrder === null) {
        throw new Error(`В массиве изменения порядка хода игроков не может не быть значений.`);
    }
    const tempPriorities: CanBeUndefType<Priority>[] = [];
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        const exchangeOrder: CanBeUndefType<number> = G.exchangeOrder[i];
        if (exchangeOrder === undefined) {
            throw new Error(`В массиве порядка хода игроков отсутствует текущий с id '${i}'.`);
        }
        const exchangePlayer: CanBeUndefType<PublicPlayer> = G.publicPlayers[exchangeOrder];
        if (exchangePlayer === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                exchangeOrder);
        }
        tempPriorities[i] = exchangePlayer.priority;
    }
    if (tempPriorities.length) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Обмен кристаллами между игроками:`);
        for (let i = 0; i < G.exchangeOrder.length; i++) {
            const tempPriority: CanBeUndefType<Priority> = tempPriorities[i],
                player: CanBeUndefType<PublicPlayer> = G.publicPlayers[i];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    i);
            }
            if (tempPriority !== undefined && player.priority.value !== tempPriority.value) {
                player.priority = tempPriority;
                AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Игрок '${player.nickname}' получил кристалл с приоритетом '${tempPriority.value}'.`);
            }
        }
    }
};
