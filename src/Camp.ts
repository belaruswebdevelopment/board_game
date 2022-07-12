import { suitsConfig } from "./data/SuitData";
import { RusCardTypeNames } from "./typescript/enums";
import type { ArtefactTypes, CampDeckCardTypes, CanBeUndef, CreateArtefactCampCardType, CreateMercenaryCampCardType, CreateMercenaryPlayerCardType, IArtefact, IArtefactCampCard, IArtefactConfig, IMercenaryCampCard, IMercenaryPlayerCard, MercenaryType, SuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

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
        const artefactData: IArtefact = artefactConfig[artefactName];
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
            for (const campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
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
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @param buff Баф.
 * @param validators Валидаторы.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Карта лагеря артефакт.
 */
export const CreateArtefactCampCard = ({
    type = RusCardTypeNames.Artefact_Card,
    tier,
    path,
    name,
    description,
    suit = null,
    rank = null,
    points = null,
    buff,
    validators,
    actions,
    stack,
}: CreateArtefactCampCardType = {} as CreateArtefactCampCardType): IArtefactCampCard => ({
    type,
    tier,
    path,
    name,
    description,
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
 * @param variants Варианты расположения карты наёмника на поле игрока.
 * @param suit Название фракции дворфов.
 * @param rank Шевроны.
 * @param points Очки.
 * @returns Карта лагеря наёмник.
 */
export const CreateMercenaryCampCard = ({
    type = RusCardTypeNames.Mercenary_Card,
    tier,
    path,
    name,
    variants,
}: CreateMercenaryCampCardType = {} as CreateMercenaryCampCardType): IMercenaryCampCard => ({
    type,
    tier,
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
 * @param tier Эпоха.
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
    tier,
    path,
}: CreateMercenaryPlayerCardType = {} as CreateMercenaryPlayerCardType): IMercenaryPlayerCard => ({
    type,
    suit,
    rank,
    points,
    name,
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
export const IsArtefactCard = (card: unknown): card is IArtefactCampCard => card !== null
    && (card as IArtefactCampCard).description !== undefined && (card as IArtefactCampCard).tier !== undefined;

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
export const IsMercenaryCampCard = (card: unknown): card is IMercenaryCampCard => card !== null
    && (card as IMercenaryCampCard).variants !== undefined && (card as IMercenaryCampCard).tier !== undefined;

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
export const IsMercenaryPlayerCard = (card: unknown): card is IMercenaryPlayerCard => card !== null
    && (card as IMercenaryPlayerCard).path !== undefined && (card as IMercenaryPlayerCard).suit !== undefined
    && !(`validators` in (card as IMercenaryPlayerCard));
