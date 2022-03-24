import { IsCardNotActionAndNotNull } from "../Card";
import { StackData } from "../data/StackData";
import { AddDataToLog } from "../Logging";
import { LogTypes } from "../typescript/enums";
import { AddCardToPlayer } from "./CardHelpers";
import { CheckAndMoveThrudOrPickHeroAction } from "./HeroHelpers";
import { AddActionsToStackAfterCurrent } from "./StackHelpers";
export const AddGetDistinctionsActionToStack = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.getDistinctions()]);
};
export const AddPickCardActionToStack = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.pickCard()]);
};
/**
 * <h3>Действия, связанные с отображением профита.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При выборе конкретных героев, дающих профит.</li>
 * <li>При выборе конкретных карт лагеря, дающих профит.</li>
 * <li>При выборе конкретных карт улучшения монет, дающих профит.</li>
 * <li>При игровых моментах, дающих профит.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const DrawCurrentProfit = (G, ctx) => {
    var _a, _b;
    const player = G.publicPlayers[Number(ctx.currentPlayer)];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует текущий игрок.`);
    }
    const config = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        player.actionsNum = (_b = config.number) !== null && _b !== void 0 ? _b : 1;
        if (config.name !== undefined) {
            G.drawProfit = config.name;
        }
        else {
            G.drawProfit = ``;
        }
    }
    else {
        G.drawProfit = ``;
    }
};
export const PickCardOrActionCardActions = (G, ctx, card) => {
    const isAdded = AddCardToPlayer(G, ctx, card);
    if (IsCardNotActionAndNotNull(card)) {
        if (isAdded) {
            CheckAndMoveThrudOrPickHeroAction(G, ctx, card);
        }
    }
    else {
        AddActionsToStackAfterCurrent(G, ctx, card.stack, card);
        G.discardCardsDeck.push(card);
    }
    return isAdded;
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
const StartOrEndActionStage = (G, ctx, config) => {
    var _a, _b, _c;
    if (config.stageName !== undefined) {
        (_a = ctx.events) === null || _a === void 0 ? void 0 : _a.setActivePlayers({
            currentPlayer: config.stageName,
        });
        AddDataToLog(G, LogTypes.GAME, `Начало стадии ${config.stageName}.`);
    }
    else if (((_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)]) !== undefined) {
        (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.endStage();
    }
};
/**
 * <h3>Действия, связанные с сбросом карты из таверны при выборе карты лагеря при игре на 2-х игроков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>После выбора карт лагеря, если играет 2-а игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 */
export const StartDiscardCardFromTavernActionFor2Players = (G, ctx) => {
    AddActionsToStackAfterCurrent(G, ctx, [StackData.discardTavernCard()]);
};
//# sourceMappingURL=ActionHelpers.js.map