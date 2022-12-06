import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, HeroBuffNames, HeroNames, LogTypeNames } from "../typescript/enums";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { CheckPickHero } from "./HeroHelpers";
/**
 * <h3>Проверяет необходимость завершения хода в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверке завершения любой фазы.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Должна ли быть завершена фаза.
 */
export const EndTurnActions = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    if (!player.stack.length) {
        return true;
    }
};
/**
 * <h3>Удаляет Труд в конце игры с поля игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце матча после всех игровых событий.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = ({ G, ctx, ...rest }) => {
    const thrudPlayerIndex = Object.values(G.publicPlayers).findIndex((player, index) => CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest }, HeroBuffNames.MoveThrud));
    if (thrudPlayerIndex !== -1) {
        const player = G.publicPlayers[thrudPlayerIndex];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, thrudPlayerIndex);
        }
        const playerCards = Object.values(player.cards).flat(), thrud = playerCards.find((card) => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex = player.cards[thrud.suit].findIndex((card) => card.name === HeroNames.Thrud);
            if (thrudIndex === -1) {
                throw new Error(`У игрока с id '${thrudPlayerIndex}' отсутствует обязательная карта героя '${HeroNames.Thrud}'.`);
            }
            player.cards[thrud.suit].splice(thrudIndex, 1);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Герой '${HeroNames.Thrud}' игрока '${player.nickname}' уходит с игрового поля.`);
        }
    }
};
/**
 * <h3>Действия старта или завершения действий при завершении мува в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в любой фазе.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const StartOrEndActions = ({ G, ctx, myPlayerID, ...rest }) => {
    var _a, _b, _c, _d;
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.CurrentPublicPlayerIsUndefined, myPlayerID);
    }
    if (ctx.activePlayers === null || ((_a = ctx.activePlayers) === null || _a === void 0 ? void 0 : _a[Number(myPlayerID)]) !== undefined) {
        player.stack.shift();
        if ((((_b = player.stack[0]) === null || _b === void 0 ? void 0 : _b.priority) === undefined)
            || (((_c = player.stack[0]) === null || _c === void 0 ? void 0 : _c.priority) !== undefined && ((_d = player.stack[0]) === null || _d === void 0 ? void 0 : _d.priority) > 1)) {
            CheckPickHero({ G, ctx, myPlayerID, ...rest });
        }
        DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
    }
};
//# sourceMappingURL=GameHooksHelpers.js.map