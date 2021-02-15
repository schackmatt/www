import { LichessJSONObject, LineNode } from './interface.library';

export const enum PieceType {
    King,
    Queen,
    Bishop,
    Knight,
    Rook,
    Pawn
}

export const enum Color {
    White,
    Black
}

export const enum FILE {
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h
}

export const enum RANK {
    ONE,
    TWO,
    THREE,
    FOUR,
    FIVE,
    SIX,
    SEVEN,
    EIGHT
}

export function fileToString(file: FILE): string {
    return String.fromCharCode(97 + file);
}

export function randomRank(): RANK {
    return Math.floor(Math.random() * 8);
}
export function randomFile(): FILE {
    return Math.floor(Math.random() * 8);
}
export function randomRankInclusivelyBetween(
    minRank: RANK,
    maxRank: RANK
): RANK {
    return randomNumberInclusivelyBetween(minRank + 0, maxRank + 0);
}
export function randomFileInclusivelyBetween(
    minFile: FILE,
    maxFile: FILE
): FILE {
    return randomNumberInclusivelyBetween(minFile + 0, maxFile + 0);
}
export function randomNumberInclusivelyBetween(
    min: number,
    max: number
): number {
    if (max <= min) {
        console.error(max + ' is not greater than ' + min);
    }
    if (max > 7) {
        console.error(max + ' is too large');
    }
    if (min < 0) {
        console.error(min + ' is too small');
    }
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pickRandom(array: any[]): any {
    if (array.length === 0) {
        console.error('No content in array.');
    } else if (array.length === 1) {
        return array[0];
    }
    return array[Math.floor(Math.random() * array.length)];
}

export function parseLichessFile(ljo: LichessJSONObject): any {
    // TODO more here
    return { pgn: parsePGN(ljo.pgnContent) };
}

export function parsePGN(pgn: string): LineNode {
    console.log('parsePGN', pgn);
    // "pgnContent": "\n1. e4 c5 { [%cal Gg1f3,Gg1e2,Gg1h3] } 2. Nf3
    // { [%csl Gc7,Gb6,Ga5] } 2... Qa5 { The pawn can't play to d4 because
    // it is pinned by the queen on a5 } { [%csl Rd4][%cal Rd2d4,Ga5e1] }
    // (2... Nc6 3. d4) 3. c3 *"

    let lineNode: LineNode = {
        move: null,
        nextNodes: [],
        comment: null,
        draws: null
    };
    let i = 0;
    while (i < pgn.length) {
        // handle beginning new lines
        if (pgn.charAt(i) === '\n') {
            i++;
        }
        let j = i + 1;

        let specialCase = null;
        if (pgn.charAt(i) === '(') {
            specialCase = ')';
        } else if (pgn.charAt(i) === '{') {
            specialCase = '}';
        }

        if (!specialCase) {
            // no special case, assuming notation
            while (pgn.charAt(j) !== ' ' && j < pgn.length) {
                j++;
            }
        } else {
            while (pgn.charAt(j) !== specialCase && j < pgn.length) {
                j++;
            }
            if (pgn.charAt(j) === '}' && specialCase === '}') {
                console.log('COMMENT', pgn.substring(i + 2, j - 1));
                j++;
            } else if (pgn.charAt(j) === ')' && specialCase === ')') {
                console.log('SIDELINE', pgn.substring(i + 1, j));
                j++;
            }
        }

        let s = pgn.substring(i, j);
        console.log('s', '|' + s + '|');

        i = j;

        // must do this to avoid inf loop
        i++;
    }
    console.log('done');

    return lineNode;
}
