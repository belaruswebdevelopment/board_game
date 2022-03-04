import { CardNames, GameNames, RusCardTypes, SuitNames } from "../typescript/enums";
import type { IAdditionalCardsConfig, ICard } from "../typescript/interfaces";

// TODO Rework in IAdditionalCard!?
const ChiefBlacksmith: ICard = {
    type: RusCardTypes.BASIC,
    game: GameNames.Basic,
    tier: 0,
    path: ``,
    name: CardNames.ChiefBlacksmith,
    suit: SuitNames.BLACKSMITH,
    rank: 2,
    points: null,
};

export const additionalCardsConfig: IAdditionalCardsConfig = {
    ChiefBlacksmith,
};
