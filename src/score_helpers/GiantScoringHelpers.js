import { ThrowMyError } from "../Error";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { IsGiantCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { CardTypeRusNames, ErrorNames, GiantNames } from "../typescript/enums";
/**
 * <h3>Получение победных очков по Гиганту, не имеющим специфических вариантов подсчёта очков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту, не имеющему специфических вариантов подсчёта очков.</li>
 * </ol>
 *
 * @param context
 * @param value Значение.
 * @returns Количество очков по конкретному гиганту.
 */
export const BasicGiantScoring = ({ G, ctx, ...rest }, value) => {
    if (value === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.FunctionParamIsUndefined, `value`);
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
 * @param context
 * @returns Количество очков по конкретному гиганту.
 */
export const GymirScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const gymirCard = player.mythologicalCreatureCards.find((card) => card.name === GiantNames.Gymir);
    if (gymirCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${CardTypeRusNames.GiantCard}' с названием '${GiantNames.Gymir}'.`);
    }
    if (!IsGiantCard(gymirCard)) {
        throw new Error(`У игрока '${player.nickname}' не может присутствовать карта с типом '${gymirCard.type}' с названием '${GiantNames.Gymir}'.`);
    }
    const capturedGymirCard = gymirCard.capturedCard;
    if (capturedGymirCard === null) {
        return 0;
    }
    if (capturedGymirCard.points === null) {
        throw new Error(`У карты '${capturedGymirCard.name}' не могут отсутствовать очки.`);
    }
    return capturedGymirCard.points * 3;
};
/**
 * <h3>Получение победных очков по Гиганту Surt.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту Surt.</li>
 * </ol>
 *
 * @param context
 * @returns Количество очков по конкретному гиганту.
 */
export const SurtScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const surtCard = player.mythologicalCreatureCards.find((card) => card.name === GiantNames.Surt);
    if (surtCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${CardTypeRusNames.GiantCard}' с названием '${GiantNames.Surt}'.`);
    }
    if (!IsGiantCard(surtCard)) {
        throw new Error(`У игрока '${player.nickname}' не может присутствовать карта с типом '${surtCard.type}' с названием '${GiantNames.Surt}'.`);
    }
    const capturedSurtCard = surtCard.capturedCard;
    if (capturedSurtCard === null) {
        return 0;
    }
    return GetMaxCoinValue({ G, ctx, myPlayerID, ...rest });
};
//# sourceMappingURL=GiantScoringHelpers.js.map