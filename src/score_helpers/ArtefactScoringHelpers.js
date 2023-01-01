import { ThrowMyError } from "../Error";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { IsMercenaryPlayerCampCard } from "../is_helpers/IsCampTypeHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { CommonBuffNames, ErrorNames, SuitNames } from "../typescript/enums";
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
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const BasicArtefactScoring = ({ G, ctx, myPlayerID, ...rest }, isFinal = false, value) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
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
export const DraupnirScoring = ({ G, ctx, myPlayerID, ...rest }, isFinal = false) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    if (isFinal) {
        return player.boardCoins.filter((coin, index) => {
            if (coin !== null && (!IsCoin(coin) || !coin.isOpened)) {
                throw new Error(`В массиве монет игрока '${player.nickname}' на столе не может быть закрыта монета с id '${index}'.`);
            }
            return IsCoin(coin) && coin.value >= 15;
        }).length * 6;
    }
    // TODO Fix: Add all hand/board coins for bots and players: public and how to count private!?
    return player.boardCoins.filter((coin, index) => {
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
export const HrafnsmerkiScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    let score = 0, suit;
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
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
export const MjollnirScoring = ({ G, ctx, myPlayerID, ...rest }, isFinal = false) => {
    var _a;
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let suit;
    if (isFinal) {
        suit = (_a = player.buffs.find((buff) => buff.suitIdForMjollnir !== undefined)) === null || _a === void 0 ? void 0 : _a.suitIdForMjollnir;
        if (suit === undefined) {
            throw new Error(`У игрока отсутствует обязательный баф '${CommonBuffNames.SuitIdForMjollnir}'.`);
        }
    }
    else {
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
export const OdroerirTheMythicCauldronScoring = ({ G, ...rest }) => GetOdroerirTheMythicCauldronCoinsValues({ G, ...rest });
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
export const SvalinnScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    return player.heroes.length * 5;
};
//# sourceMappingURL=ArtefactScoringHelpers.js.map