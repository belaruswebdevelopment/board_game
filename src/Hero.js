import {TotalRank} from "./Score";

export const CheckPickHero = (G, ctx) => {
    return Math.min(...G.players[ctx.currentPlayer].cards.map(item => item.reduce(TotalRank, 0))) > G.players[ctx.currentPlayer].heroes.length;
};
