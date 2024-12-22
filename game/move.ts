import { ChessBoard } from './board.ts';
import { data, Board } from './data.ts';
import { Validate } from './vali.ts';

const val = new Validate();

export class Move {

    turn(): number {

        if (data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].color !== data.game.turn) {
            return 1;
        }

        return 0;
    }

    move(inp: string): number {
        const dir = this.setPos(inp) // set position ready for the next move

        if (this.turn()) return 0;
        
        if (dir) {
            this.castling();
            data.game.turn = data.game.turn === 8 ? 16 : 8;
            return 1;
        }

        console.log(val.manage()); // check if the move is valid
    
        let increment: number = 1;
        const movPosLength: number = data.moveablePos.length;
        const movPos: number[] = data.moveablePos;
        
        console.log(`current position: ${data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx}`)

        console.log(`target position: ${data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.nxtPos)].indx}`)

        console.log(`possible position: ${movPos}`);
    
        if (movPosLength === 0) {
            console.log(`invalid position`);
            return 0;
        }
    
        for (let i: number = 0; i < movPosLength; i++) {

            if (movPos[i] === data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.nxtPos)].indx) {

                console.log(`position verified tries: ${increment}`)
                this.executePos();
                data.game.turn = data.game.turn === 8 ? 16 : 8;
                return 1;

            } else {

                console.log(`verifying possible position: ${increment++}/${movPosLength}`)

            }
    
            if (increment > data.moveablePos.length) {

                console.log(`invalid position`);
                return 0;

            }
        }

        return 0;
    }

    setPos(input: string): number {
        const movKey: string[] = input.split('');

        if (['>'].includes(movKey[2])) {

            for (let i: number = 0; i < movKey.length; i++) {

                switch (i) {

                    case 0:
                        data.movPos.curPos = `${movKey[i]}${movKey[i += 1]}`;
                        continue;
    
                    case 3:
                        data.movPos.nxtPos = `${movKey[i]}${movKey[i += 1]}`;
                        break;
    
                    default:
                        continue;

                }
            }
        }

        if (['='].includes(movKey[2])) {

            for (let i: number = 0; i < movKey.length; i++) {

                switch (i) {

                    case 0:
                        data.castlingPos.kingPos = `${movKey[i]}${movKey[i += 1]}`;
                        continue;

                    case 3:
                        data.castlingPos.rookPos = `${movKey[i]}${movKey[i += 1]}`;
                        break;

                    default:
                        continue;

                }
            }

            return 1;
        }
    
        data.movPos.select = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].type

        return 0;
    }

    castling(): number {
        const kingIndx: number = data.board.findIndex((obj: Board) => obj.access === data.castlingPos.kingPos);
        const rookIndx: number = data.board.findIndex((obj: Board) => obj.access === data.castlingPos.rookPos);
        const color: number = data.board[kingIndx].color;

        if (data.board[kingIndx].mov || data.board[rookIndx].mov) return 0;
        if (data.board[kingIndx].color !== data.board[rookIndx].color) return 0;

        if (color === 8 && data.board[5].color === 0 && data.board[6].color === 0) {

            data.board[5] = {
                ...data.board[5],
                type: 4,
                color: 8,
                mov: 1,
            };
            
            data.board[6] = {
                ...data.board[6],
                type: 6,
                color: 8,
                mov: 1,
            };

            data.board[4] = {
                ...data.board[4],
                type: 0,
                color: 0,
                mov: 0,
            };

            data.board[7] = {
                ...data.board[7],
                type: 0,
                color: 0,
                mov: 0,
            };

            return 12;
        }

        if (color === 8 && data.board[1].color === 0 && data.board[2].color === 0 && data.board[3].color === 0) {

            data.board[3] = {
                ...data.board[3],
                type: 4,
                color: 8,
                mov: 1,
            };
            
            data.board[2] = {
                ...data.board[2],
                type: 6,
                color: 8,
                mov: 1,
            };

            data.board[0] = {
                ...data.board[0],
                type: 0,
                color: 0,
                mov: 0,
            };

            data.board[4] = {
                ...data.board[4],
                type: 0,
                color: 0,
                mov: 0,
            };

            return 11;
        }

        if (color === 16 && data.board[61].color === 0 && data.board[62].color === 0) {

            data.board[61] = {
                ...data.board[61],
                type: 4,
                color: 8,
                mov: 1,
            };
            
            data.board[62] = {
                ...data.board[62],
                type: 6,
                color: 8,
                mov: 1,
            };

            data.board[63] = {
                ...data.board[63],
                type: 0,
                color: 0,
                mov: 0,
            };

            data.board[60] = {
                ...data.board[7],
                type: 0,
                color: 0,
                mov: 0,
            };

            return 12;
        }

        if (color === 16 && data.board[57].color === 0 && data.board[58].color === 0 && data.board[59].color === 0) {

            data.board[59] = {
                ...data.board[59],
                type: 4,
                color: 8,
                mov: 1,
            };
            
            data.board[58] = {
                ...data.board[58],
                type: 6,
                color: 8,
                mov: 1,
            };

            data.board[56] = {
                ...data.board[56],
                type: 0,
                color: 0,
                mov: 0,
            };

            data.board[60] = {
                ...data.board[60],
                type: 0,
                color: 0,
                mov: 0,
            };

            return 13;
        }

        return 1;
    }

    executePos(): void {

        const curIndx: number = data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos); // finds board.access that is equal to movPos.curPos if founded, returns indx, stores in this variable
        const tarIndx: number = data.board.findIndex((obj: Board) => obj.access === data.movPos.nxtPos); // target index
    
        const curObj: Board = data.board[curIndx]; // 00
        const tarObj: Board = data.board[tarIndx]; // 74

        /*
        static Pawn = 1;
        static Bishop = 2;
        static Knight = 3;
        static Rook = 4;
        static Queen = 5;
        static King = 6; 
        */

        switch (data.board[tarIndx].type) {

            case 1:

                data.board[curIndx].color === 8 ? data.whitePfp.score += 1 : data.blackPfp.score += 1;
                console.log(`ate pawn`);
                break;
            case 2:

                data.board[curIndx].color === 8 ? data.whitePfp.score += 3 : data.blackPfp.score += 3;
                console.log(`ate bishop`);
                break;
            case 3:

                data.board[curIndx].color === 8 ? data.whitePfp.score += 3 : data.blackPfp.score += 3;
                console.log(`ate knight`);
                break;
            case 4:

                data.board[curIndx].color === 8 ? data.whitePfp.score += 5 : data.blackPfp.score += 5;
                console.log(`ate rook`);
                break;
            case 5:

                data.board[curIndx].color === 8 ? data.whitePfp.score += 9 : data.blackPfp.score += 9;
                console.log(`ate queeeen`);
                break;
            case 6:

                data.board[curIndx].color === 8 ? data.whitePfp.win += 1 : data.blackPfp.win += 1;
                data.whitePfp.match += 1;
                data.blackPfp.match += 1;
                console.log(`king eaten, run boardInit.loadPos("rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR") to restart`);
                break;
            case 0:

                break;
        }

        data.board[tarIndx] = {
            ...curObj,
            indx: tarObj.indx,
            access: tarObj.access,
            mov: data.board[curIndx].mov += 1
        };
        
        // some kind of bruteforce, but if it works it works
        data.board[curIndx] = {
          type: 0,
          color: 0,
          mov: 0,
          indx: curObj.indx,
          access: curObj.access
        };

        if ([56, 57, 58, 59, 60, 61, 62, 63].includes(data.board[tarIndx].indx) && data.board[tarIndx].color === 8 && data.board[tarIndx].type === 1){
            this.promote(data.board[tarIndx].indx, 5);
            return;
        }

        if ([0, 1, 2, 3, 4, 5, 6, 7].includes(data.board[tarIndx].indx) && data.board[tarIndx].color === 16 && data.board[tarIndx].type === 1) {
            this.promote(data.board[tarIndx].indx, 5);
            return;
        }
    
        return;
    }

    promote(promoteIndx: number, options: number): number {
        data.board[promoteIndx] = {
            ...data.board[promoteIndx],
            type: options
        }

        return options;
    }
}
