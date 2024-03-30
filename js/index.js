let currentMode;
let currentColor = '#000000'; 
let currentShapetype;
let selectedShape;
                                 
let mousePressed = false; 



/// for undo & redo 
let history = [];
let index = -1;




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
    currentMode = 'shape';
    currentShapetype = 'circle';
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
// fabric.Image.fromURL('https://wallpapers.com/images/high/red-raspberries-and-daisy-flower-roldn198zsn76ez3.jpg', (img) => {
//     canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
//         // Options to control the background image
//         scaleX: canvas.width / img.width,
//         scaleY: canvas.height / img.height
//     });
// });
// function drawGrid(gridSize) {
//     const gridLength = gridSize || 50; // Default grid size is 50px
//     const width = canvas.width;
//     const height = canvas.height;

//     for (var i = 0; i < (width / gridLength); i++) {
//         canvas.add(new fabric.Line([i * gridLength, 0, i * gridLength, height], {
//             stroke: '#ccc',
//             selectable: false
//         }));
//     }

//     for (var j = 0; j < (height / gridLength); j++) {
//         canvas.add(new fabric.Line([0, j * gridLength, width, j * gridLength], {
//             stroke: '#ccc',
//             selectable: false
//         }));
//     }
// }

function drawGrid(gridSize) {
    const gridLength = gridSize || 50;
    
    // Clear existing grid lines
    canvas.getObjects('line').forEach(function(line) {
        if (line.gridLine) canvas.remove(line);
    });

    const vpt = canvas.viewportTransform;
    const zoom = canvas.getZoom();
    const width = canvas.width / zoom;
    const height = canvas.height / zoom;
    const vptX = vpt[4] / zoom;
    const vptY = vpt[5] / zoom;

    for (var i = -Math.ceil(vptX / gridLength); i < (width / gridLength) - vptX / gridLength; i++) {
        canvas.add(new fabric.Line([i * gridLength, -height, i * gridLength, height], {
            stroke: '#ccc',
            selectable: false,
            gridLine: true // Custom property to indicate it's a grid line
        }));
    }

    for (var j = -Math.ceil(vptY / gridLength); j < (height / gridLength) - vptY / gridLength; j++) {
        canvas.add(new fabric.Line([-width, j * gridLength, width, j * gridLength], {
            stroke: '#ccc',
            selectable: false,
            gridLine: true
        }));
    }
}


let isGridVisible = false;

function toggleGrid() {
    // Remove existing grid lines
    console.log('is gird visible: ' + isGridVisible);
    canvas.getObjects('line').forEach(function(line) {
        canvas.remove(line);
    });

    // Draw grid if it's currently not visible
    if (!isGridVisible) {
        drawGrid();
        isGridVisible = true;
    } else {
        isGridVisible = false;
    }
    canvas.renderAll();
}

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
        if(currentMode === editorModes.pan) {
            
            canvas.setCursor('default');
            drawGrid();
            canvas.renderAll();
        } else if (currentMode === editorModes.shape) {
            currentMode = '';
        }
    });
};


document.getElementById('colorPicker').addEventListener('change', (event) => {
    currentColor = event.target.value;
    canvas.freeDrawingBrush.color = currentColor;
    console.log("set color" + canvas.freeDrawingBrush.color);
    canvas.renderAll();
});



let isUndoingRedoing = false;

function undo() {
    if (index <= 0) return;
    isUndoingRedoing = true;
    index--;
    var state = history[index];
    canvas.loadFromJSON(state, function() {
        canvas.renderAll();
        isUndoingRedoing = false;
    });
}

function redo() {
    if (index >= history.length - 2) return;
    isUndoingRedoing = true;
    index++;
    var state = history[index];
    canvas.loadFromJSON(state, function() {
        canvas.renderAll();
        isUndoingRedoing = false;
    });
}

function updateHistory() {
    if (isUndoingRedoing) return;
    history.push(canvas.toJSON(['selectable', 'evented'])); // Include necessary properties
    index = history.length - 1;
}

let clipboard = null;

function copy() {
    const activeObject = canvas.getActiveObject();

    if (activeObject) {
        // Clone the active object or group
        activeObject.clone(function(cloned) {
            clipboard = cloned;
        });
    }
}

function paste() {
    if (!clipboard) {
        return;
    }

    // Clone again the clipboard object
    clipboard.clone(function(clonedObj) {
        canvas.discardActiveObject();
        clonedObj.set({
            left: clonedObj.left + 10,
            top: clonedObj.top + 10,
            evented: true,
        });

        if (clonedObj.type === 'activeSelection') {
            clonedObj.canvas = canvas;
            clonedObj.forEachObject(function(obj) {
                canvas.add(obj);
            });
            clonedObj.setCoords();
        } else {
            canvas.add(clonedObj);
        }

        clipboard.top += 10;
        clipboard.left += 10;

        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
    });
}


canvas.on('object:added', updateHistory);
canvas.on('object:modified', updateHistory);
canvas.on('object:removed', updateHistory);

console.log("Canvas initialized:", canvas);

// Now, canvas.renderAll() is not strictly necessary since the 
// canvas is automatically rendered upon creation and any updates.
// mouse over 
// panning 
setPanEvents(canvas);
drawGrid();
 

// Key event listener for Ctrl+Z and Ctrl+Y (for redo)
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey || event.metaKey) {
        switch (event.key) {
            case 'z':
                undo();
                break;
            case 'y':
                redo();
                break;
        }
    }
});

document.addEventListener('keydown', function(e) {
    if (e.ctrlKey || e.metaKey) { // MetaKey is for macOS
        switch (e.key) {
            case 'c':
                copy();
                break;
            case 'v':
                paste();
                break;
        }
    }
});

function downloadJson() {
    const json =  JSON.stringify(canvas.toJSON());
    const filename = 'canvas-diagram.json';

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/json;charset=utf-8,' + encodeURIComponent(json));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}


function readFile(file) {
    const reader = new FileReader();

    reader.onload = function(e) {
        const contents = e.target.result;
        loadCanvasFromJson(contents);
    };

    reader.readAsText(file);
}

function loadCanvasFromJson(json) {
    canvas.loadFromJSON(json, function() {
        canvas.renderAll();

    });
}


document.getElementById('fileInput').addEventListener('change', function(e) {
    if (e.target.files.length === 0) {
        return; // No file selected
    }

    const file = e.target.files[0];
    if (file.type && file.type.indexOf('json') === -1) {
        return;
    }

    readFile(file);
});

document.getElementById('saveButton').addEventListener('click', downloadJson);
document.getElementById('grid').addEventListener('click', toggleGrid);



