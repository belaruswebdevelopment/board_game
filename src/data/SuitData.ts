import { Ctx } from "boardgame.io";
import { ConfigNames, DrawNames, DrawProfitAction, UpgradeCoinAction } from "../actions/Actions";
import { CreateCard, ICard } from "../Card";
import { CreateCoin, ICoin } from "../Coin";
import { Stages } from "../Game";
import { MyGameState } from "../GameSetup";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { ArithmeticSum, TotalPoints, TotalRank } from "../helpers/ScoreHelpers";
import { AddActionsToStack, StartActionFromStackOrEndActions } from "../helpers/StackHelpers";
import { AddDataToLog, LogTypes } from "../Logging";
import { IPublicPlayer, IStack, PlayerCardsType } from "../Player";
import { CreatePriority } from "../Priority";

/**
 * <h3>Перечисление для названий фракций.</h3>
 */
export const enum SuitNames {
    BLACKSMITH = `blacksmith`,
    EXPLORER = `explorer`,
    HUNTER = `hunter`,
    MINER = `miner`,
    WARRIOR = `warrior`,
};

/**
 * <h3>Перечисление для русских названий фракций.</h3>
 */
export const enum RusSuitNames {
    BLACKSMITH = `Кузнецы`,
    EXPLORER = `Разведчики`,
    HUNTER = `Охотники`,
    MINER = `Горняки`,
    WARRIOR = `Воины`,
};

/**
 * <h3>Интерфейс для числовых индексов и числовых значений.</h3>
 */
export interface INumberValues {
    [index: number]: number,
};

/**
 * <h3>Интерфейс для числовых индексов и массивов числовых значений.</h3>
 */
interface IArrayValuesForTiers {
    [index: number]: number[],
};

/**
 * <h3>Интерфейс для значений шевронов карт.</h3>
 */
interface IRankValues {
    [index: number]: INumberValues,
};

/**
 * <h3>Интерфейс для значений очков карт.</h3>
 */
interface IPointsValues {
    [index: number]: INumberValues | IArrayValuesForTiers,
};

/**
 * <h3>Интерфейс для преимуществ по фракциям.</h3>
 */
interface IDistinction {
    description: string,
    awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer) => number,
};

/**
 * <h3>Интерфейс для фракций.</h3>
 */
export interface ISuit {
    suit: string,
    suitName: string,
    suitColor: string,
    description: string,
    ranksValues: () => IRankValues,
    pointsValues: () => IPointsValues,
    scoringRule: (cards: PlayerCardsType[]) => number,
    distinction: IDistinction,
};

/**
 * <h3>Интерфейс для конфига фракций.</h3>
 */
export interface ISuitConfig {
    [name: string]: ISuit,
};

/**
 * <h3>Фракция кузнецов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется в конфиге фракций.</li>
 * </ol>
 * @todo Add may be potential points for hunters and blacksmiths.
 */
