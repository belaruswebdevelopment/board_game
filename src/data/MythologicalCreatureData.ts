import { AutoActionFunctionNames, GiantBuffNames, GiantNames, GiantScoringFunctionNames, GodBuffNames, GodNames, MultiSuitCardNames, MythicalAnimalBuffNames, MythicalAnimalNames, MythicalAnimalScoringFunctionNames, SuitNames, ValkyryBuffNames, ValkyryNames, ValkyryScoringFunctionNames } from "../typescript/enums";
import type { GiantConfigType, GodConfigType, IGiantData, IGodData, IMythicalAnimalData, IValkyryData, MythicalAnimalConfigType, MythologicalCreatureConfigType, ValkyryConfigType } from "../typescript/interfaces";
import { StackData } from "./StackData";

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Gymir: IGiantData = {
    description: `Плените следующую карту разведчика, которую вы призовёте. Прибавьте очки храбрости пленённой карты, умноженные на 3, к итоговому показателю храбрости вашей армии в конце игры.`,
    name: GiantNames.Gymir,
    placedSuit: SuitNames.explorer,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantGymir,
    },
    scoringRule: {
        name: GiantScoringFunctionNames.GymirScoring,
    },
};

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Hrungnir: IGiantData = {
    description: `Плените следующую карту горняка, которую вы призовёте, и сразу же обменяйте каждую из ваших монет на монету с номиналом +2. Этот эффект не распространяется на обменные монеты с номиналом 0 или 3. Совершите обмен в порядке сверху вниз, начиная с монеты для таверны «Весёлый гоблин» и заканчивая монетами в вашем кошеле (сначала монета слева, затем справа). Сам процесс обмена монет происходит по обычным правилам. Если у вас есть Улина, то примените способность Хрунгира сначала к монетам, которые уже находятся на вашем планшете, а затем в любом порядке обменяйте монеты в вашей руке.`,
    name: GiantNames.Hrungnir,
    placedSuit: SuitNames.miner,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantHrungnir,
    },
    scoringRule: {
        name: GiantScoringFunctionNames.BasicGiantScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Skymir: IGiantData = {
    description: `Плените следующую карту охотника, которую вы призовёте. Затем возьмите 5 карт из резерва легенд рядом с королевской сокровищницей и выберите себе 2. Оставшиеся карты положите под низ стопки резерва легенд.`,
    name: GiantNames.Surt,
    placedSuit: SuitNames.hunter,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantSkymir,
    },
    actions: {
        name: AutoActionFunctionNames.AddMythologyCreatureCardsSkymirAction,
    },
    scoringRule: {
        name: GiantScoringFunctionNames.BasicGiantScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Surt: IGiantData = {
    description: `Плените следующую карту воина, которую вы призовёте. Прибавьте номинал вашей самой ценной монеты к итоговому показателю храбрости вашей армии в конце игры.`,
    name: GiantNames.Surt,
    placedSuit: SuitNames.warrior,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantSurt,
    },
    scoringRule: {
        name: GiantScoringFunctionNames.SurtScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об Гиганте.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Гиганта.</li>
 * </ol>
 */
const Thrivaldi: IGiantData = {
    description: `Плените следующую карту кузнеца, которую вы призовёте,и сразу же призовите героя. Этот новый герой не учитывается в общем количестве героев игрока, и не требует для себя линии 5 шевронов. • Невозможно призвать героя, если нельзя выполнить требования его призыва. • Если вы играете с дополнением Тингвеллир, Тривальди позволяет вам призвать карту героя, даже если вы владеете картой Мегингьорд.`,
    name: GiantNames.Thrivaldi,
    placedSuit: SuitNames.blacksmith,
    buff: {
        name: GiantBuffNames.PlayerHasActiveGiantThrivaldi,
    },
    scoringRule: {
        name: GiantScoringFunctionNames.BasicGiantScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Freyja: IGodData = {
    description: `В конце этапа «Появление дворфов» и до этапа «Ставки» вы можете поменять местами одну карту в таверне с картой в другой таверне. Однако Фрейя не может выбрать карту, отмеченную способностью ЛОКИ. Прибавьте 15 очков к итоговому показателю храбрости вашей армии в конце игры. Способность Фрейи применяется после способности Локи.`,
    name: GodNames.Freyja,
    points: 15,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodFreyja,
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Frigg: IGodData = {
    description: `Когда вы выбираете карту дворфа или королевской награды в таверне, поместите её под колоду текущей эпохи, затем возьмите с верха колоды 3 карты и оставьте у себя 1 из них. Положите 2 оставшиеся карты под колоду текущей эпохи в любом порядке. Теперь вы знаете 3 карты, которые появятся в последней таверне в конце эпохи. Прибавьте 12 очков к итоговому показателю храбрости вашей армии в конце игры. Способность Фригг не может быть активирована на последнем ходу эпохи 1 или 2.`,
    name: GodNames.Frigg,
    points: 12,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodFrigg,
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Loki: IGodData = {
    description: `В конце этапа «Появление дворфов» и до этапа «Ставки» вы можете поместить жетон власти Локи на 1 любую карту дворфа или королевской награды и зарезервировать её. Только вы можете забрать эту карту. Если вместо отмеченной жетоном власти ЛОКИ карты вы выбрали другую карту, сбросьте жетон власти Локи в конце вашего хода. Прибавьте 8 очков к итоговому показателю храбрости вашей армии в конце игры. Способность Локи применяется перед способностью Фрейи.`,
    name: GodNames.Loki,
    points: 8,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodLoki,
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Odin: IGodData = {
    description: `В конце своего хода вы можете вернуть одного из своих нейтральных героев в резерв и вместо него призвать другого нейтрального героя. Если возможно, примените эффект только что призванного героя. Не приносит победных очков в конце игры.`,
    name: GodNames.Odin,
    points: 0,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodOdin,
    },
};

/**
 * <h3>Данные об Боге.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Бога.</li>
 * </ol>
 */
const Thor: IGodData = {
    description: `Вы можете отменить эффект, обязывающий сбросить карту. Способность Тора предотвращает сброс 1 карты в результате эффектов карт Бонфур, Дагда, Брисингамен и Хёфуд. Прибавьте 8 очков к итоговому показателю храбрости вашей армии в конце игры.`,
    name: GodNames.Thor,
    points: 8,
    buff: {
        name: GodBuffNames.PlayerHasActiveGodThor,
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Durathor: IMythicalAnimalData = {
    description: `Обладает 1 шевроном охотников. Олень Дуратрор делает Дагду менее вспыльчивой, и когда она появляется в армии игрока, он сбрасывает на одну карту дворфов меньше.`,
    name: MythicalAnimalNames.Durathor,
    suit: SuitNames.hunter,
    buff: {
        name: MythicalAnimalBuffNames.DagdaDiscardOnlyOneCards,
    },
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.BasicMythicalAnimalScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Garm: IMythicalAnimalData = {
    description: `Обладает 2 шевронами разведчиков. Прибавьте 9 очков к вашему показателю храбрости разведчиков + 1 очко за каждый шеврон в колонке разведчиков (включая его собственные). Если во время смотра войск вы получили знак отличия разведчиков, возьмите 6 карт из колоды эпохи 2 (вместо 3) и оставьте себе 1, вернув оставшиеся карты в колоду.`,
    name: MythicalAnimalNames.Garm,
    points: 9,
    rank: 2,
    suit: SuitNames.explorer,
    buff: {
        name: MythicalAnimalBuffNames.ExplorerDistinctionGetSixCards,
    },
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.GarmScoring,
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Hraesvelg: IMythicalAnimalData = {
    description: `Обладает 1 шевроном кузнецов. Возьмите карту «Гуллинбурсти» и поместите её в любую колонку своей армии.`,
    name: MythicalAnimalNames.Hraesvelg,
    suit: SuitNames.blacksmith,
    stack: {
        player: [StackData.placeMultiSuitsCards(MultiSuitCardNames.Gullinbursti)],
    },
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.BasicMythicalAnimalScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Nidhogg: IMythicalAnimalData = {
    description: `Обладает 1 шевроном воинов. Прибавьте 5 очков к показателю храбрости воинов +2 очка за каждый шеврон в колонке воинов (включая его собственный).`,
    name: MythicalAnimalNames.Nidhogg,
    points: 5,
    suit: SuitNames.warrior,
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.NidhoggScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об Мифическом животном.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным Мифического животного.</li>
 * </ol>
 */
const Ratatosk: IMythicalAnimalData = {
    description: `Обладает 1 шевроном горняков. Прибавьте 2 очка к показателю храбрости горняков. При подсчёте показателя храбрости горняков каждая пара шевронов со значением 0 добавляет 1 очко храбрости перед умножением на количество шевронов.`,
    name: MythicalAnimalNames.Ratatosk,
    points: 2,
    suit: SuitNames.miner,
    buff: {
        name: MythicalAnimalBuffNames.RatatoskFinalScoring,
    },
    scoringRule: {
        name: MythicalAnimalScoringFunctionNames.BasicMythicalAnimalScoring,
        params: [0],
    },
};

/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Brynhildr: IValkyryData = {
    description: `Каждый раз, когда вы побеждаете на этапе «Открытие ставок» и можете первым выбрать дворфа в таверне, переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Значения шкалы силы: 0 – 3 – 6 – 10 – 16`,
    name: ValkyryNames.Brynhildr,
    buff: {
        name: ValkyryBuffNames.CountBidWinnerAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.BrynhildrScoring,
    },
};

/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Hildr: IValkyryData = {
    description: `Во время смотра войск, за каждый полученный знак отличия, переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Значения шкалы силы: 0 – 8 – 16 – 0`,
    name: ValkyryNames.Hildr,
    buff: {
        name: ValkyryBuffNames.CountDistinctionAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.HildrScoring,
    },
};

/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Olrun: IValkyryData = {
    description: `Поместите Эльрун в свою командную зону, а затем поместите на неё 1 жетон воинского класса. Каждый раз, когда вы помещаете в свою армию карту, содержащую шеврон выбранного класса, переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Нейтральные герои Илуд и Труд, а также Двойники Ольвюна и Гуллинбурсти не активируют способность Эльрун, так как шевроны этих карт нейтральны. Значения шкалы силы: 0 – 3 – 6 – 10 – 16`,
    name: ValkyryNames.Olrun,
    buff: {
        name: ValkyryBuffNames.CountPickedCardClassRankAmount,
    },
    stack: {
        player: [StackData.chooseSuitOlrun()],
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.OlrunScoring,
    },
};

/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Sigrdrifa: IValkyryData = {
    description: `Каждый раз, когда вы призываете карту героя (любым образом), переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Способность Одина не активирует способность Сигдрифы. Значения шкалы силы: 0 – 0 – 8 – 16`,
    name: ValkyryNames.Sigrdrifa,
    buff: {
        name: ValkyryBuffNames.CountPickedHeroAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.SigrdrifaScoring,
    },
};

/**
 * <h3>Данные об валькирии.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при обращении к данным валькирии.</li>
 * </ol>
 */
const Svafa: IValkyryData = {
    description: `Каждый раз, когда вы обмениваете или улучшаете монету с приростом переместите жетон силы на 1 деление вниз по шкале силы этой валькирии за каждую единицу прироста. Значения шкалы силы: 0 - 4 - 8 - 16`,
    name: ValkyryNames.Svafa,
    buff: {
        name: ValkyryBuffNames.CountBettermentAmount,
    },
    scoringRule: {
        name: ValkyryScoringFunctionNames.SvafaScoring,
    },
};

/**
 * <h3>Конфиг Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Мифических существ при инициализации игры.</li>
 * </ol>
 */
export const giantConfig: GiantConfigType = {
    Gymir,
    Hrungnir,
    Skymir,
    Surt,
    Thrivaldi,
};

/**
 * <h3>Конфиг Богов.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Богов при инициализации игры.</li>
 * </ol>
 */
export const godConfig: GodConfigType = {
    Freyja,
    Frigg,
    Loki,
    Odin,
    Thor,
};

/**
 * <h3>Конфиг Мифических животных.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Мифических животных при инициализации игры.</li>
 * </ol>
 */
export const mythicalAnimalConfig: MythicalAnimalConfigType = {
    Durathor,
    Garm,
    Hraesvelg,
    Nidhogg,
    Ratatosk,
};

/**
 * <h3>Конфиг Валькирий.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Валькирий при инициализации игры.</li>
 * </ol>
 */
export const valkyryConfig: ValkyryConfigType = {
    Brynhildr,
    Hildr,
    Olrun,
    Sigrdrifa,
    Svafa,
};

/**
 * <h3>Конфиг Мифических существ.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Происходит при создании всех Мифических существ при инициализации игры.</li>
 * </ol>
 */
export const mythologicalCreatureConfig: MythologicalCreatureConfigType = {
    2: 9,
    3: 9,
    4: 12,
    5: 15,
};
