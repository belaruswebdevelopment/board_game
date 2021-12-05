var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import { jsx as _jsx } from "react/jsx-runtime";
import { Client } from "boardgame.io/react";
import { Local } from "boardgame.io/multiplayer";
import { MCTSBot } from "boardgame.io/ai";
import { BoardGame } from "./Game";
import { GameBoard } from "./GameBoard";
var CustomMCTSBot = /** @class */ (function (_super) {
    __extends(CustomMCTSBot, _super);
    function CustomMCTSBot(config) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return _super.apply(this, __spreadArray([__assign(__assign({}, config), { objectives: BoardGame.ai.objectives, iterations: BoardGame.ai.iterations, playoutDepth: BoardGame.ai.playoutDepth })], args, false)) || this;
    }
    return CustomMCTSBot;
}(MCTSBot));
var enableLocalPlayer = true, setupBot = {
    bots: {
    // "0": RandomBot,
    // "1": RandomBot,
    // "2": RandomBot,
    // "3": RandomBot,
    // "4": RandomBot,
    },
}, BoardGameClient = Client({
    debug: true,
    game: BoardGame,
    board: GameBoard,
    numPlayers: 3,
    multiplayer: enableLocalPlayer ? Local(setupBot) : undefined,
}), App = function () { return (_jsx("div", { children: _jsx(BoardGameClient, { playerID: "0" }, void 0) }, void 0)); };
export default App;
