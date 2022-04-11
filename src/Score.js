import { IsCoin } from "./Coin";
import { artefactsConfig } from "./data/CampData";
import { heroesConfig } from "./data/HeroData";
import { suitsConfig } from "./data/SuitData";
import { CheckCurrentSuitDistinctions } from "./Distinction";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { OpenClosedCoinsOnPlayerBoard, ReturnCoinsToPlayerBoard } from "./helpers/CoinHelpers";
import { AddDataToLog } from "./Logging";
import { BuffNames, LogTypes, SuitNames } from "./typescript/enums";
/**
 * <h3>Подсчитывает суммарное количество текущих очков выбранного игрока за карты в колонках фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Подсчёт и вывод на игровое поле текущее количество очков каждого игрока.</li>
 * <li>Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.</li>
 * <li>Подсчёт очков игроков для анализа ботами.</li>
 * </ol>
 *
 * @param player Игрок.
 * @returns Текущий счёт указанного игрока.
 */
export const CurrentScoring = (player) => {
    let score = 0, suit;
    for (suit in suitsConfig) {
        if (Object.prototype.hasOwnProperty.call(suitsConfig, suit)) {
            score += suitsConfig[suit].scoringRule(player.cards[suit]);
        }
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
 * @param playerId Id игрока.
 * @param warriorDistinctions Массив игроков с преимуществом по фракции воины.
 * @returns Финальный счёт указанного игрока.
 */
export const FinalScoring = (G, ctx, playerId, warriorDistinctions) => {
    var _a, _b;
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует игрок с id '${playerId}'.`);
    }
    AddDataToLog(G, LogTypes.GAME, `Результаты игры игрока '${player.nickname}':`);
    let score = CurrentScoring(player), coinsValue = 0;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за карты дворфов игрока '${player.nickname}': ${score}`);
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет игрока с id '${playerId}' на столе отсутствует монета с id '${i}'.`);
        }
        if ((IsCoin(boardCoin) && boardCoin.isOpened) || boardCoin === null) {
            coinsValue += (_a = boardCoin === null || boardCoin === void 0 ? void 0 : boardCoin.value) !== null && _a !== void 0 ? _a : 0;
        }
        else {
            throw new Error(`В массиве монет игрока с id '${playerId}' на столе должна быть ранее открыта монета с id '${i}' в конце игры.`);
        }
    }
    score += coinsValue;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за монеты игрока '${player.nickname}': ${coinsValue}`);
    if (warriorDistinctions.length && warriorDistinctions.includes(playerId)) {
        const warriorDistinctionScore = suitsConfig[SuitNames.WARRIOR].distinction.awarding(G, ctx, playerId);
        score += warriorDistinctionScore;
        if (warriorDistinctionScore) {
            AddDataToLog(G, LogTypes.PUBLIC, `Очки за преимущество по воинам игрока '${player.nickname}': ${warriorDistinctionScore}`);
        }
    }
    const minerDistinctionPriorityScore = suitsConfig[SuitNames.MINER].distinction.awarding(G, ctx, playerId);
    score += minerDistinctionPriorityScore;
    if (minerDistinctionPriorityScore) {
        AddDataToLog(G, LogTypes.PUBLIC, `Очки за кристалл преимущества по горнякам игрока '${player.nickname}': ${minerDistinctionPriorityScore}`);
    }
    let heroesScore = 0, dwerg_brothers = 0;
    const dwerg_brothers_scoring = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        const hero = player.heroes[i];
        if (hero === undefined) {
            throw new Error(`Не существует карта героя с id '${i}'.`);
        }
        const heroData = Object.values(heroesConfig).find((heroObj) => heroObj.name === hero.name);
        if (heroData === undefined) {
            throw new Error(`Не удалось найти героя '${hero.name}'.`);
        }
        if (hero.name.startsWith(`Dwerg`)) {
            dwerg_brothers += heroData.scoringRule();
        }
        else {
            const currentHeroScore = heroData.scoringRule(G, playerId);
            heroesScore += currentHeroScore;
            AddDataToLog(G, LogTypes.PRIVATE, `Очки за героя '${hero.name}' игрока '${player.nickname}': ${currentHeroScore}.`);
        }
    }
    if (dwerg_brothers) {
        const dwerg_brother_value = dwerg_brothers_scoring[dwerg_brothers];
        if (dwerg_brother_value === undefined) {
            throw new Error(`Не существует количества очков за количество героев братьев Двергов - '${dwerg_brothers}'.`);
        }
        heroesScore += dwerg_brother_value;
        AddDataToLog(G, LogTypes.PRIVATE, `Очки за героев братьев Двергов (${dwerg_brothers} шт.) игрока '${player.nickname}': ${dwerg_brothers_scoring[dwerg_brothers]}.`);
    }
    score += heroesScore;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за героев игрока '${player.nickname}': ${heroesScore}.`);
    if ((_b = G.expansions.thingvellir) === null || _b === void 0 ? void 0 : _b.active) {
        let artifactsScore = 0;
        for (let i = 0; i < player.campCards.length; i++) {
            const campCard = player.campCards[i];
            if (campCard === undefined) {
                throw new Error(`В массиве карт лагеря игрока отсутствует карта с id '${i}'.`);
            }
            const artefact = Object.values(artefactsConfig).find((artefact) => artefact.name === campCard.name);
            let currentArtefactScore = 0;
            if (artefact === undefined) {
                throw new Error(`Не удалось найти артефакт '${campCard.name}'.`);
            }
            currentArtefactScore = artefact.scoringRule(G, player);
            if (currentArtefactScore) {
                artifactsScore += currentArtefactScore;
                AddDataToLog(G, LogTypes.PRIVATE, `Очки за артефакт '${campCard.name}' игрока '${player.nickname}': ${currentArtefactScore}.`);
            }
        }
        score += artifactsScore;
        AddDataToLog(G, LogTypes.PUBLIC, `Очки за артефакты игрока '${player.nickname}': ${artifactsScore}.`);
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Итоговый счёт игрока '${player.nickname}': ${score}.`);
    return score;
};
/**
 * <h3>Подсчитывает финальные очки для определения победителя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце игры для определения победителя для вывода данных на игровое поле.</li>
 * </ol>
 *
 * @param G
 * @param ctx
 * @returns Финальные данные о победителях, если закончилась игра.
 */
export const ScoreWinner = (G, ctx) => {
    Object.values(G.publicPlayers).forEach((player, index) => {
        if (CheckPlayerHasBuff(player, BuffNames.EveryTurn)) {
            ReturnCoinsToPlayerBoard(G, index);
        }
        OpenClosedCoinsOnPlayerBoard(G, index);
    });
    G.drawProfit = ``;
    AddDataToLog(G, LogTypes.GAME, `Финальные результаты игры:`);
    const warriorDistinctions = CheckCurrentSuitDistinctions(G, ctx, SuitNames.WARRIOR);
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring(G, ctx, i, warriorDistinctions));
    }
    const maxScore = Math.max(...G.totalScore), maxPlayers = G.totalScore.filter((score) => score === maxScore).length;
    let winners = 0;
    for (let i = ctx.numPlayers - 1; i >= 0; i--) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
        }
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog(G, LogTypes.GAME, `Определился победитель: игрок '${player.nickname}'.`);
            if (maxPlayers === winners) {
                break;
            }
        }
    }
    if (G.winner.length) {
        return G;
    }
};
//# sourceMappingURL=Score.js.map