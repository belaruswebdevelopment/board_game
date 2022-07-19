import { suitsConfig } from "./data/SuitData";
import { RusCardTypeNames } from "./typescript/enums";
import type { ArtefactTypes, BasicSuitableNullableCardInfoTypes, CampDeckCardTypes, CanBeUndef, CreateArtefactCampCardType, CreateArtefactPlayerCampCardType, CreateMercenaryCampCardType, CreateMercenaryPlayerCardType, IArtefactCampCard, IArtefactConfig, IArtefactData, IArtefactPlayerCampCard, IMercenaryCampCard, IMercenaryPlayerCard, MercenaryType, SuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

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
export const BuildCampCards = (tier: number, artefactConfig: IArtefactConfig,
    mercenariesConfig: Partial<SuitPropertyTypes<MercenaryType>>[][]): CampDeckCardTypes[] => {
    const campCards: CampDeckCardTypes[] = [];
    let artefactName: ArtefactTypes;
    for (artefactName in artefactConfig) {
        const artefactData: IArtefactData = artefactConfig[artefactName];
        if (artefactData.tier === tier) {
            if (artefactData.suit !== undefined && artefactData.rank !== undefined
                && artefactData.points !== undefined) {
                campCards.push(CreateArtefactPlayerCampCard({
                    path: artefactData.name,
                    name: artefactData.name,
                    description: artefactData.description,
                    suit: artefactData.suit,
                    rank: artefactData.rank,
                    points: artefactData.points,
                }));
            } else {
                campCards.push(CreateArtefactCampCard({
                    path: artefactData.name,
                    name: artefactData.name,
                    description: artefactData.description,
                    buff: artefactData.buff,
                    validators: artefactData.validators,
                    actions: artefactData.actions,
                    stack: artefactData.stack,
                }));
            }
        }
    }
    const mercenariesConfigTier: CanBeUndef<Partial<SuitPropertyTypes<MercenaryType>>[]> = mercenariesConfig[tier];
    if (mercenariesConfigTier === undefined) {
        throw new Error(`Отсутствует массив значений карт наёмников в указанной эпохе - '${tier}'.`);
    }
    for (let i = 0; i < mercenariesConfigTier.length; i++) {
        let name = ``,
            path = ``,
            campMercenarySuit: SuitTypes;
        const mercenaryData: CanBeUndef<Partial<SuitPropertyTypes<MercenaryType>>> = mercenariesConfigTier[i];
        if (mercenaryData === undefined) {
            throw new Error(`Отсутствует массив значений карты наёмника с id '${i}' в указанной эпохе - '${tier}'.`);
        }
        for (campMercenarySuit in mercenaryData) {
            path += campMercenarySuit + ` `;
            name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
            let campMercenaryCardProperty: BasicSuitableNullableCardInfoTypes;
            for (campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                const mercenaryVariant: CanBeUndef<MercenaryType> = mercenaryData[campMercenarySuit];
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
 * @param path URL путь.
 * @param name Название.
 * @param description Описание.
 * @param buff Баф.
 * @param validators Валидаторы карты.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Карта лагеря артефакт.
 */
const CreateArtefactCampCard = ({
    type = RusCardTypeNames.Artefact_Card,
    path,
    name,
    description,
    buff,
    validators,
    actions,
    stack,
}: CreateArtefactCampCardType = {} as CreateArtefactCampCardType): IArtefactCampCard => ({
    type,
    path,
    name,
    description,
    buff,
    validators,
    actions,
    stack,
});

/**
 * <h3>Создание карты артефакта на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов лагеря во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param path URL путь.
 * @param name Название.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря артефакт.
 */
const CreateArtefactPlayerCampCard = ({
    type = RusCardTypeNames.Artefact_Player_Card,
    path,
    name,
    description,
    suit,
    rank,
    points = null,
}: CreateArtefactPlayerCampCardType = {} as CreateArtefactPlayerCampCardType): IArtefactPlayerCampCard => ({
    type,
    path,
    name,
    description,
    suit,
    rank,
    points,
});

/**
 * <h3>Создание карты наёмника для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт наёмников лагеря во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param path URL путь.
 * @param name Название.
 * @param variants Варианты расположения карты наёмника на поле игрока.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря наёмник.
 */
const CreateMercenaryCampCard = ({
    type = RusCardTypeNames.Mercenary_Card,
    path,
    name,
    variants,
}: CreateMercenaryCampCardType = {} as CreateMercenaryCampCardType): IMercenaryCampCard => ({
    type,
    path,
    name,
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
 * @param path URL путь.
 * @param variants Варианты расположения карты наёмника на поле игрока.
 * @returns Карта наёмника на поле игрока.
 */
export const CreateMercenaryPlayerCard = ({
    type = RusCardTypeNames.Mercenary_Player_Card,
    suit,
    rank = 1,
    points,
    name,
    path,
}: CreateMercenaryPlayerCardType = {} as CreateMercenaryPlayerCardType): IMercenaryPlayerCard => ({
    type,
    suit,
    rank,
    points,
    name,
    path,
});
