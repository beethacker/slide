import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <div className="square" onClick={() => props.handleClick()}>
            {props.value}
        </div>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        var w = 3;
        var h = 3;
        this.state = { squares: [...Array(9).keys()].map( i => i === 0 ? null : i ), width: w, height: h };
    }

    neighborsOf(i) {
        var result = [];
        var w = this.state.width;
        var row = Math.floor(i / this.state.width);

        //Down one row
        if (i + w < this.state.squares.length) {
            result.push(i + w)
        }
        //Up one 
        if (i - w >= 0) {
            result.push(i - w);
        }
        //Right
        if (Math.floor((i + 1) / w) === row) {
            result.push(i + 1);
        }
        //Left
        if (i > 0 && Math.floor((i - 1) / w) === row) {
            result.push(i - 1);
        }

        return result;
    }
    
    handleClick(i) {
        const squares = this.state.squares.slice();

        var neighbors = this.neighborsOf(i);
        alert(neighbors);

        this.setState({...this.state, squares: squares });
    }

    renderSquare(i) {
        return <Square value={this.state.squares[i]} handleClick={() => this.handleClick(i)} />;
    }

    render() {
        return (
                <div className="grid">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
        );
    }
}

class Game extends React.Component {
    render() {

        return (
            <div className="game">
                <Board />
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
