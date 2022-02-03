import { Ctx } from "boardgame.io";
import { CreateCard } from "../Card";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { IConfig, IVariants } from "../typescript/action_interfaces";
import { ICard, ICreateCard } from "../typescript/card_interfaces";
import { DiscardCardTypes } from "../typescript/card_types";
import { CardNames, LogTypes, RusCardTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";

/**
 * <h3>Действия, связанные с дискардом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дискардящих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G: IMyGameState, ctx: Ctx, suit: string,
    cardId: number): void => {
    const pickedCard: DiscardCardTypes = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit][cardId] as
        DiscardCardTypes;
    if (pickedCard.type !== RusCardTypes.HERO) {
        G.publicPlayers[Number(ctx.currentPlayer)].pickedCard = pickedCard;
        // TODO Artefact cards can be added to discard too OR make artefact card as created ICard?
        G.discardCardsDeck.push(G.publicPlayers[Number(ctx.currentPlayer)].cards[suit]
            .splice(cardId, 1)[0] as ICard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту ${pickedCard.name}.`);
        if (G.actionsNum === 2) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.discardCardFromBoardDagda()]);
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
    }
};

/**
 * <h3>Действия, связанные с добавлением других карт на планшет игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих другие карты на планшет игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceCardsAction = (G: IMyGameState, ctx: Ctx, suit: string): void => {
    const playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined) {
        const olwinDouble: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            name: CardNames.Olwin,
        } as ICreateCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту Олвин во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, olwinDouble);
        if (G.actionsNum === 2) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.placeCardsOlwin()]);
        }
        CheckAndMoveThrudOrPickHeroAction(G, ctx, olwinDouble);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'stack[0].variants'.`);
    }
};

/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Труд на игровом поле игрока.</li>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceHeroAction = (G: IMyGameState, ctx: Ctx, config: IConfig, suit: string): void => {
    const playerVariants: IVariants | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0].variants;
    if (playerVariants !== undefined && config.name !== undefined) {
        const heroCard: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: RusCardTypes.HERO,
            name: config.name,
            game: `base`,
        } as ICreateCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${config.name} во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, heroCard);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, heroCard);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants' или не передан обязательный параметр 'stack[0].config.name'.`);
    }
};
