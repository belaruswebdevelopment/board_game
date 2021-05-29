export const Styles = {
    Suits: (suitName) => ({
        background: `url(/img/suits/${suitName}.png) no-repeat 0px 0px / 16px 16px`
    }),
    Distinctions: (distinction) => {
        // todo Fix sizes
        switch (distinction) {
        case 0:
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat 0px -100px / 94px 150px",
            };
        case 1:
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat -64px 0px / 94px 150px",
            };
        case 2:
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat 0px -50px / 94px 150px",
            };
            case 3:
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat -32px -50px / 94px 150px",
            };
            case 4:
            return {
                background: "url(/img/distinctions/Distinctions.png) no-repeat 0px 0px / 94px 150px",
            };
        default:
            return "";
        }
    },
    DistinctionsBack: () => ({
        background: "url(/img/distinctions/DistinctionsBack.png) no-repeat 0px 0px / 11px 16px",
    }),
    HeroBack: () => ({
        background: "url(/img/cards/heroes/HeroBack.png) no-repeat 7px 4px / 10px 16px",
    }),
    Camp: () => ({
        background: "url(/img/cards/camp/Camp.png) no-repeat 0px 2px / 16px 12px",
    }),
    Coin: (value, initial) => ({
        background: `url(/img/coins/Coin${value}${initial ? "Initial" : ""}.jpg) no-repeat 0px 0px / 32px 32px`,
    }),
    CoinBack: () => ({
        background: "url(/img/coins/CoinBack.png) no-repeat center center / 32px 32px",
    }),
    Priority: () => ({
        background: "url(/img/priorities/Priority.png) no-repeat -23px -3px / 43px 24px",
    }),
    Priorities: (priority) => ({
        background: `url(/img/priorities/Priority${priority}.png) no-repeat 0px 0px / 24px 32px`,
    }),
    Exchange : () => ({
        background: "url(/img/taverns/Exchange.jpg) no-repeat -18px -42px / 58px 58px",
    }),
    Taverns: (tavernID) => {
        switch (tavernID) {
            case 0:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -2px -4px / 50px 28px",
                };
            case 1:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -17px -12px / 50px 28px",
                };
            case 2:
                return {
                    background: "url(/img/taverns/Taverns.png) no-repeat -33px -6px / 50px 28px",
                };
            default:
                return "";
        }
    },
};
