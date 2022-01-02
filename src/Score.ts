import { Ctx } from "boardgame.io";
import { artefactsConfig } from "./data/CampData";
import { heroesConfig } from "./data/HeroData";
import { suitsConfig } from "./data/SuitData";
import { CheckCurrentSuitDistinctions } from "./Distinction";
import { GetSuitIndexByName } from "./helpers/SuitHelpers";
import { AddDataToLog } from "./Logging";
import { LogTypes, SuitNames } from "./typescript/enums";
import { IArtefact, IHeroData, IPublicPlayer, MyGameState } from "./typescript/interfaces";

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
export const CurrentScoring = (player: IPublicPlayer): number => {
    let score = 0;
    for (const suit in suitsConfig) {
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
 * @returns Финальный счёт указанного игрока.
 */
export const FinalScoring = (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
    AddDataToLog(G, LogTypes.GAME, `Результаты игры игрока ${player.nickname}:`);
    let score: number = CurrentScoring(player),
        coinsValue = 0;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за карты дворфов игрока ${player.nickname}: ${score}`);
    for (let i = 0; i < player.boardCoins.length; i++) {
        coinsValue += player.boardCoins[i]?.value ?? 0;
    }
    if (player.buffs.everyTurn === `Uline`) {
        for (let i = 0; i < player.handCoins.length; i++) {
            coinsValue += player.handCoins[i]?.value ?? 0;
        }
    }
    score += coinsValue;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за монеты игрока ${player.nickname}: ${coinsValue}`);
    const suitWarriorIndex: number = GetSuitIndexByName(SuitNames.WARRIOR);
    if (suitWarriorIndex !== -1) {
        const warriorsDistinction: number[] | undefined =
            CheckCurrentSuitDistinctions(G, ctx, SuitNames.WARRIOR),
            playerIndex: number =
                G.publicPlayers.findIndex((p: IPublicPlayer): boolean => p.nickname === player.nickname);
        if (warriorsDistinction !== undefined && warriorsDistinction.includes(playerIndex)) {
            const warriorDistinctionScore: number = suitsConfig[SuitNames.WARRIOR].distinction.awarding(G, ctx, player);
            score += warriorDistinctionScore;
            AddDataToLog(G, LogTypes.PUBLIC, `Очки за преимущество по воинам игрока ${player.nickname}: ${warriorDistinctionScore}`);
        }
    }
    const suitMinerIndex: number = GetSuitIndexByName(SuitNames.MINER);
    if (suitMinerIndex !== -1) {
        const minerDistinctionPriorityScore: number = suitsConfig[SuitNames.MINER].distinction.awarding(G, ctx, player);
        score += minerDistinctionPriorityScore;
        if (minerDistinctionPriorityScore) {
            AddDataToLog(G, LogTypes.PUBLIC, `Очки за кристалл преимущества по горнякам игрока ${player.nickname}: ${minerDistinctionPriorityScore}`);
        }
    }
    let heroesScore = 0,
        dwerg_brothers = 0;
    const dwerg_brothers_scoring: number[] = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        const heroData: IHeroData | undefined = Object.values(heroesConfig)
            .find((hero: IHeroData): boolean => hero.name === player.heroes[i].name);
        if (heroData !== undefined) {
            if (player.heroes[i].name.startsWith(`Dwerg`)) {
                dwerg_brothers += heroData.scoringRule(player);
            } else {
                const currentHeroScore: number = heroData.scoringRule(player);
                heroesScore += currentHeroScore;
                AddDataToLog(G, LogTypes.PRIVATE, `Очки за героя ${player.heroes[i].name} игрока ${player.nickname}: ${currentHeroScore}.`);
            }
        } else {
            AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось найти героя ${player.heroes[i].name}.`);
        }
    }
    if (dwerg_brothers) {
        heroesScore += dwerg_brothers_scoring[dwerg_brothers];
        AddDataToLog(G, LogTypes.PRIVATE, `Очки за героев братьев Двергов (${dwerg_brothers} шт.) игрока ${player.nickname}: ${dwerg_brothers_scoring[dwerg_brothers]}.`);
    }
    score += heroesScore;
    AddDataToLog(G, LogTypes.PUBLIC, `Очки за героев игрока ${player.nickname}: ${heroesScore}.`);
    if (G.expansions.thingvellir.active) {
        let artifactsScore = 0;
        for (let i = 0; i < player.campCards.length; i++) {
            const artefact: IArtefact | undefined = Object.values(artefactsConfig)
                .find((artefact: IArtefact): boolean => artefact.name === player.campCards[i].name);
            let currentArtefactScore = 0;
            if (artefact !== undefined) {
                if (G.suitIdForMjollnir !== null) {
                    currentArtefactScore = artefact.scoringRule(player, G.suitIdForMjollnir);
                } else {
                    currentArtefactScore = artefact.scoringRule(player);
                }
            } else {
                AddDataToLog(G, LogTypes.ERROR, `ОШИБКА: Не удалось найти артефакт ${player.campCards[i].name}.`);
            }
            if (currentArtefactScore) {
                artifactsScore += currentArtefactScore;
                AddDataToLog(G, LogTypes.PRIVATE, `Очки за артефакт ${player.campCards[i].name} игрока ${player.nickname}: ${currentArtefactScore}.`);
            }
        }
        score += artifactsScore;
        AddDataToLog(G, LogTypes.PUBLIC, `Очки за артефакты игрока ${player.nickname}: ${artifactsScore}.`);
    }
    AddDataToLog(G, LogTypes.PUBLIC, `Итоговый счёт игрока ${player.nickname}: ${score}.`);
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
export const ScoreWinner = (G: MyGameState, ctx: Ctx): MyGameState | void => {
    AddDataToLog(G, LogTypes.GAME, `Финальные результаты игры:`);
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring(G, ctx, G.publicPlayers[i]));
    }
    const maxScore: number = Math.max(...G.totalScore),
        maxPlayers: number = G.totalScore.filter((score: number): boolean => score === maxScore).length;
    let winners = 0;
    for (let i: number = ctx.numPlayers - 1; i >= 0; i--) {
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
};
