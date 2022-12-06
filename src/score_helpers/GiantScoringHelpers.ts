import { ThrowMyError } from "../Error";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { ErrorNames, GiantNames, RusCardTypeNames } from "../typescript/enums";
import type { CanBeNullType, CanBeUndefType, IDwarfCard, IGiantCard, IGiantScoringFunction, IPublicPlayer, MyFnContextWithMyPlayerID, MythologicalCreatureCommandZoneCardType } from "../typescript/interfaces";

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
export const BasicGiantScoring: IGiantScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    value?: number): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
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
 * @param player Игрок.
 * @returns Количество очков по конкретному гиганту.
 */
export const GymirScoring: IGiantScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const gymirCard: CanBeUndefType<IGiantCard> =
        player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType): boolean =>
            card.name === GiantNames.Gymir) as IGiantCard;
    if (gymirCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${RusCardTypeNames.Giant_Card}' с названием '${GiantNames.Gymir}'.`);
    }
    const capturedGymirCard: CanBeNullType<IDwarfCard> = gymirCard.capturedCard;
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
 * @param player Игрок.
 * @returns Количество очков по конкретному гиганту.
 */
export const SurtScoring: IGiantScoringFunction = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const surtCard: CanBeUndefType<IGiantCard> =
        player.mythologicalCreatureCards.find((card: MythologicalCreatureCommandZoneCardType): boolean =>
            card.name === GiantNames.Surt) as IGiantCard;
    if (surtCard === undefined) {
        throw new Error(`У игрока '${player.nickname}' не может отсутствовать карта с типом '${RusCardTypeNames.Giant_Card}' с названием '${GiantNames.Surt}'.`);
    }
    const capturedSurtCard: CanBeNullType<IDwarfCard> = surtCard.capturedCard;
    if (capturedSurtCard === null) {
        return 0;
    }
    return GetMaxCoinValue({ G, ctx, myPlayerID, ...rest });
};
