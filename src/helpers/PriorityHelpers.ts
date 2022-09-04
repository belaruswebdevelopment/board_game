import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndefType, Ctx, IMyGameState, IPriority, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Определяет наличие у выбранного игрока наименьшего кристалла.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется для ботов при определении приоритета выставления монет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param playerId Id выбранного игрока.
 * @returns Имеет ли игрок наименьший кристалл.
 */
export const HasLowestPriority = (G: IMyGameState, ctx: Ctx, playerId: number): boolean => {
    const tempPriorities: number[] =
        Object.values(G.publicPlayers).map((player: IPublicPlayer): number => player.priority.value),
        minPriority: number = Math.min(...tempPriorities),
        player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    const priority: IPriority = player.priority;
    return priority.value === minPriority;
};

/**
 * <h3>Изменяет приоритет игроков для выбора карт из текущей таверны.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце фазы выбора карт.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const ChangePlayersPriorities = (G: IMyGameState, ctx: Ctx): void => {
    const tempPriorities: CanBeUndefType<IPriority>[] = [];
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        const exchangeOrder: CanBeUndefType<number> = G.exchangeOrder[i];
        if (exchangeOrder !== undefined) {
            const exchangePlayer: CanBeUndefType<IPublicPlayer> = G.publicPlayers[exchangeOrder];
            if (exchangePlayer === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                    exchangeOrder);
            }
            tempPriorities[i] = exchangePlayer.priority;
        }
    }
    if (tempPriorities.length) {
        AddDataToLog(G, LogTypeNames.Game, `Обмен кристаллами между игроками:`);
        for (let i = 0; i < G.exchangeOrder.length; i++) {
            const tempPriority: CanBeUndefType<IPriority> = tempPriorities[i],
                player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
            if (player === undefined) {
                return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
            }
            if (tempPriority !== undefined && player.priority.value !== tempPriority.value) {
                player.priority = tempPriority;
                AddDataToLog(G, LogTypeNames.Public, `Игрок '${player.nickname}' получил кристалл с приоритетом '${tempPriority.value}'.`);
            }
        }
    }
};
