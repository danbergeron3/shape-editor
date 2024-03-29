let currentMode;
let mousePressed = false; 

const editorModes = {
    pan: 'pan',
    draw: 'draw'
}

const initCanvas = (id) => {
    return new fabric.Canvas('canvas', {
        width: 500,
        height: 500,
        backgroundColor: 'grey'
    });
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
            canvas.freeDrawingBrush = new fabric.CircleBrush(canvas);
            canvas.freeDrawingBrush.color = 'red';
            canvas.freeDrawingBrush.width = 15;
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

    
console.log("Canvas initialized:", canvas);

// Now, canvas.renderAll() is not strictly necessary since the 
// canvas is automatically rendered upon creation and any updates.
// mouse over 
// panning 
setPanEvents(canvas);
    


