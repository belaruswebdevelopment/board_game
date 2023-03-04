import { BuildPlayer, BuildPublicPlayer, CreatePrivatePlayer, CreatePublicPlayer } from "../Player";
import { expectedAllBuildInitialCoins } from "./Coin.test";
const testPlayerCards = {
    blacksmith: [],
    explorer: [],
    hunter: [],
    miner: [],
    warrior: [],
};
const testGiantTokenSuits = {
    blacksmith: null,
    explorer: null,
    hunter: null,
    miner: null,
    warrior: null,
};
const testCreatePrivatePlayerData = {
    boardCoins: [null, null, null, null, null],
    handCoins: expectedAllBuildInitialCoins,
};
const expectedPrivatePlayer = {
    boardCoins: [null, null, null, null, null],
    handCoins: expectedAllBuildInitialCoins,
};
const testCreatePublicPlayerInLocalData = {
    boardCoins: [null, null, null, null, null],
    cards: testPlayerCards,
    giantTokenSuits: testGiantTokenSuits,
    handCoins: expectedAllBuildInitialCoins,
    nickname: `Dan`,
    priority: {
        isExchangeable: true,
        value: 5,
    },
};
const expectedPublicPlayerInLocal = {
    boardCoins: [null, null, null, null, null],
    buffs: [],
    campCards: [],
    cards: testPlayerCards,
    currentCoinsScore: 14,
    giantTokenSuits: testGiantTokenSuits,
    handCoins: expectedAllBuildInitialCoins,
    heroes: [],
    mythologicalCreatureCards: [],
    nickname: `Dan`,
    priority: {
        isExchangeable: true,
        value: 5,
    },
    selectedCoin: null,
    stack: [],
};
const testCreatePublicPlayerInMultiplayerData = {
    boardCoins: [null, null, null, null, null],
    cards: testPlayerCards,
    giantTokenSuits: testGiantTokenSuits,
    handCoins: [{}, {}, {}, {}, {}],
    nickname: `Dan`,
    priority: {
        isExchangeable: true,
        value: 5,
    },
};
const expectedPublicPlayerInMultiplayer = {
    boardCoins: [null, null, null, null, null],
    buffs: [],
    campCards: [],
    cards: testPlayerCards,
    currentCoinsScore: 14,
    giantTokenSuits: testGiantTokenSuits,
    handCoins: [{}, {}, {}, {}, {}],
    heroes: [],
    mythologicalCreatureCards: [],
    nickname: `Dan`,
    priority: {
        isExchangeable: true,
        value: 5,
    },
    selectedCoin: null,
    stack: [],
};
describe(`Test BuildPlayer method`, () => {
    it(`should create private player`, () => {
        expect(CreatePrivatePlayer(testCreatePrivatePlayerData)).toStrictEqual(expectedPrivatePlayer);
    });
    it(`should build private player`, () => {
        expect(BuildPlayer()).toStrictEqual(expectedPrivatePlayer);
    });
    it(`should create public player (multiplayer=false)`, () => {
        expect(CreatePublicPlayer(testCreatePublicPlayerInLocalData)).toStrictEqual(expectedPublicPlayerInLocal);
    });
    it(`should build public player (multiplayer=false)`, () => {
        expect(BuildPublicPlayer(`Dan`, { isExchangeable: true, value: 5, }, false)).toStrictEqual(expectedPublicPlayerInLocal);
    });
    it(`should create public player (multiplayer=true)`, () => {
        expect(CreatePublicPlayer(testCreatePublicPlayerInMultiplayerData)).toStrictEqual(expectedPublicPlayerInMultiplayer);
    });
    it(`should build public player (multiplayer=true)`, () => {
        expect(BuildPublicPlayer(`Dan`, { isExchangeable: true, value: 5, }, true)).toStrictEqual(expectedPublicPlayerInMultiplayer);
    });
});
//# sourceMappingURL=Player.test.js.map