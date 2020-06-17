import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let imgHome = "https://beethacker.github.io/slidepuzzle/img/";


function makeTranslateStyle(x, y) {
    return {transform: `translate(${x}px, ${y}px)`};
}

function CenterCircle(props) {
    if (!props.inCell) {
        return <></>;
    }
    let className = "center-circle"; 
    if (props.active) {
        className += " active";
    } 
    return <div className={className} style={makeTranslateStyle(props.x, props.y)}></div>
}

function CroppedImage(props) {
    return <img src={imgHome + "camping.jpg"} alt="stub" style={{
                "marginTop" : -props.sy + "px",
                "width": props.w + "px",
                "height" : props.h + "px",
                "marginLeft": -props.sx + "px",
            }}/>
}

function Square(props) {
    const index = props.value;
    const active = false;
    const inCell = index === 3;
    const x = index % props.rows;
    const y = Math.floor(index / props.rows);
    let classes = "square";
    if (inCell) {
        classes += " selected";
    }
    let overlay = null;
    if (inCell) {
        overlay = <>
        <div className="circle" />
        <CenterCircle x={0.5*props.w} y={0.5*props.h} active={active} inCell={inCell}/>
        </>
    }
    return (
        <td className={classes} onClick={() => props.handleClick()} style={{"width": props.w, "height": props.h}}>
            {overlay}        
            <CroppedImage w={props.cols*props.w} h={props.rows*props.h} sx={x*props.w} sy={y*props.h} inCell={inCell}/>
        </td>
    );
}

class Board extends React.Component {
    constructor(props) {
        super(props);
        var x = 3;
        var y = 3;
        this.state = { squares: [...Array(9).keys()].map( i => i === 0 ? null : i ), cols: x, rows: y, width: window.innerWidth, height: window.innerHeight };

        setInterval(() => {
            this.setState({...this.state, width: window.innerWidth, height: window.innerHeight});
        }, 2000);
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
        const aspect = 4/3;
        let width = 0.9*(window.innerWidth) / 3;
        let height = 0.9*(window.innerHeight) / 3;
        if (width / height > aspect) {
            width = height * aspect;
        }
        else {
            height = width / aspect;
        }
        return <Square 
        value={this.state.squares[i]} 
        handleClick={() => this.handleClick(i)} 
        w = {width}
        h = {height}
        rows = {this.state.rows}
        cols = {this.state.cols}
        />;
    }

    render() {
        return (
            <center>
            <table className="grid">
                <tr className="board-row">
                    {this.renderSquare(null)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </tr>
                <tr className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </tr>
                <tr className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </tr>
            </table>
            </center>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasLocation: false};

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({coords: position.coords, hasLocation: true});
            });
        } else {
            this.setState({hasLocation: false});
        }
    }

    render() {
        return (
            <div>
                <div className="circle"/>
                { this.state.hasLocation 
                ? <p> Location: {this.state.coords.latitude}, {this.state.coords.longitude} </p> 
                : <p> Location unavailable! </p> }    
                
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
