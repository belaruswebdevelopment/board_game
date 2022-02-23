import { ArtefactNames, CardNames, HeroNames, SuitNames } from "../typescript/enums";
import { IBackground, IStyles, SuitTypes } from "../typescript/interfaces";

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

/**
 * <h3>Стилизация при отображении всех картинок в игре.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>Используется при отображении всех картинок в игре.</li>
 * </ol>
 */
export const Styles: IStyles = {
    Camp: (): IBackground => ({
        background: `${campCardsPath}.png) no-repeat 0px 3px / 24px 18px`,
    }),
    CampCards: (tier: number, cardPath: string): IBackground | never => {
        if (tier === 0) {
            switch (cardPath) {
                case ArtefactNames.Draupnir:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px 0px / 128px 144px`,
                    };
                case ArtefactNames.Fafnir_Baleygr:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px 0px / 128px 144px`,
                    };
                case ArtefactNames.Svalinn:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px 0px / 128px 144px`,
                    };
                case ArtefactNames.Megingjord:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px 0px / 128px 144px`,
                    };
                case ArtefactNames.Vegvisir:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px -48px / 128px 144px`,
                    };
                case ArtefactNames.Vidofnir_Vedrfolnir:
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
                    throw new Error(`Нет такой карты кэмпа во 1-й эпохе.`);
            }
        } else if (tier === 1) {
            switch (cardPath) {
                case ArtefactNames.Mjollnir:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px 0px / 128px 144px`,
                    };
                case ArtefactNames.Hofud:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -32px 0px / 128px 144px`,
                    };
                case ArtefactNames.Brisingamens:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -64px 0px / 128px 144px`,
                    };
                case ArtefactNames.Hrafnsmerki:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat -96px 0px / 128px 144px`,
                    };
                case ArtefactNames.Gjallarhorn:
                    return {
                        background: `${campCardsPath}${tier}.png) no-repeat 0px -48px / 128px 144px`,
                    };
                case ArtefactNames.Jarnglofi:
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
                    throw new Error(`Нет такой карты кэмпа во 2-й эпохе.`);
            }
        }
        throw new Error(`Нет такой карты кэмпа.`);
    },
    Cards: (suit: SuitTypes | null, name: string, points: number | null): IBackground | never => {
        if (name === CardNames.ChiefBlacksmith || name === CardNames.Olwin) {
            switch (name) {
                case CardNames.ChiefBlacksmith:
                    return {
                        background: `${distinctionsPath} no-repeat -32px -0px / 96px 150px`,
                    };
                case CardNames.Olwin:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
                    };
                default:
                    throw new Error(`Нет такой карты среди дополнительных карт.`);
            }
        } else if (suit !== null) {
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
                            throw new Error(`Нет такой карты во фракции ${SuitNames.MINER}.`);
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
                            throw new Error(`Нет такой карты во фракции ${SuitNames.WARRIOR}.`);
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
                            throw new Error(`Нет такой карты во фракции ${SuitNames.EXPLORER}.`);
                    }
                default:
                    throw new Error(`Нет такой карты.`);
            }
        } else {
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
                    throw new Error(`Нет такой карты улучшения монеты.`);
            }
        }
    },
    Coin: (value: number, initial: boolean): IBackground => ({
        background: `url(/img/coins/Coin${value}${initial ? `Initial` : ``}.jpg) no-repeat 0px 0px / 40px 40px`,
    }),
    CoinBack: (): IBackground => ({
        background: `url(/img/coins/CoinBack.png) no-repeat center center / 40px 40px`,
    }),
    Distinctions: (distinction: string): IBackground | never => {
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
                throw new Error(`Нет такого преимущества конца эпохи.`);
        }
    },
    DistinctionsBack: (): IBackground => ({
        background: `url(/img/distinctions/DistinctionsBack.png) no-repeat 0px 0px / 12px 18px`,
    }),
    Exchange: (): IBackground => ({
        background: `url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px`,
    }),
    Heroes: (game: string, heroName: string): IBackground | never => {
        if (game === `base`) {
            switch (heroName) {
                case HeroNames.Bonfur:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -96px -48px / 288px 144px`,
                    };
                case HeroNames.Aegur:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -128px -96px / 288px 144px`,
                    };
                case HeroNames.Dagda:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -128px -48px / 288px 144px`,
                    };
                case HeroNames.Aral:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -160px -96px / 288px 144px`,
                    };
                case HeroNames.Lokdur:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -224px 0px / 288px 144px`,
                    };
                case HeroNames.Zoral:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -32px -48px / 288px 144px`,
                    };
                case HeroNames.Tarah:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -160px 0px / 288px 144px`,
                    };
                case HeroNames.Kraal:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -192px 0px / 288px 144px`,
                    };
                case HeroNames.Idunn:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -128px 0px / 288px 144px`,
                    };
                case HeroNames.Hourya:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -96px -96px / 288px 144px`,
                    };
                case HeroNames.Dwerg_Bergelmir:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat 0px 0px / 288px 144px`,
                    };
                case HeroNames.Dwerg_Jungir:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -64px 0px / 288px 144px`,
                    };
                case HeroNames.Dwerg_Aesir:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -64px -48px / 288px 144px`,
                    };
                case HeroNames.Dwerg_Ymir:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -32px -96px / 288px 144px`,
                    };
                case HeroNames.Dwerg_Sigmir:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -64px -96px / 288px 144px`,
                    };
                case HeroNames.Ylud:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -32px 0px / 288px 144px`,
                    };
                case HeroNames.Uline:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -96px 0px / 288px 144px`,
                    };
                case HeroNames.Grid:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -256px 0px / 288px 144px`,
                    };
                case HeroNames.Thrud:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat 0px -48px / 288px 144px`,
                    };
                case HeroNames.Skaa:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -160px -48px / 288px 144px`,
                    };
                case HeroNames.Jarika:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat -192px -48px / 288px 144px`,
                    };
                case HeroNames.Astrid:
                    return {
                        background: `${heroesBasicPath}heroes.png) no-repeat 0px -96px / 288px 144px`,
                    };
                default:
                    throw new Error(`Нет такого героя в базовой игре.`);
            }
        } else if (game === `thingvellir`) {
            switch (heroName) {
                case HeroNames.Andumia:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat 0px 0px / 128px 100px`,
                    };
                case HeroNames.Holda:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -0px / 128px 100px`,
                    };
                case HeroNames.Khrad:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -64px 0px / 128px 100px`,
                    };
                case HeroNames.Olwin:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat 0px -50px / 128px 100px`,
                    };
                case HeroNames.Zolkur:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -96px -50px / 128px 100px`,
                    };
                default:
                    throw new Error(`Нет такого героя в дополнении 'thingvellir'.`);
            }
        }
        throw new Error(`Нет такого героя.`);
    },
    HeroBack: (): IBackground => ({
        background: `url(/img/cards/heroes/HeroBack.png) no-repeat 6px 3px / 12px 18px`,
    }),
    Priorities: (priority: number): IBackground => ({
        background: `url(/img/priorities/Priority${priority}.png) no-repeat 0px 0px / 28px 38px`,
    }),
    Priority: (): IBackground => ({
        background: `url(/img/priorities/Priority.png) no-repeat -34px -7px / 66px 36px`,
    }),
    Suits: (suit: SuitTypes): IBackground => ({
        background: `url(/img/suits/${suit}.png) no-repeat 0px 0px / 24px 24px`,
    }),
    Taverns: (tavernId: number): IBackground | never => {
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
                throw new Error(`Нет такой таверны.`);
        }
    },
};
