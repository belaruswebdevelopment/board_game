import type { Ctx } from "boardgame.io";
import { CreateMercenaryPlayerCard, IsArtefactCard, IsMercenaryCampCard, IsMercenaryPlayerCard } from "../Camp";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { PickCardOrActionCardActions } from "../helpers/ActionHelpers";
import { AddBuffToPlayer, DeleteBuffFromPlayer } from "../helpers/BuffHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { IsHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern } from "../Tavern";
import { BuffNames, LogTypes, RusCardTypes } from "../typescript/enums";
import type { CampDeckCardTypes, DiscardCardTypes, IMercenaryPlayerCard, IMyGameState, IPublicPlayer, IVariant, PickedCardType, PlayerCardsType, SuitTypes } from "../typescript/interfaces";

/**
 * <h3>Действия, связанные с отправкой любой указанной карты со стола игрока в колоду сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при отправке карты в колоду сброса в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardAnyCardFromPlayerBoardAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes, cardId: number):
    void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const discardedCard: PlayerCardsType | undefined = player.cards[suit].splice(cardId, 1)[0];
    if (discardedCard === undefined) {
        throw new Error(`В массиве карт игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    }
    if (IsHeroCard(discardedCard)) {
        throw new Error(`Сброшенная карта не может быть с типом '${RusCardTypes.HERO}'.`);
    }
    if (IsMercenaryPlayerCard(discardedCard) || IsArtefactCard(discardedCard)) {
        G.discardCampCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} отправил карту '${discardedCard.name}' в колоду сброса карт лагеря.`);
    } else {
        G.discardCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} отправил карту '${discardedCard.name}' в колоду сброса карт.`);
    }
    DeleteBuffFromPlayer(G, ctx, BuffNames.DiscardCardEndGame);
};

/**
 * <h3>Отправляет карту из таверны в колоду сброса по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из лагеря при игре на 2-х игроков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const DiscardCardFromTavernAction = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} отправил в колоду сброса карту из таверны:`);
    const isCardDiscarded: boolean = DiscardCardFromTavern(G, cardId);
    if (isCardDiscarded) {
        G.tavernCardDiscarded2Players = true;
    }
};

/**
 * <h3>Игрок выбирает наёмника для вербовки.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать наёмника для вербовки.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const GetEnlistmentMercenariesAction = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const pickedCard: CampDeckCardTypes | undefined = player.campCards[cardId];
    if (pickedCard === undefined) {
        throw new Error(`В массиве карт лагеря игрока отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    }
    if (!IsMercenaryCampCard(pickedCard)) {
        throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
    }
    player.pickedCard = pickedCard;
    AddActionsToStackAfterCurrent(G, ctx, [StackData.placeEnlistmentMercenaries()]);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} во время фазы '${ctx.phase}' выбрал наёмника '${pickedCard.name}'.`);
};

/**
 * <h3>Выбор фракции для применения финального эффекта артефакта Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры при выборе игроком фракции для применения финального эффекта артефакта Mjollnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const GetMjollnirProfitAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    AddBuffToPlayer(G, ctx, {
        name: BuffNames.SuitIdForMjollnir,
    }, suit);
    DeleteBuffFromPlayer(G, ctx, BuffNames.GetMjollnirProfit);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} выбрал фракцию ${suitsConfig[suit].suitName} для эффекта артефакта 'Mjollnir'.`);
};

/**
 * <h3>Первый игрок в фазе вербовки наёмников может пасануть, чтобы вербовать последним.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Может применятся первым игроком в фазе вербовки наёмников.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const PassEnlistmentMercenariesAction = (G: IMyGameState, ctx: Ctx): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} пасанул во время фазы '${ctx.phase}'.`);
};

/**
 * <h3>Действия, связанные с взятием карт из колоды сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из колоды сброса.</li>
 * <li>При выборе конкретных карт лагеря, дающих возможность взять карты из колоды сброса.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const PickDiscardCard = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const card: DiscardCardTypes | undefined = G.discardCardsDeck.splice(cardId, 1)[0];
    if (card === undefined) {
        throw new Error(`В массиве колоды сброса отсутствует выбранная карта: это должно проверяться в MoveValidator.`);
    }
    if (player.actionsNum === 2) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDiscardCardBrisingamens()]);
    }
    PickCardOrActionCardActions(G, ctx, card);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} взял карту '${card.name}' из колоды сброса.`);
};

/**
 * <h3>Игрок выбирает фракцию для вербовки указанного наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется когда игроку нужно выбрать фракцию для вербовки наёмника.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 */
export const PlaceEnlistmentMercenariesAction = (G: IMyGameState, ctx: Ctx, suit: SuitTypes): void => {
    const player: IPublicPlayer | undefined = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const pickedCard: PickedCardType = player.pickedCard;
    if (!IsMercenaryCampCard(pickedCard)) {
        throw new Error(`Выбранная карта должна быть с типом '${RusCardTypes.MERCENARY}'.`);
    }
    const cardVariants: IVariant | undefined = pickedCard.variants[suit];
    if (cardVariants === undefined) {
        throw new Error(`У выбранной карты наёмника отсутствует принадлежность к выбранной фракции '${suit}'.`);
    }
    const mercenaryCard: IMercenaryPlayerCard = CreateMercenaryPlayerCard({
        suit,
        rank: 1,
        points: cardVariants.points,
        name: pickedCard.name,
        tier: pickedCard.tier,
        path: pickedCard.path,
        variants: pickedCard.variants,
    });
    const isAdded: boolean = AddCardToPlayer(G, ctx, mercenaryCard);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} во время фазы 'Enlistment Mercenaries' завербовал наёмника '${mercenaryCard.name}'.`);
    const cardIndex: number =
        player.campCards.findIndex((card: CampDeckCardTypes): boolean => card.name === pickedCard.name);
    if (cardIndex === -1) {
        throw new Error(`У игрока в массиве карт лагеря отсутствует выбранная карта.`);
    }
    player.campCards.splice(cardIndex, 1);
    if (player.campCards.filter((card: CampDeckCardTypes): boolean => IsMercenaryCampCard(card)).length) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
    }
    if (isAdded) {
        CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
    }
};
