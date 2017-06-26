var Animation = function(canvasId){
  this.canvas = document.getElementById(canvasId);
  this.context = this.canvas.getContext("2d");
  this.t = 0;
  this.timeInterval = 0;
  this.startTime = 0;
  this.lastTime = 0;
  this.frame = 0;
  this.animating = false;

  window.requestAnimFrame = (function(callback){
    return window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      window.oRequestAnimationFrame ||
      window.msRequestAnimationFrame ||
      function(callback){
        window.setTimeout(callback, 1000 / 60);
      };
    })();
  };
  // Para obtener el Contexto
  Animation.prototype.getContext = function(){
    return this.context;
  };

  // Para obetener el canvas
  Animation.prototype.getCanvas = function(){
    return this.canvas;
  };

  // Para determinar si se esta ejecutando la animacion
  Animation.prototype.isAnimating = function(){
    return this.animating;
  };

  // Para obtener el frame actual
  Animation.prototype.getFrame = function(){
    return this.frame;
  };

  // Para obtener el intervalo de animacion
  Animation.prototype.getTimeInterval = function(){
    return this.timeInterval;
  };

  // Para obtener el tiempo total de la animacion
  Animation.prototype.getTime = function(){
    return this.t;
  };

  // Para obtener el FPS calculado para la animacion
  Animation.prototype.getFps = function(){
    return this.timeInterval > 0 ? 1000 / this.timeInterval : 0;
  };
  // Nos permite limpiar el canvas
Animation.prototype.clear = function(){
  this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
};

// define el escenario y lo actualiza
Animation.prototype.setStage = function(func){
  this.stage = func;
};

//Nos permite inciar la animacion "seteando" atributos
Animation.prototype.start = function(){
  this.animating = true;
  var date = new Date();
  this.startTime = date.getTime();
  this.lastTime = this.startTime;
  if (this.stage !== undefined) {
    this.stage();
  }
  this.animationLoop();
};

// detiene la animacion
Animation.prototype.stop = function(){
  this.animating = false;
};

//El loop de animacion
Animation.prototype.animationLoop = function(){
  var that = this;
  this.frame++;
  var date = new Date();
  var thisTime = date.getTime();
  this.timeInterval = thisTime - this.lastTime;
  this.t += this.timeInterval;
  this.lastTime = thisTime;
  if (this.stage !== undefined) {
    this.stage();
  }

  if (this.animating) {
    requestAnimFrame(function(){
    that.animationLoop();
  });
}
};
