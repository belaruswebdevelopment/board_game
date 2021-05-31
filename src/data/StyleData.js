export const Styles = {
    Suits: (suitName) => ({
        background: `url(/img/suits/${suitName}.png) no-repeat 0px 0px / 24px 24px`
    }),
    Distinctions: (distinction) => {
        // todo Fix sizes
        switch (distinction) {
        case "blacksmith":
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat 0px -100px / 94px 150px",
            };
        case "hunter":
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat -64px 0px / 94px 150px",
            };
        case "miner":
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat 0px -50px / 94px 150px",
            };
            case "warrior":
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat -32px -50px / 94px 150px",
            };
            case "explorer":
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat 0px 0px / 94px 150px",
            };
        default:
            return "";
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
    Exchange : () => ({
        background: "url(/img/taverns/Exchange.jpg) no-repeat -27px -63px / 87px 87px",
    }),
    Taverns: (tavernID) => {
        switch (tavernID) {
            case 0:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -3px -6px / 75px 42px",
                };
            case 1:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -25px -18px / 75px 42px",
                };
            case 2:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -49px -9px / 75px 42px",
                };
            default:
                return "";
        }
    },
};
