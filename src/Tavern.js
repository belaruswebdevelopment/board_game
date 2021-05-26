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
    const isLastTavernEmpty = G.taverns[G.tavernsNum - 1].every((element) => element === null);
    if (isLastTavernEmpty) {
        if (G.decks[G.decks.length - G.tierToEnd].length === 0) {
            G.tierToEnd--;
            ctx.events.setPhase('getDistinctions');
            if (G.tierToEnd === 0) {
                return;
            }
        }
        for (let i = 0; i < G.tavernsNum; i++) {
            G.taverns[i] = G.decks[G.decks.length - G.tierToEnd].splice(0, G.drawSize);
        }
        ctx.events.setPhase('placeCoins');
    }
}

export const CheckCurrentTavernEmpty = (G, ctx, tavernId) => {
    const isCurrentTavernEmpty = G.taverns[tavernId].every((element) => element === null);
    if (isCurrentTavernEmpty) {
        ctx.events.setPhase('pickCards');
    }
}

export const GetCurrentTavernNumber = (G) => {
    let tavernId = null;
    for (let i = 0; i < G.tavernsNum; i++) {
        if (G.taverns[i].some(element => element === null) && G.taverns[i].some(element => element !== null)) {
            tavernId = i;
            break;
        } else if ((i !== G.tavernsNum - 1) && G.taverns[i].every(element => element === null) && G.taverns[i + 1].every(element => element !== null)) {
            tavernId = i;
            break;
        } else if (i === G.tavernsNum - 1) {
            tavernId = i;
        }
    }
    return tavernId;
}
