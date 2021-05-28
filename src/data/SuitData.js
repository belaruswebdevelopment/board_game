import {CreateCoin} from "../Coin";
import {CreateCard} from "../Card";
import {ArithmeticSum, TotalPoints, TotalRank} from "../Score";
import {CreatePriority} from "../Priority";

const blacksmithSuit = {
    suit: 0,
    suitName: 'Blacksmith',
    suitColor: 'bg-purple-600',
    description: "Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).",
    ranksValues: () => {
        return {
            2: {
                0: 8,
                1: 8,
            },
            3: {
                0: 8,
                1: 8,
            },
            4: {
                0: 8,
                1: 8,
            },
            5: {
                0: 10,
                1: 10,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: 8,
                1: 8,
            },
            3: {
                0: 8,
                1: 8,
            },
            4: {
                0: 8,
                1: 8,
            },
            5: {
                0: 10,
                1: 10,
            },
        };
    },
    scoringRule: (cards) => ArithmeticSum(3, 1, cards.reduce(TotalRank, 0)),
    distinction: {
        description: "Получив знак отличия кузнецов, сразу же призовите Главного кузнеца с двумя шевронами в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов.",
        style: "url(/img/distinctions/Distinctions.png) no-repeat 0px -100px / 94px 150px",
        awarding: (G, ctx, player) => {
            if (G.tierToEnd !== 0) {
                player.cards[0].push(CreateCard({
                    suit: 0,
                    rank: 2,
                    points: 2,
                }));
                delete G.distinctions[0];
                ctx.events.endTurn();
            }
        },
    },
};

const hunterSuit = {
    suit: 1,
    suitName: 'Hunter',
    suitColor: 'bg-green-600',
    description: "Их показатель храбрости равен квадрату числа карт охотников в армии игрока.",
    ranksValues: () => {
        return {
            2: {
                0: 6,
                1: 6,
            },
            3: {
                0: 6,
                1: 6,
            },
            4: {
                0: 6,
                1: 6,
            },
            5: {
                0: 8,
                1: 8,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: 6,
                1: 6,
            },
            3: {
                0: 6,
                1: 6,
            },
            4: {
                0: 6,
                1: 6,
            },
            5: {
                0: 8,
                1: 8,
            },
        };
    },
    scoringRule: (cards) => cards.reduce(TotalRank, 0) ** 2,
    distinction: {
        description: "Получив знак отличия охотников, сразу же обменяйте свою монету с номиналом 0 на особую монету с номиналом 3. Эта монета также позволяет обменивать монеты в кошеле и не может быть улучшена.",
        style: "url(/img/distinctions/Distinctions.png) no-repeat -64px 0px / 94px 150px",
        awarding: (G, ctx, player) => {
            if (G.tierToEnd !== 0) {
                player.boardCoins[player.boardCoins.findIndex(coin => coin.value === 0)] = CreateCoin({
                    value: 3,
                    isTriggerTrading: true,
                });
                delete G.distinctions[1];
                ctx.events.endTurn();
            }
        },
    },
};

const minerSuit = {
    suit: 2,
    suitName: 'Miner',
    suitColor: 'bg-yellow-600',
    description: "Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии игрока.",
    ranksValues: () => {
        return {
            2: {
                0: 6,
                1: 6,
            },
            3: {
                0: 6,
                1: 6,
            },
            4: {
                0: 6,
                1: 6,
            },
            5: {
                0: 8,
                1: 8,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [0, 0, 1, 1, 2, 2],
                1: [0, 0, 1, 1, 2, 2],
            },
            3: {
                0: [0, 0, 1, 1, 2, 2],
                1: [0, 0, 1, 1, 2, 2],
            },
            4: {
                0: [0, 0, 1, 1, 2, 2],
                1: [0, 0, 1, 1, 2, 2],
            },
            5: {
                0: [0, 0, 0, 1, 1, 1, 2, 2],
                1: [0, 0, 0, 1, 1, 1, 2, 2],
            },
        };
    },
    scoringRule: (cards) => cards.reduce(TotalRank, 0) * cards.reduce(TotalPoints, 0),
    distinction: {
        description: "Получив знак отличия горняков, сразу же положите особый кристалл 6 поверх вашего текущего кристалла (тот остаётся скрытым до конца игры). В конце игры обладатель этого кристалла прибавит +3 очка к итоговому показателю храбрости своей армии. Этот кристалл позволяет победить во всех спорах при равенстве ставок и никогда не обменивается.",
        style: "url(/img/distinctions/Distinctions.png) no-repeat 0px -50px / 94px 150px",
        awarding: (G, ctx, player) => {
            if (G.tierToEnd !== 0) {
                player.priority = CreatePriority({
                    value: 6,
                    isExchangeable: false,
                });
                delete G.distinctions[2];
                ctx.events.endTurn();
            } else {
                if (player.priority.value === 6) {
                    return 3;
                } else {
                    return 0;
                }
            }
        },
    },
};

