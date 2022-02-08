import { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { IConfig } from "../typescript/action_interfaces";
import { IBuff, IBuffs } from "../typescript/buff_interfaces";
import { LogTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";

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
 * @param config Баф карты.
 */
export const AddBuffToPlayer = (G: IMyGameState, ctx: Ctx, buff?: IBuff): void => {
    if (buff !== undefined) {
        G.publicPlayers[Number(ctx.currentPlayer)].buffs = {
            [buff.name]: buff.value,
        };
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} получил баф '${buff.name}'.`);
    }
};

// TODO Rework it!?
export const AddGetDistinctionsActionToStack = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [{}]);
};

// TODO Rework it!?
export const AddPickCardActionToStack = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [{}]);
};

export const DeleteBuffFromPlayer = (G: IMyGameState, ctx: Ctx, buffName: keyof IBuffs): void => {
    delete G.publicPlayers[Number(ctx.currentPlayer)].buffs[buffName];
    AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} потерял баф '${buffName}'.`);
};

/**
 * <h3>Действия, связанные с отображением профита.</h3>
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
 */
export const DrawCurrentProfit = (G: IMyGameState, ctx: Ctx): void => {
    const config: IConfig | undefined = G.publicPlayers[Number(ctx.currentPlayer)].stack[0]?.config;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${G.publicPlayers[Number(ctx.currentPlayer)].nickname} должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        G.actionsNum = config.number ?? 1;
        if (config.name !== undefined) {
            G.drawProfit = config.name;
        } else {
            G.drawProfit = ``;
        }
    } else {
        G.drawProfit = ``;
    }
};

/**
 * <h3>Действия, связанные со стартом конкретной стадии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При начале действий, требующих старта конкретной стадии.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param config Конфиг действий героя.
 */
const StartOrEndActionStage = (G: IMyGameState, ctx: Ctx, config: IConfig): void => {
    if (config.stageName !== undefined) {
        ctx.events?.setStage(config.stageName);
        AddDataToLog(G, LogTypes.GAME, `Начало стадии ${config.stageName}.`);
    } else if (ctx.activePlayers !== null && ctx.activePlayers[Number(ctx.currentPlayer)]) {
        // TODO Is it need!?
        ctx.events?.endStage();
    }
};

/**
 * <h3>Действия, связанные с сбросом карты из таверны при выборе карты кэмпа при игре на 2-х игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выбора карт кэмпа, если играет 2-а игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardCardFromTavernActionFor2Players = (G: IMyGameState, ctx: Ctx): void => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.discardTavernCard()]);
};
