import { ThrowMyError } from "../Error";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { IsGiantCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { CardTypeRusNames, ErrorNames, GiantNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, DwarfCard, GiantScoringFunction, MyFnContextWithMyPlayerID, MythologicalCreatureCommandZoneCardType, PublicPlayer } from "../typescript/interfaces";

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
export const BasicGiantScoring: GiantScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    value?: number): number => {
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
 * <h3>Получение победных очков по Гиганту Gymir.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>В конце игры, когда получаются победные очки по Гиганту Gymir.</li>
 * </ol>
 *
 * @param context
 * @returns Количество очков по конкретному гиганту.
 */
export const GymirScoring: GiantScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const gymirCard: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
        player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType): boolean =>
            card.name === GiantNames.Gymir);
    if (gymirCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${CardTypeRusNames.GiantCard}' с названием '${GiantNames.Gymir}'.`);
    }
    if (!IsGiantCard(gymirCard)) {
        throw new Error(`У игрока '${player.nickname}' не может присутствовать карта с типом '${gymirCard.type}' с названием '${GiantNames.Gymir}'.`);
    }
    const capturedGymirCard: CanBeNullType<DwarfCard> = gymirCard.capturedCard;
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
export const SurtScoring: GiantScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const surtCard: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
        player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType): boolean =>
            card.name === GiantNames.Surt);
    if (surtCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${CardTypeRusNames.GiantCard}' с названием '${GiantNames.Surt}'.`);
    }
    if (!IsGiantCard(surtCard)) {
        throw new Error(`У игрока '${player.nickname}' не может присутствовать карта с типом '${surtCard.type}' с названием '${GiantNames.Surt}'.`);
    }
    const capturedSurtCard: CanBeNullType<DwarfCard> = surtCard.capturedCard;
    if (capturedSurtCard === null) {
        return 0;
    }
    return GetMaxCoinValue({ G, ctx, myPlayerID, ...rest });
};
