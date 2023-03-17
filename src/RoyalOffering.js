import { actionCardsConfigArray } from "./data/RoyalOfferingCardData";
import { AssertRoyalOfferingsConfigIndex } from "./is_helpers/AssertionTypeHelpers";
import { CardTypeRusNames } from "./typescript/enums";
/**
 * <h3>Создаёт все карты королевских наград.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @param data Данные для создания карт.
 * @returns Все карты королевских наград.
 */
export const BuildRoyalOfferingCards = (data) => {
    const cards = [];
    for (let i = 0; i < actionCardsConfigArray.length; i++) {
        AssertRoyalOfferingsConfigIndex(i);
        const currentActionCardConfig = actionCardsConfigArray[i], amountPlayersValue = currentActionCardConfig.amount()[data.players], amountTierValue = amountPlayersValue[data.tier];
        for (let j = 0; j < amountTierValue; j++) {
            cards.push(CreateRoyalOfferingCard({
                name: currentActionCardConfig.name,
                stack: currentActionCardConfig.stack,
                upgradeValue: currentActionCardConfig.upgradeValue,
            }));
        }
    }
    return cards;
};
/**
 * <h3>Создание карты королевской награды.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт королевской награды во время инициализации игры.</li>
 * </ol>
 *
 * @param name Название.
 * @param stack Стек действий.
 * @param type Тип.
 * @param upgradeValue Значение.
 * @returns Карта королевской награды.
 */
const CreateRoyalOfferingCard = ({ name, stack, type = CardTypeRusNames.RoyalOfferingCard, upgradeValue, }) => ({
    name,
    stack,
    type,
    upgradeValue,
});
//# sourceMappingURL=RoyalOffering.js.map