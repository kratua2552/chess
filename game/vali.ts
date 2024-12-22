import { data ,Board, Pieces, readOnlyData } from './data.ts';

export class Validate {

    constructor() {
        
    }
    
    manage(): number {

        data.moveablePos = [];
        const select: number = data.movPos.select;
        
        if ([2, 4, 5].includes(select)) {

            this.queenRookBishop();
            return 245;

        }

        switch (select) {
            case 1:
                this.pawn();
                return 1;
            case 3:
                this.knight();
                return 3;
            case 6:
                this.king();
                return 6;
            case 0:
                return 0;
        }

        return 400;
    }

    enemColor(): number[] {

        let oppn: number = 0;
        const cache: number[] = [];
        const fnly: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].color;


        switch (fnly) {

            case 8:
                oppn = 16;
                break;

            case 16:
                oppn = 8;
                break;

        }

        cache.push(oppn);
        cache.push(fnly);

        return cache;
    }

    queenRookBishop(): void {

        const color: number[] = this.enemColor();
        const stDirIndx: number = (data.movPos.select === Pieces.Bishop) ? 4 : 0;
        const enDirIndx: number = (data.movPos.select === Pieces.Rook) ? 4 : 8;
        
        for (let dirIndx: number = stDirIndx; dirIndx < enDirIndx; dirIndx++) {
            let enemCount: number = 0;
            
            for (let i: number = 0; i < data.sqToEdge[data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx][readOnlyData.dirIndx[dirIndx]]; i++) {
    
                // sqToEdge[movPos.curPos NOTE: 0-63][dirIndxKey[dirIndx] NOTE: only return targeted direction key]; in this case is
                // sqToEdge["0"]["NDir"] or sqToEdge[0].NDir
                
                const targetSq: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsets[dirIndx] * ( i + 1 );
    
                // if block by friendly piece then unable to move any further
                if (data.board[targetSq].color === color[1]) {

                    break;

                }
    
                // cant move any further after capture enemy piece
                if (data.board[targetSq].color === color[0]) {
                    if (enemCount === 1) {
                        break;
                    }
                    data.moveablePos.push(targetSq);
                    enemCount++;

                }
                
                // console.log(targetSq);
                data.moveablePos.push(targetSq);
            }
        }

        return;
    }

    king(): void {

        const color: number[] = this.enemColor();

        for (let dirIndx: number = 0; dirIndx < 8; dirIndx++) {

            for (let i: number = 0; i < Math.min(1, data.sqToEdge[data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx][readOnlyData.dirIndx[dirIndx]]); i++) {

                const targetSq: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsets[dirIndx];

                if (data.board[targetSq].color === color[1]) {

                    break;

                }

                data.moveablePos.push(targetSq);
            }
        }

        return;
    }

    pawn(): void {
        
        const color: number[] = this.enemColor();
        const behav: number = (data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].mov === 0) ? 2 : 1;

        if (data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].color === 8) {
            for (let dirIndx: number = 0; dirIndx < 3; dirIndx++) {

                for (let i: number = 0; i < Math.min(behav, data.sqToEdge[data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx][readOnlyData.dirIndx[dirIndx]]); i++) {

                    let targetSq: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsetsPawn[dirIndx] * ( i + 1 );

                    if (data.board[targetSq].color === color[1]) {

                        break;

                    }

                    if (data.board[targetSq].color === color[0]) { 

                        if (dirIndx === 0) {

                            break;

                        }
                        
                    }

                    if (data.board[targetSq].color !== color[0]) { 

                        if (dirIndx === 1 || dirIndx === 2) {

                            break;

                        }

                    }

                    data.moveablePos.push(targetSq);
                }
            }

            return;
        }

        if (data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].color === 16) {
            for (let dirIndx: number = 0; dirIndx < 3; dirIndx++) {

                for (let i: number = 0; i < Math.min(1, data.sqToEdge[data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx][readOnlyData.dirIndx[dirIndx]]); i++) {

                    let targetSq: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsetsPawn2[dirIndx];

                    if  (behav === 2) { // bruteforcing this shit, dont care
                        const targetSq2: number = data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].indx + readOnlyData.dirOffsetsPawn2[0] * (2);

                        if (data.board[targetSq2].color === color[1]) {

                            break;
    
                        }
    
                        if (data.board[targetSq2].color === color[0]) { 
    
                            if (dirIndx === 0) {
    
                                break;
    
                            }
                            
                        }
    
                        if (data.board[targetSq2].color !== color[0]) {
    
                            if (dirIndx === 1 || dirIndx === 2) {
    
                                break;
    
                            }
    
                        }

                        data.moveablePos.push(targetSq2);
                    }

                    if (data.board[targetSq].color === color[1]) { 

                        break;

                    }

                    if (data.board[targetSq].color === color[0]) {

                        if (dirIndx === 0) {

                            break;

                        }
                        
                    }

                    if (data.board[targetSq].color !== color[0]) {

                        if (dirIndx === 1 || dirIndx === 2) {

                            break;

                        }

                    }

                    data.moveablePos.push(targetSq);
                }
            }

            return;

        }

    }

    knight(): void {

        const color: number[] = this.enemColor();
        const curRow = parseInt((data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].access[0]))
        const curCol = parseInt((data.board[data.board.findIndex((obj: Board) => obj.access === data.movPos.curPos)].access[1]))
    
        for (let dirIndx = 0; dirIndx < 8; dirIndx++) {

            const rowOffset = readOnlyData.dirOffsetsKnight[dirIndx][0];
            const colOffset = readOnlyData.dirOffsetsKnight[dirIndx][1];

            const newRow = curRow + rowOffset;
            const newCol = curCol + colOffset;
    
            // corner check
            if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {

                continue;

            }
    
            const targetSq = newRow * 8 + newCol;

            if (data.board[targetSq].color === color[1]) {

                continue;

            }

            if (data.board[targetSq].color === color[0]) {

                continue;

            }

            data.moveablePos.push(targetSq);
        }

        return;
    }
}