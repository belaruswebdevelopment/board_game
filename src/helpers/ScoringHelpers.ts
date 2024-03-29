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
import { AssertCurrentPlayerCoinsScore, AssertDwergBrothersScoringArrayIndex, AssertMaxCurrentSuitDistinctionPlayersType, AssertMinerDistinctionsScoring, AssertPlayerCoinId, AssertRoyalCoinValue } from "../is_helpers/AssertionTypeHelpers";
import { IsCoin } from "../is_helpers/IsCoinTypeHelpers";
import { IsMythicalAnimalPlayerCard } from "../is_helpers/IsMythologicalCreatureTypeHelpers";
import { AddDataToLog } from "../Logging";
import { CheckCurrentSuitDistinctionPlayers } from "../TroopEvaluation";
import { CardTypeRusNames, ErrorNames, GameModeNames, LogTypeNames, MythicalAnimalBuffNames, PlayerIdForSoloGameNames, SuitNames, SuitRusNames } from "../typescript/enums";
import type { AllCoinsValueType, CampCardType, CanBeUndefType, CurrentPlayerCoinsScoreType, DwergBrothersScoringArray, DwergBrothersScoringType, GiantData, GodData, HeroCard, HeroCardData, MaxCurrentSuitDistinctionPlayersArray, MaxCurrentSuitDistinctionPlayersType, MinerDistinctionsScoringType, MyFnContextWithMyPlayerID, MythicalAnimalData, MythicalAnimalPlayerCard, MythologicalCreatureCommandZoneCardType, PublicPlayer, PublicPlayerCoinType, RoyalCoinValueType, ValkyryData } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { GetMinerDistinctionsScore } from "./DistinctionAwardingHelpers";

export const CurrentAllSuitsScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): number => {
    let totalScore = 0,
        suit: SuitNames;
    for (suit in suitsConfig) {
        totalScore += GetCurrentSuitTotalScore({ G, ctx, myPlayerID, ...rest }, suit);
    }
    return totalScore;
};

export const CurrentPotentialMinerDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    MinerDistinctionsScoringType => GetMinerDistinctionsScore({ G, ctx, myPlayerID, ...rest });

export const CurrentPotentialWarriorDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    number => {
    // TODO Have same logic as FinalWarriorDistinctionsScoring
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let totalScore = 0;
    const warriorDistinctions: MaxCurrentSuitDistinctionPlayersArray =
        CheckCurrentSuitDistinctionPlayers({ G, ctx, ...rest }, SuitNames.warrior),
        currentPlayerId = Number(myPlayerID);
    AssertMaxCurrentSuitDistinctionPlayersType(currentPlayerId);
    if (warriorDistinctions.some((playerId: MaxCurrentSuitDistinctionPlayersType) =>
        playerId === currentPlayerId)) {
        totalScore += player.currentMaxCoinValue;
    }
    return totalScore;
};

export const CurrentOrFinalAllHeroesScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    isFinal = false): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let totalScore = 0,
        heroesScore = 0,
        dwergBrothersNum = 0;
    const dwerg_brothers_scoring: DwergBrothersScoringArray = [0, 13, 40, 81, 108, 135];
    for (let i = 0; i < player.heroes.length; i++) {
        const hero: CanBeUndefType<HeroCard> = player.heroes[i];
        if (hero === undefined) {
            throw new Error(`Не существует карта героя с id '${i}'.`);
        }
        const heroData: HeroCardData = heroesConfig[hero.name];
        if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
            || G.mode === GameModeNames.SoloAndvari) || G.mode === GameModeNames.Solo
            && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)
            && hero.name.startsWith(`Dwerg`)) {
            dwergBrothersNum +=
                StartHeroScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, heroData.scoringRule);
        } else {
            const currentHeroScore: number =
                StartHeroScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, heroData.scoringRule);
            heroesScore += currentHeroScore;
            if (isFinal) {
                AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${CardTypeRusNames.HeroCard}' '${hero.name}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`}': '${currentHeroScore}';`);
            }

        }
    }
    AssertDwergBrothersScoringArrayIndex(dwergBrothersNum);
    if (((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
        || G.mode === GameModeNames.SoloAndvari) || (G.mode === GameModeNames.Solo &&
            myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId)) && dwergBrothersNum) {
        const dwerg_brother_value: DwergBrothersScoringType = dwerg_brothers_scoring[dwergBrothersNum];
        heroesScore += dwerg_brother_value;
        if (isFinal) {
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за героев братьев Двергов (${dwergBrothersNum} шт.) ${G.mode === GameModeNames.Solo ? `соло бота` : `игрока '${player.nickname}'`}: '${dwerg_brothers_scoring[dwergBrothersNum]}';`);
        }
    }
    totalScore += heroesScore;
    if (isFinal) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${CardTypeRusNames.HeroCard}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`}: ;${heroesScore};'`);
    }
    return totalScore;
};

