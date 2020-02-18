import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const BLACK = true;
const WHITE = false;
const WeightData = [
    [30, -12, 0, -1, -1, 0, -12, 30],
    [-12, -15, -3, -3, -3, -3, -15, -12],
    [0, -3, 0, -1, -1, 0, -3, 0],
    [-1, -3, -1, -1, -1, -1, -3, -1],
    [-1, -3, -1, -1, -1, -1, -3, -1],
    [0, -3, 0, -1, -1, 0, -3, 0],
    [-12, -15, -3, -3, -3, -3, -15, -12],
    [30, -12, 0, -1, -1, 0, -12, 30]
];


function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );
}


class Board extends React.Component {
    renderSquare(i, j) {
        return (
            <Square
                value={this.props.squares[i][j]}
                onClick={() => this.props.onClick(i, j)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0, 0)}
                    {this.renderSquare(0, 1)}
                    {this.renderSquare(0, 2)}
                    {this.renderSquare(0, 3)}
                    {this.renderSquare(0, 4)}
                    {this.renderSquare(0, 5)}
                    {this.renderSquare(0, 6)}
                    {this.renderSquare(0, 7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(1, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(1, 2)}
                    {this.renderSquare(1, 3)}
                    {this.renderSquare(1, 4)}
                    {this.renderSquare(1, 5)}
                    {this.renderSquare(1, 6)}
                    {this.renderSquare(1, 7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(2, 0)}
                    {this.renderSquare(2, 1)}
                    {this.renderSquare(2, 2)}
                    {this.renderSquare(2, 3)}
                    {this.renderSquare(2, 4)}
                    {this.renderSquare(2, 5)}
                    {this.renderSquare(2, 6)}
                    {this.renderSquare(2, 7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, 0)}
                    {this.renderSquare(3, 1)}
                    {this.renderSquare(3, 2)}
                    {this.renderSquare(3, 3)}
                    {this.renderSquare(3, 4)}
                    {this.renderSquare(3, 5)}
                    {this.renderSquare(3, 6)}
                    {this.renderSquare(3, 7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(4, 0)}
                    {this.renderSquare(4, 1)}
                    {this.renderSquare(4, 2)}
                    {this.renderSquare(4, 3)}
                    {this.renderSquare(4, 4)}
                    {this.renderSquare(4, 5)}
                    {this.renderSquare(4, 6)}
                    {this.renderSquare(4, 7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(5, 0)}
                    {this.renderSquare(5, 1)}
                    {this.renderSquare(5, 2)}
                    {this.renderSquare(5, 3)}
                    {this.renderSquare(5, 4)}
                    {this.renderSquare(5, 5)}
                    {this.renderSquare(5, 6)}
                    {this.renderSquare(5, 7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, 0)}
                    {this.renderSquare(6, 1)}
                    {this.renderSquare(6, 2)}
                    {this.renderSquare(6, 3)}
                    {this.renderSquare(6, 4)}
                    {this.renderSquare(6, 5)}
                    {this.renderSquare(6, 6)}
                    {this.renderSquare(6, 7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(7, 0)}
                    {this.renderSquare(7, 1)}
                    {this.renderSquare(7, 2)}
                    {this.renderSquare(7, 3)}
                    {this.renderSquare(7, 4)}
                    {this.renderSquare(7, 5)}
                    {this.renderSquare(7, 6)}
                    {this.renderSquare(7, 7)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: [
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null),
                        [null, null, null, '○', '●', null, null, null],
                        [null, null, null, '●', '○', null, null, null],
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null)
                    ],
                }
            ],
            stepNumber: 0,
            blackIsNext: true,
        };
    }

    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];

        //コールスタックが溢れないようにしている
        const squares = JSON.parse(JSON.stringify(current.squares), setTimeout(() => { JSON.parse(JSON.stringify(current.squares)) }, 0));
        console.log(squares);

        // when game finish , cannot put stone
        if (calculateWinner(squares)) {
            return;
        }

        /* check you can put stone and, check Flip stone */
        const flipped = getFlipCells(i, j, this.state.blackIsNext, squares);
        if (flipped.length > 0) {
            squares[i][j] = this.state.blackIsNext ? '●' : '○';
            for (let k = 0; k < flipped.length; k++) {
                let x = flipped[k][0];
                let y = flipped[k][1];
                squares[x][y] = this.state.blackIsNext ? '●' : '○';
            }

            this.setState({
                history: history.concat([{
                    squares: squares,
                }]),
                stepNumber: history.length,
                blackIsNext: !this.state.blackIsNext,
            });

            this.update(squares, !this.state.blackIsNext);
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            blackIsNext: (step % 2) === 0,
        });
    }

    update(squares, blackIsNext) {
        let numWhite = 0;
        let numBlack = 0;
        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                if (squares[x][y] === '●')
                    numBlack++;

                if (squares[x][y] === '○')
                    numWhite++;
            }
        }

        let canBlackFlip = canFlip(BLACK, squares);
        let canWhiteFlip = canFlip(WHITE, squares);

        if (!canBlackFlip) {
            this.setState({
                blackIsNext: false
            });
        } else if (!canWhiteFlip) {
            this.setState({
                blackIsNext: true
            });
        }
        // CPU
        // if(!blackIsNext) {
        //     console.log("CPU");
        //     setTimeout(this.think(squares), 1000);
        // }
    }

    // CPU 
    think(squares) {
        let highScore = -1000;
        let px = -1, py = -1;
        let tmpData = []
        let flipCheckFlag = false;

        console.log(squares);
        // waitTime(500);

        for (let x = 0; x < 8; x++) {
            for (let y = 0; y < 8; y++) {
                let flipped = getFlipCells(x, y, WHITE, squares);
                if (flipped.length > 0) {
                    tmpData = JSON.parse(JSON.stringify(squares), setTimeout(() => { JSON.parse(JSON.stringify(squares)) }, 0));
                    console.log("tmpData");
                    console.log(tmpData);
                    for (let i = 0; i < flipped.length; i++) {
                        let p = flipped[i][0];
                        let q = flipped[i][1];
                        tmpData[p][q] = '○';
                        tmpData[x][y] = '○';
                    }
                    let score = calcWeightData(tmpData);
                    if (score > highScore) {
                        highScore = score;
                        px = x;
                        py = y;
                    }
                }
            }
        }

        console.log("px:" + px + ",py:" + py);

        if (px >= 0 && py >= 0) {
            let flipped = getFlipCells(px, py, WHITE, squares);
            if (flipped.length > 0) {
                console.log("cpu put!!");
                this.handleClick(px, py);
                let tmpData = JSON.parse(JSON.stringify(squares));
                tmpData[px][py] = '○';
                for (let k = 0; k < flipped.length; k++) {
                    let x = flipped[k][0];
                    let y = flipped[k][1];
                    tmpData[x][y] = '○';
                }
                const history = this.state.history.slice(0, this.state.stepNumber + 1);
                this.setState({
                    history: history.concat([{
                        squares: tmpData,
                    }]),
                    stepNumber: history.length,
                    blackIsNext: BLACK,
                });
            }
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = history.map((step, move) => {
            const desc = move ? 'Go to move #' + move : 'Go to game start';

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );

        });

        let status;
        let pointBlack = getNumStone(BLACK, current.squares);
        let pointWhite = getNumStone(WHITE, current.squares);
        if (winner) {
            status = 'Winner: ' + winner +'!!! :)';
        } else {
            status = 'Next player: ' + (this.state.blackIsNext ? '●' : '○');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i, j) => this.handleClick(i, j)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div>BLACK:{pointBlack}</div>
                    <div>WHITE:{pointWhite}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


/* weight update (for CPU)*/
function calcWeightData(tmpData) {
    let score = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (tmpData[x][y] === '○') {
                score += WeightData[x][y];
            }
        }
    }
    return score;
}

