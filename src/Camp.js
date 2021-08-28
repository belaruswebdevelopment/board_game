import {DiscardCardFromTavern} from "./Card";
import {AddDataToLog} from "./Logging";
import {suitsConfig} from "./data/SuitData";

/**
 * Создание карты артефакта для кэмпа.
 * Применения:
 * 1) Происходит при создании всех карт артефактов кэмпа во время инициализации игры.
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
 * @returns {{game, name, description, rank, stack, suit, type, points}} Карта артефакта для кэмпа.
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
                                       } = {}) => {
    return {
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
    };
};

/**
 * Создание карты наёмника для кэмпа.
 * Применения:
 * 1) Происходит при создании всех карт наёмников кэмпа во время инициализации игры.
 *
 * @param type Тип.
 * @param tier Эпоха.
 * @param path URL путь.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param stack Действия.
 * @returns {{game: string, tier: (number|*), name, stack, type: string}} Карта наёмника для кэмпа.
 * @constructor
 */
export const CreateMercenaryCampCard = ({
                                            type = "наёмник",
                                            tier,
                                            path,
                                            name,
                                            game = "thingvellir",
                                            stack
                                        } = {}) => {
    return {
        type,
        tier,
        path,
        name,
        game,
        stack,
    };
};

/**
 * Создаёт все карты кэмпа из конфига.
 * Применения:
 * 1) Происходит при инициализации игры.
 *
 * @param tier Эпоха.
 * @param artefactConfig Файл конфига карт артефактов.
 * @param mercenariesConfig Файл конфига наёмников.
 * @returns {*[]} Массив карт кэмпа.
 * @constructor
 */
export const BuildCampCards = (tier, artefactConfig, mercenariesConfig) => {
    const campCards = [];
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
                }));
            }
        }
    }
    for (let i = 0; i < mercenariesConfig[tier].length; i++) {
        let name = "",
            path = "";
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
        }));
    }
    return campCards;
};

/**
 * Автоматически убирает оставшуюся карту таверны в стопку сброса при выборе карты из кэмпа.
 * Применения:
 * 1) Проверяется после каждого выбора карты из таверны, если последний игрок в текущей таверне уже выбрал карту.
 *
 * @param G
 * @constructor
 */
export const DiscardCardIfCampCardPicked = (G) => {
    const discardCardIndex = G.taverns[G.currentTavern].findIndex(card => card !== null);
    if (G.campPicked && discardCardIndex !== -1) {
        DiscardCardFromTavern(G, discardCardIndex);
        G.campPicked = false;
    }
};

/**
 * Автоматически заполняет кэмп недостающими картами текущей эпохи.
 * Применения:
 * 1) Происходит при начале раунда.
 *
 * @param G
 * @constructor
 */
export const RefillEmptyCampCards = (G) => {
    const emptyCampCards = G.camp.map((card, index) => {
        if (card === null) {
            return index;
        }
        return null;
    });
    const isEmptyCampCards = emptyCampCards.length === 0;
    let isEmptyCurrentTierCampDeck = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach(cardIndex => {
            isEmptyCurrentTierCampDeck = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp(G, cardIndex);
            }
        });
        AddDataToLog(G, "game", "Кэмп заполнен новыми картами.");
    }
};

/**
 * Автоматически заполняет кэмп картами новой эпохи.
 * Применения:
 * 1) Происходит при начале новой эпохи.
 *
 * @param G
 * @constructor
 */
export const RefillCamp = (G) => {
    AddRemainingCampCardsToDiscard(G);
    for (let i = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
    AddDataToLog(G, "game", "Кэмп заполнен новыми картами новой эпохи.");
}

/**
 * Перемещает все оставшиеся неиспользованные карты кэмпа в дискард.
 * Применения:
 * 1) Происходит в конце 1-й эпохи.
 *
 * @param G
 * @constructor
 */
const AddRemainingCampCardsToDiscard = (G) => {
    for (let i = 0; i < G.camp.length; i++) {
        if (G.camp[i]) {
            G.discardCampCardsDeck.push(G.camp.splice(i, 1, null)[0])
        }
    }
    if (G.campDecks[G.campDecks.length - G.tierToEnd - 1].length) {
        G.discardCampCardsDeck = G.discardCampCardsDeck.concat(G.campDecks[G.campDecks.length - G.tierToEnd - 1]);
        G.campDecks[G.campDecks.length - G.tierToEnd - 1].length = 0;
    }
    AddDataToLog(G, "game", "Оставшиеся карты кэмпа сброшены.");
};

/**
 * Заполняет кэмп новой картой из карт кэмп деки текущей эпохи.
 * Применения:
 * 1) Происходит при заполнении кэмпа недостающими картами.
 * 2) Происходит при заполнении кэмпа картами новой эпохи.
 *
 * @param G
 * @param cardIndex Индекс карты.
 * @constructor
 */
const AddCardToCamp = (G, cardIndex) => {
    const newCampCard = G.campDecks[G.campDecks.length - G.tierToEnd].splice(0, 1)[0];
    G.camp.splice(cardIndex, 1, newCampCard);
};
