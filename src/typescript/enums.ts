// Suit Start
/**
 * <h3>Перечисление для названия фракции дворфов.</h3>
 */
export const enum SuitNames {
    blacksmith = `blacksmith`,
    explorer = `explorer`,
    hunter = `hunter`,
    miner = `miner`,
    warrior = `warrior`,
}

/**
 * <h3>Перечисление для русского названия фракции дворфов.</h3>
 */
export enum SuitRusNames {
    blacksmith = `Кузнецы`,
    explorer = `Разведчики`,
    hunter = `Охотники`,
    miner = `Горняки`,
    warrior = `Воины`,
}

/**
 * <h3>Перечисление для названия описания фракции дворфов.</h3>
 */
export const enum SuitDescriptionNames {
    Blacksmith = `Их показатель храбрости определяется математической последовательностью (+3, +4, +5, +6, …).`,
    Explorer = `Их показатель храбрости равен сумме очков храбрости разведчиков в армии игрока.`,
    Hunter = `Их показатель храбрости равен квадрату числа карт охотников в армии игрока.`,
    Miner = `Их показатель храбрости равен произведению суммы очков храбрости на сумму шевронов горняков в армии игрока.`,
    Warrior = `Их показатель храбрости равен сумме очков храбрости всех воинов в армии игрока. Однако игрок, который обладает наибольшим количеством шевронов воинов, добавляет к показателю храбрости номинал своей самой ценной монеты. В случае равного количества шевронов у нескольких игроков все эти игроки прибавляют номинал своей самой ценной монеты к показателю храбрости своих воинов.`,
}

/**
 * <h3>Перечисление для названия CSS класса для цветов фракции дворфов.</h3>
 */
export const enum SuitBGColorNames {
    Blacksmith = `bg-purple-600`,
    Explorer = `bg-blue-500`,
    Hunter = `bg-green-600`,
    Miner = `bg-yellow-600`,
    Warrior = `bg-red-600`,
}
// Suit End

// Giant Start
/**
 * <h3>Перечисление для названия карты гиганта.</h3>
 */
export const enum GiantNames {
    Gymir = `Gymir`,
    Hrungnir = `Hrungnir`,
    Skymir = `Skymir`,
    Surt = `Surt`,
    Thrivaldi = `Thrivaldi`,
}

/**
 * <h3>Перечисление для русского названия карт гигантов.</h3>
 */
export const enum GiantRusNames {
    Gymir = `Гюмир`,
    Hrungnir = `Хрунгнир`,
    Skymir = `Скрюмир`,
    Surt = `Сурт`,
    Thrivaldi = `Тривальди`,
}

/**
 * <h3>Перечисление для названия описания карты гиганта.</h3>
 */
export const enum GiantDescriptionNames {
    Gymir = `Плените следующую карту разведчика, которую вы призовёте. Прибавьте очки храбрости пленённой карты, умноженные на 3, к итоговому показателю храбрости вашей армии в конце игры.`,
    Hrungnir = `Плените следующую карту горняка, которую вы призовёте, и сразу же обменяйте каждую из ваших монет на монету с номиналом +2. Этот эффект не распространяется на обменные монеты с номиналом 0 или 3. Совершите обмен в порядке сверху вниз, начиная с монеты для таверны «Весёлый гоблин» и заканчивая монетами в вашем кошеле (сначала монета слева, затем справа). Сам процесс обмена монет происходит по обычным правилам. Если у вас есть Улина, то примените способность Хрунгира сначала к монетам, которые уже находятся на вашем планшете, а затем в любом порядке обменяйте монеты в вашей руке.`,
    Skymir = `Плените следующую карту охотника, которую вы призовёте. Затем возьмите 5 карт из резерва легенд рядом с королевской сокровищницей и выберите себе 2. Оставшиеся карты положите под низ стопки резерва легенд.`,
    Surt = `Плените следующую карту воина, которую вы призовёте. Прибавьте номинал вашей самой ценной монеты к итоговому показателю храбрости вашей армии в конце игры.`,
    Thrivaldi = `Плените следующую карту кузнеца, которую вы призовёте,и сразу же призовите героя. Этот новый герой не учитывается в общем количестве героев игрока, и не требует для себя линии 5 шевронов. • Невозможно призвать героя, если нельзя выполнить требования его призыва. • Если вы играете с дополнением Тингвеллир, Тривальди позволяет вам призвать карту героя, даже если вы владеете картой Мегингьорд.`,
}
// Giant End

// God Start
/**
 * <h3>Перечисление для названия карты бога.</h3>
 */
export const enum GodNames {
    Freyja = `Freyja`,
    Frigg = `Frigg`,
    Loki = `Loki`,
    Odin = `Odin`,
    Thor = `Thor`,
}

/**
 * <h3>Перечисление для русского названия карты бога.</h3>
 */
export const enum GodRusNames {
    Freyja = `Фрейя`,
    Frigg = `Фригг`,
    Loki = `Локи`,
    Odin = `Один`,
    Thor = `Тор`,
}

/**
 * <h3>Перечисление для названия описания карты бога.</h3>
 */
export const enum GodDescriptionNames {
    Freyja = `В конце этапа «Появление дворфов» и до этапа «Ставки» вы можете поменять местами одну карту в таверне с картой в другой таверне. Однако Фрейя не может выбрать карту, отмеченную способностью ЛОКИ. Прибавьте 15 очков к итоговому показателю храбрости вашей армии в конце игры. Способность Фрейи применяется после способности Локи.`,
    Frigg = `Когда вы выбираете карту дворфа или королевской награды в таверне, поместите её под колоду текущей эпохи, затем возьмите с верха колоды 3 карты и оставьте у себя 1 из них. Положите 2 оставшиеся карты под колоду текущей эпохи в любом порядке. Теперь вы знаете 3 карты, которые появятся в последней таверне в конце эпохи. Прибавьте 12 очков к итоговому показателю храбрости вашей армии в конце игры. Способность Фригг не может быть активирована на последнем ходу эпохи 1 или 2.`,
    Loki = `В конце этапа «Появление дворфов» и до этапа «Ставки» вы можете поместить жетон власти Локи на 1 любую карту дворфа или королевской награды и зарезервировать её. Только вы можете забрать эту карту. Если вместо отмеченной жетоном власти ЛОКИ карты вы выбрали другую карту, сбросьте жетон власти Локи в конце вашего хода. Прибавьте 8 очков к итоговому показателю храбрости вашей армии в конце игры. Способность Локи применяется перед способностью Фрейи.`,
    Odin = `В конце своего хода вы можете вернуть одного из своих нейтральных героев в резерв и вместо него призвать другого нейтрального героя. Если возможно, примените эффект только что призванного героя. Не приносит победных очков в конце игры.`,
    Thor = `Вы можете отменить эффект, обязывающий сбросить карту. Способность Тора предотвращает сброс 1 карты в результате эффектов карт Бонфур, Дагда, Брисингамен и Хёфуд. Прибавьте 8 очков к итоговому показателю храбрости вашей армии в конце игры.`,
}
// God End

// MythicalAnimal Start
/**
 * <h3>Перечисление для названия карты мифического животного.</h3>
 */
export const enum MythicalAnimalNames {
    Durathor = `Durathor`,
    Garm = `Garm`,
    Hraesvelg = `Hraesvelg`,
    Nidhogg = `Nidhogg`,
    Ratatosk = `Ratatosk`,
}

/**
 * <h3>Перечисление для русского названия карты мифического животного.</h3>
 */
export const enum MythicalAnimalRusNames {
    Durathor = `Дуратрор`,
    Garm = `Гарм`,
    Hraesvelg = `Хресвельг`,
    Nidhogg = `Нидхёгг`,
    Ratatosk = `Рататоск`,
}

/**
 * <h3>Перечисление для названия описания карты мифического животного.</h3>
 */
export const enum MythicalAnimalDescriptionNames {
    Durathor = `Обладает 1 шевроном охотников. Олень Дуратрор делает Дагду менее вспыльчивой, и когда она появляется в армии игрока, он сбрасывает на одну карту дворфов меньше.`,
    Garm = `Обладает 2 шевронами разведчиков. Прибавьте 9 очков к вашему показателю храбрости разведчиков + 1 очко за каждый шеврон в колонке разведчиков (включая его собственные). Если во время смотра войск вы получили знак отличия разведчиков, возьмите 6 карт из колоды эпохи 2 (вместо 3) и оставьте себе 1, вернув оставшиеся карты в колоду.`,
    Hraesvelg = `Обладает 1 шевроном кузнецов. Возьмите карту «Гуллинбурсти» и поместите её в любую колонку своей армии.`,
    Nidhogg = `Обладает 1 шевроном воинов. Прибавьте 5 очков к показателю храбрости воинов +2 очка за каждый шеврон в колонке воинов (включая его собственный).`,
    Ratatosk = `Обладает 1 шевроном горняков. Прибавьте 2 очка к показателю храбрости горняков. При подсчёте показателя храбрости горняков каждая пара шевронов со значением 0 добавляет 1 очко храбрости перед умножением на количество шевронов.`,
}
// MythicalAnimal End

// Valkyry Start
/**
 * <h3>Перечисление для названия карты валькирии.</h3>
 */
export const enum ValkyryNames {
    Brynhildr = `Brynhildr`,
    Hildr = `Hildr`,
    Olrun = `Olrun`,
    Sigrdrifa = `Sigrdrifa`,
    Svafa = `Svafa`,
}

/**
 * <h3>Перечисление для русского названия карты валькирии.</h3>
 */
