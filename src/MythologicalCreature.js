import { giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { RusCardTypeNames } from "./typescript/enums";
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
            placedSuit: giantData.placedSuit,
        }));
    }
    let godName;
    for (godName in godConfig) {
        const godData = godConfig[godName];
        cards.push(CreateGodCard({
            name: godData.name,
            points: godData.points,
        }));
    }
    let mythicalAnimalName;
    for (mythicalAnimalName in mythicalAnimalConfig) {
        const mythicalAnimalData = mythicalAnimalConfig[mythicalAnimalName];
        cards.push(CreateMythicalAnimalCard({
            name: mythicalAnimalData.name,
            suit: mythicalAnimalData.suit,
            points: mythicalAnimalData.points,
            rank: mythicalAnimalData.rank,
        }));
    }
    let valkyryName;
    for (valkyryName in valkyryConfig) {
        const mythicalAnimalData = valkyryConfig[valkyryName];
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
const CreateGiantCard = ({ type = RusCardTypeNames.Giant_Card, name, placedSuit, capturedCard = null, } = {}) => ({
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
const CreateGodCard = ({ type = RusCardTypeNames.God_Card, name, points, isPowerTokenUsed = null, } = {}) => ({
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
const CreateMythicalAnimalCard = ({ type = RusCardTypeNames.Mythical_Animal_Card, name, suit, rank = 1, points = null, } = {}) => ({
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
const CreateValkyryCard = ({ type = RusCardTypeNames.Valkyry_Card, name, strengthTokenNotch = null, } = {}) => ({
    type,
    name,
    strengthTokenNotch,
});
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
export const IsMythicalAnimalCard = (card) => card.type === RusCardTypeNames.Mythical_Animal_Card;
//# sourceMappingURL=MythologicalCreature.js.map