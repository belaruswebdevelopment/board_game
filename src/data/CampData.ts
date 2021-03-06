import { ArtefactScoring } from "../score_helpers/ArtefactScoringHelpers";
import { ArtefactNames, AutoActionFunctionNames, BuffNames, SuitNames } from "../typescript/enums";
import type { IArtefactConfig, IArtefactData, MercenaryType, SuitPropertyType } from "../typescript/interfaces";
import { StackData } from "./StackData";

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Brisingamens: IArtefactData = {
    name: ArtefactNames.Brisingamens,
    description: `Взяв этот артефакт, сразу же посмотрите все карты в стопке сброса карт эпохи 1 и 2 (но не в стопке сброса карт лагеря) и выберите две карты. Это могут быть карты королевская награда и/или дворф в любом сочетании. В желаемом порядке выполните следующие действия: - улучшите монету, если выбрали карту королевская награда, - сразу же поместите в свою армию карту дворфа и призовите героя, если создали новую линию 5 шевронов. В конце эпохи 2 перед подсчётом победных очков сбросьте одну карту дворфа из своей армии. Эта карта может быть сброшена из колонки любого воинского класса по выбору игрока, но нельзя сбрасывать карту героя.`,
    tier: 1,
    buff: {
        name: BuffNames.DiscardCardEndGame,
    },
    validators: {
        pickDiscardCardToStack: {},
    },
    stack: [
        StackData.pickDiscardCardBrisingamens(),
        StackData.pickDiscardCardBrisingamens(3),
    ],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Draupnir: IArtefactData = {
    name: ArtefactNames.Draupnir,
    description: `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 6 победных очков за каждую свою монету с номиналом 15 или выше.`,
    tier: 0,
    scoringRule: ArtefactScoring,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Fafnir_Baleygr: IArtefactData = {
    name: ArtefactNames.Fafnir_Baleygr,
    description: `Игрок, владеющий этим артефактом, может брать карты из лагеря вместо таверны, если лагерь не посещал игрок, который получил первенство на этапе «Открытие ставок».`,
    tier: 0,
    buff: {
        name: BuffNames.GoCamp,
    },
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Gjallarhorn: IArtefactData = {
    name: ArtefactNames.Gjallarhorn,
    description: `Взяв этот артефакт, сразу же призовите в свою армию нового героя, независимо от количества завершённых линий 5 шевронов. Данное исключение действует только один раз. Чтобы призвать следующего героя игроку будет необходимо соблюсти основное правило: можно призвать нового героя, если собранных линий 5 шевронов на 1 больше, чем героев в армии игрока. Гьяллархорн позволяет игроку призывать героя, даже если он обладает картой мегингьорд. Нельзя призвать героя, если игрок не может выполнить условия, необходимые для призыва.`,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.AddPickHeroAction,
        params: [2],
    },
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Hofud: IArtefactData = {
    name: ArtefactNames.Hofud,
    description: `Когда один из игроков получает этот артефакт, остальные игроки сразу же сбрасывают по одной карте воинов из своих армий. Игроки могут выбрать любую карту класса воин, за исключением карт героев. `,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.StartDiscardSuitCardAction,
    },
    stack: [StackData.discardSuitCardHofud()],
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Hrafnsmerki: IArtefactData = {
    name: ArtefactNames.Hrafnsmerki,
    description: `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 5 победных очков за каждую свою карту наёмника.`,
    tier: 1,
    scoringRule: ArtefactScoring,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Jarnglofi: IArtefactData = {
    name: ArtefactNames.Jarnglofi,
    description: `Взяв этот артефакт, сразу же положите в сброс свою обменную монету (с номиналом 0 или 3). Если обменная монета была использована в качестве ставки в таверне, которую ещё не посещали, то игрок всё равно должен её сбросить. В этом случае он лишается ставки и во время посещения таверны не сможет взять ни одной карты. Во время подсчёта победных очков в конце эпохи 2 прибавьте 24 победных очка к своему итоговому показателю храбрости.`,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.DiscardTradingCoinAction,
    },
    scoringRule: (): number => 24,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Megingjord: IArtefactData = {
    name: ArtefactNames.Megingjord,
    description: `С момента получения этого артефакта и до конца игры владелец не может призывать героев в свою армию после создания линии 5 шевронов. Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 28 победных очков. Гьяллархорн позволяет игроку призывать героев, даже если он владеет Мегингьордом.`,
    tier: 0,
    buff: {
        name: BuffNames.NoHero,
    },
    scoringRule: (): number => 28,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Mjollnir: IArtefactData = {
    name: ArtefactNames.Mjollnir,
    description: `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 2 победных очка за каждый шеврон в колонке одного воинского класса по выбору игрока.`,
    tier: 1,
    buff: {
        name: BuffNames.GetMjollnirProfit,
    },
    scoringRule: ArtefactScoring,
};

const Odroerir_The_Mythic_Cauldron: IArtefactData = {
    name: ArtefactNames.Odroerir_The_Mythic_Cauldron,
    description: `Во время подготовки отложите Одрерир в сторону. Перемешайте карты Лагеря 2-й эпохи, затем положите Одрерир на верх колоды. Таким образом, в начале Эпохи 2 Одрерир будет среди 5 доступных карт лагеря. Как только эльвеланд берет карту из лагеря, положите самую маленькую монету из Королевской сокровищницы на Одрерир. Делайте это до тех пор, пока эльвеланд не возьмет карту Одрерир с монетами на ней. Карта Одрерир с ее монетами находится в командной зоне. В конце игры Одрерир прибавляет сумму всех монет к вашему итоговому значению храбрости.`,
    tier: 1,
    actions: {
        name: AutoActionFunctionNames.FinishOdroerirTheMythicCauldronAction,
    },
    scoringRule: ArtefactScoring,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Svalinn: IArtefactData = {
    name: ArtefactNames.Svalinn,
    description: `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 5 победных очков за каждую свою карту героя.`,
    tier: 0,
    scoringRule: ArtefactScoring,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Vegvisir: IArtefactData = {
    name: ArtefactNames.Vegvisir,
    description: `Взяв карту этого артефакта, сразу же положите её в колонку разведчиков своей армии. Если таким образом создаётся новая линия 5 шевронов, сразу же призовите нового героя. Карта Вегвисир обладает одним шевроном и прибавляет 13 победных очков к показателю храбрости разведчиков. `,
    tier: 0,
    suit: SuitNames.Explorer,
    rank: 1,
    points: 13,
    scoringRule: (): number => 0,
};

/**
 * <h3>Данные об артефакте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным артефакта.</li>
 * </ol>
 */
const Vidofnir_Vedrfolnir: IArtefactData = {
    name: ArtefactNames.Vidofnir_Vedrfolnir,
    description: `Взяв этот артефакт, сразу же откройте монеты в вашем кошеле и улучшите на +2 одну из них и на +3 другую. Улучшение монет можно производить в любой очерёдности. Если одна из монет в кошеле обменная (0 или особая обменная монета Охотников с номиналом 3), тогда улучшите на +5 вторую монету в кошеле.`,
    tier: 0,
    actions: {
        name: AutoActionFunctionNames.StartVidofnirVedrfolnirAction,
    },
    scoringRule: (): number => 0,
};

/**
 * <h3>Конфиг карт наёмников для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов для лагеря при инициализации игры.</li>
 * </ol>
 */
export const mercenariesConfig: Partial<SuitPropertyType<MercenaryType>>[][] = [
    [
        {
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 6,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 6,
            },
            blacksmith: {
                suit: SuitNames.Blacksmith,
                rank: 1,
                points: null,
            },
        },
        {
            hunter: {
                suit: SuitNames.Hunter,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 6,
            },
        },
        {
            hunter: {
                suit: SuitNames.Hunter,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.Miner,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: SuitNames.Blacksmith,
                rank: 1,
                points: null,
            },
            miner: {
                suit: SuitNames.Miner,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 11,
            },
        },
    ],
    [
        {
            hunter: {
                suit: SuitNames.Hunter,
                rank: 1,
                points: null,
            },
            blacksmith: {
                suit: SuitNames.Blacksmith,
                rank: 1,
                points: null,
            },
        },
        {
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 6,
            },
            miner: {
                suit: SuitNames.Miner,
                rank: 1,
                points: 1,
            },
        },
        {
            blacksmith: {
                suit: SuitNames.Blacksmith,
                rank: 1,
                points: null,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 8,
            },
        },
        {
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 6,
            },
            hunter: {
                suit: SuitNames.Hunter,
                rank: 1,
                points: null,
            },
        },
        {
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 8,
            },
            miner: {
                suit: SuitNames.Miner,
                rank: 1,
                points: 1,
            },
        },
        {
            warrior: {
                suit: SuitNames.Warrior,
                rank: 1,
                points: 9,
            },
            explorer: {
                suit: SuitNames.Explorer,
                rank: 1,
                points: 11,
            },
        },
    ],
];

/**
 * <h3>Конфиг карт артефактов для лагеря.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех карт артефактов для лагеря при инициализации игры.</li>
 * </ol>
 */
export const artefactsConfig: IArtefactConfig = {
    Brisingamens,
    Draupnir,
    Fafnir_Baleygr,
    Gjallarhorn,
    Hofud,
    Hrafnsmerki,
    Jarnglofi,
    Megingjord,
    Mjollnir,
    Odroerir_The_Mythic_Cauldron,
    Svalinn,
    Vegvisir,
    Vidofnir_Vedrfolnir,
};
