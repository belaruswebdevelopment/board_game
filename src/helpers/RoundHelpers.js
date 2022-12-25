export const IsLastRound = ({ G, ctx }) => ctx.numPlayers < 4 ? ((G.round === 3 + Number(G.expansions.Idavoll.active)
    || G.round === 6 + Number(G.expansions.Idavoll.active)) ? true : false)
    : ((G.round === 2 + Number(G.expansions.Idavoll.active))
        || G.round === 5 + Number(G.expansions.Idavoll.active)) ? true : false;
//# sourceMappingURL=RoundHelpers.js.map