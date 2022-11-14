import { ThrowMyError } from "../Error";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { ErrorNames, GiantNames, RusCardTypeNames } from "../typescript/enums";
/**
 * <h3>Получение победных очков по Гиганту, не имеющим специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному гиганту.
 */
export const BasicGiantScoring = ({ G, ctx, playerID, ...rest }, value) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    if (value === undefined) {
        throw new Error(`Function param 'value' is undefined.`);
    }
    return value;
};
/**
 * <h3>Получение победных очков по Гиганту Gymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту Gymir.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному гиганту.
 */
export const GymirScoring = ({ G, ctx, playerID, ...rest }) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    const gymirCard = player.mythologicalCreatureCards.find((card) => card.name === GiantNames.Gymir);
    if (gymirCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${RusCardTypeNames.Giant_Card}' с названием '${GiantNames.Gymir}'.`);
    }
    const capturedGymirCard = gymirCard.capturedCard;
    if (capturedGymirCard === null) {
        return 0;
    }
    // TODO Rework "!"?
    return capturedGymirCard.points * 3;
};
/**
 * <h3>Получение победных очков по Гиганту Surt.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту Surt.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Количество очков по конкретному гиганту.
 */
export const SurtScoring = ({ G, ctx, playerID, ...rest }) => {
    const player = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerID);
    }
    const surtCard = player.mythologicalCreatureCards.find((card) => card.name === GiantNames.Surt);
    if (surtCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${RusCardTypeNames.Giant_Card}' с названием '${GiantNames.Surt}'.`);
    }
    const capturedSurtCard = surtCard.capturedCard;
    if (capturedSurtCard === null) {
        return 0;
    }
    return GetMaxCoinValue({ G, ctx, playerID, ...rest });
};
//# sourceMappingURL=GiantScoringHelpers.js.map