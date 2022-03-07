import { suitsConfig } from "./data/SuitData";
import { GameNames, RusCardTypes } from "./typescript/enums";
/**
 * <h3>Создаёт все карты кэмпа из конфига.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param tier Эпоха.
 * @param artefactConfig Файл конфига карт артефактов.
 * @param mercenariesConfig Файл конфига наёмников.
 * @returns Все карты кэмпа.
 */
export const BuildCampCards = (tier, artefactConfig, mercenariesConfig) => {
    const campCards = [];
    let artefactName;
    for (artefactName in artefactConfig) {
        if (Object.prototype.hasOwnProperty.call(artefactConfig, artefactName)) {
            const artefactData = artefactConfig[artefactName];
            if (artefactData.tier === tier) {
                campCards.push(CreateArtefactCampCard({
                    tier,
                    path: artefactData.name,
                    name: artefactData.name,
                    description: artefactData.description,
                    game: artefactData.game,
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
    }
    const mercenariesConfigTier = mercenariesConfig[tier];
    if (mercenariesConfigTier !== undefined) {
        for (let i = 0; i < mercenariesConfigTier.length; i++) {
            let name = ``, path = ``, campMercenarySuit;
            const mercenaryData = mercenariesConfigTier[i];
            if (mercenaryData !== undefined) {
                for (campMercenarySuit in mercenaryData) {
                    if (Object.prototype.hasOwnProperty.call(mercenaryData, campMercenarySuit)) {
                        path += campMercenarySuit + ` `;
                        name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
                        for (const campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                            if (Object.prototype.hasOwnProperty.call(mercenaryData[campMercenarySuit], campMercenaryCardProperty)) {
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
                    }
                }
                campCards.push(CreateMercenaryCampCard({
                    tier,
                    path: path.trim(),
                    name: name.trim(),
                    variants: mercenaryData,
                }));
            }
            else {
                throw new Error(`Отсутствует массив значений карты наёмника ${i} в указанной эпохе - '${tier}'.`);
            }
        }
    }
    else {
        throw new Error(`Отсутствует массив значений карт наёмников в указанной эпохе - '${tier}'.`);
    }
    return campCards;
};
/**
 * <h3>Создание карты артефакта для кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов кэмпа во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param name Название.
 * @param description Описание.
 * @param game Игра/дополнение.
 * @param suit Название фракции.
 * @param rank Шевроны.
 * @param points Очки.
 * @param buff Баф.
 * @param validators Валидаторы.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Карта кэмпа артефакт.
 */
export const CreateArtefactCampCard = ({ type = RusCardTypes.ARTEFACT, tier, path, name, description, game, suit, rank, points, buff, validators, actions, stack, } = {}) => ({
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
 * <h3>Создание карты наёмника для кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт наёмников кэмпа во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param variants Варианты расположения карты наёмника.
 * @returns Карта кэмпа наёмник.
 */
export const CreateMercenaryCampCard = ({ type = RusCardTypes.MERCENARY, tier, path, name, game = GameNames.Thingvellir, variants, } = {}) => ({
    type,
    tier,
    path,
    name,
    game,
    variants,
});
/**
 * <h3>Проверка, является ли объект картой кэмпа артефакта или картой кэмпа наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой кэмпа артефакта или картой кэмпа наёмника.
 */
export const IsArtefactCard = (card) => card !== null
    && card.description !== undefined && card.tier !== undefined;
export const IsMercenaryCampCard = (card) => card !== null
    && card.variants !== undefined && card.tier !== undefined;
//# sourceMappingURL=Camp.js.map