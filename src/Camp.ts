import {DiscardCardFromTavern} from "./Card";
import {AddDataToLog, LogTypes} from "./Logging";
import {suitsConfig} from "./data/SuitData";
import {CampCardTypes, CampDeckCardTypes, MyGameState, TavernCardTypes} from "./GameSetup";
import {IStack} from "./Player";
import {IArtefactConfig, IMercenaries} from "./data/CampData";

export interface IArtefactCampCard {
    type: string,
    tier: number,
    path: string,
    name: string,
    description: string,
    game: string,
    suit: string,
    rank: null | number,
    points: null | number,
    stack: IStack[],
}

interface ICreateArtefactCampCard {
    type?: string,
    tier: number,
    path: string,
    name: string,
    description: string,
    game: string,
    suit: string,
    rank: null | number,
    points: null | number,
    stack: IStack[],
}

export interface IMercenaryCampCard {
    type: string,
    tier: number,
    path: string,
    name: string,
    game: string,
    stack: IStack[],
}

interface ICreateMercenaryCampCard {
    type?: string,
    tier: number,
    path: string,
    name: string,
    game?: string,
    stack: IStack[],
}

export const isArtefactCard = (card: IArtefactCampCard | IMercenaryCampCard | null): card is
    IArtefactCampCard => (card as IArtefactCampCard).suit !== undefined;

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
 * @param suit Фракция.
 * @param rank Шевроны.
 * @param points Очки.
 * @param stack Действия.
 * @constructor
 */
