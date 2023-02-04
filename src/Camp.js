import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { suitsConfig } from "./data/SuitData";
import { AssertMercenariesConfigIndex } from "./is_helpers/AssertionTypeHelpers";
import { CardTypeRusNames } from "./typescript/enums";
/**
 * <h3>Создаёт все карты лагеря конкретной эпохи из конфига.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param tier Эпоха.
 * @returns Все карты лагеря конкретной эпохи.
 */
export const BuildCampCards = (tier) => {
    const campCards = [];
    let artefactName;
    for (artefactName in artefactsConfig) {
        const artefactData = artefactsConfig[artefactName];
        if (artefactData.tier === tier) {
            campCards.push(CreateArtefactCard({
                path: artefactData.name,
                name: artefactData.name,
                description: artefactData.description,
                buff: artefactData.buff,
                validators: artefactData.validators,
                actions: artefactData.actions,
                stack: artefactData.stack,
                playerSuit: artefactData.playerSuit,
                points: artefactData.points,
                rank: artefactData.rank,
            }));
        }
    }
    const mercenariesConfigTier = mercenariesConfig[tier];
    for (let i = 0; i < mercenariesConfigTier.length; i++) {
        AssertMercenariesConfigIndex(i);
        const mercenaryData = mercenariesConfigTier[i];
        let name = ``, path = ``, campMercenarySuit;
        for (campMercenarySuit in mercenaryData) {
            path += `${campMercenarySuit} `;
            name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
            // TODO Rework KeyofType<BasicSuitableNullableCardInfo>!?
            let campMercenaryCardProperty;
            for (campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                const mercenaryVariant = mercenaryData[campMercenarySuit];
                if (mercenaryVariant !== undefined) {
                    if (campMercenaryCardProperty === `rank`) {
                        name += `шевронов: ${mercenaryVariant.rank}, `;
                    }
                    if (campMercenaryCardProperty === `points`) {
                        path += mercenaryVariant.points ? `${mercenaryVariant.points} ` : ``;
                        name += `очков: ${mercenaryVariant.points ? `${mercenaryVariant.points}) ` : `нет) `}`;
                    }
                }
            }
        }
        campCards.push(CreateMercenaryCard({
            path: path.trim(),
            name: name.trim(),
            variants: mercenaryData,
        }));
    }
    return campCards;
};
/**
 * <h3>Создание карты артефакта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param path URL путь.
 * @param description Описание.
 * @param buff Баф.
 * @param validators Валидаторы карты.
 * @param actions Действия.
 * @param stack Стек действий.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта артефакта.
 */
const CreateArtefactCard = ({ type = CardTypeRusNames.ArtefactCard, name, path, description, buff, validators, actions, stack, playerSuit = null, points = null, rank = 1, }) => ({
    type,
    name,
    path,
    description,
    buff,
    validators,
    actions,
    stack,
    playerSuit,
    points,
    rank,
});
/**
 * <h3>Создание карты артефакта на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты артефакта на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param path URL путь.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта артефакта на поле игрока.
 */
export const CreateArtefactPlayerCard = ({ type = CardTypeRusNames.ArtefactPlayerCard, name, path, description, suit, points = null, rank = 1, }) => ({
    type,
    name,
    path,
    description,
    suit,
    points,
    rank,
});
/**
 * <h3>Создание карты наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт наёмников во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param path URL путь.
 * @param variants Варианты расположения карты наёмника.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта наёмника.
 */
const CreateMercenaryCard = ({ type = CardTypeRusNames.MercenaryCard, name, path, variants, playerSuit = null, points = null, rank = null, }) => ({
    type,
    name,
    path,
    variants,
    playerSuit,
    points,
    rank
});
/**
 * <h3>Создание карты наёмника на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты наёмника на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param name Название.
 * @param path URL путь.
 * @param suit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта наёмника на поле игрока.
 */
export const CreateMercenaryPlayerCard = ({ type = CardTypeRusNames.MercenaryPlayerCard, name, path, suit, points = null, rank = 1, }) => ({
    type,
    name,
    path,
    suit,
    points,
    rank,
});
//# sourceMappingURL=Camp.js.map