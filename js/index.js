let currentMode;
let currentColor = '#000000'; 
let currentShapetype;
let selectedShape;
                                 
let mousePressed = false; 

let startPoints = {
    x: 1,
    y: 1,
};

const editorModes = {
    pan: 'pan',
    sketch: 'sketch',
    shape: 'shape'
}
const shape = {
    circle: 'circle',
    rectangle: 'rectangle',
    square: 'square',
    line: 'line',
    triangle: 'triangle', 
    ellipse: 'ellipse',
    curve: 'curve',
    poly_line: 'poly_line',
    polygon: 'polygon',
};

const initCanvas = (id) => {
    return new fabric.Canvas('canvas', {
        width: 1000,
        height: 600,
        backgroundColor: 'grey'
    });
}

const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((element) => {
        if(element !== canvas.backgroundImage) {
            canvas.remove(element);
        }
    });
};

const createRect = (canvas) => {
    currentMode = editorModes.shape;
    currentShapetype = shape.rectangle;
    // console.log("rect");
    // const canvCenter = canvas.getCenter();
    // const rect = new fabric.Rect({
    //     width: 200,
    //     height: 100,
    //     fill: currentColor,
    //     left: canvCenter.left,
    //     top: canvCenter.top,
    //     originX: 'center',
    //     originY: 'center',
    //     cornerColor: '#007FFF',
    // });
    // canvas.add(rect);
    // canvas.renderAll();
}

const createCirc = (canvas) => {
    console.log("circ");
    // const canvCenter = canvas.getCenter();
    // const circ = new fabric.Circle({
    //     radius: 100,
    //     fill: currentColor,
    //     left: canvCenter.left,
    //     top: canvCenter.top,
    //     originX: 'center',
    //     originY: 'center',
    //     cornerColor: '#007FFF',
    // });
    // canvas.add(circ);
    // canvas.renderAll();
    currentMode = 'shape';
    currentShapetype = 'circle';
}

const setLine = (canvas) => {
    console.log("line");
    currentMode = 'shape';
    currentShapetype = 'line';
    // let line;
    // canvas.on('mouse:down', (event) => {
        
    // });
    // canvas.on('mouse:move', (event) => {
    //     let pointer = canvas.getPointer(event.e);
    //     line.set({
    //         x2: pointer.x,
    //         y2: pointer.y
    //     });
    //     canvas.renderAll();
    // });

    

    // canvas.on('mouse:up', (event) => {
        
    // });    
    // const line = new fabric.Line([50, 100, 200, 200],{
    //     fill:  currentColor,
    //     stroke: currentColor,
    //     strokeWidth: 2,
    //     left: canvCenter.left,
    //     top: canvCenter.top,
    //     originX: 'center',
    //     originY: 'center',
    //     cornerColor: '#007FFF',
    // });
    // canvas.add(line);
    // canvas.renderAll();
}

const createPoly = (canvas) => {
    
    currentMode = editorModes.shape;
    currentShapetype = shape.polygon;
    // console.log("line");
    // const canvCenter = canvas.getCenter();
    
    // const poly = new fabric.Polygon([ 
    //     { x: 200, y: 10 }, 
    //     { x: 250, y: 50 }, 
    //     { x: 250, y: 180}, 
    //     { x: 150, y: 180}, 
    //     { x: 150, y: 50 }],{
    //     fill:  currentColor,
    //     left: canvCenter.left,
    //     top: canvCenter.top,
    //     originX: 'center',
    //     originY: 'center',
    //     cornerColor: '#007FFF',
    // });
    // canvas.add(poly);
    // canvas.renderAll();
}

const setTriangle = (canvas) => {
    currentMode = editorModes.shape;
    currentShapetype = shape.triangle;
}

const createSquare = (canvas) => {
    console.log("square");
    currentMode = editorModes.shape;
    currentShapetype = shape.square;
    // const canvCenter = canvas.getCenter();
    // const square = new fabric.Rect({
    //     width: 100,
    //     height: 100,
    //     fill: currentColor,
    //     left: canvCenter.left,
    //     top: canvCenter.top,
    //     originX: 'center',
    //     originY: 'center',
    //     cornerColor: '#007FFF',

    // });
    // canvas.add(square);
    // canvas.renderAll();
}



