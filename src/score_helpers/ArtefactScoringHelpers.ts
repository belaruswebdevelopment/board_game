import { IsCoin } from "../Coin";
import { ThrowMyError } from "../Error";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { IsMercenaryPlayerCampCard } from "../helpers/IsCampTypeHelpers";
import { BuffNames, ErrorNames, SuitNames } from "../typescript/enums";
import type { CanBeUndefType, IArtefactScoringFunction, IBuffs, IPublicPlayer, MyFnContext, PublicPlayerCoinType } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по артефактам, не имеющим специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефактам, не имеющим специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param G
 * @param value Значение очков артефакта.
 * @returns Количество очков по конкретному артефакту.
 */
export const BasicArtefactScoring: IArtefactScoringFunction = ({ G, ctx, playerID, ...rest }: MyFnContext,
    value?: number): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    if (value === undefined) {
        throw new Error(`Function param 'value' is undefined.`);
    }
    return value;
};

/**
 * <h3>Получение победных очков по артефакту Draupnir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Draupnir.</li>
 * </ol>
 *
 * @param G
 * @returns Количество очков по конкретному артефакту.
 */
export const DraupnirScoring: IArtefactScoringFunction = ({ G, ctx, playerID, ...rest }: MyFnContext): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    return player.boardCoins.filter((coin: PublicPlayerCoinType, index: number): boolean => {
        if (coin !== null && (!IsCoin(coin) || !coin.isOpened)) {
            throw new Error(`В массиве монет игрока '${player.nickname}' на столе не может быть закрыта монета с id '${index}'.`);
        }
        return IsCoin(coin) && coin.value >= 15;
    }).length * 6;
};

/**
 * <h3>Получение победных очков по артефакту Hrafnsmerki.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Hrafnsmerki.</li>
 * </ol>
 *
 * @param G
 * @param player Игрок.
 * @returns Количество очков по конкретному артефакту.
 */
export const HrafnsmerkiScoring: IArtefactScoringFunction = ({ G, ctx, playerID, ...rest }: MyFnContext): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    let score = 0,
        suit: SuitNames;
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    for (suit in player.cards) {
        score += player.cards[suit].filter(IsMercenaryPlayerCampCard).length * 5;
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
 * @param player Игрок.
 * @returns Количество очков по конкретному артефакту.
 */
export const MjollnirScoring: IArtefactScoringFunction = ({ G, ctx, playerID, ...rest }: MyFnContext): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    const suit: CanBeUndefType<SuitNames> = player.buffs.find((buff: IBuffs): boolean =>
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
 * @returns Количество очков по конкретному артефакту.
 */
export const OdroerirTheMythicCauldronScoring: IArtefactScoringFunction = ({ G, ...rest }: MyFnContext): number =>
    GetOdroerirTheMythicCauldronCoinsValues({ G, ...rest });

/**
 * <h3>Получение победных очков по артефакту Svalinn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Svalinn.</li>
 * </ol>
 *
 * @param G
 * @returns Количество очков по конкретному артефакту.
 */
export const SvalinnScoring: IArtefactScoringFunction = ({ G, ctx, playerID, ...rest }: MyFnContext): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    return player.heroes.length * 5;
};
