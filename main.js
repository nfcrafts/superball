(function() {
  var Ball, Basketball, Boom, Cursor, Eye, Eye2, Football, Ochpochmack, Pixel, Priora, Russia, Vector2d, World, _Object, cont, draw, i, j, mousePos, ticks,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  mousePos = {
    x: 0,
    y: 0
  };

  cont = false;

  Math.rand = Math.random;

  Math.random = function(min, max, integer) {
    if (typeof min === 'number') {
      if (integer) {
        return Math.floor(Math.rand() * (max - min) + min);
      } else {
        return Math.rand() * (max - min) + min;
      }
    } else {
      return Math.rand();
    }
  };

  Vector2d = (function() {
    Vector2d.getDistance = function(vect1, vect2) {
      return Math.sqrt((vect1.x - vect2.x) * (vect1.x - vect2.x) + (vect1.y - vect2.y) * (vect1.y - vect2.y));
    };

    function Vector2d(x, y) {
      this.x = x != null ? x : 0;
      this.y = y != null ? y : 0;
    }

    Vector2d.prototype.x = 0;

    Vector2d.prototype.y = 0;

    Vector2d.prototype.add = function(vect) {
      this.x = this.x + vect.x;
      this.y = this.y + vect.y;
      return this;
    };

    Vector2d.prototype.d2 = function() {
      return new Vector2d(this.x / 2, this.y / 2);
    };

    return Vector2d;

  })();

  _Object = (function() {
    function _Object(position, size1) {
      this.position = position;
      this.size = size1;
      this.contains = bind(this.contains, this);
    }

    _Object.prototype.contains = function(vect) {
      return vect.x >= this.position.x && vect.y >= pos.y && vect.x <= this.position.x + this.size.x && vect.y <= this.position.y + this.size.y;
    };

    return _Object;

  })();

  Ball = (function(superClass) {
    extend(Ball, superClass);

    function Ball(position, speed, world1, size1, color) {
      var size;
      this.position = position;
      this.speed = speed;
      this.world = world1;
      this.size = size1;
      this.color = color;
      this.contains = bind(this.contains, this);
      this.update = bind(this.update, this);
      this.tick = bind(this.tick, this);
      if (!this.color) {
        this.color = 'rgb(' + Math.random(60, 255, true) + ',' + Math.random(60, 255, true) + ',' + Math.random(60, 255, true) + ')';
      }
      if (!this.size) {
        size = Math.random(5, 100, true);
        this.size = new Vector2d(size, size);
      }
      this.id = Math.random().toString(36).substring(7);
      this.maxTicks = Math.random(60, 200, true);
    }

    Ball.prototype.speed = new Vector2d(0, 0);

    Ball.prototype.position = new Vector2d(0, 0);

    Ball.prototype.world = null;

    Ball.prototype.elem = null;

    Ball.prototype.elasticity = 0.6;

    Ball.prototype.friction = 0.9;

    Ball.prototype.ticks = 0;

    Ball.prototype.removed = false;

    Ball.prototype.tick = function() {
      this.speed.add(this.world.wind);
      if (Math.abs(this.speed.x) < 0.01) {
        this.speed.x = 0;
      }
      if (Math.abs(this.speed.y) < 0.01) {
        this.speed.y = 0;
      }
      if (this.position.y + this.size.y < this.world.canvas.height) {
        this.speed.add(this.world.gravity);
      } else {
        this.speed.x *= this.friction;
      }
      this.position.add(this.speed);
      if (world.intersections) {
        if (this.position.x >= this.world.canvas.width - this.size.x && this.speed.x >= 0) {
          this.speed.x *= -1 * this.elasticity;
        }
        if (this.position.x <= 0 && this.speed.x <= 0) {
          this.speed.x *= -1 * this.elasticity;
        }
        if (this.position.y >= this.world.canvas.height - this.size.y && this.speed.y >= 0) {
          this.speed.y *= -1 * this.elasticity;
        }
        if (this.position.y <= 0 && this.speed.y <= 0) {
          return this.speed.y *= -1 * this.elasticity;
        }
      }
    };

    Ball.prototype.update = function() {
      this.world.ctx.beginPath();
      this.world.ctx.arc(this.position.x + this.size.x / 2, this.position.y + this.size.y / 2, this.size.x / 2, 2 * Math.PI, false);
      this.world.ctx.fillStyle = this.color;
      return this.world.ctx.fill();
    };

    Ball.prototype.contains = function(vect) {
      var radius;
      if (this.position.x < vect.x && this.position.y < vect.y) {
        radius = this.size.x / 2;
        return Math.pow(vect.x - (this.position.x + this.size.x / 2), 2) + Math.pow(vect.y - (this.position.y + this.size.x / 2), 2) <= radius * radius;
      } else {
        return false;
      }
    };

    return Ball;

  })(_Object);

  Ochpochmack = (function(superClass) {
    extend(Ochpochmack, superClass);

    function Ochpochmack() {
      this.update = bind(this.update, this);
      return Ochpochmack.__super__.constructor.apply(this, arguments);
    }

    Ochpochmack.prototype.update = function() {
      this.world.ctx.beginPath();
      this.world.ctx.moveTo(this.position.x, this.position.y);
      this.world.ctx.lineTo(this.position.x + this.size.x, this.position.y);
      this.world.ctx.lineTo(this.position.x, this.position.y + this.size.y);
      this.world.ctx.fillStyle = this.color;
      return this.world.ctx.fill();
    };

    return Ochpochmack;

  })(Ball);

  Pixel = (function(superClass) {
    extend(Pixel, superClass);

    function Pixel() {
      this.update = bind(this.update, this);
      return Pixel.__super__.constructor.apply(this, arguments);
    }

    Pixel.prototype.update = function() {
      this.world.ctx.fillStyle = this.color;
      return this.world.ctx.fillRect(this.position.x, this.position.y, this.size.x, this.size.y);
    };

    return Pixel;

  })(Ball);

  Eye = (function(superClass) {
    extend(Eye, superClass);

    function Eye() {
      this.update = bind(this.update, this);
      this.img = new Image;
      this.img.src = this.src();
      Eye.__super__.constructor.apply(this, arguments);
    }

    Eye.prototype.src = function() {
      return 'http://pngimg.com/upload/eye_PNG6183.png';
    };

    Eye.prototype.update = function() {
      return this.world.ctx.drawImage(this.img, this.position.x, this.position.y, this.size.x, this.size.y);
    };

    return Eye;

  })(Ball);

  Eye2 = (function(superClass) {
    extend(Eye2, superClass);

    function Eye2() {
      return Eye2.__super__.constructor.apply(this, arguments);
    }

    Eye2.prototype.src = function() {
      return 'http://img11.deviantart.net/f9fb/i/2015/109/e/e/brown_eye_1_saved_as_png_to_preserve_transparency_by_shadowprince14-d8qbegv.png';
    };

    return Eye2;

  })(Eye);

  Russia = (function(superClass) {
    extend(Russia, superClass);

    function Russia() {
      return Russia.__super__.constructor.apply(this, arguments);
    }

    Russia.prototype.src = function() {
      return 'http://icons.iconseeker.com/ico/rounded-world-flags/russia-flag-2.ico';
    };

    return Russia;

  })(Eye);

  Football = (function(superClass) {
    extend(Football, superClass);

    function Football() {
      return Football.__super__.constructor.apply(this, arguments);
    }

    Football.prototype.src = function() {
      return 'http://cliparts.co/cliparts/ki8/od7/ki8od78kT.png';
    };

    return Football;

  })(Eye);

  Basketball = (function(superClass) {
    extend(Basketball, superClass);

    function Basketball() {
      return Basketball.__super__.constructor.apply(this, arguments);
    }

    Basketball.prototype.src = function() {
      return 'http://pngimg.com/upload/basketball_PNG1100.png';
    };

    return Basketball;

  })(Eye);

  Priora = (function(superClass) {
    extend(Priora, superClass);

    function Priora() {
      return Priora.__super__.constructor.apply(this, arguments);
    }

    Priora.prototype.src = function() {
      return 'https://pp.vk.me/c637824/v637824277/179e/8iLe7JF-kWQ.jpg';
    };

    return Priora;

  })(Eye);

  Boom = (function(superClass) {
    extend(Boom, superClass);

    function Boom(position, world1) {
      this.position = position;
      this.world = world1;
      this.ditonate = bind(this.ditonate, this);
    }

    Boom.prototype.removed = false;

    Boom.prototype.ditonate = function() {
      var distance, j, len, obj, ref;
      ref = this.world.objects;
      for (j = 0, len = ref.length; j < len; j++) {
        obj = ref[j];
        if (obj instanceof Ball) {
          distance = (Math.sqrt((obj.position.x + obj.size.x / 2 - this.position.x) * (obj.position.x + obj.size.x / 2 - this.position.x) + (this.position.y - obj.position.y - obj.size.x / 2) * (this.position.y - obj.position.y - obj.size.x / 2))) / 10;
          obj.speed.add(new Vector2d((obj.position.x + (obj.size.x / 2) - this.position.x) / distance, (obj.position.y + obj.size.x / 2 - this.position.y) / distance));
        }
      }
      return this.removed = true;
    };

    Boom.prototype.contains = function() {
      return false;
    };

    return Boom;

  })(_Object);

  document.querySelector("canvas").width = window.innerWidth;

  document.querySelector("canvas").height = window.innerHeight;

  window.addEventListener('resize', function() {
    document.querySelector("canvas").width = window.innerWidth;
    return document.querySelector("canvas").height = window.innerHeight;
  });

  ticks = 0;

  Cursor = (function() {
    function Cursor(position, active) {
      this.position = position;
      this.active = active != null ? active : false;
      this.update = bind(this.update, this);
    }

    Cursor.prototype.update = function() {
      cont = this.active;
      this.world.ctx.beginPath();
      this.world.ctx.lineWidth = 5;
      this.world.ctx.strokeStyle = "rgba(255, 0, 0, .3)";
      if (cont) {
        this.world.ctx.strokeStyle = "rgba(255, 0, 0, .8)";
      }
      this.world.ctx.moveTo(mousePos.x, 0);
      this.world.ctx.lineTo(mousePos.x, this.world.canvas.height);
      this.world.ctx.stroke();
      this.world.ctx.closePath();
      this.world.ctx.beginPath();
      this.world.ctx.lineWidth = 5;
      this.world.ctx.strokeStyle = "rgba(255, 0, 0, .3)";
      if (cont) {
        this.world.ctx.strokeStyle = "rgba(255, 0, 0, .8)";
      }
      this.world.ctx.moveTo(0, mousePos.y);
      this.world.ctx.lineTo(this.world.canvas.width, mousePos.y);
      this.world.ctx.stroke();
      this.world.ctx.closePath();
      this.world.ctx.beginPath();
      this.world.ctx.arc(mousePos.x, mousePos.y, 50, 2 * Math.PI, false);
      this.world.ctx.strokeStyle = "rgba(255, 0, 0, .3)";
      if (cont) {
        this.world.ctx.strokeStyle = "rgba(255, 0, 0, .8)";
      }
      this.world.ctx.stroke();
      return this.world.ctx.closePath();
    };

    return Cursor;

  })();

  World = (function() {
    World.prototype.wind = new Vector2d(0, 0);

    World.prototype.gravity = new Vector2d(0, 1);

    World.prototype.intersections = true;

    function World(canvas, cursor1) {
      this.canvas = canvas;
      this.cursor = cursor1;
      this.render = bind(this.render, this);
      this.tick = bind(this.tick, this);
      this.addObject = bind(this.addObject, this);
      this.clear = bind(this.clear, this);
      this.start = bind(this.start, this);
      this.cursor.world = this;
      this.ctx = this.canvas.getContext('2d');
      this.objects = [];
    }

    World.prototype.start = function() {
      this.tick();
      return this.render();
    };

    World.prototype.clear = function() {
      return this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    };

    World.prototype.addObject = function(obj) {
      return this.objects.push(obj);
    };

    World.prototype.tick = function() {
      var ind, j, len, obj, ref;
      cont = false;
      ref = this.objects;
      for (ind = j = 0, len = ref.length; j < len; ind = ++j) {
        obj = ref[ind];
        if (obj) {
          if (obj.contains(mousePos)) {
            cont = true;
          }
          if (!obj.removed) {
            obj.tick();
          } else {
            this.objects.splice(ind, 1);
          }
        }
      }
      this.cursor.active = cont;
      return requestAnimationFrame(this.tick.bind(this));
    };

    World.prototype.render = function() {
      var j, len, obj, ref;
      ticks++;
      this.clear();
      ref = this.objects;
      for (j = 0, len = ref.length; j < len; j++) {
        obj = ref[j];
        if (!obj.removed) {
          obj.update();
        }
      }
      this.cursor.update();
      return setTimeout(this.render.bind(this), 1);
    };

    return World;

  })();

  setInterval(function() {
    document.querySelector("#fps").innerHTML = "FPS: " + (ticks * 2) + " \n Objects: " + world.objects.length;
    return ticks = 0;
  }, 500);

  window.cursor = new Cursor(new Vector2d(0, 0));

  window.world = new World(document.querySelector("canvas"), cursor);

  draw = false;

  for (i = j = 0; j <= 1; i = ++j) {
    world.addObject(new Ball(new Vector2d(10, 10), new Vector2d(0, 0), world, new Vector2d(200, 200)));
    world.addObject(new Ball(new Vector2d(10, 10), new Vector2d(0, 0), world, new Vector2d(200, 200)));
    world.addObject(new Pixel(new Vector2d(10, 10), new Vector2d(0, 0), world, new Vector2d(200, 200)));
    world.addObject(new Pixel(new Vector2d(10, 10), new Vector2d(0, 0), world, new Vector2d(200, 200)));
  }

  world.canvas.addEventListener("click", function(e) {
    if (e.altKey) {
      return e.preventDefault();
    }
  });

  world.canvas.addEventListener("mousedown", function(e) {
    var boom, k, l, len, obj, ref, results;
    draw = true;
    if (e.altKey) {
      e.preventDefault();
    }
    ref = world.objects;
    results = [];
    for (k = 0, len = ref.length; k < len; k++) {
      obj = ref[k];
      if (obj.contains(mousePos)) {
        obj.removed = true;
        boom = new Boom(new Vector2d(obj.position.x + obj.size.x / 2, obj.position.y + obj.size.y / 2), world);
        for (i = l = 0; l <= 6; i = ++l) {
          world.addObject(new obj.constructor(new Vector2d(obj.position.x + obj.size.x / 2 + Math.random() * 10, obj.position.y + obj.size.y / 2 + Math.random() * 10), new Vector2d(0, 0), world, obj.size.d2(), obj.color));
        }
        world.addObject(boom);
        results.push(boom.ditonate());
      } else {
        results.push(void 0);
      }
    }
    return results;
  });

  world.canvas.addEventListener("mouseup", function(e) {
    if (e.altKey) {
      e.preventDefault();
      world.addObject(new Ball(new Vector2d(e.pageX, e.pageY), new Vector2d(Math.random(-10, 10), Math.random(-10, 10)), world));
    }
    return draw = false;
  });

  world.canvas.addEventListener("mousemove", function(e) {
    if (e.altKey) {
      if (draw) {
        if (Math.round(Math.random()) > 0) {
          world.addObject(new Pixel(new Vector2d(e.pageX, e.pageY), new Vector2d(Math.random(-1, 1), Math.random(-10, 10)), world));
        } else {
          world.addObject(new Ball(new Vector2d(e.pageX, e.pageY), new Vector2d(Math.random(-1, 1), Math.random(-10, 10)), world));
        }
      }
    }
    mousePos = new Vector2d(e.pageX, e.pageY);
    return document.querySelector("#mousePos").innerHTML = mousePos.x + ", " + mousePos.y;
  });

  world.start();

}).call(this);
