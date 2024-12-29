import { ChessBoard } from "./board";
import { clientData, data } from "./data";
import { Engine } from "./move";

interface Rules { 
    undo: boolean; type: string
}

interface TimeControl {
    timeControl: string; timeLimit?: number; increment?: number
}

/////////////////////////////////////////////////////

class Interface {
    private engine: Engine;
    private board: ChessBoard;
    private timer: Timer;

    constructor(start: number, rules?: Rules, time?: TimeControl) {
        this.engine = new Engine();
        this.board = new ChessBoard();
        this.timer = new Timer();

        this.config(start, rules, time);
    }

    config (start: number, rules?: Rules, time?: TimeControl): number {
        
        if (clientData.gameStatus.isGameStarted && start === -1) {
            this.board.clear();
            clientData.gameStatus.isGameStarted = false;
            delete clientData.gameStatus.currentTurn;
            delete clientData.gameStatus.gameTime;
            delete clientData.profiles
            delete clientData.gameConfig;

            return 0;
        }

        if (!clientData.gameStatus.isGameStarted && start === 1) {

            if (!rules) return 0;

            clientData.gameConfig = {
                boardType: rules.type,
                isUndoAllowed: rules.undo
            }

            clientData.gameStatus = {
                isGameStarted: true,
                currentTurn: 8,
                gameTime: 0
            }

            if (clientData.gameStatus.currentTurn) this.engine.turn = clientData.gameStatus.currentTurn;
            if (clientData.gameConfig.isUndoAllowed) this.engine.undo = rules.undo;
            this.board.init(clientData.gameConfig.boardType);
            this.board.dirInit();

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
                    clientData.gameConfig.timeLimitPerGame = { timeLimit: time.timeLimit || 0 };
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
                        timeLimit: time.timeLimit || 0, 
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

    play(curIndx: number, nxtIndx: number): number {
        if (clientData.profiles?.white.timeRemaining !== undefined && clientData.profiles.black.timeRemaining !== undefined) {
            if (clientData.gameStatus.currentTurn === 8 && clientData.profiles?.white.timeRemaining <= 0) {
                return 400;
            }
    
            if (clientData.gameStatus.currentTurn === 16 && clientData.profiles?.black.timeRemaining <= 0) {
                return 400;
            }
        }

        const status: number = this.engine.move(curIndx, nxtIndx);

        if (status === 200) {
            this.updateTime();
            return 200;
        }

        return 400;
    }

    updateTime(): void {
        clientData.gameStatus.currentTurn = (8 === clientData.gameStatus.currentTurn) ? 16 : 8;
        this.engine.turn = clientData.gameStatus.currentTurn;

        if (clientData.gameStatus.currentTurn === 16) {
            if (this.timer.timeRemaining !== undefined && clientData.profiles) {
                clientData.profiles.white.timeRemaining = Number(this.timer.minusTimeClear().toFixed(1));
                if (clientData.gameConfig?.timeLimitPerGame !== undefined) clientData.profiles.white.totalTime = clientData.gameConfig?.timeLimitPerGame?.timeLimit - clientData.profiles.white.timeRemaining;
            }

            if (clientData.profiles?.black.timeRemaining && clientData.profiles.black.totalTime !== undefined) {
                this.timer.minusTimeCounter(clientData.profiles.black.timeRemaining, 100);
            }

        }

        if (clientData.gameStatus.currentTurn === 8) {
            if (this.timer.timeRemaining !== undefined && clientData.profiles) {
                clientData.profiles.black.timeRemaining = Number(this.timer.minusTimeClear().toFixed(1));
                if (clientData.gameConfig?.timeLimitPerGame !== undefined) clientData.profiles.black.totalTime = clientData.gameConfig?.timeLimitPerGame?.timeLimit - clientData.profiles.black.timeRemaining;
            }

            if (clientData.profiles?.white.timeRemaining && clientData.profiles.white.totalTime !== undefined) {
                this.timer.minusTimeCounter(clientData.profiles.white.timeRemaining, 100);
            }
        }

        if (clientData.profiles?.white.totalTime !== undefined && clientData.profiles.black.totalTime !== undefined) clientData.gameStatus.gameTime = clientData.profiles?.white.totalTime + clientData.profiles?.black.totalTime;

        return;
    }
}

class Timer  {
    timeRemaining: number;
    private minusTimer: NodeJS.Timeout | undefined;

    minusTimeCounter(count: number, speedMultiplier: number): void {
        this.timeRemaining = count;
        
        this.minusTimer = setInterval(() => {
            if (this.timeRemaining <= 0) {
                console.log(`timesup ${clientData.gameStatus.currentTurn} lose, cannot play any further type <game.config(-1)> to disband board`);
                
                clearInterval(this.minusTimer);
                if (clientData.profiles?.white.timeRemaining && clientData.profiles.black.timeRemaining) {
                    if (clientData.gameStatus.currentTurn === 16) {
                        clientData.profiles.black.timeRemaining = 0;
                        if (clientData.gameConfig?.timeLimitPerGame !== undefined) clientData.profiles.black.totalTime = clientData.gameConfig?.timeLimitPerGame?.timeLimit - clientData.profiles.black.timeRemaining;
                    }
                    if (clientData.gameStatus.currentTurn === 8) {
                        clientData.profiles.white.timeRemaining = 0;
                        if (clientData.gameConfig?.timeLimitPerGame !== undefined) clientData.profiles.white.totalTime = clientData.gameConfig?.timeLimitPerGame?.timeLimit - clientData.profiles.white.timeRemaining;
                    }

                    if (clientData.profiles?.white.totalTime !== undefined && clientData.profiles.black.totalTime !== undefined) clientData.gameStatus.gameTime = clientData.profiles?.white.totalTime + clientData.profiles?.black.totalTime;
                }
                return;

            } else {
                console.log(`> turn: ${clientData.gameStatus.currentTurn}, time left: ${this.timeRemaining.toFixed(1)}`);
                this.timeRemaining -= 0.1;
            }
        }, speedMultiplier);

        return;
    }

    minusTimeClear() {
        if (this.minusTimer) {
            clearInterval(this.minusTimer);
            this.minusTimer = undefined;
        }

        return this.timeRemaining;
    }

}


const rules: Rules = {
    undo: true, type: 'default'
}

const time: TimeControl = {
    timeControl: 'game', timeLimit: 10
}

const game = new Interface(1, rules, time);

(async() => {

    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

    game.play(8, 24);
    console.log(data.board[24]);
    console.log(clientData.profiles);
    
    await sleep(5400);
    
    game.play(48, 32);
    console.log(data.board[32]);
    console.log(clientData.profiles);
    
    await sleep(5000);
    
    game.play(9, 25);
    console.log(data.board[25]);
    console.log(clientData.profiles);
    
    await sleep(4500);
    
    game.play(49, 33);
    console.log(data.board[33]);
    console.log(clientData.profiles);
    
    await sleep(4000);
    
    game.play(1, 16);
    console.log(data.board[16]);
    console.log(clientData.profiles);
    
    await sleep (3000);
    console.log(clientData.profiles);
    console.log(clientData.gameStatus);

    game.config(-1);
    console.log(clientData);
})()


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