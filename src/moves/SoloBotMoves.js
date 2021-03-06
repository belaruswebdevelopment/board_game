import { INVALID_MOVE } from "boardgame.io/core";
import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { AddHeroCardToPlayerHeroCards } from "../helpers/HeroCardHelpers";
import { IsValidMove } from "../MoveValidator";
import { ErrorNames, StageNames } from "../typescript/enums";
// TODO Add all solo bot moves!
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
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.PickHeroSoloBot, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const hero = G.heroesForSoloBot[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
};
/**
 * <h3>Выкладка монет соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Когда соло боту нужно выложить все монеты на игровой планшет.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param coinsOrder Порядок выкладки монет.
 * @returns
 */
export const SoloBotPlaceAllCoinsMove = (G, ctx, coinsOrder) => {
    const isValidMove = ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer
        && IsValidMove(G, ctx, StageNames.Default4, coinsOrder);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const player = G.publicPlayers[Number(ctx.currentPlayer)], privatePlayer = G.players[Number(ctx.currentPlayer)];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPublicPlayerIsUndefined, ctx.currentPlayer);
    }
    if (privatePlayer === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.CurrentPrivatePlayerIsUndefined, ctx.currentPlayer);
    }
    const handCoins = privatePlayer.handCoins;
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin = handCoins[i];
        if (handCoin === undefined) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке отсутствует монета с id '${i}'.`);
        }
        if (handCoin === null) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(handCoin) && handCoin.isOpened) {
            throw new Error(`В массиве монет соло бота с id '${ctx.currentPlayer}' в руке не может быть ранее открыта монета с id '${i}'.`);
        }
        privatePlayer.boardCoins[i] = handCoin;
        player.boardCoins[i] = {};
        handCoins[i] = null;
        player.handCoins[i] = null;
    }
};
//# sourceMappingURL=SoloBotMoves.js.map