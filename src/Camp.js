import {campConfig} from "./data/CampData";
import {DiscardCardFromTavern} from "./Card";

/**
 * Создание карты кэмпа.
 * Применения:
 * 1) Происходит при создании всех карт кэмпа при инициализации игры.
 *
 * @todo Добавить описание для параметров.
 * @param type Тип.
 * @param name Название.
 * @param description Описание.
 * @param game Игра/дополнене.
 * @param suit Фракция.
 * @param rank Шевроны.
 * @param points Очки.
 * @param active Взят ли герой.
 * @param action Действия.
 * @returns {{game, name, description, rank, suit, points}}
 * @constructor
 */
export const CreateCampCard = ({type, name, description, game, suit, rank, points} = {}) => {
    return {
        type,
        name,
        description,
        game,
        suit,
        rank,
        points,
    };
};

/**
 * Создаёт все карты кэмпа из конфига.
 * Применения:
 * 1) Происходит при инициализации игры.
 *
 * @param tier Эпоха.
 * @param config Файл конфига.
 * @returns {*[]} Массив карт кэмпа.
 * @constructor
 */
export const BuildCampCards = (tier, config) => {
    const campCards = [];
    for (const campCard in campConfig) {
        if (config.includes(campConfig[campCard].tier)) {
            campCards.push(CreateCampCard({
                type: campConfig[campCard].type,
                name: campConfig[campCard].name,
                description: campConfig[campCard].description,
                game: campConfig[campCard].game,
                suit: campConfig[campCard].suit,
                rank: campConfig[campCard].rank,
                points: campConfig[campCard].points,
            }));
        }
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
    let isEmptyCurrentTierCampDeck = G.campDecks[G.campDecks.length - G.tierToEnd].length !== 0;
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
    for (let i = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
}

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
