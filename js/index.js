let currentMode;
let currentColor = '#000000'; 
let currentShapetype;
let selectedShape;
                                 
let mousePressed = false; 


/// for undo & redo 
let history = [];
let index = -1;

let isGridVisible = true;


let startPoints = {
    x: 1,
    y: 1,
};

const editorModes = {
    pan: 'pan',
    sketch: 'sketch',
    shape: 'shape',
    snapToGrid: 'snapToGrid',
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
    const canvas = new fabric.Canvas('canvas', {
        width: 1000,
        height: 600,
        backgroundColor: 'grey'
    });

    // Scale down the canvas to increase the drawable area
    var scaleFactor = 2; // Example scale factor (50%)
    canvas.setZoom(scaleFactor);

    // Optional: Set up panning (or other navigation controls)
    // This depends on how you want to allow users to navigate the larger area

    return canvas;
}

const clearCanvas = (canvas) => {
    canvas.getObjects().forEach((element) => {
        if(element !== canvas.backgroundImage) {
            canvas.remove(element);
        }
    });
    isGridVisible = false;
};

const createPolyLine = (canvas) => {
    console.log("poly_line");
    currentMode = editorModes.shape;
    currentShapetype = shape.poly_line;
}

const createCurve = (canvas) => {
    console.log('curve')
    currentMode = editorModes.shape;
    currentShapetype = shape.curve;
}

const setEllipse = (canvas) => {
    currentMode = editorModes.shape;
    currentShapetype = shape.ellipse;
}

const createRect = (canvas) => {
    currentMode = editorModes.shape;
    currentShapetype = shape.rectangle;
}

const createCirc = (canvas) => {
    console.log("circ");
    currentMode = 'shape';
    currentShapetype = 'circle';

}

const setLine = (canvas) => {
    console.log("line");
    currentMode = 'shape';
    currentShapetype = 'line';
}


const createPoly = (canvas) => {
    
    currentMode = editorModes.shape;
    currentShapetype = shape.polygon;

}

const setTriangle = (canvas) => {
    currentMode = editorModes.shape;
    currentShapetype = shape.triangle;
}

const createSquare = (canvas) => {
    console.log("square");
    currentMode = editorModes.shape;
    currentShapetype = shape.square;
}



const canvas = initCanvas('canvas');

function drawGrid(gridSize) {
    const gridLength = gridSize || 25;
    canvas.getObjects('line').forEach(line => {
        if (line.gridLine) canvas.remove(line);
    });

    const zoom = canvas.getZoom();
    const vpt = canvas.viewportTransform;
    const width = canvas.getWidth();
    const height = canvas.getHeight();

    const offsetX = -vpt[4] / zoom; // Correct for negative offsets
    const offsetY = -vpt[5] / zoom;

    // Number of grid lines needed in each direction
    const numLinesX = Math.ceil(width / gridLength) + Math.ceil(Math.abs(offsetX) / gridLength);
    const numLinesY = Math.ceil(height / gridLength) + Math.ceil(Math.abs(offsetY) / gridLength);

    // Start drawing from the furthest negative offset
    const startX = Math.floor(offsetX / gridLength) * gridLength;
    const startY = Math.floor(offsetY / gridLength) * gridLength;

    // Draw vertical lines
    for (let i = 0; i <= numLinesX; i++) {
        canvas.add(new fabric.Line([startX + i * gridLength, -height, startX + i * gridLength, 2 * height], {
            stroke: '#ccc',
            selectable: false,
            evented: false,
            gridLine: true
        }));
    }

    // Draw horizontal lines
    for (let j = 0; j <= numLinesY; j++) {
        canvas.add(new fabric.Line([-width, startY + j * gridLength, 2 * width, startY + j * gridLength], {
            stroke: '#ccc',
            selectable: false,
            evented: false,
            gridLine: true
        }));
    }

    canvas.getObjects('line').forEach(line => {
        if (line.gridLine) {
            canvas.sendToBack(line);
        }
    });
    canvas.renderAll();
}






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
    } else if (mode === editorModes.snapToGrid) {
        if(currentMode === editorModes.snapToGrid) {
            currentMode = '';
            canvas.off('object:rotating');
            canvas.off('object:scaling');
            canvas.off('object:moving');
        } else {
            currentMode = editorModes.snapToGrid;
        }
    }
    console.log(mode);
};

// Predefined radius for the pentagon
const predefinedRadius = 50; // Adjust this value as needed

// Utility function to create pentagon points
function createPentagonPoints(center, radius) {
    let points = [];
    for (let i = 0; i < 5; i++) {
        const angle = 2 * Math.PI / 5 * i - Math.PI / 2; // Adjust to start from the top
        const x = center.x + radius * Math.cos(angle);
        const y = center.y + radius * Math.sin(angle);
        points.push({ x: x, y: y });
    }
    return points;
}

var curvePoints = {
    startPoint: null,
    controlPoint: null,
    endPoint: null
};
var drawingCurveState = 0;

