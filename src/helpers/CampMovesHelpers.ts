import { Ctx } from "boardgame.io";
import { isArtefactCardNotMercenary } from "../Camp";
import { StackData } from "../data/StackData";
import { CampDeckCardTypes } from "../typescript/card_types";
import { Phases, RusCardTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { AddBuffToPlayer } from "./ActionHelpers";
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
export const AddCampCardToCards = (G: IMyGameState, ctx: Ctx, card: CampDeckCardTypes): void => {
    if (ctx.phase === Phases.PickCards && ctx.activePlayers === null
        && (ctx.currentPlayer === G.publicPlayersOrder[0] ||
            G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCamp)) {
        G.campPicked = true;
    }
    if (G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime) {
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.goCampOneTime;
    }
    if (isArtefactCardNotMercenary(card) && card.suit !== null) {
        AddCampCardToPlayerCards(G, ctx, card);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
    } else {
        AddCampCardToPlayer(G, ctx, card);
        if (isArtefactCardNotMercenary(card)) {
            AddBuffToPlayer(G, ctx, card.buff);
        }
    }
    if (ctx.phase === Phases.EnlistmentMercenaries && G.publicPlayers[Number(ctx.currentPlayer)].campCards
        .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY).length) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
    }
};
