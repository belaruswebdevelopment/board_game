import { actionCardsConfigArray } from "./data/RoyalOfferingCardData";
import { CardTypeRusNames } from "./typescript/enums";
import type { CreateRoyalOfferingCardFromData, IndexOf, IPlayersNumberTierCardData, NumberTierValues, RoyalOfferingCard, RoyalOfferingCardData, RoyalOfferingsConfig } from "./typescript/interfaces";

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
export const BuildRoyalOfferingCards = (data: IPlayersNumberTierCardData): RoyalOfferingCard[] => {
    const cards: RoyalOfferingCard[] = [];
    for (let i = 0; i < actionCardsConfigArray.length; i++) {
        const currentActionCardConfig: RoyalOfferingCardData =
            actionCardsConfigArray[i as IndexOf<RoyalOfferingsConfig>],
            amountPlayersValue: NumberTierValues = currentActionCardConfig.amount()[data.players],
            amountTierValue: number = amountPlayersValue[data.tier];
        for (let j = 0; j < amountTierValue; j++) {
            cards.push(CreateRoyalOfferingCard({
                value: currentActionCardConfig.value,
                stack: currentActionCardConfig.stack,
                name: currentActionCardConfig.name,
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
 * @param type Тип.
 * @param value Значение.
 * @param stack Стек действий.
 * @param name Название.
 * @returns Карта королевской награды.
 */
const CreateRoyalOfferingCard = ({
    type = CardTypeRusNames.Royal_Offering_Card,
    value,
    stack,
    name,
}: CreateRoyalOfferingCardFromData): RoyalOfferingCard => ({
    type,
    value,
    stack,
    name,
});