const canvas = initCanvas('canvas');
fabric.Image.fromURL('https://wallpapers.com/images/high/red-raspberries-and-daisy-flower-roldn198zsn76ez3.jpg', (img) => {
    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
        // Options to control the background image
        scaleX: canvas.width / img.width,
        scaleY: canvas.height / img.height
    });
});

const toggleMode = (mode) => {
    if(mode === editorModes.pan) {
        if(currentMode === editorModes.pan) {
            currentMode = ' ';
        } else {
            currentMode = editorModes.pan;

            // turn off draw mode 
            canvas.isDrawingMode = false;
            canvas.renderAll();
        }
    } else if (mode === editorModes.sketch) {
        if(currentMode === editorModes.sketch) {
            currentMode = '';

            // turn off draw when toggle draw is selected
            canvas.isDrawingMode = false;
            canvas.renderAll();
        } else {
            // canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
            canvas.freeDrawingBrush.color = currentColor;
            console.log(currentColor);
            // canvas.freeDrawingBrush.width = 15;
            // toggle draw on and intiate drawing
            currentMode = editorModes.sketch;
            canvas.isDrawingMode = true;
            canvas.renderAll();
        }
    } else if (mode === editorModes.shape) {
        if(currentMode === editorModes.shape) {
            currentMode = '';
            currentShapetype = '';
        }
    }
    console.log(mode);
};

