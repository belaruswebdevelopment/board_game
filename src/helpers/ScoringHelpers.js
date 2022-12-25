import { artefactsConfig } from "../data/CampData";
import { heroesConfig } from "../data/HeroData";
import { giantConfig, godConfig, mythicalAnimalConfig, valkyryConfig } from "../data/MythologicalCreatureData";
import { suitsConfig } from "../data/SuitData";
import { StartArtefactScoring } from "../dispatchers/ArtefactScoringDispatcher";
import { StartDistinctionAwarding } from "../dispatchers/DistinctionAwardingDispatcher";
import { StartGiantScoring } from "../dispatchers/GiantScoringDispatcher";
import { StartHeroScoring } from "../dispatchers/HeroScoringDispatcher";
import { StartMythicalAnimalScoring } from "../dispatchers/MythicalAnimalDispatcher";
import { StartSuitScoring } from "../dispatchers/SuitScoringDispatcher";
import { StartValkyryScoring } from "../dispatchers/ValkyryScoringDispatcherHelpers";
import { ThrowMyError } from "../Error";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { IsMythicalAnimalCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CheckCurrentSuitDistinctionPlayers } from "../TroopEvaluation";
import { ErrorNames, GameModeNames, LogTypeNames, MythicalAnimalBuffNames, RusCardTypeNames, RusSuitNames, SuitNames } from "../typescript/enums";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { GetMaxCoinValue } from "./CoinHelpers";
import { GetMinerDistinctionsScore } from "./DistinctionAwardingHelpers";
export const CurrentAllSuitsScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    let totalScore = 0, suit;
    for (suit in suitsConfig) {
        totalScore += GetCurrentSuitTotalScore({ G, ctx, myPlayerID, ...rest }, suit);
    }
    return totalScore;
};
export const CurrentPotentialMinerDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }) => GetMinerDistinctionsScore({ G, ctx, myPlayerID, ...rest });
export const CurrentPotentialWarriorDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    let totalScore = 0;
    const warriorDistinctions = CheckCurrentSuitDistinctionPlayers({ G, ctx, ...rest }, SuitNames.warrior);
    if (warriorDistinctions.length && warriorDistinctions.includes(Number(myPlayerID))) {
        totalScore += GetMaxCoinValue({ G, ctx, myPlayerID, ...rest });
    }
    return totalScore;
};
export const CurrentOrFinalAllHeroesScoring = ({ G, ctx, myPlayerID, ...rest }, isFinal = false) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let totalScore = 0, heroesScore = 0, dwerg_brothers = 0;
    const dwerg_brothers_scoring = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        const hero = player.heroes[i];
        if (hero === undefined) {
            throw new Error(`Не существует карта героя с id '${i}'.`);
        }
        const heroData = heroesConfig[hero.name];
        if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
            || G.mode === GameModeNames.SoloAndvari) || G.mode === GameModeNames.Solo && myPlayerID === `1`)
            && hero.name.startsWith(`Dwerg`)) {
            dwerg_brothers +=
                StartHeroScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, heroData.scoringRule);
        }
        else {
            const currentHeroScore = StartHeroScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, heroData.scoringRule);
            heroesScore += currentHeroScore;
            if (isFinal) {
                AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Hero_Card}' '${hero.name}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}': '${currentHeroScore}';`);
            }
        }
    }
    if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
        || G.mode === GameModeNames.SoloAndvari) || (G.mode === GameModeNames.Solo && myPlayerID === `1`))
        && dwerg_brothers) {
        const dwerg_brother_value = dwerg_brothers_scoring[dwerg_brothers];
        if (dwerg_brother_value === undefined) {
            throw new Error(`Не существует количества очков за количество героев братьев Двергов - '${dwerg_brothers}'.`);
        }
        heroesScore += dwerg_brother_value;
        if (isFinal) {
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за героев братьев Двергов (${dwerg_brothers} шт.) ${G.mode === GameModeNames.Solo ? `соло бота` : `игрока '${player.nickname}'`}: '${dwerg_brothers_scoring[dwerg_brothers]}';`);
        }
    }
    totalScore += heroesScore;
    if (isFinal) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Hero_Card}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: ;${heroesScore};'`);
    }
    return totalScore;
};
export const CurrentOrFinalAllMythologicalCreaturesScoring = ({ G, ctx, myPlayerID, ...rest }, isFinal = false) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let totalScore = 0, godsScore = 0, giantsScore = 0, valkyriesScore = 0, mythicalAnimalScore = 0;
    for (let i = 0; i < player.mythologicalCreatureCards.length; i++) {
        const mythologicalCreatureCard = player.mythologicalCreatureCards[i];
        if (mythologicalCreatureCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' в командной зоне отсутствует карта с id '${i}'.`);
        }
        let godCard, giantCard, valkyryCard, currentGiantScore, currentValkyryScore, _exhaustiveCheck;
        switch (mythologicalCreatureCard.type) {
            case RusCardTypeNames.God_Card:
                godCard = godConfig[mythologicalCreatureCard.name];
                godsScore += godCard.points;
                if (isFinal) {
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.God_Card}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${godCard.points}';`);
                }
                break;
            case RusCardTypeNames.Giant_Card:
                giantCard = giantConfig[mythologicalCreatureCard.name];
                currentGiantScore =
                    StartGiantScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, giantCard.scoringRule);
                giantsScore += currentGiantScore;
                if (isFinal) {
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Giant_Card}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentGiantScore}';`);
                }
                break;
            case RusCardTypeNames.Valkyry_Card:
                valkyryCard = valkyryConfig[mythologicalCreatureCard.name];
                if (mythologicalCreatureCard.strengthTokenNotch === null) {
                    throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' у карты типа '${RusCardTypeNames.Valkyry_Card}' с названием '${mythologicalCreatureCard.name}' не может не быть выставлен токен силы.`);
                }
                currentValkyryScore = StartValkyryScoring(valkyryCard.scoringRule, [mythologicalCreatureCard.strengthTokenNotch]);
                valkyriesScore += currentValkyryScore;
                if (isFinal) {
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту типа '${RusCardTypeNames.Valkyry_Card}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentValkyryScore}';`);
                }
                break;
            default:
                _exhaustiveCheck = mythologicalCreatureCard;
                throw new Error(`В массиве карт мифических существ игрока карта не может быть с недопустимым типом.`);
                return _exhaustiveCheck;
        }
    }
    const cards = Object.values(player.cards).flat().filter(IsMythicalAnimalCard);
    for (let m = 0; m < cards.length; m++) {
        const playerMythicalAnimalCard = cards[m];
        if (playerMythicalAnimalCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' отсутствует карта с id '${m}'.`);
        }
        const mythicalAnimalCard = mythicalAnimalConfig[playerMythicalAnimalCard.name], currentMythicalAnimalScore = StartMythicalAnimalScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, mythicalAnimalCard.scoringRule);
        mythicalAnimalScore += currentMythicalAnimalScore;
        if (isFinal) {
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту типа '${RusCardTypeNames.Mythical_Animal_Card}' '${playerMythicalAnimalCard.name}' игрока '${player.nickname}': '${currentMythicalAnimalScore}';`);
        }
    }
    totalScore += godsScore;
    totalScore += giantsScore;
    totalScore += valkyriesScore;
    if (isFinal) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.God_Card}' игрока '${player.nickname}': '${godsScore}';`);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Giant_Card}' игрока '${player.nickname}': '${giantsScore}';`);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Valkyry_Card}' игрока '${player.nickname}': '${valkyriesScore}';`);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Mythical_Animal_Card}' игрока '${player.nickname}': '${mythicalAnimalScore}';`);
    }
    return totalScore;
};
export const CurrentOrFinalAllArtefactScoring = ({ G, ctx, myPlayerID, ...rest }, isFinal = false) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let totalScore = 0, artifactsScore = 0;
    for (let i = 0; i < player.campCards.length; i++) {
        const campCard = player.campCards[i];
        if (campCard === undefined) {
            throw new Error(`В массиве карт лагеря игрока отсутствует карта с id '${i}'.`);
        }
        let currentArtefactScore = 0, _exhaustiveCheck;
        switch (campCard.type) {
            case RusCardTypeNames.Artefact_Card:
                currentArtefactScore = StartArtefactScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, artefactsConfig[campCard.name].scoringRule, isFinal);
                if (currentArtefactScore) {
                    artifactsScore += currentArtefactScore;
                    if (isFinal) {
                        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${RusCardTypeNames.Artefact_Card}' '${campCard.name}' игрока '${player.nickname}': '${currentArtefactScore}';`);
                    }
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
    totalScore += artifactsScore;
    if (isFinal) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${RusCardTypeNames.Artefact_Card}' игрока '${player.nickname}': '${artifactsScore}';`);
    }
    return totalScore;
};
export const FinalAllSuitsScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let totalScore = 0, suitScore = 0, suit;
    for (suit in suitsConfig) {
        suitScore += GetCurrentSuitTotalScore({ G, ctx, myPlayerID, ...rest }, suit);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты '${RusCardTypeNames.Dwarf_Card}' фракции '${RusSuitNames[suit]}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: ${suitScore}`);
        totalScore += suitScore;
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за все карты '${RusCardTypeNames.Dwarf_Card}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: ${totalScore}`);
    return totalScore;
};
export const FinalAllBoardCoinsScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let totalScore = 0;
    for (let i = 0; i < player.boardCoins.length; i++) {
        const boardCoin = player.boardCoins[i];
        if (boardCoin === undefined) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`} с id '${myPlayerID}' на столе отсутствует монета с id '${i}'.`);
        }
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`} с id '${myPlayerID}' на столе не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(boardCoin) && !boardCoin.isOpened) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`} с id '${myPlayerID}' на столе должна быть ранее открыта монета с id '${i}' в конце игры.`);
        }
        if (IsCoin(boardCoin)) {
            totalScore += boardCoin.value;
        }
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за все монеты ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${totalScore}';`);
    return totalScore;
};
export const FinalMinerDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    const totalScore = StartDistinctionAwarding({ G, ctx, myPlayerID: myPlayerID, ...rest }, suitsConfig[SuitNames.miner].distinction.awarding);
    if (totalScore) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за кристалл преимущества по горнякам ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${totalScore}';`);
    }
    return totalScore;
};
export const FinalWarriorDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let totalScore = 0;
    const warriorDistinctions = CheckCurrentSuitDistinctionPlayers({ G, ctx, ...rest }, SuitNames.warrior);
    if (warriorDistinctions.length && warriorDistinctions.includes(Number(myPlayerID))) {
        totalScore += StartDistinctionAwarding({ G, ctx, myPlayerID: myPlayerID, ...rest }, suitsConfig[SuitNames.warrior].distinction.awarding);
        if (totalScore) {
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за преимущество по воинам ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${totalScore}';`);
        }
    }
    return totalScore;
};
const GetCurrentSuitTotalScore = ({ G, ctx, myPlayerID, ...rest }, suit) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    let additionalScoring = false;
    if (G.expansions.Idavoll.active) {
        additionalScoring = CheckPlayerHasBuff({ G, ctx, myPlayerID: myPlayerID, ...rest }, MythicalAnimalBuffNames.RatatoskFinalScoring);
    }
    return StartSuitScoring(suitsConfig[suit].scoringRule, [player.cards[suit], undefined, additionalScoring]);
};
//# sourceMappingURL=ScoringHelpers.js.map