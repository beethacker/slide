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
    let link = props.serverData.solveLink;
    let linkTxt = props.serverData.solveLinkTxt;

    let linkTags = <></>;
    if (link && linkTxt) {
        linkTags = <p> <a href={link}>{linkTxt}</a> </p>;
    }

    return (
        <center>
            <h1 className="party"> {props.serverData.solveTxt} </h1>
            { linkTags }
            <img
                alt="SOLVED"
                src={props.imgSrc}
                width={width}
                height={height}
            />
            <div>
                <button
                    className="btn"
                    onClick={() => props.scrambleFn()}>Scramble</button>
            </div>
        </center>
    );

}