export const enum ValkyryRusNames {
    Brynhildr = `Брюнхильд`,
    Hildr = `Хильд`,
    Olrun = `Эльрун`,
    Sigrdrifa = `Сигрдрива`,
    Svafa = `Свава`,
}

/**
 * <h3>Перечисление для названия описания карты валькирии.</h3>
 */
export const enum ValkyryDescriptionNames {
    Brynhildr = `Каждый раз, когда вы побеждаете на этапе «Открытие ставок» и можете первым выбрать дворфа в таверне, переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Значения шкалы силы: 0 – 3 – 6 – 10 – 16`,
    Hildr = `Во время смотра войск, за каждый полученный знак отличия, переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Значения шкалы силы: 0 – 8 – 16 – 0`,
    Olrun = `Поместите Эльрун в свою командную зону, а затем поместите на неё 1 жетон воинского класса. Каждый раз, когда вы помещаете в свою армию карту, содержащую шеврон выбранного класса, переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Нейтральные герои Илуд и Труд, а также Двойники Ольвюна и Гуллинбурсти не активируют способность Эльрун, так как шевроны этих карт нейтральны. Значения шкалы силы: 0 – 3 – 6 – 10 – 16`,
    Sigrdrifa = `Каждый раз, когда вы призываете карту героя (любым образом), переместите жетон силы на 1 деление вниз по шкале силы этой валькирии. Способность Одина не активирует способность Сигдрифы. Значения шкалы силы: 0 – 0 – 8 – 16`,
    Svafa = `Каждый раз, когда вы обмениваете или улучшаете монету с приростом переместите жетон силы на 1 деление вниз по шкале силы этой валькирии за каждую единицу прироста. Значения шкалы силы: 0 - 4 - 8 - 16`,
}
// Valkyry End

// Artefact Start
/**
 * <h3>Перечисление для названия карты лагеря артефакта.</h3>
 */
export const enum ArtefactNames {
    Brisingamens = `Brisingamens`,
    Draupnir = `Draupnir`,
    FafnirBaleygr = `FafnirBaleygr`,
    Gjallarhorn = `Gjallarhorn`,
    Hofud = `Hofud`,
    Hrafnsmerki = `Hrafnsmerki`,
    Jarnglofi = `Jarnglofi`,
    Megingjord = `Megingjord`,
    Mjollnir = `Mjollnir`,
    OdroerirTheMythicCauldron = `OdroerirTheMythicCauldron`,
    Svalinn = `Svalinn`,
    Vegvisir = `Vegvisir`,
    VidofnirVedrfolnir = `VidofnirVedrfolnir`,
}

/**
 * <h3>Перечисление для русского названия карты лагеря артефакта.</h3>
 */
export const enum ArtefactRusNames {
    Brisingamens = `Брисингамен`,
    Draupnir = `Драупнир`,
    FafnirBaleygr = `Фафнир Баулейгр`,
    Gjallarhorn = `Гьяллархорн`,
    Hofud = `Хёфуд`,
    Hrafnsmerki = `Храфнсмерки`,
    Jarnglofi = `Ярнгрейпр`,
    Megingjord = `Мегингьорд`,
    Mjollnir = `Мьёлльнир`,
    OdroerirTheMythicCauldron = `Одрерир, мифический котел`,
    Svalinn = `Свалинн`,
    Vegvisir = `Вегвисир`,
    VidofnirVedrfolnir = `Видофнир и Ведрфёльнир`,
}

/**
 * <h3>Перечисление для названия описания карты лагеря артефакта.</h3>
 */
export const enum ArtefactDescriptionNames {
    Brisingamens = `Взяв этот артефакт, сразу же посмотрите все карты в стопке сброса карт эпохи 1 и 2 (но не в стопке сброса карт лагеря) и выберите две карты. Это могут быть карты королевская награда и/или дворф в любом сочетании. В желаемом порядке выполните следующие действия: - улучшите монету, если выбрали карту королевская награда, - сразу же поместите в свою армию карту дворфа и призовите героя, если создали новую линию 5 шевронов. В конце эпохи 2 перед подсчётом победных очков сбросьте одну карту дворфа из своей армии. Эта карта может быть сброшена из колонки любого воинского класса по выбору игрока, но нельзя сбрасывать карту героя.`,
    Draupnir = `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 6 победных очков за каждую свою монету с номиналом 15 или выше.`,
    FafnirBaleygr = `Игрок, владеющий этим артефактом, может брать карты из лагеря вместо таверны, если лагерь не посещал игрок, который получил первенство на этапе «Открытие ставок».`,
    Gjallarhorn = `Взяв этот артефакт, сразу же призовите в свою армию нового героя, независимо от количества завершённых линий 5 шевронов. Данное исключение действует только один раз. Чтобы призвать следующего героя игроку будет необходимо соблюсти основное правило: можно призвать нового героя, если собранных линий 5 шевронов на 1 больше, чем героев в армии игрока. Гьяллархорн позволяет игроку призывать героя, даже если он обладает картой мегингьорд. Нельзя призвать героя, если игрок не может выполнить условия, необходимые для призыва.`,
    Hofud = `Когда один из игроков получает этот артефакт, остальные игроки сразу же сбрасывают по одной карте воинов из своих армий. Игроки могут выбрать любую карту класса воин, за исключением карт героев. `,
    Hrafnsmerki = `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 5 победных очков за каждую свою карту наёмника.`,
    Jarnglofi = `Взяв этот артефакт, сразу же положите в сброс свою обменную монету (с номиналом 0 или 3). Если обменная монета была использована в качестве ставки в таверне, которую ещё не посещали, то игрок всё равно должен её сбросить. В этом случае он лишается ставки и во время посещения таверны не сможет взять ни одной карты. Во время подсчёта победных очков в конце эпохи 2 прибавьте 24 победных очка к своему итоговому показателю храбрости.`,
    Megingjord = `С момента получения этого артефакта и до конца игры владелец не может призывать героев в свою армию после создания линии 5 шевронов. Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 28 победных очков. Гьяллархорн позволяет игроку призывать героев, даже если он владеет Мегингьордом.`,
    Mjollnir = `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 2 победных очка за каждый шеврон в колонке одного воинского класса по выбору игрока.`,
    OdroerirTheMythicCauldron = `Во время подготовки отложите Одрерир в сторону. Перемешайте карты Лагеря 2-й эпохи, затем положите Одрерир на верх колоды. Таким образом, в начале Эпохи 2 Одрерир будет среди 5 доступных карт лагеря. Как только эльвеланд берет карту из лагеря, положите самую маленькую монету из Королевской сокровищницы на Одрерир. Делайте это до тех пор, пока эльвеланд не возьмет карту Одрерир с монетами на ней. Карта Одрерир с ее монетами находится в командной зоне. В конце игры Одрерир прибавляет сумму всех монет к вашему итоговому значению храбрости.`,
    Svalinn = `Во время подсчёта победных очков в конце эпохи 2 прибавьте к своему итоговому показателю храбрости 5 победных очков за каждую свою карту героя.`,
    Vegvisir = `Взяв карту этого артефакта, сразу же положите её в колонку разведчиков своей армии. Если таким образом создаётся новая линия 5 шевронов, сразу же призовите нового героя. Карта Вегвисир обладает одним шевроном и прибавляет 13 победных очков к показателю храбрости разведчиков.`,
    VidofnirVedrfolnir = `Взяв этот артефакт, сразу же откройте монеты в вашем кошеле и улучшите на +2 одну из них и на +3 другую. Улучшение монет можно производить в любой очерёдности. Если одна из монет в кошеле обменная (0 или особая обменная монета Охотников с номиналом 3), тогда улучшите на +5 вторую монету в кошеле.`,
}
// Artefact End

// Hero Start
/**
 * <h3>Перечисление для названия карты героя.</h3>
 */
export const enum HeroNames {
    Aegur = `Aegur`,
    Andumia = `Andumia`,
    Aral = `Aral`,
    Astrid = `Astrid`,
    Bonfur = `Bonfur`,
    CrovaxTheDoppelganger = `CrovaxTheDoppelganger`,
    Dagda = `Dagda`,
    DwergAesir = `DwergAesir`,
    DwergBergelmir = `DwergBergelmir`,
    DwergJungir = `DwergJungir`,
    DwergSigmir = `DwergSigmir`,
    DwergYmir = `DwergYmir`,
    Grid = `Grid`,
    Holda = `Holda`,
    Hourya = `Hourya`,
    Idunn = `Idunn`,
    Jarika = `Jarika`,
    Khrad = `Khrad`,
    Kraal = `Kraal`,
    Lokdur = `Lokdur`,
    Olwin = `Olwin`,
    Skaa = `Skaa`,
    Tarah = `Tarah`,
    Thrud = `Thrud`,
    Uline = `Uline`,
    Ylud = `Ylud`,
    Zolkur = `Zolkur`,
    Zoral = `Zoral`,
}

/**
 * <h3>Перечисление для русского названия карты героя.</h3>
 */
