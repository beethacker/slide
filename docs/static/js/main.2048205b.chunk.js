(this["webpackJsonpreact-slide"]=this["webpackJsonpreact-slide"]||[]).push([[0],{14:function(e,t,a){},15:function(e,t,a){"use strict";a.r(t);var r=a(1),n=a(5),s=a(2),i=a(3),o=a(6),l=a(4),c=a(0),u=a.n(c),h=a(8),d=a.n(h);a(14);function g(e,t){if("undefined"===typeof e||"undefined"===typeof t)return null;var a=m(e[1]-t[1]),r=f(e[0]-t[0],e[1]);return Math.sqrt(a*a+r*r)}function m(e){return 110.574*Math.abs(e)}function f(e,t){var a=t*Math.PI/180;return 111.32*Math.abs(e)*Math.cos(a)}var v=function(e){return p[e]},p={SET_GPS:!0,CELL_OVERAL:!1,DISABLE_MOVE_CHECK:!1,LOCAL_SERVER:!0};var E=function(e){var t=e.value,a=!1,r=e.isNearest,n=r?"square selected":"square",s=null;if(r){var i,o,l=.5*e.w,c=.5*e.h,h=f(e.geoUser[0]-e.geoCenter[0],e.geoUser[1]),d=m(e.geoUser[1]-e.geoCenter[1]),p=Math.sqrt(h*h+d*d),E=0,b=0;p>1e-4&&(E=h/p,b=d/p);var S,y=e.geoCenter[2];if(p<y)S=p/y*30,a=!0;else{var k=e.geoCenter[3];p=Math.min(p,k),S=(p-y)/(k-y)*(e.h/2-30)+30}i=l+S*E,o=c+S*b,s=u.a.createElement(u.a.Fragment,null,u.a.createElement("div",{className:"circle"}),u.a.createElement(w,{className:"user-circle",x:i,y:o,active:a,inCell:r}),u.a.createElement(w,{className:"center-circle",x:l,y:c,active:a,inCell:r}))}if(!t)return u.a.createElement("td",{className:"square empty",style:{width:e.w,height:e.h}},s);var q=t%e.rows,L=Math.floor(t/e.rows),O=g(e.geoCenter,e.geoUser),N=v("CELL_OVERLAY")?u.a.createElement("span",{style:{position:"absolute",color:"white",backgroundColor:"black"}}," ",e.geoCenter.toString()+" ==> "+O+", in="+r," "):null;return u.a.createElement("td",{className:n,onClick:function(){return e.handleClick()},style:{width:e.w,height:e.h}},N,s,u.a.createElement(C,{img:e.img,w:e.cols*e.w,h:e.rows*e.h,sx:q*e.w,sy:L*e.h,inCell:r}))};function w(e){if(!e.inCell)return u.a.createElement(u.a.Fragment,null);var t,a,r=e.className;return e.active&&(r+=" active"),u.a.createElement("div",{className:r,style:(t=e.x,a=e.y,{transform:"translate(".concat(t,"px, ").concat(a,"px)")})})}function C(e){return u.a.createElement("img",{src:e.img,alt:"stub",style:{marginTop:-e.sy+"px",width:e.w+"px",height:e.h+"px",marginLeft:-e.sx+"px"}})}v("LOCAL_SERVER");var b=function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(e){var r;Object(s.a)(this,a);return(r=t.call(this,e)).state={squares:[1,null,2,3,4,5,6,7,8],cols:3,rows:3,width:window.innerWidth,height:window.innerHeight},setInterval((function(){r.setState({width:window.innerWidth,height:window.innerHeight})}),2e3),setInterval((function(){}),2e3),r}return Object(i.a)(a,[{key:"minIndex",value:function(e){for(var t=-1,a=999999,r=0;r<e.length;r++)e[r]<a&&(t=r,a=e[r]);return[t,a]}},{key:"findNearest",value:function(e,t){for(var a=-1,r=9999999999,n=0;n<t.length;n++){var s=this.geoDistance(e,t[n]);s<r&&(r=s,a=n)}return a}},{key:"neighborsOf",value:function(e){var t=[],a=this.state.rows,r=Math.floor(e/this.state.rows);return console.log("w  and len"+[a,this.state.squares.length]),e+a<this.state.squares.length&&t.push(e+a),e-a>=0&&t.push(e-a),Math.floor((e+1)/a)===r&&t.push(e+1),e>0&&Math.floor((e-1)/a)===r&&t.push(e-1),t}},{key:"handleClick",value:function(e){this.updateNearest();var t=this.state.squares.slice(),a=this.neighborsOf(e);if(v("DISABLE_MOVE_CHECK")||e===this.nearest)for(var r=0;r<a.length;r++)if(null==t[a[r]]){console.log("Found a match! Can move "+e+" to "+a[r]),t[a[r]]=t[e],t[e]=null;break}this.setState(Object(n.a)(Object(n.a)({},this.state),{},{squares:t}))}},{key:"renderSquare",value:function(e,t){var a=this,r=.9*window.innerWidth/3,n=.9*window.innerHeight/3;return r/n>4/3?r=n*(4/3):n=r/(4/3),u.a.createElement(E,{img:"https://beethacker.github.io/slidepuzzle/img/"+this.props.gameData.img,value:this.state.squares[e],isNearest:e===this.nearest,geoUser:this.props.geoUser,geoCenter:this.props.gameData.cells[e],handleClick:function(){return a.handleClick(e)},w:r,h:n,rows:this.state.rows,cols:this.state.cols})}},{key:"updateNearest",value:function(){var e=this;this.nearest=-1;var t=[];this.props.hasLocation&&(t=this.props.gameData.cells.map((function(t){return g(e.props.geoUser,t)})),this.nearest=this.minIndex(t)[0])}},{key:"render",value:function(){return this.updateNearest(),u.a.createElement("center",null,u.a.createElement("table",{className:"grid"},u.a.createElement("tr",{className:"board-row"},this.renderSquare(0),this.renderSquare(1),this.renderSquare(2)),u.a.createElement("tr",{className:"board-row"},this.renderSquare(3),this.renderSquare(4),this.renderSquare(5)),u.a.createElement("tr",{className:"board-row"},this.renderSquare(6),this.renderSquare(7),this.renderSquare(8))))}}]),a}(u.a.Component);function S(e){return u.a.createElement("fieldset",null,u.a.createElement("legend",null," Debug Coordinates "),u.a.createElement("input",{value:e.coords[0]+", "+e.coords[1],onChange:e.onChange,style:{width:"100%"}}))}var y=function(e){Object(o.a)(a,e);var t=Object(l.a)(a);function a(e){var n;Object(s.a)(this,a),n=t.call(this,e);var i=window.location.pathname.substr(1);if(n.state={hasLocation:!1,coords:[44,-63],serverData:null,puzzle:i},i.length>0){var o="https://beethacker.github.io/slidepuzzle/json/"+i+".json";fetch(o).then((function(e){return e.json()})).then((function(e){return n.setState({serverData:e})})).catch((function(e){return n.setState({fetchError:"Failed to fetch: "+o})}))}return navigator.geolocation?navigator.geolocation.getCurrentPosition((function(e){n.setState({coords:[e.coords.latitude,e.coords.longitude],hasLocation:!0})})):n.setState({hasLocation:!1}),n.debugChangeCoord=n.debugChangeCoord.bind(Object(r.a)(n)),n}return Object(i.a)(a,[{key:"debugChangeCoord",value:function(e){var t=e.target.value.split(",").map((function(e){return parseFloat(e)}));this.setState({coords:t})}},{key:"render",value:function(){return this.state.fetchError?u.a.createElement("div",null," ",this.state.fetchError," "):null===this.state.serverData?u.a.createElement("div",null," Loading..."):u.a.createElement("div",null,v("SET_GPS")?u.a.createElement(S,{coords:this.state.coords,onChange:this.debugChangeCoord}):null,u.a.createElement(b,{gameData:this.state.serverData,geoUser:this.state.coords,hasLocation:this.state.hasLocation}))}}]),a}(u.a.Component);d.a.render(u.a.createElement(y,null),document.getElementById("root"))},9:function(e,t,a){e.exports=a(15)}},[[9,1,2]]]);
//# sourceMappingURL=main.2048205b.chunk.js.map