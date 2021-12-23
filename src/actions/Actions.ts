import { Ctx } from "boardgame.io";
import { CreateCard, DiscardCardFromTavern, ICard, ICreateCard, RusCardTypes } from "../Card";
import { CampDeckCardTypes, MyGameState } from "../GameSetup";
import { DrawCurrentProfit, PickCurrentHero, UpgradeCurrentCoin } from "../helpers/ActionHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "../helpers/HeroHelpers";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "../helpers/StackHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
import { AddCardToPlayer, IConfig, IStack, PickedCardType } from "../Player";
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
    UpgradeCoinCampAction,
    UpgradeCoinVidofnirVedrfolnirAction
} from "./CampActions";
import { DrawProfitCoinAction, UpgradeCoinActionCardAction } from "./CoinActions";
import {
    AddBuffToPlayerHeroAction,
    AddHeroToCardsAction,
    CheckDiscardCardsFromPlayerBoardAction,
    CheckPickCampCardAction,
    CheckPickDiscardCardHeroAction,
    DiscardCardsFromPlayerBoardAction,
    DrawProfitHeroAction,
    GetClosedCoinIntoPlayerHandAction,
    PickDiscardCardHeroAction,
    PickHeroWithConditionsAction,
    PlaceCardsAction,
    PlaceHeroAction,
    UpgradeCoinHeroAction
} from "./HeroActions";

// todo Check my types
/**
 * <h3>Типы данных для рест аргументов функций.</h3>
 */
export type ArgsTypes = (string | number | boolean | null | object)[];

/**
 * <h3>Перечисление для типов карт.</h3>
 */
export const enum DrawNames {
    AddCoinToPouchVidofnirVedrfolnir = `Add coin to pouch Vidofnir Vedrfolnir`,
    Aegur = `Aegur`,
    Andumia = `Andumia`,
    Aral = `Aral`,
    Astrid = `Astrid`,
    Bonfur = `Bonfur`,
    Brisingamens = `Brisingamens`,
    BrisingamensEndGame = `Brisingamens end game`,
    Dagda = `Dagda`,
    DiscardTavernCard = `Discard tavern card`,
    Dwerg_Aesir = `Dwerg_Aesir`,
    Dwerg_Bergelmir = `Dwerg_Bergelmir`,
    Dwerg_Jungir = `Dwerg_Jungir`,
    Dwerg_Sigmir = `Dwerg_Sigmir`,
    Dwerg_Ymir = `Dwerg_Ymir`,
    EnlistmentMercenaries = `Enlistment Mercenaries`,
    Mjollnir = `Mjollnir`,
    GetMjollnirProfit = `getMjollnirProfit`,
    Grid = `Grid`,
    Holda = `Holda`,
    Hourya = `Hourya`,
    Idunn = `Idunn`,
    Jarika = `Jarika`,
    Khrad = `Khrad`,
    Kraal = `Kraal`,
    Lokdur = `Lokdur`,
    Olwin = `Olwin`,
    PickСardByExplorerDistinction = `Pick card by Explorer distinction`,
    PlaceEnlistmentMercenaries = `Place Enlistment Mercenaries`,
    Skaa = `Skaa`,
    StartOrPassEnlistmentMercenaries = `Start or Pass Enlistment Mercenaries`,
    Tarah = `Tarah`,
    Thrud = `Thrud`,
    UpgradeCoin = `Upgrade coin`,
    UpgradeCoinVidofnirVedrfolnir = `Upgrade coin Vidofnir Vedrfolnir`,
    UpgradeCoinWarriorDistinction = `Upgrade coin Warrior distinction`,
    Uline = `Uline`,
    Ylud = `Ylud`,
    Zolkur = `Zolkur`,
    Zoral = `Zoral`,
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
    action?.(G, ctx, data.config, ...args);
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
export const DiscardCardFromTavernAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
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
export const DrawProfitAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
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
export const GetEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    G.publicPlayers[Number(ctx.currentPlayer)].pickedCard =
        G.publicPlayers[Number(ctx.currentPlayer)].campCards
            .filter((card: CampDeckCardTypes): boolean => card.type === RusCardTypes.MERCENARY)[cardId];
    const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} во время фазы 'Enlistment Mercenaries' выбрал наёмника '${pickedCard.name}'.`);
        const stack: IStack[] = [
            {
                action: DrawProfitCampAction.name,
                config: {
                    name: `placeEnlistmentMercenaries`,
                    drawName: DrawNames.PlaceEnlistmentMercenaries,
                },
            },
        ];
        EndActionFromStackAndAddNew(G, ctx, stack);
    } else {
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
export const PassEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx): void => {
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
export const PickHeroAction = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
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
export const PlaceEnlistmentMercenariesAction = (G: MyGameState, ctx: Ctx, config: IConfig, suit: string): void => {
    const pickedCard: PickedCardType = G.publicPlayers[Number(ctx.currentPlayer)].pickedCard;
    if (pickedCard !== null) {
        if (`stack` in pickedCard && `tier` in pickedCard && `path` in pickedCard) {
            if (pickedCard.stack[0].variants !== undefined) {
                const mercenaryCard: ICard = CreateCard({
                    type: RusCardTypes.MERCENARY,
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
                    .filter((card: CampDeckCardTypes): boolean =>
                        card.type === RusCardTypes.MERCENARY).length) {
                    const stack: IStack[] = [
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
export const UpgradeCoinAction = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
    UpgradeCurrentCoin(G, ctx, config, ...args);
};