export const CreateArtefactCampCard = ({
                                           type = "артефакт",
                                           tier,
                                           path,
                                           name,
                                           description,
                                           game,
                                           suit,
                                           rank,
                                           points,
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
 * @param stack Действия.
 * @constructor
 */
export const CreateMercenaryCampCard = ({
                                            type = "наёмник",
                                            tier,
                                            path,
                                            name,
                                            game = "thingvellir",
                                            stack
                                        }: ICreateMercenaryCampCard = {} as ICreateMercenaryCampCard):
    IMercenaryCampCard => ({
    type,
    tier,
    path,
    name,
    game,
    stack,
});

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
 * @constructor
 */
export const BuildCampCards = (tier: number, artefactConfig: IArtefactConfig, mercenariesConfig: IMercenaries[][]):
    CampDeckCardTypes[] => {
    const campCards: CampDeckCardTypes[] = [];
    for (const campArtefactCard in artefactConfig) {
        if (artefactConfig.hasOwnProperty(campArtefactCard)) {
            if (artefactConfig[campArtefactCard].tier === tier) {
                campCards.push(CreateArtefactCampCard({
                    tier,
                    path: artefactConfig[campArtefactCard].name,
                    name: artefactConfig[campArtefactCard].name,
                    description: artefactConfig[campArtefactCard].description,
                    game: artefactConfig[campArtefactCard].game,
                    suit: artefactConfig[campArtefactCard].suit,
                    rank: artefactConfig[campArtefactCard].rank,
                    points: artefactConfig[campArtefactCard].points,
                    stack: artefactConfig[campArtefactCard].stack,
                } as ICreateArtefactCampCard));
            }
        }
    }
    for (let i: number = 0; i < mercenariesConfig[tier].length; i++) {
        let name: string = "",
            path: string = "";
        for (const campMercenarySuit in mercenariesConfig[tier][i]) {
            if (mercenariesConfig[tier][i].hasOwnProperty(campMercenarySuit)) {
                path += campMercenarySuit + " ";
                name += `(фракция: ${suitsConfig[campMercenarySuit].suitName}, `;
                for (const campMercenaryCardProperty in mercenariesConfig[tier][i][campMercenarySuit]) {
                    if (mercenariesConfig[tier][i][campMercenarySuit].hasOwnProperty(campMercenaryCardProperty)) {
                        if (campMercenaryCardProperty === "rank") {
                            name += `шевронов: ${mercenariesConfig[tier][i][campMercenarySuit].rank}, `;
                        }
                        if (campMercenaryCardProperty === "points") {
                            path += mercenariesConfig[tier][i][campMercenarySuit].points ?
                                mercenariesConfig[tier][i][campMercenarySuit].points + " " : "";
                            name += `очков: ${mercenariesConfig[tier][i][campMercenarySuit].points ?
                                mercenariesConfig[tier][i][campMercenarySuit].points + ") " : "нет) "}`;
                        }
                    }
                }
            }
        }
        campCards.push(CreateMercenaryCampCard({
            tier,
            path: path.trim(),
            name: name.trim(),
            stack: [
                {
                    actionName: "AddCampCardToCards",
                    variants: mercenariesConfig[tier][i],
                },
            ],
        } as ICreateMercenaryCampCard));
    }
    return campCards;
};

/**
 * <h3>Автоматически убирает оставшуюся карту таверны в стопку сброса при выборе карты из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяется после каждого выбора карты из таверны, если последний игрок в текущей таверне уже выбрал карту.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
export const DiscardCardIfCampCardPicked = (G: MyGameState): void => {
    const discardCardIndex: number = G.taverns[G.currentTavern]
        .findIndex((card: TavernCardTypes): boolean => card !== null);
    if (G.campPicked && discardCardIndex !== -1) {
        DiscardCardFromTavern(G, discardCardIndex);
        G.campPicked = false;
    }
};

/**
 * <h3>Автоматически заполняет кэмп недостающими картами текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале раунда.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
export const RefillEmptyCampCards = (G: MyGameState): void => {
    const emptyCampCards: (number | null)[] = G.camp.map((card: CampCardTypes, index: number): number | null => {
        if (card === null) {
            return index;
        }
        return null;
    });
    const isEmptyCampCards: boolean = emptyCampCards.length === 0;
    let isEmptyCurrentTierCampDeck: boolean = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach((cardIndex: number | null): void => {
            isEmptyCurrentTierCampDeck = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp(G, cardIndex);
            }
        });
        AddDataToLog(G, LogTypes.GAME, "Кэмп заполнен новыми картами.");
    }
};

/**
 * <h3>Автоматически заполняет кэмп картами новой эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при начале новой эпохи.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
export const RefillCamp = (G: MyGameState): void => {
    AddRemainingCampCardsToDiscard(G);
    for (let i: number = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
    AddDataToLog(G, LogTypes.GAME, "Кэмп заполнен новыми картами новой эпохи.");
}

/**
 * <h3>Перемещает все оставшиеся неиспользованные карты кэмпа в дискард.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце 1-й эпохи.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
const AddRemainingCampCardsToDiscard = (G: MyGameState): void => {
    for (let i: number = 0; i < G.camp.length; i++) {
        if (G.camp[i]) {
            const card: CampDeckCardTypes | null = G.camp.splice(i, 1, null)[0];
            if (card) {
                G.discardCampCardsDeck.push(card);
            }
        }
    }
    if (G.campDecks[G.campDecks.length - G.tierToEnd - 1].length) {
        G.discardCampCardsDeck = G.discardCampCardsDeck.concat(G.campDecks[G.campDecks.length - G.tierToEnd - 1]);
        G.campDecks[G.campDecks.length - G.tierToEnd - 1].length = 0;
    }
    AddDataToLog(G, LogTypes.GAME, "Оставшиеся карты кэмпа сброшены.");
};

/**
 * <h3>Заполняет кэмп новой картой из карт кэмп деки текущей эпохи.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при заполнении кэмпа недостающими картами.</li>
 * <li>Происходит при заполнении кэмпа картами новой эпохи.</li>
 * </ol>
 *
 * @param G
 * @param cardIndex Индекс карты.
 * @constructor
 */
const AddCardToCamp = (G: MyGameState, cardIndex: number): void => {
    const newCampCard: CampDeckCardTypes = G.campDecks[G.campDecks.length -
    G.tierToEnd].splice(0, 1)[0];
    G.camp.splice(cardIndex, 1, newCampCard);
};