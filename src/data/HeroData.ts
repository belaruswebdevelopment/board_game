import { GetSuitIndexByName } from "../helpers/SuitHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
import { IPublicPlayer, IStack } from "../Player";
import { SuitNames } from "./SuitData";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import {
    AddBuffToPlayerHeroAction,
    AddHeroToCardsAction,
    CheckDiscardCardsFromPlayerBoardAction,
    CheckPickCampCardAction,
    CheckPickDiscardCardHeroAction,
    DiscardCardsFromPlayerBoardAction,
    DrawProfitHeroAction,
    GetClosedCoinIntoPlayerHandAction,
    PickDiscardCardHeroAction,
    PickHeroWithConditionsAction,
    PlaceCardsAction,
    PlaceHeroAction,
    UpgradeCoinHeroAction
} from "../actions/HeroActions";

/**
 * <h3>Интерфейс для баффа карты героя.</h3>
 */
export interface IBuff {
    name: string,
    value: string | number | boolean,
}

/**
 * <h3>Интерфейс для варианта карты героя.</h3>
 */
interface IVariant {
    suit: string,
    rank: number,
    points: null | number,
}

/**
 * <h3>Интерфейс для вариантов карты героя.</h3>
 */
export interface IVariants {
    [name: string]: IVariant,
}

/**
 * <h3>Интерфейс для условия карты героя.</h3>
 */
interface ICondition {
    suit: string,
    [name: string]: string | number | boolean,
}

/**
 * <h3>Интерфейс для условий карты героя.</h3>
 */
export interface IConditions {
    [name: string]: ICondition,
}

/**
 * <h3>Интерфейс для данных карты героя.</h3>
 */
export interface IHeroData {
    name: string,
    description: string,
    game: string,
    suit: null | string,
    rank: null | number,
    points: null | number,
    stack: IStack[],
    scoringRule: (player?: IPublicPlayer) => number,
}

/**
 * <h3>Интерфейс для конфига карт героев.</h3>
 */
