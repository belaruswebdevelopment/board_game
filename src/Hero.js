export const CheckPickHero = (G, ctx) => {
    return Math.min(...G.players[ctx.currentPlayer].cards.map(item => item.length)) > G.players[ctx.currentPlayer].heroes.length
};
