import { actionCardsConfigArray } from "./data/RoyalOfferingCardData";
import { RusCardTypeNames } from "./typescript/enums";
import type { CanBeUndef, CreateRoyalOfferingCardType, INumberValues, IPlayersNumberTierCardData, IRoyalOfferingCard, IRoyalOfferingCardConfig } from "./typescript/interfaces";

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
export const BuildRoyalOfferingCards = (data: IPlayersNumberTierCardData): IRoyalOfferingCard[] => {
    const cards: IRoyalOfferingCard[] = [];
    for (let i = 0; i < actionCardsConfigArray.length; i++) {
        const currentActionCardConfig: CanBeUndef<IRoyalOfferingCardConfig> = actionCardsConfigArray[i];
        if (currentActionCardConfig === undefined) {
            throw new Error(`В массиве конфигов карт '${RusCardTypeNames.Royal_Offering}' отсутствует значение с id '${i}'.`);
        }
        const amountPlayersValue: CanBeUndef<INumberValues> = currentActionCardConfig.amount()[data.players];
        if (amountPlayersValue === undefined) {
            throw new Error(`Отсутствует массив значений количества карт '${RusCardTypeNames.Royal_Offering}' для указанного числа игроков - '${data.players}'.`);
        }
        const amountTierValue: CanBeUndef<number> = amountPlayersValue[data.tier];
        if (amountTierValue === undefined) {
            throw new Error(`Отсутствует массив значений количества карт '${RusCardTypeNames.Royal_Offering}' для указанного числа игроков - '${data.players}' для эпохи '${data.tier}'.`);
        }
        for (let j = 0; j < amountTierValue; j++) {
            cards.push(CreateRoyalOfferingCard({
                value: currentActionCardConfig.value,
                stack: currentActionCardConfig.stack,
                name: `'${RusCardTypeNames.Royal_Offering}' на +${currentActionCardConfig.value}`,
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
const CreateRoyalOfferingCard = ({
    type = RusCardTypeNames.Royal_Offering,
    value,
    stack,
    name,
}: CreateRoyalOfferingCardType = {} as CreateRoyalOfferingCardType): IRoyalOfferingCard => ({
    type,
    value,
    stack,
    name,
});

/**
 * <h3>Проверка, является ли объект картой королевской награды.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой королевской награды.
 */
export const IsRoyalOfferingCard = (card: unknown): card is IRoyalOfferingCard =>
    card !== null && (card as IRoyalOfferingCard).value !== undefined;