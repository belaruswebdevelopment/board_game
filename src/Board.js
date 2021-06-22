import React from "react";
import {
    DrawTierCards,
    DrawCurrentPlayerTurn,
    DrawWinner,
    DrawMarketCoins,
    DrawCamp,
    DrawTaverns,
    DrawHeroes,
    DrawDistinctions,
    DrawProfit,
} from "./ui/GameBoardUI";
import {
    DrawPlayersBoardsCoins,
    DrawPlayersBoards,
    DrawPlayersHandsCoins,
} from "./ui/PlayerUI";
import {DrawDebugData} from "./ui/DebugUI";
import {DrawLogData} from "./ui/LogUI";

/**
 * Отрисовка игрового стола.
 */
export class GameBoard extends React.Component {
    OnClickHeroCard = (heroId) => {
        this.props.moves.ClickHeroCard(heroId);
    };
    OnClickCampCard = (cardId) => {
        this.props.moves.ClickCampCard(cardId);
    };
    OnClickDistinctionCard = (cardId) => {
        this.props.moves.ClickDistinctionCard(cardId);
    };
    OnClickCard = (cardId) => {
        this.props.moves.ClickCard(cardId);
    };
    OnClickBoardCoin = (coinId) => {
        this.props.moves.ClickBoardCoin(coinId);
    };
    OnClickHandCoin = (coinId) => {
        this.props.moves.ClickHandCoin(coinId);
    };
    OnClickCardToPickDistinction = (cardId) => {
        this.props.moves.ClickCardToPickDistinction(cardId);
    };
    OnClickCoinToUpgrade = (coinId, type, isInitial) => {
        this.props.moves.ClickCoinToUpgrade(coinId, type, isInitial);
    };
    OnClickCardToDiscard = (suitId, cardId) => {
        this.props.moves.DiscardCard(suitId, cardId);
    };
    OnClickSuitToPlaceCard = (suitId) => {
        this.props.moves.PlaceCard(suitId);
    };
    OnClickCardFromDiscard = (cardId) => {
        this.props.moves.PickDiscardCard(cardId);
    };
    OnClickCardToDiscard2Players = (cardId) => {
        this.props.moves.DiscardCard2Players(cardId);
    };
    OnClickDiscardCardFromPlayerBoard = (suitId, cardId) => {
        this.props.moves.DiscardCardFromPlayerBoard(suitId, cardId);
    };
    OnClickDiscardSuitCardFromPlayerBoard = (suitId, cardId) => {
        this.props.moves.DiscardSuitCardFromPlayerBoard(suitId, cardId);
    };
    OnClickCampCardHolda = (cardId) => {
        this.props.moves.ClickCampCardHolda(cardId);
    };
    OnClickCoinToAddToPouch = (suitId, cardId) => {
        this.props.moves.AddCoinToPouch(suitId, cardId);
    };
    OnClickCoinToUpgradeVidofnirVedrfolnir = (coinId, type, isInitial) => {
        this.props.moves.UpgradeCoinVidofnirVedrfolnir(coinId, type, isInitial);
    };
    render() {
        const gridClass = "col-span-4",
            classes = "col-span-4 text-center underline border",
            tierCardsUI = DrawTierCards(this),
            currentPlayerTurnUI = DrawCurrentPlayerTurn(this),
            winnerUI = DrawWinner(this),
            marketCoinsUI = DrawMarketCoins(this),
            drawHeroesUI = DrawHeroes(this),
            drawCampUI = DrawCamp(this),
            drawDistinctionsUI = DrawDistinctions(this),
            drawDistinctionProfitUI = this.props.G.drawProfit ? DrawProfit(this, this.props.G.drawProfit)
                : this.props.G.drawProfit,
            tavernsUI = DrawTaverns(this, gridClass),
            playersBoardsCoinsUI = DrawPlayersBoardsCoins(this),
            playersHandsCoinsUI = DrawPlayersHandsCoins(this),
            playersBoardsUI = DrawPlayersBoards(this),
            logUI = DrawLogData(this),
            debugUI = DrawDebugData(this);
        return (
            <div className="flex">
                <div className="grid auto-cols-min grid-cols-1 md:grid-cols-12 gap-1">
                    <div className={classes}>
                        {tierCardsUI}
                    </div>
                    <div className={classes}>
                        {currentPlayerTurnUI}
                    </div>
                    <div className={classes}>
                        {winnerUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {marketCoinsUI}
                    </div>
                    <div className={`${gridClass} justify-self-center`}>
                        {drawHeroesUI}
                    </div>
                    <div className={`${gridClass} justify-self-center h-full flex flex-col justify-evenly`}>
                        {drawDistinctionsUI}
                        {drawDistinctionProfitUI}
                        {drawCampUI}
                    </div>
                    {tavernsUI}
                    <div className="col-span-full flex flex-col gap-1">
                        <div className="flex flex-col lg:flex-row gap-1">{playersBoardsCoinsUI}</div>
                        <div className="flex flex-col lg:flex-row gap-1">{playersHandsCoinsUI}</div>
                        <div className="flex items-start flex-col lg:flex-row gap-1">{playersBoardsUI}</div>
                    </div>
                </div>
                {logUI}
                {debugUI}
            </div>
        );
    }
}
