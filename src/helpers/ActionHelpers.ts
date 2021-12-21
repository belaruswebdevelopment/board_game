import { AfterBasicPickCardActions } from "./MovesHelpers";
import { DeckCardTypes, MyGameState } from "../GameSetup";
import { Ctx } from "boardgame.io";
import { AddCardToPlayer, IConfig, IStack } from "../Player";
import { AddDataToLog, LogTypes } from "../Logging";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "./StackHelpers";
import { UpgradeCoin } from "../Coin";
import { ArgsTypes } from "../actions/Actions";
import {
    CheckPickDiscardCardCampAction,
    DrawProfitCampAction,
    PickDiscardCardCampAction
} from "../actions/CampActions";
import { isCardNotAction } from "../Card";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
import { GetSuitIndexByName } from "./SuitHelpers";

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
export const PickDiscardCard = (G: MyGameState, ctx: Ctx, config: IConfig, cardId: number): void => {
    // todo Rework all COMMON for heroes and camp actions in two logic?
    const isAdded: boolean = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]),
        pickedCard: DeckCardTypes = G.discardCardsDeck.splice(cardId, 1)[0];
    let suitId: number | null = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${pickedCard.name} из дискарда.`);
    if (G.actionsNum === 2) {
        const stack: IStack[] = [
            {
                action: CheckPickDiscardCardCampAction.name,
            },
            {
                action: DrawProfitCampAction.name,
                config: {
                    stageName: `pickDiscardCard`,
                    name: `BrisingamensAction`,
                    drawName: `Brisingamens`,
                },
            },
            {
                action: PickDiscardCardCampAction.name,
            },
        ];
        AddActionsToStackAfterCurrent(G, ctx, stack);
    }
    if (isCardNotAction(pickedCard)) {
        if (isAdded) {
            CheckAndMoveThrudOrPickHeroAction(G, ctx, pickedCard);
            suitId = GetSuitIndexByName(pickedCard.suit);
            if (suitId === -1) {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найдена несуществующая фракция ${pickedCard.suit}.`);
            }
        }
    } else {
        AddActionsToStackAfterCurrent(G, ctx, pickedCard.stack);
    }
    EndActionFromStackAndAddNew(G, ctx, [], suitId);
};

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
export const AddBuffToPlayer = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
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
export const DrawCurrentProfit = (G: MyGameState, ctx: Ctx, config: IConfig): void => {
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
export const UpgradeCurrentCoin = (G: MyGameState, ctx: Ctx, config: IConfig, ...args: ArgsTypes): void => {
    UpgradeCoin(G, ctx, config, ...args as [number, string, boolean]);
    EndActionFromStackAndAddNew(G, ctx);
};

/**
 * <h3>Завершение текущего экшена.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Срабатывает после завершения каждого экшена.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param isTrading Является ли действие обменом монет (трейдингом).
 */
export const EndAction = (G: MyGameState, ctx: Ctx, isTrading: boolean): void => {
    AfterBasicPickCardActions(G, ctx, isTrading);
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
export const IsStartActionStage = (G: MyGameState, ctx: Ctx, config: IConfig): boolean => {
    if (config.stageName !== undefined) {
        ctx.events!.setStage!(config.stageName);
        AddDataToLog(G, LogTypes.GAME, `Начало стэйджа ${config.stageName}.`);
        return true;
    }
    return false;
};
