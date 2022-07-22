import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { ArtefactNames, BuffNames, RusCardTypeNames } from "../typescript/enums";
import type { CanBeUndef, IBuffs, ICoin, IMyGameState, IPublicPlayer, PlayerCardTypes, PublicPlayerCoinTypes, SuitKeyofTypes } from "../typescript/interfaces";
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
export const ArtefactScoring = (G?: IMyGameState, player?: IPublicPlayer, artefactName?: ArtefactNames): number => {
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
export const DraupnirScoring = (G: IMyGameState, player: IPublicPlayer): number => {
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
 * @param player Игрок.
 * @returns
 */
export const HrafnsmerkiScoring = (player: IPublicPlayer): number => {
    let score = 0,
        suit: SuitKeyofTypes;
    for (suit in player.cards) {
        score += player.cards[suit].filter((card: PlayerCardTypes): boolean =>
            card.type === RusCardTypeNames.Mercenary_Player_Card).length * 5;
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
export const MjollnirScoring = (player: IPublicPlayer): number => {
    const suit: CanBeUndef<SuitKeyofTypes> = player.buffs.find((buff: IBuffs): boolean =>
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
export const OdroerirTheMythicCauldronScoring = (G: IMyGameState): number => GetOdroerirTheMythicCauldronCoinsValues(G);

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
export const SvalinnScoring = (player: IPublicPlayer): number => player.heroes.length * 5;
