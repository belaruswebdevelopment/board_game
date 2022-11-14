import { IsCoin } from "./Coin";
import { artefactsConfig } from "./data/CampData";
import { heroesConfig } from "./data/HeroData";
import { giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig } from "./data/MythologicalCreatureData";
import { suitsConfig } from "./data/SuitData";
import { StartArtefactScoring } from "./dispatchers/ArtefactScoringDispatcher";
import { StartDistinctionAwarding } from "./dispatchers/DistinctionAwardingDispatcher";
import { StartGiantScoring } from "./dispatchers/GiantScoringDispatcher";
import { StartHeroScoring } from "./dispatchers/HeroScoringDispatcher";
import { StartMythicalAnimalScoring } from "./dispatchers/MythicalAnimalDispatcher";
import { StartSuitScoring } from "./dispatchers/SuitScoringDispatcher";
import { StartValkyryScoring } from "./dispatchers/ValkyryScoringDispatcherHelpers";
import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { OpenClosedCoinsOnPlayerBoard, ReturnCoinsToPlayerBoard } from "./helpers/CoinHelpers";
import { IsMythicalAnimalCard } from "./helpers/IsMythologicalCreatureTypeHelpers";
import { AddDataToLog } from "./Logging";
import { CheckCurrentSuitDistinctions } from "./TroopEvaluation";
import { ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames, MythicalAnimalBuffNames, RusCardTypeNames, SuitNames } from "./typescript/enums";
import type { CampDeckCardType, CanBeUndefType, CanBeVoidType, FnContext, IGiantData, IGodData, IHeroCard, IHeroData, IMyGameState, IMythicalAnimalCard, IMythicalAnimalData, IPublicPlayer, IValkyryData, MyFnContext, MythologicalCreatureCommandZoneCardType, PublicPlayerCoinType } from "./typescript/interfaces";

