import { AssertPlayerId } from "../is_helpers/AssertionTypeHelpers";
import { GameModeNames, HeroBuffNames, PhaseNames } from "../typescript/enums";
import { FnContext } from "../typescript/interfaces";
import { CheckPlayerHasBuff } from "./BuffHelpers";

/**
* <h3>Проверяет базовый порядок хода игроков.</h3>
* <p>Применения:</p>
* <ol>
* <li>Происходит при необходимости выставления монет на игровое поле.</li>
* <li>Происходит при необходимости выставления монет на игровое поле при наличии героя Улина.</li>
* </ol>
*
* @param context
* @returns
*/
export const CheckPlayersBasicOrder = ({ G, ctx, ...rest }: FnContext): void => {
    G.publicPlayersOrder = [];
    for (let i = 0; i < ctx.numPlayers; i++) {
        if (ctx.phase !== PhaseNames.BidUline) {
            if (G.mode === GameModeNames.Solo || G.mode === GameModeNames.SoloAndvari
                || ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                    && !CheckPlayerHasBuff({ G, ctx, myPlayerID: String(i), ...rest },
                        HeroBuffNames.EveryTurn))) {
                const playerId = String(i);
                AssertPlayerId(playerId);
                G.publicPlayersOrder.push(playerId);
            }
        } else {
            if ((G.mode === GameModeNames.Basic || G.mode === GameModeNames.Multiplayer)
                && CheckPlayerHasBuff({ G, ctx, myPlayerID: String(i), ...rest },
                    HeroBuffNames.EveryTurn)) {
                const playerId = String(i);
                AssertPlayerId(playerId);
                G.publicPlayersOrder.push(playerId);
            }
        }
    }
};
