import React from 'react';
export default Solved;

function Solved(props) {
    const imSize = props.serverData.imgsize;
    const aspect = imSize[0] / imSize[1];
    let width = 0.8 * (window.innerWidth);
    let height = 0.8 * (window.innerHeight);
    if (width / height > aspect) {
        width = height * aspect;
    }
    else {
        height = width / aspect;
    }
    return (
        <center>
            <h1 className="party"> PUZZLE SOLVED! </h1>
            <p> {props.serverData.solveTxt} </p>
            <p> <a href={props.serverData.solveLink}>{props.serverData.solveLink}</a> </p>
            <img
                alt="SOLVED"
                src={props.imgSrc}
                width={width}
                height={height}
            />
            <div>
                <button
                    className="btn"
                    onClick={() => alert("TODO scramble")}>Scramble</button>
            </div>
        </center>
    );

}
