import { IsMercenaryPlayerCard } from "../Camp";
import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { BuffNames } from "../typescript/enums";
import type { IBuffs, IMyGameState, IPublicPlayer, PlayerCardsType, PublicPlayerBoardCoinTypes, SuitTypes } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

export const DraupnirScoring = (player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    return player.boardCoins.filter((coin: PublicPlayerBoardCoinTypes): boolean =>
        IsCoin(coin) && coin.value >= 15).length * 6;
};

export const HrafnsmerkiScoring = (player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    let score = 0,
        suit: SuitTypes;
    for (suit in player.cards) {
        if (Object.prototype.hasOwnProperty.call(player.cards, suit)) {
            score += player.cards[suit].filter((card: PlayerCardsType): boolean =>
                IsMercenaryPlayerCard(card)).length * 5;
        }
    }
    return score;
};

export const MjollnirScoring = (player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    const suit: SuitTypes | undefined = player.buffs.find((buff: IBuffs): boolean =>
        buff.suitIdForMjollnir !== undefined)?.suitIdForMjollnir;
    if (suit === undefined) {
        throw new Error(`У игрока отсутствует обязательный баф '${BuffNames.SuitIdForMjollnir}'.`);
    }
    return player.cards[suit].reduce(TotalRank, 0) * 2;
};

export const OdroerirTheMythicCauldronScoring = (player?: IPublicPlayer, G?: IMyGameState): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    return GetOdroerirTheMythicCauldronCoinsValues(G);
};

export const SvalinnScoring = (player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    return player.heroes.length * 5;
};