export const enum HeroRusNames {
    Aegur = `Эгур Стальной кулак`,
    Andumia = `Аннумия Некромант`,
    Aral = `Арал Орлиный коготь`,
    Astrid = `Астрид Богатая`,
    Bonfur = `Бонфур Жестокий`,
    CrovaxTheDoppelganger = `Кровакс Двойник`,
    Dagda = `Дагда Вспыльчивая`,
    DwergAesir = `Дверг Эсир`,
    DwergBergelmir = `Дверг Бергельмир`,
    DwergJungir = `Дверг Юмгир`,
    DwergSigmir = `Дверг Сигмир`,
    DwergYmir = `Дверг Имир`,
    Grid = `Грид Расчётливая`,
    Holda = `Хольда Менестрель`,
    Hourya = `Хурия Неуловимая`,
    Idunn = `Идунн Незаметная`,
    Jarika = `Ярика Шельма`,
    Khrad = `Крад Плут`,
    Kraal = `Крол Наёмник`,
    Lokdur = `Локдур Корыстолюбивый`,
    Olwin = `Ольвюн Многоликий`,
    Skaa = `Ско Непостижимая`,
    Tarah = `Тара Смертоносная`,
    Thrud = `Труд Охотница за головами`,
    Uline = `Улина Ясновидящая`,
    Ylud = `Илуд Непредсказуемая`,
    Zolkur = `Солькур Жадный`,
    Zoral = `Зорал Мастер`,
}

/**
 * <h3>Перечисление для названия описания карты героя.</h3>
 */
export const enum HeroDescriptionNames {
    Aegur = `Обладает 2 шевронами.`,
    Andumia = `Прибавьте 12 победных очков к итоговому показателю храбрости. Как только вы призвали Аннумию, сразу же посмотрите все карты в стопке сброса карт эпохи 1 и 2 (но не в стопке сброса карт лагеря) и выберите одну карту. - Если выбрана королевская награда, сразу примените её эффект и верните карту в сброс. - Если выбран дворф, поместите его в свою армию. Призовите героя, если создали новую линию 5 шевронов.`,
    Aral = `Обладает 2 шевронами.`,
    Astrid = `Прибавьте к своему итоговому показателю храбрости номинал своей самой ценной монеты.`,
    Bonfur = `Обладает 3 шевронами. Призвав Бонфура, сразу же поместите его карту в колонку кузнецов и отправьте в сброс одну нижнюю карту дворфа (не героя) из другой колонки своей армии по своему выбору.`,
    CrovaxTheDoppelganger = `Прибавьте 25 победных очков к итоговому показателю храбрости. Поместите его в свою командную зону и немедленно сбросьте последнюю карту дворфа из выбранной вами колонки.`,
    Dagda = `Обладает 3 шевронами. Призвав Дагду, сразу же поместите её карту в колонку охотников и отправьте в сброс по одной нижней карте дворфов (не героев) из двух других колонок своей армии по своему выбору.`,
    DwergAesir = `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    DwergBergelmir = `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    DwergJungir = `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    DwergSigmir = `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    DwergYmir = `В зависимости от количества братьев, призванных игроком, прибавьте к итоговому показателю храбрости: 1 - 13, 2 - 40, 3 - 81, 4 - 108, 5 - 135.`,
    Grid = `Прибавьте 7 очков к своему итоговому показателю храбрости. Когда вы призвали Грид и положили её карту в свою командную зону, сразу же улучшите на + 7 номинал одной из своих монет.`,
    Holda = `Прибавьте 12 победных очков к итоговому показателю храбрости. Как только вы призвали Хольду, сразу же возьмите карту наёмника или артефакта из лагеря.`,
    Hourya = `Обладает 1 шевроном. Прибавьте 20 очков к показателю храбрости разведчиков. Чтобы призвать Хурию, игрок должен иметь в своей армии как минимум 5 шевронов в колонке разведчиков. Если Труд и / или Илуд расположены в колонке разведчиков, то их шевроны учитываются для призыва Хурии.`,
    Idunn = `Обладает 1 шевроном. Прибавьте 7 очков к показателю храбрости разведчиков плюс по 2 очка за каждый шеврон в колонке Разведчиков (включая её собственный).`,
    Jarika = `Прибавьте 8 победных очков к итоговому показателю храбрости. Ярика – нейтральный герой, поэтому, призвав её, положите карту в свою командную зону. Во время каждого улучшения или обмена монет увеличьте номинал монеты дополнительно на +2.`,
    Khrad = `Прибавьте 4 победных очка к итоговому показателю храбрости. Как только вы призвали Крада, сразу же улучшите одну свою монету с наименьшим номиналом на +10. Обменная монета с номиналом 0 не может быть улучшена.`,
    Kraal = `Обладает 2 шевронами. Прибавьте 7 и 0 очков к показателю храбрости воинов.`,
    Lokdur = `Обладает 1 шевроном. Прибавьте 3 к сумме очков храбрости горняков. Локдур увеличивает сумму очков храбрости горняков на 3, а сумму шевронов на 1.`,
    Olwin = `Прибавьте 9 победных очков к итоговому показателю храбрости. Как только вы призвали Ольвюна, сразу же возьмите две карты «Двойник Ольвюна» и положите их в две разные колонки своей армии. В результате размещения Двойников Ольвюна могут возникнуть новые линии 5 шевронов, в этом случае игрок может призвать новых героев. Призрачные двойники обладают значением храбрости 0, но могут стать дворфами любого воинского класса. Они могут быть отправлены в сброс эффектами карт «Дагда», «Бонфур», «Брисингамен» и «Хёфуд». Двойники Ольвюна не являются героями. Если карта «Двойник Ольвюна» единственная в колонке, то положите на неё жетон воинского класса для напоминания о воинском классе колонки.`,
    Skaa = `Прибавьте 17 очков к своему итоговому показателю храбрости.`,
    Tarah = `Обладает 1 шевроном. Прибавьте 14 очков к показателю храбрости воинов.`,
    Thrud = `Призвав этого героя, поместите её карту по своему выбору в любую колонку класса своей армии. На карту Труд нельзя положить никакую другую карту дворфа. Если карта дворфа или героя помещается в колонку, где расположена Труд, то игрок должен взять карту Труд в руку, поместить карту дворфа или героя и затем вернуть карту Труд в армию, в любую колонку по своему выбору. Игрок получает право призвать нового героя, если, разместив карту Труд, создал необходимую для этого новую линию 5 шевронов. В конце эпохи 1, при распределении карт знаков отличия, шеврон Труд учитывается в том воинском классе, где она расположена. В эпоху 2, после посещения последней таверны, но перед подсчётом итогового показателя храбрости, карта Труд перемещается из армии в командную зону. Труд прибавляет 13 очков к итоговому показателю храбрости игрока.`,
    Uline = `Прибавьте 9 очков к своему итоговому показателю храбрости. Как только вы призвали Улину и положили её карту в свою командную зону, сразу же берите в руку монеты, которые всё ещё лежат лицом вниз на вашем планшете. С этого момента и каждый раз во время подготовки к раунду на этапе «Ставки» игрок не выкладывает свои монеты на планшет, а держит их в своей руке. Во время посещения таверны на этапе «Открытие ставок», игрок ждёт, пока все другие эльвеланды откроют свои ставки и только после этого он выбирает монету из своей руки и кладёт её лицом вверх в область соответствующей таверны на своём планшете. Затем раунд продолжается в порядке, соответствующем ставкам игроков. Если игрок активировал своей ставкой обмен монет, то последним действием своего хода он выбирает из руки две монеты, номиналы которых он суммирует для получения новой монеты. Обмен происходит по обычным правилам, однако новую монету игрок сразу же берёт в руку, а не кладёт в кошель своего планшета. Во время улучшения монеты: • если игрок выбрал монету из руки, то новую монету он берёт так же в руку, • если игрок выбрал монету, лежащую на планшете, то новую монету он кладёт в то же место. Игрок может сделать ставку монетами из руки в таверне, которую посетит в ходе раунда. Монеты, лежащие на планшете, должны оставаться на нём до конца текущего раунда.`,
    Ylud = `Поместите эту карту в свою командную зону. В эпоху 1, сразу после посещения последней таверны, но до смотра войск, поместите карту Илуд в колонку любого воинского класса вашей армии. При распределении знаков отличий во время смотра войск, шеврон Илуд учитывается в качестве шеврона этого класса. Илуд остаётся в этой колонке до конца эпохи 2. Если вы призвали Илуд во время эпохи 2, поместите её карту в свою командную зону. В эпоху 2, сразу после посещения последней таверны, но до подсчёта итогового показателя храбрости: • если Илуд в командной зоне, то игрок помещает её в колонку любого воинского класса своей армии, • если Илуд в армии, игрок может переместить её в другую колонку воинского класса по своему выбору. Илуд будет учитываться в качестве дворфа того класса, где располагается. В конце эпохи 2, в зависимости от местоположения Илуд, она будет учитываться как кузнец или охотник, разведчик 11, воин 7, горняк 1. Если Илуд в колонке воинов, то её шеврон учитывается в сумме шевронов воинов при определении преимущества. Игрок получает право призвать нового героя, если с помощью карты Илуд завершит новую линию 5 шевронов. Если игрок обладает обеими картами героев Илуд и Труд, то при их активации важно учесть следующий порядок. После посещения последней таверны в эпоху 2 игрок сначала помещает Илуд в свою армию. В этот момент игрок может призвать нового героя, если с помощью Илуд создал линию 5 шевронов. Затем игрок перемещает Труд из армии в свою командную зону.`,
    Zolkur = `Прибавьте 10 победных очков к итоговому показателю храбрости. Как только вы призвали Солькура, сразу же положите его карту на монеты в кошеле. Во время следующего обмена, в отличие от стандартных правил, обменяйте монету с наименьшим номиналом, а не с наибольшим. После обмена положите карту «Солькур» в командную зону.`,
    Zoral = `Обладает 3 шевронами. Прибавьте 1, 0 и 0 к сумме очков храбрости горняков. Зорал увеличивает сумму очков храбрости горняков на 1, а сумму шевронов – на 3.`,
}
// Hero End

// MultiSuitCard Start
/**
 * <h3>Перечисление для названия мультифракционной карты.</h3>
 */
