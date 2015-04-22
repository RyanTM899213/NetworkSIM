/****
 * -------------------
 * Shape Classes
 * -------------------
 ****/

/****
 * Circle object to be rendered by SVG.
 * @param svgCanvas: the canvas to paint this object on
 * @param elementClass: The class of the circle object to be created, used to attach CSS.
 ****/
function circle(centerX, centerY, radius, svgCanvas, elementClass){
	this.x=centerX;
	this.y=centerY;
	this.r=radius;
	this.stroke=1;
	this.name="";
	//this contains the object (network or device) that the graphic represents.
	this.represents={};


	//whether the name of the device is visible
	this.nameVisible=false;
	
	this.element = document.createElementNS(svgNS, 'circle');
	//unique identifier for this line
	this.element.setAttribute('data-index', uniqueDataIndex);
	this.element.setAttribute('class', elementClass);
	this.children=[];
	this.connections=[];
	
	//displays the name of the network/device
	this.displayName = document.createElementNS(svgNS, "text");
	this.displayName.setAttribute("class", 'name-text');
	this.displayName.setAttribute("font-size","14");
	this.displayName.setAttribute("text-anchor", "middle");
	this.draw();
	svgCanvas.appendChild(this.element);
	svgCanvas.appendChild(this.displayName);
}
/**
 * Draw function for the circle element to draw it onto the svg canvas
 */
circle.prototype.draw=function(){
	//sets the attributes for the location of the svg circle
	this.element.setAttribute('cx', this.x); 
	this.element.setAttribute('cy', this.y);
	this.element.setAttribute('r', this.r);
	this.element.setAttribute('stroke', this.stroke);
	//sets the location at which to display the name of the shape when hovered over
	this.displayName.setAttribute("x", this.x);
	this.displayName.setAttribute("y", this.y - this.r-2);
	//if the name should be displayed, display it
	if(this.nameVisible==true){
		this.displayName.textContent=this.name;
	}
	//othewise do not display it
	else{
		this.displayName.textContent="";
	}
	//order the elements of the canvas so that the correct objects are on top
	orderCanvas();
}

/****
 * Line object to be rendered by SVG.
 * @param svgCanvas: the canvas to paint this object on
 * @param elementClass: The class of the line object to be created, used to attach CSS.
 ****/
function line(x1, y1, x2, y2, svgCanvas, elementClass){
	this.x1=x1;
	this.x2=x2;
	this.y1=y1;
	this.y2=y2;
	this.stroke=4;
	
	this.element = document.createElementNS(svgNS, 'line');
	//unique identifier for this line
	this.element.setAttribute('data-index', uniqueDataIndex);
	this.element.setAttribute('class', elementClass);
	
	this.draw();
	svgCanvas.appendChild(this.element);
}
/**
 * Function to draw the line to the svg vanvas
 */
line.prototype.draw=function(){
	this.element.setAttribute('x1', this.x1);
	this.element.setAttribute('x2', this.x2);
	this.element.setAttribute('y1', this.y1);
	this.element.setAttribute('y2', this.y2);
	//width of the line
	this.element.setAttribute('stroke-width', this.stroke);
	//orders the canvas to ensure correct order of shapes
	orderCanvas();
}
/**
 * Update function to update the lines position
 */
line.prototype.update=function(x1,y1,x2,y2){
	this.x1=x1;
	this.y1=y1;
	this.x2=x2;
	this.y2=y2;
}