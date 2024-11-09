import React from "react";
import clsx from "clsx";
import { Chess } from "chess.js";
import { Icon } from "@iconify/react";
import { getChessPiece, whiteOrBlack } from "./functions";
import "./App.css";
import { COLORS } from "./colors";

const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
const ranks = ["8", "7", "6", "5", "4", "3", "2", "1"];

interface CellData {
  type: string;
  color: string;
  square: string;
}

const ChessPiece = ({
  pieceType,
  player,
  coordinates,
  selected,
}:
{
  pieceType: string;
  player: string;
  coordinates: string;
  selected: boolean;
}) => {
  const playerClass = player === "w" ? "white-player" : "black-player";

  return (
    <Icon
      id={`${coordinates}-piece`}
      color={player === "w" ? COLORS.PLAYER.WHITE : COLORS.PLAYER.BLACK}
      icon={getChessPiece(pieceType)}
      className={clsx("text-[50px]", whiteOrBlack(player), selected && "selected-piece", playerClass, 'drop-shadow-lg')}
      mode="svg"
      data-player={player}
    />
  );
};

function App() {
  const [position, setPosition] = React.useState<any[] | null>(null);
  const [game, setGame] = React.useState<Chess | null>(null);
  const [selectedTile, setSelectedTile] = React.useState<string | null>(null);
  const [message, setMessage] = React.useState<string>("");
  const [whoIsTurnNext, setWhoIsTurnNext] = React.useState<string>("w");
  const [comment, setComment] = React.useState<string>("");

  const handleSquareClick = (id: string, occupied: boolean) => {
    setMessage("");
    const selectedColor = document
      .getElementById(id)
      ?.getAttribute("data-player");
      if (selectedTile && occupied && selectedColor === whoIsTurnNext) {
      setSelectedTile(id);
      return;
      }
    if (selectedColor !== whoIsTurnNext && !selectedTile) {
      setMessage("not your turn");
      return;
    }
    if (selectedTile && game) {
      try {
        const move = game.move({
          from: selectedTile,
          to: id,
        });
        if (move) {
          setPosition(game.board());
          setSelectedTile(null);
          setWhoIsTurnNext(game.turn() === "w" ? "w" : "b");
        }
      } catch (error: unknown | any) {
        console.error(error);
        setSelectedTile(null);
        setMessage("invalid move");
      }
    } else {
      setSelectedTile(id);
    }
  };

  React.useEffect(() => {
    const gameComment = game?.getComment()
    setWhoIsTurnNext(game?.turn() === "w" ? "w" : "b");
    if (game === null) {
      setGame(new Chess());
    }
    if (position === null && game !== null) {
      setPosition(game.board());
    }
    if (selectedTile !== null) {
      console.log(selectedTile);
    }
    if (gameComment) {
      setComment(gameComment);
    }
  }, [position, game, selectedTile, whoIsTurnNext, comment]);

  return (
    <div className="flex flex-col justify-center items-center bg-indigo-800 w-[100vw] h-[100vh] text-gray-50 App">
      <h2 id="GameMsg">{message}</h2>
      <h3>{comment}</h3>
      <div className={`flex justify-center items-center flex-col h-[100vh]`}>
        <section id="info">
          {/* <h1 className="text-3xl">Chess</h1>
          <p className="text-xl">Next Turn:</p> */}
          <p
            className={clsx(
              whoIsTurnNext === "w"
                ? "bg-white text-black"
                : "bg-black text-white",
              "transition-colors p-2 rounded", 'mb-4'
            )}
          >
            {whoIsTurnNext === "w" ? "White " : "Black "} to move
          </p>
        </section>
        <div
          id="chessBoard"
          className={clsx(
            "grid grid-cols-8 grid-rows-8",
            "border-8 border-black"
          )}
        >
          {position &&
            position.map((row: any, rowIndex: number) => {
              const color =
                rowIndex % 2 === 0
                  ? { a: COLORS.TILE.LITE, b: COLORS.TILE.DARK }
                  : { a: COLORS.TILE.DARK, b: COLORS.TILE.LITE };
              return row.map((cell: CellData | null, cellIndex: number) => {
                const coordinates = `${files[cellIndex]}${ranks[rowIndex]}`;
                const tileColor = cellIndex % 2 === 0 ? color.a : color.b;
                const isOccupied = cell ? true : false;
                return (
                  <div
                    key={coordinates}
                    id={`${coordinates}`}
                    onClick={() => handleSquareClick(coordinates, isOccupied)}
                    className={clsx(
                      "w-20 h-20",
                      tileColor,
                      "flex justify-center items-center relative",
                      "cursor-pointer",
                      "square",
                      "transition-all",
                      "hover:border-4 border-yellow-300",
                      selectedTile === coordinates ? "bg-yellow-300" : ""
                    )}
                    data-player={cell ? cell.color : "open"}
                  >
                    {cell && (
                      <ChessPiece
                        selected={selectedTile === coordinates}
                        coordinates={coordinates}
                        pieceType={cell.type}
                        player={cell.color}
                      />
                    )}
                    <span className="right-0 bottom-0 absolute text-black text-xs">
                      {coordinates}
                    </span>
                  </div>
                );
              });
            })}
        </div>
      </div>
    </div>
  );
}

export default App;