const blacksmith: ISuit = {
    suit: SuitNames.BLACKSMITH,
    suitName: RusSuitNames.BLACKSMITH,
    suitColor: `bg-purple-600`,
    description: `Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).`,
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
    scoringRule: (cards: PlayerCardsType[]): number =>
        ArithmeticSum(3, 1, cards.reduce(TotalRank, 0)),
    distinction: {
        description: `Получив знак отличия кузнецов, сразу же призовите Главного кузнеца с двумя шевронами в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов.`,
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                player.cards[SuitNames.BLACKSMITH].push(CreateCard({
                    suit: SuitNames.BLACKSMITH,
                    rank: 2,
                    points: 2,
                } as ICard));
                G.distinctions[SuitNames.BLACKSMITH] = undefined;
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия кузнецов карту Главного кузнеца.`);
                ctx.events!.endTurn!();
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
 */
const explorer: ISuit = {
    suit: SuitNames.EXPLORER,
    suitName: RusSuitNames.EXPLORER,
    suitColor: `bg-blue-500`,
    description: `Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.`,
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
        description: `Получив знак отличия разведчиков, сразу же возьмите 3 карты из колоды эпохи 2 и сохраните у себя одну из этих карт. Если это карта дворфа, сразу же поместите его в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов. Если это карта королевская награда, то улучшите одну из своих монет. Две оставшиеся карты возвращаются в колоду эпохи 2. Положите карту знак отличия разведчиков в командную зону рядом с вашим планшетом.`,
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                const stack: IStack[] = [
                    {
                        action: DrawProfitAction.name,
                        config: {
                            name: ConfigNames.ExplorerDistinction,
                            stageName: Stages.PickDistinctionCard,
                            drawName: DrawNames.PickCardByExplorerDistinction,
                        },
                    },
                ];
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия разведчиков возможность получить карту из колоды второй эпохи:`);
                AddActionsToStack(G, ctx, stack);
                StartActionFromStackOrEndActions(G, ctx, false);
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
    suit: SuitNames.HUNTER,
    suitName: RusSuitNames.HUNTER,
    suitColor: `bg-green-600`,
    description: `Их показатель храбрости равен квадрату числа карт охотников в армии игрока.`,
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
        description: `Получив знак отличия охотников, сразу же обменяйте свою монету с номиналом 0 на особую монету с номиналом 3. Эта монета также позволяет обменивать монеты в кошеле и не может быть улучшена.`,
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                const tradingCoinIndex: number =
                    player.boardCoins.findIndex((coin: ICoin | null): boolean => coin?.value === 0);
                player.boardCoins[tradingCoinIndex] = CreateCoin({
                    value: 3,
                    isTriggerTrading: true,
                });
                G.distinctions[SuitNames.HUNTER] = undefined;
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия охотников свою монету с номиналом 0 на особую монету с номиналом 3.`);
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
 */
const miner: ISuit = {
    suit: SuitNames.MINER,
    suitName: RusSuitNames.MINER,
    suitColor: `bg-yellow-600`,
    description: `Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии игрока.`,
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
    scoringRule: (cards: PlayerCardsType[]): number =>
        cards.reduce(TotalRank, 0) * cards.reduce(TotalPoints, 0),
    distinction: {
        description: `Получив знак отличия горняков, сразу же положите особый кристалл 6 поверх вашего текущего кристалла (тот остаётся скрытым до конца игры). В конце игры обладатель этого кристалла прибавит +3 очка к итоговому показателю храбрости своей армии. Этот кристалл позволяет победить во всех спорах при равенстве ставок и никогда не обменивается.`,
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                player.priority = CreatePriority({
                    value: 6,
                    isExchangeable: false,
                });
                G.distinctions[SuitNames.MINER] = undefined;
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} обменял по знаку отличия горняков свой кристалл на особый кристалл 6.`);
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
 */
const warrior: ISuit = {
    suit: SuitNames.WARRIOR,
    suitName: RusSuitNames.WARRIOR,
    suitColor: `bg-red-600`,
    description: `Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал своей самой ценной монеты к показателю храбрости своих воинов.`,
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
        description: `Получив знак отличия воинов, сразу же улучшите одну из своих монет, добавив к её номиналу +5.`,
        awarding: (G: MyGameState, ctx: Ctx, player: IPublicPlayer): number => {
            if (G.tierToEnd !== 0) {
                const stack: IStack[] = [
                    {
                        action: DrawProfitAction.name,
                        config: {
                            name: ConfigNames.UpgradeCoin,
                            stageName: Stages.UpgradeCoin,
                            value: 5,
                            drawName: DrawNames.UpgradeCoinWarriorDistinction,
                        },
                    },
                    {
                        action: UpgradeCoinAction.name,
                        config: {
                            value: 5,
                        },
                    },
                ];
                AddDataToLog(G, LogTypes.GAME, `Игрок ${player.nickname} получил по знаку отличия воинов возможность улучшить одну из своих монет на +5:`);
                AddActionsToStack(G, ctx, stack);
                StartActionFromStackOrEndActions(G, ctx, false);
            } else {
                return GetMaxCoinValue(player);
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
    explorer,
    hunter,
    miner,
    warrior,
};
