export const tavernsConfig = {
    0: {
        name: "«Весёлый гоблин»",
        style: "url(/img/taverns/Taverns.png) no-repeat -2px -4px / 74px 42px",
    },
    1: {
        name: "«Парящий дракон»",
        style: "url(/img/taverns/Taverns.png) no-repeat -25px -17px / 74px 42px",
    },
    2: {
        name: "«Гарцующий конь»",
        style: "url(/img/taverns/Taverns.png) no-repeat -49px -9px / 74px 42px",
    },
};

export const CheckEmptyLastTavern = (G, ctx) => {
    if (G.taverns[G.tavernsNum - 1].every((element) => element === null)) {
        if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
            G.tierToEnd--;
            if (!G.decks[G.decks.length - 1].length) {
                ctx.events.endGame();
                return;
            }
            ctx.events.setPhase('getDistinctions');
        }
        for (let i = 0; i < G.tavernsNum; i++) {
            G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        }
        ctx.events.setPhase('placeCoins');
    }
}

export const CheckCurrentTavernEmpty = (G, ctx, tavernId) => {
    if (G.taverns[tavernId].every((element) => element === null)) {
        ctx.events.setPhase('pickCards');
    }
}
