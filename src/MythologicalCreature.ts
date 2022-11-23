import { giantConfig, godConfig, mythicalAnimalConfig, mythologicalCreatureConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { RusCardTypeNames } from "./typescript/enums";
import type { CanBeUndefType, CreateGiantCardType, CreateGodCardType, CreateMythicalAnimalCardType, CreateValkyryCardType, GiantNamesKeyofTypeofType, GodNamesKeyofTypeofType, IGiantCard, IGiantData, IGodCard, IGodData, IMythicalAnimalCard, IMythicalAnimalData, IValkyryCard, IValkyryData, MythicalAnimalNamesKeyofTypeofType, MythologicalCreatureDeckCardType, MythologicalCreatureDecksType, NumPlayersType, ValkyryNamesKeyofTypeofType } from "./typescript/interfaces";

/**
 * <h3>Создаёт все карты Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @returns Все карты Мифических существ.
 */
export const BuildMythologicalCreatureCards = (): MythologicalCreatureDeckCardType[] => {
    const cards: MythologicalCreatureDeckCardType[] = [];
    let giantName: GiantNamesKeyofTypeofType;
    for (giantName in giantConfig) {
        const giantData: IGiantData = giantConfig[giantName];
        cards.push(CreateGiantCard({
            name: giantData.name,
            buff: giantData.buff,
            description: giantData.description,
            placedSuit: giantData.placedSuit,
        }));
    }
    let godName: GodNamesKeyofTypeofType;
    for (godName in godConfig) {
        const godData: IGodData = godConfig[godName];
        cards.push(CreateGodCard({
            name: godData.name,
            description: godData.description,
            points: godData.points,
        }));
    }
    let mythicalAnimalName: MythicalAnimalNamesKeyofTypeofType;
    for (mythicalAnimalName in mythicalAnimalConfig) {
        const mythicalAnimalData: IMythicalAnimalData = mythicalAnimalConfig[mythicalAnimalName];
        cards.push(CreateMythicalAnimalCard({
            name: mythicalAnimalData.name,
            description: mythicalAnimalData.description,
            suit: mythicalAnimalData.suit,
            points: mythicalAnimalData.points,
            rank: mythicalAnimalData.rank,
        }));
    }
    let valkyryName: ValkyryNamesKeyofTypeofType;
    for (valkyryName in valkyryConfig) {
        const valkyryData: IValkyryData = valkyryConfig[valkyryName];
        cards.push(CreateValkyryCard({
            description: valkyryData.description,
            name: valkyryData.name,
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
export const BuildMythologicalCreatureDecks = (mythologicalCreatureCardsDeck: MythologicalCreatureDeckCardType[],
    playersNum: NumPlayersType): MythologicalCreatureDecksType => {
    const mythologicalCreatureValuesPlayers: CanBeUndefType<number> = mythologicalCreatureConfig[playersNum];
    if (mythologicalCreatureValuesPlayers === undefined) {
        throw new Error(`Отсутствует массив значений количества карт мифических существ для указанного числа игроков - '${playersNum}'.`);
    }
    const mythologicalCreatureDeck: MythologicalCreatureDeckCardType[] =
        mythologicalCreatureCardsDeck.splice(0, mythologicalCreatureValuesPlayers),
        mythologicalCreatureNotInGameDeck: MythologicalCreatureDeckCardType[] = mythologicalCreatureCardsDeck;
    return [mythologicalCreatureDeck, mythologicalCreatureNotInGameDeck];
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
 * @param placedSuit Выбранная фракция.
 * @param capturedCard Захваченная карта.
 * @param isActivated Активирована ли способность.
 * @returns Карта Гиганта.
 */
const CreateGiantCard = ({
    type = RusCardTypeNames.Giant_Card,
    name,
    buff,
    description,
    placedSuit,
    capturedCard = null,
    isActivated = false,
}: CreateGiantCardType): IGiantCard => ({
    type,
    name,
    buff,
    description,
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
 * @param description Описание.
 * @param isPowerTokenUsed Положен ли токен силы на карту Бога.
 * @param godPower Сила Бога.
 * @param isActivated Активирована ли способность.
 * @returns Карта Бога.
 */
const CreateGodCard = ({
    type = RusCardTypeNames.God_Card,
    name,
    description,
    points,
    isPowerTokenUsed = null,
    isActivated = false,
}: CreateGodCardType): IGodCard => ({
    type,
    name,
    description,
    points,
    isPowerTokenUsed,
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
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта Мифического животного.
 */
const CreateMythicalAnimalCard = ({
    type = RusCardTypeNames.Mythical_Animal_Card,
    name,
    description,
    suit,
    rank = 1,
    points = null,
}: CreateMythicalAnimalCardType): IMythicalAnimalCard => ({
    type,
    name,
    description,
    suit,
    rank,
    points,
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
 * @param description Описание.
 * @param strengthTokenNotch Метка токена силы.
 * @returns Карта Валькирии.
 */
const CreateValkyryCard = ({
    type = RusCardTypeNames.Valkyry_Card,
    name,
    description,
    strengthTokenNotch = null,
}: CreateValkyryCardType): IValkyryCard => ({
    type,
    name,
    description,
    strengthTokenNotch,
});
