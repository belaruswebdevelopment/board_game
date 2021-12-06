import { suitsConfig } from "./data/SuitData";
import { heroesConfig } from "./data/HeroData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddDataToLog } from "./Logging";
import { artefactsConfig } from "./data/CampData";
import { CheckCurrentSuitDistinction } from "./Distinction";
/**
 * <h3>Подсчитывает суммарное количество текущих очков выбранного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Подсчёт и вывод на игровое поле текущее количество очков каждого игрока.</li>
 * <li>Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.</li>
 * <li>Подсчёт очков игроков для анализа ботами.</li>
 * </ol>
 *
 * @param player Игрок.
 * @constructor
 */
export var CurrentScoring = function (player) {
    var score = 0, index = 0;
    for (var suit in suitsConfig) {
        if (player.cards[index] !== undefined) {
            score += suitsConfig[suit].scoringRule(player.cards[index]);
        }
        index++;
    }
    return score;
};
/**
 * <h3>Подсчитывает финальное количество очков выбранного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @param player Игрок.
 * @constructor
 */
export var FinalScoring = function (G, ctx, player) {
    var _a, _b, _c, _d;
    AddDataToLog(G, "game" /* GAME */, "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0438\u0433\u0440\u044B \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ":"));
    var score = CurrentScoring(player), coinsValue = 0;
    AddDataToLog(G, "public" /* PUBLIC */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043A\u0430\u0440\u0442\u044B \u0434\u0432\u043E\u0440\u0444\u043E\u0432 \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(score));
    for (var i = 0; i < player.boardCoins.length; i++) {
        coinsValue += (_b = (_a = player.boardCoins[i]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
    }
    if (player.buffs.everyTurn === "Uline") {
        for (var i = 0; i < player.handCoins.length; i++) {
            coinsValue += (_d = (_c = player.handCoins[i]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 0;
        }
    }
    score += coinsValue;
    AddDataToLog(G, "public" /* PUBLIC */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043C\u043E\u043D\u0435\u0442\u044B \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(coinsValue));
    var suitWarriorIndex = GetSuitIndexByName("warrior");
    if (suitWarriorIndex !== -1) {
        var warriorsDistinction = CheckCurrentSuitDistinction(G, ctx, "warrior");
        if (warriorsDistinction !== undefined && G.publicPlayers.findIndex(function (p) { return p.nickname ===
            player.nickname; }) === warriorsDistinction) {
            var warriorDistinctionScore = suitsConfig["warrior"].distinction
                .awarding(G, ctx, player);
            score += warriorDistinctionScore;
            AddDataToLog(G, "public" /* PUBLIC */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E \u043F\u043E \u0432\u043E\u0438\u043D\u0430\u043C \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": \n            ").concat(warriorDistinctionScore));
        }
    }
    var suitMinerIndex = GetSuitIndexByName("miner");
    if (suitMinerIndex !== -1) {
        var minerDistinctionPriorityScore = suitsConfig["miner"].distinction
            .awarding(G, ctx, player);
        score += minerDistinctionPriorityScore;
        if (minerDistinctionPriorityScore) {
            AddDataToLog(G, "public" /* PUBLIC */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043F\u043E \u0433\u043E\u0440\u043D\u044F\u043A\u0430\u043C \u0438\u0433\u0440\u043E\u043A\u0430 \n            ".concat(player.nickname, ": ").concat(minerDistinctionPriorityScore));
        }
    }
    var heroesScore = 0, dwerg_brothers = 0;
    var dwerg_brothers_scoring = [0, 13, 40, 81, 108, 135];
    var _loop_1 = function (i) {
        var heroData = Object.values(heroesConfig)
            .find(function (hero) { return hero.name === player.heroes[i].name; });
        if (heroData) {
            if (player.heroes[i].name.startsWith("Dwerg")) {
                dwerg_brothers += heroData.scoringRule(player);
            }
            else {
                var currentHeroScore = heroData.scoringRule(player);
                AddDataToLog(G, "private" /* PRIVATE */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0433\u0435\u0440\u043E\u044F ".concat(player.heroes[i].name, " \u0438\u0433\u0440\u043E\u043A\u0430 \n                ").concat(player.nickname, ": ").concat(currentHeroScore, "."));
                heroesScore += currentHeroScore;
            }
        }
    };
    for (var i = 0; i < player.heroes.length; i++) {
        _loop_1(i);
    }
    AddDataToLog(G, "private" /* PRIVATE */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0433\u0435\u0440\u043E\u0435\u0432 \u0431\u0440\u0430\u0442\u044C\u0435\u0432 \u0414\u0432\u0435\u0440\u0433\u043E\u0432 (".concat(dwerg_brothers, " \u0448\u0442.) \u0438\u0433\u0440\u043E\u043A\u0430 \n    ").concat(player.nickname, ": ").concat(dwerg_brothers_scoring[dwerg_brothers], "."));
    heroesScore += dwerg_brothers_scoring[dwerg_brothers];
    AddDataToLog(G, "public" /* PUBLIC */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0433\u0435\u0440\u043E\u0435\u0432 \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(heroesScore, "."));
    score += heroesScore;
    if (G.expansions.thingvellir.active) {
        var artifactsScore = 0;
        var _loop_2 = function (i) {
            var artefact = Object.values(artefactsConfig).find(function (artefact) {
                return artefact.name === player.campCards[i].name;
            });
            var currentArtefactScore = 0;
            if (artefact) {
                if (typeof G.suitIdForMjollnir === "number") {
                    currentArtefactScore = artefact.scoringRule(player, G.suitIdForMjollnir);
                }
                else {
                    currentArtefactScore = artefact.scoringRule(player);
                }
            }
            if (currentArtefactScore) {
                AddDataToLog(G, "private" /* PRIVATE */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442 ".concat(player.campCards[i].name, " \u0438\u0433\u0440\u043E\u043A\u0430 \n                    ").concat(player.nickname, ": ").concat(currentArtefactScore, "."));
                artifactsScore += currentArtefactScore;
            }
        };
        for (var i = 0; i < player.campCards.length; i++) {
            _loop_2(i);
        }
        AddDataToLog(G, "public" /* PUBLIC */, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442\u044B \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(artifactsScore, "."));
        score += artifactsScore;
    }
    AddDataToLog(G, "public" /* PUBLIC */, "\u0418\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0441\u0447\u0451\u0442 \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(score, "."));
    return score;
};
/**
 * <h3>Подсчитывает финальный подсчёт очков для определения победителя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце игры для определения победителя для вывода данных на игровое поле.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @constructor
 */
export var ScoreWinner = function (G, ctx) {
    AddDataToLog(G, "game" /* GAME */, "Финальные результаты игры:");
    for (var i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring(G, ctx, G.publicPlayers[i]));
    }
    var maxScore = Math.max.apply(Math, G.totalScore), maxPlayers = G.totalScore.filter(function (score) { return score === maxScore; }).length;
    var winners = 0;
    for (var i = ctx.numPlayers - 1; i >= 0; i--) {
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog(G, "game" /* GAME */, "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u043B\u0441\u044F \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C: \u0438\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[i].nickname, "."));
            if (maxPlayers === winners) {
                break;
            }
        }
    }
    if (G.winner.length) {
        return G;
    }
};
