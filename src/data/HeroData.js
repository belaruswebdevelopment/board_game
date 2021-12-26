import { BuffNames, ConfigNames, DrawNames } from "../actions/Actions";
import { AddBuffToPlayerHeroAction, AddHeroToCardsAction, CheckDiscardCardsFromPlayerBoardAction, CheckPickCampCardAction, CheckPickDiscardCardHeroAction, DiscardCardsFromPlayerBoardAction, DrawProfitHeroAction, GetClosedCoinIntoPlayerHandAction, PickDiscardCardHeroAction, PickHeroWithConditionsAction, PlaceCardsAction, PlaceHeroAction, UpgradeCoinHeroAction } from "../actions/HeroActions";
import { Stages } from "../Game";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
import { SuitNames } from "./SuitData";
/**
 * <h3>Перечисление для названий героев.</h3>
 */
export var HeroNames;
(function (HeroNames) {
    HeroNames["Aegur"] = "Aegur";
    HeroNames["Andumia"] = "Andumia";
    HeroNames["Aral"] = "Aral";
    HeroNames["Astrid"] = "Astrid";
    HeroNames["Bonfur"] = "Bonfur";
    HeroNames["Dagda"] = "Dagda";
    HeroNames["Dwerg_Aesir"] = "Dwerg Aesir";
    HeroNames["Dwerg_Bergelmir"] = "Dwerg Bergelmir";
    HeroNames["Dwerg_Jungir"] = "Dwerg Jungir";
    HeroNames["Dwerg_Sigmir"] = "Dwerg Sigmir";
    HeroNames["Dwerg_Ymir"] = "Dwerg Ymir";
    HeroNames["Grid"] = "Grid";
    HeroNames["Holda"] = "Holda";
    HeroNames["Hourya"] = "Hourya";
    HeroNames["Idunn"] = "Idunn";
    HeroNames["Jarika"] = "Jarika";
    HeroNames["Khrad"] = "Khrad";
    HeroNames["Kraal"] = "Kraal";
    HeroNames["Lokdur"] = "Lokdur";
    HeroNames["Olwin"] = "Olwin";
    HeroNames["Skaa"] = "Skaa";
    HeroNames["Tarah"] = "Tarah";
    HeroNames["Thrud"] = "Thrud";
    HeroNames["Uline"] = "Uline";
    HeroNames["Ylud"] = "Ylud";
    HeroNames["Zolkur"] = "Zolkur";
    HeroNames["Zoral"] = "Zoral";
})(HeroNames || (HeroNames = {}));
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Aegur = {
    name: HeroNames.Aegur,
    description: `Обладает 2 шевронами.`,
    game: `base`,
    suit: SuitNames.BLACKSMITH,
    rank: 2,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Aegur,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Andumia = {
    name: HeroNames.Andumia,
    description: `Adds 12 points to your Final Bravery Value. When you recruit her, immediately look at all the cards in the discard pile and keep one (Royal Offering card or Dwarf card). - If it is a Royal Offering card, its effect is immediately applied, then the card is returned to the discard. - If it is a Dwarf card, place it in your army. Its placement can trigger the recruitment of a Hero card.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Andumia,
            },
        },
        {
            action: CheckPickDiscardCardHeroAction.name,
        },
        {
            action: DrawProfitHeroAction.name,
            config: {
                stageName: Stages.PickDiscardCard,
                drawName: DrawNames.Andumia,
                name: ConfigNames.AndumiaAction,
            },
        },
        {
            action: PickDiscardCardHeroAction.name,
        },
    ],
    scoringRule: () => 12,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Aral = {
    name: HeroNames.Aral,
    description: `Обладает 2 шевронами.`,
    game: `base`,
    suit: SuitNames.HUNTER,
    rank: 2,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Aral,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Astrid = {
    name: HeroNames.Astrid,
    description: `Прибавьте к своему итоговому показателю храбрости номинал своей самой ценной монеты.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Astrid,
            },
        },
    ],
    scoringRule: (player) => player !== undefined ? GetMaxCoinValue(player) : 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Bonfur = {
    name: HeroNames.Bonfur,
    description: `Обладает 3 шевронами.Призвав Бонфура, сразу же поместите его карту в колонку кузнецов и отправьте в сброс одну нижнюю карту дворфа (не героя) из другой колонки своей армии по своему выбору.`,
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
                stageName: Stages.DiscardCardFromBoard,
                drawName: DrawNames.Bonfur,
                name: ConfigNames.BonfurAction,
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
                drawName: DrawNames.Bonfur,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dagda = {
    name: HeroNames.Dagda,
    description: `Обладает 3 шевронами.Призвав Дагду, сразу же поместите её карту в колонку охотников и отправьте в сброс по одной нижней карте дворфов (не героев) из двух других колонок своей армии по своему выбору.`,
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
                stageName: Stages.DiscardCardFromBoard,
                drawName: DrawNames.Dagda,
                name: ConfigNames.DagdaAction,
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
                drawName: DrawNames.Dagda,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Aesir = {
    name: HeroNames.Dwerg_Aesir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Dwerg_Aesir,
            },
        },
    ],
    scoringRule: () => 1,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Bergelmir = {
    name: HeroNames.Dwerg_Bergelmir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Dwerg_Bergelmir,
            },
        },
    ],
    scoringRule: () => 1,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Jungir = {
    name: HeroNames.Dwerg_Jungir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Dwerg_Jungir,
            },
        },
    ],
    scoringRule: () => 1,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Sigmir = {
    name: HeroNames.Dwerg_Sigmir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Dwerg_Sigmir,
            },
        },
    ],
    scoringRule: () => 1,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Dwerg_Ymir = {
    name: HeroNames.Dwerg_Ymir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Dwerg_Ymir,
            },
        },
    ],
    scoringRule: () => 1,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Grid = {
    name: HeroNames.Grid,
    description: `Прибавьте 7 очков к своему итоговому показателю храбрости. Когда вы призвали Грид и положили её карту в свою командную зону, сразу же улучшите на + 7 номинал одной из своих монет.`,
    game: "base",
    suit: null,
    rank: null,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Grid,
            },
        },
        {
            action: DrawProfitHeroAction.name,
            config: {
                stageName: Stages.UpgradeCoin,
                drawName: DrawNames.Grid,
                name: ConfigNames.UpgradeCoin,
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
    scoringRule: () => 7,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Holda = {
    name: HeroNames.Holda,
    description: `Adds 12 points to your Final Bravery Value. When you recruit her, immediately choose a Mercenary or Artifact card available at the Camp.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 12,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Holda,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: BuffNames.GoCampOneTime,
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
                stageName: Stages.PickCampCardHolda,
                drawName: DrawNames.Holda,
                name: ConfigNames.HoldaAction,
            },
        },
    ],
    scoringRule: () => 12,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Hourya = {
    name: HeroNames.Hourya,
    description: `Обладает 1 шевроном.Прибавьте 20 очков к показателю храбрости разведчиков. Чтобы призвать Хурию, игрок должен иметь в своей армии как минимум 5 шевронов в колонке разведчиков. Важно: если Труд и / или Илуд расположены в колонке разведчиков, то их шевроны учитываются для призыва Хурии.`,
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
                drawName: DrawNames.Hourya,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Idunn = {
    name: HeroNames.Idunn,
    description: `Обладает 1 шевроном. Прибавьте 7 очков к показателю храбрости разведчиков плюс по 2 очка за каждый шеврон в колонке Разведчиков (включая её собственный).`,
    game: `base`,
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Idunn,
            },
        },
    ],
    scoringRule: (player) => player !== undefined ?
        player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2 : 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Jarika = {
    name: HeroNames.Jarika,
    description: `Adds 8 points to your Final Bravery Value. As a neutral Hero, place her in your Command Zone. During a coin transformation or a coin trade(Royal Offering, Warrior Distinction, Grid), increase the value of the desired sum by + 2.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 8,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Jarika,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: BuffNames.UpgradeCoin,
                    value: 2,
                },
            },
        },
    ],
    scoringRule: () => 8,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Khrad = {
    name: HeroNames.Khrad,
    description: `Adds 4 points to your Final Bravery Value. When you recruit him, immediately add + 10 to your lowest value coin (except the Trading coin).`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 4,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Khrad,
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
    scoringRule: () => 4,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Kraal = {
    name: HeroNames.Kraal,
    description: `Обладает 2 шевронами.Прибавьте 7 и 0 очков к показателю храбрости воинов.`,
    game: `base`,
    suit: SuitNames.WARRIOR,
    rank: 2,
    points: 7,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Kraal,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Lokdur = {
    name: HeroNames.Lokdur,
    description: `Обладает 1 шевроном.Прибавьте 3 к сумме очков храбрости горняков. Локдур увеличивает сумму очков храбрости горняков на 3, а сумму шевронов на 1.`,
    game: `base`,
    suit: SuitNames.MINER,
    rank: 1,
    points: 3,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Lokdur,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Olwin = {
    name: HeroNames.Olwin,
    description: `Adds 9 points to your Final Bravery Value. When you recruit him, also take his two doubles whose Bravery value is 0 and then place each of these cards in two different columns of your choice. Their placement may result in the recruitment of a Hero card. «Olwin's double» cards are considered Dwarf cards of the class in which they are placed and can be destroyed by the powers of Dagda, Bonfur, Brisingamens, and Hofud.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Olwin,
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
                stageName: Stages.PlaceCards,
                drawName: DrawNames.Olwin,
                name: ConfigNames.PlaceCards,
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
    scoringRule: () => 9,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Skaa = {
    name: HeroNames.Skaa,
    description: `Прибавьте 17 очков к своему итоговому показателю храбрости.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 17,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Skaa,
            },
        },
    ],
    scoringRule: () => 17,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Tarah = {
    name: HeroNames.Tarah,
    description: `Обладает 1 шевроном. Прибавьте 14 очков к показателю храбрости воинов.`,
    game: `base`,
    suit: SuitNames.WARRIOR,
    rank: 1,
    points: 14,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Tarah,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Thrud = {
    name: HeroNames.Thrud,
    description: `Призвав этого героя, поместите её карту по своему выбору в любую колонку класса своей армии. На карту Труд нельзя положить никакую другую карту дворфа. Если карта дворфа или героя помещается в колонку, где расположена Труд, то игрок должен взять карту Труд в руку, поместить карту дворфа или героя и затем вернуть карту Труд в армию, в любую колонку по своему выбору. Игрок получает право призвать нового героя, если, разместив карту Труд, создал необходимую для этого новую линию 5 шевронов. В конце эпохи 1, при распределении карт знаков отличия, шеврон Труд учитывается в том воинском классе, где она расположена. В эпоху 2, после посещения последней таверны, но перед подсчётом итогового показателя храбрости, карта Труд перемещается из армии в командную зону. Труд прибавляет 13 очков к итоговому показателю храбрости игрока.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 13,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Thrud,
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
                stageName: Stages.PlaceCards,
                name: ConfigNames.PlaceCards,
                drawName: DrawNames.Thrud,
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
                name: HeroNames.Thrud,
            },
        },
    ],
    scoringRule: () => 13,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Uline = {
    name: HeroNames.Uline,
    description: `Прибавьте 9 очков к своему итоговому показателю храбрости. Как только вы призвали Улину и положили её карту в свою командную зону, сразу же берите в руку монеты, которые всё ещё лежат лицом вниз на вашем планшете. С этого момента и каждый раз во время подготовки к раунду на этапе «Ставки» игрок не выкладывает свои монеты на планшет, а держит их в своей руке. Во время посещения таверны на этапе «Открытие ставок», игрок ждёт, пока все другие эльвеланды откроют свои ставки и только после этого он выбирает монету из своей руки и кладёт её лицом вверх в область соответствующей таверны на своём планшете. Затем раунд продолжается в порядке, соответствующем ставкам игроков. Если игрок активировал своей ставкой обмен монет, то последним действием своего хода он выбирает из руки две монеты, номиналы которых он суммирует для получения новой монеты. Обмен происходит по обычным правилам, однако новую монету игрок сразу же берёт в руку, а не кладёт в кошель своего планшета. Во время улучшения монеты: • если игрок выбрал монету из руки, то новую монету он берёт так же в руку, • если игрок выбрал монету, лежащую на планшете, то новую монету он кладёт в то же место. Игрок может сделать ставку монетами из руки в таверне, которую посетит в ходе раунда. Монеты, лежащие на планшете, должны оставаться на нём до конца текущего раунда.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 9,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Uline,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: BuffNames.EveryTurn,
                    value: HeroNames.Uline,
                },
            },
        },
        {
            action: GetClosedCoinIntoPlayerHandAction.name,
        },
    ],
    scoringRule: () => 9,
};
// todo rework AddBuff?!
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Ylud = {
    name: HeroNames.Ylud,
    description: `Поместите эту карту в свою командную зону. В эпоху 1, сразу после посещения последней таверны, но до смотра войск, поместите карту Илуд в колонку любого воинского класса вашей армии. При распределении знаков отличий во время смотра войск, шеврон Илуд учитывается в качестве шеврона этого класса. Илуд остаётся в этой колонке до конца эпохи 2. Если вы призвали Илуд во время эпохи 2, поместите её карту в свою командную зону. В эпоху 2, сразу после посещения последней таверны, но до подсчёта итогового показателя храбрости: • если Илуд в командной зоне, то игрок помещает её в колонку любого воинского класса своей армии, • если Илуд в армии, игрок может переместить её в другую колонку воинского класса по своему выбору. Илуд будет учитываться в качестве дворфа того класса, где располагается. В конце эпохи 2, в зависимости от местоположения Илуд, она будет учитываться как кузнец или охотник, разведчик 11, воин 7, горняк 1. Если Илуд в колонке воинов, то её шеврон учитывается в сумме шевронов воинов при определении преимущества. Игрок получает право призвать нового героя, если с помощью карты Илуд завершит новую линию 5 шевронов. Если игрок обладает обеими картами героев Илуд и Труд, то при их активации важно учесть следующий порядок. После посещения последней таверны в эпоху 2 игрок сначала помещает Илуд в свою армию. В этот момент игрок может призвать нового героя, если с помощью Илуд создал линию 5 шевронов. Затем игрок перемещает Труд из армии в свою командную зону.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Ylud,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Zolkur = {
    name: HeroNames.Zolkur,
    description: `Adds 10 points to your Final Bravery Value. When you recruit him, immediately place him on the coins of your pouch. During your next trade, you trade the lower value coin instead of the higher as in a standard exchange. Then return Zolkur's card to the Command Zone.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 10,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Zolkur,
            },
        },
        {
            action: AddBuffToPlayerHeroAction.name,
            config: {
                buff: {
                    name: BuffNames.UpgradeNextCoin,
                    value: `min`,
                },
            },
        },
    ],
    scoringRule: () => 10,
};
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Zoral = {
    name: HeroNames.Zoral,
    description: `Обладает 3 шевронами.Прибавьте 1, 0 и 0 к сумме очков храбрости горняков. Зорал увеличивает сумму очков храбрости горняков на 1, а сумму шевронов – на 3.`,
    game: `base`,
    suit: SuitNames.MINER,
    rank: 3,
    points: 1,
    stack: [
        {
            action: AddHeroToCardsAction.name,
            config: {
                drawName: DrawNames.Zoral,
            },
        },
    ],
    scoringRule: () => 0,
};
/**
 * <h3>Конфиг героев.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех героев при инициализации игры.</li>
 * </ol>
 */
export const heroesConfig = {
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
