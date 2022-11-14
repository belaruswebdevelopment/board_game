import { StackData } from "../data/StackData";
import { ThrowMyError } from "../Error";
import { CheckPlayerHasBuff } from "../helpers/BuffHelpers";
import { RefillCamp } from "../helpers/CampHelpers";
import { EndTurnActions, StartOrEndActions } from "../helpers/GameHooksHelpers";
import { AddActionsToStack } from "../helpers/StackHelpers";
import { CheckDistinction } from "../TroopEvaluation";
import { ErrorNames, GameModeNames, MythicalAnimalBuffNames, SuitNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, DeckCardType, DistinctionType, ExplorerDistinctionCardsArrayType, FnContext, IPublicPlayer } from "../typescript/interfaces";

/**
 * <h3>Определяет порядок получения преимуществ при начале фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале фазы 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const CheckAndResolveTroopEvaluationOrders = ({ G, ctx, ...rest }: FnContext): void => {
    CheckDistinction({ G, ctx, ...rest });
    const distinctions: string[] =
        Object.values(G.distinctions).filter((distinction: DistinctionType): boolean =>
            distinction !== null && distinction !== undefined) as string[];
    if (distinctions.every((distinction: DistinctionType): boolean =>
        distinction !== null && distinction !== undefined)) {
        G.publicPlayersOrder = distinctions;
    }
};

/**
 * <h3>Проверяет необходимость завершения фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом получении преимуществ в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущей фазы.
 */
export const CheckEndTroopEvaluationPhase = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<boolean> => {
    if (G.publicPlayersOrder.length) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                ctx.currentPlayer);
        }
        if (ctx.currentPlayer === ctx.playOrder[ctx.playOrder.length - 1] && !player.stack.length) {
            return Object.values(G.distinctions).every((distinction: DistinctionType): boolean =>
                distinction === undefined);
        }
    }

};

/**
 * <h3>Проверяет необходимость завершения хода в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При каждом действии с наёмником в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Необходимость завершения текущего хода.
 */
export const CheckEndTroopEvaluationTurn = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<true> =>
    EndTurnActions({ G, ctx, playerID: ctx.currentPlayer, ...rest });

/**
 * <h3>Действия при завершении фазы 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении фазы 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const EndTroopEvaluationPhaseActions = ({ G, ctx, ...rest }: FnContext): void => {
    if (G.expansions.thingvellir.active) {
        RefillCamp({ G, ctx, ...rest });
    }
    G.publicPlayersOrder = [];
};

/**
 * <h3>Действия при завершении мува в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnTroopEvaluationMove = ({ G, ctx, ...rest }: FnContext): void => {
    StartOrEndActions({ G, ctx, playerID: ctx.currentPlayer, ...rest });
};

/**
 * <h3>Действия при начале хода в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале хода в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnTroopEvaluationTurnBegin = ({ G, ctx, ...rest }: FnContext): void => {
    AddActionsToStack({ G, ctx, playerID: ctx.currentPlayer, ...rest }, [StackData.getDistinctions()]);
    if (G.distinctions[SuitNames.explorer] === ctx.currentPlayer && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        let length: number;
        if (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`) {
            length = 1;
        } else {
            // TODO Add 6 cards if player has Garm in his deck
            const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(ctx.currentPlayer)];
            if (player === undefined) {
                return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined,
                    ctx.currentPlayer);
            }
            if (G.expansions.idavoll.active
                && CheckPlayerHasBuff({ G, ctx, playerID: ctx.currentPlayer, ...rest },
                    MythicalAnimalBuffNames.ExplorerDistinctionGetSixCards)) {
                length = 6;
            } else {
                length = 3;
            }
        }
        const explorerDistinctionCards: DeckCardType[] = [];
        for (let j = 0; j < length; j++) {
            const card: CanBeUndefType<DeckCardType> = G.secret.decks[1][j];
            if (card === undefined) {
                throw new Error(`В массиве карт '2' эпохи отсутствует карта с id '${j}'.`);
            }
            explorerDistinctionCards.push(card);
        }
        G.explorerDistinctionCards = explorerDistinctionCards as ExplorerDistinctionCardsArrayType;
    }
};

/**
 * <h3>Действия при завершении хода в фазе 'Смотр войск'.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении хода в фазе 'Смотр войск'.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const OnTroopEvaluationTurnEnd = ({ G, ctx, random }: FnContext): void => {
    if (G.explorerDistinctionCardId !== null && ctx.playOrderPos === (ctx.playOrder.length - 1)) {
        G.secret.decks[1].splice(G.explorerDistinctionCardId, 1);
        G.deckLength[1] = G.secret.decks[1].length;
        G.secret.decks[1] = random!.Shuffle(G.secret.decks[1]);
        G.explorerDistinctionCardId = null;
    }
};
