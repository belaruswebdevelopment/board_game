import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Lobby } from 'boardgame.io/react';
import { useState } from "react";
import { BoardGame } from "./Game";
import { GameBoard } from "./GameBoard";
import { LobbyPhases } from './typescript/enums';
// TODO Add types!
/**
 * <h3>Лобби игры.</h3>
 * <p>Применения:</p>
 * <ol>
 * <li>При использовании лобби в игре.</li>
 * </ol>
 *
 * @returns Клиент лобби.
 */
const LobbyClient = () => (_jsx(Lobby, { debug: true, gameServer: `http://${window.location.hostname}:8000`, lobbyServer: `http://${window.location.hostname}:8000`, gameComponents: [{
            game: BoardGame,
            board: GameBoard,
        }], renderer: (LobbyProps) => {
        return (_jsxs("div", { className: "absolute w-full h-full bg-green-900", children: [LobbyProps.phase === LobbyPhases.ENTER && _jsx(EnterLobbyView, { LobbyProps: LobbyProps }), LobbyProps.phase === LobbyPhases.LIST && _jsx(ListGamesView, { LobbyProps: LobbyProps }), LobbyProps.phase === LobbyPhases.PLAY && _jsx(RunningMatchView, { LobbyProps: LobbyProps })] }));
    } }));
const EnterLobbyView = ({ LobbyProps }) => {
    const [playerName, setPlayerName] = useState(LobbyProps.playerName);
    return (_jsxs("div", { className: "w-full h-full flex flex-col justify-center items-center", children: [_jsx("h1", { className: "text-2xl font-serif", children: "Nidavellir" }), _jsx("div", { children: "Choose a name:" }), _jsxs("div", { children: [_jsx("input", { className: "border-2 border-blue-300 rounded-md p-1", type: "text", placeholder: "Visitor", value: playerName, onFocus: () => {
                            setPlayerName("");
                        }, onChange: (e) => {
                            setPlayerName(e.target.value);
                        }, onKeyDown: (e) => {
                            if (e.key === "Enter" && playerName !== "") {
                                LobbyProps.handleEnterLobby(playerName);
                            }
                        } }), _jsx("button", { onClick: () => {
                            if (playerName !== "") {
                                LobbyProps.handleEnterLobby(playerName);
                            }
                        }, children: "Enter" })] })] }));
};
const ListGamesView = ({ LobbyProps }) => {
    const [numPlayers, setNumPlayers] = useState(2), matches = [], seen = new Set();
    for (const match of LobbyProps.matches) {
        if (!seen.has(match.matchID)) {
            matches.push(match);
            seen.add(match.matchID);
        }
    }
    return (_jsxs("div", { className: "p-2", children: [_jsx("button", { onClick: () => {
                    LobbyProps.handleExitLobby();
                }, children: "Leave Lobby" }), _jsx("div", { className: "w-full flex justify-center", children: _jsxs("div", { className: "flex-grow max-w-lg", children: [_jsxs("div", { className: "text-center", children: ["Hi ", LobbyProps.playerName, "!"] }), _jsxs("div", { className: "flex justify-evenly gap-1 items-center", children: [_jsx("label", { htmlFor: "playerCount", children: "Players:" }), _jsxs("select", { className: "flex-grow", name: "playerCount", id: "playerCountSelect", defaultValue: "2", onChange: ({ target: { value } }) => {
                                        { /* TODO NumPlayersType */ }
                                        setNumPlayers(parseInt(value));
                                    }, children: [_jsx("option", { value: "2", children: "2" }), _jsx("option", { value: "3", children: "3" }), _jsx("option", { value: "4", children: "4" }), _jsx("option", { value: "5", children: "5" })] }), _jsx("button", { onClick: () => {
                                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                        LobbyProps.handleCreateMatch(LobbyProps.gameComponents[0].game.name, numPlayers);
                                    }, children: "Create Match" })] }), _jsx("div", { className: "text-lg", children: "Join a Match" }), matches.map((match) => (_jsxs("div", { className: "flex gap-3 justify-between items-center border-b-2 border-black", children: [_jsx("div", { children: match.gameName }), _jsx("div", { children: match.players.map((player) => { var _a; return (_a = player.name) !== null && _a !== void 0 ? _a : "[free]"; }).join(", ") }), createMatchButtons(LobbyProps, match, numPlayers)] }, match.matchID)))] }) })] }));
};
const RunningMatchView = ({ LobbyProps }) => {
    return (_jsxs("div", { children: [LobbyProps.runningMatch && (_jsx(LobbyProps.runningMatch.app, { matchID: LobbyProps.runningMatch.matchID, playerID: LobbyProps.runningMatch.playerID, credentials: LobbyProps.runningMatch.credentials })), _jsx("div", { className: "absolute", children: _jsx("button", { onClick: () => {
                        LobbyProps.handleExitMatch();
                    }, children: "Exit" }) })] }));
};
function createMatchButtons(LobbyProps, Match, numPlayers) {
    // TODO Add types here!?
    const playerSeat = Match.players.find((player) => player.name === LobbyProps.playerName), freeSeat = Match.players.find((player) => !player.name);
    if (playerSeat && freeSeat) {
        // already seated: waiting for match to start
        return (_jsx("button", { onClick: () => {
                LobbyProps.handleLeaveMatch(Match.gameName, Match.matchID);
            }, children: "Leave" }));
    }
    if (freeSeat) {
        // at least 1 seat is available
        return (_jsx("button", { onClick: () => {
                LobbyProps.handleJoinMatch(Match.gameName, Match.matchID, "" + freeSeat.id);
            }, children: "Join" }));
    }
    // match is full
    if (playerSeat) {
        return (_jsxs("div", { children: [_jsx("button", { onClick: () => {
                        LobbyProps.handleStartMatch(Match.gameName, {
                            numPlayers,
                            playerID: "" + playerSeat.id,
                            matchID: Match.matchID,
                        });
                    }, children: "Play" }), _jsx("button", { onClick: () => {
                        LobbyProps.handleLeaveMatch(Match.gameName, Match.matchID);
                    }, children: "Leave" })] }));
    }
    // TODO add spectate button
    return _jsx("div", { children: "Match In Progress..." });
}
export default LobbyClient;
//# sourceMappingURL=LobbyClient.js.map