// TODO Player rework to playerID
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
export const CurrentScoring = ({ G, ctx, playerID, ...rest }: MyFnContext): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    let score = 0,
        suit: SuitNames;
    for (suit in suitsConfig) {
        let additionalScoring = false;
        if (G.expansions.idavoll.active) {
            additionalScoring = CheckPlayerHasBuff({ G, ctx, playerID, ...rest },
                MythicalAnimalBuffNames.RatatoskFinalScoring);
        }
        score += StartSuitScoring(suitsConfig[suit].scoringRule,
            [player.cards[suit], undefined, additionalScoring]);
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
const FinalScoring = ({ G, ctx, playerID, ...rest }: MyFnContext, warriorDistinctions: number[]): number => {
    const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[Number(playerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            playerID);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Результаты игры ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}:`);
    let score: number = CurrentScoring({ G, ctx, playerID, ...rest }),
        coinsValue = 0;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты дворфов ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: ${score}`);
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin: CanBeUndefType<PublicPlayerCoinType> = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`} с id '${playerID}' на столе отсутствует монета с id '${i}'.`);
        }
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`} с id '${playerID}' на столе не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(boardCoin) && !boardCoin.isOpened) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`} с id '${playerID}' на столе должна быть ранее открыта монета с id '${i}' в конце игры.`);
        }
        if (IsCoin(boardCoin)) {
            coinsValue += boardCoin.value;
        }
    }
    score += coinsValue;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за монеты ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${coinsValue}';`);
    if (warriorDistinctions.length && warriorDistinctions.includes(Number(playerID))) {
        const warriorDistinctionScore: number =
            StartDistinctionAwarding({ G, ctx, playerID: String(playerID), ...rest },
                suitsConfig[SuitNames.warrior].distinction.awarding);
        score += warriorDistinctionScore;
        if (warriorDistinctionScore) {
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за преимущество по воинам ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${warriorDistinctionScore}';`);
        }
    }
    const minerDistinctionPriorityScore: number =
        StartDistinctionAwarding({ G, ctx, playerID: String(playerID), ...rest },
            suitsConfig[SuitNames.miner].distinction.awarding);
    score += minerDistinctionPriorityScore;
    if (minerDistinctionPriorityScore) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за кристалл преимущества по горнякам ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${minerDistinctionPriorityScore}';`);
    }
    let heroesScore = 0,
        dwerg_brothers = 0;
    const dwerg_brothers_scoring: number[] = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        const hero: CanBeUndefType<IHeroCard> = player.heroes[i];
        if (hero === undefined) {
            throw new Error(`Не существует карта героя с id '${i}'.`);
        }
        const heroData: IHeroData = heroesConfig[hero.name];
        if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
            || G.mode === GameModeNames.SoloAndvari) || G.mode === GameModeNames.Solo && playerID === `1`)
            && hero.name.startsWith(`Dwerg`)) {
            dwerg_brothers += StartHeroScoring({ G, ctx, playerID, ...rest }, heroData.scoringRule);
        } else {
            const currentHeroScore: number =
                StartHeroScoring({ G, ctx, playerID, ...rest }, heroData.scoringRule);
            heroesScore += currentHeroScore;
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Hero_Card}' '${hero.name}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}': '${currentHeroScore}';`);

        }
    }
    if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
        || G.mode === GameModeNames.SoloAndvari) || (G.mode === GameModeNames.Solo && playerID === `1`))
        && dwerg_brothers) {
        const dwerg_brother_value: CanBeUndefType<number> = dwerg_brothers_scoring[dwerg_brothers];
        if (dwerg_brother_value === undefined) {
            throw new Error(`Не существует количества очков за количество героев братьев Двергов - '${dwerg_brothers}'.`);
        }
        heroesScore += dwerg_brother_value;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за героев братьев Двергов (${dwerg_brothers} шт.) ${G.mode === GameModeNames.Solo ? `соло бота` : `игрока '${player.nickname}'`}: '${dwerg_brothers_scoring[dwerg_brothers]}';`);
    }
    score += heroesScore;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Hero_Card}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: ;${heroesScore};'`);
    if (G.expansions.thingvellir.active) {
        let artifactsScore = 0;
        for (let i = 0; i < player.campCards.length; i++) {
            const campCard: CanBeUndefType<CampDeckCardType> = player.campCards[i];
            if (campCard === undefined) {
                throw new Error(`В массиве карт лагеря игрока отсутствует карта с id '${i}'.`);
            }
            let currentArtefactScore = 0,
                _exhaustiveCheck: never;
            switch (campCard.type) {
                case RusCardTypeNames.Artefact_Card:
                    currentArtefactScore = StartArtefactScoring({ G, ctx, playerID, ...rest },
                        artefactsConfig[campCard.name].scoringRule);
                    if (currentArtefactScore) {
                        artifactsScore += currentArtefactScore;
                        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Artefact_Card}' '${campCard.name}' игрока '${player.nickname}': '${currentArtefactScore}';`);
                    }
                    break;
                case RusCardTypeNames.Mercenary_Card:
                    throw new Error(`В командной зоне карт лагеря игрока не может в конце игры быть карта c типом '${RusCardTypeNames.Mercenary_Card}' с id '${i}'.`);
                default:
                    _exhaustiveCheck = campCard;
                    throw new Error(`В командной зоне карт лагеря игрока не может быть карта запрещённого типа с id '${i}'.`);
                    return _exhaustiveCheck;
            }
        }
        score += artifactsScore;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Artefact_Card}' игрока '${player.nickname}': '${artifactsScore}';`);
    }
    if (G.expansions.idavoll.active) {
        let godsScore = 0,
            giantsScore = 0,
            valkyriesScore = 0,
            mythicalAnimalScore = 0;
        for (let i = 0; i < player.mythologicalCreatureCards.length; i++) {
            const mythologicalCreatureCard: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
                player.mythologicalCreatureCards[i];
            if (mythologicalCreatureCard === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${playerID}' в командной зоне отсутствует карта с id '${i}'.`);
            }
            let godCard: CanBeUndefType<IGodData>,
                giantCard: CanBeUndefType<IGiantData>,
                valkyryCard: CanBeUndefType<IValkyryData>,
                currentGiantScore: number,
                currentValkyryScore: number,
                _exhaustiveCheck: never;
            switch (mythologicalCreatureCard.type) {
                case RusCardTypeNames.God_Card:
                    godCard = godConfig[mythologicalCreatureCard.name];
                    godsScore += godCard.points;
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.God_Card}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${godCard.points}';`);
                    break;
                case RusCardTypeNames.Giant_Card:
                    giantCard = giantConfig[mythologicalCreatureCard.name];
                    currentGiantScore = StartGiantScoring({ G, ctx, playerID, ...rest }, giantCard.scoringRule);
                    giantsScore += currentGiantScore;
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Giant_Card}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentGiantScore}';`);
                    break;
                case RusCardTypeNames.Valkyry_Card:
                    valkyryCard = valkyryConfig[mythologicalCreatureCard.name];
                    if (mythologicalCreatureCard.strengthTokenNotch === null) {
                        throw new Error(`В массиве карт мифических существ игрока с id '${playerID}' у карты типа '${RusCardTypeNames.Valkyry_Card}' с названием '${mythologicalCreatureCard.name}' не может не быть выставлен токен силы.`);
                    }
                    currentValkyryScore = StartValkyryScoring(valkyryCard.scoringRule,
                        [mythologicalCreatureCard.strengthTokenNotch]);
                    valkyriesScore += currentValkyryScore;
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту типа '${RusCardTypeNames.Valkyry_Card}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentValkyryScore}';`);
                    break;
                default:
                    _exhaustiveCheck = mythologicalCreatureCard;
                    throw new Error(`В массиве карт мифических существ игрока карта не может быть с недопустимым типом.`);
                    return _exhaustiveCheck;
            }
        }
        const cards: IMythicalAnimalCard[] =
            Object.values(player.cards).flat().filter(IsMythicalAnimalCard);
        for (let m = 0; m < cards.length; m++) {
            const playerMythicalAnimalCard: CanBeUndefType<IMythicalAnimalCard> = cards[m];
            if (playerMythicalAnimalCard === undefined) {
                throw new Error(`В массиве карт мифических существ игрока с id '${playerID}' отсутствует карта с id '${m}'.`);
            }
            const mythicalAnimalCard: IMythicalAnimalData = mythicalAnimalConfig[playerMythicalAnimalCard.name],
                currentMythicalAnimalScore: number =
                    StartMythicalAnimalScoring({ G, ctx, playerID, ...rest }, mythicalAnimalCard.scoringRule);
            mythicalAnimalScore += currentMythicalAnimalScore;
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту типа '${RusCardTypeNames.Mythical_Animal_Card}' '${playerMythicalAnimalCard.name}' игрока '${player.nickname}': '${currentMythicalAnimalScore}';`);
        }
        score += godsScore;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.God_Card}' игрока '${player.nickname}': '${godsScore}';`);
        score += giantsScore;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Giant_Card}' игрока '${player.nickname}': '${giantsScore}';`);
        score += valkyriesScore;
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Valkyry_Card}' игрока '${player.nickname}': '${valkyriesScore}';`);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Mythical_Animal_Card}' игрока '${player.nickname}': '${mythicalAnimalScore}';`);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Итоговый счёт ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && playerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${score}'.`);
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
export const ScoreWinner = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<IMyGameState> => {
    Object.values(G.publicPlayers).forEach((player: IPublicPlayer, index: number): void => {
        if ((G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`)
            || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`)
            || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
                || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `0`))
                && CheckPlayerHasBuff({ G, ctx, playerID: String(index), ...rest },
                    HeroBuffNames.EveryTurn))) {
            ReturnCoinsToPlayerBoard({ G, ctx, playerID: String(index), ...rest });
        }
        OpenClosedCoinsOnPlayerBoard({ G, ctx, playerID: String(index), ...rest });
    });
    G.drawProfit = null;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Финальные результаты игры:`);
    const warriorDistinctions: number[] =
        CheckCurrentSuitDistinctions({ G, ctx, ...rest }, SuitNames.warrior);
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring({ G, ctx, playerID: String(i), ...rest },
            warriorDistinctions));
    }
    const maxScore: number = Math.max(...G.totalScore),
        maxPlayers: number = G.totalScore.filter((score: number): boolean => score === maxScore).length;
    let winners = 0;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndefType<IPublicPlayer> = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                i);
        }
        if (maxScore === G.totalScore[i] && maxPlayers > winners) {
            G.winner.push(i);
            winners++;
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Определился победитель: игрок '${player.nickname}'.`);
            if (maxPlayers === winners) {
                break;
            }
        }
    }
    if (G.winner.length) {
        return G;
    }
};
