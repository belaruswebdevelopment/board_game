import { suitsConfig } from "../data/SuitData";
import { AddCardToPlayer, IConfig, IStack, PickedCardType } from "../Player";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { CreateCard, DiscardCardFromTavern, ICard, ICreateCard } from "../Card";
import { AddDataToLog, LogTypes } from "../Logging";
import { CampDeckCardTypes, MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import {
    AddBuffToPlayerHeroAction,
    AddHeroToCardsAction,
    CheckDiscardCardsFromPlayerBoardAction,
    CheckPickCampCardAction,
    CheckPickDiscardCardHeroAction,
    DiscardCardsFromPlayerBoardAction,
    // DrawProfitHeroAction,
    GetClosedCoinIntoPlayerHandAction,
    PickDiscardCardHeroAction,
    PickHeroWithConditionsAction,
    PlaceCardsAction,
    PlaceHeroAction,
    // UpgradeCoinHeroAction
} from "./HeroActions";
import {
    AddBuffToPlayerCampAction,
    AddCampCardToCardsAction,
    AddCoinToPouchAction,
    CheckPickDiscardCardCampAction,
    DiscardAnyCardFromPlayerBoardAction,
    DiscardSuitCardAction,
    DiscardTradingCoinAction,
    DrawProfitCampAction,
    GetMjollnirProfitAction,
    PickDiscardCardCampAction,
    PickHeroCampAction,
    StartDiscardSuitCardAction,
    StartVidofnirVedrfolnirAction,
    // UpgradeCoinCampAction,
    UpgradeCoinVidofnirVedrfolnirAction
} from "./CampActions";
import { PickCurrentHero } from "../helpers/ActionHelpers";
import { DrawProfitCoinAction } from "./CoinActions";
// import { DrawCurrentProfit } from "../helpers/ActionHelpers";
// import { UpgradeCoinAction } from "./CoinActions";

// todo Check my types
/**
 * <h3>Типы данных для рест аргументов функций.</h3>
 */
export type ArgsTypes = (string | number | boolean | null | object)[];

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
// export const DrawProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
//     DrawCurrentProfit(G, ctx, config);
// };

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
export const DiscardCardFromTavernAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} отправил в сброс карту из таверны:`);
    DiscardCardFromTavern(G, cardId);
    EndActionFromStackAndAddNew(G, ctx);
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
export const PassEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} пасанул во время фазы 'Enlistment Mercenaries'.`);
    EndActionFromStackAndAddNew(G, ctx);
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
export const GetEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`)[cardId];
    const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' выбрал наёмника '${pickedCard.name}'.`);
        const stack: IStack[] = [
            {
                action: DrawProfitCampAction.name,
                config: {
                    name: `placeEnlistmentMercenaries`,
                    drawName: `Place Enlistment Mercenaries`,
                },
            },
        ];
        EndActionFromStackAndAddNew(G, ctx, stack);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
    }
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
 * @param suitId Id фракции.
 */
