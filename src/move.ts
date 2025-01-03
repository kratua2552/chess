import { data } from './data';
import { Validate } from './vali';

export class Engine {
    private val: Validate;
    undo: boolean;
    turn: number;

    constructor() {
        this.val = new Validate();
    }

    generate(): number {
        
        for (let stSq: number = 0; stSq < data.board.length; stSq++) {
            const piece = data.board[stSq];

            if ([2,4,5].includes(piece.type)) {

                this.val.queenRookBishop(stSq);
            }

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

        return 1;
    }

    private moveData(curIndx: number, nxtIndx: number): number {
        data.prevPos.unshift([data.board[curIndx], data.board[nxtIndx]]);

        if (data.board[curIndx].type === 6 && data.board[curIndx].mov === 0 && data.board[nxtIndx].type === 4 && data.board[nxtIndx].mov === 0) {
            this.castling(curIndx, nxtIndx);
            return 0;
        }

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

        } else {
            console.warn('undoData> not in turn')
        }

        return 0;
    }

    private castling(curIndx: number, nxtIndx: number): number {

        const dirKing = (nxtIndx === curIndx + 3) ? 2 : -2;
        const dirRook = (nxtIndx === curIndx + 3) ? -2 : 3;

        data.board[curIndx + dirKing] = {
            ...data.board[curIndx],
            indx: data.board[curIndx + dirKing].indx,
            access: data.board[curIndx + dirKing].access,
            ESD_posbPos: undefined,
            mov: 1
        }

        data.board[nxtIndx + dirRook] = {
            ...data.board[nxtIndx],
            indx: data.board[nxtIndx + dirRook].indx,
            access: data.board[nxtIndx + dirRook].access,
            ESD_posbPos: undefined,
            mov: 1
        }

        data.board[curIndx] = {
            ...data.board[curIndx],
            type: 0,
            color: 0,
            mov: 0,
            ESD_posbPos: undefined,
        }

        data.board[nxtIndx] = {
            ...data.board[nxtIndx],
            type: 0,
            color: 0,
            mov: 0,
            ESD_posbPos: undefined,
        }
        return 1;
    }
    
    move(curIndx: number, nxtIndx: number): number {
        if (this.turn === data.board[curIndx].color) {
            this.generate();
            
            if (curIndx === nxtIndx || nxtIndx >= data.board.length) return 1;
            if (!data.board[curIndx].ESD_posbPos) return 2;
            
            if (data.board[curIndx].ESD_posbPos.includes(nxtIndx)) {
                this.moveData(curIndx, nxtIndx);
                this.generate();
                return 20;
            } else {
                return 3;
            }

        } else {
            console.warn('move> not in turn')
        }

        return 4;
    }
}