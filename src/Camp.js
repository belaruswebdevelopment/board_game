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
                actions: artefactData.actions,
                buff: artefactData.buff,
                description: artefactData.description,
                name: artefactData.name,
                path: artefactData.name,
                playerSuit: artefactData.playerSuit,
                points: artefactData.points,
                rank: artefactData.rank,
                stack: artefactData.stack,
                validators: artefactData.validators,
            }));
        }
    }
    const mercenariesConfigTier = mercenariesConfig[tier];
    for (let i = 0; i < mercenariesConfigTier.length; i++) {
        AssertMercenariesConfigIndex(i);
        const mercenaryData = mercenariesConfigTier[i];
        let name = ``, path = ``, campMercenarySuit;
        for (campMercenarySuit in mercenaryData) {
            name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
            path += `${campMercenarySuit} `;
            let campMercenaryCardProperty;
            for (campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                const mercenaryVariant = mercenaryData[campMercenarySuit];
                if (mercenaryVariant !== undefined) {
                    if (campMercenaryCardProperty === `rank`) {
                        name += `шевронов: ${mercenaryVariant.rank}, `;
                    }
                    if (campMercenaryCardProperty === `points`) {
                        name += `очков: ${mercenaryVariant.points ? `${mercenaryVariant.points}) ` : `нет) `}`;
                        path += mercenaryVariant.points ? `${mercenaryVariant.points} ` : ``;
                    }
                }
            }
        }
        campCards.push(CreateMercenaryCard({
            name: name.trim(),
            path: path.trim(),
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
 * @param actions Действия.
 * @param buff Баф.
 * @param description Описание.
 * @param name Название.
 * @param type Тип.
 * @param path URL путь.
 * @param validators Валидаторы карты.
 * @param stack Стек действий.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @returns Карта артефакта.
 */
const CreateArtefactCard = ({ actions, buff, description, name, path, playerSuit = null, points = null, rank = 1, stack, type = CardTypeRusNames.ArtefactCard, validators, }) => ({
    actions,
    buff,
    description,
    name,
    type,
    path,
    playerSuit,
    points,
    rank,
    stack,
    validators,
});
/**
 * <h3>Создание карты артефакта на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты артефакта на поле игрока.</li>
 * </ol>
 *
 * @param description Описание.
 * @param name Название.
 * @param path URL путь.
 * @param points Очки.
 * @param rank Шевроны.
 * @param suit Название фракции дворфов.
 * @param type Тип.
 * @returns Карта артефакта на поле игрока.
 */
export const CreateArtefactPlayerCard = ({ description, name, path, points = null, rank = 1, suit, type = CardTypeRusNames.ArtefactPlayerCard, }) => ({
    description,
    name,
    path,
    points,
    rank,
    suit,
    type,
});
/**
 * <h3>Создание карты наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт наёмников во время инициализации игры.</li>
 * </ol>
 *
 * @param name Название.
 * @param path URL путь.
 * @param playerSuit Название фракции дворфов.
 * @param points Очки.
 * @param rank Шевроны.
 * @param type Тип.
 * @param variants Варианты расположения карты наёмника.
 * @returns Карта наёмника.
 */
const CreateMercenaryCard = ({ name, path, playerSuit = null, points = null, rank = null, type = CardTypeRusNames.MercenaryCard, variants, }) => ({
    name,
    path,
    playerSuit,
    points,
    rank,
    type,
    variants,
});
/**
 * <h3>Создание карты наёмника на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании конкретной карты наёмника на поле игрока.</li>
 * </ol>
 *
 * @param name Название.
 * @param path URL путь.
 * @param points Очки.
 * @param rank Шевроны.
 * @param suit Название фракции дворфов.
 * @param type Тип.
 * @returns Карта наёмника на поле игрока.
 */
export const CreateMercenaryPlayerCard = ({ name, path, points = null, rank = 1, suit, type = CardTypeRusNames.MercenaryPlayerCard, }) => ({
    name,
    path,
    points,
    rank,
    suit,
    type,
});
//# sourceMappingURL=Camp.js.map