const drawCurve = (canvas, start, control, end) => {
    const path = new fabric.Path(`M ${start.x} ${start.y} Q ${control.x} ${control.y}, ${end.x} ${end.y}`, {
        fill: 'transparent',
        stroke: currentColor,
        strokeWidth: 2,
    });
    canvas.add(path);
    canvas.renderAll();
};

const setPanEvents = (canvas) => {
    canvas.on('mouse:move', (event) => {
        if(mousePressed && currentMode === editorModes.pan) {
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
            } // triangle 
            else if (currentShapetype === shape.triangle) {
                let pointer = canvas.getPointer(event.e);
                let width = Math.abs(pointer.x - startPoints.x);
                let height = Math.abs(pointer.y - startPoints.y);

                selectedShape.set({ width: width, height: height });
                canvas.renderAll();
            } else if (mousePressed && currentShapetype === shape.ellipse) {
                let pointer = canvas.getPointer(event.e);
                let rx = Math.abs(pointer.x - startPoints.x) / 2;
                let ry = Math.abs(pointer.y - startPoints.y) / 2;
    
                selectedShape.set({ rx: rx, ry: ry });
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
            } else if (currentShapetype === shape.polygon) {
                let pointer = canvas.getPointer(event.e);
                let pentagonPoints = createPentagonPoints(pointer, predefinedRadius);
                let pentagon = new fabric.Polygon(pentagonPoints, {
                    fill: currentColor,
                    cornerColor: '#007FFF',
                    originX: 'center',
                    originY: 'center',
                });
                canvas.add(pentagon);
                canvas.renderAll();
            } else if (currentShapetype === shape.ellipse) {
                let pointer = canvas.getPointer(event.e);
                startPoints = { x: pointer.x, y: pointer.y };
                selectedShape = new fabric.Ellipse({
                    // Start with a small ellipse
                    rx: 1, 
                    ry: 1,
                    left: pointer.x,
                    top: pointer.y,
                    fill: currentColor,
                    originX: 'center',
                    originY: 'center'
                });
                canvas.add(selectedShape);
            } else if (currentShapetype === shape.curve) {
                let pointer = canvas.getPointer(event.e);
    
                let startPoint = canvas.getPointer(event.e);

                // For simplicity, control point and end point are predefined
                let controlPoint = { x: startPoint.x + 50, y: startPoint.y - 50 }; // Adjust as needed
                let endPoint = { x: startPoint.x + 100, y: startPoint.y };
    
                // Draw the curve
                drawCurve(canvas, startPoint, controlPoint, endPoint);
            }
        } else if (currentMode === editorModes.snapToGrid) {
            // Event handler for when an object is moving
            canvas.on('object:moving', function(options) {
                if (options.target) {
                    snapToGrid(options.target);
                }
            });

            // Event handler for when an object is scaling
            canvas.on('object:scaling', function(options) {
                if (options.target) {
                    snapToGridOnScaling(options.target);
                }
            });

            // Continue handling other events like object moving
            canvas.on('object:moving', function(options) {
                if (options.target) {
                    snapToGrid(options.target);
                }
            });

            canvas.on('object:rotating', function(options) {
                if (options.target) {
                    snapToRotation(options.target);
                    options.target.setCoords(); // Recalculate the object's coordinates
                }
            });
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

// Assuming a grid size of 25 as used in your drawGrid function
const gridSize = 25;
const rotationSnap = 15; 

function snapToGrid(target) {
    // Snap object's left and top properties to the nearest grid points
    target.set({
        left: Math.round(target.left / gridSize) * gridSize,
        top: Math.round(target.top / gridSize) * gridSize
    });
}

function snapToRotation(target) {
    var angle = target.angle;
    var snappedAngle = Math.round(angle / rotationSnap) * rotationSnap;

    // Adjust the angle
    target.rotate(snappedAngle);
}


function snapToGridOnScaling(target) {
    var scaleX = target.scaleX;
    var scaleY = target.scaleY;
    var width = target.width * scaleX;
    var height = target.height * scaleY;

    // Adjust dimensions to the nearest grid size
    width = Math.round(width / gridSize) * gridSize;
    height = Math.round(height / gridSize) * gridSize;

    // Adjust the scale factors based on the new dimensions
    target.scaleX = width / target.width;
    target.scaleY = height / target.height;

    // Snap the position to the grid as well
    target.set({
        left: Math.round(target.left / gridSize) * gridSize,
        top: Math.round(target.top / gridSize) * gridSize
    });
}

// // Event handler for when an object is moving
// canvas.on('object:moving', function(options) {
//     if (options.target) {
//         snapToGrid(options.target);
//     }
// });

// // Event handler for when an object is scaling
// canvas.on('object:scaling', function(options) {
//     if (options.target) {
//         snapToGridOnScaling(options.target);
//     }
// });

// // Continue handling other events like object moving
// canvas.on('object:moving', function(options) {
//     if (options.target) {
//         snapToGrid(options.target);
//     }
// });

// canvas.on('object:rotating', function(options) {
//     if (options.target) {
//         snapToRotation(options.target);
//         options.target.setCoords(); // Recalculate the object's coordinates
//     }
// });

