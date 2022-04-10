import { IsMercenaryPlayerCard } from "../Camp";
import { IsCoin } from "../Coin";
import { GetOdroerirTheMythicCauldronCoinsValues } from "../helpers/CampCardHelpers";
import { BuffNames } from "../typescript/enums";
import type { IBuffs, ICoin, IMyGameState, IPublicPlayer, PlayerCardsType, PublicPlayerCoinTypes, SuitTypes } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

export const DraupnirScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    const basicScore: number =
        player.boardCoins.filter((coin: PublicPlayerCoinTypes, index: number): boolean => {
            if (coin !== null && (!IsCoin(coin) || !coin.isOpened)) {
                throw new Error(`В массиве монет игрока ${player.nickname} в руке не может быть закрыта монета с id ${index}.`);
            }
            return IsCoin(coin) && coin.value >= 15;
        }).length,
        odroerirScore: number = G.odroerirTheMythicCauldronCoins.filter((coin: ICoin): boolean =>
            coin.value >= 15).length;
    return (basicScore + odroerirScore) * 6;
};

export const HrafnsmerkiScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
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

export const MjollnirScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
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

export const OdroerirTheMythicCauldronScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    if (G === undefined) {
        throw new Error(`Function param 'G' is undefined.`);
    }
    return GetOdroerirTheMythicCauldronCoinsValues(G);
};

export const SvalinnScoring = (G?: IMyGameState, player?: IPublicPlayer): number => {
    if (player === undefined) {
        throw new Error(`Function param 'player' is undefined.`);
    }
    return player.heroes.length * 5;
};
