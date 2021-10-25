import {suitsConfig} from "./data/SuitData";
import {heroesConfig} from "./data/HeroData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog} from "./Logging";
import {artefactsConfig} from "./data/CampData";
import {CheckCurrentSuitDistinction} from "./Distiction";

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
 * @returns {number} Суммарное количество текущих очков игрока.
 * @constructor
 */
export const CurrentScoring = (player) => {
    let score = 0,
        i = 0;
    for (const suit in suitsConfig) {
        if (player.cards[i] !== undefined) {
            score += suitsConfig[suit].scoringRule(player.cards[i]);
        }
        i++;
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
 * @returns {*} Финальное количество очков игрока.
 * @constructor
 */
export const FinalScoring = (G, ctx, player) => {
    AddDataToLog(G, "game", `Результаты игры игрока ${player.nickname}:`);
    let score = CurrentScoring(player),
        coinsValue = 0;
    AddDataToLog(G, "public", `Очки за карты дворфов игрока ${player.nickname}: ${score}`);
    for (let i = 0; i < player.boardCoins.length; i++) {
        coinsValue += (player.boardCoins[i] && player.boardCoins[i].value) ? player.boardCoins[i].value : 0;
    }
    if (player.buffs["everyTurn"] === "Uline") {
        for (let i = 0; i < player.handCoins.length; i++) {
            coinsValue += (player.handCoins[i] && player.handCoins[i].value) ? player.handCoins[i].value : 0;
        }
    }
    score += coinsValue;
    AddDataToLog(G, "public", `Очки за монеты игрока ${player.nickname}: ${coinsValue}`);
    const suitWarriorIndex = GetSuitIndexByName("warrior");
    if (suitWarriorIndex !== -1) {
        const warriorsDistinction = CheckCurrentSuitDistinction(G, ctx, "warrior");
        if (warriorsDistinction !== undefined && G.publicPlayers.findIndex(p => p.nickname === player.nickname) ===
            warriorsDistinction) {
            const warriorDistinctionScore = suitsConfig["warrior"].distinction.awarding(G, ctx, player) ?
                suitsConfig["warrior"].distinction.awarding(G, ctx, player) : 0;
            score += warriorDistinctionScore;
            AddDataToLog(G, "public", `Очки за преимущество по воинам игрока ${player.nickname}: 
            ${warriorDistinctionScore}`);
        }
    }
    const suitMinerIndex = GetSuitIndexByName("miner");
    if (suitMinerIndex !== -1) {
        const minerDistinctionPriorityScore = suitsConfig["miner"].distinction.awarding(G, ctx, player) ?
            suitsConfig["miner"].distinction.awarding(G, ctx, player) : 0;
        score += minerDistinctionPriorityScore;
        if (minerDistinctionPriorityScore) {
            AddDataToLog(G, "public", `Очки за кристалл преимущества по горнякам игрока ${player.nickname}: 
            ${minerDistinctionPriorityScore}`);
        }
    }
    let heroesScore = 0,
        dwerg_brothers = 0;
    const dwerg_brothers_scoring = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        if (player.heroes[i].name.startsWith("Dwerg")) {
            dwerg_brothers += Object.values(heroesConfig).find(hero => hero.name === player.heroes[i].name)
                .scoringRule(player);
        } else {
            const currentHeroScore = Object.values(heroesConfig).find(hero => hero.name ===
                player.heroes[i].name)
                .scoringRule(player);
            AddDataToLog(G, "private", `Очки за героя ${player.heroes[i].name} игрока ${player.nickname}: 
            ${currentHeroScore}.`);
            heroesScore += currentHeroScore;
        }
    }
    AddDataToLog(G, "private", `Очки за героев братьев Двергов (${dwerg_brothers} шт.) игрока ${player.nickname}: 
    ${dwerg_brothers_scoring[dwerg_brothers]}.`);
    heroesScore += dwerg_brothers_scoring[dwerg_brothers];
    AddDataToLog(G, "public", `Очки за героев игрока ${player.nickname}: ${heroesScore}.`);
    score += heroesScore;
    if (G.expansions.thingvellir.active) {
        let artifactsScore = 0;
        for (let i = 0; i < player.campCards.length; i++) {
            const artefact = Object.values(artefactsConfig).find(artefact => artefact.name ===
                    player.campCards[i].name),
                currentArtefactScore = (artefact && artefact.scoringRule(player, G.suitIdForMjollnir)) ?
                    artefact.scoringRule(player, G.suitIdForMjollnir) : 0;
            AddDataToLog(G, "private", `Очки за артефакт ${player.campCards[i].name} игрока ${player.nickname}: 
            ${currentArtefactScore}.`);
            artifactsScore += currentArtefactScore;
        }
        AddDataToLog(G, "public", `Очки за артефакты игрока ${player.nickname}: ${artifactsScore}.`);
        score += artifactsScore;
    }
    AddDataToLog(G, "public", `Итоговый счёт игрока ${player.nickname}: ${score}.`);
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
 * @returns {*} Глобальные данные с информацией о возможном победителе.
 * @constructor
 */
export const ScoreWinner = (G, ctx) => {
    AddDataToLog(G, "game", "Финальные результаты игры:");
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring(G, ctx, G.publicPlayers[i]));
    }
    const maxScore = Math.max(...G.totalScore),
        maxPlayers = G.totalScore.filter(score => score === maxScore).length;
    let winners = 0;
    G.winner = [];
    for (let i = ctx.numPlayers - 1; i >= 0; i--) {
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog(G, "game", `Определился победитель: игрок ${G.publicPlayers[i].nickname}.`);
            if (maxPlayers === winners) {
                break;
            }
        }
    }
    if (G.winner.length) {
        return G;
    }
}
