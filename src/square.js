import React from 'react';
import * as Geo from './geo.js';
import DEBUG from './debug.js';
export default Square;

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
    return <img src={props.img} alt="stub" style={{
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
        const dx = Geo.kmToLong(props.geoUser[0] - props.geoCenter[0], props.geoUser[1]);
        const dy = Geo.kmToLat(props.geoUser[1] - props.geoCenter[1]);
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
    const dist = Geo.distanceInKm(props.geoCenter, props.geoUser);
    const debugOverlay = DEBUG("CELL_OVERLAY")
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
