import { INVALID_MOVE } from "boardgame.io/core";
import { IsCoin } from "../Coin";
import { AddHeroCardToPlayerHeroCards } from "../helpers/HeroCardHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
// TODO Add all solo bot moves!
/**
 * <h3>Выкладка монет соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns
 */
export const SoloBotPlaceAllCoinsMove = (G, ctx) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default4);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const handCoins = privatePlayer.handCoins;
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${i}'.`);
        }
        if (IsCoin(handCoin) && handCoin.isOpened) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${i}'.`);
        }
        privatePlayer.boardCoins[i] = handCoin;
        handCoins[i] = null;
    }
};
/**
 * <h3>Выбор героя соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При необходимости выбора героя соло ботом.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param heroId Id героя.
 * @returns
 */
export const SoloBotClickHeroCardMove = (G, ctx, heroId) => {
    const isValidMove = ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.PickHeroSoloBot, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const hero = G.heroesForSoloBot[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
};
//# sourceMappingURL=SoloBotMoves.js.map