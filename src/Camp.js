import {DiscardCardFromTavern} from "./Card";

/**
 * Создание карты артефакта для кэмпа.
 * Применения:
 * 1) Происходит при создании всех карт артефактов кэмпа при инициализации игры.
 *
 * @param type Тип.
 * @param tier Эпоха.
 * @param name Название.
 * @param description Описание.
 * @param game Игра/дополнение.
 * @param suit Фракция.
 * @param rank Шевроны.
 * @param points Очки.
 * @param action Действия.
 * @returns {{game, name, description, rank, action, suit, type, points}} Карта артефакта для кэмпа.
 * @constructor
 */
export const CreateArtefactCampCard = ({
                                           type = "артефакт",
                                           tier,
                                           name,
                                           description,
                                           game,
                                           suit,
                                           rank,
                                           points,
                                           action
                                       } = {}) => {
    return {
        type,
        tier,
        name,
        description,
        game,
        suit,
        rank,
        points,
        action,
    };
};

/**
 * Создание карты наёмника для кэмпа.
 * Применения:
 * 1) Происходит при создании всех карт наёмников кэмпа при инициализации игры.
 *
 * @param type Тип.
 * @param tier Эпоха.
 * @param name Название.
 * @param game Игра/дополнение.
 * @param variants Варианты карт.
 * @param action Действия.
 * @returns {{game: string, tier: (number|*), name, variants, type: string}} Карта наёмника для кэмпа.
 * @constructor
 */
export const CreateMercenaryCampCard = ({
                                            type = "наёмник",
                                            tier,
                                            name,
                                            game = "thingvellir",
                                            variants,
                                            action
                                        } = {}) => {
    return {
        type,
        tier,
        name,
        game,
        variants,
        action,
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
                    name: artefactConfig[campArtefactCard].name,
                    description: artefactConfig[campArtefactCard].description,
                    game: artefactConfig[campArtefactCard].game,
                    suit: artefactConfig[campArtefactCard].suit,
                    rank: artefactConfig[campArtefactCard].rank,
                    points: artefactConfig[campArtefactCard].points,
                    action: artefactConfig[campArtefactCard].action,
                }));
            }
        }
    }
    for (let i = 0; i < mercenariesConfig[tier].length; i++) {
        let name = "";
        for (const campMercenarySuit in mercenariesConfig[tier][i]) {
            if (mercenariesConfig[tier][i].hasOwnProperty(campMercenarySuit)) {
                name += campMercenarySuit + " ";
                for (const campMercenaryCardProperty in mercenariesConfig[tier][i][campMercenarySuit]) {
                    if (mercenariesConfig[tier][i][campMercenarySuit].hasOwnProperty(campMercenaryCardProperty)) {
                        if (campMercenaryCardProperty === "points") {
                            name += mercenariesConfig[tier][i][campMercenarySuit].points ?
                                mercenariesConfig[tier][i][campMercenarySuit].points + " " : "";
                        }
                    }
                }
            }
        }
        campCards.push(CreateMercenaryCampCard({
            tier,
            name: name.trim(),
            variants: mercenariesConfig[tier][i],
            action: {
                actionName: "AddCampCardToCards",
                config: {
                    card: name.trim(),
                },
            },
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
    if (G.campPicked === true) {
        G.campPicked = false;
        const cardIndex = G.taverns[G.currentTavern].findIndex(card => card !== null);
        DiscardCardFromTavern(G, cardIndex);
    }
};

/**
 * Автоматически заполняет кэмп недостающими картами текущей эпохи.
 * Применения:
 * 1) Происходит когда начинается раунд.
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
    }
};

/**
 * Автоматически заполняет кэмп картами новой эпохи.
 * Применения:
 * 1) Происходит когда начинается новая эпоха.
 *
 * @param G
 * @constructor
 */
export const RefillCamp = (G) => {
    AddRemainingCampCardsToDiscard(G);
    for (let i = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
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
};

/**
 * Заполняет кэмп новой картой из кэмп деки текущей эпохи.
 * Применения:
 * 1) Происходит когда заполняется кэмп недостающими картами.
 * 2) Происходит когда заполняется кэмп картами новой эпохи.
 *
 * @param G
 * @param cardIndex Индекс карты.
 * @constructor
 */
const AddCardToCamp = (G, cardIndex) => {
    const newCampCard = G.campDecks[G.campDecks.length - G.tierToEnd].splice(0, 1)[0];
    G.camp.splice(cardIndex, 1, newCampCard);
};
