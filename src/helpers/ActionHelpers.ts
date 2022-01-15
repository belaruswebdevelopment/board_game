import { Ctx } from "boardgame.io";
import { DrawProfitAction, DiscardCardFromTavernAction } from "../actions/Actions";
import { CheckPickDiscardCardCampAction, DrawProfitCampAction, PickDiscardCardCampAction } from "../actions/CampActions";
import { isCardNotAction } from "../Card";
import { UpgradeCoin } from "../Coin";
import { AddDataToLog } from "../Logging";
import { IConfig, IStack } from "../typescript/action_interfaces";
import { DeckCardTypes } from "../typescript/card_types";
import { ActionTypes, ConfigNames, DrawNames, LogTypes, Stages } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { ArgsTypes } from "../typescript/types";
import { StartActionFromStackOrEndActions } from "./ActionDispatcherHelpers";
import { AddCardToPlayer } from "./CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
import { AddActionsToStack, AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "./StackHelpers";

/**
 * <h3>Действия, связанные с добавлением бафов игроку.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, добавляющих бафы игроку.</li>
 * <li>При выборе конкретных артефактов, добавляющих бафы игроку.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const AddBuffToPlayer = (G: IMyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.buff !== undefined) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs[config.buff.name] = config.buff.value;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} получил баф '${config.buff.name}'.`);
        EndActionFromStackAndAddNew(G, ctx);
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'config.buff'.`);
    }
};

/**
 * <h3>Действия, связанные с отрисовкой профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * <li>При выборе конкретных карт кэмпа, дающих профит.</li>
 * <li>При выборе конкретных карт улучшения монет, дающих профит.</li>
 * <li>При игровых моментах, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const DrawCurrentProfit = (G: IMyGameState, ctx: Ctx, config: IConfig): void => {
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен получить преимущества от действия '${config.drawName}'.`);
    IsStartActionStage(G, ctx, config);
    G.actionsNum = config.number ?? 1;
    if (config.name !== undefined) {
        G.drawProfit = config.name;
    } else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'config.name'.`);
    }
};

/**
 * <h3>Действия, связанные со стартом стэйджа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале экшенов, требующих старта стэйджа.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 * @returns Стартанул ли стэйдж.
 */
export const IsStartActionStage = (G: IMyGameState, ctx: Ctx, config: IConfig): boolean => {
    if (config.stageName !== undefined) {
        ctx.events?.setStage(config.stageName);
        AddDataToLog(G, LogTypes.GAME, `Начало стэйджа ${config.stageName}.`);
        return true;
    }
    return false;
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
 * @param config Конфиг действий героя.
 * @param cardId Id карты.
 */
export const PickDiscardCard = (G: IMyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    // TODO Rework all COMMON for heroes and camp actions in two logic?
    const isAdded: boolean = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]),
        pickedCard: DeckCardTypes = G.discardCardsDeck.splice(cardId, 1)[0];
    let suit: string | null = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${pickedCard.name} из дискарда.`);
    if (G.actionsNum === 2) {
        const stack: IStack[] = [
            {
                action: {
                    name: CheckPickDiscardCardCampAction.name,
                    type: ActionTypes.Camp,
                },
            },
            {
                action: {
                    name: DrawProfitCampAction.name,
                    type: ActionTypes.Camp,
                },
                config: {
                    stageName: Stages.PickDiscardCard,
                    name: ConfigNames.BrisingamensAction,
                    drawName: DrawNames.Brisingamens,
                },
            },
            {
                action: {
                    name: PickDiscardCardCampAction.name,
                    type: ActionTypes.Camp,
                },
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
            suit = pickedCard.suit;
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    EndActionFromStackAndAddNew(G, ctx, [], suit);
};

/**
 * <h3>Действия, связанные с взятием героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе карт кэмпа, дающих возможность взять карту героя.</li>
 * <li>При игровых моментах, дающих возможность взять карту героя.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
export const PickCurrentHero = (G: IMyGameState, ctx: Ctx, config: IConfig): void => {
    const isStartPickHero: boolean = IsStartActionStage(G, ctx, config);
    if (isStartPickHero) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен пикнуть героя.`);
    } else {
        if (config.stageName === undefined) {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.stageName'.`);
        }
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не стартовал стэйдж 'PickHero'.`);
    }
};

/**
 * <h3>Действия, связанные с дискардом карты из таверны при пике карты кэмпа при игре на 2-х игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выбора карт кэмпа, если играет 2-а игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardCardFromTavernActionFor2Players = (G: IMyGameState, ctx: Ctx) => {
    const stack: IStack[] = [
        {
            action: {
                name: DrawProfitAction.name,
                type: ActionTypes.Action,
            },
            config: {
                stageName: Stages.DiscardCard,
                name: ConfigNames.DiscardCard,
                drawName: DrawNames.DiscardTavernCard,
            },
        },
        {
            action: {
                name: DiscardCardFromTavernAction.name,
                type: ActionTypes.Action,
            },
        },
    ];
    AddActionsToStack(G, ctx, stack);
    StartActionFromStackOrEndActions(G, ctx, false);
};

/**
 * <h3>Действия, связанные с улучшением монет.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, улучшающих монеты.</li>
 * <li>При выборе карт, улучшающих монеты.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя или карты улучшающей монеты.
 * @param args Дополнительные аргументы.
 */
export const UpgradeCurrentCoin = (G: IMyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
    UpgradeCoin(G, ctx, config, ...args as [number, string, boolean]);
    EndActionFromStackAndAddNew(G, ctx);
};