export interface IHeroConfig {
    [name: string]: IHeroData,
}

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Aegur: IHeroData = {
    name: `Aegur`,
    description: `Обладает 2 шевронами.`,
    game: `base`,
    suit: SuitNames.BLACKSMITH,
    rank: 2,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Aegur`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Andumia: IHeroData = {
    name: `Andumia`,
    description: `Adds 12 points to your Final Bravery Value.When you recruit her, immediately look at all the cards in the discard pile and keep one(Royal Offering card or Dwarf card). - If it is a Royal Offering card, its effect is immediately applied, then the card is returned to the discard. - If it is a Dwarf card, place it in your army. Its placement can trigger the recruitment of a Hero card.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Andumia`,
            },
        },
        {
            action: CheckPickDiscardCardHeroAction.name,
        },
        {
            action: DrawProfitHeroAction.name,
            config: {
                stageName: `pickDiscardCard`,
                drawName: `Andumia`,
                name: `AndumiaAction`,
            },
        },
        {
            action: PickDiscardCardHeroAction.name,
        },
    ],
    scoringRule: (): number => 12,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Aral: IHeroData = {
    name: `Aral`,
    description: `Обладает 2 шевронами.`,
    game: `base`,
    suit: SuitNames.HUNTER,
    rank: 2,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Aral`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Astrid: IHeroData = {
    name: `Astrid`,
    description: `Прибавьте к своему итоговому показателю храбрости номинал своей самой ценной монеты.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Astrid`,
            },
        },
    ],
    scoringRule: (player?: IPublicPlayer): number => player !== undefined ? GetMaxCoinValue(player) : 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Bonfur: IHeroData = {
    name: `Bonfur`,
    description: `Обладает 3 шевронами.Призвав Бонфура, сразу же поместите его карту в колонку кузнецов и отправьте в сброс одну нижнюю карту дворфа(не героя) из другой колонки своей армии по своему выбору.`,
    game: `base`,
    suit: SuitNames.BLACKSMITH,
    rank: 3,
    points: null,
    stack: [
        {
            action: CheckDiscardCardsFromPlayerBoardAction.name,
            config: {
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            action: DrawProfitHeroAction.name,
            config: {
                stageName: `discardCardFromBoard`,
                drawName: `Bonfur`,
                name: `BonfurAction`,
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            action: DiscardCardsFromPlayerBoardAction.name,
            config: {
                suit: SuitNames.BLACKSMITH,
            },
        },
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Bonfur`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dagda: IHeroData = {
    name: `Dagda`,
    description: `Обладает 3 шевронами.Призвав Дагду, сразу же поместите её карту в колонку охотников и отправьте в сброс по одной нижней карте дворфов(не героев) из двух других колонок своей армии по своему выбору.`,
    game: `base`,
    suit: SuitNames.HUNTER,
    rank: 3,
    points: null,
    stack: [
        {
            action: CheckDiscardCardsFromPlayerBoardAction.name,
            config: {
                suit: SuitNames.HUNTER,
                number: 2,
            },
        },
        {
            action: DrawProfitHeroAction.name,
            config: {
                stageName: `discardCardFromBoard`,
                drawName: `Dagda`,
                name: `DagdaAction`,
                suit: SuitNames.HUNTER,
                number: 2,
            },
        },
        {
            action: DiscardCardsFromPlayerBoardAction.name,
        },
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Dagda`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Aesir: IHeroData = {
    name: `Dwerg Aesir`,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Dwerg_Aesir`,
            },
        },
    ],
    scoringRule: (): number => 1,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Bergelmir: IHeroData = {
    name: `Dwerg Bergelmir`,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Dwerg_Bergelmir`,
            },
        },
    ],
    scoringRule: (): number => 1,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Jungir: IHeroData = {
    name: `Dwerg Jungir`,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Dwerg_Jungir`,
            },
        },
    ],
    scoringRule: (): number => 1,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Sigmir: IHeroData = {
    name: `Dwerg Sigmir`,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Dwerg_Sigmir`,
            },
        },
    ],
    scoringRule: (): number => 1,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Ymir: IHeroData = {
    name: `Dwerg Ymir`,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Dwerg_Ymir`,
            },
        },
    ],
    scoringRule: (): number => 1,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Grid: IHeroData = {
    name: `Grid`,
    description: `Прибавьте 7 очков к своему итоговому показателю храбрости.Когда вы призвали Грид и положили её карту в свою командную зону, сразу же улучшите на + 7 номинал одной из своих монет.`,
    game: "base",
    suit: null,
    rank: null,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Grid`,
            },
        },
        {
            action: DrawProfitHeroAction.name,
            config: {
                stageName: `upgradeCoin`,
                drawName: `Grid`,
                name: `upgradeCoin`,
                value: 7,
            },
        },
        {
            action: UpgradeCoinHeroAction.name,
            config: {
                value: 7,
            },
        },
    ],
    scoringRule: (): number => 7,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Holda: IHeroData = {
    name: `Holda`,
    description: `Adds 12 points to your Final Bravery Value.When you recruit her, immediately choose a Mercenary or Artifact card available at the Camp.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Holda`,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: `goCampOneTime`,
                    value: true,
                },
            },
        },
        {
            action: CheckPickCampCardAction.name,
        },
        {
            action: DrawProfitHeroAction.name,
            config: {
                stageName: `pickCampCardHolda`,
                drawName: `Holda`,
                name: `HoldaAction`,
            },
        },
    ],
    scoringRule: (): number => 12,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Hourya: IHeroData = {
    name: `Hourya`,
    description: `Обладает 1 шевроном.Прибавьте 20 очков к показателю храбрости разведчиков.Чтобы призвать Хурию, игрок должен иметь в своей армии как минимум 5 шевронов в колонке разведчиков.Важно: если Труд и / или Илуд расположены в колонке разведчиков, то их шевроны учитываются для призыва Хурии`,
    game: `base`,
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 20,
    stack: [
        {
            action: PickHeroWithConditionsAction.name,
            config: {
                conditions: {
                    suitCountMin: {
                        suit: SuitNames.EXPLORER,
                        value: 5,
                    },
                },
            },
        },
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Hourya`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Idunn: IHeroData = {
    name: `Idunn`,
    description: `Обладает 1 шевроном. Прибавьте 7 очков к показателю храбрости разведчиков плюс по 2 очка за каждый шеврон в колонке Разведчиков (включая её собственный).`,
    game: `base`,
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Idunn`,
            },
        },
    ],
    scoringRule: (player?: IPublicPlayer): number => player !== undefined ?
        player.cards[GetSuitIndexByName(SuitNames.EXPLORER)]
            .reduce(TotalRank, 0) * 2 : 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Jarika: IHeroData = {
    name: `Jarika`,
    description: `Adds 8 points to your Final Bravery Value.As a neutral Hero, place her in your Command Zone.During a coin transformation or a coin trade(Royal Offering, Warrior Distinction, Grid), increase the value of the desired sum by + 2.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 8,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Jarika`,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: `upgradeCoin`,
                    value: 2,
                },
            },
        },
    ],
    scoringRule: (): number => 8,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Khrad: IHeroData = {
    name: `Khrad`,
    description: `Adds 4 points to your Final Bravery Value.When you recruit him, immediately add + 10 to your lowest value coin(except the Trading coin).`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 4,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Khrad`,
            },
        },
        {
            action: UpgradeCoinHeroAction.name,
            config: {
                value: 10,
                coin: `min`,
            },
        },
    ],
    scoringRule: (): number => 4,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Kraal: IHeroData = {
    name: `Kraal`,
    description: `Обладает 2 шевронами. Прибавьте 7 и 0 очков к показателю храбрости воинов.`,
    game: `base`,
    suit: SuitNames.WARRIOR,
    rank: 2,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Kraal`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Lokdur: IHeroData = {
    name: `Lokdur`,
    description: `Обладает 1 шевроном.Прибавьте 3 к сумме очков храбрости горняков.Локдур увеличивает сумму очков храбрости горняков на 3, а сумму шевронов на 1.`,
    game: `base`,
    suit: SuitNames.MINER,
    rank: 1,
    points: 3,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Lokdur`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Olwin: IHeroData = {
    name: `Olwin`,
    description: `Adds 9 points to your Final Bravery Value.When you recruit him, also take his two doubles whose Bravery value is 0 and then place each of these cards in two different columns of your choice.Their placement may result in the recruitment of a Hero card. «Olwin's double» cards are considered Dwarf cards of the class in which they are placed and can be destroyed by the powers of Dagda, Bonfur, Brisingamens, and Hofud.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Olwin`,
            },
        },
        {
            action: DrawProfitHeroAction.name,
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: 0,
                },
            },
            config: {
                stageName: `placeCards`,
                drawName: `Olwin`,
                name: `placeCards`,
                number: 2,
            },
        },
        {
            action: PlaceCardsAction.name,
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: 0,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: 0,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: 0,
                },
            },
        },
    ],
    scoringRule: (): number => 9,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Skaa: IHeroData = {
    name: `Skaa`,
    description: `Прибавьте 17 очков к своему итоговому показателю храбрости.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 17,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Skaa`,
            },
        },
    ],
    scoringRule: (): number => 17,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Tarah: IHeroData = {
    name: `Tarah`,
    description: `Обладает 1 шевроном. Прибавьте 14 очков к показателю храбрости воинов.`,
    game: `base`,
    suit: SuitNames.WARRIOR,
    rank: 1,
    points: 14,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Tarah`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Thrud: IHeroData = {
    name: `Thrud`,
    description: `Призвав этого героя, поместите её карту по своему выбору в любую колонку класса своей армии.На карту Труд нельзя положить никакую другую карту дворфа.Если карта дворфа или героя помещается в колонку, где расположена Труд, то игрок должен взять карту Труд в руку, поместить карту дворфа или героя и затем вернуть карту Труд в армию, в любую колонку по своему выбору.Игрок получает право призвать нового героя, если, разместив карту Труд, создал необходимую для этого новую линию 5 шевронов.В конце эпохи 1, при распределении карт знаков отличия, шеврон Труд учитывается в том воинском классе, где она расположена.В эпоху 2, после посещения последней таверны, но перед подсчётом итогового показателя храбрости, карта Труд перемещается из армии в командную зону.Труд прибавляет 13 очков к итоговому показателю храбрости игрока.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 13,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Thrud`,
            },
        },
        {
            action: DrawProfitHeroAction.name,
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: null,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: null,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: null,
                },
            },
            config: {
                stageName: `placeCards`,
                name: `placeCards`,
                drawName: `Thrud`,
            },
        },
        {
            action: PlaceHeroAction.name,
            variants: {
                blacksmith: {
                    suit: SuitNames.BLACKSMITH,
                    rank: 1,
                    points: null,
                },
                hunter: {
                    suit: SuitNames.HUNTER,
                    rank: 1,
                    points: null,
                },
                explorer: {
                    suit: SuitNames.EXPLORER,
                    rank: 1,
                    points: null,
                },
                warrior: {
                    suit: SuitNames.WARRIOR,
                    rank: 1,
                    points: null,
                },
                miner: {
                    suit: SuitNames.MINER,
                    rank: 1,
                    points: null,
                },
            },
            config: {
                name: `Thrud`,
            },
        },
    ],
    scoringRule: (): number => 13,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Uline: IHeroData = {
    name: `Uline`,
    description: `Прибавьте 9 очков к своему итоговому показателю храбрости. Как только вы призвали Улину и положили её карту в свою командную зону, сразу же берите в руку монеты, которые всё ещё лежат лицом вниз на вашем планшете. С этого момента и каждый раз во время подготовки к раунду на этапе «Ставки» игрок не выкладывает свои монеты на планшет, а держит их в своей руке. Во время посещения таверны на этапе «Открытие ставок», игрок ждёт, пока все другие эльвеланды откроют свои ставки и только после этого он выбирает монету из своей руки и кладёт её лицом вверх в область соответствующей таверны на своём планшете. Затем раунд продолжается в порядке, соответствующем ставкам игроков. Если игрок активировал своей ставкой обмен монет, то последним действием своего хода он выбирает из руки две монеты, номиналы которых он суммирует для получения новой монеты. Обмен происходит по обычным правилам, однако новую монету игрок сразу же берёт в руку, а не кладёт в кошель своего планшета. Во время улучшения монеты: • если игрок выбрал монету из руки, то новую монету он берёт так же в руку, • если игрок выбрал монету, лежащую на планшете, то новую монету он кладёт в то же место. Игрок может сделать ставку монетами из руки в таверне, которую посетит в ходе раунда. Монеты, лежащие на планшете, должны оставаться на нём до конца текущего раунда.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Uline`,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: `everyTurn`,
                    value: `Uline`,
                },
            },
        },
        {
            action: GetClosedCoinIntoPlayerHandAction.name,
        },
    ],
    scoringRule: (): number => 9,
};

// todo rework AddBuff?!
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Ylud: IHeroData = {
    name: `Ylud`,
    description: `Поместите эту карту в свою командную зону. В эпоху 1, сразу после посещения последней таверны, но до смотра войск, поместите карту Илуд в колонку любого воинского класса вашей армии. При распределении знаков отличий во время смотра войск, шеврон Илуд учитывается в качестве шеврона этого класса. Илуд остаётся в этой колонке до конца эпохи 2. Если вы призвали Илуд во время эпохи 2, поместите её карту в свою командную зону. В эпоху 2, сразу после посещения последней таверны, но до подсчёта итогового показателя храбрости: • если Илуд в командной зоне, то игрок помещает её в колонку любого воинского класса своей армии, • если Илуд в армии, игрок может переместить её в другую колонку воинского класса по своему выбору. Илуд будет учитываться в качестве дворфа того класса, где располагается. В конце эпохи 2, в зависимости от местоположения Илуд, она будет учитываться как кузнец или охотник, разведчик 11, воин 7, горняк 1. Если Илуд в колонке воинов, то её шеврон учитывается в сумме шевронов воинов при определении преимущества. Игрок получает право призвать нового героя, если с помощью карты Илуд завершит новую линию 5 шевронов. Если игрок обладает обеими картами героев Илуд и Труд, то при их активации важно учесть следующий порядок. После посещения последней таверны в эпоху 2 игрок сначала помещает Илуд в свою армию. В этот момент игрок может призвать нового героя, если с помощью Илуд создал линию 5 шевронов. Затем игрок перемещает Труд из армии в свою командную зону.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Ylud`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Zolkur: IHeroData = {
    name: `Zolkur`,
    description: `Adds 10 points to your Final Bravery Value.When you recruit him, immediately place him on the coins of your pouch.During your next trade, you trade the lower value coin instead of the higher as in a standard exchange.Then return Zolkur's card to the Command Zone.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 10,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Zolkur`,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: `upgradeNextCoin`,
                    value: `min`,
                },
            },
        },
    ],
    scoringRule: (): number => 10,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Zoral: IHeroData = {
    name: `Zoral`,
    description: `Обладает 3 шевронами.Прибавьте 1, 0 и 0 к сумме очков храбрости горняков.Зорал увеличивает сумму очков храбрости горняков на 1, а сумму шевронов – на 3.`,
    game: `base`,
    suit: SuitNames.MINER,
    rank: 3,
    points: 1,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: `Zoral`,
            },
        },
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Конфиг героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 */
export const heroesConfig: IHeroConfig = {
    Aegur,
    Andumia,
    Aral,
    Astrid,
    Bonfur,
    Dagda,
    Dwerg_Aesir,
    Dwerg_Bergelmir,
    Dwerg_Jungir,
    Dwerg_Sigmir,
    Dwerg_Ymir,
    Grid,
    Holda,
    Hourya,
    Idunn,
    Jarika,
    Khrad,
    Kraal,
    Lokdur,
    Olwin,
    Skaa,
    Tarah,
    Thrud,
    Uline,
    Ylud,
    Zolkur,
    Zoral,
};
