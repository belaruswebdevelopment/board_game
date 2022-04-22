import { suitsConfig } from "./data/SuitData";
import { GameNames, RusCardTypes } from "./typescript/enums";
import type { CampDeckCardTypes, IArtefact, IArtefactCampCard, IArtefactConfig, IArtefactTypes, ICreateArtefactCampCard, ICreateMercenaryCampCard, ICreateMercenaryPlayerCard, IMercenary, IMercenaryCampCard, IMercenaryPlayerCard, SuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

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
    mercenariesConfig: Partial<SuitPropertyTypes<IMercenary>>[][]): CampDeckCardTypes[] => {
    const campCards: CampDeckCardTypes[] = [];
    let artefactName: IArtefactTypes;
    for (artefactName in artefactConfig) {
        if (Object.prototype.hasOwnProperty.call(artefactConfig, artefactName)) {
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
    }
    const mercenariesConfigTier: Partial<SuitPropertyTypes<IMercenary>>[] | undefined = mercenariesConfig[tier];
    if (mercenariesConfigTier === undefined) {
        throw new Error(`Отсутствует массив значений карт наёмников в указанной эпохе - '${tier}'.`);
    }
    for (let i = 0; i < mercenariesConfigTier.length; i++) {
        let name = ``,
            path = ``,
            campMercenarySuit: SuitTypes;
        const mercenaryData: Partial<SuitPropertyTypes<IMercenary>> | undefined = mercenariesConfigTier[i];
        if (mercenaryData === undefined) {
            throw new Error(`Отсутствует массив значений карты наёмника с id '${i}' в указанной эпохе - '${tier}'.`);
        }
        for (campMercenarySuit in mercenaryData) {
            if (Object.prototype.hasOwnProperty.call(mercenaryData, campMercenarySuit)) {
                path += campMercenarySuit + ` `;
                name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
                for (const campMercenaryCardProperty in mercenaryData[campMercenarySuit]) {
                    if (Object.prototype.hasOwnProperty.call(mercenaryData[campMercenarySuit],
                        campMercenaryCardProperty)) {
                        const mercenaryVariant: IMercenary | undefined = mercenaryData[campMercenarySuit];
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
 * @param suit Название фракции.
 * @param rank Шевроны.
 * @param points Очки.
 * @param buff Баф.
 * @param validators Валидаторы.
 * @param actions Действия.
 * @param stack Действия.
 * @returns Карта лагеря артефакт.
 */
export const CreateArtefactCampCard = ({
    type = RusCardTypes.ARTEFACT,
    tier,
    path,
    name,
    description,
    game = GameNames.Thingvellir,
    suit = null,
    rank = null,
    points = null,
    buff,
    validators,
    actions,
    stack,
}: ICreateArtefactCampCard = {} as ICreateArtefactCampCard): IArtefactCampCard => ({
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
 * @param variants Варианты расположения карты наёмника.
 * @returns Карта лагеря наёмник.
 */
export const CreateMercenaryCampCard = ({
    type = RusCardTypes.MERCENARY,
    tier,
    path,
    name,
    game = GameNames.Thingvellir,
    variants,
}: ICreateMercenaryCampCard = {} as ICreateMercenaryCampCard): IMercenaryCampCard => ({
    type,
    tier,
    path,
    name,
    game,
    variants,
});

/**
 * <h3>Создание карты наёмника в руке игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при выкладке карты наёмника в руку игрока.</li>
 * </ol>
 *
 * @param type Тип.
 * @param suit Название фракции.
 * @param rank Шевроны.
 * @param points Очки.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param variants Варианты расположения карты наёмника.
 * @returns Карта наёмника в руке игрока.
 */
export const CreateMercenaryPlayerCard = ({
    type = RusCardTypes.MERCENARYPLAYERCARD,
    suit,
    rank,
    points,
    name,
    game = GameNames.Thingvellir,
    tier,
    path,
    variants,
}: ICreateMercenaryPlayerCard = {} as ICreateMercenaryPlayerCard): IMercenaryPlayerCard => ({
    type,
    suit,
    rank,
    points,
    name,
    game,
    tier,
    path,
    variants,
});

/**
 * <h3>Проверка, является ли объект картой лагеря артефакта или картой лагеря наёмника.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверках в функциях.</li>
 * </ol>
 *
 * @param card Карта.
 * @returns Является ли объект картой лагеря артефакта или картой лагеря наёмника.
 */
export const IsArtefactCard = (card: unknown): card is IArtefactCampCard => card !== null
    && (card as IArtefactCampCard).description !== undefined && (card as IArtefactCampCard).tier !== undefined;

export const IsMercenaryCampCard = (card: unknown): card is IMercenaryCampCard => card !== null
    && (card as IMercenaryCampCard).variants !== undefined && (card as IMercenaryCampCard).tier !== undefined;

export const IsMercenaryPlayerCard = (card: unknown): card is IMercenaryPlayerCard => card !== null
    && (card as IMercenaryPlayerCard).variants !== undefined && (card as IMercenaryPlayerCard).suit !== undefined;
