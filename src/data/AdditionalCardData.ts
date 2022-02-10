import { ICard } from "../typescript/card_interfaces";
import { CardNames, RusCardTypes, SuitNames } from "../typescript/enums";
import { IAdditionalCardsConfig } from "../typescript/interfaces";

// TODO Rework in IAdditionalCard!!!
const ChiefBlacksmith: ICard = {
    type: RusCardTypes.BASIC,
    game: ``,
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
