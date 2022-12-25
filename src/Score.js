import { ThrowMyError } from "./Error";
import { CheckPlayerHasBuff } from "./helpers/BuffHelpers";
import { OpenClosedCoinsOnPlayerBoard, ReturnCoinsFromPlayerHandsToPlayerBoard } from "./helpers/CoinHelpers";
import { CurrentAllSuitsScoring, CurrentOrFinalAllArtefactScoring, CurrentOrFinalAllHeroesScoring, CurrentOrFinalAllMythologicalCreaturesScoring, CurrentPotentialMinerDistinctionsScoring, CurrentPotentialWarriorDistinctionsScoring, FinalAllBoardCoinsScoring, FinalAllSuitsScoring, FinalMinerDistinctionsScoring, FinalWarriorDistinctionsScoring } from "./helpers/ScoringHelpers";
import { AddDataToLog } from "./Logging";
import { ErrorNames, GameModeNames, HeroBuffNames, LogTypeNames } from "./typescript/enums";
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
export const AllCurrentScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    let totalScore = 0;
    totalScore += CurrentAllSuitsScoring({ G, ctx, myPlayerID, ...rest });
    // TODO Add score for all board and hand coins!!!
    totalScore += CurrentPotentialWarriorDistinctionsScoring({ G, ctx, myPlayerID, ...rest });
    totalScore += CurrentPotentialMinerDistinctionsScoring({ G, ctx, myPlayerID, ...rest });
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
const FinalScoring = ({ G, ctx, myPlayerID, ...rest }) => {
    const player = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, myPlayerID);
    }
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Результаты игры ${(G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari) && myPlayerID === `1` ? `соло бота` : `игрока '${player.nickname}'`}:`);
    let totalScore = 0;
    totalScore += FinalAllSuitsScoring({ G, ctx, myPlayerID, ...rest });
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
export const ScoreWinner = ({ G, ctx, ...rest }) => {
    Object.values(G.publicPlayers).forEach((player, index) => {
        if ((G.mode === GameModeNames.Solo && ctx.currentPlayer === `1`)
            || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `1`)
            || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer
                || (G.mode === GameModeNames.SoloAndvari && ctx.currentPlayer === `0`))
                && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest }, HeroBuffNames.EveryTurn))) {
            ReturnCoinsFromPlayerHandsToPlayerBoard({ G, ctx, myPlayerID: String(index), ...rest });
        }
        OpenClosedCoinsOnPlayerBoard({ G, ctx, myPlayerID: String(index), ...rest });
    });
    G.drawProfit = null;
    AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Финальные результаты игры:`);
    for (let i = 0; i < ctx.numPlayers; i++) {
        G.totalScore.push(FinalScoring({ G, ctx, myPlayerID: String(i), ...rest }));
    }
    const maxScore = Math.max(...G.totalScore), maxPlayers = G.totalScore.filter((score) => score === maxScore).length;
    let winners = 0;
    for (let i = 0; i < ctx.numPlayers; i++) {
        const player = G.publicPlayers[i];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined, i);
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
//# sourceMappingURL=Score.js.map