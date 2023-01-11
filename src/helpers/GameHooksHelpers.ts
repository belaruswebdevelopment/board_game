import { ThrowMyError } from "../Error";
import { AddDataToLog } from "../Logging";
import { ErrorNames, HeroBuffNames, HeroNames, LogTypeNames } from "../typescript/enums";
import type { CanBeUndefType, CanBeVoidType, FnContext, MyFnContextWithMyPlayerID, PlayerBoardCardType, PublicPlayer } from "../typescript/interfaces";
import { DrawCurrentProfit } from "./ActionHelpers";
import { CheckPlayerHasBuff } from "./BuffHelpers";
import { RemoveCardFromPlayerBoardSuitCards } from "./DiscardCardHelpers";
import { CheckPickHero } from "./HeroHelpers";

/**
 * <h3>Проверяет необходимость завершения хода в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При проверке завершения любой фазы.</li>
 * </ol>
 *
 * @param context
 * @returns Должна ли быть завершена фаза.
 */
export const EndTurnActions = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): CanBeVoidType<true> => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (!player.stack.length) {
        return true;
    }
};

/**
 * <h3>Удаляет Труд в конце игры с поля игрока.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит в конце матча после всех игровых событий.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const RemoveThrudFromPlayerBoardAfterGameEnd = ({ G, ctx, ...rest }: FnContext): void => {
    const thrudPlayerIndex: number =
        Object.values(G.publicPlayers).findIndex((player: PublicPlayer, index: number): boolean =>
            CheckPlayerHasBuff({ G, ctx, myPlayerID: String(index), ...rest },
                HeroBuffNames.MoveThrud));
    if (thrudPlayerIndex !== -1) {
        const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[thrudPlayerIndex];
        if (player === undefined) {
            return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
                thrudPlayerIndex);
        }
        const playerCards: PlayerBoardCardType[] = Object.values(player.cards).flat(),
            thrud: CanBeUndefType<PlayerBoardCardType> =
                playerCards.find((card: PlayerBoardCardType): boolean => card.name === HeroNames.Thrud);
        if (thrud !== undefined && thrud.suit !== null) {
            const thrudIndex: number =
                player.cards[thrud.suit].findIndex((card: PlayerBoardCardType): boolean =>
                    card.name === HeroNames.Thrud);
            if (thrudIndex === -1) {
                throw new Error(`У игрока с id '${thrudPlayerIndex}' отсутствует обязательная карта героя '${HeroNames.Thrud}'.`);
            }
            RemoveCardFromPlayerBoardSuitCards({ G, ctx, myPlayerID: String(thrudPlayerIndex), ...rest },
                thrud.suit, thrudIndex);
            AddDataToLog({ G, ctx, ...rest }, LogTypeNames.Game, `Герой '${HeroNames.Thrud}' игрока '${player.nickname}' уходит с игрового поля.`);
        }
    }
};

/**
 * <h3>Действия старта или завершения действий при завершении мува в любой фазе.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При завершении мува в любой фазе.</li>
 * </ol>
 *
 * @param context
 * @returns
 */
export const StartOrEndActions = ({ G, ctx, myPlayerID, ...rest }: MyFnContextWithMyPlayerID): void => {
    const player: CanBeUndefType<PublicPlayer> = G.publicPlayers[Number(myPlayerID)];
    if (player === undefined) {
        return ThrowMyError({ G, ctx, ...rest }, ErrorNames.PublicPlayerWithCurrentIdIsUndefined,
            myPlayerID);
    }
    if (ctx.activePlayers === null || ctx.activePlayers?.[Number(myPlayerID)] !== undefined) {
        player.stack.shift();
        if ((player.stack[0]?.priority === undefined)
            || (player.stack[0]?.priority !== undefined && player.stack[0]?.priority > 1)) {
            CheckPickHero({ G, ctx, myPlayerID, ...rest });
        }
        DrawCurrentProfit({ G, ctx, myPlayerID, ...rest });
    }
};
