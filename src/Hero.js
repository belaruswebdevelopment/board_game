import { heroesConfig } from "./data/HeroData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddDataToLog } from "./Logging";
import { AddActionsToStackAfterCurrent } from "./helpers/StackHelpers";
import { TotalRank } from "./helpers/ScoreHelpers";
/**
 * <h3>Создание героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @param {string} type Тип.
 * @param {string} name Название.
 * @param {string} description Описание.
 * @param {string} game Игра/дополнение.
 * @param {string} suit Фракция.
 * @param {number | null} rank Шевроны.
 * @param {number | null} points Очки.
 * @param {boolean | undefined} active Взят ли герой.
 * @param {IStack[]} stack Действия.
 * @returns {IHero} Герой.
 * @constructor
 */
export var CreateHero = function (_a) {
    var _b = _a === void 0 ? {} : _a, type = _b.type, name = _b.name, description = _b.description, game = _b.game, suit = _b.suit, rank = _b.rank, points = _b.points, _c = _b.active, active = _c === void 0 ? true : _c, stack = _b.stack;
    return ({
        type: type,
        name: name,
        description: description,
        game: game,
        suit: suit,
        rank: rank,
        points: points,
        active: active,
        stack: stack,
    });
};
/**
 * <h3>Создаёт всех героев при инициализации игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 *
 * @param {string[]} config Конфиг героев.
 * @returns {IHero[]} Массив всех героев.
 * @constructor
 */
export var BuildHeroes = function (config) {
    var heroes = [];
    for (var hero in heroesConfig) {
        if (config.includes(heroesConfig[hero].game)) {
            heroes.push(CreateHero({
                type: "герой",
                name: heroesConfig[hero].name,
                description: heroesConfig[hero].description,
                game: heroesConfig[hero].game,
                suit: heroesConfig[hero].suit,
                rank: heroesConfig[hero].rank,
                points: heroesConfig[hero].points,
                stack: heroesConfig[hero].stack,
            }));
        }
    }
    return heroes;
};
/**
 * <h3>Проверяет возможность взятия нового героя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при расположении на планшете игрока карта из таверны.</li>
 * <li>Происходит при завершении действия взятых героев.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Илуд.</li>
 * <li>Происходит при расположении на планшете игрока карта героя Труд.</li>
 * <li>Происходит при перемещении на планшете игрока карта героя Труд.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var CheckPickHero = function (G, ctx) {
    if (!G.publicPlayers[Number(ctx.currentPlayer)].buffs.noHero) {
        var isCanPickHero = Math.min.apply(Math, G.publicPlayers[Number(ctx.currentPlayer)].cards
            .map(function (item) { return item.reduce(TotalRank, 0); })) >
            G.publicPlayers[Number(ctx.currentPlayer)].heroes.length;
        if (isCanPickHero) {
            var stack = [
                {
                    actionName: "PickHero",
                    config: {
                        stageName: "pickHero",
                    },
                },
            ];
            AddDataToLog(G, "game" /* GAME */, "\u0418\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[Number(ctx.currentPlayer)].nickname, " \n            \u0434\u043E\u043B\u0436\u0435\u043D \u0432\u044B\u0431\u0440\u0430\u0442\u044C \u043D\u043E\u0432\u043E\u0433\u043E \u0433\u0435\u0440\u043E\u044F."));
            AddActionsToStackAfterCurrent(G, ctx, stack);
        }
    }
};
/**
 * <h3>Удаляет Труд в конце игры с поля игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце матча после всех игровых событий.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @constructor
 */
export var RemoveThrudFromPlayerBoardAfterGameEnd = function (G, ctx) {
    for (var i = 0; i < ctx.numPlayers; i++) {
        var playerCards = G.publicPlayers[i].cards.flat(), thrud = playerCards.find(function (card) { return card.name === "Thrud"; });
        if (thrud) {
            var thrudSuit = GetSuitIndexByName(thrud.suit), thrudIndex = G.publicPlayers[i].cards[thrudSuit]
                .findIndex(function (card) { return card.name === "Thrud"; });
            G.publicPlayers[i].cards[thrudSuit].splice(thrudIndex, 1);
            AddDataToLog(G, "game" /* GAME */, "\u0413\u0435\u0440\u043E\u0439 \u0422\u0440\u0443\u0434 \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(G.publicPlayers[i].nickname, " \u0443\u0445\u043E\u0434\u0438\u0442 \u0441 \n            \u0438\u0433\u0440\u043E\u0432\u043E\u0433\u043E \u043F\u043E\u043B\u044F."));
        }
    }
};
