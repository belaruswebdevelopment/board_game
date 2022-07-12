import { RusCardTypeNames } from "./typescript/enums";
import type { CreateGiantCardType, CreateGodCardType, CreateMythicalAnimalCardType, CreateValkyryCardType, GiantTypes, GodTypes, IGiantCard, IGiantConfig, IGiantData, IGodCard, IGodConfig, IGodData, IMythicalAnimalCard, IMythicalAnimalConfig, IMythicalAnimalData, IValkyryCard, IValkyryConfig, IValkyryData, MythicalAnimalTypes, MythologicalCreatureDeckCardTypes, ValkyryTypes } from "./typescript/interfaces";

/**
 * <h3>Создаёт все карты Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @param deckConfig Конфиг карт.
 * @returns Все карты Мифических существ.
 */
export const BuildMythologicalCreatureCards = (giantConfig: IGiantConfig, godConfig: IGodConfig,
    mythicalAnimalConfig: IMythicalAnimalConfig, valkyryConfig: IValkyryConfig):
    MythologicalCreatureDeckCardTypes[] => {
    const cards: MythologicalCreatureDeckCardTypes[] = [];
    let giantName: GiantTypes;
    for (giantName in giantConfig) {
        const giantData: IGiantData = giantConfig[giantName];
        cards.push(CreateGiantCard({
            name: giantData.name,
            placedSuit: giantData.placedSuit,
        }));
    }
    let godName: GodTypes;
    for (godName in godConfig) {
        const godData: IGodData = godConfig[godName];
        cards.push(CreateGodCard({
            name: godData.name,
            points: godData.points,
        }));
    }
    let mythicalAnimalName: MythicalAnimalTypes;
    for (mythicalAnimalName in mythicalAnimalConfig) {
        const mythicalAnimalData: IMythicalAnimalData = mythicalAnimalConfig[mythicalAnimalName];
        cards.push(CreateMythicalAnimalCard({
            name: mythicalAnimalData.name,
            suit: mythicalAnimalData.suit,
            points: mythicalAnimalData.points,
            rank: mythicalAnimalData.rank,
        }));
    }
    let valkyryName: ValkyryTypes;
    for (valkyryName in valkyryConfig) {
        const mythicalAnimalData: IValkyryData = valkyryConfig[valkyryName];
        cards.push(CreateValkyryCard({
            name: mythicalAnimalData.name,
        }));
    }
    return cards;
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
 * @param placedSuit Выбранная фракция.
 * @param capturedCard Захваченная карта.
 * @returns Карта Гиганта.
 */
export const CreateGiantCard = ({
    type = RusCardTypeNames.Giant_Card,
    name,
    placedSuit,
    capturedCard = null,
}: CreateGiantCardType = {} as CreateGiantCardType): IGiantCard => ({
    type,
    name,
    placedSuit,
    capturedCard,
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
 * @param isPowerTokenUsed Положен ли токен силы на карту Бога.
 * @param godPower Сила Бога.
 * @returns Карта Бога.
 */
export const CreateGodCard = ({
    type = RusCardTypeNames.God_Card,
    name,
    points,
    isPowerTokenUsed = null,
}: CreateGodCardType = {} as CreateGodCardType): IGodCard => ({
    type,
    name,
    points,
    isPowerTokenUsed,
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
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param ability Способность Мифического животного.
 * @returns Карта Мифического животного.
 */
export const CreateMythicalAnimalCard = ({
    type = RusCardTypeNames.Mythical_Animal_Card,
    name,
    suit,
    rank = 1,
    points = null,
}: CreateMythicalAnimalCardType = {} as CreateMythicalAnimalCardType): IMythicalAnimalCard => ({
    type,
    name,
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
 * @param strengthTokenNotch Метка токена силы.
 * @param valkyriesRequirements Требования Валькирии.
 * @param finalPoints Финальные очки.
 * @returns Карта Валькирии.
 */
export const CreateValkyryCard = ({
    type = RusCardTypeNames.Valkyry_Card,
    name,
    strengthTokenNotch = null,
}: CreateValkyryCardType = {} as CreateValkyryCardType): IValkyryCard => ({
    type,
    name,
    strengthTokenNotch,
});

/**
 * <h3>Проверка, является ли объект картой Бога.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой Бога.
 */
export const IsGodCard = (card: unknown): card is IGodCard =>
    card !== null && (card as IGodCard).isPowerTokenUsed !== undefined;

/**
* <h3>Проверка, является ли объект картой Гиганта.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект картой Гиганта.
*/
export const IsGiantCard = (card: unknown): card is IGiantCard =>
    card !== null && (card as IGiantCard).placedSuit !== undefined;

/**
* <h3>Проверка, является ли объект картой Валькирии.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект картой Валькирии.
*/
export const IsValkyryCard = (card: unknown): card is IValkyryCard =>
    card !== null && (card as IValkyryCard).strengthTokenNotch !== undefined;

// TODO Fix it not only suit!
/**
* <h3>Проверка, является ли объект картой Мифического животного.</h3>
* <p>Применения:</p>
* <ol>
* <li>При проверках в функциях.</li>
* </ol>
*
* @param card Карта.
* @returns Является ли объект картой Мифического животного.
*/
export const IsMythicalAnimalCard = (card: unknown): card is IMythicalAnimalCard =>
    card !== null && (card as IMythicalAnimalCard).suit !== undefined;
