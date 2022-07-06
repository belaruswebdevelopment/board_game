import { suitsConfig } from "./data/SuitData";
import { GameNames, RusCardTypeNames } from "./typescript/enums";
/**
 * <h3>Создаёт все карты лагеря из конфига.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param tier Эпоха.
 * @param artefactConfig Файл конфига карт артефактов.
 * @param mercenariesConfig Файл конфига наёмников.
 * @returns Все карты лагеря.
 */
export const BuildCampCards = (tier, artefactConfig, mercenariesConfig) => {
    const campCards = [];
    let artefactName;
    for (artefactName in artefactConfig) {
        const artefactData = artefactConfig[artefactName];
        if (artefactData.tier === tier) {
            campCards.push(CreateArtefactCampCard({
                tier,
                path: artefactData.name,
                name: artefactData.name,
                description: artefactData.description,
                suit: artefactData.suit,
                rank: artefactData.rank,
                points: artefactData.points,
                buff: artefactData.buff,
                validators: artefactData.validators,
                actions: artefactData.actions,
                stack: artefactData.stack,
            }));
        }
    }
    const mercenariesConfigTier = mercenariesConfig[tier];
    if (mercenariesConfigTier === undefined) {
        throw new Error(`Отсутствует массив значений карт наёмников в указанной эпохе - '${tier}'.`);
    }
    for (let i = 0; i < mercenariesConfigTier.length; i++) {
        let name = ``, path = ``, campMercenarySuit;
        const mercenaryData = mercenariesConfigTier[i];
        if (mercenaryData === undefined) {
            throw new Error(`Отсутствует массив значений карты наёмника с id '${i}' в указанной эпохе - '${tier}'.`);
        }
        for (campMercenarySuit in mercenaryData) {
            path += campMercenarySuit + ` `;
            name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
            for (const campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                const mercenaryVariant = mercenaryData[campMercenarySuit];
                if (mercenaryVariant !== undefined) {
                    if (campMercenaryCardProperty === `rank`) {
                        name += `шевронов: ${mercenaryVariant.rank}, `;
                    }
                    if (campMercenaryCardProperty === `points`) {
                        path += mercenaryVariant.points ? mercenaryVariant.points + ` ` : ``;
                        name += `очков: ${mercenaryVariant.points ? mercenaryVariant.points + `) ` : `нет) `}`;
                    }
                }
            }
        }
        campCards.push(CreateMercenaryCampCard({
            tier,
            path: path.trim(),
            name: name.trim(),
            variants: mercenaryData,
        }));
    }
    return campCards;
};
/**
 * <h3>Создание карты артефакта для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов лагеря во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param name Название.
 * @param description Описание.
 * @param game Игра/дополнение.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param buff Баф.
 * @param validators Валидаторы.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Карта лагеря артефакт.
 */
export const CreateArtefactCampCard = ({ type = RusCardTypeNames.Artefact, tier, path, name, description, game = GameNames.Thingvellir, suit = null, rank = null, points = null, buff, validators, actions, stack, } = {}) => ({
    type,
    tier,
    path,
    name,
    description,
    game,
    suit,
    rank,
    points,
    buff,
    validators,
    actions,
    stack,
});
/**
 * <h3>Создание карты наёмника для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт наёмников лагеря во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param variants Варианты расположения карты наёмника на поле игрока.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря наёмник.
 */
export const CreateMercenaryCampCard = ({ type = RusCardTypeNames.Mercenary, tier, path, name, game = GameNames.Thingvellir, variants, } = {}) => ({
    type,
    tier,
    path,
    name,
    game,
    variants,
});
/**
 * <h3>Создание карты наёмника на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при размещении карты наёмника на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param variants Варианты расположения карты наёмника на поле игрока.
 * @returns Карта наёмника на поле игрока.
 */
export const CreateMercenaryPlayerCard = ({ type = RusCardTypeNames.Mercenary_Player_Card, suit, rank = 1, points, name, game = GameNames.Thingvellir, tier, path, } = {}) => ({
    type,
    suit,
    rank,
    points,
    name,
    game,
    tier,
    path,
});
/**
 * <h3>Проверка, является ли объект картой лагеря артефакта.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой лагеря артефакта.
 */
export const IsArtefactCard = (card) => card !== null
    && card.description !== undefined && card.tier !== undefined;
/**
 * <h3>Проверка, является ли объект картой лагеря наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой лагеря наёмника.
 */
export const IsMercenaryCampCard = (card) => card !== null
    && card.variants !== undefined && card.tier !== undefined;
/**
 * <h3>Проверка, является ли объект картой наёмника на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой наёмника на поле игрока.
 */
export const IsMercenaryPlayerCard = (card) => card !== null
    && card.path !== undefined && card.suit !== undefined
    && !(`validators` in card);
//# sourceMappingURL=Camp.js.map