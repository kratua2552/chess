import { ChessBoard } from "./board";
import { clientData } from "./data";
import { Engine } from "./move";

interface Rules { 
    undo: boolean; type: string
}

interface TimeControl {
    timeControl: string; timeLimit?: number; increment?: number
}

/////////////////////////////////////////////////////

class Interface {
    engine: Engine;
    board: ChessBoard;

    constructor(start: number, rules?: Rules, time?: TimeControl) {
        this.engine = new Engine();
        this.board = new ChessBoard();

        const state = this.config(start, rules, time);
        if (state) {
            this.board.dirInit();
            this.board.init(clientData.gameConfig.boardType);
            if (clientData.gameConfig.isUndoAllowed) this.engine.undo = true;

        }

    }

    config (start: number, rules?: Rules, time?: TimeControl): number {
        
        if (clientData.gameStatus.isGameStarted && start === -1) {
            clientData.gameStatus.isGameStarted = false;
            
            delete clientData.gameStatus.currentTurn;
            delete clientData.gameConfig.boardType;
            delete clientData.gameConfig.isUndoAllowed;
            delete clientData.gameConfig.timeControl;
            delete clientData.profiles
            delete clientData.gameConfig.timeLimitPerGame;
            delete clientData.gameConfig.timeLimitPerMove;

            return 0;
        }

        if (!clientData.gameStatus.isGameStarted && start === 1) {

            clientData.gameConfig = {
                boardType: rules.type,
                isUndoAllowed: rules.undo
            }

            clientData.gameStatus = {
                isGameStarted: true,
                currentTurn: 8
            }

            clientData.profiles = {

                white: {
                    score: 0,
                    move: 0,
                    totalTime: 0,
                },
    
                black: {
                    score: 0,
                    move: 0,
                    totalTime: 0,
                }
            }

            if (time) {
                clientData.gameConfig.timeControl = time.timeControl;

                if (time.timeControl === 'game') {
                    clientData.gameConfig.timeLimitPerGame = { timeLimit: time.timeLimit };
                    clientData.profiles = {
                        white: {
                            ...clientData.profiles.white,
                            timeRemaining: time.timeLimit
                        },

                        black: {
                            ...clientData.profiles.black,
                            timeRemaining: time.timeLimit
                        }
                    }
                }

                if (time.timeControl === 'move') {
                    clientData.gameConfig.timeLimitPerMove = { 
                        timeLimit: time.timeLimit, 
                        timeIncrement: time.increment ?? 0
                    }

                    clientData.profiles = {
                        white: {
                            ...clientData.profiles.white,
                            timeRemaining: time.timeLimit
                        },

                        black: {
                            ...clientData.profiles.black,
                            timeRemaining: time.timeLimit
                        }
                    }
                }
                
            }
        }

        return 1;
    }
}

const rules: Rules = {
    undo: true, type: 'default'
}

const time: TimeControl = {
    timeControl: 'move', timeLimit: 30
}

const game = new Interface(1, rules, time);
console.log(clientData);
















/*
configuration to be implemented:
    type?: starting position is randomized (Chess960)

    TimeLimit
        PerMove?: time limit between move
            Increment?: time increment per move, after ... move
            Decay?: time limt decrease, after ... move

        PerGame?: time limit per game
            Increment?: time increment per move, after ... move

    casual: no time limit, undo is allowed

    rapid: 10 minute per match
    rapidPlus: 10 minute per match + 10 second increment per move

    blitz: 3 minute per match
    blitzPlus: 3 minute per match + 3 second increment per move

    bullet: 1 minute per match
    bulletPlus: 1 minute per match + 1 second increment per move


*/