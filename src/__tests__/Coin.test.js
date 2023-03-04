import { BuildInitialCoins } from "../Coin";
import { CoinRusNames } from "../typescript/enums";
export const expectedAllBuildInitialCoins = [
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
describe(`Test BuildInitialCoins method`, () => {
    it(`should create 5 initial coins`, () => {
        expect(BuildInitialCoins()).toStrictEqual(expectedAllBuildInitialCoins);
    });
});
//# sourceMappingURL=Coin.test.js.map