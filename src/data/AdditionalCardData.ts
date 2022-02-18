import { CardNames, RusCardTypes, SuitNames } from "../typescript_enums/enums";
import { IAdditionalCardsConfig, ICard } from "../typescript_interfaces/card_interfaces";

// TODO Rework in IAdditionalCard!?
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
