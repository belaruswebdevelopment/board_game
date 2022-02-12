import { IsArtefactCardNotMercenary } from "../Camp";
import { StackData } from "../data/StackData";
import { BuffNames, Phases, RusCardTypes } from "../typescript/enums";
import { AddBuffToPlayer, DeleteBuffFromPlayer } from "./ActionHelpers";
import { AddCampCardToPlayer, AddCampCardToPlayerCards } from "./CampCardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
/**
 * <h3>Действия, связанные с добавлением карт кэмпа в массив карт игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, добавляющихся на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param card Карта.
 */
export const AddCampCardToCards = (G, ctx, card) => {
    if (ctx.phase === Phases.PickCards && ctx.activePlayers === null
        && (ctx.currentPlayer === G.publicPlayersOrder[0] ||
            G.publicPlayers[Number(ctx.currentPlayer)].buffs
                .find((buff) => buff.goCamp !== undefined))) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs
        .find((buff) => buff.goCampOneTime !== undefined)) {
        DeleteBuffFromPlayer(G, ctx, BuffNames.GoCampOneTime);
    }
    if (IsArtefactCardNotMercenary(card) && card.suit !== null) {
        AddCampCardToPlayerCards(G, ctx, card);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
    }
    else {
        AddCampCardToPlayer(G, ctx, card);
        if (IsArtefactCardNotMercenary(card)) {
            AddBuffToPlayer(G, ctx, card.buff);
        }
    }
    if (ctx.phase === Phases.EnlistmentMercenaries && G.publicPlayers[Number(ctx.currentPlayer)].campCards
        .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
    }
};
//# sourceMappingURL=CampMovesHelpers.js.map