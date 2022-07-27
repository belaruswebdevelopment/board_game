import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { IsMercenaryPlayerCampCard } from "../helpers/IsCampTypeHelpers";
import { BuffNames } from "../typescript/enums";
import type { CanBeUndefType, IArtefactScoringFunction, IBuffs, ICoin, IMyGameState, IPublicPlayer, PublicPlayerCoinType, SuitNamesKeyofTypeofType } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

/**
 * <h3>Получение победных очков по артефактам, не имеющим специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефактам, не имеющим специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns
 */
export const BasicArtefactScoring: IArtefactScoringFunction = (G: IMyGameState, player: IPublicPlayer, value?: number):
    number => {
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
 * @param player Игрок.
 * @returns
 */
export const DraupnirScoring: IArtefactScoringFunction = (G: IMyGameState, player: IPublicPlayer): number => {
    // Rework to playerId?
    const basicScore: number =
        player.boardCoins.filter((coin: PublicPlayerCoinType, index: number): boolean => {
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
 * @param player Игрок.
 * @returns
 */
export const HrafnsmerkiScoring: IArtefactScoringFunction = (G: IMyGameState, player: IPublicPlayer): number => {
    let score = 0,
        suit: SuitNamesKeyofTypeofType;
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
 * @param player Игрок.
 * @returns
 */
export const MjollnirScoring: IArtefactScoringFunction = (G: IMyGameState, player: IPublicPlayer): number => {
    const suit: CanBeUndefType<SuitNamesKeyofTypeofType> = player.buffs.find((buff: IBuffs): boolean =>
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
 * @returns
 */
export const OdroerirTheMythicCauldronScoring: IArtefactScoringFunction = (G: IMyGameState): number =>
    GetOdroerirTheMythicCauldronCoinsValues(G);

/**
 * <h3>Получение победных очков по артефакту Svalinn.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по артефакту Svalinn.</li>
 * </ol>
 *
 * @param G
 * @param player Игрок.
 * @returns
 */
export const SvalinnScoring: IArtefactScoringFunction = (G: IMyGameState, player: IPublicPlayer): number =>
    player.heroes.length * 5;
