import { HeroScoring } from "../score_helpers/HeroScoringHelpers";
import { AutoActionFunctionNames, BuffNames, GameNames, HeroNames, MultiSuitCardNames, SuitNames } from "../typescript/enums";
import type { IHeroConfig, IHeroData, SoloGameDifficultyLevelHeroesConfigType, SoloGameHeroesForBotConfigType, SoloGameHeroesForPlayerConfigType } from "../typescript/interfaces";
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
    game: GameNames.Basic,
    suit: SuitNames.Blacksmith,
    rank: 2,
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
    description: `Прибавьте 12 победных очков к итоговому показателю храбрости. Как только вы призвали Аннумию, сразу же посмотрите все карты в стопке сброса карт эпохи 1 и 2 (но не в стопке сброса карт лагеря) и выберите одну карту. - Если выбрана королевская награда, сразу примените её эффект и верните карту в сброс. - Если выбран дворф, поместите его в свою армию. Призовите героя, если создали новую линию 5 шевронов.`,
    game: GameNames.Thingvellir,
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
    game: GameNames.Basic,
    suit: SuitNames.Hunter,
    rank: 2,
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
    game: GameNames.Basic,
    scoringRule: HeroScoring,
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
    game: GameNames.Basic,
    suit: SuitNames.Blacksmith,
    rank: 3,
    pickValidators: {
        discardCard: {
            suit: SuitNames.Blacksmith,
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
const Crovax_The_Doppelganger: IHeroData = {
    name: HeroNames.Crovax_The_Doppelganger,
    description: `Кровакс — нейтральный герой, добавляющий 25 очков к итоговому показателю храбрости. Поместите его в свою командную зону и немедленно сбросьте последнюю карту дворфа из выбранной вами колонки. Это та же сила, что и у Бонфура, поэтому все правила, применимые к Бонфуру, применимы и к Кроваксу.`,
    game: GameNames.Thingvellir,
    points: 25,
    pickValidators: {
        discardCard: {
            suit: null,
        },
    },
    stack: [StackData.discardCardFromBoardCrovaxTheDoppelganger()],
    scoringRule: (): number => 25,
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
    game: GameNames.Basic,
    suit: SuitNames.Hunter,
    rank: 3,
    pickValidators: {
        discardCard: {
            suit: SuitNames.Hunter,
            number: 2,
        },
    },
    stack: [StackData.discardCardFromBoardDagda()],
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
    game: GameNames.Basic,
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
    game: GameNames.Basic,
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
    game: GameNames.Basic,
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
    game: GameNames.Basic,
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
    game: GameNames.Basic,
    scoringRule: (): number => 1,
};

// TODO For Solo game `Replace the coin of value 2 at the start of the game with a coin of value 9 and add 7 points to the final Bravery Value.`
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
    game: GameNames.Basic,
    points: 7,
    stack: [StackData.upgradeCoin(7)],
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
    name: HeroNames.Holda,
    description: `Прибавьте 12 победных очков к итоговому показателю храбрости. Как только вы призвали Хольду, сразу же возьмите карту наёмника или артефакта из лагеря.`,
    game: GameNames.Thingvellir,
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
    description: `Обладает 1 шевроном. Прибавьте 20 очков к показателю храбрости разведчиков. Чтобы призвать Хурию, игрок должен иметь в своей армии как минимум 5 шевронов в колонке разведчиков. Важно: если Труд и / или Илуд расположены в колонке разведчиков, то их шевроны учитываются для призыва Хурии.`,
    game: GameNames.Basic,
    suit: SuitNames.Explorer,
    rank: 1,
    points: 20,
    pickValidators: {
        conditions: {
            suitCountMin: {
                suit: SuitNames.Explorer,
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
    game: GameNames.Basic,
    suit: SuitNames.Explorer,
    rank: 1,
    points: 7,
    scoringRule: HeroScoring,
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
    description: `Прибавьте 8 победных очков к итоговому показателю храбрости. Ярика – нейтральный герой, поэтому, призвав её, положите карту в свою командную зону. Во время каждого улучшения или обмена монет увеличьте номинал монеты дополнительно на +2.`,
    game: GameNames.Basic,
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
    description: `Прибавьте 4 победных очка к итоговому показателю храбрости. Как только вы призвали Крада, сразу же улучшите одну свою монету с наименьшим номиналом на +10. Обменная монета с номиналом 0 не может быть улучшена.`,
    game: GameNames.Thingvellir,
    points: 4,
    actions: {
        name: AutoActionFunctionNames.UpgradeMinCoinAction,
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
    description: `Обладает 2 шевронами. Прибавьте 7 и 0 очков к показателю храбрости воинов.`,
    game: GameNames.Basic,
    suit: SuitNames.Warrior,
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
    description: `Обладает 1 шевроном. Прибавьте 3 к сумме очков храбрости горняков. Локдур увеличивает сумму очков храбрости горняков на 3, а сумму шевронов на 1.`,
    game: GameNames.Basic,
    suit: SuitNames.Miner,
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
    description: `Прибавьте 9 победных очков к итоговому показателю храбрости. Как только вы призвали Ольвюна, сразу же возьмите две карты «Двойник Ольвюна» и положите их в две разные колонки своей армии. В результате размещения Двойников Ольвюна могут возникнуть новые линии 5 шевронов, в этом случае игрок может призвать новых героев. Призрачные двойники обладают значением храбрости 0, но могут стать дворфами любого воинского класса. Они могут быть отправлены в сброс эффектами карт «Дагда», «Бонфур», «Брисингамен» и «Хёфуд». Двойники Ольвюна не являются героями. Если карта «Двойник Ольвюна» единственная в колонке, то положите на неё жетон воинского класса для напоминания о воинском классе колонки.`,
    game: GameNames.Thingvellir,
    points: 9,
    stack: [StackData.placeMultiSuitsCards(MultiSuitCardNames.OlwinsDouble)],
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
    game: GameNames.Basic,
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
    game: GameNames.Basic,
    suit: SuitNames.Warrior,
    rank: 1,
    points: 14,
    scoringRule: (): number => 0,
};

// TODO For Solo Game `She is the most formidable opponent since she will always be present in your army to try to complete the guard lines and recruit the Dwerg brothers.During the countdown, she returns to the Command Zone and adds 13 points to the Final Bravery Value.`
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
    game: GameNames.Basic,
    points: 13,
    stack: [StackData.placeThrudHero()],
    buff: {
        name: BuffNames.MoveThrud,
    },
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
    game: GameNames.Basic,
    points: 9,
    actions: {
        name: AutoActionFunctionNames.GetClosedCoinIntoPlayerHandAction,
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
    game: GameNames.Basic,
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
    description: `Прибавьте 10 победных очков к итоговому показателю храбрости. Как только вы призвали Солькура, сразу же положите его карту на монеты в кошеле. Во время следующего обмена, в отличие от стандартных правил, обменяйте монету с наименьшим номиналом, а не с наибольшим. После обмена положите карту «Солькур» в командную зону.`,
    game: GameNames.Thingvellir,
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
    description: `Обладает 3 шевронами. Прибавьте 1, 0 и 0 к сумме очков храбрости горняков. Зорал увеличивает сумму очков храбрости горняков на 1, а сумму шевронов – на 3.`,
    game: GameNames.Basic,
    suit: SuitNames.Miner,
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
    Crovax_The_Doppelganger,
    Andumia,
    Holda,
    Khrad,
    Olwin,
    Zolkur,
};

/**
 * <h3>Конфиг героев для выбора соло ботом.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании списка героев для выбора соло ботом при инициализации игры.</li>
 * </ol>
 */
export const soloGameHeroesForBotConfig: SoloGameHeroesForBotConfigType = {
    Dwerg_Aesir,
    Dwerg_Bergelmir,
    Dwerg_Jungir,
    Dwerg_Sigmir,
    Dwerg_Ymir,
};

/**
 * <h3>Конфиг героев для выбора игроком в соло игре.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании списка героев для выбора игроком в соло игре при инициализации игры.</li>
 * </ol>
 */
export const soloGameHeroesForPlayerConfig: SoloGameHeroesForPlayerConfigType = {
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
};

/**
 * <h3>Конфиг героев для выбора уровня сложности.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании списка героев для выбора уровня сложности для соло бота при инициализации игры.</li>
 * </ol>
 */
export const soloGameDifficultyLevelHeroesConfig: SoloGameDifficultyLevelHeroesConfigType = {
    Astrid,
    Grid,
    Skaa,
    Thrud,
    Uline,
    Ylud,
};
