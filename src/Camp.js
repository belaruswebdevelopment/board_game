import { suitsConfig } from "./data/SuitData";
import { RusCardTypes } from "./typescript/enums";
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
    for (const artefactName in artefactConfig) {
        if (Object.prototype.hasOwnProperty.call(artefactConfig, artefactName)) {
            if (artefactConfig[artefactName].tier === tier) {
                campCards.push(CreateArtefactCampCard({
                    tier,
                    path: artefactConfig[artefactName].name,
                    name: artefactConfig[artefactName].name,
                    description: artefactConfig[artefactName].description,
                    game: artefactConfig[artefactName].game,
                    suit: artefactConfig[artefactName].suit,
                    rank: artefactConfig[artefactName].rank,
                    points: artefactConfig[artefactName].points,
                    buff: artefactConfig[artefactName].buff,
                    validators: artefactConfig[artefactName].validators,
                    actions: artefactConfig[artefactName].actions,
                    stack: artefactConfig[artefactName].stack,
                }));
            }
        }
    }
    for (let i = 0; i < mercenariesConfig[tier].length; i++) {
        let name = ``, path = ``;
        for (const campMercenarySuit in mercenariesConfig[tier][i]) {
            if (Object.prototype.hasOwnProperty.call(mercenariesConfig[tier][i], campMercenarySuit)) {
                path += campMercenarySuit + ` `;
                name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
                for (const campMercenaryCardProperty in mercenariesConfig[tier][i][campMercenarySuit]) {
                    if (Object.prototype.hasOwnProperty.call(mercenariesConfig[tier][i][campMercenarySuit], campMercenaryCardProperty)) {
                        const mercenaryVariant = mercenariesConfig[tier][i][campMercenarySuit];
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
            variants: mercenariesConfig[tier][i],
        }));
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
export const CreateMercenaryCampCard = ({ type = RusCardTypes.MERCENARY, tier, path, name, game = `thingvellir`, variants, } = {}) => ({
    type,
    tier,
    path,
    name,
    game,
    variants,
});
export const IsArtefactDiscardCard = (card) => card.validators !== undefined;
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
export const IsArtefactCardNotMercenary = (card) => card.suit !== undefined;
export const IsMercenaryCard = (card) => card.variants !== undefined && card.tier !== undefined;
//# sourceMappingURL=Camp.js.map