#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <cctype>

class Data {
public:
    int log_md(int first = 0, int second = 0, int third = 0, int forth = 0, int fifth = 0) {
        if (first == 0) return md.board[second][third][forth][fifth];
        if (first == 1) return md.metadata[second];
        return 0;
    }

protected:
    struct MainData {
        int ****board;
        int *metadata;
    };

    struct GameData {
        int isGameStart;

        struct GameStatistics {
            int currentTurn, gameTime;
        };
        GameStatistics *gSt;

        struct GameConfiguration {
            int boardType, isUndoAllowed, timeControl;
        };
        GameConfiguration *gCf;

        struct Profiles {
            struct White {
                int score, move, timeRemaining;
            };
            White *pW;

            struct Black {
                int score, move, timeRemaining;
            };
            Black *pB;
        };
        Profiles *pfp;
    };

    MainData md;
};

class Board : public Data {
private:
    void allocate(MainData *md, int row, int col) {
    md->board = new int***[row];
    md->metadata = new int[3];

    md->metadata[0] = row;
    md->metadata[1] = col;

    for (int i = 0; i < row; i++) {
        md->board[i] = new int**[col];

            for (int j = 0; j < col; j++) {
                md->board[i][j] = new int*[3];
                md->board[i][j][0] = new int[3];
                md->board[i][j][1] = new int[8];
                md->board[i][j][2] = new int[4];
            }
        }
    }

    void initalize(MainData *md) {
        int rowa = md->metadata[0];
        int cola = md->metadata[1];
        int row = rowa - 1;

        for (int i = 0; i < rowa; i++) {
            for (int j = 0; j < cola; j++) {
                md->board[row][j][0][0] = (cola * i) + j;
                md->board[row][j][0][1] = 65 + j;
                md->board[i][j][0][2] = row + 1;
            }
            row--;
        }
    }

    void edgecount(MainData *md) {
        auto mathmin = [](int a, int b) { return (a < b) ? a : b; };

        for (int i = md->metadata[0] - 1; i >= 0; i--) {
            for (int j = 0; j < md->metadata[1]; j++) {
                int east = (md->metadata[1] - 1) - j;
                int west = j;
                int south = i;
                int north = (md->metadata[0] - 1) - i;

                int cache[8] = {north, south, west, east, mathmin(north, west), mathmin(south, east), mathmin(north, east), mathmin(south, west)};

                for (int k = 0; k < 8; k++) {
                    md->board[i][j][1][k] = cache[k];
                }
            }
        }
    }

    void insertpieces(MainData *md, const char *fen) {
        auto chartoint = [](char data) {
            switch (data) {
                case 'p':
                    return 1;
                case 'b':
                    return 2;
                case 'n':
                    return 3;
                case 'r':
                    return 4;
                case 'q':
                    return 5;
                case 'k':
                    return 6;
                default:
                    return 0;
            };
        };

        int row = md->metadata[0] - 1, col = 0;

        for (int i = 0; i < md->metadata[0]; i++) {
            for (int j = 0; j < md->metadata[1]; j++) {
                md->board[i][j][2][0] = 0;
                md->board[i][j][2][1] = 0;
                md->board[i][j][2][2] = 0;
            }
        }
        for (int i = 0; i < strlen(fen); i++) {
            if (fen[i] == '/') {
                row--;
                col = 0;
            } else {
                if (isdigit(fen[i])) {
                    col += fen[i] - '0';
                } else {
                    md->board[row][col][2][0] = fen[i];
                    md->board[row][col][2][1] = chartoint(tolower(fen[i]));
                    md->board[row][col][2][2] = (tolower(fen[i]) == fen[i]) ? 8 : 16;

                    col++;
                }
            }
        }
    }

    void deleteboard(MainData *md) {
        int row = md->metadata[0];
        int col = md->metadata[1];

        for (int i = 0; i < row; i++) {
            for (int j = 0; j < col; j++) {
                delete[] md->board[i][j][0];
                delete[] md->board[i][j][1];
                delete[] md->board[i][j][2];
                delete[] md->board[i][j];
            }
            delete[] md->board[i];
        }
        delete[] md->board;
        delete[] md->metadata;
    }

    int boardState = -1;

public:

    int interface(const char* type, int row = 8, int col = 8) {
        if (strcmp(type, "delete") == 0 && boardState == -1) {
            printf("cannot delete void");
            return -1;
        }

        if (strcmp(type, "delete") == 0 && boardState == 0) {
            deleteboard(&md);
            boardState = -1;
            printf("board deleted");
            return 0;
        }

        if (boardState == 0) {
            printf("cannot override board");
            return -1;
        }

        if (row < 1 || col < 1) {
            printf("cannot initialize zero or negative board");
            return -1;
        }
        if (strcmp(type, "default") == 0) type = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";

        allocate(&md, row, col);
        initalize(&md);
        edgecount(&md);
        insertpieces(&md, type);
        boardState = 0;
        printf("board initalized");

        return 0;
    }
};

int main() {
    Board board;
    board.interface("default", 8, 8);
    
    printf("size: %d(row) x %d(col)\n\n", board.log_md(1, 0), board.log_md(1, 1));

    for (int i = 0; i < board.log_md(1, 0); i++) {
        for (int j = 0; j < board.log_md(1, 1); j++) {
            printf("[%2d:%c%d | %c:%2d:%2d] ", board.log_md(0, i, j, 0, 0), board.log_md(0, i, j, 0, 1), board.log_md(0, i, j, 0, 2), board.log_md(0, i, j, 2, 0), board.log_md(0, i, j, 2, 1), board.log_md(0, i, j, 2, 2));
        }
        printf("\n\n");
    }
}