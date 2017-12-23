# # CONFIG section
# window.CONFIG = 
# 	gravity: new Vector2d 0, 0
	

mousePos = 
	x: 0
	y: 0
cont = false
Math.rand = Math.random

Math.random = (min, max, integer) ->
	if typeof min == 'number'
		if integer
			Math.floor Math.rand() * (max - min) + min
		else
			Math.rand() * (max - min) + min
	else
		Math.rand()
class Vector2d
	@getDistance: (vect1, vect2) ->
		Math.sqrt (vect1.x-vect2.x)*(vect1.x-vect2.x) + (vect1.y-vect2.y)*(vect1.y-vect2.y)
	constructor: (@x = 0, @y = 0) ->
	x: 0
	y: 0
	add: (vect) ->
		@x = @x + vect.x
		@y = @y + vect.y
		@
	d2: ->
		new Vector2d @x/2, @y/2
class _Object
	constructor: (@position, @size) ->
	contains: (vect) => vect.x >= @position.x and vect.y >= pos.y and vect.x <= @position.x + @size.x and vect.y <= @position.y + @size.y
class Ball extends _Object
	constructor: (@position, @speed, @world, @size, @color) ->
		unless @color
			@color = 'rgb(' + Math.random(60, 255, true) + ',' + Math.random(60, 255, true) + ',' + Math.random(60, 255, true) + ')'
		unless @size
			size = Math.random 5, 100, true
			@size = new Vector2d size, size
		@id = Math.random().toString(36).substring(7)
		@maxTicks = Math.random 60, 200, true
	speed: new Vector2d 0, 0
	position: new Vector2d 0, 0
	world: null
	elem: null
	elasticity: 0.6
	friction: 0.9
	ticks: 0
	removed: false
	tick: () =>
		@speed.add @world.wind
		if Math.abs(@speed.x) < 0.01 then @speed.x = 0
		if Math.abs(@speed.y) < 0.01 then @speed.y = 0
		if @position.y + @size.y < @world.canvas.height
			@speed.add @world.gravity
		else
			@speed.x *= @friction
		@position.add @speed
		if world.intersections
			if @position.x >= @world.canvas.width - @size.x and @speed.x >= 0 then @speed.x *= -1 * @elasticity
			if @position.x <= 0 and @speed.x <= 0 then @speed.x *= -1 * @elasticity
			if @position.y >= @world.canvas.height - @size.y and @speed.y >= 0 then @speed.y *= -1 * @elasticity
			if @position.y <= 0 and @speed.y <= 0 then @speed.y *= -1 * @elasticity
	update: () =>
		do @world.ctx.beginPath
		@world.ctx.arc @position.x + @size.x/2, @position.y + @size.y/2, @size.x/2, 2 * Math.PI, false
		@world.ctx.fillStyle = @color
		do @world.ctx.fill
	contains: (vect) =>
		if @position.x < vect.x and @position.y < vect.y
			radius = @size.x/2
			Math.pow(vect.x-(@position.x+@size.x/2), 2) + Math.pow(vect.y-(@position.y+@size.x/2), 2) <= radius*radius
		else
			false
class Ochpochmack extends Ball
	update: () =>
		do @world.ctx.beginPath
		@world.ctx.moveTo @position.x, @position.y
		@world.ctx.lineTo @position.x + @size.x,  @position.y
		@world.ctx.lineTo @position.x,  @position.y + @size.y
		@world.ctx.fillStyle = @color
		do @world.ctx.fill

class Pixel extends Ball
	update: () =>
		@world.ctx.fillStyle = @color
		@world.ctx.fillRect @position.x, @position.y, @size.x, @size.y

class Eye extends Ball
	constructor: ->
		@img = new Image
		@img.src = do @src
		super
	src: ->
		'http://pngimg.com/upload/eye_PNG6183.png'
	update: () =>
		@world.ctx.drawImage @img, @position.x, @position.y,@size.x,@size.y
class Eye2 extends Eye
	src: ->
		'http://img11.deviantart.net/f9fb/i/2015/109/e/e/brown_eye_1_saved_as_png_to_preserve_transparency_by_shadowprince14-d8qbegv.png'
class Russia extends Eye
	src: ->
		'http://icons.iconseeker.com/ico/rounded-world-flags/russia-flag-2.ico'
class Football extends Eye
	src: ->
		'http://cliparts.co/cliparts/ki8/od7/ki8od78kT.png'
class Basketball extends Eye
	src: ->
		'http://pngimg.com/upload/basketball_PNG1100.png'
class Priora extends Eye
	src: ->
		'https://pp.vk.me/c637824/v637824277/179e/8iLe7JF-kWQ.jpg'
class Boom extends _Object
	constructor: (@position, @world) ->
	removed: false
	ditonate: () =>
		for obj in @world.objects
			if obj instanceof Ball
				distance = (Math.sqrt (obj.position.x + obj.size.x / 2 - @position.x) * (obj.position.x + obj.size.x / 2 - @position.x) + (@position.y-obj.position.y-obj.size.x / 2) * (@position.y-obj.position.y-obj.size.x / 2))/10
				obj.speed.add new Vector2d( (obj.position.x+(obj.size.x / 2)-@position.x) / distance, (obj.position.y+obj.size.x / 2-@position.y) / distance)
		@removed = true
	contains: () -> false

document.querySelector("canvas").width = window.innerWidth
document.querySelector("canvas").height = window.innerHeight
window.addEventListener 'resize', () ->
	document.querySelector("canvas").width = window.innerWidth
	document.querySelector("canvas").height = window.innerHeight