export const PlaceEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, suitId: number): void => {
    const suit: string = Object.keys(suitsConfig)[suitId],
        pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        if (`stack` in pickedCard && `tier` in pickedCard && `path` in pickedCard) {
            if (pickedCard.stack[0].variants !== undefined) {
                const mercenaryCard: ICard = CreateCard({
                    type: `наёмник`,
                    suit,
                    rank: 1,
                    points: pickedCard.stack[0].variants[suit].points,
                    name: pickedCard.name,
                    tier: pickedCard.tier,
                    path: pickedCard.path,
                } as ICreateCard);
                AddCardToPlayer(G, ctx, mercenaryCard);
                AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' завербовал наёмника '${mercenaryCard.name}'.`);
                const cardIndex: number = G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .findIndex((card: CampDeckCardTypes): boolean => card.name === pickedCard.name);
                G.publicPlayers[Number(ctx.currentPlayer)].campCards.splice(cardIndex, 1);
                if (G.publicPlayers[Number(ctx.currentPlayer)].campCards
                    .filter((card: CampDeckCardTypes): boolean => card.type === `наёмник`).length) {
                    const stack: IStack[] = [
                        {
                            action: DrawProfitCampAction.name,
                            config: {
                                name: `enlistmentMercenaries`,
                                drawName: `Enlistment Mercenaries`,
                            },
                        },
                    ];
                    AddActionsToStackAfterCurrent(G, ctx, stack);
                }
                CheckAndMoveThrudOrPickHeroAction(G, ctx, mercenaryCard);
                EndActionFromStackAndAddNew(G, ctx, [], suitId);
            } else {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'stack[0].variants'.`);
            }
        } else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Вместо карты наёмника пикнута карта другого типа.`);
        }
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не пикнута карта наёмника.`);
    }
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
export const PickHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
    PickCurrentHero(G, ctx, config);
};

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
export const ActionDispatcher = (G: MyGameState, ctx: Ctx, data: IStack, ...args: ArgsTypes): void => {
    let action: Function | null;
    switch (data.action) {
        // case DrawProfitHeroAction.name:
        //     action = DrawProfitHeroAction;
        //     break;
        case DrawProfitCampAction.name:
            action = DrawProfitCampAction;
            break;
        case DrawProfitCoinAction.name:
            action = DrawProfitCoinAction;
            break;
        // case UpgradeCoinHeroAction.name:
        //     action = UpgradeCoinHeroAction;
        //     break;
        // case UpgradeCoinCampAction.name:
        //     action = UpgradeCoinCampAction;
        //     break;
        // case UpgradeCoinAction.name:
        //     action = UpgradeCoinAction;
        //     break;
        case AddHeroToCardsAction.name:
            action = AddHeroToCardsAction;
            break;
        case AddBuffToPlayerHeroAction.name:
            action = AddBuffToPlayerHeroAction;
            break;
        case AddBuffToPlayerCampAction.name:
            action = AddBuffToPlayerCampAction;
            break;
        case PickHeroWithConditionsAction.name:
            action = PickHeroWithConditionsAction;
            break;
        case CheckDiscardCardsFromPlayerBoardAction.name:
            action = CheckDiscardCardsFromPlayerBoardAction;
            break;
        case DiscardCardsFromPlayerBoardAction.name:
            action = DiscardCardsFromPlayerBoardAction;
            break;
        case DiscardCardFromTavernAction.name:
            action = DiscardCardFromTavernAction;
            break;
        case PlaceCardsAction.name:
            action = PlaceCardsAction;
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
        case PickDiscardCardHeroAction.name:
            action = PickDiscardCardHeroAction;
            break;
        case PickDiscardCardCampAction.name:
            action = PickDiscardCardCampAction;
            break;
        case GetClosedCoinIntoPlayerHandAction.name:
            action = GetClosedCoinIntoPlayerHandAction;
            break;
        case PlaceHeroAction.name:
            action = PlaceHeroAction;
            break;
        case AddCampCardToCardsAction.name:
            action = AddCampCardToCardsAction;
            break;
        case PickHeroAction.name:
            action = PickHeroAction;
            break;
        case PickHeroCampAction.name:
            action = PickHeroCampAction;
            break;
        case AddCoinToPouchAction.name:
            action = AddCoinToPouchAction;
            break;
        case StartVidofnirVedrfolnirAction.name:
            action = StartVidofnirVedrfolnirAction;
            break;
        case UpgradeCoinVidofnirVedrfolnirAction.name:
            action = UpgradeCoinVidofnirVedrfolnirAction;
            break;
        case DiscardTradingCoinAction.name:
            action = DiscardTradingCoinAction;
            break;
        case StartDiscardSuitCardAction.name:
            action = StartDiscardSuitCardAction;
            break;
        case DiscardSuitCardAction.name:
            action = DiscardSuitCardAction;
            break;
        case DiscardAnyCardFromPlayerBoardAction.name:
            action = DiscardAnyCardFromPlayerBoardAction;
            break;
        case GetMjollnirProfitAction.name:
            action = GetMjollnirProfitAction;
            break;
        case PassEnlistmentMercenariesAction.name:
            action = PassEnlistmentMercenariesAction;
            break;
        case GetEnlistmentMercenariesAction.name:
            action = GetEnlistmentMercenariesAction;
            break;
        case PlaceEnlistmentMercenariesAction.name:
            action = PlaceEnlistmentMercenariesAction;
            break;
        default:
            action = null;
    }
    action?.(G, ctx, data.config, ...args);
};
