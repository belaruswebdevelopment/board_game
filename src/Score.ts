import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { OpenClosedCoinsOnPlayerBoard, ReturnCoinsFromPlayerHandsToPlayerBoard } from "./helpers/CoinHelpers";
import { CurrentAllSuitsScoring, CurrentOrFinalAllArtefactScoring, CurrentOrFinalAllHeroesScoring, CurrentOrFinalAllMythologicalCreaturesScoring, CurrentPotentialMinerDistinctionsScoring, CurrentPotentialWarriorDistinctionsScoring, FinalAllBoardCoinsScoring, FinalAllSuitsScoring, FinalMinerDistinctionsScoring, FinalWarriorDistinctionsScoring } from "./helpers/ScoringHelpers";
import { AddDataToLog } from "./Logging";
import { ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames } from "./typescript/enums";
import type { CanBeUndefType, CanBeVoidType, FnContext, MyFnContextWithMyPlayerID, MyGameState, PublicPlayer } from "./typescript/interfaces";

/**
 * <h3>Подсчитывает суммарное количество текущих очков выбранного игрока за карты в колонках фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Подсчёт и вывод на игровое поле текущее количество очков каждого игрока.</li>
 * <li>Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.</li>
 * <li>Подсчёт очков игроков для анализа ботами.</li>
 * </ol>
 *
 * @param context
 * @param player Игрок.
 * @returns Текущий счёт указанного игрока.
 */
export const AllCurrentScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): number => {
    let totalScore: number = CurrentAllSuitsScoring({ G, ctx, myPlayerID, ...rest });
    // TODO Add score for all board and hand coins!!!
    totalScore += CurrentPotentialWarriorDistinctionsScoring({ G, ctx, myPlayerID, ...rest });
    totalScore += CurrentPotentialMinerDistinctionsScoring({ G, ctx, myPlayerID, ...rest });
    // TODO Think about heros in players hands which can be deleted in end game scoring both suit and heroes!?
    totalScore += CurrentOrFinalAllHeroesScoring({ G, ctx, myPlayerID, ...rest });
    if (G.expansions.Thingvellir.active) {
        totalScore += CurrentOrFinalAllArtefactScoring({ G, ctx, myPlayerID, ...rest });
    }
    if (G.expansions.Idavoll.active) {
        totalScore += CurrentOrFinalAllMythologicalCreaturesScoring({ G, ctx, myPlayerID, ...rest });
    }
    return totalScore;
};

/**
 * <h3>Подсчитывает финальное количество очков выбранного игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Подсчёт и вывод на игровое поле финальное количество очков каждого игрока.</li>
 * </ol>
 *
 * @param context
 * @returns Финальный счёт указанного игрока.
 */
const FinalScoring = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): number => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Результаты игры ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}:`);
    let totalScore: number = FinalAllSuitsScoring({ G, ctx, myPlayerID, ...rest });
    totalScore += FinalAllBoardCoinsScoring({ G, ctx, myPlayerID, ...rest });
    totalScore += FinalWarriorDistinctionsScoring({ G, ctx, myPlayerID, ...rest });
    totalScore += FinalMinerDistinctionsScoring({ G, ctx, myPlayerID, ...rest });
    totalScore += CurrentOrFinalAllHeroesScoring({ G, ctx, myPlayerID, ...rest }, true);
    if (G.expansions.Thingvellir.active) {
        totalScore += CurrentOrFinalAllArtefactScoring({ G, ctx, myPlayerID, ...rest }, true);
    }
    if (G.expansions.Idavoll.active) {
        totalScore += CurrentOrFinalAllMythologicalCreaturesScoring({ G, ctx, myPlayerID, ...rest }, true);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Public, `Итоговый счёт ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}: '${totalScore}'.`);
    return totalScore;
};

/**
 * <h3>Подсчитывает финальные очки для определения победителя.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конце игры для определения победителя для вывода данных на игровое поле.</li>
 * </ol>
 *
 * @param context
 * @returns Финальные данные о победителях, если закончилась игра.
 */
export const ScoreWinner = ({ G, ctx, ...rest }: FnContext): CanBeVoidType<MyGameState> => {
    Object.values(G.publicPlayers).forEach((player: PublicPlayer, index: number): void => {
        if ((G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`)
            || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`)
            || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
                || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `0`))
                && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest },
                    HeroBuffNames.EveryTurn))) {
            ReturnCoinsFromPlayerHandsToPlayerBoard({ G, ctx, myPlayerID: String(index), ...rest });
        }
        OpenClosedCoinsOnPlayerBoard({ G, ctx, myPlayerID: String(index), ...rest });
    });
    G.drawProfit = null;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Финальные результаты игры:`);
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring({ G, ctx, myPlayerID: String(i), ...rest }));
    }
    const maxScore: number = Math.max(...G.totalScore),
        maxPlayers: number = G.totalScore.filter((score: number): boolean => score === maxScore).length;
    let winners = 0;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[i];
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
