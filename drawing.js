'use strict';

class FreehandDrawing {

    constructor (canvas) {
        this.canvas = canvas;
        this.context = this.canvas.getContext('2d');
        this.context.fillStyle = '#ffa';
        this.context.lineCap = this.context.lineJoin = 'round';
        this.setBrushSize(15);
        this.setBrushColor('#000');
        this.lastLength = 0;
        this.strokes = [];
        this.activeStrokes = [];
        this.drawHandler = this.draw.bind(this);
        this.started = false;

        this.canvas.addEventListener('touchstart', this.onStartDraw.bind(this), {passive: true});
        this.canvas.addEventListener('touchmove', this.onDrawTouch.bind(this), {passive: false});
        document.addEventListener('touchend', this.onEndDraw.bind(this));

        this.canvas.addEventListener('mousedown', this.onStartDraw.bind(this));
        this.canvas.addEventListener('mousemove', this.onDraw.bind(this));
        document.addEventListener('mouseup', this.onEndDraw.bind(this));

        this.eraseAll();
    }

    eraseAll () {
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    setBrushColor (color) {
        this.context.strokeStyle = color;
    }

    setBrushSize (width) {
        this.context.lineWidth = width;
    }

    onStartDraw () {
        this.started = true;
        this.canvastClientRect = this.canvas.getBoundingClientRect();
        this.canvastWidthRatio = this.canvas.offsetWidth / this.canvas.width;
        this.canvastHeightRatio = this.canvas.offsetHeight / this.canvas.height;
        this.activeStrokes = [];
        this.strokes.push(this.activeStrokes);
        this.lastLength = 1;
    }

    onDraw (event) {
        this.redraw(event.offsetX, event.offsetY);
    }

    onDrawTouch (event) {
        event.preventDefault();
        const touch = event.changedTouches[0];
        const x = touch.clientX - this.canvastClientRect.left;
        const y = touch.clientY - this.canvastClientRect.top;
        this.redraw(x, y);
    }

    onEndDraw () {
        this.started = false;
        if (this.activeStrokes.length) {
            this.activeStrokes = [];
        }
    }

    redraw (x, y) {
        if (this.started) {
            this.activeStrokes.push([x / this.canvastWidthRatio, y / this.canvastHeightRatio]);
            requestAnimationFrame(this.drawHandler);
        }
    }

    draw () {
        if (this.activeStrokes.length <= this.lastLength) {
            return;
        }
        const startIndex = this.lastLength - 1;
        this.lastLength = this.activeStrokes.length;
        this.context.beginPath();
        this.context.moveTo(...this.activeStrokes[startIndex]);
        for (let i = startIndex; i < this.lastLength; ++i) {
            this.context.lineTo(...this.activeStrokes[i]);
        }
        this.context.stroke();
    }
}