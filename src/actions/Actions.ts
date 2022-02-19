import { Ctx } from "boardgame.io";
import { IsArtefactDiscardCard, IsMercenaryCard } from "../Camp";
import { CreateCard, isActionDiscardCard, isCardNotActionAndNotNull } from "../Card";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { AddBuffToPlayer, DeleteBuffFromPlayer } from "../helpers/ActionHelpers";
import { AddCampCardToPlayerCards } from "../helpers/CampCardHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { isHeroCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern } from "../Tavern";
import { BuffNames, LogTypes, RusCardTypes } from "../typescript/enums";
import { CampDeckCardTypes, DiscardCardTypes, ICard, IMyGameState, IPublicPlayer, IVariant, PickedCardType, PlayerCardsType, SuitTypes } from "../typescript/interfaces";

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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        discardedCard: PlayerCardsType = player.cards[suit].splice(cardId, 1)[0];
    if (!isHeroCard(discardedCard)) {
        G.discardCardsDeck.push(discardedCard);
        DeleteBuffFromPlayer(G, ctx, BuffNames.DiscardCardEndGame);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} отправил карту ${discardedCard.name} в колоду сброса.`);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
    }
};

/**
 * <h3>Отправляет карту из таверны в колоду сброса по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа при игре на 2-х игроков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const DiscardCardFromTavernAction = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в колоду сброса карту из таверны:`);
    DiscardCardFromTavern(G, cardId);
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
    player.pickedCard =
        player.campCards.filter((card: CampDeckCardTypes): boolean => IsMercenaryCard(card))[cardId];
    const pickedCard: PickedCardType = player.pickedCard;
    if (pickedCard !== null) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.placeEnlistmentMercenaries()]);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} во время фазы ${ctx.phase} выбрал наёмника '${pickedCard.name}'.`);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не выбрана карта наёмника.`);
    }
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
    AddBuffToPlayer(G, ctx, {
        name: BuffNames.SuitIdForMjollnir,
    }, suit);
    DeleteBuffFromPlayer(G, ctx, BuffNames.GetMjollnirProfit);
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} выбрал фракцию ${suitsConfig[suit].suitName} для эффекта артефакта Mjollnir.`);
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
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} пасанул во время фазы ${ctx.phase}.`);
};

/**
 * <h3>Действия, связанные с взятием карт из колоды сброса.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из колоды сброса.</li>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из колоды сброса.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const PickDiscardCard = (G: IMyGameState, ctx: Ctx, cardId: number): void => {
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        pickedCard: DiscardCardTypes = G.discardCardsDeck.splice(cardId, 1)[0];
    if (player.actionsNum === 2) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDiscardCardBrisingamens()]);
    }
    let isAdded = false;
    if (IsArtefactDiscardCard(pickedCard)) {
        isAdded = AddCampCardToPlayerCards(G, ctx, pickedCard);
    } else {
        isAdded = AddCardToPlayer(G, ctx, pickedCard);
        if (!isCardNotActionAndNotNull(pickedCard)) {
            AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
        }
    }
    if (isAdded && !isActionDiscardCard(pickedCard)) {
        CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} взял карту ${pickedCard.name} из колоды сброса.`);
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        pickedCard: PickedCardType = player.pickedCard;
    if (pickedCard !== null) {
        if (IsMercenaryCard(pickedCard)) {
            if (pickedCard.variants !== undefined) {
                const cardVariants: IVariant | undefined = pickedCard.variants[suit];
                if (cardVariants !== undefined) {
                    const mercenaryCard: ICard = CreateCard({
                        type: RusCardTypes.MERCENARY,
                        suit,
                        rank: 1,
                        points: cardVariants.points,
                        name: pickedCard.name,
                        tier: pickedCard.tier,
                        path: pickedCard.path,
                    });
                    AddCardToPlayer(G, ctx, mercenaryCard);
                    AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} во время фазы 'Enlistment Mercenaries' завербовал наёмника '${mercenaryCard.name}'.`);
                    const cardIndex: number =
                        player.campCards.findIndex((card: CampDeckCardTypes): boolean =>
                            card.name === pickedCard.name);
                    player.campCards.splice(cardIndex, 1);
                    if (player.campCards.filter((card: CampDeckCardTypes): boolean =>
                        IsMercenaryCard(card)).length) {
                        AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
                    }
                    CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
                } else {
                    // TODO Error!
                }
            } else {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants'.`);
            }
        } else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Вместо карты наёмника взята карта другого типа.`);
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не взята карта наёмника.`);
    }
};
