const priorities = [
    {
        value: 1,
        isExchangeable: true,
    },
    {
        value: 2,
        isExchangeable: true,
    },
    {
        value: 3,
        isExchangeable: true,
    },
    {
        value: 4,
        isExchangeable: true,
    },
    {
        value: 5,
        isExchangeable: true,
    },
    {
        value: 6,
        isExchangeable: false,
    },
];

const prioritiesConfig = {
    2: [priorities[3], priorities[4]],
    3: [priorities[2], priorities[3], priorities[4]],
    4: [priorities[1], priorities[2], priorities[3], priorities[4]],
    5: [priorities[0], priorities[1], priorities[2], priorities[3], priorities[4]],
};

export const AddPriorityToPlayer = (playersNum) => {
    return prioritiesConfig[playersNum].splice(Math.floor(Math.random() * prioritiesConfig[playersNum].length), 1)[0];
};

export const ChangePlayersPriorities = (G) => {
    const tempPriorities = []
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        tempPriorities[i] = G.players[G.exchangeOrder[i]].priority;
    }
    for (let i = 0; i < G.exchangeOrder.length; i++) {
        G.players[i].priority = tempPriorities[i];
    }
};
