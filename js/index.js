let currentMode;
let currentColor = '#000000'; 
                                 
let mousePressed = false; 

const editorModes = {
    pan: 'pan',
    draw: 'draw'
}

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
    console.log("rect");
    const canvCenter = canvas.getCenter();
    const rect = new fabric.Rect({
        width: 200,
        height: 100,
        fill: currentColor,
        left: canvCenter.left,
        top: canvCenter.top,
        originX: 'center',
        originY: 'center',
        cornerColor: '#007FFF',
    });
    canvas.add(rect);
    canvas.renderAll();
}

const createCirc = (canvas) => {
    console.log("circ");
    const canvCenter = canvas.getCenter();
    const circ = new fabric.Circle({
        radius: 100,
        fill: currentColor,
        left: canvCenter.left,
        top: canvCenter.top,
        originX: 'center',
        originY: 'center',
        cornerColor: '#007FFF',
    });
    canvas.add(circ);
    canvas.renderAll();
}

const createLine = (canvas) => {
    console.log("line");
    const canvCenter = canvas.getCenter();
    const line = new fabric.Line([50, 100, 200, 200],{
        fill:  currentColor,
        stroke: currentColor,
        strokeWidth: 2,
        left: canvCenter.left,
        top: canvCenter.top,
        originX: 'center',
        originY: 'center',
        cornerColor: '#007FFF',
    });
    canvas.add(line);
    canvas.renderAll();
}

const createPoly = (canvas) => {
    console.log("line");
    const canvCenter = canvas.getCenter();
    const line = new fabric.Polygon([ 
        { x: 200, y: 10 }, 
        { x: 250, y: 50 }, 
        { x: 250, y: 180}, 
        { x: 150, y: 180}, 
        { x: 150, y: 50 }],{
        fill:  currentColor,
        left: canvCenter.left,
        top: canvCenter.top,
        originX: 'center',
        originY: 'center',
        cornerColor: '#007FFF',
    });
    canvas.add(line);
    canvas.renderAll();
}


const createSquare = (canvas) => {
    console.log("square");
    const canvCenter = canvas.getCenter();
    const square = new fabric.Rect({
        width: 100,
        height: 100,
        fill: currentColor,
        left: canvCenter.left,
        top: canvCenter.top,
        originX: 'center',
        originY: 'center',
        cornerColor: '#007FFF',

    });
    canvas.add(square);
    canvas.renderAll();
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
    } else if (mode === editorModes.draw) {
        if(currentMode === editorModes.draw) {
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
            currentMode = editorModes.draw;
            canvas.isDrawingMode = true;
            canvas.renderAll();
        }
    }
    console.log(mode);
};

const setPanEvents = (canvas) => {
    canvas.on('mouse:move', (event) => {
        if(mousePressed && currentMode === 'pan') {
            canvas.setCursor('grab');
            canvas.renderAll();
            console.log("Mouse: " + event);
            const moveEvent = event.e;
            const delta = new fabric.Point(moveEvent.movementX, moveEvent.movementY);
            canvas.relativePan(delta);
        } else if (mousePressed && currentMode === editorModes.draw) {
            canvas.isDrawingMode = true;
            canvas.renderAll();
        }
    });

    canvas.on('mouse:down', (event) => {
        mousePressed = true;
        
        if(currentMode === 'pan') { 
            canvas.setCursor('grab');
            canvas.renderAll();
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
    