export const enum MultiSuitCardNames {
    Gullinbursti = `Gullinbursti`,
    OlwinsDouble = `OlwinsDouble`,
}

/**
 * <h3>Перечисление для русского названия мультифракционной карты.</h3>
 */
export const enum MultiSuitCardRusNames {
    Gullinbursti = `Гуллинбурсти`,
    OlwinsDouble = `Двойник Ольвюна`,
}
// MultiSuitCard End

// SpecialCard Start
/**
 * <h3>Перечисление для названия особой карты.</h3>
 */
export const enum SpecialCardNames {
    ChiefBlacksmith = `ChiefBlacksmith`,
}

/**
 * <h3>Перечисление для русского названия особой карты.</h3>
 */
export const enum SpecialCardRusNames {
    ChiefBlacksmith = `Главный кузнец`,
}
// SpecialCard End

// Scoring Functions Start
/**
 * <h3>Перечисление для названия действия по получению победных очков по фракции дворфов.</h3>
 */
export const enum SuitScoringFunctionNames {
    BlacksmithScoring = `BlacksmithScoring`,
    ExplorerScoring = `ExplorerScoring`,
    HunterScoring = `HunterScoring`,
    MinerScoring = `MinerScoring`,
    WarriorScoring = `WarriorScoring`,
}

/**
 * <h3>Перечисление для названия действия по получению победных очков по карте лагеря артефакту.</h3>
 */
export const enum ArtefactScoringFunctionNames {
    BasicArtefactScoring = `BasicArtefactScoring`,
    DraupnirScoring = `DraupnirScoring`,
    HrafnsmerkiScoring = `HrafnsmerkiScoring`,
    MjollnirScoring = `MjollnirScoring`,
    OdroerirTheMythicCauldronScoring = `OdroerirTheMythicCauldronScoring`,
    SvalinnScoring = `SvalinnScoring`,
}

/**
 * <h3>Перечисление для названия действия по получению победных очков по карте героя.</h3>
 */
export const enum HeroScoringFunctionNames {
    BasicHeroScoring = `BasicHeroScoring`,
    AstridScoring = `AstridScoring`,
    IdunnScoring = `IdunnScoring`,
}

/**
 * <h3>Перечисление для названия действия по получению победных очков по карте мифического животного.</h3>
 */
export const enum MythicalAnimalScoringFunctionNames {
    BasicMythicalAnimalScoring = `BasicMythicalAnimalScoring`,
    GarmScoring = `GarmScoring`,
    NidhoggScoring = `NidhoggScoring`,
}

/**
 * <h3>Перечисление для названия действия по получению победных очков по карте гиганта.</h3>
 */
export const enum GiantScoringFunctionNames {
    BasicGiantScoring = `BasicGiantScoring`,
    GymirScoring = `GymirScoring`,
    SurtScoring = `SurtScoring`,
}

/**
 * <h3>Перечисление для названия действия по получению победных очков по карте валькирии.</h3>
 */
export const enum ValkyryScoringFunctionNames {
    BrynhildrScoring = `BrynhildrScoring`,
    HildrScoring = `HildrScoring`,
    OlrunScoring = `OlrunScoring`,
    SigrdrifaScoring = `SigrdrifaScoring`,
    SvafaScoring = `SvafaScoring`,
}
// Scoring Functions End

// Buff Start
/**
 * <h3>Перечисление для названия общего бафа.</h3>
 */
export const enum CommonBuffNames {
    HasOneNotCountHero = `hasOneNotCountHero`,
    SuitIdForMjollnir = `suitIdForMjollnir`,
    SuitIdForOlrun = `suitIdForOlrun`,
}

/**
 * <h3>Перечисление для названия бафа карта лагеря.</h3>
 */
export const enum CampBuffNames {
    DiscardCardEndGame = `discardCardEndGame`,
    GetMjollnirProfit = `getMjollnirProfit`,
    GoCamp = `goCamp`,
    NoHero = `noHero`,
}

/**
 * <h3>Перечисление для названия бафа карта героя.</h3>
 */
export const enum HeroBuffNames {
    EndTier = `endTier`,
    EveryTurn = `everyTurn`,
    GoCampOneTime = `goCampOneTime`,
    MoveThrud = `moveThrud`,
    UpgradeCoin = `upgradeCoin`,
    UpgradeNextCoin = `upgradeNextCoin`,
}

/**
 * <h3>Перечисление для названия бафа карты гиганта.</h3>
 */
export const enum GiantBuffNames {
    PlayerHasActiveGiantGymir = `playerHasActiveGiantGymir`,
    PlayerHasActiveGiantHrungnir = `playerHasActiveGiantHrungnir`,
    PlayerHasActiveGiantSkymir = `playerHasActiveGiantSkymir`,
    PlayerHasActiveGiantSurt = `playerHasActiveGiantSurt`,
    PlayerHasActiveGiantThrivaldi = `playerHasActiveGiantThrivaldi`,
}

/**
 * <h3>Перечисление для названия бафа карты бога.</h3>
 */
export const enum GodBuffNames {
    PlayerHasActiveGodFreyja = `playerHasActiveGodFreyja`,
    PlayerHasActiveGodFrigg = `playerHasActiveGodFrigg`,
    PlayerHasActiveGodLoki = `playerHasActiveGodLoki`,
    PlayerHasActiveGodOdin = `playerHasActiveGodOdin`,
    PlayerHasActiveGodThor = `playerHasActiveGodThor`,
}

/**
 * <h3>Перечисление для названия бафа карты мистического животного.</h3>
 */
export const enum MythicalAnimalBuffNames {
    DagdaDiscardOnlyOneCards = `dagdaDiscardOnlyOneCards`,
    ExplorerDistinctionGetSixCards = `explorerDistinctionGetSixCards`,
    RatatoskFinalScoring = `ratatoskFinalScoring`,
}

/**
 * <h3>Перечисление для названия бафа карты валькирии.</h3>
 */
export const enum ValkyryBuffNames {
    CountBettermentAmount = `countBettermentAmount`,
    CountBidWinnerAmount = `countBidWinnerAmount`,
    CountDistinctionAmount = `countDistinctionAmount`,
    CountPickedCardClassRankAmount = `countPickedCardClassRankAmount`,
    CountPickedHeroAmount = `countPickedHeroAmount`,
}
// Buff End

// Distinction Start
/**
 * <h3>Перечисление для названия описания знаков отличия.</h3>
 */
export const enum DistinctionDescriptionNames {
    Blacksmith = `Получив знак отличия кузнецов, сразу же призовите Главного кузнеца с двумя шевронами в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов.`,
    Explorer = `Получив знак отличия разведчиков, сразу же возьмите 3 карты из колоды эпохи 2 и сохраните у себя одну из этих карт. Если это карта дворфа, сразу же поместите его в свою армию. Игрок получает право призвать нового героя, если в этот момент завершил линию 5 шевронов. Если это карта королевская награда, то улучшите одну из своих монет. Две оставшиеся карты возвращаются в колоду эпохи 2. Положите карту знак отличия разведчиков в командную зону рядом с вашим планшетом.`,
    Hunter = `Получив знак отличия охотников, сразу же обменяйте свою монету с номиналом 0 на особую монету с номиналом 3. Эта монета также позволяет обменивать монеты в кошеле и не может быть улучшена.`,
    Miner = `Получив знак отличия горняков, сразу же положите особый кристалл 6 поверх вашего текущего кристалла (тот остаётся скрытым до конца игры). В конце игры обладатель этого кристалла прибавит +3 очка к итоговому показателю храбрости своей армии. Этот кристалл позволяет победить во всех спорах при равенстве ставок и никогда не обменивается.`,
    Warrior = `Получив знак отличия воинов, сразу же улучшите одну из своих монет, добавив к её номиналу +5.`,
}
// Distinction End

/**
 * <h3>Перечисление для типов монет на русском.</h3>
 */
export enum CoinRusNames {
    InitialNotTriggerTrading = `Базовая`,
    InitialTriggerTrading = `Базовая, активирующая обмен монет`,
    Royal = `Королевская`,
    SpecialTriggerTrading = `Особая, активирующая обмен монет`,
}

/**
 * <h3>Перечисление для названия режима игры.</h3>
 */
export const enum GameModeNames {
    Basic = `Basic`,
    Multiplayer = `Multiplayer`,
    Solo = `Solo`,
    SoloAndvari = `Solo Andvari`,
}

/**
 * <h3>Перечисление для названия действия по получению преимущества по фракции.</h3>
 */
export const enum DistinctionAwardingFunctionNames {
    BlacksmithDistinctionAwarding = `BlacksmithDistinctionAwarding`,
    ExplorerDistinctionAwarding = `ExplorerDistinctionAwarding`,
    HunterDistinctionAwarding = `HunterDistinctionAwarding`,
    MinerDistinctionAwarding = `MinerDistinctionAwarding`,
    WarriorDistinctionAwarding = `WarriorDistinctionAwarding`,
}

/**
 * <h3>Перечисление для названия автоматического действия.</h3>
 */
export const enum AutoActionFunctionNames {
    AddMythologyCreatureCardsSkymirAction = `AddMythologyCardSkymirAction`,
    AddPickHeroAction = `AddPickHeroAction`,
    DiscardTradingCoinAction = `DiscardTradingCoinAction`,
    FinishOdroerirTheMythicCauldronAction = `FinishOdroerirTheMythicCauldronAction`,
    GetClosedCoinIntoPlayerHandAction = `GetClosedCoinIntoPlayerHandAction`,
    StartDiscardSuitCardAction = `StartDiscardSuitCardAction`,
    StartVidofnirVedrfolnirAction = `StartVidofnirVedrfolnirAction`,
    UpgradeMinCoinAction = `UpgradeMinCoinAction`,
}

