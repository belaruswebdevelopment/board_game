import {suitsConfig} from "./data/SuitData";
import {heroesConfig} from "./data/HeroData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";

/**
 * Высчитывает суммарное количество очков фракции.
 * Применения:
 * 1) Применяется при подсчёте очков фракций, не зависящих от количества шевронов.
 *
 * @param accumulator Аккумулятивное значение очков.
 * @param currentValue Текущее значение очков.
 * @returns {*} Суммарное количество очков фракции.
 * @constructor
 */
export const TotalPoints = (accumulator, currentValue) => accumulator + currentValue.points;

/**
 * Высчитывает суммарное количество шевронов фракции.
 * Применения:
 * 1) Применяется при подсчёте шевронов фракций, не зависящих от количества очков.
 *
 * @param accumulator Аккумулятивное значение шевронов.
 * @param currentValue Текущее значение шевронов.
 * @returns {*} Суммарное количество шевронов фракции.
 * @constructor
 */
export const TotalRank = (accumulator, currentValue) => accumulator + currentValue.rank;

/**
 * Подсчитывает количество очков фракции в арифметической прогрессии, зависящих от числа шевронов.
 * Применения:
 * 1) Применяется для подсчёта очков фракции, зависящих от арифметической прогрессии очков по количеству шевронов (фракция кузнецов).
 *
 * @param startValue Стартовое значение очков.
 * @param step Шаг.
 * @param ranksCount Суммарное количество шевронов.
 * @returns {number} Сумарное количество очков фракции.
 * @constructor
 */
export const ArithmeticSum = (startValue, step, ranksCount) => (2 * startValue + step * (ranksCount - 1)) * ranksCount / 2;

/**
 * Подсчёт преимуществ по количеству шевронов фракций в конце эпохи.
 * Применения:
 * 1) Отрбатывает в начале фазы получения преимуществ за количество шевронов каждой фракции.
 *
 * @param G
 * @param ctx
 * @constructor
 */
export const CheckDistinction = (G, ctx) => {
    let i = 0;
    for (const suit in suitsConfig) {
        const result = CheckCurrentSuitDistinction(G, ctx, suit);
        G.distinctions[i] = result;
        if (result === undefined) {
            if (suit === "explorer") {
                G.decks[1].splice(0, 1);
            }
        }
        i++;
    }
};

/**
 * Высчитывает наличие игрока с преимуществом по шевронам конкретной фракции.
 * 1) Применяется в подсчёте преимуществ по количеству шевронов фракций в конце эпохи.
 * 2) Применяется при подсчёте преимуществ по количеству шевронов фракции в конце игры (фракция воинов).
 *
 * @param G
 * @param ctx
 * @param suitName Фракция.
 * @returns {undefined|number} Индекс игрока с преимуществом по шевронам конкретной фракции, если имеется.
 * @constructor
 */
const CheckCurrentSuitDistinction = (G, ctx, suitName) => {
    const playersRanks = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        const suitIndex = GetSuitIndexByName(suitName);
        playersRanks.push(G.players[i].cards[suitIndex].reduce(TotalRank, 0));
    }
    const max = Math.max(...playersRanks),
        maxPlayers = playersRanks.filter(count => count === max);
    if (maxPlayers.length === 1) {
        return playersRanks.indexOf(maxPlayers[0]);
    } else {
        return undefined;
    }
};

/**
 * Подсчитывает суммарное количество текущих очков выбранного игрока.
 * Применения:
 * 1) Посчёт и вывод на игровое поле текущее количество очков каждого игрока.
 * 2) Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.
 * 3) Подсчёт очков игроков для анализ ботами.
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
 * Подситывает финальное количество очков выбранного игрока.
 * Применения:
 * 1) Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.
 *
 * @param G
 * @param ctx
 * @param player Игрок.
 * @param currentScore Текущее количество очков без учёта финального подсчёта.
 * @returns {*} Финальное количество очков игрока.
 * @constructor
 */
export const FinalScoring = (G, ctx, player, currentScore) => {
    let score = currentScore;
    for (let i = 0; i < player.boardCoins.length; i++) {
        score += player.boardCoins[i]?.value ?? 0;
    }
    const suitWarriorIndex = GetSuitIndexByName("warrior");
    if (suitWarriorIndex !== -1) {
        const warriorsDistinction = CheckCurrentSuitDistinction(G, ctx, "warrior");
        if (warriorsDistinction !== undefined && G.players.findIndex(p => p.nickname === player.nickname) === warriorsDistinction) {
            score += suitsConfig["warrior"].distinction.awarding(G, ctx, player);
        }
    }
    const suitMinerIndex = GetSuitIndexByName("miner");
    if (suitMinerIndex !== -1) {
        score += suitsConfig["miner"].distinction.awarding(G, ctx, player) ?? 0;
    }
    let dwerg_brothers = 0;
    const dwerg_brothers_scoring = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        if (player.heroes[i].name.startsWith("Dwerg")) {
            dwerg_brothers += Object.values(heroesConfig).find(hero => hero.name === player.heroes[i].name).scoringRule(player);
        } else {
            score += Object.values(heroesConfig).find(hero => hero.name === player.heroes[i].name).scoringRule(player);
        }
    }
    score += dwerg_brothers_scoring[dwerg_brothers];
    return score;
};

export const ScoreWinner = (ctx, G) => {
    const totalScore = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        totalScore.push(CurrentScoring(G.players[i]));
    }
    for (let i = ctx.numPlayers - 1; i >= 0; i--) {
        if (Math.max(...totalScore) === totalScore[i]) {
            G.winner = i;
            return G;
        }
    }
}
