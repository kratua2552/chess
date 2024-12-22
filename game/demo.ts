import readline from "readline/promises";
import { Move } from "./move";
import { ChessBoard } from "./board";
import { data } from "./data";

const board = new ChessBoard();
const play = new Move();

board.init('default');
board.dir();
console.log(data.board);

play.move('10>30');
console.log(data.board);