function getNumStone(blackIsNext, squares){
    let stoneColor = blackIsNext ? '●' : '○' ;
    let stoneNum = 0;

    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            if(squares[i][j] === stoneColor)
                stoneNum++;
        }
    }
    return stoneNum;
}

function getFlipCells(i, j, color, squares) {
    if (squares[i][j] != null) {
        return [];
    }

    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    let result = [];
    for (let p = 0; p < dirs.length; p++) {
        let flipped = getFlipCellsOneDir(i, j, dirs[p][0], dirs[p][1], color, squares);
        result = result.concat(flipped);
    }
    return result;
}

function getFlipCellsOneDir(i, j, dx, dy, color, squares) {
    let x = i + dx;
    let y = j + dy;
    let flipped = [];
    let nowColor = color ? '●' : '○';

    if (x < 0 || y < 0 || x > 7 || y > 7 || squares[x][y] === nowColor || squares[x][y] === null) {
        return [];
    }
    flipped.push([x, y]);
    while (true) {
        x += dx;
        y += dy;
        if (x < 0 || y < 0 || x > 7 || y > 7 || squares[x][y] === null) {
            return [];
        }
        if (squares[x][y] === nowColor) {
            return flipped;
        } else {
            flipped.push([x, y]);
        }
    }
}

function canFlip(color, squares) {
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            let flipped = getFlipCells(x, y, color, squares);
            if (flipped.length > 0)
                return true;
        }
    }
    return false;
}

function isFinish(numBlack, numWhite, squares) {
    let canBlackFlip = canFlip(BLACK, squares);
    let canWhiteFlip = canFlip(WHITE, squares);
    if (numBlack + numWhite === 64 || (!canBlackFlip && !canWhiteFlip)) {
        return true;
    }
    return false;
}

function calculateWinner(squares) {
    let numWhite = 0;
    let numBlack = 0;
    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            if (squares[x][y] === '●')
                numBlack++;

            if (squares[x][y] === '○')
                numWhite++;
        }
    }

    if (isFinish(numBlack, numWhite, squares)) {
        if (numBlack > numWhite) {
            return '●';
        }
        if (numWhite > numBlack) {
            return '○';
        }
    }

    return null;
}

function waitTime(waitMsec) {
    let stMsec = new Date();
    while (new Date() - stMsec < waitMsec);
}