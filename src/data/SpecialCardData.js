import { SpecialCardNames, SuitNames } from "../typescript/enums";
/**
 * <h3>Данные о особой карте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным особой карты.</li>
 * </ol>
 */
const ChiefBlacksmith = {
    name: SpecialCardNames.ChiefBlacksmith,
    playerSuit: SuitNames.blacksmith,
    rank: 2,
};
/**
 * <h3>Конфиг особых карт.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех особых карт при инициализации игры.</li>
 * </ol>
 */
export const specialCardsConfig = {
    ChiefBlacksmith,
};
//# sourceMappingURL=SpecialCardData.js.map