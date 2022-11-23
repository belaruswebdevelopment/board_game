import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { CampBuffNames, GameModeNames, HeroBuffNames, PhaseNames } from "../typescript/enums";
import type { CanBeVoidType, FnContext, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Проверяет необходимость начала фазы 'Ставки Улина' или фазы 'Посещение таверн'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При действиях, после которых может начаться фаза 'Ставки Улина' или фаза 'Посещение таверн'.</li>
 * </ol>
 *
 * @param G
 * @returns Фаза игры.
 */
export const StartBidUlineOrTavernsResolutionPhase = ({ G, ctx, ...rest }: FnContext): PhaseNames => {
    const ulinePlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
            CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest }, HeroBuffNames.EveryTurn));
    if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer) && ulinePlayerIndex !== -1) {
        return PhaseNames.BidUline;
    } else {
        return PhaseNames.TavernsResolution;
    }
};

/**
 * <h3>Завершает каждую фазу конца игры и проверяет переход к другим фазам или завершает игру.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После завершения действий в каждой фазе конца игры.</li>
 * </ol>
 *
 * @param G
 * @returns Фаза игры.
 */
export const StartEndGameLastActions = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<PhaseNames> => {
    if (!G.secret.decks[0].length && G.secret.decks[1].length) {
        return PhaseNames.TroopEvaluation;
    } else {
        if (G.expansions.Thingvellir.active) {
            const brisingamensBuffIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
                    CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest },
                        CampBuffNames.DiscardCardEndGame));
            if (brisingamensBuffIndex !== -1) {
                return PhaseNames.BrisingamensEndGame;
            }
            const mjollnirBuffIndex: number =
                Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
                    CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest }, CampBuffNames.GetMjollnirProfit));
            if (mjollnirBuffIndex !== -1) {
                return PhaseNames.GetMjollnirProfit;
            }
        }
    }
};

/**
* <h3>Проверка начала фазы 'Поместить Труд' или фазы конца игры.</h3>
* <p>Применения:</p>
* <ol>
* <li>После завершения всех карт в деке каждой эпохи.</li>
* <li>После завершения фазы 'enlistmentMercenaries'.</li>
* </ol>
*
* @param G
* @returns Фаза игры.
*/
export const StartEndTierPhaseOrEndGameLastActions = ({ G, ctx, ...rest }: FnContext):
    CanBeVoidType<PhaseNames> => {
    const yludIndex: number =
        Object.values(G.publicPlayers).findIndex((player: IPublicPlayer, index: number): boolean =>
            CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest }, HeroBuffNames.EndTier));
    if (yludIndex !== -1) {
        return PhaseNames.PlaceYlud;
    } else {
        return StartEndGameLastActions({ G, ctx, ...rest });
    }
};
