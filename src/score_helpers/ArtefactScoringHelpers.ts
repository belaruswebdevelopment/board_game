import { IsMercenaryCard } from "../Camp";
import { CoinType, IBuffs, IPublicPlayer, PlayerCardsType, SuitTypes } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

export const DraupnirScoring = (player?: IPublicPlayer): number => {
    if (player !== undefined) {
        return player.boardCoins.filter((coin: CoinType): boolean =>
            Boolean(coin !== null && coin.value >= 15)).length * 6;
    }
    // TODO error!?
    return 0;
};

export const HrafnsmerkiScoring = (player?: IPublicPlayer): number => {
    if (player !== undefined) {
        let score = 0;
        for (const suit in player.cards) {
            if (Object.prototype.hasOwnProperty.call(player.cards, suit)) {
                score += player.cards[suit as SuitTypes].filter((card: PlayerCardsType): boolean =>
                    IsMercenaryCard(card)).length * 5;
            }
        }
        return score;
    }
    // TODO error!?
    return 0;
};

export const MjollnirScoring = (player?: IPublicPlayer): number => {
    if (player !== undefined) {
        const suit: SuitTypes | undefined = player.buffs.find((buff: IBuffs): boolean =>
            buff.suitIdForMjollnir !== undefined)?.suitIdForMjollnir;
        if (suit !== undefined) {
            return player.cards[suit].reduce(TotalRank, 0) * 2;
        } else {
            // TODO Error suitIdForMjollnir must be!
        }
    }
    // TODO error!?
    return 0;
};

export const SvalinnScoring = (player?: IPublicPlayer): number => {
    if (player !== undefined) {
        return player.heroes.length * 5;
    }
    // TODO error!?
    return 0;
};
