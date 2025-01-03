import { GameBoard } from "./board";
import { Engine } from "./move";

type seconds = number;

interface Base {
    status: { init: boolean };
}

interface Profile {
    score: number; move: number; time: seconds;
}

interface Profile_Timer extends Profile {
    remaining: seconds
}

interface GameData extends Base {
    status: { init: boolean; start: boolean; turn: number; time: seconds };
    config: { board: string; undo: boolean; timeControl: boolean };
    profiles: {
        white: Profile;
        black: Profile
    }
}

interface GameData_Timers extends GameData {
    config: { board: string; undo: boolean; timeControl: boolean; time: { limit: seconds; increment: seconds } };
    profiles: {
        white: Profile_Timer;
        black: Profile_Timer
    }
}

interface Configuration {
    init: boolean,
    board?: string;
    undo?: boolean;
    timeControl?: boolean
    time_limt?: seconds;
    time_increment?: seconds;
}

/////////////////////////////////////////////

class Interface {
    private engine: Engine;
    private board: GameBoard;
    gameData: GameData | GameData_Timers | Base;

    constructor() {
        this.engine = new Engine();
        this.board = new GameBoard();

        this.gameData = {
            status: { init: false },
        } as Base
    }

    config(inp: Configuration): number {
        try {
            if (inp.init) {

                if ('config' in this.gameData) console.warn('Interface.config> overrided current configuration');
                if (inp.board === undefined) console.warn('Interface.config> board is not specifed, board have been set to default');
                if (inp.undo === undefined) console.warn('Interface.config> undo is not specified, undo have been set to false');
                if (inp.timeControl === undefined) console.warn('Interface.config> time control is not specified, time control have been set to false');
                if (inp.undo === true && inp.timeControl === true) {
                    inp.undo = false;
                    console.warn('Interface.config> undo is not compatible with time control, undo have been set to false');
                }

                // base config
                this.gameData = {

                    status: {
                        init: inp.init,
                        start: false,
                        turn: 8,
                        time: 0 
                    },
    
                    config: {
                        board: inp.board ?? 'default',
                        undo: inp.undo ?? false,
                        timeControl: inp.timeControl ?? false
                    },
    
                    profiles: {
                        white: { score: 0, move: 0, time: 0 },
                        black: { score: 0, move: 0, time: 0 }
                    }
    
                } as GameData;

                if ('config' in this.gameData) {
                    this.board.init(this.gameData.config.board);
                    this.board.dirInit();

                    this.engine.undo = this.gameData.config.undo;
                    this.engine.turn = this.gameData.status.turn;
                }
            
                // timer config
                if (inp.timeControl && 'config' in this.gameData) {

                    if (inp.time_limt === undefined) console.warn('Interface.config> time limit is not specified, time limit have been set to 10 minutes');
                    if (inp.time_increment === undefined) console.warn('Interface.config> time increment is not specified, time increment have been set to 0');

                    this.gameData = {
                        ...this.gameData,
                        config: {
                            ...this.gameData.config,
                            time: {
                                limit: inp.time_limt ?? 600,
                                increment: inp.time_increment ?? 0
                            }
                        },
    
                        profiles: {
                            white: { ...this.gameData.profiles.white, remaining: inp.time_limt ?? 600 },
                            black: { ...this.gameData.profiles.black, remaining: inp.time_limt ?? 600 }
                        }
    
                    } as GameData_Timers
                    return 202;
                }
                return 201;
            }

            if (!inp.init) {

                if (!('config' in this.gameData)) {
                    console.error('Interface.config> configuration is not specified');
                    return 403;
                }

                this.board.clear();
                this.gameData = {
                    status: { init: inp.init },
                } as Base
                return 203;
            }
            return 401

        } catch (error) {
            console.warn(error);
            return 402;
        }
    }

    start(): number {
        if (!('config' in this.gameData)) return 401;

        if ('config' in this.gameData) {
            this.gameData.status.start = true;
            // do something with timers
        }
    }
}

class Timer {
    timeMs: number;
    timerState: NodeJS.Timeout | null = null;

    timeCount(startMs: number) {
        this.timeMs = startMs;
        this.timerState = setInterval(() => {
            if (this.timeMs <= 0) {
                clearInterval(this.timerState);
                this.timerState = null;
                this.timeMs = 0;
            } else {
                this.timeMs -= 0.1
                console.log(this.timeMs.toFixed(1));
            }
        }, 100);
    }

    timeClear() {
        clearInterval(this.timerState);
        this.timerState = null;
    }
}

const timer = new Timer();

timer.timeCount(10);

const game = new Interface();

console.log(game.gameData);

console.log(game.config({
    init: true,
    timeControl: true,
    undo: true
}))

console.log(game.gameData);

