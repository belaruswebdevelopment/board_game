import { giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { RusCardTypeNames } from "./typescript/enums";
import type { CreateGiantCardType, CreateGodCardType, CreateMythicalAnimalCardType, CreateValkyryCardType, GiantKeyofType, GodKeyofType, IGiantCard, IGiantData, IGodCard, IGodData, IMythicalAnimalCard, IMythicalAnimalData, IValkyryCard, IValkyryData, MythicalAnimalKeyofType, MythologicalCreatureDeckCardType, ValkyryKeyofTypes } from "./typescript/interfaces";

/**
 * <h3>Создаёт все карты Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *.
 * @returns Все карты Мифических существ.
 */
export const BuildMythologicalCreatureCards = ():
    MythologicalCreatureDeckCardType[] => {
    const cards: MythologicalCreatureDeckCardType[] = [];
    let giantName: GiantKeyofType;
    for (giantName in giantConfig) {
        const giantData: IGiantData = giantConfig[giantName];
        cards.push(CreateGiantCard({
            name: giantData.name,
            placedSuit: giantData.placedSuit,
        }));
    }
    let godName: GodKeyofType;
    for (godName in godConfig) {
        const godData: IGodData = godConfig[godName];
        cards.push(CreateGodCard({
            name: godData.name,
            points: godData.points,
        }));
    }
    let mythicalAnimalName: MythicalAnimalKeyofType;
    for (mythicalAnimalName in mythicalAnimalConfig) {
        const mythicalAnimalData: IMythicalAnimalData = mythicalAnimalConfig[mythicalAnimalName];
        cards.push(CreateMythicalAnimalCard({
            name: mythicalAnimalData.name,
            suit: mythicalAnimalData.suit,
            points: mythicalAnimalData.points,
            rank: mythicalAnimalData.rank,
        }));
    }
    let valkyryName: ValkyryKeyofTypes;
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
