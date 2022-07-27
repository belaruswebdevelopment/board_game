import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { suitsConfig } from "./data/SuitData";
import { RusCardTypeNames } from "./typescript/enums";
import type { ArtefactNamesKeyofTypeofType, CampDeckCardType, CanBeUndefType, CreateArtefactCampCardType, CreateArtefactPlayerCampCardType, CreateMercenaryCampCardType, CreateMercenaryPlayerCampCardType, IArtefactCampCard, IArtefactData, IArtefactPlayerCampCard, IBasicSuitableNullableCardInfo, IMercenaryCampCard, IMercenaryPlayerCampCard, KeyofType, MercenaryType, SuitNamesKeyofTypeofType, SuitPropertyType } from "./typescript/interfaces";

/**
 * <h3>Создаёт все карты лагеря из конфига.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при инициализации игры.</li>
 * </ol>
 *
 * @param tier Эпоха.
 * @returns Все карты лагеря.
 */
export const BuildCampCards = (tier: number): CampDeckCardType[] => {
    const campCards: CampDeckCardType[] = [];
    let artefactName: ArtefactNamesKeyofTypeofType;
    for (artefactName in artefactsConfig) {
        const artefactData: IArtefactData = artefactsConfig[artefactName];
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
    const mercenariesConfigTier: CanBeUndefType<Partial<SuitPropertyType<MercenaryType>>[]> = mercenariesConfig[tier];
    if (mercenariesConfigTier === undefined) {
        throw new Error(`Отсутствует массив значений карт наёмников в указанной эпохе - '${tier}'.`);
    }
    for (let i = 0; i < mercenariesConfigTier.length; i++) {
        const mercenaryData: CanBeUndefType<Partial<SuitPropertyType<MercenaryType>>> = mercenariesConfigTier[i];
        if (mercenaryData === undefined) {
            throw new Error(`Отсутствует массив значений карты наёмника с id '${i}' в указанной эпохе - '${tier}'.`);
        }
        let name = ``,
            path = ``,
            campMercenarySuit: SuitNamesKeyofTypeofType;
        for (campMercenarySuit in mercenaryData) {
            path += campMercenarySuit + ` `;
            name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
            let campMercenaryCardProperty: KeyofType<IBasicSuitableNullableCardInfo>;
            for (campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                const mercenaryVariant: CanBeUndefType<MercenaryType> = mercenaryData[campMercenarySuit];
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
 * <h3>Создание карты лагеря Артефакт для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт лагеря Артефакт лагеря во время инициализации игры.</li>
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
 * @returns Карта лагеря Артефакт.
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
 * <h3>Создание карты лагеря Артефакт на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт лагеря Артефакт во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param path URL путь.
 * @param name Название.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря Артефакт.
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
 * <h3>Создание карты лагеря Наёмник для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт лагеря Наёмник во время инициализации игры.</li>
 * </ol>
 *
 * @param type Тип.
 * @param path URL путь.
 * @param name Название.
 * @param variants Варианты расположения карты лагеря Наёмник на поле игрока.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря Наёмник.
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
 * <h3>Создание карты лагеря Наёмник на поле игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при размещении карты лагеря Наёмник на поле игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param path URL путь.
 * @param variants Варианты расположения карты лагеря Наёмник на поле игрока.
 * @returns Карта лагеря Наёмник на поле игрока.
 */
export const CreateMercenaryPlayerCampCard = ({
    type = RusCardTypeNames.Mercenary_Player_Card,
    suit,
    rank = 1,
    points,
    name,
    path,
}: CreateMercenaryPlayerCampCardType = {} as CreateMercenaryPlayerCampCardType): IMercenaryPlayerCampCard => ({
    type,
    suit,
    rank,
    points,
    name,
    path,
});