const setPanEvents = (canvas) => {
    canvas.on('mouse:move', (event) => {
        if(mousePressed && currentMode === 'pan') {
            // for panning
            canvas.setCursor('grab');
            canvas.renderAll();
            console.log("Mouse: " + event);
            const moveEvent = event.e;
            const delta = new fabric.Point(moveEvent.movementX, moveEvent.movementY);
            canvas.relativePan(delta);
        
        } else if (mousePressed && currentMode === editorModes.sketch) {
            // for sketch
            canvas.isDrawingMode = true;
            canvas.renderAll();
        
        } else if (mousePressed && currentMode === 'shape') {
            // for shapes
            // line
            if(currentShapetype === shape.line) {
                let pointer = canvas.getPointer(event.e);
                selectedShape.set({
                    x2: pointer.x,
                    y2: pointer.y
                });
                canvas.renderAll();

            } // rect 
            else if (currentShapetype === shape.rectangle) {
                let pointer = canvas.getPointer(event.e);
                console.log(selectedShape);
                if(startPoints.x > pointer.x){
                    selectedShape.set({ left: Math.abs(pointer.x) });
                }
                if( startPoints.y > pointer.y){
                    selectedShape.set({ top: Math.abs(pointer.y) });
                }
            
                selectedShape.set({ width: Math.abs(startPoints.x - pointer.x) });
                selectedShape.set({ height: Math.abs(startPoints.y - pointer.y) });
                canvas.renderAll();
            } // circ 
            else if (currentShapetype === shape.circle) {
                let pointer = canvas.getPointer(event.e);
                let radius = Math.sqrt(Math.pow(pointer.x - startPoints.x, 2) + Math.pow(pointer.y - startPoints.y, 2));
                
                selectedShape.set({ radius: radius });
                canvas.renderAll();
            } // square 
            else if (currentShapetype === shape.square) {
                let pointer = canvas.getPointer(event.e);
                let size = Math.max(Math.abs(pointer.x - startPoints.x), Math.abs(pointer.y - startPoints.y));
        
                selectedShape.set({ width: size, height: size });
                canvas.renderAll();
            } // polygon 
            else if (currentShapetype === shape.polygon) {
                let pointer = canvas.getPointer(event.e);
               
                let vertices = [
                    { x: startPoints.x, y: startPoints.y },
                    { x: pointer.x, y: startPoints.y },
                    { x: pointer.x, y: pointer.y },
                    { x: startPoints.x - (pointer.x - startPoints.x), y: pointer.y },
                    { x: startPoints.x - (pointer.x - startPoints.x), y: startPoints.y }
                ];
            
                selectedShape.set({ points: vertices });
                canvas.renderAll();
            } // triangle 
            else if (currentShapetype === shape.triangle) {
                let pointer = canvas.getPointer(event.e);
                let width = Math.abs(pointer.x - startPoints.x);
                let height = Math.abs(pointer.y - startPoints.y);

                selectedShape.set({ width: width, height: height });
                canvas.renderAll();
            }
        }
    });

    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        
        if(currentMode === editorModes.pan) { 
            canvas.setCursor('grab');
            canvas.renderAll();
        } else if (currentMode === editorModes.shape) {
            // for line
            if(currentShapetype === shape.line) {
                
                let pointer = canvas.getPointer(event.e);
                selectedShape = new fabric.Line([pointer.x, pointer.y, pointer.x, pointer.y],{
                    fill:  currentColor,
                    stroke: currentColor,});
                    
                canvas.add(selectedShape);
                canvas.renderAll();

            } // rect 
            else if (currentShapetype === shape.rectangle) {
                console.log('rect');
                let pointer = canvas.getPointer(event.e);
                startPoints = { x: pointer.x, y: pointer.y };
                pointer = canvas.getPointer(event.e);
                selectedShape  = new fabric.Rect({
                    left: startPoints.x,
                    top: startPoints.y,
                    originX: 'left',
                    originY: 'top',
                    width: pointer.x - startPoints.x,
                    height: pointer.y - startPoints.y,
                    fill:  currentColor,
                    angle: 0,
                    cornerColor: '#007FFF'});
                    
                canvas.add(selectedShape);
                canvas.renderAll();
            } // cirlce 
            else if (currentShapetype === shape.circle){
                
                let pointer = canvas.getPointer(event.e);
                startPoints = { x: pointer.x, y: pointer.y };
                selectedShape = new fabric.Circle({
                    left: startPoints.x,
                    top: startPoints.y,
                    originX: 'center',
                    originY: 'center',
                    radius: 1, // Small initial radius
                    fill: currentColor,
                    cornerColor: '#007FFF'
                });
                canvas.add(selectedShape);
            } // square 
            else if (currentShapetype === shape.square) {
                let pointer = canvas.getPointer(event.e);
                startPoints = { x: pointer.x, y: pointer.y };
                selectedShape = new fabric.Rect({
                    left: startPoints.x,
                    top: startPoints.y,
                    originX: 'left',
                    originY: 'top',
                    width: 1, // Small initial size
                    height: 1,
                    fill: currentColor,
                    cornerColor: '#007FFF'
                });
                canvas.add(selectedShape);
            }// polygon 
            else if (currentShapetype === shape.polygon) {
                let pointer = canvas.getPointer(event.e);
                startPoints = { x: pointer.x, y: pointer.y };
                selectedShape = new fabric.Polygon([{ x: pointer.x, y: pointer.y }, 
                        { x: pointer.x, y: pointer.y }, 
                        { x: pointer.x, y: pointer.y}, 
                        { x: pointer.x, y: pointer.y}, 
                        { x: pointer.x, y: pointer.y}], {
                    fill: currentColor,
                    selectable: false,
                    originX: 'center',
                    originY: 'center'
                });
                canvas.add(selectedShape);
            } // triangle
            else if (currentShapetype === shape.triangle) {
                let pointer = canvas.getPointer(event.e);
                startPoints = { x: pointer.x, y: pointer.y };
                selectedShape = new fabric.Triangle({
                    left: pointer.x,
                    top: pointer.y,
                    originX: 'left',
                    originY: 'top',
                    width: 1, // Small initial size
                    height: 1,
                    fill: currentColor,
                    cornerColor: '#007FFF'
                });
                canvas.add(selectedShape);
            }
        } 
    });

    canvas.on('mouse:up', (event) => {
        mousePressed = false;
        if(currentMode === 'pan') {
            
            canvas.setCursor('default');
            canvas.renderAll();
        }
    });
};


document.getElementById('colorPicker').addEventListener('change', (event) => {
    currentColor = event.target.value;
    canvas.freeDrawingBrush.color = currentColor;
    console.log("set color" + canvas.freeDrawingBrush.color);
    canvas.renderAll();
});

    
console.log("Canvas initialized:", canvas);

// Now, canvas.renderAll() is not strictly necessary since the 
// canvas is automatically rendered upon creation and any updates.
// mouse over 
// panning 
setPanEvents(canvas);
    


