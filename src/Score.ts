import {suitsConfig} from "./data/SuitData";
import {heroesConfig, IHeroData} from "./data/HeroData";
import {GetSuitIndexByName} from "./helpers/SuitHelpers";
import {AddDataToLog, LogTypes} from "./Logging";
import {artefactsConfig, IArtefact} from "./data/CampData";
import {CheckCurrentSuitDistinction} from "./Distinction";
import {MyGameState} from "./GameSetup";
import {Ctx} from "boardgame.io";
import {IPublicPlayer} from "./Player";

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
export const CurrentScoring = (player: IPublicPlayer): number => {
    let score: number = 0,
        index: number = 0;
    for (const suit in suitsConfig) {
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
export const FinalScoring = (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    AddDataToLog(G, LogTypes.GAME, `Результаты игры игрока ${player.nickname}:`);
    let score: number = CurrentScoring(player),
        coinsValue: number = 0;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за карты дворфов игрока ${player.nickname}: ${score}`);
    for (let i: number = 0; i < player.boardCoins.length; i++) {
        coinsValue += player.boardCoins[i]?.value ?? 0;
    }
    if (player.buffs.everyTurn === "Uline") {
        for (let i: number = 0; i < player.handCoins.length; i++) {
            coinsValue += player.handCoins[i]?.value ?? 0;
        }
    }
    score += coinsValue;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за монеты игрока ${player.nickname}: ${coinsValue}`);
    const suitWarriorIndex: number = GetSuitIndexByName("warrior");
    if (suitWarriorIndex !== -1) {
        const warriorsDistinction: number | undefined = CheckCurrentSuitDistinction(G, ctx, "warrior");
        if (warriorsDistinction !== undefined && G.publicPlayers.findIndex(p => p.nickname ===
            player.nickname) === warriorsDistinction) {
            const warriorDistinctionScore: number = suitsConfig["warrior"].distinction
                .awarding(G, ctx, player);
            score += warriorDistinctionScore;
            AddDataToLog(G, LogTypes.PUBLIC, `Очки за преимущество по воинам игрока ${player.nickname}: 
            ${warriorDistinctionScore}`);
        }
    }
    const suitMinerIndex: number = GetSuitIndexByName("miner");
    if (suitMinerIndex !== -1) {
        const minerDistinctionPriorityScore: number = suitsConfig["miner"].distinction
            .awarding(G, ctx, player);
        score += minerDistinctionPriorityScore;
        if (minerDistinctionPriorityScore) {
            AddDataToLog(G, LogTypes.PUBLIC, `Очки за кристалл преимущества по горнякам игрока 
            ${player.nickname}: ${minerDistinctionPriorityScore}`);
        }
    }
    let heroesScore: number = 0,
        dwerg_brothers: number = 0;
    const dwerg_brothers_scoring: number[] = [0, 13, 40, 81, 108, 135];
    for (let i: number = 0; i < player.heroes.length; i++) {
        const heroData: IHeroData | undefined = Object.values(heroesConfig)
            .find(hero => hero.name === player.heroes[i].name);
        if (heroData) {
            if (player.heroes[i].name.startsWith("Dwerg")) {
                dwerg_brothers += heroData.scoringRule(player);
            } else {
                const currentHeroScore: number = heroData.scoringRule(player);
                AddDataToLog(G, LogTypes.PRIVATE, `Очки за героя ${player.heroes[i].name} игрока 
                ${player.nickname}: ${currentHeroScore}.`);
                heroesScore += currentHeroScore;
            }
        }
    }
    AddDataToLog(G, LogTypes.PRIVATE, `Очки за героев братьев Двергов (${dwerg_brothers} шт.) игрока 
    ${player.nickname}: ${dwerg_brothers_scoring[dwerg_brothers]}.`);
    heroesScore += dwerg_brothers_scoring[dwerg_brothers];
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за героев игрока ${player.nickname}: ${heroesScore}.`);
    score += heroesScore;
    if (G.expansions.thingvellir.active) {
        let artifactsScore: number = 0;
        for (let i: number = 0; i < player.campCards.length; i++) {
            const artefact: IArtefact | undefined = Object.values(artefactsConfig).find(artefact => artefact.name ===
                player.campCards[i].name);
            let currentArtefactScore: number = 0;
            if (artefact) {
                if (typeof G.suitIdForMjollnir === "number") {
                    currentArtefactScore = artefact.scoringRule(player, G.suitIdForMjollnir);
                } else {
                    currentArtefactScore = artefact.scoringRule(player);
                }
            }
            if (currentArtefactScore) {
                AddDataToLog(G, LogTypes.PRIVATE, `Очки за артефакт ${player.campCards[i].name} игрока 
                    ${player.nickname}: ${currentArtefactScore}.`);
                artifactsScore += currentArtefactScore;
            }
        }
        AddDataToLog(G, LogTypes.PUBLIC, `Очки за артефакты игрока ${player.nickname}: ${artifactsScore}.`);
        score += artifactsScore;
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Итоговый счёт игрока ${player.nickname}: ${score}.`);
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
export const ScoreWinner = (G: MyGameState, ctx: Ctx): MyGameState | void => {
    AddDataToLog(G, LogTypes.GAME, "Финальные результаты игры:");
    for (let i: number = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring(G, ctx, G.publicPlayers[i]));
    }
    const maxScore: number = Math.max(...G.totalScore),
        maxPlayers: number = G.totalScore.filter(score => score === maxScore).length;
    let winners: number = 0;
    for (let i = ctx.numPlayers - 1; i >= 0; i--) {
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog(G, LogTypes.GAME, `Определился победитель: игрок ${G.publicPlayers[i].nickname}.`);
            if (maxPlayers === winners) {
                break;
            }
        }
    }
    if (G.winner.length) {
        return G;
    }
}
