import { SuitNames, suitsConfig } from "./data/SuitData";
import { heroesConfig } from "./data/HeroData";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddDataToLog, LogTypes } from "./Logging";
import { artefactsConfig } from "./data/CampData";
import { CheckCurrentSuitDistinction } from "./Distinction";
/**
 * <h3>Подсчитывает суммарное количество текущих очков выбранного игрока за карты в колонках фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Подсчёт и вывод на игровое поле текущее количество очков каждого игрока.</li>
 * <li>Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.</li>
 * <li>Подсчёт очков игроков для анализа ботами.</li>
 * </ol>
 *
 * @param {IPublicPlayer} player Игрок.
 * @returns {number} Текущий счёт указанного игрока.
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
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @param {IPublicPlayer} player Игрок.
 * @returns {number} Финальный счёт указанного игрока.
 * @constructor
 */
export var FinalScoring = function (G, ctx, player) {
    var _a, _b, _c, _d;
    AddDataToLog(G, LogTypes.GAME, "\u0420\u0435\u0437\u0443\u043B\u044C\u0442\u0430\u0442\u044B \u0438\u0433\u0440\u044B \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ":"));
    var score = CurrentScoring(player), coinsValue = 0;
    AddDataToLog(G, LogTypes.PUBLIC, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043A\u0430\u0440\u0442\u044B \u0434\u0432\u043E\u0440\u0444\u043E\u0432 \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(score));
    for (var i = 0; i < player.boardCoins.length; i++) {
        coinsValue += (_b = (_a = player.boardCoins[i]) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : 0;
    }
    if (player.buffs.everyTurn === "Uline") {
        for (var i = 0; i < player.handCoins.length; i++) {
            coinsValue += (_d = (_c = player.handCoins[i]) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 0;
        }
    }
    score += coinsValue;
    AddDataToLog(G, LogTypes.PUBLIC, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043C\u043E\u043D\u0435\u0442\u044B \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(coinsValue));
    var suitWarriorIndex = GetSuitIndexByName(SuitNames.WARRIOR);
    if (suitWarriorIndex !== -1) {
        var warriorsDistinction = CheckCurrentSuitDistinction(G, ctx, SuitNames.WARRIOR);
        if (warriorsDistinction !== undefined && G.publicPlayers
            .findIndex(function (p) { return p.nickname === player.nickname; }) === warriorsDistinction) {
            var warriorDistinctionScore = suitsConfig[SuitNames.WARRIOR].distinction.awarding(G, ctx, player);
            score += warriorDistinctionScore;
            AddDataToLog(G, LogTypes.PUBLIC, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u043E \u043F\u043E \u0432\u043E\u0438\u043D\u0430\u043C \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": \n            ").concat(warriorDistinctionScore));
        }
    }
    var suitMinerIndex = GetSuitIndexByName(SuitNames.MINER);
    if (suitMinerIndex !== -1) {
        var minerDistinctionPriorityScore = suitsConfig[SuitNames.MINER].distinction.awarding(G, ctx, player);
        score += minerDistinctionPriorityScore;
        if (minerDistinctionPriorityScore) {
            AddDataToLog(G, LogTypes.PUBLIC, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u043A\u0440\u0438\u0441\u0442\u0430\u043B\u043B \u043F\u0440\u0435\u0438\u043C\u0443\u0449\u0435\u0441\u0442\u0432\u0430 \u043F\u043E \u0433\u043E\u0440\u043D\u044F\u043A\u0430\u043C \u0438\u0433\u0440\u043E\u043A\u0430 \n            ".concat(player.nickname, ": ").concat(minerDistinctionPriorityScore));
        }
    }
    var heroesScore = 0, dwerg_brothers = 0;
    var dwerg_brothers_scoring = [0, 13, 40, 81, 108, 135];
    var _loop_1 = function (i) {
        var heroData = Object.values(heroesConfig).find(function (hero) { return hero.name === player.heroes[i].name; });
        if (heroData !== undefined) {
            if (player.heroes[i].name.startsWith("Dwerg")) {
                dwerg_brothers += heroData.scoringRule(player);
            }
            else {
                var currentHeroScore = heroData.scoringRule(player);
                heroesScore += currentHeroScore;
                AddDataToLog(G, LogTypes.PRIVATE, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0433\u0435\u0440\u043E\u044F ".concat(player.heroes[i].name, " \u0438\u0433\u0440\u043E\u043A\u0430 \n                ").concat(player.nickname, ": ").concat(currentHeroScore, "."));
            }
        }
        else {
            AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u0433\u0435\u0440\u043E\u044F ".concat(player.heroes[i].name, "."));
        }
    };
    for (var i = 0; i < player.heroes.length; i++) {
        _loop_1(i);
    }
    if (dwerg_brothers) {
        heroesScore += dwerg_brothers_scoring[dwerg_brothers];
        AddDataToLog(G, LogTypes.PRIVATE, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0433\u0435\u0440\u043E\u0435\u0432 \u0431\u0440\u0430\u0442\u044C\u0435\u0432 \u0414\u0432\u0435\u0440\u0433\u043E\u0432 (".concat(dwerg_brothers, " \u0448\u0442.) \u0438\u0433\u0440\u043E\u043A\u0430 \n        ").concat(player.nickname, ": ").concat(dwerg_brothers_scoring[dwerg_brothers], "."));
    }
    score += heroesScore;
    AddDataToLog(G, LogTypes.PUBLIC, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0433\u0435\u0440\u043E\u0435\u0432 \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(heroesScore, "."));
    if (G.expansions.thingvellir.active) {
        var artifactsScore = 0;
        var _loop_2 = function (i) {
            var artefact = Object.values(artefactsConfig)
                .find(function (artefact) { return artefact.name === player.campCards[i].name; });
            var currentArtefactScore = 0;
            if (artefact !== undefined) {
                if (G.suitIdForMjollnir !== null) {
                    currentArtefactScore = artefact.scoringRule(player, G.suitIdForMjollnir);
                }
                else {
                    currentArtefactScore = artefact.scoringRule(player);
                }
            }
            else {
                AddDataToLog(G, LogTypes.ERROR, "\u041E\u0428\u0418\u0411\u041A\u0410: \u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043D\u0430\u0439\u0442\u0438 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442 \n                ".concat(player.campCards[i].name, "."));
            }
            if (currentArtefactScore) {
                artifactsScore += currentArtefactScore;
                AddDataToLog(G, LogTypes.PRIVATE, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442 ".concat(player.campCards[i].name, " \u0438\u0433\u0440\u043E\u043A\u0430 \n                ").concat(player.nickname, ": ").concat(currentArtefactScore, "."));
            }
        };
        for (var i = 0; i < player.campCards.length; i++) {
            _loop_2(i);
        }
        score += artifactsScore;
        AddDataToLog(G, LogTypes.PUBLIC, "\u041E\u0447\u043A\u0438 \u0437\u0430 \u0430\u0440\u0442\u0435\u0444\u0430\u043A\u0442\u044B \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(artifactsScore, "."));
    }
    AddDataToLog(G, LogTypes.PUBLIC, "\u0418\u0442\u043E\u0433\u043E\u0432\u044B\u0439 \u0441\u0447\u0451\u0442 \u0438\u0433\u0440\u043E\u043A\u0430 ".concat(player.nickname, ": ").concat(score, "."));
    return score;
};
/**
 * <h3>Подсчитывает финальные очки для определения победителя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце игры для определения победителя для вывода данных на игровое поле.</li>
 * </ol>
 *
 * @param {MyGameState} G
 * @param {Ctx} ctx
 * @returns {MyGameState | void} Финальные данные о победителях, если закончилась игра.
 * @constructor
 */
export var ScoreWinner = function (G, ctx) {
    AddDataToLog(G, LogTypes.GAME, "Финальные результаты игры:");
    for (var i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring(G, ctx, G.publicPlayers[i]));
    }
    var maxScore = Math.max.apply(Math, G.totalScore), maxPlayers = G.totalScore.filter(function (score) { return score === maxScore; }).length;
    var winners = 0;
    for (var i = ctx.numPlayers - 1; i >= 0; i--) {
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog(G, LogTypes.GAME, "\u041E\u043F\u0440\u0435\u0434\u0435\u043B\u0438\u043B\u0441\u044F \u043F\u043E\u0431\u0435\u0434\u0438\u0442\u0435\u043B\u044C: \u0438\u0433\u0440\u043E\u043A ".concat(G.publicPlayers[i].nickname, "."));
            if (maxPlayers === winners) {
                break;
            }
        }
    }
    if (G.winner.length) {
        return G;
    }
};
