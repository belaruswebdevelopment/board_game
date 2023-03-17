import type { Game, LobbyAPI } from 'boardgame.io';
import { Lobby } from 'boardgame.io/react';
import React, { useState } from "react";
import { BoardGame } from "./Game";
import { GameBoard } from "./GameBoard";
import { LobbyPhases } from './typescript/enums';
import { LobbyRendererProps, NumPlayersType } from './typescript/interfaces';

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
const LobbyClient: React.FC<object> = (): JSX.Element => (
    <Lobby
        debug={true}
        gameServer={`http://${window.location.hostname}:8000`}
        lobbyServer={`http://${window.location.hostname}:8000`}
        gameComponents={
            [{
                game: BoardGame as Game,
                board: GameBoard,
            }]
        }
        renderer={(LobbyProps: LobbyRendererProps) => {
            return (
                <div className="absolute w-full h-full bg-green-900">
                    {LobbyProps.phase === LobbyPhases.ENTER && <EnterLobbyView LobbyProps={LobbyProps} />}
                    {LobbyProps.phase === LobbyPhases.LIST && <ListGamesView LobbyProps={LobbyProps} />}
                    {LobbyProps.phase === LobbyPhases.PLAY && <RunningMatchView LobbyProps={LobbyProps} />}
                </div>
            );
        }}
    />
);

const EnterLobbyView: React.FC<{ LobbyProps: LobbyRendererProps; }> = ({ LobbyProps }) => {
    const [playerName, setPlayerName]: [string, React.Dispatch<React.SetStateAction<string>>] =
        useState(LobbyProps.playerName);
    return (
        <div className="w-full h-full flex flex-col justify-center items-center">
            <h1 className="text-2xl font-serif">Nidavellir</h1>
            <div>Choose a name:</div>
            <div>
                <input
                    className="border-2 border-blue-300 rounded-md p-1"
                    type="text"
                    placeholder="Visitor"
                    value={playerName}
                    onFocus={() => {
                        setPlayerName("");
                    }}
                    onChange={(e) => {
                        setPlayerName(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && playerName !== "") {
                            LobbyProps.handleEnterLobby(playerName);
                        }
                    }}
                />
                <button
                    onClick={() => {
                        if (playerName !== "") {
                            LobbyProps.handleEnterLobby(playerName);
                        }
                    }}
                >
                    Enter
                </button>
            </div>
        </div>
    );
};

const ListGamesView: React.FC<{ LobbyProps: LobbyRendererProps; }> = ({ LobbyProps }) => {
    const [numPlayers, setNumPlayers]: [NumPlayersType, React.Dispatch<React.SetStateAction<NumPlayersType>>] =
        useState<NumPlayersType>(2),
        matches: LobbyAPI.Match[] = [],
        seen: Set<string> = new Set<string>();
    for (const match of LobbyProps.matches) {
        if (!seen.has(match.matchID)) {
            matches.push(match);
            seen.add(match.matchID);
        }
    }
    return (
        <div className="p-2">
            <button
                onClick={() => {
                    LobbyProps.handleExitLobby();
                }}
            >
                Leave Lobby
            </button>
            <div className="w-full flex justify-center">
                <div className="flex-grow max-w-lg">
                    <div className="text-center">Hi {LobbyProps.playerName}!</div>
                    <div className="flex justify-evenly gap-1 items-center">
                        <label htmlFor="playerCount">Players:</label>
                        <select
                            className="flex-grow"
                            name="playerCount"
                            id="playerCountSelect"
                            defaultValue={"2"}
                            onChange={({ target: { value } }) => {
                                {/* TODO NumPlayersType */ }
                                setNumPlayers(parseInt(value) as NumPlayersType);
                            }}
                        >
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                        <button
                            onClick={() => {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                LobbyProps.handleCreateMatch(LobbyProps.gameComponents[0]!.game.name!,
                                    numPlayers);
                            }}
                        >
                            Create Match
                        </button>
                    </div>
                    <div className="text-lg">Join a Match</div>
                    {matches.map((match) => (
                        <div
                            className="flex gap-3 justify-between items-center border-b-2 border-black"
                            key={match.matchID}
                        >
                            <div>{match.gameName}</div>
                            <div>{match.players.map((player) => player.name ?? "[free]").join(", ")}</div>
                            {createMatchButtons(LobbyProps, match, numPlayers)}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const RunningMatchView: React.FC<{ LobbyProps: LobbyRendererProps; }> = ({ LobbyProps }) => {
    return (
        <div>
            {LobbyProps.runningMatch && (
                <LobbyProps.runningMatch.app
                    matchID={LobbyProps.runningMatch.matchID}
                    playerID={LobbyProps.runningMatch.playerID}
                    credentials={LobbyProps.runningMatch.credentials}
                />
            )}
            <div className="absolute">
                <button
                    onClick={() => {
                        LobbyProps.handleExitMatch();
                    }}
                >
                    Exit
                </button>
            </div>
        </div>
    );
};

function createMatchButtons(
    LobbyProps: LobbyRendererProps,
    Match: LobbyAPI.Match,
    numPlayers: number
): JSX.Element {
    // TODO Add types here!?
    const playerSeat = Match.players.find((player) => player.name === LobbyProps.playerName),
        freeSeat = Match.players.find((player) => !player.name);
    if (playerSeat && freeSeat) {
        // already seated: waiting for match to start
        return (
            <button
                onClick={() => {
                    LobbyProps.handleLeaveMatch(Match.gameName, Match.matchID);
                }}
            >
                Leave
            </button>
        );
    }
    if (freeSeat) {
        // at least 1 seat is available
        return (
            <button
                onClick={() => {
                    LobbyProps.handleJoinMatch(Match.gameName, Match.matchID, "" + freeSeat.id);
                }}
            >
                Join
            </button>
        );
    }
    // match is full
    if (playerSeat) {
        return (
            <div>
                <button
                    onClick={() => {
                        LobbyProps.handleStartMatch(Match.gameName, {
                            numPlayers,
                            playerID: "" + playerSeat.id,
                            matchID: Match.matchID,
                        });
                    }}
                >
                    Play
                </button>
                <button
                    onClick={() => {
                        LobbyProps.handleLeaveMatch(Match.gameName, Match.matchID);
                    }}
                >
                    Leave
                </button>
            </div>
        );
    }
    return <div>Match In Progress...</div>;
}

export default LobbyClient;
