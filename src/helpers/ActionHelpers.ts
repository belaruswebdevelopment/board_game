import { Ctx } from "boardgame.io";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { IConfig } from "../typescript/action_interfaces";
import { IBuff, IBuffs } from "../typescript/buff_interfaces";
import { LogTypes } from "../typescript/enums";
import { IMyGameState } from "../typescript/game_data_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
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
 * @param buff Баф.
 * @param value Значение бафа.
 */
export const AddBuffToPlayer = (G: IMyGameState, ctx: Ctx, buff?: IBuff, value?: string): void => {
    if (buff !== undefined) {
        const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)];
        player.buffs.push({
            [buff.name]: value ?? true,
        });
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил баф '${buff.name}'.`);
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        buffIndex: number = player.buffs.findIndex((buff: IBuffs): boolean => buff[buffName] !== undefined);
    if (buffIndex !== -1) {
        player.buffs.splice(buffIndex, 1);
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} потерял баф '${buffName}'.`);
    } else {
        // TODO Log error?
    }
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
    const player: IPublicPlayer = G.publicPlayers[Number(ctx.currentPlayer)],
        config: IConfig | undefined = player.stack[0]?.config;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        player.actionsNum = config.number ?? 1;
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
