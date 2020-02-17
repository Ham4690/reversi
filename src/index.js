import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const BLACK = true;
const WHITE = false;


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
    renderSquare(i,j) {
        return (
            <Square 
                value={this.props.squares[i][j]} 
                onClick={() => this.props.onClick(i,j)}    
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0,0)}
                    {this.renderSquare(0,1)}
                    {this.renderSquare(0,2)}
                    {this.renderSquare(0,3)}
                    {this.renderSquare(0,4)}
                    {this.renderSquare(0,5)}
                    {this.renderSquare(0,6)}
                    {this.renderSquare(0,7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(1,0)}
                    {this.renderSquare(1,1)}
                    {this.renderSquare(1,2)}
                    {this.renderSquare(1,3)}
                    {this.renderSquare(1,4)}
                    {this.renderSquare(1,5)}
                    {this.renderSquare(1,6)}
                    {this.renderSquare(1,7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(2,0)}
                    {this.renderSquare(2,1)}
                    {this.renderSquare(2,2)}
                    {this.renderSquare(2,3)}
                    {this.renderSquare(2,4)}
                    {this.renderSquare(2,5)}
                    {this.renderSquare(2,6)}
                    {this.renderSquare(2,7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3,0)}
                    {this.renderSquare(3,1)}
                    {this.renderSquare(3,2)}
                    {this.renderSquare(3,3)}
                    {this.renderSquare(3,4)}
                    {this.renderSquare(3,5)}
                    {this.renderSquare(3,6)}
                    {this.renderSquare(3,7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(4,0)}
                    {this.renderSquare(4,1)}
                    {this.renderSquare(4,2)}
                    {this.renderSquare(4,3)}
                    {this.renderSquare(4,4)}
                    {this.renderSquare(4,5)}
                    {this.renderSquare(4,6)}
                    {this.renderSquare(4,7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(5,0)}
                    {this.renderSquare(5,1)}
                    {this.renderSquare(5,2)}
                    {this.renderSquare(5,3)}
                    {this.renderSquare(5,4)}
                    {this.renderSquare(5,5)}
                    {this.renderSquare(5,6)}
                    {this.renderSquare(5,7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6,0)}
                    {this.renderSquare(6,1)}
                    {this.renderSquare(6,2)}
                    {this.renderSquare(6,3)}
                    {this.renderSquare(6,4)}
                    {this.renderSquare(6,5)}
                    {this.renderSquare(6,6)}
                    {this.renderSquare(6,7)}
                </div>
                <div className="board-row">
                    {this.renderSquare(7,0)}
                    {this.renderSquare(7,1)}
                    {this.renderSquare(7,2)}
                    {this.renderSquare(7,3)}
                    {this.renderSquare(7,4)}
                    {this.renderSquare(7,5)}
                    {this.renderSquare(7,6)}
                    {this.renderSquare(7,7)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: [
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null),
                        Array(8).fill(null)],

            }],
            stepNumber: 0,
            blackIsNext: true,
        };
        this.init();
    }

    init() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        squares[3][3] =  '●';
        squares[3][4] =  '○';
        squares[4][3] =  '○';
        squares[4][4] =  '●';
        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            blackIsNext: !this.state.blackIsNext,
        });
    }

    handleClick(i,j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i][j]) {
            return;
        }

        /* check you can put stone and, check Flip stone */
        const flipped = getFlipCells(i, j, this.state.blackIsNext, squares);
        if ( flipped.length > 0) {
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
            /* update check */
        }
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            blackIsNext: (step % 2) == 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #' + move :
                'Go to game start';
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.blackIsNext ? '●' : '○');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={current.squares}
                        onClick={(i,j) => this.handleClick(i,j)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
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

function update(squares) {
    let numWhite = 0;
    let numBlack = 0;
    for( let x = 0; x < 8; x++) {
        for( let y = 0; y < 8; y++) {
           if(squares[x][y] === '●')
                numBlack++;

           if(squares[x][y] === '○')
                numWhite++;
        }
    }

    let canBlackFlip = canFlip(BLACK, squares); 
    let canWhiteFlip = canFlip(WHITE, squares);
/***** 
    if (numBlack + numWhite == 64 || (!canBlackFlip && !canWhiteFlip)) {
    }
******/
    if (!canBlackFlip) {
        this.setState({
            blackIsNext: false
        });
    }else if(!canWhiteFlip) {
        this.setState({
            blackIsNext: true
        });
    }
}

function getFlipCells(i, j, color, squares) {
    if (squares[i][j] != null) {
        return [];
    }

    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    let result = [];
    for (let p = 0 ; p < dirs.length ; p++) {
        let flipped = getFlipCellsOneDir(i, j, dirs[p][0], dirs[p][1], color, squares);
        result = result.concat(flipped);
    }
    return result;
}

function getFlipCellsOneDir(i, j, dx, dy, color, squares) {
    let x = i + dx;
    let y = j + dy;
    let flipped = [];
    let nowColor = color ? '●' : '○' ; 

    if(x < 0 || y < 0 || x > 7 || y > 7 || squares[x][y] === nowColor || squares[x][y] === null) {
        return [];
    } 
    flipped.push([x,y]);
    while(true) {
        x += dx;
        y += dy;
        if(x < 0 || y < 0 || x > 7 || y > 7 ||  squares[x][y] === null) {
            return [];
        }
        if (squares[x][y] === nowColor) {
            return flipped;
        } else {
            flipped.push([x,y]);
        }
    }
}

function canFlip(color, squares) {
    for (let x = 0 ; x < 8 ; x++) {
        for (let y = 0; y < 8; y++) {
            let flipped = getFlipCells(x, y, color, squares);
            if (flipped.length > 0) 
                return true;
        }
    }
    return false;
}

/*cpu が まだ */
/* 勝利条件がまだ */
function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  }