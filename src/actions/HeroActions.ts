import { Ctx } from "boardgame.io";
import { CreateCard } from "../Card";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { DeleteBuffFromPlayer } from "../helpers/ActionHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { isHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { IVariants } from "../typescript/action_interfaces";
import { ICard } from "../typescript/card_interfaces";
import { PlayerCardsType } from "../typescript/card_types";
import { BuffNames, CardNames, HeroNames, LogTypes, RusCardTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";

/**
 * <h3>Действия, связанные с сбросом карт с планшета игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, сбрасывающих карты с планшета игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardCardsFromPlayerBoardAction = (G: IMyGameState, ctx: Ctx, suit: string, cardId: number): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        pickedCard: PlayerCardsType = player.cards[suit].splice(cardId, 1)[0];
    if (!isHeroCard(pickedCard)) {
        player.pickedCard = pickedCard;
        G.discardCardsDeck.push(pickedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} отправил в колоду сброса карту ${pickedCard.name}.`);
        if (player.actionsNum === 2) {
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
 * <li>При добавлении героя Ольвин на игровое поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceOlwinCardsAction = (G: IMyGameState, ctx: Ctx, suit: string): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        playerVariants: IVariants | undefined = player.stack[0].variants;
    if (playerVariants !== undefined) {
        const olwinDouble: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            name: CardNames.Olwin,
        });
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} добавил карту Ольвин во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, olwinDouble);
        if (player.actionsNum === 2) {
            AddActionsToStackAfterCurrent(G, ctx, [StackData.placeOlwinCards()]);
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
 * <li>При добавлении героя Труд на игровое поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceThrudAction = (G: IMyGameState, ctx: Ctx, suit: string): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        playerVariants: IVariants | undefined = player.stack[0].variants;
    if (playerVariants !== undefined) {
        const heroCard: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: RusCardTypes.HERO,
            name: HeroNames.Thrud,
            game: `base`,
        });
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} добавил карту ${HeroNames.Thrud} во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, heroCard);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants' или не передан обязательный параметр 'stack[0].config.name'.`);
    }
};

/**
 * <h3>Действия, связанные с проверкой расположением конкретного героя на игровом поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При добавлении героя Илуд на игровом поле игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceYludAction = (G: IMyGameState, ctx: Ctx, suit: string): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        playerVariants: IVariants | undefined = player.stack[0].variants;
    if (playerVariants !== undefined) {
        const heroCard: ICard = CreateCard({
            suit,
            rank: playerVariants[suit].rank,
            points: playerVariants[suit].points,
            type: RusCardTypes.HERO,
            name: HeroNames.Ylud,
            game: `base`,
        });
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} добавил карту ${HeroNames.Ylud} во фракцию ${suitsConfig[suit].suitName}.`);
        AddCardToPlayer(G, ctx, heroCard);
        CheckAndMoveThrudOrPickHeroAction(G, ctx, heroCard);
        if (G.tierToEnd === 0) {
            DeleteBuffFromPlayer(G, ctx, BuffNames.EndTier);
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants' или не передан обязательный параметр 'stack[0].config.name'.`);
    }
};
