const CreatePriority = ({value, isExchangeable = true} = {}) => ({
    value,
    isExchangeable,
});

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
];

const prioritiesConfig = {
    2: [priorities[3], priorities[4]],
    3: [priorities[2], priorities[3], priorities[4]],
    4: [priorities[1], priorities[2], priorities[3], priorities[4]],
    5: [priorities[0], priorities[1], priorities[2], priorities[3], priorities[4]],
};

export const BuildPriorities = (data, priority = undefined) => {
    if (Array.isArray(data)) {
        const priorities = prioritiesConfig[data.length].map(priority => priority);
        for (let i = 0; i < data.length; i++) {
            const index = Math.floor(Math.random() * priorities.length);
            const p = priorities.splice(index, 1)[0];
            data[i].priority = CreatePriority(p);
        }
    } else {
        data.priority = CreatePriority(priority);
    }
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

export const HasLowestPriority = (players, playerId) => {
    const tempPriorities = players.map(player => player.priority.value),
        minPriority = Math.min(...tempPriorities);
    return players[playerId].priority.value === minPriority;
};
