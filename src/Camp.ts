import { artefactsConfig, mercenariesConfig } from "./data/CampData";
import { suitsConfig } from "./data/SuitData";
import { CardTypeRusNames, SuitNames } from "./typescript/enums";
import type { ArtefactCampCard, ArtefactCampCardData, ArtefactNamesKeyofTypeofType, ArtefactPlayerCampCard, BasicSuitableNullableCardInfo, CampDeckCardType, CanBeUndefType, CreateArtefactCampCardFromData, CreateArtefactPlayerCampCardFromData, CreateMercenaryCampCardFromData, CreateMercenaryPlayerCampCardFromData, IndexOf, KeyofType, MercenariesConfig, MercenariesConfigType, MercenaryCampCard, MercenaryData, MercenaryPlayerCampCard, MercenaryType, TierType } from "./typescript/interfaces";

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
export const BuildCampCards = (tier: TierType): CampDeckCardType[] => {
    const campCards: CampDeckCardType[] = [];
    let artefactName: ArtefactNamesKeyofTypeofType;
    for (artefactName in artefactsConfig) {
        const artefactData: ArtefactCampCardData = artefactsConfig[artefactName];
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
    const mercenariesConfigTier: MercenariesConfigType =
        mercenariesConfig[tier satisfies IndexOf<MercenariesConfig>];
    for (let i = 0; i < mercenariesConfigTier.length; i++) {
        const mercenaryData: MercenaryData = mercenariesConfigTier[i as IndexOf<MercenariesConfigType>];
        let name = ``,
            path = ``,
            campMercenarySuit: SuitNames;
        for (campMercenarySuit in mercenaryData) {
            path += `${campMercenarySuit} `;
            name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
            // TODO Rework KeyofType<BasicSuitableNullableCardInfo>!?
            let campMercenaryCardProperty: KeyofType<BasicSuitableNullableCardInfo>;
            for (campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                const mercenaryVariant: CanBeUndefType<MercenaryType> = mercenaryData[campMercenarySuit];
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
 * @param name Название.
 * @param path URL путь.
 * @param description Описание.
 * @param buff Баф.
 * @param validators Валидаторы карты.
 * @param actions Действия.
 * @param stack Стек действий.
 * @returns Карта лагеря Артефакт.
 */
const CreateArtefactCampCard = ({
    type = CardTypeRusNames.Artefact_Card,
    name,
    path,
    description,
    buff,
    validators,
    actions,
    stack,
}: CreateArtefactCampCardFromData): ArtefactCampCard => ({
    type,
    name,
    path,
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
 * @param name Название.
 * @param path URL путь.
 * @param description Описание.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря Артефакт.
 */
const CreateArtefactPlayerCampCard = ({
    type = CardTypeRusNames.Artefact_Player_Card,
    name,
    path,
    description,
    suit,
    rank = 1,
    points = null,
}: CreateArtefactPlayerCampCardFromData): ArtefactPlayerCampCard => ({
    type,
    name,
    path,
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
 * @param name Название.
 * @param path URL путь.
 * @param variants Варианты расположения карты лагеря Наёмник на поле игрока.
 * @returns Карта лагеря Наёмник.
 */
const CreateMercenaryCampCard = ({
    type = CardTypeRusNames.Mercenary_Card,
    name,
    path,
    variants,
}: CreateMercenaryCampCardFromData): MercenaryCampCard => ({
    type,
    name,
    path,
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
 * @param name Название.
 * @param path URL путь.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря Наёмник на поле игрока.
 */
export const CreateMercenaryPlayerCampCard = ({
    type = CardTypeRusNames.Mercenary_Player_Card,
    name,
    path,
    suit,
    rank = 1,
    points = null,
}: CreateMercenaryPlayerCampCardFromData): MercenaryPlayerCampCard => ({
    type,
    name,
    path,
    suit,
    rank,
    points,
});
