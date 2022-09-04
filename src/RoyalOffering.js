import { actionCardsConfigArray } from "./data/RoyalOfferingCardData";
import { RusCardTypeNames } from "./typescript/enums";
/**
 * <h3>Создаёт все карты королевских наград.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @param deckConfig Конфиг карт.
 * @param data Данные для создания карт.
 * @returns Все карты королевских наград.
 */
export const BuildRoyalOfferingCards = (data) => {
    const cards = [];
    for (let i = 0; i < actionCardsConfigArray.length; i++) {
        const currentActionCardConfig = actionCardsConfigArray[i], amountPlayersValue = currentActionCardConfig.amount()[data.players];
        if (amountPlayersValue === undefined) {
            throw new Error(`Отсутствует массив значений количества карт '${RusCardTypeNames.Royal_Offering_Card}' для указанного числа игроков - '${data.players}'.`);
        }
        const amountTierValue = amountPlayersValue[data.tier];
        if (amountTierValue === undefined) {
            throw new Error(`Отсутствует массив значений количества карт '${RusCardTypeNames.Royal_Offering_Card}' для указанного числа игроков - '${data.players}' для эпохи '${data.tier}'.`);
        }
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
 * @param action Действие.
 * @param name Название.
 * @param type Тип.
 * @param value Значение.
 * @param stack Действие.
 * @param name Название.
 * @returns Карта королевской награды.
 */
const CreateRoyalOfferingCard = ({ type = RusCardTypeNames.Royal_Offering_Card, value, stack, name, }) => ({
    type,
    value,
    stack,
    name,
});
//# sourceMappingURL=RoyalOffering.js.map