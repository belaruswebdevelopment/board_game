import {CreateCoin} from "../Coin";
import {CreateCard, ICard} from "../Card";
import {CreatePriority} from "../Priority";
import {AddActionsToStack, StartActionFromStackOrEndActions} from "../helpers/StackHelpers";
import {AddDataToLog, LogTypes} from "../Logging";
import {ArithmeticSum, TotalPoints, TotalRank} from "../helpers/ScoreHelpers";
import {MyGameState} from "../GameSetup";
import {Ctx} from "boardgame.io";
import {IPublicPlayer, IStack, PlayerCardsType} from "../Player";

export interface INumberValues {
    [index: number]: number,
}

interface IArrayValuesForTiers {
    [index: number]: number[],
}

interface IRankValues {
    [index: number]: INumberValues,
}

interface IPointsValues {
    [index: number]: INumberValues | IArrayValuesForTiers,
}

interface IDistinction {
    description: string,
    awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number,
}

export interface ISuit {
    suit: string,
    suitName: string,
    suitColor: string,
    description: string,
    ranksValues: () => IRankValues,
    pointsValues: () => IPointsValues,
    scoringRule: (cards: PlayerCardsType[]) => number,
    distinction: IDistinction,
}

export interface ISuitConfig {
    [name: string]: ISuit,
}

/**
 * <h3>Фракция кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @todo Add may be potential points for hunters and blacksmiths.
 */
const blacksmith: ISuit = {
    suit: "blacksmith",
    suitName: "Кузнецы",
    suitColor: 'bg-purple-600',
    description: "Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).",
    ranksValues: (): IRankValues => ({
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
    }),
    pointsValues: (): IPointsValues => ({
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
    }),
    scoringRule: (cards: PlayerCardsType[]): number => ArithmeticSum(3, 1,
        cards.reduce(TotalRank, 0)),
    distinction: {
        description: "Получив знак отличия кузнецов, сразу же призовите Главного кузнеца с двумя шевронами в свою армию. "
            + "Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов.",
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                player.cards[0].push(CreateCard({
                    suit: "blacksmith",
                    rank: 2,
                    points: 2,
                } as ICard));
                delete G.distinctions[0];
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия кузнецов 
                карту Главного кузнеца.`);
                ctx.events!.endTurn!();
            }
            return 0;
        },
    },
};

/**
 * <h3>Фракция охотников.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 */
const hunter: ISuit = {
    suit: "hunter",
    suitName: "Охотники",
    suitColor: "bg-green-600",
    description: "Их показатель храбрости равен квадрату числа карт охотников в армии игрока.",
    ranksValues: (): IRankValues => ({
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
    }),
    pointsValues: (): IPointsValues => ({
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
    }),
    scoringRule: (cards: PlayerCardsType[]): number => cards.reduce(TotalRank, 0) ** 2,
    distinction: {
        description: "Получив знак отличия охотников, сразу же обменяйте свою монету с номиналом 0 на особую монету " +
            "с номиналом 3. Эта монета также позволяет обменивать монеты в кошеле и не может быть улучшена.",
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                const tradingCoinIndex = player.boardCoins.findIndex(coin => (coin && coin.value) === 0);
                player.boardCoins[tradingCoinIndex] = CreateCoin({
                    value: 3,
                    isTriggerTrading: true,
                });
                delete G.distinctions[1];
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия охотников 
                свою монету с номиналом 0 на особую монету с номиналом 3.`);
                ctx.events!.endTurn!();
            }
            return 0;
        },
    },
};

/**
 * <h3>Фракция горняков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*)), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*=, *, *): (number|undefined))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}} Горняки.
 */
