import { GetClosedCoinIntoPlayerHandAction, UpgradeCoinAction } from "../actions/AutoActions";
import { GetMaxCoinValue } from "../helpers/CoinHelpers";
import { TotalRank } from "../helpers/ScoreHelpers";
import { BuffNames, HeroNames, SuitNames } from "../typescript/enums";
import { IHeroConfig, IHeroData } from "../typescript/hero_card_interfaces";
import { IPublicPlayer } from "../typescript/player_interfaces";
import { StackData } from "./StackData";

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Aegur: IHeroData = {
    name: HeroNames.Aegur,
    description: `Обладает 2 шевронами.`,
    game: `base`,
    suit: SuitNames.BLACKSMITH,
    rank: 2,
    points: null,
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
    name: HeroNames.Andumia,
    description: `Adds 12 points to your Final Bravery Value. When you recruit her, immediately look at all the cards in the discard pile and keep one (Royal Offering card or Dwarf card). - If it is a Royal Offering card, its effect is immediately applied, then the card is returned to the discard. - If it is a Dwarf card, place it in your army. Its placement can trigger the recruitment of a Hero card.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 12,
    validators: {
        pickDiscardCardToStack: {},
    },
    stack: [StackData.pickDiscardCardAndumia()],
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
    name: HeroNames.Aral,
    description: `Обладает 2 шевронами.`,
    game: `base`,
    suit: SuitNames.HUNTER,
    rank: 2,
    points: null,
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
    name: HeroNames.Astrid,
    description: `Прибавьте к своему итоговому показателю храбрости номинал своей самой ценной монеты.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
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
    name: HeroNames.Bonfur,
    description: `Обладает 3 шевронами. Призвав Бонфура, сразу же поместите его карту в колонку кузнецов и отправьте в сброс одну нижнюю карту дворфа (не героя) из другой колонки своей армии по своему выбору.`,
    game: `base`,
    suit: SuitNames.BLACKSMITH,
    rank: 3,
    points: null,
    validators: {
        discardCard: {
            suit: SuitNames.BLACKSMITH,
        },
    },
    stack: [StackData.discardCardFromBoardBonfur()],
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
    name: HeroNames.Dagda,
    description: `Обладает 3 шевронами. Призвав Дагду, сразу же поместите её карту в колонку охотников и отправьте в сброс по одной нижней карте дворфов (не героев) из двух других колонок своей армии по своему выбору.`,
    game: `base`,
    suit: SuitNames.HUNTER,
    rank: 3,
    points: null,
    validators: {
        discardCard: {
            suit: SuitNames.BLACKSMITH,
            number: 2,
        },
    },
    stack: [StackData.discardCardFromBoardDagda(2)],
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
    name: HeroNames.Dwerg_Aesir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
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
    name: HeroNames.Dwerg_Bergelmir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
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
    name: HeroNames.Dwerg_Jungir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
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
    name: HeroNames.Dwerg_Sigmir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
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
    name: HeroNames.Dwerg_Ymir,
    description: `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
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
    name: HeroNames.Grid,
    description: `Прибавьте 7 очков к своему итоговому показателю храбрости. Когда вы призвали Грид и положили её карту в свою командную зону, сразу же улучшите на + 7 номинал одной из своих монет.`,
    game: "base",
    suit: null,
    rank: null,
    points: 7,
    stack: [StackData.upgradeCoin(7)],
    scoringRule: (): number => 7,
};

// TODO Check Если, размещая карты в конце эпох, игрок призывает героя Хольду и благодаря её эффекту берёт карту наёмника из лагеря, то он сразу же кладёт эту карту в армию, а не в командную зону.
/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Holda: IHeroData = {
    name: HeroNames.Holda,
    description: `Adds 12 points to your Final Bravery Value. When you recruit her, immediately choose a Mercenary or Artifact card available at the Camp.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 12,
    buff: {
        name: BuffNames.GoCampOneTime,
    },
    validators: {
        pickCampCardToStack: {},
    },
    stack: [StackData.pickCampCardHolda()],
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
    name: HeroNames.Hourya,
    description: `Обладает 1 шевроном.Прибавьте 20 очков к показателю храбрости разведчиков. Чтобы призвать Хурию, игрок должен иметь в своей армии как минимум 5 шевронов в колонке разведчиков. Важно: если Труд и / или Илуд расположены в колонке разведчиков, то их шевроны учитываются для призыва Хурии.`,
    game: `base`,
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 20,
    validators: {
        conditions: {
            suitCountMin: {
                suit: SuitNames.EXPLORER,
                value: 5,
            },
        },
    },
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
    name: HeroNames.Idunn,
    description: `Обладает 1 шевроном. Прибавьте 7 очков к показателю храбрости разведчиков плюс по 2 очка за каждый шеврон в колонке Разведчиков (включая её собственный).`,
    game: `base`,
    suit: SuitNames.EXPLORER,
    rank: 1,
    points: 7,
    scoringRule: (player?: IPublicPlayer): number => player !== undefined ?
        player.cards[SuitNames.EXPLORER].reduce(TotalRank, 0) * 2 : 0,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Jarika: IHeroData = {
    name: HeroNames.Jarika,
    description: `Adds 8 points to your Final Bravery Value. As a neutral Hero, place her in your Command Zone. During a coin transformation or a coin trade(Royal Offering, Warrior Distinction, Grid), increase the value of the desired sum by + 2.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 8,
    buff: {
        name: BuffNames.UpgradeCoin,
    },
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
    name: HeroNames.Khrad,
    description: `Adds 4 points to your Final Bravery Value. When you recruit him, immediately add + 10 to your lowest value coin (except the Trading coin).`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 4,
    buff: {
        name: BuffNames.Coin,
    },
    actions: {
        name: UpgradeCoinAction.name,
        params: [10],
    },
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
    name: HeroNames.Kraal,
    description: `Обладает 2 шевронами.Прибавьте 7 и 0 очков к показателю храбрости воинов.`,
    game: `base`,
    suit: SuitNames.WARRIOR,
    rank: 2,
    points: 7,
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
    name: HeroNames.Lokdur,
    description: `Обладает 1 шевроном.Прибавьте 3 к сумме очков храбрости горняков. Локдур увеличивает сумму очков храбрости горняков на 3, а сумму шевронов на 1.`,
    game: `base`,
    suit: SuitNames.MINER,
    rank: 1,
    points: 3,
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
    name: HeroNames.Olwin,
    description: `Adds 9 points to your Final Bravery Value. When you recruit him, also take his two doubles whose Bravery value is 0 and then place each of these cards in two different columns of your choice. Their placement may result in the recruitment of a Hero card. «Olwin's double» cards are considered Dwarf cards of the class in which they are placed and can be destroyed by the powers of Dagda, Bonfur, Brisingamens, and Hofud.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 9,
    stack: [StackData.placeOlwinCards(2)],
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
    name: HeroNames.Skaa,
    description: `Прибавьте 17 очков к своему итоговому показателю храбрости.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 17,
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
    name: HeroNames.Tarah,
    description: `Обладает 1 шевроном. Прибавьте 14 очков к показателю храбрости воинов.`,
    game: `base`,
    suit: SuitNames.WARRIOR,
    rank: 1,
    points: 14,
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
    name: HeroNames.Thrud,
    description: `Призвав этого героя, поместите её карту по своему выбору в любую колонку класса своей армии. На карту Труд нельзя положить никакую другую карту дворфа. Если карта дворфа или героя помещается в колонку, где расположена Труд, то игрок должен взять карту Труд в руку, поместить карту дворфа или героя и затем вернуть карту Труд в армию, в любую колонку по своему выбору. Игрок получает право призвать нового героя, если, разместив карту Труд, создал необходимую для этого новую линию 5 шевронов. В конце эпохи 1, при распределении карт знаков отличия, шеврон Труд учитывается в том воинском классе, где она расположена. В эпоху 2, после посещения последней таверны, но перед подсчётом итогового показателя храбрости, карта Труд перемещается из армии в командную зону. Труд прибавляет 13 очков к итоговому показателю храбрости игрока.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 13,
    stack: [StackData.placeThrudHero()],
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
    name: HeroNames.Uline,
    description: `Прибавьте 9 очков к своему итоговому показателю храбрости. Как только вы призвали Улину и положили её карту в свою командную зону, сразу же берите в руку монеты, которые всё ещё лежат лицом вниз на вашем планшете. С этого момента и каждый раз во время подготовки к раунду на этапе «Ставки» игрок не выкладывает свои монеты на планшет, а держит их в своей руке. Во время посещения таверны на этапе «Открытие ставок», игрок ждёт, пока все другие эльвеланды откроют свои ставки и только после этого он выбирает монету из своей руки и кладёт её лицом вверх в область соответствующей таверны на своём планшете. Затем раунд продолжается в порядке, соответствующем ставкам игроков. Если игрок активировал своей ставкой обмен монет, то последним действием своего хода он выбирает из руки две монеты, номиналы которых он суммирует для получения новой монеты. Обмен происходит по обычным правилам, однако новую монету игрок сразу же берёт в руку, а не кладёт в кошель своего планшета. Во время улучшения монеты: • если игрок выбрал монету из руки, то новую монету он берёт так же в руку, • если игрок выбрал монету, лежащую на планшете, то новую монету он кладёт в то же место. Игрок может сделать ставку монетами из руки в таверне, которую посетит в ходе раунда. Монеты, лежащие на планшете, должны оставаться на нём до конца текущего раунда.`,
    game: `base`,
    suit: null,
    rank: null,
    points: 9,
    actions: {
        name: GetClosedCoinIntoPlayerHandAction.name,
    },
    buff: {
        name: BuffNames.EveryTurn,
    },
    scoringRule: (): number => 9,
};

/**
 * <h3>Данные о герое.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным героя.</li>
 * </ol>
 */
const Ylud: IHeroData = {
    name: HeroNames.Ylud,
    description: `Поместите эту карту в свою командную зону. В эпоху 1, сразу после посещения последней таверны, но до смотра войск, поместите карту Илуд в колонку любого воинского класса вашей армии. При распределении знаков отличий во время смотра войск, шеврон Илуд учитывается в качестве шеврона этого класса. Илуд остаётся в этой колонке до конца эпохи 2. Если вы призвали Илуд во время эпохи 2, поместите её карту в свою командную зону. В эпоху 2, сразу после посещения последней таверны, но до подсчёта итогового показателя храбрости: • если Илуд в командной зоне, то игрок помещает её в колонку любого воинского класса своей армии, • если Илуд в армии, игрок может переместить её в другую колонку воинского класса по своему выбору. Илуд будет учитываться в качестве дворфа того класса, где располагается. В конце эпохи 2, в зависимости от местоположения Илуд, она будет учитываться как кузнец или охотник, разведчик 11, воин 7, горняк 1. Если Илуд в колонке воинов, то её шеврон учитывается в сумме шевронов воинов при определении преимущества. Игрок получает право призвать нового героя, если с помощью карты Илуд завершит новую линию 5 шевронов. Если игрок обладает обеими картами героев Илуд и Труд, то при их активации важно учесть следующий порядок. После посещения последней таверны в эпоху 2 игрок сначала помещает Илуд в свою армию. В этот момент игрок может призвать нового героя, если с помощью Илуд создал линию 5 шевронов. Затем игрок перемещает Труд из армии в свою командную зону.`,
    game: `base`,
    suit: null,
    rank: null,
    points: null,
    buff: {
        name: BuffNames.EndTier,
    },
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
    name: HeroNames.Zolkur,
    description: `Adds 10 points to your Final Bravery Value. When you recruit him, immediately place him on the coins of your pouch. During your next trade, you trade the lower value coin instead of the higher as in a standard exchange. Then return Zolkur's card to the Command Zone.`,
    game: `thingvellir`,
    suit: null,
    rank: null,
    points: 10,
    buff: {
        name: BuffNames.UpgradeNextCoin,
    },
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
    name: HeroNames.Zoral,
    description: `Обладает 3 шевронами.Прибавьте 1, 0 и 0 к сумме очков храбрости горняков. Зорал увеличивает сумму очков храбрости горняков на 1, а сумму шевронов – на 3.`,
    game: `base`,
    suit: SuitNames.MINER,
    rank: 3,
    points: 1,
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
    Kraal,
    Tarah,
    Aral,
    Dagda,
    Lokdur,
    Zoral,
    Aegur,
    Bonfur,
    Hourya,
    Idunn,
    Astrid,
    Dwerg_Aesir,
    Dwerg_Bergelmir,
    Dwerg_Jungir,
    Dwerg_Sigmir,
    Dwerg_Ymir,
    Grid,
    Skaa,
    Thrud,
    Uline,
    Ylud,
    Jarika,
    Andumia,
    Holda,
    Khrad,
    Olwin,
    Zolkur,
};
