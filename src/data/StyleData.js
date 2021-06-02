export const Styles = {
    Suits: (suitName) => ({
        background: `url(/img/suits/${suitName}.png) no-repeat 0px 0px / 24px 24px`
    }),
    Heroes: (game, heroName) => {
        if (game === "base") {
            switch (heroName) {
                case "Bonfur":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -96px -48px / 288px 144px",
                    };
                case "Aegur":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -128px -96px / 288px 144px",
                    };
                case "Dagda":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -128px -48px / 288px 144px",
                    };
                case "Aral":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -160px -96px / 288px 144px",
                    };
                case "Lokdur":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -224px 0px / 288px 144px",
                    };
                case "Zoral":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -32px -48px / 288px 144px",
                    };
                case "Tarah":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -160px 0px / 288px 144px",
                    };
                case "Kraal":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -192px 0px / 288px 144px",
                    };
                case "Idunn":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -128px 0px / 288px 144px",
                    };
                case "Hourya":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -96px -96px / 288px 144px",
                    };
                case "Dwerg Bergelmir":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat 0px 0px / 288px 144px",
                    };
                case "Dwerg Jungir":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -64px 0px / 288px 144px",
                    };
                case "Dwerg Aesir":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -64px -48px / 288px 144px",
                    };
                case "Dwerg Ymir":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -32px -96px / 288px 144px",
                    };
                case "Dwerg Sigmir":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -64px -96px / 288px 144px",
                    };
                case "Ylud":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -32px 0px / 288px 144px",
                    };
                case "Uline":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -96px 0px / 288px 144px",
                    };
                case "Grid":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -256px 0px / 288px 144px",
                    };
                case "Thrud":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat 0px -48px / 288px 144px",
                    };
                case "Skaa":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -160px -48px / 288px 144px",
                    };
                case "Jarika":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat -192px -48px / 288px 144px",
                    };
                case "Astrid":
                    return {
                        background: "url(/img/cards/heroes/basic/heroes.png) no-repeat 0px -96px / 288px 144px",
                    };
                default:
                    return {
                        background: "",
                    };
            }
        } else if (game === "thingvellir") {
            switch (heroName) {
                case "Andumia":
                    return {
                        background: "url(/img/cards/heroes/thingvellir/heroes.png) no-repeat 0px 0px / 128px 100px",
                    };
                case "Holda":
                    return {
                        background: "url(/img/cards/heroes/thingvellir/heroes.png) no-repeat -32px -0px / 128px 100px",
                    };
                case "Khrad":
                    return {
                        background: "url(/img/cards/heroes/thingvellir/heroes.png) no-repeat -64px 0px / 128px 100px",
                    };
                case "Olwin":
                    return {
                        background: "url(/img/cards/heroes/thingvellir/heroes.png) no-repeat 0px -50px / 128px 100px",
                    };
                case "Zolkur":
                    return {
                        background: "url(/img/cards/heroes/thingvellir/heroes.png) no-repeat -96px -50px / 128px 100px",
                    };
                default:
                    return {
                        background: "",
                    };
            }
        }
    },
    Distinctions: (distinction) => {
        switch (distinction) {
            case "blacksmith":
                return {
                    background: "url(/img/distinctions/Distinctions.png) no-repeat 0px -100px / 96px 150px",
                };
            case "hunter":
                return {
                    background: "url(/img/distinctions/Distinctions.png) no-repeat -64px 0px / 96px 150px",
                };
            case "miner":
                return {
                    background: "url(/img/distinctions/Distinctions.png) no-repeat 0px -50px / 96px 150px",
                };
            case "warrior":
                return {
                    background: "url(/img/distinctions/Distinctions.png) no-repeat -32px -50px / 96px 150px",
                };
            case "explorer":
                return {
                    background: "url(/img/distinctions/Distinctions.png) no-repeat 0px 0px / 96px 150px",
                };
            default:
                return {
                    background: "",
                };
        }
    },
    DistinctionsBack: () => ({
        background: "url(/img/distinctions/DistinctionsBack.png) no-repeat 0px 0px / 12px 18px",
    }),
    HeroBack: () => ({
        background: "url(/img/cards/heroes/HeroBack.png) no-repeat 6px 3px / 12px 18px",
    }),
    Camp: () => ({
        background: "url(/img/cards/camp/Camp.png) no-repeat 0px 3px / 24px 18px",
    }),
    CampCards: (tier, cardName) => {
        switch (cardName) {
            case 0:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat 0px 0px / 128px 144px`,
                };
            case 1:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -32px 0px  / 128px 144px`,
                };
            case 2:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -64px 0px / 128px 144px`,
                };
            case 3:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -96px 0px / 128px 144px`,
                };
            case 4:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat 0px -48px / 128px 144px`,
                };
            case 5:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -32px -48px / 128px 144px`,
                };
            case 6:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -64px -48px / 128px 144px`,
                };
            case 7:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -96px -48px / 128px 144px`,
                };
            case 8:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat 0px -96px / 128px 144px`,
                };
            case 9:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -32px -96px / 128px 144px`,
                };
            case 10:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -64px -96px / 128px 144px`,
                };
            case 11:
                return {
                    background: `url(/img/cards/camp/Camp${tier}.png) no-repeat -96px -96px / 128px 144px`,
                };
            default:
                return {
                    background: "",
                };
        }
    },
    Coin: (value, initial) => ({
        background: `url(/img/coins/Coin${value}${initial ? "Initial" : ""}.jpg) no-repeat 0px 0px / 40px 40px`,
    }),
    CoinBack: () => ({
        background: "url(/img/coins/CoinBack.png) no-repeat center center / 40px 40px",
    }),
    Priority: () => ({
        background: "url(/img/priorities/Priority.png) no-repeat -34px -7px / 66px 36px",
    }),
    Priorities: (priority) => ({
        background: `url(/img/priorities/Priority${priority}.png) no-repeat 0px 0px / 28px 38px`,
    }),
    Exchange: () => ({
        background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px",
    }),
    Taverns: (tavernID) => {
        switch (tavernID) {
            case 0:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -2px -6px / 75px 42px",
                };
            case 1:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -25px -18px / 75px 42px",
                };
            case 2:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -50px -9px / 75px 42px",
                };
            default:
                return {
                    background: "",
                };
        }
    },
};