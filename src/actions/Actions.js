import { CreateCard, DiscardCardFromTavern, RusCardTypes } from "../Card";
import { DrawCurrentProfit, PickCurrentHero, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
import { AddCardToPlayer } from "../Player";
import { AddBuffToPlayerCampAction, AddCampCardToCardsAction, AddCoinToPouchAction, CheckPickDiscardCardCampAction, DiscardAnyCardFromPlayerBoardAction, DiscardSuitCardAction, DiscardTradingCoinAction, DrawProfitCampAction, GetMjollnirProfitAction, PickDiscardCardCampAction, PickHeroCampAction, StartDiscardSuitCardAction, StartVidofnirVedrfolnirAction, UpgradeCoinCampAction, UpgradeCoinVidofnirVedrfolnirAction } from "./CampActions";
import { DrawProfitCoinAction, UpgradeCoinActionCardAction } from "./CoinActions";
import { AddBuffToPlayerHeroAction, AddHeroToCardsAction, CheckDiscardCardsFromPlayerBoardAction, CheckPickCampCardAction, CheckPickDiscardCardHeroAction, DiscardCardsFromPlayerBoardAction, DrawProfitHeroAction, GetClosedCoinIntoPlayerHandAction, PickDiscardCardHeroAction, PickHeroWithConditionsAction, PlaceCardsAction, PlaceHeroAction, UpgradeCoinHeroAction } from "./HeroActions";
/**
 * <h3>Перечисление для типов карт.</h3>
 */
export var DrawNames;
(function (DrawNames) {
    DrawNames["AddCoinToPouchVidofnirVedrfolnir"] = "Add coin to pouch Vidofnir Vedrfolnir";
    DrawNames["Aegur"] = "Aegur";
    DrawNames["Andumia"] = "Andumia";
    DrawNames["Aral"] = "Aral";
    DrawNames["Astrid"] = "Astrid";
    DrawNames["Bonfur"] = "Bonfur";
    DrawNames["Brisingamens"] = "Brisingamens";
    DrawNames["BrisingamensEndGame"] = "Brisingamens end game";
    DrawNames["Dagda"] = "Dagda";
    DrawNames["DiscardTavernCard"] = "Discard tavern card";
    DrawNames["Dwerg_Aesir"] = "Dwerg_Aesir";
    DrawNames["Dwerg_Bergelmir"] = "Dwerg_Bergelmir";
    DrawNames["Dwerg_Jungir"] = "Dwerg_Jungir";
    DrawNames["Dwerg_Sigmir"] = "Dwerg_Sigmir";
    DrawNames["Dwerg_Ymir"] = "Dwerg_Ymir";
    DrawNames["EnlistmentMercenaries"] = "Enlistment Mercenaries";
    DrawNames["Mjollnir"] = "Mjollnir";
    DrawNames["GetMjollnirProfit"] = "getMjollnirProfit";
    DrawNames["Grid"] = "Grid";
    DrawNames["Holda"] = "Holda";
    DrawNames["Hourya"] = "Hourya";
    DrawNames["Idunn"] = "Idunn";
    DrawNames["Jarika"] = "Jarika";
    DrawNames["Khrad"] = "Khrad";
    DrawNames["Kraal"] = "Kraal";
    DrawNames["Lokdur"] = "Lokdur";
    DrawNames["Olwin"] = "Olwin";
    DrawNames["Pick\u0421ardByExplorerDistinction"] = "Pick card by Explorer distinction";
    DrawNames["PlaceEnlistmentMercenaries"] = "Place Enlistment Mercenaries";
    DrawNames["Skaa"] = "Skaa";
    DrawNames["StartOrPassEnlistmentMercenaries"] = "Start or Pass Enlistment Mercenaries";
    DrawNames["Tarah"] = "Tarah";
    DrawNames["Thrud"] = "Thrud";
    DrawNames["UpgradeCoin"] = "Upgrade coin";
    DrawNames["UpgradeCoinVidofnirVedrfolnir"] = "Upgrade coin Vidofnir Vedrfolnir";
    DrawNames["UpgradeCoinWarriorDistinction"] = "Upgrade coin Warrior distinction";
    DrawNames["Uline"] = "Uline";
    DrawNames["Ylud"] = "Ylud";
    DrawNames["Zolkur"] = "Zolkur";
    DrawNames["Zoral"] = "Zoral";
})(DrawNames || (DrawNames = {}));
;
/**
 * <h3>Диспетчер действий при их активации.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев выполняются последовательно их действия.</li>
 * <li>При выборе конкретных карт кэмпа выполняются последовательно их действия.</li>
 * <li>При выборе карт улучшения монет выполняются их действия.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param data Стэк.
 * @param args Дополнительные аргументы.
 */
export const ActionDispatcher = (G, ctx, data, ...args) => {
    let action;
    switch (data.action) {
        case AddBuffToPlayerCampAction.name:
            action = AddBuffToPlayerCampAction;
            break;
        case AddBuffToPlayerHeroAction.name:
            action = AddBuffToPlayerHeroAction;
            break;
        case AddCampCardToCardsAction.name:
            action = AddCampCardToCardsAction;
            break;
        case AddCoinToPouchAction.name:
            action = AddCoinToPouchAction;
            break;
        case AddHeroToCardsAction.name:
            action = AddHeroToCardsAction;
            break;
        case CheckDiscardCardsFromPlayerBoardAction.name:
            action = CheckDiscardCardsFromPlayerBoardAction;
            break;
        case CheckPickCampCardAction.name:
            action = CheckPickCampCardAction;
            break;
        case CheckPickDiscardCardHeroAction.name:
            action = CheckPickDiscardCardHeroAction;
            break;
        case CheckPickDiscardCardCampAction.name:
            action = CheckPickDiscardCardCampAction;
            break;
        case DrawProfitAction.name:
            action = DrawProfitAction;
            break;
        case DrawProfitCampAction.name:
            action = DrawProfitCampAction;
            break;
        case DrawProfitCoinAction.name:
            action = DrawProfitCoinAction;
            break;
        case DrawProfitHeroAction.name:
            action = DrawProfitHeroAction;
            break;
        case DiscardAnyCardFromPlayerBoardAction.name:
            action = DiscardAnyCardFromPlayerBoardAction;
            break;
        case DiscardCardsFromPlayerBoardAction.name:
            action = DiscardCardsFromPlayerBoardAction;
            break;
        case DiscardCardFromTavernAction.name:
            action = DiscardCardFromTavernAction;
            break;
        case DiscardSuitCardAction.name:
            action = DiscardSuitCardAction;
            break;
        case DiscardTradingCoinAction.name:
            action = DiscardTradingCoinAction;
            break;
        case GetClosedCoinIntoPlayerHandAction.name:
            action = GetClosedCoinIntoPlayerHandAction;
            break;
        case GetEnlistmentMercenariesAction.name:
            action = GetEnlistmentMercenariesAction;
            break;
        case GetMjollnirProfitAction.name:
            action = GetMjollnirProfitAction;
            break;
        case PassEnlistmentMercenariesAction.name:
            action = PassEnlistmentMercenariesAction;
            break;
        case PickDiscardCardCampAction.name:
            action = PickDiscardCardCampAction;
            break;
        case PickDiscardCardHeroAction.name:
            action = PickDiscardCardHeroAction;
            break;
        case PickHeroAction.name:
            action = PickHeroAction;
            break;
        case PickHeroCampAction.name:
            action = PickHeroCampAction;
            break;
        case PickHeroWithConditionsAction.name:
            action = PickHeroWithConditionsAction;
            break;
        case PlaceCardsAction.name:
            action = PlaceCardsAction;
            break;
        case PlaceEnlistmentMercenariesAction.name:
            action = PlaceEnlistmentMercenariesAction;
            break;
        case PlaceHeroAction.name:
            action = PlaceHeroAction;
            break;
        case StartDiscardSuitCardAction.name:
            action = StartDiscardSuitCardAction;
            break;
        case StartVidofnirVedrfolnirAction.name:
            action = StartVidofnirVedrfolnirAction;
            break;
        case UpgradeCoinAction.name:
            action = UpgradeCoinAction;
            break;
        case UpgradeCoinActionCardAction.name:
            action = UpgradeCoinActionCardAction;
            break;
        case UpgradeCoinCampAction.name:
            action = UpgradeCoinCampAction;
            break;
        case UpgradeCoinHeroAction.name:
            action = UpgradeCoinHeroAction;
            break;
        case UpgradeCoinVidofnirVedrfolnirAction.name:
            action = UpgradeCoinVidofnirVedrfolnirAction;
            break;
        default:
            action = null;
    }
    action === null || action === void 0 ? void 0 : action(G, ctx, data.config, ...args);
};
/**
 * <h3>Сбрасывает карту из таверны по выбору игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Применяется при выборе первым игроком карты из кэмпа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const DiscardCardFromTavernAction = (G, ctx, config, cardId) => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту из таверны:`);
    DiscardCardFromTavern(G, cardId);
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с отрисовкой профита от игровых моментов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawProfitAction = (G, ctx, config) => {
    DrawCurrentProfit(G, ctx, config);
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
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const GetEnlistmentMercenariesAction = (G, ctx, config, cardId) => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card) => card.type === RusCardTypes.MERCENARY)[cardId];
    const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' выбрал наёмника '${pickedCard.name}'.`);
        const stack = [
            {
                action: DrawProfitCampAction.name,
                config: {
                    name: `placeEnlistmentMercenaries`,
                    drawName: DrawNames.PlaceEnlistmentMercenaries,
                },
            },
        ];
        EndActionFromStackAndAddNew(G, ctx, stack);
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
    }
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
    EndActionFromStackAndAddNew(G, ctx);
};
/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const PickHeroAction = (G, ctx, config) => {
    PickCurrentHero(G, ctx, config);
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
 * @param config Конфиг действий героя.
 * @param suit Название фракции.
 */
export const PlaceEnlistmentMercenariesAction = (G, ctx, config, suit) => {
    const pickedCard = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        if (`stack` in pickedCard && `tier` in pickedCard && `path` in pickedCard) {
            if (pickedCard.stack[0].variants !== undefined) {
                const mercenaryCard = CreateCard({
                    type: RusCardTypes.MERCENARY,
                    suit,
                    rank: 1,
                    points: pickedCard.stack[0].variants[suit].points,
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
                    const stack = [
                        {
                            action: DrawProfitCampAction.name,
                            config: {
                                name: `enlistmentMercenaries`,
                                drawName: DrawNames.EnlistmentMercenaries,
                            },
                        },
                    ];
                    AddActionsToStackAfterCurrent(G, ctx, stack);
                }
                CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
                EndActionFromStackAndAddNew(G, ctx, [], suit);
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
 * <h3>Действия, связанные с улучшением монет при игровых моментах.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li><li>При игровых моментах, улучшающих монеты.</li></li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCoinAction = (G, ctx, config, ...args) => {
    UpgradeCurrentCoin(G, ctx, config, ...args);
};
