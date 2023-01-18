import { actionCardsConfigArray } from "./data/RoyalOfferingCardData";
import { CardTypeRusNames } from "./typescript/enums";
import type { CreateRoyalOfferingCardFromData, IndexOf, NumberTierValues, PlayersNumberTierCardData, RoyalOfferingCard, RoyalOfferingCardData, RoyalOfferingsConfig } from "./typescript/interfaces";

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
export const BuildRoyalOfferingCards = (data: PlayersNumberTierCardData): RoyalOfferingCard[] => {
    const cards: RoyalOfferingCard[] = [];
    for (let i = 0; i < actionCardsConfigArray.length; i++) {
        const currentActionCardConfig: RoyalOfferingCardData =
            actionCardsConfigArray[i as IndexOf<RoyalOfferingsConfig>],
            amountPlayersValue: NumberTierValues = currentActionCardConfig.amount()[data.players],
            amountTierValue: number = amountPlayersValue[data.tier];
        for (let j = 0; j < amountTierValue; j++) {
            cards.push(CreateRoyalOfferingCard({
                name: currentActionCardConfig.name,
                upgradeValue: currentActionCardConfig.upgradeValue,
                stack: currentActionCardConfig.stack,
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
 * @param name Название.
 * @param upgradeValue Значение.
 * @param stack Стек действий.
 * @returns Карта королевской награды.
 */
const CreateRoyalOfferingCard = ({
    type = CardTypeRusNames.RoyalOfferingCard,
    name,
    upgradeValue,
    stack,
}: CreateRoyalOfferingCardFromData): RoyalOfferingCard => ({
    type,
    name,
    upgradeValue,
    stack,
});
