import { CreateOlwinDoubleNonPlacedCard } from "../Hero";
import { AddDataToLog } from "../Logging";
import { CardNames, DrawNames, HeroNames, LogTypes } from "../typescript/enums";
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
        throw new Error(`В массиве игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const config = (_a = player.stack[0]) === null || _a === void 0 ? void 0 : _a.config;
    if (config !== undefined) {
        AddDataToLog(G, LogTypes.GAME, `Игрок '${player.nickname}' должен получить преимущества от действия '${config.drawName}'.`);
        StartOrEndActionStage(G, ctx, config);
        if (config.drawName === DrawNames.Olwin) {
            const pickedCard = player.pickedCard;
            if (pickedCard !== null
                && (pickedCard.name === HeroNames.Olwin || pickedCard.name === CardNames.OlwinsDouble)) {
                let suit = null;
                if (`suit` in pickedCard) {
                    suit = pickedCard.suit;
                }
                const olwinDouble = CreateOlwinDoubleNonPlacedCard({
                    suit,
                });
                player.pickedCard = olwinDouble;
            }
        }
        else if (config.drawName === DrawNames.EnlistmentMercenaries) {
            player.pickedCard = null;
        }
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
        AddDataToLog(G, LogTypes.GAME, `Начало стадии '${config.stageName}'.`);
    }
    else if (((_b = ctx.activePlayers) === null || _b === void 0 ? void 0 : _b[Number(ctx.currentPlayer)]) !== undefined) {
        (_c = ctx.events) === null || _c === void 0 ? void 0 : _c.endStage();
    }
};
//# sourceMappingURL=ActionHelpers.js.map