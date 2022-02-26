import { CheckIsMercenaryCampCardInPlayerCards } from "../Card";
import { isCoin } from "../Coin";
import { BuffNames } from "../typescript/enums";
import { CoinType, IBuffs, IPublicPlayer, PlayerCardsType, SuitTypes } from "../typescript/interfaces";
import { TotalRank } from "./ScoreHelpers";

export const DraupnirScoring = (player?: IPublicPlayer): number | never => {
    if (player !== undefined) {
        return player.boardCoins.filter((coin: CoinType): boolean =>
            isCoin(coin) && coin.value >= 15).length * 6;
    }
    throw new Error(`Function param 'player' is undefined.`);
};

export const HrafnsmerkiScoring = (player?: IPublicPlayer): number | never => {
    if (player !== undefined) {
        let score = 0,
            suit: SuitTypes;
        for (suit in player.cards) {
            if (Object.prototype.hasOwnProperty.call(player.cards, suit)) {
                score += player.cards[suit].filter((card: PlayerCardsType): boolean =>
                    CheckIsMercenaryCampCardInPlayerCards(card)).length * 5;
            }
        }
        return score;
    }
    throw new Error(`Function param 'player' is undefined.`);
};

export const MjollnirScoring = (player?: IPublicPlayer): number | never => {
    if (player !== undefined) {
        const suit: SuitTypes | undefined = player.buffs.find((buff: IBuffs): boolean =>
            buff.suitIdForMjollnir !== undefined)?.suitIdForMjollnir;
        if (suit !== undefined) {
            return player.cards[suit].reduce(TotalRank, 0) * 2;
        } else {
            throw new Error(`У игрока отсутствует обязательный баф ${BuffNames.SuitIdForMjollnir}.`);
        }
    }
    throw new Error(`Function param 'player' is undefined.`);
};

export const SvalinnScoring = (player?: IPublicPlayer): number | never => {
    if (player !== undefined) {
        return player.heroes.length * 5;
    }
    throw new Error(`Function param 'player' is undefined.`);
};
