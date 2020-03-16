import React from 'react'
import Board from './Board'

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
]

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
    const squares = JSON.parse(JSON.stringify(current.squares), setTimeout(() => { JSON.parse(JSON.stringify(current.squares)) }, 0));
    console.log(squares);

    // when game finish , cannot put stone
    if (this.calculateWinner(squares)) {
      return;
    }

    /* check you can put stone and, check Flip stone */
    const flipped = this.getFlipCells(i, j, this.state.blackIsNext, squares);
    if (flipped.length > 0) {
      squares[i][j] = this.state.blackIsNext ? '●' : '○';
      for (let k = 0; k < flipped.length; k++) {
        let x = flipped[k][0];
        let y = flipped[k][1];
        squares[x][y] = this.state.blackIsNext ? '●' : '○';
      }
      console.log(this.state.blackIsNext)
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        // blackIsNext: !this.state.blackIsNext,
        blackIsNext: BLACK,
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
    let canBlackFlip = this.canFlip(BLACK, squares);
    let canWhiteFlip = this.canFlip(WHITE, squares);

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
    if (!blackIsNext) {
      console.log("CPU");
      setTimeout(this.think(squares), 1000);
    }
  }

  // CPU 
  think(squares) {
    let highScore = -1000;
    let px = -1, py = -1;
    let tmpData = []
    let flipCheckFlag = false;

    console.log('think');
    console.log(squares);
    // waitTime(500);

    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        let flipped = this.getFlipCells(x, y, WHITE, squares);
        if (flipped.length > 0) {
          tmpData = JSON.parse(JSON.stringify(squares), setTimeout(() => { JSON.parse(JSON.stringify(squares)) }, 0));
          console.log("tmpData,x:" + x.toString() + ",y:" + y.toString());
          console.log(tmpData);
          for (let i = 0; i < flipped.length; i++) {
            let p = flipped[i][0];
            let q = flipped[i][1];
            tmpData[p][q] = '○';
            tmpData[x][y] = '○';
          }
          let score = this.calcWeightData(tmpData);
          if (score > highScore) {
            highScore = score;
            px = x;
            py = y;
          }
        }
      }
    }

    console.log("max-positon px:" + px + ",py:" + py);

    if (px >= 0 && py >= 0) {
      let flipped = this.getFlipCells(px, py, WHITE, squares);
      if (flipped.length > 0) {
        console.log("cpu put!!");
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



  /* weight update (for CPU)*/
  calcWeightData(tmpData) {
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

  getNumStone(blackIsNext, squares) {
    let stoneColor = blackIsNext ? '●' : '○';
    let stoneNum = 0;

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if (squares[i][j] === stoneColor)
          stoneNum++;
      }
    }
    return stoneNum;
  }

  getFlipCells(i, j, color, squares) {
    // すでに石が置いてある場合
    if (squares[i][j] != null) {
      return [];
    }

    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];
    let result = [];
    let flipped

    for (let p = 0; p < dirs.length; p++) {
      flipped = this.getFlipCellsOneDir(i, j, dirs[p][0], dirs[p][1], color, squares);
      result = result.concat(flipped);
    }
    return result;
  }

  getFlipCellsOneDir(i, j, dx, dy, color, squares) {

    let x = i + dx;
    let y = j + dy;
    let flipped = [];
    let nowColor = color ? '●' : '○';

    // ボード外、隣が同色、または何も置かれていない場合失敗
    if (x < 0 || y < 0 || x > 7 || y > 7 || squares[x][y] === nowColor || squares[x][y] === null) {
      return [];
    }

    // 挟める場合はそれをflippedへ追加
    flipped.push([x, y]);

    while (true) {
      x += dx;
      y += dy;
      // ボード外、または挟む先に何も置かれていない場合は失敗
      if (x < 0 || y < 0 || x > 7 || y > 7 || squares[x][y] === null) {
        return [];
      }
      // 挟む始まりと終わりの石の色が一緒の時成功
      if (squares[x][y] === nowColor) {
        return flipped;
      } else {
        flipped.push([x, y]);
      }
    }
  }

  canFlip(color, squares) {
    let flipped
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        flipped = this.getFlipCells(x, y, color, squares);
        if (flipped.length > 0)
          return true;
      }
    }
    return false;
  }

  isFinish(numBlack, numWhite, squares) {
    let canBlackFlip = this.canFlip(BLACK, squares);
    let canWhiteFlip = this.canFlip(WHITE, squares);
    if (numBlack + numWhite === 64 || (!canBlackFlip && !canWhiteFlip)) {
      return true;
    }
    return false;
  }

  calculateWinner(squares) {
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

    if (this.isFinish(numBlack, numWhite, squares)) {
      if (numBlack > numWhite) {
        return '●';
      }
      if (numWhite > numBlack) {
        return '○';
      }
    }
    return null;
  }

  waitTime(waitMsec) {
    let stMsec = new Date();
    while (new Date() - stMsec < waitMsec);
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = this.calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      const desc = move ? 'Go to move #' + move : 'Go to game start';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );

    });

    let status;
    let pointBlack = this.getNumStone(BLACK, current.squares);
    let pointWhite = this.getNumStone(WHITE, current.squares);
    if (winner) {
      status = 'Winner: ' + winner + '!!! :)';
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

export default Game