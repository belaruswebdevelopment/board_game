import type { Ctx } from "boardgame.io";
import { IsCoin } from "./Coin";
import { artefactsConfig } from "./data/CampData";
import { heroesConfig } from "./data/HeroData";
import { giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { suitsConfig } from "./data/SuitData";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { OpenClosedCoinsOnPlayerBoard, ReturnCoinsToPlayerBoard } from "./helpers/CoinHelpers";
import { AddDataToLog } from "./Logging";
import { IsGiantCard, IsGodCard, IsMythicalAnimalCard, IsValkyryCard } from "./MythologicalCreature";
import { CheckCurrentSuitDistinctions } from "./TroopEvaluation";
import { BuffNames, ErrorNames, HeroNames, LogTypeNames, RusCardTypeNames, SuitNames } from "./typescript/enums";
import type { CampDeckCardTypes, CanBeUndef, IArtefact, IGiantData, IGodData, IHeroCard, IHeroData, IMyGameState, IMythicalAnimalCard, IMythicalAnimalData, IPublicPlayer, IValkyryData, MythologicalCreatureCommandZoneCardTypes, PlayerCardTypes, PublicPlayerCoinTypes, SuitTypes } from "./typescript/interfaces";

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
export const CurrentScoring = (G: IMyGameState, player: IPublicPlayer): number => {
    let score = 0,
        suit: SuitTypes;
    for (suit in suitsConfig) {
        let additionalScoring = false;
        if (G.expansions.idavoll) {
            additionalScoring = CheckPlayerHasBuff(player, BuffNames.RatatoskFinalScoring);
        }
        score += suitsConfig[suit].scoringRule(player.cards[suit], suit, undefined,
            additionalScoring);
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
export const FinalScoring = (G: IMyGameState, ctx: Ctx, playerId: number, warriorDistinctions: number[]): number => {
    const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[playerId];
    if (player === undefined) {
        return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, playerId);
    }
    AddDataToLog(G, LogTypeNames.Game, `Результаты игры ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}:`);
    let score: number = CurrentScoring(G, player),
        coinsValue = 0;
    AddDataToLog(G, LogTypeNames.Public, `Очки за карты дворфов ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}: ${score}`);
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin: CanBeUndef<PublicPlayerCoinTypes> = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет ${(G.solo || (G.solo && playerId === 0)) ? `игрока` : `соло бота`} с id '${playerId}' на столе отсутствует монета с id '${i}'.`);
        }
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет ${(G.solo || (G.solo && playerId === 0)) ? `игрока` : `соло бота`} с id '${playerId}' на столе не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(boardCoin) && !boardCoin.isOpened) {
            throw new Error(`В массиве монет ${(G.solo || (G.solo && playerId === 0)) ? `игрока` : `соло бота`} с id '${playerId}' на столе должна быть ранее открыта монета с id '${i}' в конце игры.`);
        }
        if (IsCoin(boardCoin)) {
            coinsValue += boardCoin.value;
        }
    }
    score += coinsValue;
    AddDataToLog(G, LogTypeNames.Public, `Очки за монеты ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}: '${coinsValue}';`);
    if (warriorDistinctions.length && warriorDistinctions.includes(playerId)) {
        const warriorDistinctionScore: number = suitsConfig[SuitNames.Warrior].distinction.awarding(G, ctx, playerId);
        score += warriorDistinctionScore;
        if (warriorDistinctionScore) {
            AddDataToLog(G, LogTypeNames.Public, `Очки за преимущество по воинам ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}: '${warriorDistinctionScore}';`);
        }
    }
    const minerDistinctionPriorityScore: number = suitsConfig[SuitNames.Miner].distinction.awarding(G, ctx, playerId);
    score += minerDistinctionPriorityScore;
    if (minerDistinctionPriorityScore) {
        AddDataToLog(G, LogTypeNames.Public, `Очки за кристалл преимущества по горнякам ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}: '${minerDistinctionPriorityScore}';`);
    }
    let heroesScore = 0,
        dwerg_brothers = 0;
    const dwerg_brothers_scoring: number[] = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        const hero: CanBeUndef<IHeroCard> = player.heroes[i];
        if (hero === undefined) {
            throw new Error(`Не существует карта героя с id '${i}'.`);
        }
        const heroData: CanBeUndef<IHeroData> =
            Object.values(heroesConfig).find((heroObj: IHeroData): boolean => heroObj.name === hero.name);
        if (heroData === undefined) {
            throw new Error(`Не удалось найти героя '${hero.name}'.`);
        }
        if (G.solo && playerId === 1 && hero.name === HeroNames.Uline) {
            continue;
        }
        if ((!G.solo || G.solo && playerId === 1) && hero.name.startsWith(`Dwerg`)) {
            dwerg_brothers += heroData.scoringRule();
        } else {
            const currentHeroScore: number = heroData.scoringRule(player, heroData.name);
            heroesScore += currentHeroScore;
            AddDataToLog(G, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Hero}' '${hero.name}' ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}': '${currentHeroScore}';`);

        }
    }
    if (G.solo && playerId === 0) {
        const soloBotPublicPlayer: CanBeUndef<IPublicPlayer> = G.publicPlayers[1];
        if (soloBotPublicPlayer === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, 1);
        }
        if (CheckPlayerHasBuff(soloBotPublicPlayer, BuffNames.EveryTurn)) {
            const heroData: CanBeUndef<IHeroData> =
                Object.values(heroesConfig).find((heroObj: IHeroData): boolean =>
                    heroObj.name === HeroNames.Uline);
            if (heroData === undefined) {
                throw new Error(`Не удалось найти карту '${RusCardTypeNames.Hero}' '${HeroNames.Uline}'.`);
            }
            const currentHeroScore: number = heroData.scoringRule(player);
            heroesScore += currentHeroScore;
            AddDataToLog(G, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Hero}' '${HeroNames.Uline}' у соло бота из-за нарушения им правил игры добавляются игроку '${player.nickname}': '${currentHeroScore}';`);
        }
    }
    if ((!G.solo || G.solo && playerId === 1) && dwerg_brothers) {
        const dwerg_brother_value: CanBeUndef<number> = dwerg_brothers_scoring[dwerg_brothers];
        if (dwerg_brother_value === undefined) {
            throw new Error(`Не существует количества очков за количество героев братьев Двергов - '${dwerg_brothers}'.`);
        }
        heroesScore += dwerg_brother_value;
        AddDataToLog(G, LogTypeNames.Private, `Очки за героев братьев Двергов (${dwerg_brothers} шт.) ${G.solo ? `соло бота` : `игрока '${player.nickname}'`}: '${dwerg_brothers_scoring[dwerg_brothers]}';`);
    }
    score += heroesScore;
    AddDataToLog(G, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Hero}' ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}: ;${heroesScore};'`);
    if (G.expansions.thingvellir.active) {
        let artifactsScore = 0;
        for (let i = 0; i < player.campCards.length; i++) {
            const campCard: CanBeUndef<CampDeckCardTypes> = player.campCards[i];
            if (campCard === undefined) {
                throw new Error(`В массиве карт лагеря игрока отсутствует карта с id '${i}'.`);
            }
            const artefact: CanBeUndef<IArtefact> =
                Object.values(artefactsConfig).find((artefact: IArtefact): boolean =>
                    artefact.name === campCard.name);
            let currentArtefactScore = 0;
            if (artefact === undefined) {
                throw new Error(`Не удалось найти карту типа '${RusCardTypeNames.Artefact}' с названием '${campCard.name}'.`);
            }
            currentArtefactScore = artefact.scoringRule(G, player, artefact.name);
            if (currentArtefactScore) {
                artifactsScore += currentArtefactScore;
                AddDataToLog(G, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Artefact}' '${campCard.name}' игрока '${player.nickname}': '${currentArtefactScore}';`);
            }
        }
        score += artifactsScore;
        AddDataToLog(G, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Artefact}' игрока '${player.nickname}': '${artifactsScore}';`);
    }
    if (G.expansions.idavoll.active) {
        let godsScore = 0,
            giantsScore = 0,
            valkyriesScore = 0,
            mythicalAnimalScore = 0;
        for (let i = 0; i < player.mythologicalCreatureCards.length; i++) {
            const mythologicalCreatureCard: CanBeUndef<MythologicalCreatureCommandZoneCardTypes> =
                player.mythologicalCreatureCards[i];
            if (mythologicalCreatureCard === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' в командной зоне отсутствует карта с id '${i}'.`);
            }
            if (IsGodCard(mythologicalCreatureCard)) {
                const godCard: CanBeUndef<IGodData> =
                    Object.values(godConfig).find((god: IGodData): boolean =>
                        god.name === mythologicalCreatureCard.name);
                if (godCard === undefined) {
                    throw new Error(`Не удалось найти карту типа '${RusCardTypeNames.God}' с названием '${mythologicalCreatureCard.name}'.`);
                }
                godsScore += godCard.points;
                AddDataToLog(G, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.God}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${godCard.points}';`);
            } else if (IsGiantCard(mythologicalCreatureCard)) {
                const giantCard: CanBeUndef<IGiantData> =
                    Object.values(giantConfig).find((giant: IGiantData): boolean =>
                        giant.name === mythologicalCreatureCard.name);
                if (giantCard === undefined) {
                    throw new Error(`Не удалось найти карту типа '${RusCardTypeNames.Giant}' с названием '${mythologicalCreatureCard.name}'.`);
                }
                const currentGiantScore: number = giantCard.scoringRule(player, giantCard.name);
                giantsScore += currentGiantScore;
                AddDataToLog(G, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Giant}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentGiantScore}';`);
            } else if (IsValkyryCard(mythologicalCreatureCard)) {
                const valkyryCard: CanBeUndef<IValkyryData> =
                    Object.values(valkyryConfig).find((valkyry: IValkyryData): boolean =>
                        valkyry.name === mythologicalCreatureCard.name);
                if (valkyryCard === undefined) {
                    throw new Error(`Не удалось найти карту типа '${RusCardTypeNames.Valkyry}' с названием '${mythologicalCreatureCard.name}'.`);
                }
                if (mythologicalCreatureCard.strengthTokenNotch === null) {
                    throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' у карты типа '${RusCardTypeNames.Valkyry}' с названием '${mythologicalCreatureCard.name}' не может не быть выставлен токен силы.`);
                }
                const currentValkyryScore: number =
                    valkyryCard.scoringRule(mythologicalCreatureCard.strengthTokenNotch, valkyryCard.name);
                valkyriesScore += currentValkyryScore;
                AddDataToLog(G, LogTypeNames.Private, `Очки за карту типа '${RusCardTypeNames.Valkyry}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentValkyryScore}';`);
            }
        }
        const cards: IMythicalAnimalCard[] =
            Object.values(player.cards).flat().filter((card: PlayerCardTypes): boolean =>
                IsMythicalAnimalCard(card)) as IMythicalAnimalCard[];
        for (let m = 0; m < cards.length; m++) {
            const playerMythicalAnimalCard: IMythicalAnimalCard | undefined = cards[m];
            if (playerMythicalAnimalCard === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${playerId}' отсутствует карта с id '${m}'.`);
            }
            const mythicalAnimalCard: CanBeUndef<IMythicalAnimalData> =
                Object.values(mythicalAnimalConfig).find((mythicalAnimal: IMythicalAnimalData):
                    boolean => mythicalAnimal.name === playerMythicalAnimalCard.name);
            if (mythicalAnimalCard === undefined) {
                throw new Error(`Не удалось найти карту типа '${RusCardTypeNames.Mythical_Animal}' с названием '${playerMythicalAnimalCard.name}'.`);
            }
            if (typeof mythicalAnimalCard.scoringRule === 'function') {
                const currentMythicalAnimalScore: number =
                    mythicalAnimalCard.scoringRule(player, mythicalAnimalCard.name);
                mythicalAnimalScore += currentMythicalAnimalScore;
                AddDataToLog(G, LogTypeNames.Private, `Очки за карту типа '${RusCardTypeNames.Mythical_Animal}' '${playerMythicalAnimalCard.name}' игрока '${player.nickname}': '${currentMythicalAnimalScore}';`);
            }
        }
        score += godsScore;
        AddDataToLog(G, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.God}' игрока '${player.nickname}': '${godsScore}';`);
        score += giantsScore;
        AddDataToLog(G, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Giant}' игрока '${player.nickname}': '${giantsScore}';`);
        score += valkyriesScore;
        AddDataToLog(G, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Valkyry}' игрока '${player.nickname}': '${valkyriesScore}';`);
        AddDataToLog(G, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Mythical_Animal}' игрока '${player.nickname}': '${mythicalAnimalScore}';`);
    }
    AddDataToLog(G, LogTypeNames.Public, `Итоговый счёт ${(G.solo || (G.solo && playerId === 0)) ? `игрока '${player.nickname}'` : `соло бота`}: '${score}'.`);
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
export const ScoreWinner = (G: IMyGameState, ctx: Ctx): IMyGameState | void => {
    Object.values(G.publicPlayers).forEach((player: IPublicPlayer, index: number): void => {
        if (G.solo || (!G.solo && CheckPlayerHasBuff(player, BuffNames.EveryTurn))) {
            ReturnCoinsToPlayerBoard(G, ctx, index);
        }
        OpenClosedCoinsOnPlayerBoard(G, ctx, index);
    });
    G.drawProfit = ``;
    AddDataToLog(G, LogTypeNames.Game, `Финальные результаты игры:`);
    const warriorDistinctions: number[] = CheckCurrentSuitDistinctions(G, ctx, SuitNames.Warrior);
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring(G, ctx, i, warriorDistinctions));
    }
    const maxScore: number = Math.max(...G.totalScore),
        maxPlayers: number = G.totalScore.filter((score: number): boolean => score === maxScore).length;
    let winners = 0;
    for (let i: number = ctx.numPlayers - 1; i >= 0; i--) {
        const player: CanBeUndef<IPublicPlayer> = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError(G, ctx, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
        }
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog(G, LogTypeNames.Game, `Определился победитель: игрок '${player.nickname}'.`);
            if (maxPlayers === winners) {
                break;
            }
        }
    }
    if (G.winner.length) {
        return G;
    }
};
