import { ChessBoard } from './board.ts';
import { data } from './data.ts';
import { Validate } from './vali.ts';

export class Engine {
    val: Validate;
    undo: boolean;

    constructor() {
        this.val = new Validate();
    }

    generate(): number {
        
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

        return 1;
    }

    moveData(curIndx: number, nxtIndx: number): number {
        
        data.prevPos.unshift([data.board[curIndx], data.board[nxtIndx]]);

        data.board[nxtIndx] = {
            ...data.board[curIndx],
            mov: data.board[curIndx].mov + 1,

            indx: data.board[nxtIndx].indx,
            access: data.board[nxtIndx].access,
            ESD_posbPos: undefined,
        }

        data.board[curIndx] = {
            ...data.board[curIndx],
            type: 0,
            color: 0,
            mov: 0,
            ESD_posbPos: undefined,
        }

        return 1;
    }

    undoData(): number {

        if (this.undo) {
            data.board[data.prevPos[0][0].indx] = {
                ...data.prevPos[0][0]
            }
    
            data.board[data.prevPos[0][1].indx] = {
                ...data.prevPos[0][1]
            }
    
            data.prevPos.shift();
            return 1;

        }

        return 0;
    }
    
    move(curIndx: number, nxtIndx: number): number {

        if (curIndx === nxtIndx || nxtIndx >= data.board.length) return 401;
        if (!data.board[curIndx].ESD_posbPos) return 402;
        
        if (data.board[curIndx].ESD_posbPos.includes(nxtIndx)) {
            this.moveData(curIndx, nxtIndx);

            return 201;
        } else {

            return 402;
        }
    }
}
