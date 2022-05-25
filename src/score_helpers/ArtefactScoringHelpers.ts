import { IsMercenaryPlayerCard } from "../Camp";
import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { BuffNames } from "../typescript/enums";
import type { CanBeUndef, IBuffs, ICoin, IMyGameState, IPublicPlayer, PlayerCardTypes, PublicPlayerCoinTypes, SuitTypes } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по артефакту Draupnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Draupnir.</li>
 * </ol>
 *
 * @param G
 * @param playerId Игрок.
 * @returns
 */
export const DraupnirScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    const basicScore: number =
        player.boardCoins.filter((coin: PublicPlayerCoinTypes, index: number): boolean => {
            if (coin !== null && (!IsCoin(coin) || !coin.isOpened)) {
                throw new Error(`В массиве монет игрока '${player.nickname}' в руке не может быть закрыта монета с id '${index}'.`);
            }
            return IsCoin(coin) && coin.value >= 15;
        }).length,
        odroerirScore: number = G.odroerirTheMythicCauldronCoins.filter((coin: ICoin): boolean =>
            coin.value >= 15).length;
    return (basicScore + odroerirScore) * 6;
};

/**
 * <h3>Получение победных очков по артефакту Hrafnsmerki.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Hrafnsmerki.</li>
 * </ol>
 *
 * @param G
 * @param playerId Игрок.
 * @returns
 */
export const HrafnsmerkiScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    let score = 0,
        suit: SuitTypes;
    for (suit in player.cards) {
        score += player.cards[suit].filter((card: PlayerCardTypes): boolean =>
            IsMercenaryPlayerCard(card)).length * 5;
    }
    return score;
};

/**
 * <h3>Получение победных очков по артефакту Mjollnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Mjollnir.</li>
 * </ol>
 *
 * @param G
 * @param playerId Игрок.
 * @returns
 */
export const MjollnirScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    const suit: CanBeUndef<SuitTypes> = player.buffs.find((buff: IBuffs): boolean =>
        buff.suitIdForMjollnir !== undefined)?.suitIdForMjollnir;
    if (suit === undefined) {
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.SuitIdForMjollnir}'.`);
    }
    return player.cards[suit].reduce(TotalRank, 0) * 2;
};

/**
 * <h3>Получение победных очков по артефакту Odroerir The Mythic Cauldron.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Odroerir The Mythic Cauldron.</li>
 * </ol>
 *
 * @param G
 * @param playerId Игрок.
 * @returns
 */
export const OdroerirTheMythicCauldronScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    return GetOdroerirTheMythicCauldronCoinsValues(G);
};

/**
 * <h3>Получение победных очков по артефакту Svalinn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Svalinn.</li>
 * </ol>
 *
 * @param G
 * @param playerId Игрок.
 * @returns
 */
export const SvalinnScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    return player.heroes.length * 5;
};
