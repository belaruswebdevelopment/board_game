import { AfterBasicPickCardActions } from "./MovesHelpers";
import { AddCardToPlayer } from "../Player";
import { AddDataToLog, LogTypes } from "../Logging";
import { AddActionsToStackAfterCurrent, EndActionFromStackAndAddNew } from "./StackHelpers";
import { UpgradeCoin } from "../Coin";
import { CheckPickDiscardCardCampAction, DrawProfitCampAction, PickDiscardCardCampAction } from "../actions/CampActions";
import { isCardNotAction } from "../Card";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
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
export const AddBuffToPlayer = (G, ctx, config) => {
    if (config.buff !== undefined) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs[config.buff.name] = config.buff.value;
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} получил баф '${config.buff.name}'.`);
        EndActionFromStackAndAddNew(G, ctx);
    }
    else {
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
export const DrawCurrentProfit = (G, ctx, config) => {
    var _a;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен получить преимущества от действия '${config.drawName}'.`);
    IsStartActionStage(G, ctx, config);
    G.actionsNum = (_a = config.number) !== null && _a !== void 0 ? _a : 1;
    if (config.name !== undefined) {
        G.drawProfit = config.name;
    }
    else {
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не найден обязательный параметр 'config.name'.`);
    }
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
export const EndAction = (G, ctx, isTrading) => {
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
export const IsStartActionStage = (G, ctx, config) => {
    if (config.stageName !== undefined) {
        ctx.events.setStage(config.stageName);
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
export const PickDiscardCard = (G, ctx, config, cardId) => {
    // todo Rework all COMMON for heroes and camp actions in two logic?
    const isAdded = AddCardToPlayer(G, ctx, G.discardCardsDeck[cardId]), pickedCard = G.discardCardsDeck.splice(cardId, 1)[0];
    let suit = null;
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} добавил карту ${pickedCard.name} из дискарда.`);
    if (G.actionsNum === 2) {
        const stack = [
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
            suit = pickedCard.suit;
        }
    }
    else {
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
export const PickCurrentHero = (G, ctx, config) => {
    const isStartPickHero = IsStartActionStage(G, ctx, config);
    if (isStartPickHero) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен пикнуть героя.`);
    }
    else {
        if (config.stageName === undefined) {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не передан обязательный параметр 'config.stageName'.`);
        }
        AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не стартовал стэйдж 'PickHero'.`);
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
export const UpgradeCurrentCoin = (G, ctx, config, ...args) => {
    UpgradeCoin(G, ctx, config, ...args);
    EndActionFromStackAndAddNew(G, ctx);
};
