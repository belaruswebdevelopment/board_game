import type { FnContext } from "../typescript/interfaces";

export const IsLastRound = ({ G, ctx }: FnContext): boolean =>
    ctx.numPlayers < 4 ? ((G.round === 3 + Number(G.expansions.Idavoll.active)
        || G.round === 6 + Number(G.expansions.Idavoll.active)) ? true : false)
        : ((G.round === 2 + Number(G.expansions.Idavoll.active))
            || G.round === 5 + Number(G.expansions.Idavoll.active)) ? true : false;
