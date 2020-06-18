import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let imgHome = "https://beethacker.github.io/slidepuzzle/img/";


/*
Latitude: 1 deg = 110.574 km
Longitude: 1 deg = 111.320*cos(latitude) km
*/
function geoDistance(a, b) {
    if (typeof a === 'undefined' || typeof b === 'undefined') {
        return null;
    } 
    const latRadians = a[0] * Math.PI / 180;

    const kmLat = 110.574 * Math.abs(a[0] - b[0]);
    const kmLng = 111.32 * Math.abs(a[1] - b[1]) * Math.cos(latRadians);

    const km = Math.sqrt(kmLat * kmLat + kmLng * kmLng);
    return km;
}

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
    const inCell = props.isNearest;
    let classes = inCell ? "square selected" : "square";
    let overlay = null;
    if (inCell) {
        overlay = <>
        <div className="circle" />
        <CenterCircle x={0.5*props.w} y={0.5*props.h} active={active} inCell={inCell}/>
        </>
    }

    if (!index) {
        return (
            <td className="square empty" style={{"width": props.w, "height": props.h}}>
                {overlay}
            </td>
        );
    }

    const x = index % props.rows;
    const y = Math.floor(index / props.rows);
    const dist = geoDistance(props.geoCenter, props.geoUser);

    return (
        <td className={classes} onClick={() => props.handleClick()} style={{"width": props.w, "height": props.h}}>
            <span style={{position: "absolute", color: "white", backgroundColor: "black"}}> {props.geoCenter.toString() + " ==> " + dist} </span>
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

        var nearest = -1;
        var distanceList = [];
        if (this.props.hasLocation) {
            distanceList = props.serverData.cells.map(cell => geoDistance(this.props.geoUser, cell));
            console.log(distanceList);
            nearest = this.minIndex(distanceList)[0];
        }

        this.state = { squares: this.props.gameData.puzzleState.map( i => i === 0 ? null : i ), cols: x, rows: y, width: window.innerWidth, height: window.innerHeight, nearest: nearest };

        setInterval(() => {
            this.setState({...this.state, width: window.innerWidth, height: window.innerHeight});
        }, 2000);

        setInterval(() => {
            
        }, 2000);
    }


    minIndex(distanceList) {
        let result = -1;
        let min = 999999;
        for (let i = 0; i < distanceList.length; i++) {
            if (distanceList[i] < min) {
                result = i;
                min = distanceList[i];
            }
        }
        return [result, min];
    }

    findNearest(geo, cells) {
        let result = -1;
        let min = 9999999999;
        for (var i = 0; i < cells.length; i++) {
            const dist = this.geoDistance(geo, cells[i]);   
            if (dist < min) {
                min = dist;
                result = i;
            }
        }
        return result;
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
        isNearest={i === this.state.nearest}
        geoUser={this.props.geoUser}
        geoCenter={this.props.gameData.cells[i]}
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
                    {this.renderSquare(0)}
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
        this.state = {hasLocation: false, serverData: {
            puzzleState: [7,4,3,1,5,2,8,0,6],
            cells: [
                [44.662461, -63.603948],  //Agricola
                [44.664109, -63.601264],  //Novalea
                [44.666200, -63.600276],  //Stairs

                [44.659729, -63.602380],   //Rbboie
                [44.661274, -63.600525],   //home
                [44.664368, -63.595637],   //Devonshire

                [44.657439, -63.598772],   //Robbie almon
                [44.659897, -63.595294],   //Gottigen almon
                [44.662278, -63.591474]    //Barrington
             ]
        }};

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({...this.state, coords: [position.coords.latitude, position.coords.longitude], hasLocation: true});
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
                ? <p> Location: {this.state.coords[0]}, {this.state.coords[1]} </p> 
                : <p> Location unavailable! </p> }    
                
                <Board gameData={this.state.serverData} geoUser={this.state.coords}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
