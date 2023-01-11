import { ThrowMyError } from "../Error";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { IsMercenaryPlayerCampCard } from "../is_helpers/IsCampTypeHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { CommonBuffNames, ErrorNames, SuitNames } from "../typescript/enums";
import type { ArtefactScoringFunction, CanBeUndefType, MyFnContextWithMyPlayerID, PlayerBuffs, PublicPlayer, PublicPlayerCoinType } from "../typescript/interfaces";
import { GetSuitValueWithMaxRanksValue, TotalRank } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по артефактам, не имеющим специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефактам, не имеющим специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param context
 * @param isFinal Является ли финальным подсчётом очков.
 * @param value Значение очков артефакта.
 * @returns Количество очков по конкретному артефакту.
 */
export const BasicArtefactScoring: ArtefactScoringFunction = ({ G, ctx, myPlayerID, ...rest }:
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    MyFnContextWithMyPlayerID, isFinal = false, value?: number): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
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
 * @param context
 * @param isFinal Является ли финальным подсчётом очков.
 * @returns Количество очков по конкретному артефакту.
 */
export const DraupnirScoring: ArtefactScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    isFinal = false): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (isFinal) {
        return player.boardCoins.filter((coin: PublicPlayerCoinType, index: number): boolean => {
            if (coin !== null && (!IsCoin(coin) || !coin.isOpened)) {
                throw new Error(`В массиве монет игрока '${player.nickname}' на столе не может быть закрыта монета с id '${index}'.`);
            }
            return IsCoin(coin) && coin.value >= 15;
        }).length * 6;
    }
    // TODO Fix: Add all hand/board coins for bots and players: public and how to count private!?
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
 * @param context
 * @returns Количество очков по конкретному артефакту.
 */
export const HrafnsmerkiScoring: ArtefactScoringFunction = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    let score = 0,
        suit: SuitNames;
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
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
 * @param context
 * @param isFinal Является ли финальным подсчётом очков.
 * @returns Количество очков по конкретному артефакту.
 */
export const MjollnirScoring: ArtefactScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    isFinal = false): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let suit: CanBeUndefType<SuitNames>;
    if (isFinal) {
        suit = player.buffs.find((buff: PlayerBuffs): boolean =>
            buff.suitIdForMjollnir !== undefined)?.suitIdForMjollnir;
        if (suit === undefined) {
            throw new Error(`У игрока отсутствует обязательный баф '${CommonBuffNames.SuitIdForMjollnir}'.`);
        }
    } else {
        suit = GetSuitValueWithMaxRanksValue({ G, ctx, myPlayerID, ...rest });
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
 * @param context
 * @returns Количество очков по конкретному артефакту.
 */
export const OdroerirTheMythicCauldronScoring: ArtefactScoringFunction = ({ G, ...rest }: MyFnContextWithMyPlayerID):
    number => GetOdroerirTheMythicCauldronCoinsValues({ G, ...rest });

/**
 * <h3>Получение победных очков по артефакту Svalinn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Svalinn.</li>
 * </ol>
 *
 * @param context
 * @returns Количество очков по конкретному артефакту.
 */
export const SvalinnScoring: ArtefactScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    return player.heroes.length * 5;
};