const warriorSuit = {
    suit: 3,
    suitName: 'Warrior',
    suitColor: 'bg-red-600',
    description: "Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал своей самой ценной монеты к показателю храбрости своих воинов.",
    ranksValues: () => {
        return {
            2: {
                0: 8,
                1: 8,
            },
            3: {
                0: 8,
                1: 8,
            },
            4: {
                0: 8,
                1: 8,
            },
            5: {
                0: 9,
                1: 9,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [3, 4, 5, 6, 6, 7, 8, 9],
                1: [3, 4, 5, 6, 6, 7, 8, 9],
            },
            3: {
                0: [3, 4, 5, 6, 6, 7, 8, 9],
                1: [3, 4, 5, 6, 6, 7, 8, 9],
            },
            4: {
                0: [3, 4, 5, 6, 6, 7, 8, 9],
                1: [3, 4, 5, 6, 6, 7, 8, 9],
            },
            5: {
                0: [3, 4, 5, 6, 6, 7, 8, 9, 10],
                1: [3, 4, 5, 6, 6, 7, 8, 9, 10],
            },
        };
    },
    scoringRule: (cards) => cards.reduce(TotalPoints, 0),
    distinction: {
        description: "Получив знак отличия воинов, сразу же улучшите одну из своих монет, добавив к её номиналу +5.",
        style: "url(/img/distinctions/Distinctions.png) no-repeat -32px -50px / 94px 150px",
        awarding: (G, ctx, player) => {
            if (G.tierToEnd !== 0) {
                G.drawProfit = 3;
            } else {
                return Math.max(...player.boardCoins.map(coin => coin.value));
            }
        },
    },
};

const explorerSuit = {
    suit: 4,
    suitName: 'Explorer',
    suitColor: 'bg-blue-500',
    description: "Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.",
    ranksValues: () => {
        return {
            2: {
                0: 7,
                1: 7,
            },
            3: {
                0: 7,
                1: 7,
            },
            4: {
                0: 7,
                1: 7,
            },
            5: {
                0: 8,
                1: 8,
            },
        };
    },
    pointsValues: () => {
        return {
            2: {
                0: [5, 6, 7, 8, 9, 10, 11],
                1: [5, 6, 7, 8, 9, 10, 11],
            },
            3: {
                0: [5, 6, 7, 8, 9, 10, 11],
                1: [5, 6, 7, 8, 9, 10, 11],
            },
            4: {
                0: [5, 6, 7, 8, 9, 10, 11],
                1: [5, 6, 7, 8, 9, 10, 11],
            },
            5: {
                0: [5, 6, 7, 8, 9, 10, 11, 12],
                1: [5, 6, 7, 8, 9, 10, 11, 12],
            },
        };
    },
    scoringRule: (cards) => cards.reduce(TotalPoints, 0),
    distinction: {
        description: "Получив знак отличия разведчиков, сразу же возьмите 3 карты из колоды эпохи 2 и сохраните у себя одну из этих карт. Если это карта дворфа, сразу же поместите его в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов. Если это карта королевская награда, то улучшите одну из своих монет. Две оставшиеся карты возвращаются в колоду эпохи 2. Положите карту знак отличия разведчиков в командную зону рядом с вашим планшетом.",
        style: "url(/img/distinctions/Distinctions.png) no-repeat 0px 0px / 94px 150px",
        awarding: (G) => {
            if (G.tierToEnd !== 0) {
                G.drawProfit = 4;
            }
        },
    },
};

export const suitsConfigArray = [blacksmithSuit, hunterSuit, minerSuit, warriorSuit, explorerSuit];
