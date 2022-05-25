import type { Ctx, Move } from "boardgame.io";
import { INVALID_MOVE } from "boardgame.io/core";
import { IsCoin } from "../Coin";
import { AddHeroCardToPlayerHeroCards } from "../helpers/HeroCardHelpers";
import { IsValidMove } from "../MoveValidator";
import { Stages } from "../typescript/enums";
import type { CanBeUndef, CoinTypes, IHeroCard, IMyGameState, IPlayer, PublicPlayerCoinTypes } from "../typescript/interfaces";

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
export const SoloBotPlaceAllCoinsMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx): string | void => {
    const isValidMove: boolean =
        ctx.playerID === `1` && ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.Default4);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const privatePlayer: CanBeUndef<IPlayer> = G.players[Number(ctx.currentPlayer)];
    if (privatePlayer === undefined) {
        throw new Error(`В массиве приватных игроков отсутствует текущий игрок с id '${ctx.currentPlayer}'.`);
    }
    const handCoins: CoinTypes[] = privatePlayer.handCoins;
    for (let i = 0; i < handCoins.length; i++) {
        const handCoin: CanBeUndef<PublicPlayerCoinTypes> = handCoins[i];
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
export const SoloBotClickHeroCardMove: Move<IMyGameState> = (G: IMyGameState, ctx: Ctx, heroId: number):
    string | void => {
    const isValidMove: boolean =
        ctx.playerID === ctx.currentPlayer && IsValidMove(G, ctx, Stages.PickHeroSoloBot, heroId);
    if (!isValidMove) {
        return INVALID_MOVE;
    }
    const hero: CanBeUndef<IHeroCard> = G.heroesForSoloBot[heroId];
    if (hero === undefined) {
        throw new Error(`Не существует кликнутая карта героя с id '${heroId}'.`);
    }
    AddHeroCardToPlayerHeroCards(G, ctx, hero);
};
