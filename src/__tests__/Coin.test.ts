import { BuildInitialCoins } from "../Coin";
import { CoinRusNames } from "../typescript/enums";
import { AllInitialCoins } from "../typescript/interfaces";

export const expectedAllBuildInitialCoins: AllInitialCoins = [
    {
        isOpened: false,
        type: CoinRusNames.InitialTriggerTrading,
        value: 0,
    },
    {
        isOpened: false,
        type: CoinRusNames.InitialNotTriggerTrading,
        value: 2,
    },
    {
        isOpened: false,
        type: CoinRusNames.InitialNotTriggerTrading,
        value: 3,
    },
    {
        isOpened: false,
        type: CoinRusNames.InitialNotTriggerTrading,
        value: 4,
    },
    {
        isOpened: false,
        type: CoinRusNames.InitialNotTriggerTrading,
        value: 5,
    },
];

describe(`Test BuildInitialCoins method`, (): void => {
    it(`should create 5 initial coins`, (): void => {
        expect(BuildInitialCoins()).toStrictEqual(expectedAllBuildInitialCoins);
    });
});