ticks = 0
class Cursor
	constructor: (@position, @active = false) ->

	update: =>
		cont = @active
		do @world.ctx.beginPath
		@world.ctx.lineWidth = 5
		@world.ctx.strokeStyle = "rgba(255, 0, 0, .3)"
		if cont then @world.ctx.strokeStyle = "rgba(255, 0, 0, .8)"
		@world.ctx.moveTo mousePos.x, 0
		@world.ctx.lineTo mousePos.x, @world.canvas.height
		do @world.ctx.stroke
		do @world.ctx.closePath

		do @world.ctx.beginPath
		@world.ctx.lineWidth = 5
		@world.ctx.strokeStyle = "rgba(255, 0, 0, .3)"
		if cont then @world.ctx.strokeStyle = "rgba(255, 0, 0, .8)"
		@world.ctx.moveTo 0, mousePos.y
		@world.ctx.lineTo @world.canvas.width, mousePos.y
		do @world.ctx.stroke
		do @world.ctx.closePath

		do @world.ctx.beginPath
		@world.ctx.arc mousePos.x, mousePos.y, 50, 2 * Math.PI, false
		@world.ctx.strokeStyle = "rgba(255, 0, 0, .3)"
		if cont then @world.ctx.strokeStyle = "rgba(255, 0, 0, .8)"

		do @world.ctx.stroke
		do @world.ctx.closePath
class World
	wind: new Vector2d 0, 0
	gravity: new Vector2d 0, 1
	# gravity: new Vector2d 0, 0
	intersections: true
	constructor: (@canvas, @cursor) ->
		@cursor.world = @
		@ctx = @canvas.getContext '2d'
		@objects = []
	start: () =>
		do @tick
		do @render
	clear: () => @ctx.clearRect 0, 0, @canvas.width, @canvas.height
	addObject: (obj) =>
		@objects.push obj
	tick: () =>
		
		# do @clear
		cont = false
		for obj, ind in @objects
			if obj
				if obj.contains mousePos
					cont = true	
				if !obj.removed
					do obj.tick
					# do obj.update
				else
					@objects.splice ind, 1
		@cursor.active = cont
		# do @cursor.update
		requestAnimationFrame @tick.bind @
		# setTimeout @tick.bind(@), 1

	render: () =>
		ticks++
		do @clear
		for obj in @objects
			if !obj.removed
				do obj.update
		do @cursor.update
		setTimeout @render.bind(@), 1
setInterval () ->
	document.querySelector "#fps"
		.innerHTML = "FPS: #{ticks*2} \n Objects: #{world.objects.length}"
	ticks = 0
, 500
window.cursor = new Cursor new Vector2d(0,0)
window.world = new World document.querySelector("canvas"), cursor
draw = false
for i in [0..1]
	world.addObject new Ball new Vector2d(10, 10), new Vector2d(0,0), world, new Vector2d(200, 200)
	world.addObject new Ball new Vector2d(10, 10), new Vector2d(0,0), world, new Vector2d(200, 200)
	world.addObject new Pixel new Vector2d(10, 10), new Vector2d(0,0), world, new Vector2d(200, 200)
	world.addObject new Pixel new Vector2d(10, 10), new Vector2d(0,0), world, new Vector2d(200, 200)
# world.addObject new Eye new Vector2d(400, 400), new Vector2d(0,0), world, new Vector2d(200, 200)
# world.addObject new Eye2 new Vector2d(500, 500), new Vector2d(0,0), world, new Vector2d(200, 200)
# world.addObject new Russia new Vector2d(500, 500), new Vector2d(0,0), world, new Vector2d(200, 200)
# world.addObject new Football new Vector2d(500, 500), new Vector2d(0,0), world, new Vector2d(200, 200)
# world.addObject new Basketball new Vector2d(500, 500), new Vector2d(0,0), world, new Vector2d(200, 200)
# world.addObject new Priora new Vector2d(500, 500), new Vector2d(0,0), world, new Vector2d(400, 400)
# world.addObject new Ochpochmack new Vector2d(300, 300), new Vector2d(0,0), world, new Vector2d(200, 200)
# world.addObject new Ochpochmack new Vector2d(300, 300), new Vector2d(0,0), world, new Vector2d(200, 200)
world.canvas.addEventListener "click", (e) ->
	if e.altKey
		e.preventDefault()
world.canvas.addEventListener "mousedown", (e) ->
	draw = true
	if e.altKey
		e.preventDefault()
	for obj in world.objects
		if obj.contains(mousePos)
			obj.removed = true
			boom = new Boom new Vector2d(obj.position.x+obj.size.x/2, obj.position.y+obj.size.y/2), world
			for i in [0..6]
				world.addObject new obj.constructor  new Vector2d(obj.position.x+obj.size.x/2+Math.random()*10, obj.position.y+obj.size.y/2+Math.random()*10), new Vector2d(0,0), world, obj.size.d2(), obj.color
			world.addObject boom
			do boom.ditonate
world.canvas.addEventListener "mouseup", (e) ->
	if e.altKey
		e.preventDefault()
		world.addObject new Ball new Vector2d(e.pageX, e.pageY), new Vector2d(Math.random(-10, 10), Math.random(-10, 10)), world
	draw = false
	
world.canvas.addEventListener "mousemove", (e) ->
	if e.altKey
		if draw
			if Math.round(Math.random()) > 0
				world.addObject new Pixel new Vector2d(e.pageX, e.pageY), new Vector2d(Math.random(-1, 1), Math.random(-10, 10)), world
			else
				world.addObject new Ball new Vector2d(e.pageX, e.pageY), new Vector2d(Math.random(-1, 1), Math.random(-10, 10)), world

	mousePos = new Vector2d e.pageX, e.pageY
	
	document.querySelector "#mousePos"
		.innerHTML = mousePos.x + ", " + mousePos.y

world.start()