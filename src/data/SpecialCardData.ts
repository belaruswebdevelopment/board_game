import { SpecialCardNames, SuitNames } from "../typescript/enums";
import type { SpecialCardDataType, SpecialCardsConfigType } from "../typescript/interfaces";

/**
 * <h3>Данные о особой карте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным особой карты.</li>
 * </ol>
 */
const ChiefBlacksmith: SpecialCardDataType = {
    name: SpecialCardNames.ChiefBlacksmith,
    suit: SuitNames.blacksmith,
    rank: 2,
    points: null,
};

/**
 * <h3>Конфиг особых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех особых карт при инициализации игры.</li>
 * </ol>
 */
export const specialCardsConfig: SpecialCardsConfigType = {
    ChiefBlacksmith,
};
