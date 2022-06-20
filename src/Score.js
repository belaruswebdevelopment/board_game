import { IsCoin } from "./Coin";
import { artefactsConfig } from "./data/CampData";
import { heroesConfig } from "./data/HeroData";
import { giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { suitsConfig } from "./data/SuitData";
import { CheckCurrentSuitDistinctions } from "./Distinction";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { OpenClosedCoinsOnPlayerBoard, ReturnCoinsToPlayerBoard } from "./helpers/CoinHelpers";
import { AddDataToLog } from "./Logging";
import { IsGiantCard, IsGodCard, IsMythicalAnimalCard, IsValkyryCard } from "./MythologicalCreature";
import { BuffNames, HeroNames, LogTypes, RusCardTypes, SuitNames } from "./typescript/enums";
/**
 * <h3>Подсчитывает суммарное количество текущих очков выбранного игрока за карты в колонках фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Подсчёт и вывод на игровое поле текущее количество очков каждого игрока.</li>
 * <li>Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.</li>
 * <li>Подсчёт очков игроков для анализа ботами.</li>
 * </ol>
 *
 * @param G
 * @param player Игрок.
 * @returns Текущий счёт указанного игрока.
 */
export const CurrentScoring = (G, player) => {
    let score = 0, suit;
    for (suit in suitsConfig) {
        let additionalScoring = false;
        if (G.expansions.idavoll) {
            additionalScoring = CheckPlayerHasBuff(player, BuffNames.RatatoskFinalScoring);
        }
        score +=
            suitsConfig[suit].scoringRule(player.cards[suit], suit, undefined, additionalScoring);
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
    const player = G.publicPlayers[playerId];
    if (player === undefined) {
        throw new Error(`В массиве игроков отсутствует ${G.solo && playerId === 0 ? `игрок` : `соло бот`} с id '${playerId}'.`);
    }
    AddDataToLog(G, LogTypes.Game, `Результаты игры ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}:`);
    // TODO mythicalAnimalsScore??
    let score = CurrentScoring(G, player), coinsValue = 0;
    AddDataToLog(G, LogTypes.Public, `Очки за карты дворфов ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}: ${score}`);
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет ${G.solo && playerId === 0 ? `игрока` : `соло бота`} с id '${playerId}' на столе отсутствует монета с id '${i}'.`);
        }
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет ${G.solo && playerId === 0 ? `игрока` : `соло бота`} с id '${playerId}' на столе не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(boardCoin) && !boardCoin.isOpened) {
            throw new Error(`В массиве монет ${G.solo && playerId === 0 ? `игрока` : `соло бота`} с id '${playerId}' на столе должна быть ранее открыта монета с id '${i}' в конце игры.`);
        }
        if (IsCoin(boardCoin)) {
            coinsValue += boardCoin.value;
        }
    }
    score += coinsValue;
    AddDataToLog(G, LogTypes.Public, `Очки за монеты ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}: '${coinsValue}';`);
    if (warriorDistinctions.length && warriorDistinctions.includes(playerId)) {
        const warriorDistinctionScore = suitsConfig[SuitNames.Warrior].distinction.awarding(G, ctx, playerId);
        score += warriorDistinctionScore;
        if (warriorDistinctionScore) {
            AddDataToLog(G, LogTypes.Public, `Очки за преимущество по воинам ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}: '${warriorDistinctionScore}';`);
        }
    }
    const minerDistinctionPriorityScore = suitsConfig[SuitNames.Miner].distinction.awarding(G, ctx, playerId);
    score += minerDistinctionPriorityScore;
    if (minerDistinctionPriorityScore) {
        AddDataToLog(G, LogTypes.Public, `Очки за кристалл преимущества по горнякам ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}: '${minerDistinctionPriorityScore}';`);
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
        if (G.solo && playerId === 1 && hero.name === HeroNames.Uline) {
            continue;
        }
        if ((!G.solo || G.solo && playerId === 1) && hero.name.startsWith(`Dwerg`)) {
            dwerg_brothers += heroData.scoringRule();
        }
        else {
            const currentHeroScore = heroData.scoringRule(player, heroData.name);
            heroesScore += currentHeroScore;
            AddDataToLog(G, LogTypes.Private, `Очки за карту '${RusCardTypes.Hero}' '${hero.name}' ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}': '${currentHeroScore}';`);
        }
    }
    if (G.solo && playerId === 0) {
        const soloBotPublicPlayer = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            throw new Error(`В массиве игроков отсутствует соло бот с id '1'.`);
        }
        if (CheckPlayerHasBuff(soloBotPublicPlayer, BuffNames.EveryTurn)) {
            const heroData = Object.values(heroesConfig).find((heroObj) => heroObj.name === HeroNames.Uline);
            if (heroData === undefined) {
                throw new Error(`Не удалось найти карту '${RusCardTypes.Hero}' '${HeroNames.Uline}'.`);
            }
            const currentHeroScore = heroData.scoringRule(player);
            heroesScore += currentHeroScore;
            AddDataToLog(G, LogTypes.Private, `Очки за карту '${RusCardTypes.Hero}' '${HeroNames.Uline}' у соло бота из-за нарушения им правил игры добавляются игроку '${player.nickname}': '${currentHeroScore}';`);
        }
    }
    if ((!G.solo || G.solo && playerId === 1) && dwerg_brothers) {
        const dwerg_brother_value = dwerg_brothers_scoring[dwerg_brothers];
        if (dwerg_brother_value === undefined) {
            throw new Error(`Не существует количества очков за количество героев братьев Двергов - '${dwerg_brothers}'.`);
        }
        heroesScore += dwerg_brother_value;
        AddDataToLog(G, LogTypes.Private, `Очки за героев братьев Двергов (${dwerg_brothers} шт.) ${G.solo ? `соло бота` : `игрока '${player.nickname}'`}: '${dwerg_brothers_scoring[dwerg_brothers]}';`);
    }
    score += heroesScore;
    AddDataToLog(G, LogTypes.Public, `Очки за карты типа '${RusCardTypes.Hero}' ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}: ;${heroesScore};'`);
    if (G.expansions.thingvellir.active) {
        let artifactsScore = 0;
        for (let i = 0; i < player.campCards.length; i++) {
            const campCard = player.campCards[i];
            if (campCard === undefined) {
                throw new Error(`В массиве карт лагеря игрока отсутствует карта с id '${i}'.`);
            }
            const artefact = Object.values(artefactsConfig).find((artefact) => artefact.name === campCard.name);
            let currentArtefactScore = 0;
            if (artefact === undefined) {
                throw new Error(`Не удалось найти карту типа '${RusCardTypes.Artefact}' с названием '${campCard.name}'.`);
            }
            currentArtefactScore = artefact.scoringRule(G, player, artefact.name);
            if (currentArtefactScore) {
                artifactsScore += currentArtefactScore;
                AddDataToLog(G, LogTypes.Private, `Очки за карту '${RusCardTypes.Artefact}' '${campCard.name}' игрока '${player.nickname}': '${currentArtefactScore}';`);
            }
        }
        score += artifactsScore;
        AddDataToLog(G, LogTypes.Public, `Очки за карты типа '${RusCardTypes.Artefact}' игрока '${player.nickname}': '${artifactsScore}';`);
    }
    if (G.expansions.idavoll.active) {
        let godsScore = 0, giantsScore = 0, valkyriesScore = 0, mythicalAnimalScore = 0;
        for (let i = 0; i < player.mythologicalCreatureCards.length; i++) {
            const mythologicalCreatureCard = player.mythologicalCreatureCards[i];
            if (mythologicalCreatureCard === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' в командной зоне отсутствует карта с id '${i}'.`);
            }
            if (IsGodCard(mythologicalCreatureCard)) {
                const godCard = Object.values(godConfig).find((god) => god.name === mythologicalCreatureCard.name);
                if (godCard === undefined) {
                    throw new Error(`Не удалось найти карту типа '${RusCardTypes.God}' с названием '${mythologicalCreatureCard.name}'.`);
                }
                godsScore += godCard.points;
                AddDataToLog(G, LogTypes.Private, `Очки за карту '${RusCardTypes.God}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${godCard.points}';`);
            }
            else if (IsGiantCard(mythologicalCreatureCard)) {
                const giantCard = Object.values(giantConfig).find((giant) => giant.name === mythologicalCreatureCard.name);
                if (giantCard === undefined) {
                    throw new Error(`Не удалось найти карту типа '${RusCardTypes.Giant}' с названием '${mythologicalCreatureCard.name}'.`);
                }
                const currentGiantScore = giantCard.scoringRule(player, giantCard.name);
                giantsScore += currentGiantScore;
                AddDataToLog(G, LogTypes.Private, `Очки за карту '${RusCardTypes.Giant}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentGiantScore}';`);
            }
            else if (IsValkyryCard(mythologicalCreatureCard)) {
                const valkyryCard = Object.values(valkyryConfig).find((valkyry) => valkyry.name === mythologicalCreatureCard.name);
                if (valkyryCard === undefined) {
                    throw new Error(`Не удалось найти карту типа '${RusCardTypes.Valkyry}' с названием '${mythologicalCreatureCard.name}'.`);
                }
                if (mythologicalCreatureCard.strengthTokenNotch === null) {
                    throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' у карты типа '${RusCardTypes.Valkyry}' с названием '${mythologicalCreatureCard.name}' не может не быть выставлен токен силы.`);
                }
                const currentValkyryScore = valkyryCard.scoringRule(mythologicalCreatureCard.strengthTokenNotch, valkyryCard.name);
                valkyriesScore += currentValkyryScore;
                AddDataToLog(G, LogTypes.Private, `Очки за карту типа '${RusCardTypes.Valkyry}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentValkyryScore}';`);
            }
        }
        const cards = Object.values(player.cards).flat().filter((card) => IsMythicalAnimalCard(card));
        for (let m = 0; m < cards.length; m++) {
            const playerMythicalAnimalCard = cards[m];
            if (playerMythicalAnimalCard === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' отсутствует карта с id '${m}'.`);
            }
            const mythicalAnimalCard = Object.values(mythicalAnimalConfig).find((mythicalAnimal) => mythicalAnimal.name === playerMythicalAnimalCard.name);
            if (mythicalAnimalCard === undefined) {
                throw new Error(`Не удалось найти карту типа '${RusCardTypes.Mythical_Animal}' с названием '${playerMythicalAnimalCard.name}'.`);
            }
            if (typeof mythicalAnimalCard.scoringRule === 'function') {
                const currentMythicalAnimalScore = mythicalAnimalCard.scoringRule(player, mythicalAnimalCard.name);
                mythicalAnimalScore += currentMythicalAnimalScore;
                AddDataToLog(G, LogTypes.Private, `Очки за карту типа '${RusCardTypes.Mythical_Animal}' '${playerMythicalAnimalCard.name}' игрока '${player.nickname}': '${currentMythicalAnimalScore}';`);
            }
        }
        score += godsScore;
        AddDataToLog(G, LogTypes.Public, `Очки за карты типа '${RusCardTypes.God}' игрока '${player.nickname}': '${godsScore}';`);
        score += giantsScore;
        AddDataToLog(G, LogTypes.Public, `Очки за карты типа '${RusCardTypes.Giant}' игрока '${player.nickname}': '${giantsScore}';`);
        score += valkyriesScore;
        AddDataToLog(G, LogTypes.Public, `Очки за карты типа '${RusCardTypes.Valkyry}' игрока '${player.nickname}': '${valkyriesScore}';`);
        AddDataToLog(G, LogTypes.Public, `Очки за карты типа '${RusCardTypes.Mythical_Animal}' игрока '${player.nickname}': '${mythicalAnimalScore}';`);
    }
    AddDataToLog(G, LogTypes.Public, `Итоговый счёт ${G.solo && playerId === 0 ? `игрока '${player.nickname}'` : `соло бота`}: '${score}'.`);
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
        if (G.solo || (!G.solo && CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
            ReturnCoinsToPlayerBoard(G, index);
        }
        OpenClosedCoinsOnPlayerBoard(G, index);
    });
    G.drawProfit = ``;
    AddDataToLog(G, LogTypes.Game, `Финальные результаты игры:`);
    const warriorDistinctions = CheckCurrentSuitDistinctions(G, ctx, SuitNames.Warrior);
    for (let i = 0; i < ctx.numPlayers + Number(G.solo); i++) {
        G.totalScore.push(FinalScoring(G, ctx, i, warriorDistinctions));
    }
    const maxScore = Math.max(...G.totalScore), maxPlayers = G.totalScore.filter((score) => score === maxScore).length;
    let winners = 0;
    for (let i = ctx.numPlayers + Number(G.solo) - 1; i >= 0; i--) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            throw new Error(`В массиве игроков отсутствует игрок с id '${i}'.`);
        }
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog(G, LogTypes.Game, `Определился победитель: игрок '${player.nickname}'.`);
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