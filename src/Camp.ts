import { suitsConfig } from "./data/SuitData";
import { RusCardTypes } from "./typescript/enums";
import { CampDeckCardTypes, DiscardCardTypes, IArtefactCampCard, IArtefactConfig, IArtefactTypes, ICreateArtefactCampCard, ICreateMercenaryCampCard, IMercenary, IMercenaryCampCard, OptionalSuitPropertyTypes, SuitTypes } from "./typescript/interfaces";

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
export const BuildCampCards = (tier: number, artefactConfig: IArtefactConfig,
    mercenariesConfig: OptionalSuitPropertyTypes<IMercenary>[][]):
    CampDeckCardTypes[] => {
    const campCards: CampDeckCardTypes[] = [];
    for (const artefactName in artefactConfig) {
        if (Object.prototype.hasOwnProperty.call(artefactConfig, artefactName)) {
            if (artefactConfig[artefactName as IArtefactTypes].tier === tier) {
                campCards.push(CreateArtefactCampCard({
                    tier,
                    path: artefactConfig[artefactName as IArtefactTypes].name,
                    name: artefactConfig[artefactName as IArtefactTypes].name,
                    description: artefactConfig[artefactName as IArtefactTypes].description,
                    game: artefactConfig[artefactName as IArtefactTypes].game,
                    suit: artefactConfig[artefactName as IArtefactTypes].suit,
                    rank: artefactConfig[artefactName as IArtefactTypes].rank,
                    points: artefactConfig[artefactName as IArtefactTypes].points,
                    buff: artefactConfig[artefactName as IArtefactTypes].buff,
                    validators: artefactConfig[artefactName as IArtefactTypes].validators,
                    actions: artefactConfig[artefactName as IArtefactTypes].actions,
                    stack: artefactConfig[artefactName as IArtefactTypes].stack,
                }));
            }
        }
    }
    for (let i = 0; i < mercenariesConfig[tier].length; i++) {
        let name = ``,
            path = ``;
        for (const campMercenarySuit in mercenariesConfig[tier][i]) {
            if (Object.prototype.hasOwnProperty.call(mercenariesConfig[tier][i], campMercenarySuit)) {
                path += campMercenarySuit + ` `;
                name += `(фракция: ${suitsConfig[campMercenarySuit as SuitTypes].suitName}, `;
                for (const campMercenaryCardProperty in mercenariesConfig[tier][i][campMercenarySuit as SuitTypes]) {
                    if (Object.prototype.hasOwnProperty.call(mercenariesConfig[tier][i][campMercenarySuit as
                        SuitTypes], campMercenaryCardProperty)) {
                        const mercenaryVariant: IMercenary | undefined =
                            mercenariesConfig[tier][i][campMercenarySuit as SuitTypes];
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
export const CreateArtefactCampCard = ({
    type = RusCardTypes.ARTEFACT,
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
}: ICreateArtefactCampCard = {} as ICreateArtefactCampCard):
    IArtefactCampCard => ({
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
export const CreateMercenaryCampCard = ({
    type = RusCardTypes.MERCENARY,
    tier,
    path,
    name,
    game = `thingvellir`,
    variants,
}: ICreateMercenaryCampCard = {} as ICreateMercenaryCampCard): IMercenaryCampCard => ({
    type,
    tier,
    path,
    name,
    game,
    variants,
});

export const IsArtefactDiscardCard = (card: DiscardCardTypes): card is IArtefactCampCard =>
    (card as IArtefactCampCard).validators !== undefined;

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
export const IsArtefactCardNotMercenary = (card: IArtefactCampCard | IMercenaryCampCard): card is IArtefactCampCard =>
    (card as IArtefactCampCard).suit !== undefined;

export const IsMercenaryCard = (card: unknown): card is IMercenaryCampCard =>
    (card as IMercenaryCampCard).variants !== undefined && (card as IMercenaryCampCard).tier !== undefined;
