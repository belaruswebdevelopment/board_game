import {CreatePlayer} from "./Player";
import {BuildCards} from "./Card";
import {suitsConfigArray} from "./SuitData";

export const SetupGame = (ctx) => {
    const colors = [
        {background: "Violet"},
        {background: "MediumSeaGreen"},
        {background: "Khaki"},
        {background: "Tomato"},
        {background: "DodgerBlue"},
    ];
    let decks = [];
    const tierToEnd = 2;
    for (let i = 0; i < tierToEnd; i++) {
        decks[i] = BuildCards(suitsConfigArray, {players: ctx.numPlayers, tier: i});
        console.log('Cards:' + decks[i])
        decks[i] = ctx.random.Shuffle(decks[i]);
    }
    let taverns = [];
    const tavernsNum = 3;
    const drawSize = ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = decks[0].splice(0, drawSize);
    }
    let players = [];
    const suitsNum = 5;
    for (let i = 0; i < ctx.numPlayers; i++) {
        players[i] = CreatePlayer();
        for (let j = 0; j < suitsNum; j++) {
            players[i].cards[j] = [];
        }
    }

    return {
        tierToEnd,
        tavernsNum,
        suitsNum,
        drawSize,
        colors,
        decks,
        taverns,
        players,
    };
}