const miner: ISuit = {
    suit: "miner",
    suitName: "Горняки",
    suitColor: "bg-yellow-600",
    description: "Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии " +
        "игрока.",
    ranksValues: (): IRankValues => ({
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
    }),
    pointsValues: (): IPointsValues => ({
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
    }),
    scoringRule: (cards: PlayerCardsType[]): number => cards.reduce(TotalRank, 0) * cards.reduce(TotalPoints, 0),
    distinction: {
        description: "Получив знак отличия горняков, сразу же положите особый кристалл 6 поверх вашего текущего " +
            "кристалла (тот остаётся скрытым до конца игры). В конце игры обладатель этого кристалла прибавит +3 очка "
            + "к итоговому показателю храбрости своей армии. Этот кристалл позволяет победить во всех спорах при равенстве "
            + "ставок и никогда не обменивается.",
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                player.priority = CreatePriority({
                    value: 6,
                    isExchangeable: false,
                });
                delete G.distinctions[2];
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия горняков 
                свой кристалл на особый кристалл 6.`);
                ctx.events!.endTurn!();
            } else {
                if (player.priority.value === 6) {
                    return 3;
                }
            }
            return 0;
        },
    },
};

/**
 * <h3>Фракция воинов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*): *), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*=, *=, *): (*))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}} Воины.
 */
const warrior: ISuit = {
    suit: "warrior",
    suitName: "Воины",
    suitColor: "bg-red-600",
    description: "Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, " +
        "который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой " +
        "ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал " +
        "своей самой ценной монеты к показателю храбрости своих воинов.",
    ranksValues: (): IRankValues => ({
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
    }),
    pointsValues: (): IPointsValues => ({
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
    }),
    scoringRule: (cards: PlayerCardsType[]): number => cards.reduce(TotalPoints, 0),
    distinction: {
        description: "Получив знак отличия воинов, сразу же улучшите одну из своих монет, добавив к её номиналу +5.",
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                const stack: IStack[] = [
                    {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "upgradeCoin",
                            stageName: "upgradeCoin",
                            value: 5,
                            drawName: "Upgrade coin Warrior distinction",
                        },
                    },
                    {
                        actionName: "UpgradeCoinAction",
                        config: {
                            value: 5,
                        },
                    },
                ];
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия воинов 
                возможность улучшить одну из своих монет на +5:`);
                AddActionsToStack(G, ctx, stack);
                StartActionFromStackOrEndActions(G, ctx, false);
            } else {
                return Math.max(...player.boardCoins.filter(coin => coin?.value).map(coin =>
                    coin!.value));
            }
            return 0;
        },
    },
};

/**
 * <h3>Фракция разведчиков.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 *
 * @type {{scoringRule: (function(*): *), ranksValues: (function(): {"2": {"0": number, "1": number}, "3": {"0": number, "1": number}, "4": {"0": number, "1": number}, "5": {"0": number, "1": number}}), distinction: {awarding: ((function(*=, *=, *): (*|undefined))|*), description: string}, description: string, suitColor: string, suit: string, suitName: string, pointsValues: (function(): {"2": {"0", "1"}, "3": {"0", "1"}, "4": {"0", "1"}, "5": {"0", "1"}})}} Разведчики.
 */
const explorer: ISuit = {
    suit: "explorer",
    suitName: "Разведчики",
    suitColor: "bg-blue-500",
    description: "Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.",
    ranksValues: (): IRankValues => ({
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
    }),
    pointsValues: (): IPointsValues => ({
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
    }),
    scoringRule: (cards: PlayerCardsType[]): number => cards.reduce(TotalPoints, 0),
    distinction: {
        description: "Получив знак отличия разведчиков, сразу же возьмите 3 карты из колоды эпохи 2 и сохраните у себя " +
            "одну из этих карт. Если это карта дворфа, сразу же поместите его в свою армию. Игрок получает право призвать "
            + "нового героя, если в этот момент завершил линию 5 шевронов. Если это карта королевская награда, то улучшите "
            + "одну из своих монет. Две оставшиеся карты возвращаются в колоду эпохи 2. Положите карту знак отличия " +
            "разведчиков в командную зону рядом с вашим планшетом.",
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                const stack: IStack[] = [
                    {
                        actionName: "DrawProfitAction",
                        config: {
                            name: "explorerDistinction",
                            stageName: "pickDistinctionCard",
                            drawName: "Pick card by Explorer distinction",
                        },
                    },
                ];
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия разведчиков 
                возможность получить карту из колоды второй эпохи:`);
                AddActionsToStack(G, ctx, stack);
                StartActionFromStackOrEndActions(G, ctx, false);
            }
            return 0;
        },
    },
};

/**
 * <h3>Конфиг фракций.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт при инициализации игры.</li>
 * </ol>
 */
export const suitsConfig: ISuitConfig = {
    blacksmith,
    hunter,
    miner,
    warrior,
    explorer,
};