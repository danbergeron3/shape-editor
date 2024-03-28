
const initCanvas = (id) => {
    return new fabric.Canvas('canvas', {
        width: 500,
        height: 500,
        backgroundColor: 'grey'
    });
}

window.onload = (event) => {
    const canvas = initCanvas('canvas');
    fabric.Image.fromURL('https://wallpapers.com/images/high/red-raspberries-and-daisy-flower-roldn198zsn76ez3.jpg', (img) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            // Options to control the background image
            scaleX: canvas.width / img.width,
            scaleY: canvas.height / img.height
        });
    });
    console.log("Canvas initialized:", canvas);

    // Now, canvas.renderAll() is not strictly necessary since the 
    // canvas is automatically rendered upon creation and any updates.
    // mouse over 
    // panning 

    let currentMode = 'pan';
    let mousePressed = false; 

    const mode = {
        pan: 'pan',
    }

    
    canvas.on('mouse:move', (event) => {
        if(mousePressed && currentMode === 'pan') {
            canvas.setCursor('grab');
            canvas.renderAll();
            console.log("Mouse: " + event);
            const moveEvent = event.e;
            const delta = new fabric.Point(moveEvent.movementX, moveEvent.movementY);
            canvas.relativePan(delta);
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

