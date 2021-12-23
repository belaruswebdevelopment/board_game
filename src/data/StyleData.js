import { SuitNames } from "./SuitData";
/**
 * <h3>Путь к базовым картам.</h3>
 */
const basicCardsPath = `url(/img/cards/basic/basic`;
/**
 * <h3>Путь к картам кэмпа.</h3>
 */
const campCardsPath = `url(/img/cards/camp/Camp`;
/**
 * <h3>Путь к картам преимуществ.</h3>
 */
const distinctionsPath = `url(/img/distinctions/Distinctions.png)`;
/**
 * <h3>Путь к базовым героям.</h3>
 */
const heroesBasicPath = `url(/img/cards/heroes/basic/`;
/**
 * <h3>Путь к героям Тингвеллира.</h3>
 */
const heroesThingvellirPath = `url(/img/cards/heroes/thingvellir/`;
/**
 * <h3>Путь к изображениям таверн.</h3>
 */
const tavernsPath = `url(/img/taverns/Taverns.png)`;
// todo Add vars for paths
/**
 * <h3>Стилизация при отрисовке всех картинок в игре.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при отрисовке всех картинок в игре.</li>
 * </ol>
 */
export const Styles = {
    Camp: () => ({
        background: `${campCardsPath}.png) no-repeat 0px 3px / 24px 18px`,
    }),
    CampCards: (tier, cardPath) => {
        if (tier === 0) {
            switch (cardPath) {
                case `Draupnir`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px 0px / 128px 144px`,
                    };
                case `Fafnir Baleygr`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px 0px / 128px 144px`,
                    };
                case `Svalinn`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px 0px / 128px 144px`,
                    };
                case `Megingjord`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px 0px / 128px 144px`,
                    };
                case `Vegvisir`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px -48px / 128px 144px`,
                    };
                case `Vidofnir Vedrfolnir`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px -48px / 128px 144px`,
                    };
                case `hunter explorer 6`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px -48px / 128px 144px`,
                    };
                case `hunter miner 1`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px -48px / 128px 144px`,
                    };
                case `blacksmith miner 1`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px -96px / 128px 144px`,
                    };
                case `warrior 6 blacksmith`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px -96px / 128px 144px`,
                    };
                case `warrior 6 explorer 8`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px -96px / 128px 144px`,
                    };
                case `warrior 9 explorer 11`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px -96px / 128px 144px`,
                    };
                default:
                    return {
                        background: ``,
                    };
            }
        }
        else if (tier === 1) {
            switch (cardPath) {
                case `Mjollnir`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px 0px / 128px 144px`,
                    };
                case `Hofud`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px 0px / 128px 144px`,
                    };
                case `Brisingamens`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px 0px / 128px 144px`,
                    };
                case `Hrafnsmerki`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px 0px / 128px 144px`,
                    };
                case `Gjallarhorn`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px -48px / 128px 144px`,
                    };
                case `Jarnglofi`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px -48px / 128px 144px`,
                    };
                case `hunter blacksmith`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px -48px / 128px 144px`,
                    };
                case `warrior 9 explorer 11`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px -48px / 128px 144px`,
                    };
                case `blacksmith explorer 8`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px -96px / 128px 144px`,
                    };
                case `warrior 6 miner 1`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px -96px / 128px 144px`,
                    };
                case `explorer 8 miner 1`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px -96px / 128px 144px`,
                    };
                case `warrior 6 hunter`:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px -96px / 128px 144px`,
                    };
                default:
                    return {
                        background: ``,
                    };
            }
        }
        return {
            background: ``,
        };
    },
    Cards: (suit, name, points) => {
        if (name === `Olwin`) {
            switch (name) {
                case `Olwin`:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
                    };
                default:
                    return {
                        background: ``,
                    };
            }
        }
        else if (suit) {
            switch (suit) {
                case SuitNames.BLACKSMITH:
                    return {
                        background: `${basicCardsPath}0.png) no-repeat 0px 0px / 288px 288px`,
                    };
                case SuitNames.HUNTER:
                    return {
                        background: `${basicCardsPath}0.png) no-repeat -128px 0px / 288px 288px`,
                    };
                case SuitNames.MINER:
                    switch (points) {
                        case 0:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -192px 0px / 288px 288px`,
                            };
                        case 1:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -192px -48px / 288px 288px`,
                            };
                        case 2:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -224px -48px / 288px 288px`,
                            };
                        default:
                            return {
                                background: ``,
                            };
                    }
                case SuitNames.WARRIOR:
                    switch (points) {
                        case 3:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -256px -96px / 288px 288px`,
                            };
                        case 4:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat 0px -144px / 288px 288px`,
                            };
                        case 5:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -32px -144px / 288px 288px`,
                            };
                        case 6:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -64px -144px / 288px 288px`,
                            };
                        case 7:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -32px -192px / 288px 288px`,
                            };
                        case 8:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -64px -192px / 288px 288px`,
                            };
                        case 9:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat 0px -240px / 288px 288px`,
                            };
                        case 10:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -32px -240px / 288px 288px`,
                            };
                        default:
                            return {
                                background: ``,
                            };
                    }
                case SuitNames.EXPLORER:
                    switch (points) {
                        case 5:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -64px -240px / 288px 288px`,
                            };
                        case 6:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -96px -144px / 288px 288px`,
                            };
                        case 7:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -128px -144px / 288px 288px`,
                            };
                        case 8:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -160px -144px / 288px 288px`,
                            };
                        case 9:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -96px -192px / 288px 288px`,
                            };
                        case 10:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -128px -192px / 288px 288px`,
                            };
                        case 11:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -160px -192px / 288px 288px`,
                            };
                        case 12:
                            return {
                                background: `${basicCardsPath}0.png) no-repeat -96px -240px / 288px 288px`,
                            };
                        default:
                            return {
                                background: ``,
                            };
                    }
                default:
                    return {
                        background: ``,
                    };
            }
        }
        else {
            switch (name) {
                case `улучшение монеты на +3`:
                    return {
                        background: `${basicCardsPath}0.png) no-repeat -128px -240px / 288px 288px`,
                    };
                case `улучшение монеты на +5`:
                    return {
                        background: `${basicCardsPath}1.png) no-repeat -128px -240px / 288px 288px`,
                    };
                default:
                    return {
                        background: ``,
                    };
            }
        }
    },
    Coin: (value, initial) => ({
        background: `url(/img/coins/Coin${value}${initial ? `Initial` : ``}.jpg) no-repeat 0px 0px / 40px 40px`,
    }),
    CoinBack: () => ({
        background: `url(/img/coins/CoinBack.png) no-repeat center center / 40px 40px`,
    }),
    Distinctions: (distinction) => {
        switch (distinction) {
            case SuitNames.BLACKSMITH:
                return {
                    background: `${distinctionsPath} no-repeat 0px -100px / 96px 150px`,
                };
            case SuitNames.HUNTER:
                return {
                    background: `${distinctionsPath} no-repeat -64px 0px / 96px 150px`,
                };
            case SuitNames.MINER:
                return {
                    background: `${distinctionsPath} no-repeat 0px -50px / 96px 150px`,
                };
            case SuitNames.WARRIOR:
                return {
                    background: `${distinctionsPath} no-repeat -32px -50px / 96px 150px`,
                };
            case SuitNames.EXPLORER:
                return {
                    background: `${distinctionsPath} no-repeat 0px 0px / 96px 150px`,
                };
            default:
                return {
                    background: ``,
                };
        }
    },
    DistinctionsBack: () => ({
        background: `url(/img/distinctions/DistinctionsBack.png) no-repeat 0px 0px / 12px 18px`,
    }),
    Exchange: () => ({
        background: `url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px`,
    }),
    Heroes: (game, heroName) => {
        if (game === `base`) {
            switch (heroName) {
                case `Bonfur`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -96px -48px / 288px 144px`,
                    };
                case `Aegur`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -128px -96px / 288px 144px`,
                    };
                case `Dagda`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -128px -48px / 288px 144px`,
                    };
                case `Aral`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -160px -96px / 288px 144px`,
                    };
                case `Lokdur`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -224px 0px / 288px 144px`,
                    };
                case `Zoral`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -32px -48px / 288px 144px`,
                    };
                case `Tarah`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -160px 0px / 288px 144px`,
                    };
                case `Kraal`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -192px 0px / 288px 144px`,
                    };
                case `Idunn`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -128px 0px / 288px 144px`,
                    };
                case `Hourya`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -96px -96px / 288px 144px`,
                    };
                case `Dwerg Bergelmir`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat 0px 0px / 288px 144px`,
                    };
                case `Dwerg Jungir`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -64px 0px / 288px 144px`,
                    };
                case `Dwerg Aesir`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -64px -48px / 288px 144px`,
                    };
                case `Dwerg Ymir`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -32px -96px / 288px 144px`,
                    };
                case `Dwerg Sigmir`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -64px -96px / 288px 144px`,
                    };
                case `Ylud`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -32px 0px / 288px 144px`,
                    };
                case `Uline`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -96px 0px / 288px 144px`,
                    };
                case `Grid`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -256px 0px / 288px 144px`,
                    };
                case `Thrud`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat 0px -48px / 288px 144px`,
                    };
                case `Skaa`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -160px -48px / 288px 144px`,
                    };
                case `Jarika`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -192px -48px / 288px 144px`,
                    };
                case `Astrid`:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat 0px -96px / 288px 144px`,
                    };
                default:
                    return {
                        background: ``,
                    };
            }
        }
        else if (game === `thingvellir`) {
            switch (heroName) {
                case `Andumia`:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat 0px 0px / 128px 100px`,
                    };
                case `Holda`:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -0px / 128px 100px`,
                    };
                case `Khrad`:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -64px 0px / 128px 100px`,
                    };
                case `Olwin`:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat 0px -50px / 128px 100px`,
                    };
                case `Zolkur`:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -96px -50px / 128px 100px`,
                    };
                default:
                    return {
                        background: ``,
                    };
            }
        }
        return {
            background: "",
        };
    },
    HeroBack: () => ({
        background: `url(/img/cards/heroes/HeroBack.png) no-repeat 6px 3px / 12px 18px`,
    }),
    Priorities: (priority) => ({
        background: `url(/img/priorities/Priority${priority}.png) no-repeat 0px 0px / 28px 38px`,
    }),
    Priority: () => ({
        background: `url(/img/priorities/Priority.png) no-repeat -34px -7px / 66px 36px`,
    }),
    Suits: (suit) => ({
        background: `url(/img/suits/${suit}.png) no-repeat 0px 0px / 24px 24px`,
    }),
    Taverns: (tavernId) => {
        switch (tavernId) {
            case 0:
                return {
                    background: `${tavernsPath} no-repeat -2px -6px / 75px 42px`,
                };
            case 1:
                return {
                    background: `${tavernsPath} no-repeat -25px -18px / 75px 42px`,
                };
            case 2:
                return {
                    background: `${tavernsPath} no-repeat -50px -9px / 75px 42px`,
                };
            default:
                return {
                    background: ``,
                };
        }
    },
};
