import { ArtefactNames, HeroNames, MultiSuitCardNames, RoyalOfferingNames, SpecialCardNames, SuitNames } from "../typescript/enums";
import type { CanBeNullType, CardNamesForStylesType, IBackground, IStyles, MythologicalCreatureNameTypes, SuitNamesKeyofTypeofType, TierType } from "../typescript/interfaces";

/**
 * <h3>Путь к базовым картам.</h3>
 */
const basicCardsPath = `url(/img/cards/basic/basic`;

/**
 * <h3>Путь к картам лагеря.</h3>
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

const promosPath = `url(/img/cards/promos/promo_thingvellir.png)`;

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
    CampBack: (tier: TierType): IBackground => ({
        background: `url(/img/cards/camp/CampBack${tier}.png) no-repeat 6px 3px / 12px 18px`,
    }),
    CampCard: (cardPath: string): IBackground => {
        switch (cardPath) {
            case ArtefactNames.Draupnir:
                return {
                    background: `${campCardsPath}0.png) no-repeat 0px 0px / 128px 144px`,
                };
            case ArtefactNames.Fafnir_Baleygr:
                return {
                    background: `${campCardsPath}0.png) no-repeat -32px 0px / 128px 144px`,
                };
            case ArtefactNames.Svalinn:
                return {
                    background: `${campCardsPath}0.png) no-repeat -64px 0px / 128px 144px`,
                };
            case ArtefactNames.Megingjord:
                return {
                    background: `${campCardsPath}0.png) no-repeat -96px 0px / 128px 144px`,
                };
            case ArtefactNames.Vegvisir:
                return {
                    background: `${campCardsPath}0.png) no-repeat 0px -48px / 128px 144px`,
                };
            case ArtefactNames.Vidofnir_Vedrfolnir:
                return {
                    background: `${campCardsPath}0.png) no-repeat -32px -48px / 128px 144px`,
                };
            case `hunter explorer 6`:
                return {
                    background: `${campCardsPath}0.png) no-repeat -64px -48px / 128px 144px`,
                };
            case `hunter miner 1`:
                return {
                    background: `${campCardsPath}0.png) no-repeat -96px -48px / 128px 144px`,
                };
            case `blacksmith miner 1`:
                return {
                    background: `${campCardsPath}0.png) no-repeat 0px -96px / 128px 144px`,
                };
            case `warrior 6 blacksmith`:
                return {
                    background: `${campCardsPath}0.png) no-repeat -32px -96px / 128px 144px`,
                };
            case `warrior 6 explorer 8`:
                return {
                    background: `${campCardsPath}0.png) no-repeat -64px -96px / 128px 144px`,
                };
            case `warrior 9 explorer 11`:
                return {
                    background: `${campCardsPath}0.png) no-repeat -96px -96px / 128px 144px`,
                };
            case ArtefactNames.Mjollnir:
                return {
                    background: `${campCardsPath}1.png) no-repeat 0px 0px / 128px 144px`,
                };
            case ArtefactNames.Hofud:
                return {
                    background: `${campCardsPath}1.png) no-repeat -32px 0px / 128px 144px`,
                };
            case ArtefactNames.Brisingamens:
                return {
                    background: `${campCardsPath}1.png) no-repeat -64px 0px / 128px 144px`,
                };
            case ArtefactNames.Hrafnsmerki:
                return {
                    background: `${campCardsPath}1.png) no-repeat -96px 0px / 128px 144px`,
                };
            case ArtefactNames.Gjallarhorn:
                return {
                    background: `${campCardsPath}1.png) no-repeat 0px -48px / 128px 144px`,
                };
            case ArtefactNames.Jarnglofi:
                return {
                    background: `${campCardsPath}1.png) no-repeat -32px -48px / 128px 144px`,
                };
            case ArtefactNames.Odroerir_The_Mythic_Cauldron:
                return {
                    background: `${promosPath} no-repeat -39px -4px / 76px 58px`,
                };
            case `hunter blacksmith`:
                return {
                    background: `${campCardsPath}1.png) no-repeat -64px -48px / 128px 144px`,
                };
            case `blacksmith explorer 8`:
                return {
                    background: `${campCardsPath}1.png) no-repeat 0px -96px / 128px 144px`,
                };
            case `warrior 6 miner 1`:
                return {
                    background: `${campCardsPath}1.png) no-repeat -32px -96px / 128px 144px`,
                };
            case `explorer 8 miner 1`:
                return {
                    background: `${campCardsPath}1.png) no-repeat -64px -96px / 128px 144px`,
                };
            case `warrior 6 hunter`:
                return {
                    background: `${campCardsPath}1.png) no-repeat -96px -96px / 128px 144px`,
                };
            default:
                throw new Error(`Нет такой карты '${cardPath}' лагеря в '2' эпохе.`);
        }
    },
    CardBack: (tier: TierType): IBackground => ({
        background: `url(/img/cards/basic/CardBack${tier}.png) no-repeat 6px 3px / 12px 18px`,
    }),
    Card: (suit: SuitNamesKeyofTypeofType, name: CardNamesForStylesType, points: CanBeNullType<number>):
        IBackground => {
        if (name === SpecialCardNames.ChiefBlacksmith || name === MultiSuitCardNames.OlwinsDouble) {
            switch (name) {
                case SpecialCardNames.ChiefBlacksmith:
                    return {
                        background: `${distinctionsPath} no-repeat -32px -0px / 96px 150px`,
                    };
                case MultiSuitCardNames.OlwinsDouble:
                    return {
                        background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
                    };
                // TODO Add Gullinbursti
                // case MultiCardNames.Gullinbursti:
                //     return {
                //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
                //     };
                default:
                    throw new Error(`Нет такой карты '${name}' среди специальных карт.`);
            }
        } else {
            // TODO Add images for different cards in same suit by unique id in card name -> use this names for keys
            switch (suit) {
                case SuitNames.blacksmith:
                    return {
                        background: `${basicCardsPath}0.png) no-repeat 0px 0px / 288px 288px`,
                    };
                case SuitNames.hunter:
                    return {
                        background: `${basicCardsPath}0.png) no-repeat -128px 0px / 288px 288px`,
                    };
                case SuitNames.miner:
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
                            throw new Error(`Нет такой карты во фракции ${SuitNames.miner}.`);
                    }
                case SuitNames.warrior:
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
                            throw new Error(`Нет такой карты '${points}' во фракции ${SuitNames.warrior}.`);
                    }
                case SuitNames.explorer:
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
                            throw new Error(`Нет такой карты '${points}' во фракции ${SuitNames.explorer}.`);
                    }
                default:
                    throw new Error(`Нет такой карты.`);
            }
        }
    },
    Coin: (value: number, initial: boolean): IBackground => ({
        background: `url(/img/coins/Coin${value}${initial ? `Initial` : ``}.jpg) no-repeat 0px 0px / 40px 40px`,
    }),
    CoinSmall: (value: number, initial: boolean): IBackground => ({
        background: `url(/img/coins/Coin${value}${initial ? `Initial` : ``}.jpg) no-repeat 0px 0px / 32px 32px`,
    }),
    CoinBack: (): IBackground => ({
        background: `url(/img/coins/CoinBack.png) no-repeat center center / 40px 40px`,
    }),
    Distinction: (distinction: SuitNamesKeyofTypeofType): IBackground => {
        switch (distinction) {
            case SuitNames.blacksmith:
                return {
                    background: `${distinctionsPath} no-repeat 0px -100px / 96px 150px`,
                };
            case SuitNames.hunter:
                return {
                    background: `${distinctionsPath} no-repeat -64px 0px / 96px 150px`,
                };
            case SuitNames.miner:
                return {
                    background: `${distinctionsPath} no-repeat 0px -50px / 96px 150px`,
                };
            case SuitNames.warrior:
                return {
                    background: `${distinctionsPath} no-repeat -32px -50px / 96px 150px`,
                };
            case SuitNames.explorer:
                return {
                    background: `${distinctionsPath} no-repeat 0px 0px / 96px 150px`,
                };
            default:
                throw new Error(`Нет такого преимущества '${distinction}' конца эпохи.`);
        }
    },
    DistinctionsBack: (): IBackground => ({
        background: `url(/img/distinctions/DistinctionsBack.png) no-repeat 0px 0px / 12px 18px`,
    }),
    Exchange: (): IBackground => ({
        background: `url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px`,
    }),
    Hero: (heroName: HeroNames): IBackground => {
        let _exhaustiveCheck: never;
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
            case HeroNames.Crovax_The_Doppelganger:
                return {
                    background: `${promosPath} no-repeat -4px -4px / 76px 58px`,
                };
            default:
                _exhaustiveCheck = heroName;
                throw new Error(`Нет такого героя '${heroName}'.`);
                return _exhaustiveCheck;
        }
    },
    HeroBack: (): IBackground => ({
        background: `url(/img/cards/heroes/HeroBack.png) no-repeat 6px 3px / 12px 18px`,
    }),
    MythologicalCreature: (name: MythologicalCreatureNameTypes): IBackground => {
        // TODO Add  _exhaustiveCheck = heroName;
        switch (name) {
            // case GiantNames.Gymir:
            //     return {
            //         background: `${distinctionsPath} no-repeat -32px -0px / 96px 150px`,
            //     };
            // case GiantNames.Hrungnir:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case GiantNames.Skymir:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case GiantNames.Surt:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case GiantNames.Thrivaldi:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case GodNames.Freyja:
            //     return {
            //         background: `${distinctionsPath} no-repeat -32px -0px / 96px 150px`,
            //     };
            // case GodNames.Frigg:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case GodNames.Loki:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case GodNames.Odin:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case GodNames.Thor:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case MythicalAnimalNames.Durathor:
            //     return {
            //         background: `${distinctionsPath} no-repeat -32px -0px / 96px 150px`,
            //     };
            // case MythicalAnimalNames.Garm:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case MythicalAnimalNames.Hraesvelg:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case MythicalAnimalNames.Nidhogg:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case MythicalAnimalNames.Ratatosk:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case ValkyryNames.Brynhildr:
            //     return {
            //         background: `${distinctionsPath} no-repeat -32px -0px / 96px 150px`,
            //     };
            // case ValkyryNames.Hildr:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case ValkyryNames.Olrun:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case ValkyryNames.Sigrdrifa:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // case ValkyryNames.Svafa:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            // TODO Add Gullinbursti or to Card. ?
            // case MultiCardNames.Gullinbursti:
            //     return {
            //         background: `${heroesThingvellirPath}heroes.png) no-repeat -32px -50px / 128px 100px`,
            //     };
            default:
                throw new Error(`Нет такой карты '${name}' среди карт мифических существ.`);
        }
    },
    Priorities: (priority: number): IBackground => ({
        background: `url(/img/priorities/Priority${priority}.png) no-repeat 0px 0px / 28px 38px`,
    }),
    Priority: (): IBackground => ({
        background: `url(/img/priorities/Priority.png) no-repeat -34px -7px / 66px 36px`,
    }),
    RoyalOffering: (name: RoyalOfferingNames): IBackground => {
        let _exhaustiveCheck: never;
        switch (name) {
            case RoyalOfferingNames.PlusThree:
                return {
                    background: `${basicCardsPath}0.png) no-repeat -128px -240px / 288px 288px`,
                };
            case RoyalOfferingNames.PlusFive:
                return {
                    background: `${basicCardsPath}1.png) no-repeat -128px -240px / 288px 288px`,
                };
            default:
                _exhaustiveCheck = name;
                throw new Error(`Нет такой карты '${name}' улучшения монеты.`);
                return _exhaustiveCheck;
        }
    },
    Suit: (suit: SuitNamesKeyofTypeofType): IBackground => ({
        background: `url(/img/suits/${suit}.png) no-repeat 0px 0px / 24px 24px`,
    }),
    Tavern: (tavernId: number): IBackground => {
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
                throw new Error(`Нет такой таверны '${tavernId}'.`);
        }
    },
};
