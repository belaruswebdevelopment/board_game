import {CreatePlayer} from "./Player";

export const SetupGame = (ctx) => {
    /*
    * 0 - фиолетовые арифметическая
    * 1 - зелёный квадраты
    * 2 - жёлтый горняки
    * 3 - красные воины
    * 4 - голубые разведы
    */
    const colors = [
        {background: "Violet"},
        {background: "MediumSeaGreen"},
        {background: "Khaki"},
        {background: "Tomato"},
        {background: "DodgerBlue"},
    ];
    let deck = [
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 0, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 1, rank: 'X'},
        {suit: 2, rank: 1},
        {suit: 2, rank: 1},
        {suit: 2, rank: 1},
        {suit: 2, rank: 1},
        {suit: 2, rank: 2},
        {suit: 2, rank: 2},
        {suit: 3, rank: 2},
        {suit: 3, rank: 2},
        {suit: 3, rank: 3},
        {suit: 3, rank: 4},
        {suit: 3, rank: 5},
        {suit: 3, rank: 5},
        {suit: 4, rank: 4},
        {suit: 4, rank: 5},
        {suit: 4, rank: 6},
        {suit: 4, rank: 6},
        {suit: 4, rank: 7},
    ];

    const tierToEnd = 2;
    let taverns = [];
    const tavernsNum = 3;
    const suitsNum = 5;
    /*const CreateCard = (card) => {

    }
    const FillDeck = (deckConfig) => {
        const gameDeck = [];
        for (let i = 0; i < deckConfig.length; i++) {
            let count = deckConfig[i].ranks.length ? deckConfig[i].ranks.length : ranks;
            for (let j = 0; j < count; j++) {
                let tempCard = CreateCard(deckConfig[i].suit);
                if (typeof deckConfig[i].ranks === "object") {
                    tempCard.rank = deckConfig[i].ranks[j];
                }
                gameDeck.push(tempCard);
            }
        }
        return gameDeck;
    };*/
    deck = ctx.random.Shuffle(deck);
    const drawSize = ctx.numPlayers;
    for (let i = 0; i < tavernsNum; i++) {
        taverns[i] = deck.splice(0, drawSize);
    }
    let players = [];
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
        deck,
        taverns,
        players,
    };
}