export const CurrentOrFinalAllMythologicalCreaturesScoring = ({ G, ctx, myPlayerID, ...rest }:
    MyFnContextWithMyPlayerID, isFinal = false): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let totalScore = 0,
        godsScore = 0,
        giantsScore = 0,
        valkyriesScore = 0,
        mythicalAnimalScore = 0;
    for (let i = 0; i < player.mythologicalCreatureCards.length; i++) {
        const mythologicalCreatureCard: CanBeUndefType<MythologicalCreatureCommandZoneCardType> =
            player.mythologicalCreatureCards[i];
        if (mythologicalCreatureCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' в командной зоне отсутствует карта с id '${i}'.`);
        }
        let godCard: CanBeUndefType<GodData>,
            giantCard: CanBeUndefType<GiantData>,
            valkyryCard: CanBeUndefType<ValkyryData>,
            currentGiantScore: number,
            currentValkyryScore: number,
            _exhaustiveCheck: never;
        switch (mythologicalCreatureCard.type) {
            case CardTypeRusNames.GodCard:
                godCard = godConfig[mythologicalCreatureCard.name];
                godsScore += godCard.points;
                if (isFinal) {
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${CardTypeRusNames.GodCard}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${godCard.points}';`);
                }
                break;
            case CardTypeRusNames.GiantCard:
                giantCard = giantConfig[mythologicalCreatureCard.name];
                currentGiantScore =
                    StartGiantScoring({ G, ctx, myPlayerID: myPlayerID, ...rest }, giantCard.scoringRule);
                giantsScore += currentGiantScore;
                if (isFinal) {
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${CardTypeRusNames.GiantCard}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentGiantScore}';`);
                }
                break;
            case CardTypeRusNames.ValkyryCard:
                valkyryCard = valkyryConfig[mythologicalCreatureCard.name];
                if (mythologicalCreatureCard.strengthTokenNotch === null) {
                    throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' у карты типа '${CardTypeRusNames.ValkyryCard}' с названием '${mythologicalCreatureCard.name}' не может не быть выставлен токен силы.`);
                }
                currentValkyryScore = StartValkyryScoring(valkyryCard.scoringRule,
                    [mythologicalCreatureCard.strengthTokenNotch]);
                valkyriesScore += currentValkyryScore;
                if (isFinal) {
                    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту типа '${CardTypeRusNames.ValkyryCard}' '${mythologicalCreatureCard.name}' игрока '${player.nickname}': '${currentValkyryScore}';`);
                }
                break;
            default:
                _exhaustiveCheck = mythologicalCreatureCard;
                throw new Error(`В массиве карт мифических существ игрока карта не может быть с недопустимым типом.`);
                return _exhaustiveCheck;
        }
    }
    const cards: MythicalAnimalPlayerCard[] =
        Object.values(player.cards).flat().filter(IsMythicalAnimalPlayerCard);
    for (let m = 0; m < cards.length; m++) {
        const playerMythicalAnimalCard: CanBeUndefType<MythicalAnimalPlayerCard> = cards[m];
        if (playerMythicalAnimalCard === undefined) {
            throw new Error(`В массиве карт мифических существ игрока с id '${myPlayerID}' отсутствует карта с id '${m}'.`);
        }
        const mythicalAnimalCard: MythicalAnimalData = mythicalAnimalConfig[playerMythicalAnimalCard.name],
            currentMythicalAnimalScore: number =
                StartMythicalAnimalScoring({ G, ctx, myPlayerID: myPlayerID, ...rest },
                    mythicalAnimalCard.scoringRule);
        mythicalAnimalScore += currentMythicalAnimalScore;
        if (isFinal) {
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту типа '${CardTypeRusNames.MythicalAnimalCard}' '${playerMythicalAnimalCard.name}' игрока '${player.nickname}': '${currentMythicalAnimalScore}';`);
        }
    }
    totalScore += godsScore + giantsScore + valkyriesScore;
    if (isFinal) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${CardTypeRusNames.GodCard}' игрока '${player.nickname}': '${godsScore}';`);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${CardTypeRusNames.GiantCard}' игрока '${player.nickname}': '${giantsScore}';`);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${CardTypeRusNames.ValkyryCard}' игрока '${player.nickname}': '${valkyriesScore}';`);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${CardTypeRusNames.MythicalAnimalCard}' игрока '${player.nickname}': '${mythicalAnimalScore}';`);
    }
    return totalScore;
};

export const CurrentOrFinalAllArtefactScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID,
    isFinal = false): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let totalScore = 0,
        artifactsScore = 0;
    for (let i = 0; i < player.campCards.length; i++) {
        const campCard: CanBeUndefType<CampCardType> = player.campCards[i];
        if (campCard === undefined) {
            throw new Error(`В массиве карт лагеря игрока отсутствует карта с id '${i}'.`);
        }
        let currentArtefactScore = 0,
            _exhaustiveCheck: never;
        switch (campCard.type) {
            case CardTypeRusNames.ArtefactCard:
                currentArtefactScore = StartArtefactScoring({ G, ctx, myPlayerID: myPlayerID, ...rest },
                    artefactsConfig[campCard.name].scoringRule, isFinal);
                if (currentArtefactScore) {
                    artifactsScore += currentArtefactScore;
                    if (isFinal) {
                        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Private, `Очки за карту '${CardTypeRusNames.ArtefactCard}' '${campCard.name}' игрока '${player.nickname}': '${currentArtefactScore}';`);
                    }
                }
                break;
            case CardTypeRusNames.MercenaryCard:
                // TODO How potentially score not final mercenary card in command zone...!?
                if (isFinal) {
                    throw new Error(`В командной зоне карт лагеря игрока не может в конце игры быть карта c типом '${CardTypeRusNames.MercenaryCard}' с id '${i}'.`);
                }
                break;
            default:
                _exhaustiveCheck = campCard;
                throw new Error(`В командной зоне карт лагеря игрока не может быть карта запрещённого типа с id '${i}'.`);
                return _exhaustiveCheck;
        }
    }
    totalScore += artifactsScore;
    if (isFinal) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты типа '${CardTypeRusNames.ArtefactCard}' игрока '${player.nickname}': '${artifactsScore}';`);
    }
    return totalScore;
};

export const FinalAllSuitsScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let totalScore = 0,
        suitScore = 0,
        suit: SuitNames;
    for (suit in suitsConfig) {
        suitScore += GetCurrentSuitTotalScore({ G, ctx, myPlayerID, ...rest }, suit);
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за карты '${CardTypeRusNames.DwarfCard}' фракции '${SuitRusNames[suit]}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`}: ${suitScore}`);
        totalScore += suitScore;
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за все карты '${CardTypeRusNames.DwarfCard}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`}: ${totalScore}`);
    return totalScore;
};

export const FinalAllBoardCoinsScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    CurrentPlayerCoinsScoreType => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let totalScore = 0;
    for (let i = 0; i < player.boardCoins.length; i++) {
        AssertPlayerCoinId(i);
        const boardCoin: PublicPlayerCoinType = player.boardCoins[i];
        if (boardCoin !== null && !IsCoin(boardCoin)) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`} с id '${myPlayerID}' на столе не может не быть монеты с id '${i}'.`);
        }
        if (IsCoin(boardCoin) && !boardCoin.isOpened) {
            throw new Error(`В массиве монет ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`} с id '${myPlayerID}' на столе должна быть ранее открыта монета с id '${i}' в конце игры.`);
        }
        if (IsCoin(boardCoin)) {
            totalScore += boardCoin.value;
        }
    }
    AssertCurrentPlayerCoinsScore(totalScore);
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за все монеты ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`}: '${totalScore}';`);
    return totalScore;
};

export const FinalMinerDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    MinerDistinctionsScoringType => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    const totalScore: AllCoinsValueType = StartDistinctionAwarding({ G, ctx, myPlayerID: myPlayerID, ...rest },
        suitsConfig[SuitNames.miner].distinction.awarding);
    if (totalScore) {
        AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за кристалл преимущества по фракции '${SuitRusNames.miner}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`}: '${totalScore}';`);
    }
    AssertMinerDistinctionsScoring(totalScore);
    return totalScore;
};

export const FinalWarriorDistinctionsScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID):
    RoyalCoinValueType => {
    // TODO Have same logic as CurrentPotentialWarriorDistinctionsScoring
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let totalScore: AllCoinsValueType = 0;
    const warriorDistinctions: MaxCurrentSuitDistinctionPlayersArray =
        CheckCurrentSuitDistinctionPlayers({ G, ctx, ...rest }, SuitNames.warrior, true),
        currentPlayerId = Number(myPlayerID);
    AssertMaxCurrentSuitDistinctionPlayersType(currentPlayerId);
    if (warriorDistinctions.some((playerId: MaxCurrentSuitDistinctionPlayersType) =>
        playerId === currentPlayerId)) {
        totalScore += StartDistinctionAwarding({ G, ctx, myPlayerID: myPlayerID, ...rest },
            suitsConfig[SuitNames.warrior].distinction.awarding);
        if (totalScore) {
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Очки за преимущество по фракции '${SuitRusNames.warrior}' ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === PlayerIdForSoloGameNames.SoloBotPlayerId ? `соло бота` : `игрока '${player.nickname}'`}: '${totalScore}';`);
        }
    }
    AssertRoyalCoinValue(totalScore);
    return totalScore;
};

const GetCurrentSuitTotalScore = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID, suit: SuitNames):
    number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    let additionalScoring = false;
    if (G.expansions.Idavoll.active) {
        additionalScoring = CheckPlayerHasBuff({ G, ctx, myPlayerID: myPlayerID, ...rest },
            MythicalAnimalBuffNames.RatatoskFinalScoring);
    }
    return StartSuitScoring(suitsConfig[suit].scoringRule,
        [player.cards[suit], undefined, additionalScoring]);
};
