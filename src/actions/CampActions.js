import { CreateCard } from "../Card";
import { StackData } from "../data/StackData";
import { suitsConfig } from "../data/SuitData";
import { StartAutoAction } from "../helpers/ActionDispatcherHelpers";
import { PickDiscardCard } from "../helpers/ActionHelpers";
import { AddCardToPlayer } from "../helpers/CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction, CheckPickDiscardCard } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent, EndActionForChosenPlayer } from "../helpers/StackHelpers";
import { AddDataToLog } from "../Logging";
import { LogTypes, RusCardTypes } from "../typescript/enums";
import { StartVidofnirVedrfolnirAction, UpgradeCoinAction } from "./AutoActions";
// TODO Does INVALID_MOVE be not in actions but in moves validators?
/**
 * <h3>Действия, связанные с добавлением монет в кошелёк для обмена при наличии персонажа Улина для начала действия артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты кэмпа Vidofnir Vedrfolnir и наличии героя Улина.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 */
export const AddCoinToPouchAction = (G, ctx, coinId) => {
    const player = G.publicPlayers[Number(ctx.currentPlayer)], tempId = player.boardCoins.findIndex((coin, index) => index >= G.tavernsNum && coin === null), action = {
        name: StartVidofnirVedrfolnirAction.name,
    };
    player.boardCoins[tempId] = player.handCoins[coinId];
    player.handCoins[coinId] = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} положил монету ценностью '${player.boardCoins[tempId]}' в свой кошелёк.`);
    StartAutoAction(G, ctx, action);
};
/**
 * <h3>Действия, связанные с возможностью взятия карт из дискарда от карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const CheckPickDiscardCardCampAction = (G, ctx) => {
    CheckPickDiscardCard(G, ctx);
};
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
 * <h3>Действия, связанные с дискардом карты из конкретной фракции игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карты для дискарда по действию карты кэмпа артефакта Hofud.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param suit Название фракции.
 * @param playerId Id игрока.
 * @param cardId Id сбрасываемой карты.
 */
export const DiscardSuitCardAction = (G, ctx, suit, playerId, cardId) => {
    // Todo ctx.playerID === playerId???
    if (ctx.playerID !== undefined) {
        if (G.publicPlayers[playerId].cards[suit][cardId].type !== RusCardTypes.HERO) {
            const discardedCard = G.publicPlayers[playerId].cards[suit].splice(cardId, 1)[0];
            G.discardCardsDeck.push(discardedCard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[playerId].nickname} сбросил карту ${discardedCard.name} в дискард.`);
            EndActionForChosenPlayer(G, ctx, playerId);
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Сброшенная карта не может быть с типом 'герой'.`);
        }
        // TODO Rework it for players and fix it for bots
        /*if (ctx.playerID !== ctx.currentPlayer) {
            const discardedCard: PlayerCardsType =
                G.publicPlayers[Number(ctx.playerID)].cards[suit].splice(cardId, 1)[0];
            G.discardCardsDeck.push(discardedCard as ICard);
            AddDataToLog(G, LogTypes.GAME, `Игрок ${ G.publicPlayers[Number(ctx.playerID)].nickname } сбросил карту ${ discardedCard.name } в дискард.`);
            EndActionForChosenPlayer(G, ctx, playerId);
        } else {
        }*/
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'ctx.playerID'.`);
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
export const GetEnlistmentMercenariesAction = (G, ctx, cardId) => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card) => card.type === RusCardTypes.MERCENARY)[cardId];
    const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' выбрал наёмника '${pickedCard.name}'.`);
        const stack = [StackData.placeEnlistmentMercenaries()];
        AddActionsToStackAfterCurrent(G, ctx, stack);
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
 * <h3>Действия, связанные с взятием карт из дискарда от карт кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных карт кэмпа, дающих возможность взять карты из дискарда.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const PickDiscardCardCampAction = (G, ctx, config, cardId) => {
    PickDiscardCard(G, ctx, cardId);
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
                    const stack = [StackData.enlistmentMercenaries()];
                    AddActionsToStackAfterCurrent(G, ctx, stack);
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
/**
 * <h3>Действия, связанные с улучшением монеты способности артефакта Vidofnir Vedrfolnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При старте улучшения монеты карты кэмпа артефакта Vidofnir Vedrfolnir.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinId Id монеты.
 * @param type Тип монеты.
 * @param isInitial Является ли монета базовой.
 */
export const UpgradeCoinVidofnirVedrfolnirAction = (G, ctx, coinId, type, isInitial) => {
    var _a;
    const playerConfig = (_a = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]) === null || _a === void 0 ? void 0 : _a.config;
    if (playerConfig !== undefined) {
        if (playerConfig.value === 3) {
            const stack = [StackData.upgradeCoinVidofnirVedrfolnir(2, coinId)];
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
        if (playerConfig.value !== undefined) {
            UpgradeCoinAction(G, ctx, playerConfig.value, coinId, type, isInitial);
        }
        else {
            // TODO Error logging!
        }
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].config'.`);
    }
};
//# sourceMappingURL=CampActions.js.map