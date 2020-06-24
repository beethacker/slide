import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as Geo from './geo.js';
import DEBUG from './debug.js'; 
import Square from './square.js';
import Solved from './solved.js';

let imgHome = "https://beethacker.github.io/slide/img/";
let jsonHome = "https://beethacker.github.io/slide/json/";

//Hack to make json files fetchable locally. Not sure how to set up node/webpack/whatever for this
//so I'll just make them available with a separate python server. 
if (DEBUG("LOCAL_SERVER")) {
    //NOTE! In order for fetch to work, we couldn't just say http://localhost:8000/json/
    //here. Instead, we had to set http://localhost as a proxy in package.json.
    //NOPE! Still can't get it to work? :( Just push stuff to github pages then.
    //Oh wait, maybe it WAS working, but I was just parsing json wrong????
    //jsonHome = "/json/";
    //imgHome = "/img/";
}

if (DEBUG("CLEAR_STATE")) {
    localStorage.clear();
}

class Board extends React.Component {
    constructor(props) {
        super(props);

        //Look for existing local storage...
        let savedState = localStorage[this.props.puzzleName];
        let puzzleState; 
        if (savedState) {
            puzzleState = savedState.split(",").map(n => Number(n));
        }
        else {
            //TODO support for larger puzzles!
            puzzleState = [0, 1, 2, 3, 4, 5, 6, 7, 8];
            this.scramble(puzzleState);
        }
        //TODO get this from local storage, or scramble a new one
        this.state = { squares: puzzleState, width: window.innerWidth, height: window.innerHeight };

        setInterval(() => {
            this.setState({width: window.innerWidth, height: window.innerHeight});
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
        const w = this.props.serverData.gridsize[0];
        const h = this.props.serverData.gridsize[1];
        const row = Math.floor(i / w);
        const size = w * h;

        //console.log(`i=${i}, w=${w}, row=${row}, size=${size}`);

        //Down one row
        if (i + w < size) {
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

    scramble(puzzle) {
        for (let iterations = 0; iterations < 50; iterations++) {
            console.log(puzzle);
            const zeroIndex = puzzle.indexOf(0);
            const neighborIndices = this.neighborsOf(zeroIndex);
            const randomNeighbor = neighborIndices[Math.floor(Math.random()*neighborIndices.length)];
            puzzle[zeroIndex] = puzzle[randomNeighbor];
            puzzle[randomNeighbor] = 0;
        }
        localStorage[this.props.puzzleName] = puzzle;
    }
    
    handleClick(index) {
        this.updateNearest();
        const squares = this.state.squares.slice();

        let neighbors = this.neighborsOf(index);

        //check if move is allowed!! This cell must be the cell that's closest AND we
        //need to to be closer than 
        const moveAllowed = ((index === this.nearest[0])  && (this.nearest[1] < this.props.serverData.cells[index][2]))
                            || DEBUG("DISABLE_MOVE_CHECK");

        if (moveAllowed) {
            for (let i = 0; i < neighbors.length; i++) {
                if (squares[neighbors[i]] === 0) {
                    squares[neighbors[i]] = squares[index];
                    squares[index] = 0;
                    break;
                }
            }
        }
        else if (neighbors.map(n => squares[n]).includes(0)) {
            if (index === this.nearest[0]) {
                alert("You're not close enough to the center of this square!");
            }
            else {
                alert("Can't move this square! You'll have to walk to it first!");
            }
        }

        localStorage[this.props.puzzleName] = squares;
        this.setState({squares: squares });
    }

    renderSquare(i) {
        const imSize = this.props.serverData.imgsize;    
        const gridSize = this.props.serverData.gridsize;    
        const aspect = imSize[0] / imSize[1];
        let width = 0.8*(window.innerWidth) / gridSize[0];
        let height = 0.8*(window.innerHeight) / gridSize[1];
        if (width / height > aspect) {
            width = height * aspect;
        }
        else {
            height = width / aspect;
        }
        return <Square
        img={imgHome + this.props.serverData.img}
        value={this.state.squares[i]} 
        isNearest={i === this.nearest[0]}
        geoUser={this.props.geoUser}
        geoCenter={this.props.serverData.cells[i]}
        handleClick={() => this.handleClick(i)} 
        w = {width}
        h = {height}
        rows = {this.props.serverData.gridsize[0]}
        cols = {this.props.serverData.gridsize[1]}
        />;
    }

    updateNearest() {
        this.nearest = [-1, 9993];
        var distanceList = [];
        if (this.props.hasLocation) {
            distanceList = this.props.serverData.cells.map(cell => Geo.distanceInKm(this.props.geoUser, cell));
            this.nearest = this.minIndex(distanceList);
        }
    }

    isSolved() {
        if (DEBUG("SHOW_SOLVED")) {
            return true;
        }
        let squares = this.state.squares;
        for (let i = 0; i < squares.length - 1; i++) {
            if (squares[i] > squares[i+1]) {
                return false;
            }
        }
        return true;
    }

    render() {
        this.updateNearest();
        if (this.isSolved()) {
            return (
                 <Solved 
                    imgSrc={imgHome + this.props.serverData.img}
                    serverData={this.props.serverData}
                    scrambleFn={() => this.scramble}/>
            );
        }
        else {
            return (
                <center>
                    <h1> GPS Slide Puzzle! </h1>
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
}

function DebugCoords(props) {
    return (
        <fieldset>
            <legend> Debug Coordinates </legend>
            <input value={props.coords[0] + ", " + props.coords[1]} onChange={props.onChange} style={{width: "100%"}}/>            
        </fieldset>
    )
}

function extractPuzzleName(txt) {
    let puzzle = txt;
    if (puzzle.startsWith("/")) {
        puzzle = puzzle.slice(1);
    }
    if (puzzle.startsWith("slide")) {
        puzzle = puzzle.slice(5);

    }
    if (puzzle.startsWith("/")) {
        puzzle = puzzle.slice(1);
    }
    return puzzle;
}

class Game extends React.Component {
    constructor(props) {    
        super(props);

        let puzzle = extractPuzzleName(window.location.pathname);
        if (puzzle.length <= 0 && "404_hack" in localStorage) {
            puzzle = extractPuzzleName(localStorage["404_hack"]);
            localStorage.removeItem("404_hack");
        }
        if (puzzle.length <= 0 && "LAST_PUZZLE" in localStorage) {
            puzzle = localStorage["LAST_PUZZLE"];
        }
        localStorage["LAST_PUZZLE"] = puzzle;

        this.state = {hasLocation: false, 
            coords: [44, -63],
            serverData: null,
            puzzle: puzzle
        };

        if (puzzle.length > 0) {
            const json = jsonHome + puzzle + ".json";
            fetch(json)
            .then( response => response.json())
            .then( data => this.setState({ serverData : data }))        
            .catch( (err) => this.setState({ fetchError: "Failed to fetch: " + json }));
        }
        else {
            this.setState({fetchError: "!Main Page!"});
        }

        /*
        this.updateGeoLocation();
        setInterval(() => {
            this.updateGeoLocation();
        }, 15*1000);
        */
        /*let handle = */navigator.geolocation.watchPosition( position => {
            this.setState({ geoError: null, coords: [position.coords.latitude, position.coords.longitude], hasLocation: true});
        },
        err => {
            this.setState({ geoError: "Can't get GPS location" });
        });

        this.debugChangeCoord = this.debugChangeCoord.bind(this);
    }

    updateGeoLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.setState({ coords: [position.coords.latitude, position.coords.longitude], hasLocation: true });
            });
        } else {
            this.setState({ hasLocation: false });
        }
    }

    debugChangeCoord(e) {
        const newCoords = e.target.value.split(",").map(f => parseFloat(f));
        this.setState({ coords: newCoords });
    }

    render() {
        if (this.state.fetchError) {
            return <div> {this.state.fetchError} </div>;
        }
        if (this.state.serverData === null) {
            return <div> Loading...</div>;
        }
        return (
            <div> 
                { DEBUG("SET_GPS") ? <DebugCoords coords={this.state.coords} onChange={this.debugChangeCoord}/> : null }
                <Board puzzleName={this.state.puzzle} serverData={this.state.serverData} geoUser={this.state.coords} hasLocation={this.state.hasLocation}/>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
