import { isArtefactDiscardCard } from "../Camp";
import { CreateCard, isActionDiscardCard, isCardNotAction } from "../Card";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { AddCampCardToPlayerCards } from "../helpers/CampCardHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { DiscardCardFromTavern } from "../Tavern";
import { LogTypes, RusCardTypes } from "../typescript/enums";
/**
 * <h3>Действия, связанные со сбросом любой указанной карты со стола игрока в дискард.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при сбросе карты в дискард в конце игры при наличии артефакта Brisingamens.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param cardId Id карты.
 */
export const DiscardAnyCardFromPlayerBoardAction = (G, ctx, suit, cardId) => {
    const discardedCard = G.publicPlayers[Number(ctx.currentPlayer)].cards[suit].splice(cardId, 1)[0];
    if (discardedCard.type !== RusCardTypes.HERO) {
        G.discardCardsDeck.push(discardedCard);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} сбросил карту ${discardedCard.name} в дискард.`);
        delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.discardCardEndGame;
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
    }
};
/**
 * <h3>Сбрасывает карту из таверны по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа при игре на 2-х игроков.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const DiscardCardFromTavernAction = (G, ctx, cardId) => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту из таверны:`);
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
export const GetEnlistmentMercenariesAction = (G, ctx, cardId) => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card) => card.type === RusCardTypes.MERCENARY)[cardId];
    const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' выбрал наёмника '${pickedCard.name}'.`);
        AddActionsToStackAfterCurrent(G, ctx, [StackData.placeEnlistmentMercenaries()]);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
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
export const GetMjollnirProfitAction = (G, ctx, suit) => {
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs.getMjollnirProfit;
    G.suitIdForMjollnir = suit;
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
export const PassEnlistmentMercenariesAction = (G, ctx) => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} пасанул во время фазы 'Enlistment Mercenaries'.`);
};
/**
 * <h3>Действия, связанные с взятием карт из дискарда.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих возможность взять карты из дискарда.</li>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param cardId Id карты.
 */
export const PickDiscardCard = (G, ctx, cardId) => {
    const pickedCard = G.discardCardsDeck.splice(cardId, 1)[0];
    if (G.actionsNum === 2) {
        AddActionsToStackAfterCurrent(G, ctx, [StackData.pickDiscardCardBrisingamens()]);
    }
    let isAdded = false;
    if (isArtefactDiscardCard(pickedCard)) {
        isAdded = AddCampCardToPlayerCards(G, ctx, pickedCard);
    }
    else {
        isAdded = AddCardToPlayer(G, ctx, pickedCard);
        if (!isCardNotAction(pickedCard)) {
            AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
        }
    }
    if (isAdded && !isActionDiscardCard(pickedCard)) {
        CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
    }
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${pickedCard.name} из дискарда.`);
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
export const PlaceEnlistmentMercenariesAction = (G, ctx, suit) => {
    const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        if (`variants` in pickedCard && `tier` in pickedCard && `path` in pickedCard) {
            if (pickedCard.variants !== undefined) {
                const mercenaryCard = CreateCard({
                    type: RusCardTypes.MERCENARY,
                    suit,
                    rank: 1,
                    points: pickedCard.variants[suit].points,
                    name: pickedCard.name,
                    tier: pickedCard.tier,
                    path: pickedCard.path,
                });
                AddCardToPlayer(G, ctx, mercenaryCard);
                AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' завербовал наёмника '${mercenaryCard.name}'.`);
                const cardIndex = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .findIndex((card) => card.name === pickedCard.name);
                G.publicPlayers[Number(ctx.currentPlayer)].campCards.splice(cardIndex, 1);
                if (G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card) => card.type === RusCardTypes.MERCENARY).length) {
                    AddActionsToStackAfterCurrent(G, ctx, [StackData.enlistmentMercenaries()]);
                }
                CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
            }
            else {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants'.`);
            }
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Вместо карты наёмника пикнута карта другого типа.`);
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
    }
};
//# sourceMappingURL=Actions.js.map