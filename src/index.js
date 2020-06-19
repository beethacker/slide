import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

let PRODUCTION = false;

let imgHome = "https://beethacker.github.io/slidepuzzle/img/";
let DEBUG_POSITIONS = true;
let DEBUG_CELL_OVERLAY = false;
let DEBUG_DISABLE_MOVE_CHECK = false;
let DEBUG_SHOW_STATE = true;

if (PRODUCTION) {
    DEBUG_POSITIONS = false;
    DEBUG_CELL_OVERLAY = false;
    DEBUG_DISABLE_MOVE_CHECK = false;
    DEBUG_SHOW_STATE = false;
}

/*
Latitude: 1 deg = 110.574 km
Longitude: 1 deg = 111.320*cos(latitude) km
*/
function geoDistance(a, b) {
    if (typeof a === 'undefined' || typeof b === 'undefined') {
        return null;
    } 
    const kmLat = kmToLat(a[1] - b[1]);
    const kmLng = kmToLong(a[0] - b[0], a[1]);

    const km = Math.sqrt(kmLat * kmLat + kmLng * kmLng);
    return km;
}

function kmToLat(a) {
    return 110.574*Math.abs(a);
}

function kmToLong(a, lat) {
    const latRadians = lat*Math.PI / 180;
    return 111.32 * Math.abs(a) * Math.cos(latRadians);
}

function makeTranslateStyle(x, y) {
    return {transform: `translate(${x}px, ${y}px)`};
}

function OverlayCircle(props) {
    if (!props.inCell) {
        return <></>;
    }
    let className = props.className; 
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
    let active = false;
    const inCell = props.isNearest;// || (typeof props.geoUser !== undefined);
    let classes = inCell ? "square selected" : "square";
    let overlay = null;
    if (inCell) {
        //User coordinates that we'll calculate!
        let ux;
        let uy;        
        //Cell center!
        const cx = 0.5*props.w;
        const cy = 0.5*props.h;
        //User coordinate delta (in km) from cell center
        const dx = kmToLong(props.geoUser[0] - props.geoCenter[0], props.geoUser[1]);
        const dy = kmToLat(props.geoUser[1] - props.geoCenter[1]);
        let distKM = Math.sqrt(dx*dx + dy*dy);
        //Unit vector for users direction from cell center
        let nx = 0;
        let ny = 0;
        if (distKM > 0.0001) {
            nx = dx / distKM;
            ny = dy / distKM;
        }
        //Determin if we're in the inner ring
        const cutDist = props.geoCenter[2];
        const r = 30; //PIXEL RADIUS of ring
        let s;        //scale km to pixels
        if (distKM < cutDist) {
            //We're drawing the inner circle as 30px radius.
            //TODO Is that appropriate on mobile? Maybe we generate those in code.            
            s = r*(distKM / cutDist);
            active = true;
        }
        else {
            //Otherwise, we want to lerp (cutDist, dist ,maxDist) --> (30, ,h/2);
            const r = 30;
            const maxDist = props.geoCenter[3];
            distKM = Math.min(distKM, maxDist); //Don't draw OUTSIDE of cell
            s = ((distKM - cutDist) / (maxDist - cutDist)) * (props.h / 2 - r) + r;
        }
        //Coordinates of user dot
        ux = cx + s * nx;
        uy = cy + s * ny;

        overlay = <>
        <div className="circle" />
        <OverlayCircle className="user-circle" x={ux} y={uy} active={active} inCell={inCell}/>
        <OverlayCircle className="center-circle" x={cx} y={cy} active={active} inCell={inCell}/>
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
    const debugOverlay = DEBUG_CELL_OVERLAY
        ? <span style={{position: "absolute", color: "white", backgroundColor: "black"}}> {props.geoCenter.toString() + " ==> " + dist + ", in=" + inCell} </span>
        : null;
    return (
        <td className={classes} onClick={() => props.handleClick()} style={{"width": props.w, "height": props.h}}>
            {debugOverlay}
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

        //TODO get this from local storage, or scramble a new one
        let puzzleState = [1, null, 2, 3, 4, 5, 6, 7, 8];
        this.state = { squares: puzzleState, cols: x, rows: y, width: window.innerWidth, height: window.innerHeight };

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
        var w = this.state.rows;
        var row = Math.floor(i / this.state.rows);

        //Down one row
        console.log("w  and len" + [w, this.state.squares.length]);
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
    
    handleClick(index) {
        this.updateNearest();
        const squares = this.state.squares.slice();

        let neighbors = this.neighborsOf(index);
       // alert(neighbors);

        //TODO need to check if move is allowed!!!
        const moveAllowed = DEBUG_DISABLE_MOVE_CHECK || (index === this.nearest);

        if (moveAllowed) {
            for (let i = 0; i < neighbors.length; i++) {
                if (squares[neighbors[i]] == null) {
                    console.log("Found a match! Can move " + index + " to " + neighbors[i]);
                    squares[neighbors[i]] = squares[index];
                    squares[index] = null;
                    break;
                }
            }
        }

        this.setState({...this.state, squares: squares });
    }

    renderSquare(i, nearest) {
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
        isNearest={i === this.nearest}
        geoUser={this.props.geoUser}
        geoCenter={this.props.gameData.cells[i]}
        handleClick={() => this.handleClick(i)} 
        w = {width}
        h = {height}
        rows = {this.state.rows}
        cols = {this.state.cols}
        />;
    }

    updateNearest() {
        this.nearest = -1;
        var distanceList = [];
        if (this.props.hasLocation) {
            distanceList = this.props.gameData.cells.map(cell => geoDistance(this.props.geoUser, cell));
            this.nearest = this.minIndex(distanceList)[0];
        }
    }

    render() {
        this.updateNearest();
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

function DebugCoords(props) {
    return (
        <fieldset>
            <legend> Debug Coordinates </legend>
            <input value={props.coords[0] + ", " + props.coords[1]} onChange={props.onChange} style={{width: "100%"}}/>            
        </fieldset>
    )
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {hasLocation: false, 
            coords: [44, -63],
            serverData: {
            cells: [
                [44.662461, -63.603948, 0.075, 0.5],  //Agricola
                [44.664109, -63.601264, 0.075, 0.5],  //Novalea
                [44.666200, -63.600276, 0.075, 0.5],  //Stairs

                [44.659729, -63.602380, 0.075, 0.5],   //Rbboie
                [44.661985, -63.598293, 0.075, 0.5],   //home  
                [44.664368, -63.595637, 0.075, 0.5],   //Devonshire

                [44.657439, -63.598772, 0.075, 0.5],   //Robbie almon
                [44.659897, -63.595294, 0.075, 0.5],   //Gottigen almon 
                [44.662278, -63.591474, 0.075, 0.5]    //Barrington
             ]
        }};

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({...this.state, coords: [position.coords.latitude, position.coords.longitude], hasLocation: true});
            });
        } else {
            this.setState({...this.state, hasLocation: false});
        }

        this.debugChangeCoord = this.debugChangeCoord.bind(this);
    }

    debugChangeCoord(e) {
        console.log("Trying to change it...");
        let newCoords = this.state.coords.slice();
        newCoords = e.target.value.split(",").map(f => parseFloat(f));
        this.setState({...this.state, coords: newCoords});
    }

    render() {
        return (
            <div> 
                { DEBUG_POSITIONS ? <DebugCoords coords={this.state.coords} onChange={this.debugChangeCoord}/> : null }
                <Board gameData={this.state.serverData} geoUser={this.state.coords} hasLocation={this.state.hasLocation}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
