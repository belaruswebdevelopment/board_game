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
            name: giantData.name,
            buff: giantData.buff,
            description: giantData.description,
            actions: giantData.actions,
            placedSuit: giantData.placedSuit,
        }));
    }
    let godName;
    for (godName in godConfig) {
        const godData = godConfig[godName];
        cards.push(CreateGodCard({
            name: godData.name,
            buff: godData.buff,
            description: godData.description,
            points: godData.points,
        }));
    }
    let mythicalAnimalName;
    for (mythicalAnimalName in mythicalAnimalConfig) {
        const mythicalAnimalData = mythicalAnimalConfig[mythicalAnimalName];
        cards.push(CreateMythicalAnimalCard({
            name: mythicalAnimalData.name,
            buff: mythicalAnimalData.buff,
            description: mythicalAnimalData.description,
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
            name: valkyryData.name,
            buff: valkyryData.buff,
            description: valkyryData.description,
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
 * @param type Тип.
 * @param name Название.
 * @param buff Баф.
 * @param description Описание.
 * @param actions Действия.
 * @param placedSuit Выбранная фракция.
 * @param capturedCard Захваченная карта.
 * @param isActivated Активирована ли способность.
 * @returns Карта гиганта.
 */
const CreateGiantCard = ({ type = CardTypeRusNames.GiantCard, name, buff, description, actions, placedSuit, capturedCard = null, isActivated = null, }) => ({
    type,
    name,
    buff,
    description,
    actions,
    placedSuit,
    capturedCard,
    isActivated,
});
/**
 * <h3>Создание карты бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт богов при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param buff Баф.
 * @param description Описание.
 * @param points Очки.
 * @param isActivated Активирована ли способность.
 * @returns Карта бога.
 */
const CreateGodCard = ({ type = CardTypeRusNames.GodCard, name, buff, description, points, isActivated = null, }) => ({
    type,
    name,
    buff,
    description,
    points,
    isActivated,
});
/**
 * <h3>Создание карты мифического животного.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт мифических животных при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param buff Баф.
 * @param description Описание.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @param stack Стек действий.
 * @returns Карта Мифического животного.
 */
const CreateMythicalAnimalCard = ({ type = CardTypeRusNames.MythicalAnimalCard, name, buff, description, playerSuit, points = null, rank = 1, stack, }) => ({
    type,
    name,
    buff,
    description,
    playerSuit,
    points,
    rank,
    stack,
});
/**
 * <h3>Создание карты мифического животного на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты мифического животного на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта мифического животного на поле игрока.
 */
export const CreateMythicalAnimalPlayerCard = ({ type = CardTypeRusNames.MythicalAnimalPlayerCard, name, description, suit, points = null, rank = 1, }) => ({
    type,
    name,
    description,
    suit,
    points,
    rank,
});
/**
 * <h3>Создание карты валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт валькирий при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param buff Баф.
 * @param description Описание.
 * @param strengthTokenNotch Метка токена силы.
 * @param stack Стек действий.
 * @returns Карта валькирии.
 */
const CreateValkyryCard = ({ type = CardTypeRusNames.ValkyryCard, name, buff, description, strengthTokenNotch = null, stack, }) => ({
    type,
    name,
    buff,
    description,
    strengthTokenNotch,
    stack,
});
//# sourceMappingURL=MythologicalCreature.js.map