/**
 * <h3>Перечисление для названия кнопок.</h3>
 */
export const enum ButtonNames {
    NotActivateGodAbility = `Не активировать способность карты бога`,
    NoHeroEasyStrategy = `Без стартовых героев (лёгкая стратегия)`,
    NoHeroHardStrategy = `Без стартовых героев (сложная стратегия)`,
    WithHeroEasyStrategy = `Со стартовыми героями (лёгкая стратегия)`,
    WithHeroHardStrategy = `Со стартовыми героями (сложная стратегия)`,
    Pass = `Пас`,
    Start = `Старт`,
}

/**
 * <h3>Перечисление для названия типов монет.</h3>
 */
export const enum CoinTypeNames {
    Hand = `Рука`,
    Board = `Стол`,
}

/**
 * <h3>Перечисление для названия отображения действий в конфиге.</h3>
 */
export const enum ConfigNames {
    ActivateGiantAbilityOrPickCard = `ActivateGiantAbilityOrPickCard`,
    ActivateGodAbilityOrNot = `ActivateGodAbilityOrNot`,
    ChooseGetMythologyCard = `ChooseGetMythologyCard`,
    ChooseCoinValueForVidofnirVedrfolnirUpgrade = `ChooseCoinValueForVidofnirVedrfolnirUpgrade`,
    ChooseStrategyLevelForSoloModeAndvari = `ChooseStrategyLevelForSoloModeAndvari`,
    ChooseStrategyVariantLevelForSoloModeAndvari = `ChooseStrategyVariantLevelForSoloModeAndvari`,
    ExplorerDistinction = `ExplorerDistinction`,
    GetDifficultyLevelForSoloMode = `GetDifficultyLevelForSoloMode`,
    GetHeroesForSoloMode = `GetHeroesForSoloMode`,
    StartOrPassEnlistmentMercenaries = `StartOrPassEnlistmentMercenaries`,
}

/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export const enum DrawNames {
    // TODO Give normal names to all?!
    ActivateGiantAbilityOrPickCard = `Activate Giant ability or pick card`,
    ActivateGodAbilityOrNot = `Activate God ability or not`,
    AddCoinToPouchVidofnirVedrfolnir = `Add coin to pouch Vidofnir Vedrfolnir`,
    Andumia = `Andumia`,
    Bonfur = `Bonfur`,
    Brisingamens = `Brisingamens`,
    BrisingamensEndGame = `Brisingamens end game`,
    ChooseSuitOlrun = `Choose suit Olrun`,
    ChooseStrategyLevelForSoloModeAndvari = `Choose strategy level for solo mode Andvari`,
    ChooseStrategyVariantLevelForSoloModeAndvari = `Choose strategy variant level for solo mode Andvari`,
    CrovaxTheDoppelganger = `Crovax the Doppelganger`,
    Dagda = `Dagda`,
    DiscardTavernCard = `Discard tavern card`,
    EnlistmentMercenaries = `Enlistment Mercenaries`,
    Mjollnir = `Mjollnir`,
    GetDifficultyLevelForSoloMode = `Get difficulty level for Solo mode`,
    GetMythologyCardSkymir = `Get Mythology card Skymir`,
    GetHeroesForSoloMode = `Get heroes for Solo mode`,
    GetMjollnirProfit = `Get Mjollnir profit`,
    Hofud = `Hofud`,
    Holda = `Holda`,
    PlaceMultiSuitsCards = `Place multi suits cards`,
    PickCard = `Pick card or camp card`,
    PickCardSoloBot = `Pick card or camp card Solo Bot`,
    PickCardSoloBotAndvari = `Pick card or camp card Solo Bot Andvari`,
    PickCardByExplorerDistinction = `Pick card by Explorer distinction`,
    PickCardByExplorerDistinctionSoloBot = `Pick card by Explorer distinction Solo Bot`,
    PickCardByExplorerDistinctionSoloBotAndvari = `Pick card by Explorer distinction Solo Bot Andvari`,
    PickConcreteCoinToUpgrade = `Pick concrete coin to upgrade`,
    PickHero = `Pick hero card`,
    PickHeroSoloBot = `Pick hero card Solo Bot`,
    PickHeroSoloBotAndvari = `Pick hero card Solo Bot Andvari`,
    PlaceEnlistmentMercenaries = `Place Enlistment Mercenaries`,
    PlaceTradingCoinsUline = `Place Trading Coins Uline`,
    PlaceYludHero = `Place Ylud`,
    PlaceYludHeroSoloBot = `Place Ylud Solo Bot`,
    PlaceYludHeroSoloBotAndvari = `Place Ylud Solo Bot Andvari`,
    StartChooseCoinValueForVidofnirVedrfolnirUpgrade = `Start choose coin value for Vidofnir Vedrfolnir upgrade`,
    StartOrPassEnlistmentMercenaries = `Start or Pass Enlistment Mercenaries`,
    PlaceThrudHero = `Place Thrud Hero`,
    PlaceThrudHeroSoloBot = `Place Thrud Hero Solo Bot`,
    PlaceThrudHeroSoloBotAndvari = `Place Thrud Hero Solo Bot Andvari`,
    StartAddPlusTwoValueToAllCoinsUline = `Start add plus two value to all coins Uline`,
    UpgradeCoin = `Upgrade coin`,
    UpgradeCoinSoloBot = `Upgrade coin Solo Bot`,
    UpgradeCoinSoloBotAndvari = `Upgrade coin Solo Bot Andvari`,
    UpgradeCoinVidofnirVedrfolnir = `Upgrade coin Vidofnir Vedrfolnir`,
    UpgradeCoinWarriorDistinction = `Upgrade coin Warrior distinction`,
    UpgradeCoinWarriorDistinctionSoloBot = `Upgrade coin Warrior distinction Solo Bot`,
    UpgradeCoinWarriorDistinctionSoloBotAndvari = `Upgrade coin Warrior distinction Solo Bot Andvari`,
}

/**
 * <h3>Перечисление для типов отрисовки монет.</h3>
 */
export const enum DrawCoinTypeNames {
    Back = `Back`,
    BackSmallMarketCoin = `BackSmallMarketCoin`,
    BackTavernIcon = `BackTavernIcon`,
    Coin = `Coin`,
    HiddenCoin = `HiddenCoin`,
    Market = `Market`,
}

/**
 * <h3>Перечисление для названия ошибки.</h3>
 */
export const enum ErrorNames {
    CanNotBeMoreThenTwoPlayersInSoloGameMode = `CanNotBeMoreThenTwoPlayersInSoloGameMode`,
    CurrentMoveArgumentIsUndefined = `CurrentMoveArgumentIsUndefined`,
    CurrentTavernCardWithCurrentIdCanNotBeRoyalOfferingCard = `CurrentTavernCardWithCurrentIdCanNotBeRoyalOfferingCard`,
    CurrentTavernCardWithCurrentIdIsNull = `CurrentTavernCardWithCurrentIdIsNull`,
    CurrentTavernCardWithCurrentIdIsUndefined = `CurrentTavernCardWithCurrentIdIsUndefined`,
    CurrentSuitDistinctionPlayerIndexIsUndefined = `CurrentSuitDistinctionPlayerIndexIsUndefined`,
    DoNotDiscardCardFromCurrentTavernIfNoCardInTavern = `DoNotDiscardCardFromCurrentTavernIfNoCardInTavern`,
    FirstStackActionForPlayerWithCurrentIdIsUndefined = `FirstStackActionIsUndefined`,
    FunctionMustHaveReturnValue = `FunctionMustHaveReturnValue`,
    FunctionParamIsUndefined = `FunctionParamIsUndefined`,
    NoAddedValidator = `NoAddedValidatorWithCurrentName`,
    NoCardsToDiscardWhenNoWinnerInExplorerDistinction = `NoCardsToDiscardWhenNoWinnerInExplorerDistinction`,
    NoSuchGameMode = `NoSuchGameMode`,
    NoSuchMove = `NoSuchMove`,
    OnlyInSoloOrTwoPlayersGame = `OnlyInSoloOrTwoPlayersGame`,
    PlayersCurrentSuitCardsMustHaveCardsForDistinction = `PlayersCurrentSuitCardsMustHaveCardsForDistinction`,
    PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount =
    `PlayersCurrentSuitRanksArrayMustHavePlayerWithMostRankCount`,
    PossibleMoveArgumentsIsUndefined = `PossibleMoveArgumentsIsUndefined`,
    PrivatePlayerWithCurrentIdIsUndefined = `PrivatePlayerWithCurrentIdIsUndefined`,
    PublicPlayerWithCurrentIdIsUndefined = `PublicPlayerWithCurrentIdIsUndefined`,
    SuitDistinctionMustBePresent = `SuitDistinctionMustBePresent`,
    TavernCanNotBeRefilledBecauseNotEnoughCards = `TavernCanNotBeRefilledBecauseNotEnoughCards`,
}

/**
 * <h3>Перечисление для названия игры и дополнений.</h3>
 */
export const enum GameNames {
    Basic = `Basic`,
    Idavoll = `Idavoll`,
    Thingvellir = `Thingvellir`,
}

/**
 * <h3>Перечисление для типов логов.</h3>
 */
export const enum LogTypeNames {
    Game = `Game`,
    Private = `Private`,
    Public = `Public`,
}

/**
 * <h3>Перечисление для описаний отображения действий на кнопках.</h3>
 */
