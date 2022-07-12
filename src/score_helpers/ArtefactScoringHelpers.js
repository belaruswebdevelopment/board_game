import { IsMercenaryPlayerCard } from "../Camp";
import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { ArtefactNames, BuffNames, RusCardTypeNames } from "../typescript/enums";
import { TotalRank } from "./ScoreHelpers";
/**
* <h3>Получение победных очков по артефактам.</h3>
* <p>Применения:</p>
* <ol>
* <li>В конце игры, когда получаются победные очки по артефактам.</li>
* </ol>
*
* @param G
* @param player Игрок.
* @param artefactName Название артефакта.
* @returns Количество очков по артефактам.
*/
export const ArtefactScoring = (G, player, artefactName) => {
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (artefactName === undefined) {
        throw new Error(`Function param 'artefactName' is undefined.`);
    }
    switch (artefactName) {
        case ArtefactNames.Draupnir:
            return DraupnirScoring(G, player);
        case ArtefactNames.Hrafnsmerki:
            return HrafnsmerkiScoring(player);
        case ArtefactNames.Mjollnir:
            return MjollnirScoring(player);
        case ArtefactNames.Odroerir_The_Mythic_Cauldron:
            return OdroerirTheMythicCauldronScoring(G);
        case ArtefactNames.Svalinn:
            return SvalinnScoring(player);
        default:
            throw new Error(`У карт с типом '${RusCardTypeNames.Artefact_Card}' отсутствует ${RusCardTypeNames.Artefact_Card} с названием '${artefactName}'.`);
    }
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
export const DraupnirScoring = (G, player) => {
    const basicScore = player.boardCoins.filter((coin, index) => {
        if (coin !== null && (!IsCoin(coin) || !coin.isOpened)) {
            throw new Error(`В массиве монет игрока '${player.nickname}' в руке не может быть закрыта монета с id '${index}'.`);
        }
        return IsCoin(coin) && coin.value >= 15;
    }).length, odroerirScore = G.odroerirTheMythicCauldronCoins.filter((coin) => coin.value >= 15).length;
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
export const HrafnsmerkiScoring = (player) => {
    let score = 0, suit;
    for (suit in player.cards) {
        score += player.cards[suit].filter((card) => IsMercenaryPlayerCard(card)).length * 5;
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
export const MjollnirScoring = (player) => {
    var _a;
    const suit = (_a = player.buffs.find((buff) => buff.suitIdForMjollnir !== undefined)) === null || _a === void 0 ? void 0 : _a.suitIdForMjollnir;
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
export const OdroerirTheMythicCauldronScoring = (G) => GetOdroerirTheMythicCauldronCoinsValues(G);
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
export const SvalinnScoring = (player) => player.heroes.length * 5;
//# sourceMappingURL=ArtefactScoringHelpers.js.map