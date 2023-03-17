import { giantConfig, godConfig, mythicalAnimalConfig, mythologicalCreatureConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { CardTypeRusNames } from "./typescript/enums";
/**
 * <h3>Создаёт все карты Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @returns Все карты Мифических существ.
 */
export const BuildMythologicalCreatureCards = () => {
    const cards = [];
    let giantName;
    for (giantName in giantConfig) {
        const giantData = giantConfig[giantName];
        cards.push(CreateGiantCard({
            actions: giantData.actions,
            buff: giantData.buff,
            description: giantData.description,
            name: giantData.name,
            placedSuit: giantData.placedSuit,
        }));
    }
    let godName;
    for (godName in godConfig) {
        const godData = godConfig[godName];
        cards.push(CreateGodCard({
            buff: godData.buff,
            description: godData.description,
            name: godData.name,
            points: godData.points,
        }));
    }
    let mythicalAnimalName;
    for (mythicalAnimalName in mythicalAnimalConfig) {
        const mythicalAnimalData = mythicalAnimalConfig[mythicalAnimalName];
        cards.push(CreateMythicalAnimalCard({
            buff: mythicalAnimalData.buff,
            description: mythicalAnimalData.description,
            name: mythicalAnimalData.name,
            playerSuit: mythicalAnimalData.playerSuit,
            points: mythicalAnimalData.points,
            rank: mythicalAnimalData.rank,
            stack: mythicalAnimalData.stack,
        }));
    }
    let valkyryName;
    for (valkyryName in valkyryConfig) {
        const valkyryData = valkyryConfig[valkyryName];
        cards.push(CreateValkyryCard({
            buff: valkyryData.buff,
            description: valkyryData.description,
            name: valkyryData.name,
            stack: valkyryData.stack
        }));
    }
    return cards;
};
/**
 * <h3>Создаёт колоды карт Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param mythologicalCreatureCardsDeck Колода карт мифических существ.
 * @returns Колода карт мифических существ для выбора игроками/Колода оставшихся карт мифических существ.
 */
export const BuildMythologicalCreatureDecks = (mythologicalCreatureCardsDeck, playersNum) => {
    const amount = mythologicalCreatureConfig[playersNum], mythologicalCreatureDeck = mythologicalCreatureCardsDeck.splice(0, mythologicalCreatureConfig[playersNum]);
    if (amount !== mythologicalCreatureDeck.length) {
        throw new Error(`Недостаточно карт в массиве карт мифических существ: требуется - '${amount}', в наличии - '${mythologicalCreatureDeck.length}'.`);
    }
    return [mythologicalCreatureDeck, mythologicalCreatureCardsDeck];
};
/**
 * <h3>Создание карты гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт гигантов при инициализации игры.</li>
 * </ol>
 *
 * @param actions Действия.
 * @param buff Баф.
 * @param capturedCard Захваченная карта.
 * @param description Описание.
 * @param isActivated Активирована ли способность.
 * @param name Название.
 * @param placedSuit Выбранная фракция.
 * @param type Тип.
 * @returns Карта гиганта.
 */
const CreateGiantCard = ({ actions, buff, capturedCard = null, description, isActivated = null, name, placedSuit, type = CardTypeRusNames.GiantCard, }) => ({
    actions,
    buff,
    capturedCard,
    description,
    isActivated,
    name,
    placedSuit,
    type,
});
/**
 * <h3>Создание карты бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт богов при инициализации игры.</li>
 * </ol>
 *
 * @param buff Баф.
 * @param description Описание.
 * @param isActivated Активирована ли способность.
 * @param name Название.
 * @param points Очки.
 * @param type Тип.
 * @returns Карта бога.
 */
const CreateGodCard = ({ buff, description, isActivated = null, name, points, type = CardTypeRusNames.GodCard, }) => ({
    buff,
    description,
    isActivated,
    name,
    points,
    type,
});
/**
 * <h3>Создание карты мифического животного.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт мифических животных при инициализации игры.</li>
 * </ol>
 *
 * @param buff Баф.
 * @param description Описание.
 * @param name Название.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @param stack Стек действий.
 * @param type Тип.
 * @returns Карта Мифического животного.
 */
const CreateMythicalAnimalCard = ({ buff, description, name, playerSuit, points = null, rank = 1, stack, type = CardTypeRusNames.MythicalAnimalCard, }) => ({
    buff,
    description,
    name,
    playerSuit,
    points,
    rank,
    stack,
    type,
});
/**
 * <h3>Создание карты мифического животного на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты мифического животного на поле игрока.</li>
 * </ol>
 *
 * @param description Описание.
 * @param name Название.
 * @param points Очки.
 * @param rank Шевроны.
 * @param suit Название фракции дворфов.
 * @param type Тип.
 * @returns Карта мифического животного на поле игрока.
 */
export const CreateMythicalAnimalPlayerCard = ({ description, name, points = null, rank = 1, suit, type = CardTypeRusNames.MythicalAnimalPlayerCard, }) => ({
    description,
    name,
    points,
    rank,
    suit,
    type,
});
/**
 * <h3>Создание карты валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт валькирий при инициализации игры.</li>
 * </ol>
 *
 * @param buff Баф.
 * @param description Описание.
 * @param name Название.
 * @param stack Стек действий.
 * @param strengthTokenNotch Метка токена силы.
 * @param type Тип.
 * @returns Карта валькирии.
 */
const CreateValkyryCard = ({ buff, description, name, stack, strengthTokenNotch = null, type = CardTypeRusNames.ValkyryCard, }) => ({
    buff,
    description,
    name,
    stack,
    strengthTokenNotch,
    type,
});
//# sourceMappingURL=MythologicalCreature.js.map