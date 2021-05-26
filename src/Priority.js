export const CreatePriority = ({value, isExchangeable = true} = {}) => ({
    value,
    isExchangeable,
});

const priorities = [
    CreatePriority({value: 1}),
    CreatePriority({value: 2}),
    CreatePriority({value: 3}),
    CreatePriority({value: 4}),
    CreatePriority({value: 5}),
];

const prioritiesConfig = {
    2: priorities.slice(-2),
    3: priorities.slice(-3),
    4: priorities.slice(-4),
    5: priorities.slice(-5),
};

export const BuildPriorities = (players) => {
    const priorities = prioritiesConfig[players.length].map(priority => priority);
    for (let i = 0; i < players.length; i++) {
        const index = Math.floor(Math.random() * priorities.length),
            priority = priorities.splice(index, 1)[0];
        players[i].priority = CreatePriority(priority);
    }
};

export const ChangePlayersPriorities = (G) => {
    const tempPriorities = [];
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
