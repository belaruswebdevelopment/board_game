import { giantConfig, godConfig, mythicalAnimalConfig, mythologicalCreatureConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { CardTypeRusNames } from "./typescript/enums";
import type { CreateGiantCardFromData, CreateGodCardFromData, CreateMythicalAnimalCardFromData, CreateValkyryCardFromData, GiantCard, GiantData, GiantNamesKeyofTypeofType, GodCard, GodData, GodNamesKeyofTypeofType, MythicalAnimalCard, MythicalAnimalData, MythicalAnimalNamesKeyofTypeofType, MythologicalCreatureCardType, MythologicalCreatureDecksType, NumPlayersType, ValkyryCard, ValkyryData, ValkyryNamesKeyofTypeofType } from "./typescript/interfaces";

/**
 * <h3>Создаёт все карты Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @returns Все карты Мифических существ.
 */
export const BuildMythologicalCreatureCards = (): MythologicalCreatureCardType[] => {
    const cards: MythologicalCreatureCardType[] = [];
    let giantName: GiantNamesKeyofTypeofType;
    for (giantName in giantConfig) {
        const giantData: GiantData = giantConfig[giantName];
        cards.push(CreateGiantCard({
            name: giantData.name,
            buff: giantData.buff,
            description: giantData.description,
            actions: giantData.actions,
            placedSuit: giantData.placedSuit,
        }));
    }
    let godName: GodNamesKeyofTypeofType;
    for (godName in godConfig) {
        const godData: GodData = godConfig[godName];
        cards.push(CreateGodCard({
            name: godData.name,
            buff: godData.buff,
            description: godData.description,
            points: godData.points,
        }));
    }
    let mythicalAnimalName: MythicalAnimalNamesKeyofTypeofType;
    for (mythicalAnimalName in mythicalAnimalConfig) {
        const mythicalAnimalData: MythicalAnimalData = mythicalAnimalConfig[mythicalAnimalName];
        cards.push(CreateMythicalAnimalCard({
            name: mythicalAnimalData.name,
            buff: mythicalAnimalData.buff,
            description: mythicalAnimalData.description,
            suit: mythicalAnimalData.suit,
            points: mythicalAnimalData.points,
            rank: mythicalAnimalData.rank,
            stack: mythicalAnimalData.stack,
        }));
    }
    let valkyryName: ValkyryNamesKeyofTypeofType;
    for (valkyryName in valkyryConfig) {
        const valkyryData: ValkyryData = valkyryConfig[valkyryName];
        cards.push(CreateValkyryCard({
            name: valkyryData.name,
            buff: valkyryData.buff,
            description: valkyryData.description,
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
export const BuildMythologicalCreatureDecks = (mythologicalCreatureCardsDeck: MythologicalCreatureCardType[],
    playersNum: NumPlayersType): MythologicalCreatureDecksType => {
    const amount: number = mythologicalCreatureConfig[playersNum],
        mythologicalCreatureDeck: MythologicalCreatureCardType[] =
            mythologicalCreatureCardsDeck.splice(0, mythologicalCreatureConfig[playersNum]);
    if (amount !== mythologicalCreatureDeck.length) {
        throw new Error(`Недостаточно карт в массиве карт мифических существ: требуется - '${amount}', в наличии - '${mythologicalCreatureDeck.length}'.`);
    }
    return [mythologicalCreatureDeck, mythologicalCreatureCardsDeck];
};

/**
 * <h3>Создание карты Гиганта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
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
 * @returns Карта Гиганта.
 */
const CreateGiantCard = ({
    type = CardTypeRusNames.Giant_Card,
    name,
    buff,
    description,
    actions,
    placedSuit,
    capturedCard = null,
    isActivated = null,
}: CreateGiantCardFromData): GiantCard => ({
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
 * <h3>Создание карты Бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param buff Баф.
 * @param description Описание.
 * @param points Очки.
 * @param isActivated Активирована ли способность.
 * @returns Карта Бога.
 */
const CreateGodCard = ({
    type = CardTypeRusNames.God_Card,
    name,
    buff,
    description,
    points,
    isActivated = null,
}: CreateGodCardFromData): GodCard => ({
    type,
    name,
    buff,
    description,
    points,
    isActivated,
});

/**
 * <h3>Создание карты Мифического животного.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param buff Баф.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param stack Стек действий.
 * @returns Карта Мифического животного.
 */
const CreateMythicalAnimalCard = ({
    type = CardTypeRusNames.Mythical_Animal_Card,
    name,
    buff,
    description,
    suit,
    rank = 1,
    points = null,
    stack,
}: CreateMythicalAnimalCardFromData): MythicalAnimalCard => ({
    type,
    name,
    buff,
    description,
    suit,
    rank,
    points,
    stack,
});

/**
 * <h3>Создание карты Валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param buff Баф.
 * @param description Описание.
 * @param strengthTokenNotch Метка токена силы.
 * @returns Карта Валькирии.
 */
const CreateValkyryCard = ({
    type = CardTypeRusNames.Valkyry_Card,
    name,
    buff,
    description,
    strengthTokenNotch = null,
}: CreateValkyryCardFromData): ValkyryCard => ({
    type,
    name,
    buff,
    description,
    strengthTokenNotch,
});