export const enum ButtonMoveNames {
    NotActivateGodAbilityMove = `NotActivateGodAbilityMove`,
    PassEnlistmentMercenariesMove = `PassEnlistmentMercenariesMove`,
    StartEnlistmentMercenariesMove = `StartEnlistmentMercenariesMove`,
    // start
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMove = `ChooseCoinValueForVidofnirVedrfolnirUpgradeMove`,
    // Solo Mode
    ChooseDifficultyLevelForSoloModeMove = `ChooseDifficultyLevelForSoloModeMove`,
    // Solo Mode Andvari
    ChooseStrategyForSoloModeAndvariMove = `ChooseStrategyForSoloModeAndvariMove`,
    ChooseStrategyVariantForSoloModeAndvariMove = `ChooseStrategyVariantForSoloModeAndvariMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на знаках отличия.</h3>
 */
export const enum DistinctionCardMoveNames {
    ClickDistinctionCardMove = `ClickDistinctionCardMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на картах.</h3>
 */
export const enum CardMoveNames {
    ActivateGodAbilityMove = `ActivateGodAbilityMove`,
    ClickCardNotGiantAbilityMove = `ClickCardNotGiantAbilityMove`,
    ClickGiantAbilityNotCardMove = `ClickGiantAbilityNotCardMove`,
    ClickCardMove = `ClickCardMove`,
    ClickCardToPickDistinctionMove = `ClickCardToPickDistinctionMove`,
    ClickCampCardMove = `ClickCampCardMove`,
    DiscardCardFromPlayerBoardMove = `DiscardCardFromPlayerBoardMove`,
    GetEnlistmentMercenariesMove = `GetEnlistmentMercenariesMove`,
    GetMythologyCardMove = `GetMythologyCardMove`,
    // start
    ClickCampCardHoldaMove = `ClickCampCardHoldaMove`,
    ClickHeroCardMove = `ClickHeroCardMove`,
    DiscardTopCardFromSuitMove = `DiscardTopCardFromSuitMove`,
    DiscardCard2PlayersMove = `DiscardCard2PlayersMove`,
    DiscardSuitCardFromPlayerBoardMove = `DiscardSuitCardFromPlayerBoardMove`,
    PickDiscardCardMove = `PickDiscardCardMove`,
    // Solo Mode
    ChooseHeroForDifficultySoloModeMove = `ChooseHeroForDifficultySoloModeMove`,
    // Solo Bot
    SoloBotClickCardMove = `SoloBotClickCardMove`,
    SoloBotClickHeroCardMove = `SoloBotClickHeroCardMove`,
    SoloBotClickCardToPickDistinctionMove = `SoloBotClickCardToPickDistinctionMove`,
    // Solo Bot Andvari
    SoloBotAndvariClickCardMove = `SoloBotAndvariClickCardMove`,
    SoloBotAndvariClickHeroCardMove = `SoloBotAndvariClickHeroCardMove`,
    SoloBotAndvariClickCardToPickDistinctionMove = `SoloBotAndvariClickCardToPickDistinctionMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на монетах.</h3>
 */
export const enum CoinMoveNames {
    ClickBoardCoinMove = `ClickBoardCoinMove`,
    ChooseCoinValueForHrungnirUpgradeMove = `ChooseCoinValueForHrungnirUpgradeMove`,
    ClickHandCoinMove = `ClickHandCoinMove`,
    ClickHandCoinUlineMove = `ClickHandCoinUlineMove`,
    ClickHandTradingCoinUlineMove = `ClickHandTradingCoinUlineMove`,
    // Start
    AddCoinToPouchMove = `AddCoinToPouchMove`,
    ClickCoinToUpgradeMove = `ClickCoinToUpgradeMove`,
    PickConcreteCoinToUpgradeMove = `PickConcreteCoinToUpgradeMove`,
    UpgradeCoinVidofnirVedrfolnirMove = `UpgradeCoinVidofnirVedrfolnirMove`,
    // Solo Bot
    SoloBotClickCoinToUpgradeMove = `SoloBotClickCoinToUpgradeMove`,
    // Solo Bot Andvari
    SoloBotAndvariClickCoinToUpgradeMove = `SoloBotAndvariClickCoinToUpgradeMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на пустых ячейках для карт.</h3>
 */
export const enum EmptyCardMoveNames {
    PlaceEnlistmentMercenariesMove = `PlaceEnlistmentMercenariesMove`,
    PlaceYludHeroMove = `PlaceYludHeroMove`,
    // Start
    PlaceMultiSuitCardMove = `PlaceMultiSuitCardMove`,
    PlaceThrudHeroMove = `PlaceThrudHeroMove`,
    // Solo Bot
    SoloBotPlaceThrudHeroMove = `SoloBotPlaceThrudHeroMove`,
    SoloBotPlaceYludHeroMove = `SoloBotPlaceYludHeroMove`,
    // Solo Bot Andvari
    SoloBotAndvariPlaceThrudHeroMove = `SoloBotAndvariPlaceThrudHeroMove`,
    SoloBotAndvariPlaceYludHeroMove = `SoloBotAndvariPlaceYludHeroMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий на фракциях дворфов.</h3>
 */
export const enum SuitMoveNames {
    ChooseSuitOlrunMove = `ChooseSuitOlrunMove`,
    GetMjollnirProfitMove = `GetMjollnirProfitMove`,
}

/**
 * <h3>Перечисление для описаний отображения действий.</h3>
 */
export const enum AutoBotsMoveNames {
    // Bots
    BotsPlaceAllCoinsMove = `BotsPlaceAllCoinsMove`,
    // Solo Bot
    SoloBotPlaceAllCoinsMove = `SoloBotPlaceAllCoinsMove`,
    //Solo Bot Andvari
    SoloBotAndvariPlaceAllCoinsMove = `SoloBotAndvariPlaceAllCoinsMove`,
}

/**
 * <h3>Перечисление для фаз игры.</h3>
 */
export const enum PhaseNames {
    Bids = `Bids`,
    BidUline = `BidUline`,
    BrisingamensEndGame = `BrisingamensEndGame`,
    ChooseDifficultySoloMode = `ChooseDifficultySoloMode`,
    ChooseDifficultySoloModeAndvari = `ChooseDifficultySoloModeAndvari`,
    EnlistmentMercenaries = `EnlistmentMercenaries`,
    GetMjollnirProfit = `GetMjollnirProfit`,
    PlaceYlud = `PlaceYlud`,
    TavernsResolution = `TavernsResolution`,
    TroopEvaluation = `TroopEvaluation`,
}

/**
 * <h3>Перечисление для фаз игры на русском.</h3>
 */
export enum PhaseRusNames {
    Bids = `Ставки`,
    BidUline = `Ставки Улина`,
    BrisingamensEndGame = `BrisingamensEndGame`,
    ChooseDifficultySoloMode = `Выбор сложности соло режима`,
    ChooseDifficultySoloModeAndvari = `Выбор сложности соло режима Андвари`,
    EnlistmentMercenaries = `enlistmentMercenaries`,
    GetMjollnirProfit = `getMjollnirProfit`,
    PlaceYlud = `Поместить Илуд`,
    TavernsResolution = `Посещение таверн`,
    TroopEvaluation = `Смотр войск`,
}

// TODO Add `card` to = card description `Карта 'Королевская награда'`?
/**
 * <h3>Перечисление для типов карт на русском.</h3>
 */
export const enum CardTypeRusNames {
    ArtefactCard = `Артефакт`,
    ArtefactPlayerCard = `Артефакт на поле игрока`,
    DwarfCard = `Дворф на поле игрока`,
    DwarfPlayerCard = `Дворф`,
    GiantCard = `Гигант`,
    GodCard = `Бог`,
    HeroCard = `Герой`,
    HeroPlayerCard = `Герой на поле игрока`,
    MercenaryCard = `Наёмник`,
    MercenaryPlayerCard = `Наёмник на поле игрока`,
    MultiSuitCard = `Мультифракционная`,
    MultiSuitPlayerCard = `Мультифракционная карта на поле игрока`,
    MythicalAnimalCard = `Мифическое животное`,
    MythicalAnimalPlayerCard = `Мифическое животное на поле игрока`,
    RoyalOfferingCard = `Королевская награда`,
    SpecialCard = `Особая`,
    SpecialPlayerCard = `Особая карта на поле игрока`,
    ValkyryCard = `Валькирия`,
    // Common
    PlayerBoardCard = `Карта на поле игрока`,
    CommandZoneHeroCard = `Карта героя в командной зоне игрока`,
    CommandZoneCampCard = `Карта в командной зоне игрока`,
    CommandZoneMythologicalCreatureCard = `Карта мифического существа в командной зоне игрока`,
    DistinctionCard = `Знак отличия`,
}

/**
 * <h3>Перечисление для суб стадий игры `ActivateGiantAbilityOrPickCard`.</h3>
 */
export const enum ActivateGiantAbilityOrPickCardSubStageNames {
    ClickCardNotGiantAbility = `ClickCardNotGiantAbility`,
    ClickGiantAbilityNotCard = `ClickGiantAbilityNotCard`,
}

/**
 * <h3>Перечисление для суб стадий игры `ActivateGodAbilityOrNotSubStageNames`.</h3>
 */
export const enum ActivateGodAbilityOrNotSubStageNames {
    ActivateGodAbility = `ActivateGodAbility`,
    NotActivateGodAbility = `NotActivateGodAbility`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `ChooseDifficultySoloMode`.</h3>
 */
export const enum ChooseDifficultySoloModeDefaultStageNames {
    ChooseDifficultyLevelForSoloMode = `ChooseDifficultyLevelForSoloMode`,
}

/**
 * <h3>Перечисление для стадий игры `ChooseDifficultySoloMode`.</h3>
 */
export const enum ChooseDifficultySoloModeStageNames {
    ChooseHeroForDifficultySoloMode = `ChooseHeroForDifficultySoloMode`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `ChooseDifficultySoloModeAndvari`.</h3>
 */
export const enum ChooseDifficultySoloModeAndvariDefaultStageNames {
    ChooseStrategyVariantForSoloModeAndvari = `ChooseStrategyVariantForSoloModeAndvari`,
    ChooseStrategyForSoloModeAndvari = `ChooseStrategyForSoloModeAndvari`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `Bids`.</h3>
 */
export const enum BidsDefaultStageNames {
    ClickHandCoin = `ClickHandCoin`,
    ClickBoardCoin = `ClickBoardCoin`,
    BotsPlaceAllCoins = `BotsPlaceAllCoins`,
    SoloBotPlaceAllCoins = `SoloBotPlaceAllCoins`,
    SoloBotAndvariPlaceAllCoins = `SoloBotAndvariPlaceAllCoins`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `BidUline`.</h3>
 */
export const enum BidUlineDefaultStageNames {
    ClickHandCoinUline = `ClickHandCoinUline`,
}

/**
 * <h3>Перечисление для стадий игры `BrisingamensEndGame`.</h3>
 */
export const enum BrisingamensEndGameDefaultStageNames {
    DiscardCardFromPlayerBoard = `DiscardCardFromPlayerBoard`,
}

/**
 * <h3>Перечисление для стадий игры `GetMjollnirProfit`.</h3>
 */
export const enum GetMjollnirProfitDefaultStageNames {
    GetMjollnirProfit = `GetMjollnirProfit`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `EnlistmentMercenaries`.</h3>
 */
export const enum EnlistmentMercenariesDefaultStageNames {
    StartEnlistmentMercenaries = `StartEnlistmentMercenaries`,
    PassEnlistmentMercenaries = `PassEnlistmentMercenaries`,
    GetEnlistmentMercenaries = `GetEnlistmentMercenaries`,
}

/**
 * <h3>Перечисление для стадий игры `EnlistmentMercenaries`.</h3>
 */
export const enum EnlistmentMercenariesStageNames {
    PlaceEnlistmentMercenaries = `PlaceEnlistmentMercenaries`,
}

/**
 * <h3>Перечисление для стадий игры `PlaceYlud`.</h3>
 */
export const enum PlaceYludDefaultStageNames {
    PlaceYludHero = `PlaceYludHero`,
    SoloBotPlaceYludHero = `SoloBotPlaceYludHero`,
    SoloBotAndvariPlaceYludHero = `SoloBotAndvariPlaceYludHero`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `TroopEvaluation`.</h3>
 */
export const enum TroopEvaluationDefaultStageNames {
    ClickDistinctionCard = `ClickDistinctionCard`,
}

/**
 * <h3>Перечисление для стадий игры `TroopEvaluation`.</h3>
 */
export const enum TroopEvaluationStageNames {
    ClickCardToPickDistinction = `ClickCardToPickDistinction`,
    SoloBotClickCardToPickDistinction = `SoloBotClickCardToPickDistinction`,
    SoloBotAndvariClickCardToPickDistinction = `SoloBotAndvariClickCardToPickDistinction`,
}

/**
 * <h3>Перечисление для дефолтных стадий игры `TavernsResolution`.</h3>
 */
export const enum TavernsResolutionDefaultStageNames {
    ClickCard = `ClickCard`,
    ClickCampCard = `ClickCampCard`,
    SoloBotClickCard = `SoloBotClickCard`,
    SoloBotAndvariClickCard = `SoloBotAndvariClickCard`,
}

/**
 * <h3>Перечисление для стадий игры с суб стадиями `TavernsResolution`.</h3>
 */
export const enum TavernsResolutionWithSubStageNames {
    ActivateGiantAbilityOrPickCard = `ActivateGiantAbilityOrPickCard`,
    ActivateGodAbilityOrNot = `ActivateGodAbilityOrNot`,
}

/**
 * <h3>Перечисление для стадий игры `TavernsResolution`.</h3>
 */
export const enum TavernsResolutionStageNames {
    ChooseCoinValueForHrungnirUpgrade = `ChooseCoinValueForHrungnirUpgrade`,
    ChooseSuitOlrun = `ChooseSuitOlrun`,
    DiscardCard2Players = `DiscardCard2Players`,
    GetMythologyCard = `GetMythologyCard`,
    ClickHandTradingCoinUline = `ClickHandTradingCoinUline`,
}

/**
 * <h3>Перечисление для общих стадий игры `SoloBotCommon`.</h3>
 */
export const enum SoloBotCommonStageNames {
    SoloBotClickHeroCard = `SoloBotClickHeroCard`,
    SoloBotPlaceThrudHero = `SoloBotPlaceThrudHero`,
}

/**
 * <h3>Перечисление для общих стадий игры `SoloBotCommonCoinUpgrade`.</h3>
 */
export const enum SoloBotCommonCoinUpgradeStageNames {
    SoloBotClickCoinToUpgrade = `SoloBotClickCoinToUpgrade`,
}

/**
 * <h3>Перечисление для общих стадий игры `SoloBotAndvariCommon`.</h3>
 */
export const enum SoloBotAndvariCommonStageNames {
    SoloBotAndvariClickHeroCard = `SoloBotAndvariClickHeroCard`,
    SoloBotAndvariPlaceThrudHero = `SoloBotAndvariPlaceThrudHero`,
    SoloBotAndvariClickCoinToUpgrade = `SoloBotAndvariClickCoinToUpgrade`,
}

/**
 * <h3>Перечисление для общих стадий игры `Common`.</h3>
 */
export const enum CommonStageNames {
    AddCoinToPouch = `AddCoinToPouch`,
    ChooseCoinValueForVidofnirVedrfolnirUpgrade = `ChooseCoinValueForVidofnirVedrfolnirUpgrade`,
    DiscardTopCardFromSuit = `DiscardTopCardFromSuit`,
    DiscardSuitCardFromPlayerBoard = `DiscardSuitCardFromPlayerBoard`,
    ClickCampCardHolda = `ClickCampCardHolda`,
    PickConcreteCoinToUpgrade = `PickConcreteCoinToUpgrade`,
    PickDiscardCard = `PickDiscardCard`,
    ClickHeroCard = `ClickHeroCard`,
    PlaceMultiSuitCard = `PlaceMultiSuitCard`,
    PlaceThrudHero = `PlaceThrudHero`,
    ClickCoinToUpgrade = `ClickCoinToUpgrade`,
    UpgradeCoinVidofnirVedrfolnir = `UpgradeCoinVidofnirVedrfolnir`,
}

/**
 * <h3>Перечисление для русского названия стадий игры.</h3>
 */
export enum StageRusNames {
    ActivateGiantAbilityOrPickCard = `ActivateGiantAbilityOrPickCard`,
    ActivateGodAbilityOrNot = `ActivateGodAbilityOrNot`,
    AddCoinToPouch = `AddCoinToPouch`,
    ChooseSuitOlrun = `ChooseSuitOlrun`,
    ChooseCoinValueForVidofnirVedrfolnirUpgrade = `ChooseCoinValueForVidofnirVedrfolnirUpgrade`,
    ChooseHeroForDifficultySoloMode = `ChooseHeroForDifficultySoloMode`,
    ChooseCoinValueForHrungnirUpgrade = `ChooseCoinValueForHrungnirUpgrade`,
    DiscardCard2Players = `DiscardCard2Players`,
    DiscardTopCardFromSuit = `DiscardTopCardFromSuit`,
    DiscardSuitCardFromPlayerBoard = `DiscardSuitCardFromPlayerBoard`,
    GetMythologyCard = `GetMythologyCard`,
    ClickCampCardHolda = `ClickCampCardHolda`,
    PickConcreteCoinToUpgrade = `PickConcreteCoinToUpgrade`,
    PickDiscardCard = `PickDiscardCard`,
    ClickCardToPickDistinction = `ClickCardToPickDistinction`,
    SoloBotClickCardToPickDistinction = `SoloBotClickCardToPickDistinction`,
    SoloBotAndvariClickCardToPickDistinction = `SoloBotAndvariClickCardToPickDistinction`,
    ClickHeroCard = `ClickHeroCard`,
    SoloBotClickHeroCard = `SoloBotAndvariClickHeroCard`,
    SoloBotAndvariClickHeroCard = `SoloBotAndvariClickHeroCard`,
    PlaceEnlistmentMercenaries = `PlaceEnlistmentMercenaries`,
    PlaceMultiSuitCard = `PlaceMultiSuitCard`,
    ClickHandTradingCoinUline = `ClickHandTradingCoinUline`,
    PlaceThrudHero = `PlaceThrudHero`,
    SoloBotPlaceThrudHero = `SoloBotPlaceThrudHero`,
    SoloBotAndvariPlaceThrudHero = `SoloBotAndvariPlaceThrudHero`,
    ClickCoinToUpgrade = `ClickCoinToUpgrade`,
    SoloBotClickCoinToUpgrade = `SoloBotClickCoinToUpgrade`,
    SoloBotAndvariClickCoinToUpgrade = `SoloBotAndvariClickCoinToUpgrade`,
    UpgradeCoinVidofnirVedrfolnir = `UpgradeCoinVidofnirVedrfolnir`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты героя.</h3>
 */
export const enum PickHeroCardValidatorNames {
    conditions = `conditions`,
    discardCard = `discardCard`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты героя.</h3>
 */
export const enum SoloGameAndvariStrategyNames {
    NoHeroEasyStrategy = `Без стартовых героев (лёгкая стратегия)`,
    NoHeroHardStrategy = `Без стартовых героев (сложная стратегия)`,
    WithHeroEasyStrategy = `Со стартовыми героями (лёгкая стратегия)`,
    WithHeroHardStrategy = `Со стартовыми героями (сложная стратегия)`,
}

/**
 * <h3>Перечисление для названия валидаторов для выбора карты при выборе героя.</h3>
 */
export const enum PickCardValidatorNames {
    pickDiscardCardToStack = `pickDiscardCardToStack`,
    pickCampCardToStack = `pickCampCardToStack`,
}

/**
 * <h3>Перечисление для названия карт 'Королевская награда'.</h3>
 */
export const enum RoyalOfferingNames {
    PlusThree = `+3`,
    PlusFive = `+5`,
}

/**
 * <h3>Перечисление для названия таверн.</h3>
 */
export const enum TavernNames {
    LaughingGoblin = `«Весёлый гоблин»`,
    DancingDragon = `«Парящий дракон»`,
    ShiningHorse = `«Гарцующий конь»`,
}

/**
 * <h3>Перечисление для названия суб валидаторов мувов в стадию 'ActivateGiantAbilityOrPickCard'.</h3>
 */
export const enum ActivateGiantAbilityOrPickCardSubMoveValidatorNames {
    ClickCardNotGiantAbilityMoveValidator = `ClickCardNotGiantAbilityMoveValidator`,
    ClickGiantAbilityNotCardMoveValidator = `ClickGiantAbilityNotCardMoveValidator`,
}

/**
 * <h3>Перечисление для названия суб валидаторов мувов в стадию 'ActivateGiantAbilityOrPickCard'.</h3>
 */
export const enum ActivateGodAbilityOrNotSubMoveValidatorNames {
    ActivateGodAbilityMoveValidator = `ActivateGodAbilityMoveValidator`,
    NotActivateGodAbilityMoveValidator = `NotActivateGodAbilityMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'ChooseDifficultySoloMode'.</h3>
 */
export const enum ChooseDifficultySoloModeMoveValidatorNames {
    ChooseDifficultyLevelForSoloModeMoveValidator = `ChooseDifficultyLevelForSoloModeMoveValidator`,
    ChooseHeroForDifficultySoloModeMoveValidator = `ChooseHeroForDifficultySoloModeMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'ChooseDifficultySoloModeAndvari'.</h3>
 */
export const enum ChooseDifficultySoloModeAndvariMoveValidatorNames {
    ChooseStrategyForSoloModeAndvariMoveValidator = `ChooseStrategyForSoloModeAndvariMoveValidator`,
    ChooseStrategyVariantForSoloModeAndvariMoveValidator = `ChooseStrategyVariantForSoloModeAndvariMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'Bids'.</h3>
 */
export const enum BidsMoveValidatorNames {
    ClickBoardCoinMoveValidator = `ClickBoardCoinMoveValidator`,
    ClickHandCoinMoveValidator = `ClickHandCoinMoveValidator`,
    // Bots
    BotsPlaceAllCoinsMoveValidator = `BotsPlaceAllCoinsMoveValidator`,
    // Solo Bot
    SoloBotPlaceAllCoinsMoveValidator = `SoloBotPlaceAllCoinsMoveValidator`,
    // Solo Bot Andvari
    SoloBotAndvariPlaceAllCoinsMoveValidator = `SoloBotAndvariPlaceAllCoinsMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'BidUline'.</h3>
 */
export const enum BidUlineMoveValidatorNames {
    ClickHandCoinUlineMoveValidator = `ClickHandCoinUlineMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'TavernsResolution'.</h3>
 */
export const enum TavernsResolutionMoveValidatorNames {
    ClickCardMoveValidator = `ClickCardMoveValidator`,
    ClickCampCardMoveValidator = `ClickCampCardMoveValidator`,
    // Solo Bot
    SoloBotClickCardMoveValidator = `SoloBotClickCardMoveValidator`,
    // Solo Bot Andvari
    SoloBotAndvariClickCardMoveValidator = `SoloBotAndvariClickCardMoveValidator`,
    // TODO Add `ChooseCoinValueForHrungnirUpgradeMoveValidator` to UI validate
    ChooseCoinValueForHrungnirUpgradeMoveValidator = `ChooseCoinValueForHrungnirUpgradeMoveValidator`,
    ChooseSuitOlrunMoveValidator = `ChooseSuitOlrunMoveValidator`,
    DiscardCard2PlayersMoveValidator = `DiscardCard2PlayersMoveValidator`,
    GetMythologyCardMoveValidator = `GetMythologyCardMoveValidator`,
    ClickHandTradingCoinUlineMoveValidator = `ClickHandTradingCoinUlineMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'EnlistmentMercenaries'.</h3>
 */
export const enum EnlistmentMercenariesMoveValidatorNames {
    StartEnlistmentMercenariesMoveValidator = `StartEnlistmentMercenariesMoveValidator`,
    PassEnlistmentMercenariesMoveValidator = `PassEnlistmentMercenariesMoveValidator`,
    GetEnlistmentMercenariesMoveValidator = `GetEnlistmentMercenariesMoveValidator`,
    PlaceEnlistmentMercenariesMoveValidator = `PlaceEnlistmentMercenariesMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'PlaceYlud'.</h3>
 */
export const enum PlaceYludMoveValidatorNames {
    PlaceYludHeroMoveValidator = `PlaceYludHeroMoveValidator`,
    // Solo Bot
    SoloBotPlaceYludHeroMoveValidator = `SoloBotPlaceYludHeroMoveValidator`,
    // Solo Bot Andvari
    SoloBotAndvariPlaceYludHeroMoveValidator = `SoloBotAndvariPlaceYludHeroMoveValidator`,

}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'TroopEvaluation'.</h3>
 */
export const enum TroopEvaluationMoveValidatorNames {
    ClickDistinctionCardMoveValidator = `ClickDistinctionCardMoveValidator`,
    ClickCardToPickDistinctionMoveValidator = `ClickCardToPickDistinctionMoveValidator`,
    // Solo Bot
    SoloBotClickCardToPickDistinctionMoveValidator = `SoloBotClickCardToPickDistinctionMoveValidator`,
    // Solo Bot Andvari
    SoloBotAndvariClickCardToPickDistinctionMoveValidator = `SoloBotAndvariClickCardToPickDistinctionMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'BrisingamensEndGame'.</h3>
 */
export const enum BrisingamensEndGameMoveValidatorNames {
    DiscardCardFromPlayerBoardMoveValidator = `DiscardCardFromPlayerBoardMoveValidator`,
}

/**
 * <h3>Перечисление для названия валидаторов мувов в фазу 'GetMjollnirProfit'.</h3>
 */
export const enum GetMjollnirProfitMoveValidatorNames {
    GetMjollnirProfitMoveValidator = `GetMjollnirProfitMoveValidator`,
}

/**
 * <h3>Перечисление для названия общих валидаторов мувов.</h3>
 */
export const enum CommonMoveValidatorNames {
    AddCoinToPouchMoveValidator = `AddCoinToPouchMoveValidator`,
    ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator =
    `ChooseCoinValueForVidofnirVedrfolnirUpgradeMoveValidator`,
    ClickCampCardHoldaMoveValidator = `ClickCampCardHoldaMoveValidator`,
    ClickCoinToUpgradeMoveValidator = `ClickCoinToUpgradeMoveValidator`,
    PickConcreteCoinToUpgradeMoveValidator = `PickConcreteCoinToUpgradeMoveValidator`,
    ClickHeroCardMoveValidator = `ClickHeroCardMoveValidator`,
    DiscardTopCardFromSuitMoveValidator = `DiscardTopCardFromSuitMoveValidator`,
    DiscardSuitCardFromPlayerBoardMoveValidator = `DiscardSuitCardFromPlayerBoardMoveValidator`,
    PickDiscardCardMoveValidator = `PickDiscardCardMoveValidator`,
    PlaceMultiSuitCardMoveValidator = `PlaceMultiSuitCardMoveValidator`,
    PlaceThrudHeroMoveValidator = `PlaceThrudHeroMoveValidator`,
    UpgradeCoinVidofnirVedrfolnirMoveValidator = `UpgradeCoinVidofnirVedrfolnirMoveValidator`,
}

/**
 * <h3>Перечисление для названия общих соло бот валидаторов мувов.</h3>
 */
export const enum SoloBotCommonMoveValidatorNames {
    SoloBotClickHeroCardMoveValidator = `SoloBotClickHeroCardMoveValidator`,
    SoloBotPlaceThrudHeroMoveValidator = `SoloBotPlaceThrudHeroMoveValidator`,
}

/**
 * <h3>Перечисление для названия общих соло бот улучшений монеты валидаторов мувов.</h3>
 */
export const enum SoloBotCommonCoinUpgradeMoveValidatorNames {
    SoloBotClickCoinToUpgradeMoveValidator = `SoloBotClickCoinToUpgradeMoveValidator`,
}


/**
 * <h3>Перечисление для названия общих соло бот Andvari валидаторов мувов.</h3>
 */
export const enum SoloBotAndvariCommonMoveValidatorNames {
    SoloBotAndvariClickHeroCardMoveValidator = `SoloBotAndvariClickHeroCardMoveValidator`,
    SoloBotAndvariPlaceThrudHeroMoveValidator = `SoloBotAndvariPlaceThrudHeroMoveValidator`,
    SoloBotAndvariClickCoinToUpgradeMoveValidator = `SoloBotAndvariClickCoinToUpgradeMoveValidator`,
}
