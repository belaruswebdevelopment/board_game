import { DiscardCardFromTavern } from "./Card";
import { AddDataToLog } from "./Logging";
import { suitsConfig } from "./data/SuitData";
export var isArtefactCard = function (card) { return card.suit !== undefined; };
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
export var CreateArtefactCampCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "артефакт" : _c, tier = _b.tier, path = _b.path, name = _b.name, description = _b.description, game = _b.game, suit = _b.suit, rank = _b.rank, points = _b.points, stack = _b.stack;
    return ({
        type: type,
        tier: tier,
        path: path,
        name: name,
        description: description,
        game: game,
        suit: suit,
        rank: rank,
        points: points,
        stack: stack,
    });
};
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
export var CreateMercenaryCampCard = function (_a) {
    var _b = _a === void 0 ? {} : _a, _c = _b.type, type = _c === void 0 ? "наёмник" : _c, tier = _b.tier, path = _b.path, name = _b.name, _d = _b.game, game = _d === void 0 ? "thingvellir" : _d, stack = _b.stack;
    return ({
        type: type,
        tier: tier,
        path: path,
        name: name,
        game: game,
        stack: stack,
    });
};
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
export var BuildCampCards = function (tier, artefactConfig, mercenariesConfig) {
    var campCards = [];
    for (var campArtefactCard in artefactConfig) {
        if (artefactConfig.hasOwnProperty(campArtefactCard)) {
            if (artefactConfig[campArtefactCard].tier === tier) {
                campCards.push(CreateArtefactCampCard({
                    tier: tier,
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
    for (var i = 0; i < mercenariesConfig[tier].length; i++) {
        var name_1 = "", path = "";
        for (var campMercenarySuit in mercenariesConfig[tier][i]) {
            if (mercenariesConfig[tier][i].hasOwnProperty(campMercenarySuit)) {
                path += campMercenarySuit + " ";
                name_1 += "(\u0444\u0440\u0430\u043A\u0446\u0438\u044F: ".concat(suitsConfig[campMercenarySuit].suitName, ", ");
                for (var campMercenaryCardProperty in mercenariesConfig[tier][i][campMercenarySuit]) {
                    if (mercenariesConfig[tier][i][campMercenarySuit].hasOwnProperty(campMercenaryCardProperty)) {
                        if (campMercenaryCardProperty === "rank") {
                            name_1 += "\u0448\u0435\u0432\u0440\u043E\u043D\u043E\u0432: ".concat(mercenariesConfig[tier][i][campMercenarySuit].rank, ", ");
                        }
                        if (campMercenaryCardProperty === "points") {
                            path += mercenariesConfig[tier][i][campMercenarySuit].points ?
                                mercenariesConfig[tier][i][campMercenarySuit].points + " " : "";
                            name_1 += "\u043E\u0447\u043A\u043E\u0432: ".concat(mercenariesConfig[tier][i][campMercenarySuit].points ?
                                mercenariesConfig[tier][i][campMercenarySuit].points + ") " : "нет) ");
                        }
                    }
                }
            }
        }
        campCards.push(CreateMercenaryCampCard({
            tier: tier,
            path: path.trim(),
            name: name_1.trim(),
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
 * <h3>Автоматически убирает оставшуюся карту таверны в стопку сброса при выборе карты из кэмпа.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Проверяется после каждого выбора карты из таверны, если последний игрок в текущей таверне уже выбрал карту.</li>
 * </ol>
 *
 * @param G
 * @constructor
 */
export var DiscardCardIfCampCardPicked = function (G) {
    var discardCardIndex = G.taverns[G.currentTavern]
        .findIndex(function (card) { return card !== null; });
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
export var RefillEmptyCampCards = function (G) {
    var emptyCampCards = G.camp.map(function (card, index) {
        if (card === null) {
            return index;
        }
        return null;
    });
    var isEmptyCampCards = emptyCampCards.length === 0;
    var isEmptyCurrentTierCampDeck = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
    if (!isEmptyCampCards && !isEmptyCurrentTierCampDeck) {
        emptyCampCards.forEach(function (cardIndex) {
            isEmptyCurrentTierCampDeck = G.campDecks[G.campDecks.length - G.tierToEnd].length === 0;
            if (cardIndex !== null && !isEmptyCurrentTierCampDeck) {
                AddCardToCamp(G, cardIndex);
            }
        });
        AddDataToLog(G, "game" /* GAME */, "Кэмп заполнен новыми картами.");
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
export var RefillCamp = function (G) {
    AddRemainingCampCardsToDiscard(G);
    for (var i = 0; i < G.campNum; i++) {
        AddCardToCamp(G, i);
    }
    AddDataToLog(G, "game" /* GAME */, "Кэмп заполнен новыми картами новой эпохи.");
};
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
var AddRemainingCampCardsToDiscard = function (G) {
    for (var i = 0; i < G.camp.length; i++) {
        if (G.camp[i]) {
            var card = G.camp.splice(i, 1, null)[0];
            if (card) {
                G.discardCampCardsDeck.push(card);
            }
        }
    }
    if (G.campDecks[G.campDecks.length - G.tierToEnd - 1].length) {
        G.discardCampCardsDeck = G.discardCampCardsDeck.concat(G.campDecks[G.campDecks.length - G.tierToEnd - 1]);
        G.campDecks[G.campDecks.length - G.tierToEnd - 1].length = 0;
    }
    AddDataToLog(G, "game" /* GAME */, "Оставшиеся карты кэмпа сброшены.");
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
var AddCardToCamp = function (G, cardIndex) {
    var newCampCard = G.campDecks[G.campDecks.length -
        G.tierToEnd].splice(0, 1)[0];
    G.camp.splice(cardIndex, 1, newCampCard);
};
