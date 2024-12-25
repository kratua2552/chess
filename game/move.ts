import { ChessBoard } from './board.ts';
import { data } from './data.ts';
import { Validate } from './vali.ts';

export class Engine {
    val: Validate;

    constructor() {
        this.val = new Validate();
    }

    generate(): void {
        for (let stSq: number = 0; stSq < data.board.length; stSq++) {
            const piece = data.board[stSq]

            if (true) { // turn check (later)
                if ([2,4,5].includes(piece.type)) {

                    this.val.queenRookBishop(stSq);
                };

                switch (piece.type) {
                    case 1:
                        this.val.pawn(stSq);
                        break;
                    case 3:
                      this.val.knight(stSq);
                        break;
                    case 6:
                        this.val.king(stSq);
                        break;
                }

            }
        }

        return;
    }

    moveData(curIndx: number, nxtIndx: number): void {

        data.board[nxtIndx] = {
            ...data.board[curIndx],
            mov: data.board[curIndx].mov + 1,

            indx: data.board[nxtIndx].indx,
            access: data.board[nxtIndx].access,
            ENGINESIDEDATA_ALLPOSSIBLEPOSITION: undefined
        }

        data.board[curIndx] = {
            ...data.board[curIndx],
            type: 0,
            color: 0,
            mov: 0,
            ENGINESIDEDATA_ALLPOSSIBLEPOSITION: undefined
        }

        return;
    }
    
    move(curIndx: number, nxtIndx: number): string {

        if (curIndx === nxtIndx || nxtIndx >= data.board.length) return 'invalid_01';
        if (data.board[curIndx].ENGINESIDEDATA_ALLPOSSIBLEPOSITION.includes(nxtIndx)) {
            this.moveData(curIndx, nxtIndx);
            return 'success'
        } else {
            return 'invalid_02'
        }
    }
}


const chess = new ChessBoard();
chess.init('default');
chess.dir();

const engine = new Engine();
engine.generate();
console.log(engine.move(8, 40));
engine.generate();

console.log(data.board[8]);