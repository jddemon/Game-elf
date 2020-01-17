/**
 * @ulyanoff_A
 */

/**
 *
 * Физический мир игры
 *
 */
function Phisic() {

	/**
	 * Объекты в мире
	 */
	this.objects = new Array();

	/**
	 * Левая граница, за которую не зайти
	 */
	this.leftBorder = 0;
	/**
	 * Правая граница, за которую не зайти
	 */
	this.rightBorder = 2000;
	
	/**
	 * Максимальное кол. врага
	 */
	this.maxNPC=10;
	
	/**
	 * Скорость стрел
	 */
	this.speedSparrow=500;

	/**
	 * контроль кадров и времени
	 */
	this.fps = null;
	/**
	 * Главный герой
	 */
	this.elf = null;

	/**
	 * Параметры врага  type 1 - Гоблин, 2 - Орк, 3 - Троль
	 */
	this.paramsNPC = new Array(0, new ParamNPC(15, 2, 1.31), new ParamNPC(30, 5, 1.18), new ParamNPC(60, 10, 1.3));

	/**
	 * Граница видимости слева, которую даёт камера
	 */
	this.visibleLeft = 0;
	/**
	 * Граница видимости справа, которую даёт камера
	 */
	this.visibleRight = 0;
	/**
	 * параметры клавиш нажата или нет
	 */
	this.keys = null;

	/**
	 * Скилы героя
	 */
	this.skills = new Array(0, new SkillElf(1, 0, 15, 0), new SkillElf(2, 0, 0, 5), new SkillElf(3, 3000, 40, 10), new SkillElf(4, 15000, 100, 30));

	/**
	 * Соотношения сторон картинок скилов
	 */
	this.aspectSkills = new Array(0, 5.66, 0.81, 1.81, 0.83);

	/**
	 * Поставлен ли блок
	 */
	this.block = false;

	/**
	 * Конец ли игры
	 */
	this.gameover = false;

	/**
	 * Отпущена ли кнопка после нажатия
	 */
	this.releaseButton = new Array();

	/**
	 * Щит
	 */
	this.guard = null;

	/**
	 * Баллы
	 */
	this.points = 0;

	/**
	 * Фоновые объекты
	 */
	this.bgObjects = new Array();


	//соотношение картинки фона w/h
	this.aspectBgObject = 1.3;

	this.pause = false;
	
	this.notTroll=true;

	this.init = function() {

		this.fps = new FPS();

		//=========фоновые объекты

		var x = this.leftBorder;
		var hbg = 400;
		var y = hbg * 0.7;
		var w = hbg * this.aspectBgObject;

		while(true) {
			var obj = new NPC(this, x, 0, 0, this.aspectBgObject, 1, 0, 0);

			obj.aspectBgObject = this.aspectBgObject;
			this.bgObjects.push(obj);
			this.addObject(obj, false);
			x += w;
			if(x > this.rightBorder + w) {
				break;
			}
		}

		//========эльф

		this.elf = new Elf(this, 0, 0, 100, 0.89, 1);
		this.elf.setXY(100, this.elf.y);

		//========добавляем героя в мир

		this.addObject(this.elf, true);

		//========щит для эльфа
		this.guard = new NPC(this, 0, 0, this.elf.w / 2, 0.81, 1, 0, 0);
		this.addObject(this.guard, true);

	}

    // проверка позиции bg
	this.checkPositionBackground = function() {
		var x = this.leftBorder;
		for(var i = 0; i < this.bgObjects.length; i++) {
			var obj = this.bgObjects[i];
			obj.x = x;
			x += obj.w - 1;
		};
	}

	/**
	 * Вызывать в каждом кадре
	 */
	this.run = function(keys, visibleLeft, visibleRight) {

		this.keys = keys;

		this.visibleLeft = visibleLeft;
		this.visibleRight = visibleRight;

		this.fps.run();

		if(!this.pause) {

			//коллизии
			this.calculateCollisionThisFrame();

			//ран объектов
			for(var i in this.objects) {
				var o = this.objects[i];
				o.run(this.fps);
			}
			//орки
			this.runNPC();
			//ельф
			this.runElf();	
		}

	}

	/**
	 * Добавить в мир объект
	 */
	this.addObject = function(phispbj, npc) {
		if(npc) {
			//выставить на 0
			phispbj.y = phispbj.h;
		}
		this.objects.push(phispbj);
	}

	/**
	 * Удалить объект с мира
	 */
	this.removeObject = function(phispbj) {
		for(var i in this.objects) {
			if(phispbj == this.objects[i]) {
				this.objects.splice(i, 1);
				break;
			}

		}

	}

    // передвижение персонажей
	this.runNPC = function() {

		var countNPC = 0;

		for(var i in this.objects) {
			var obj = this.objects[i];
			if(obj.type) {

				if(!obj.dead) {
					countNPC++;
				}
				//========передвижение

				if(Math.abs(this.elf.getCenterX() - obj.getCenterX()) >= ((this.elf.w/2) + (obj.w/2)) * 1) {
					if(this.elf.x - obj.x > 0) {
						obj.setD(1);
					} else {
						obj.setD(-1);
					}
				} else {
					//стоять на месте, если слишком близко
					obj.setD(0);
				}

				//===========смерть npc
				if(obj.collision) {
					for(var ic in obj.collision) {
						var objc = obj.collision[ic];
						if(objc.sp) {
							if(!objc.damaget.includes(obj)) {
								//в этого стрела ещё не попадала
								//ставим что попала
								objc.damaget.push(obj);

								//наносим ущерб
								obj.hp -= this.skills[objc.typeSkill].damage;
								obj.hp = Math.max(0, obj.hp);
								
								if(obj.hp == 0) {
									//npc уничтожен
									//ставим что нужно +1
									obj.dead = true;
									this.points++;
								}
							}
						}
					}
				}
			}
		}

		if(countNPC < this.maxNPC) {
			//мало варгов
			this.addObject(this.generateNPC(), true);
			
		}
	}

	this.runElf = function() {

		//=============передвижение
		var d = 0;
		if(this.keys[37]) {
			d = -1;
		}
		if(this.keys[39]) {
			d = 1;
		}
		this.elf.setD(d);

		//===============умения
		function checkSkill(thiso, key, skill) {
			if(thiso.keys[key]) {
				if(thiso.releaseButton[key]) {
					//ставим что кнопка не отпущена
					thiso.releaseButton[key] = false;

					if(thiso.skills[skill].isReady) {
						//запуск стрелы

						if(skill != 2) {
							thiso.generateSparrow(skill);
							//используем навык
							thiso.elf.mp -= thiso.skills[skill].mp;
							thiso.elf.mp = Math.max(0, thiso.elf.mp);
							thiso.skills[skill].setUse(thiso.fps);
						} else {
							if(key == 50) {
								thiso.block = true;
							}
							thiso.skills[skill].setUse(thiso.fps);
						}
					}
				}
				
			} else {
				thiso.releaseButton[key] = true;
				if(key == 50) {
					thiso.block = false;
				}
			}
		}

		this.skills[1].run(this.fps);
		this.skills[2].run(this.fps);
		this.skills[3].run(this.fps);
		this.skills[4].run(this.fps);

		//проверка запуска стрел и щита
		checkSkill(this, 49, 1);
		checkSkill(this, 50, 2);
		checkSkill(this, 51, 3);
		checkSkill(this, 52, 4);

		//энергия с блока
		if(this.block) {
			//установка щита, координаты
			var setXG;
			if(this.elf.getLastD() == 1) {
				setXG = this.elf.x + (this.elf.w * 0.9) - this.guard.w;
			} else {
				setXG = this.elf.x + (this.elf.w * 0.1);
			}

			this.guard.x = setXG;
			this.guard.y = this.elf.y - (this.elf.h * 0.4);
			this.guard.lastD = 1;

			//энергия
			this.elf.mp -= this.skills[2].mp * this.fps.sc;
			this.elf.mp = Math.max(this.elf.mp, 0);
			
			if(this.elf.mp==0){
				this.block=false;
			}			
		}

		//============регенерация

		//жизни
		this.elf.hp += this.elf.regenHP * this.fps.sc;
		this.elf.hp = Math.min(this.elf.hp, this.elf.maxHP);
		//энергия
		this.elf.mp += this.elf.regenMP * this.fps.sc;
		this.elf.mp = Math.min(this.elf.mp, this.elf.maxMP);

		//============конец игры

		//====смерьть героя
		if(this.elf.collision) {
			for(var ic = 1; ic < this.elf.collision[0] + 1; ic++) {
				var objc = this.elf.collision[ic];
				if(objc.type) {

					var paramNPC = this.paramsNPC[objc.type];
					if(paramNPC && !this.block) {

						var damage = paramNPC.damage * (this.fps.timeFrame / 1000);
						//жизни эльфа
						var hpe = this.elf.hp;
						hpe -= damage;
						hpe = Math.max(0, hpe);
						this.elf.hp = hpe;
						if(hpe == 0) {
							//конец игры
							this.gameover = true;
						}
					}
				}
			}
		}

		//====дошел до конца
		if(this.elf.x + this.elf.w >= this.rightBorder) {
			this.gameover = true;
		}
	}

	/**
	 * Запустить стрелу
	 */
	this.generateSparrow = function(idskill) {
		var aspect = this.aspectSkills[idskill];
		var w = this.elf.w / 2;
		var h = w / aspect;

		//по направлению героя
		var d = this.elf.getLastD();
		//по вертикали не будет двигаться
		var dy = 0;

		var x = this.elf.x + this.elf.w;
		if(d < 0) {
			x = this.elf.x - w;
		}

		var leftp = this.elf.x - (this.elf.w * 1.5);
		var rightp = this.elf.x + this.elf.w + (this.elf.w * 1.5);

		if(idskill == 4) {
			//=====град стрел
			//бдет лететь сверху вниз
			//по горизонтали не двигается
			d = 0;
			//двигается вниз
			dy = -1;

			for(var i = 0; i < 10; i++) {
				var positionSpar = leftp + (Math.random() * (rightp - leftp));
				var spar = new Sparrow(this,
				//x,y
				positionSpar, this.elf.y + (this.elf.h * 2), w, h, d, dy, this.speedSparrow, idskill);
				this.addObject(spar, false);
			};

		} else {
			//=====обычная стрела
			var spar = new Sparrow(this,
			//x,y
			x, this.elf.y - (this.elf.h / 2) + (h / 2), w, h, d, dy, this.speedSparrow, idskill);
			this.addObject(spar, false);
		}
	}

	this.generateNPC = function() {
		//тип персонажа 1-3
		var type=Math.floor((Math.random() * 3) + 1);
		//точка генерации
		var x = this.visibleRight - (this.visibleRight - this.visibleLeft) / 7;
		//инвариация дистанции от точки генерации
		var distOffset = 100;
		x += (Math.random() - 0.5) * distOffset;

		var setSpeed = this.paramsNPC[type].speed;
		return new GOT(this, x, 0, 100, this.paramsNPC[type].aspect, -1, type, this.paramsNPC[type].hp, setSpeed);
	}

	/**
	 * Просчитать пересечения объектов в текущем кадре.
	 * Один раз нужно просчитывать в каждом кадре.
	 */
	this.calculateCollisionThisFrame = function() {
		for(var i in this.objects) {
			var obj = this.objects[i];
			//по умолчанию нету пересечения
			obj.collision[0] = 0;
			for(var i2 in this.objects) {
                if(i2>i){
				var obj2 = this.objects[i2];

				if(obj.isCollision(obj2)) {
					//есть пересечение
					//ставим что есть пересечение
					obj.addCollisionObject(obj2);
					obj2.addCollisionObject(obj);
					}
				}
			};
		};
	}
}

/**
 * Объект для физического мира
 */
function PhisicObject(phisic, x, y, w, h) {

	/**
	 * Ссылка на физику
	 */
	this.phisic = phisic;
	/**
	 * С какимим объектами было пересечение в текущем кадре, при движении или пересечение телами
	 * 0 - сколько объектов
	 * все последующие сами объекты, с которыми было пересечение
	 */
	this.collision = new Array();
	this.collision.push(0);
	/**
	 * Ширина объекта
	 */
	this.w = w;
	/**
	 * Высота объекта
	 */
	this.h = h;
	/**
	 * позиция в мире
	 * левый верхний угол объекта
	 */
	this.x = x;

	/**
	 * позиция в мире
	 * левый верхний угол объекта
	 */
	this.y = y;

	/**
	 * позиция в прошлом кадре
	 */
	this.lastX = this.x;

	/**
	 * позиция в прошлом кадре
	 */
	this.lastY = this.y;

	/**
	 * Проверять ли границы мира при передвижении
	 */
	this.isCheckBorder = true;

	this.getCenterX = function() {
		return this.x + (this.w / 2);
	}

	this.move = function(newX, newY) {
		this.lastX = this.x;
		this.lastY = this.y;
		this.x = newX;
		this.y = newY;

		//проверка границ мира
		if(this.isCheckBorder) {
			this.checkBorder();
		}
	}

	this.setXY = function(newX, newY) {
		this.move(newX, newY);
		this.move(newX, newY);
	}
	/**
	 * Проверка границ мира
	 */
	this.checkBorder = function() {
		this.x = Math.min(Math.max(this.x, this.phisic.leftBorder), this.phisic.rightBorder - this.w);
	}

	/**
	 * Вызывать в конце кадра
	 */
	this.endFrame = function() {
		this.lastX = this.x;
		this.lastY = this.y;
	}

	/**
	 * Добаить объекты, с которыми пересекается текущий в текущем кадре.
	 * obj - PhisicObject или его наследники
	 */
	this.addCollisionObject = function(obj) {

		var add = true;
		var count = this.collision[0];
		for(var i = 1; i < count + 1; i++) {
			if(i < this.collision.length) {
				if(this.collision[i] == obj) {
					add = false;
					break;
				}
			} else {
				break;
			}
		};
		if(add) {
			count++;
			this.collision[0] = count;
			this.collision[count] = obj;
		}
	}

	/**
	 * Проверка пересекается ли объекты
	 */
	this.isCollision = function(phisobj) {
		return this.collisionRect(Math.min(this.x, this.lastX), Math.max(this.y, this.lastY), Math.max(this.x + this.w, this.lastX + this.w), Math.min(this.y - this.h, this.lastY - this.h), Math.min(phisobj.x, phisobj.lastX), Math.max(phisobj.y, phisobj.lastY), Math.max(phisobj.x + phisobj.w, phisobj.lastX + phisobj.w), Math.min(phisobj.y - phisobj.h, phisobj.lastY - phisobj.h));
	}
	/**
	 * Пересекаются ли прямоугольники
	 */
	this.collisionRect = function(l, t, r, b, l2, t2, r2, b2) {

		function coll(x, y, l, t, r, b) {
			return x >= l && x <= r && y >= b && y <= t;
		}
		return (coll(l, t, l2, t2, r2, b2) || coll(r, t, l2, t2, r2, b2) || coll(l, b, l2, t2, r2, b2) || coll(r, b, l2, t2, r2, b2) || coll(l2, t2, l, t, r, b) || coll(r2, t2, l, t, r, b) || coll(l2, b2, l, t, r, b) || coll(r2, b2, l, t, r, b));
	}

	this.run = function(fps) {
	}
}

/**
 * Троли орки и гоблины и другие персонажи
 */
function NPC(phisic, x, y, h, aspect, d, hp, speed) {
	this.__proto__ = new PhisicObject(phisic, x, y, h * aspect, h);

	/**
	 * Жизни
	 */
	this.hp = hp;

	/**
	 * Соотношение сторон w/h
	 */
	this.aspect = aspect;

	/**
	 * Скорость передвижения
	 */
	this.speed = speed;

	/**
	 * Направление в мире
	 * 1 - влево
	 * -1 - вправо
	 * 0 - не передвигать
	 */
	this.d = d;

	this.lastD = d;

	/**
	 * направление пермещения
	 */
	this.setD = function(d) {
		if(d != 0) {
			this.lastD = d;
		}
		this.d = d;
	}

	this.getLastD = function() {
		return this.lastD;
	}

	this.init = function() {
		this.__proto__.init();
	}

	this.run = function(fps) {
		this.__proto__.run(fps);
		//передвижение
		var newX = this.x + ((this.speed * (fps.timeFrame / 1000.0)) * this.d);
		this.move(newX, this.y);
	}
}

/**
 * Гоблин Орк Троль
 *
 * type 1 - Гоблин, 2 - Орк, 3 - Троль
 */
function GOT(phisic, x, y, h, aspect, d, type, hp, speed) {
	this.__proto__ = new NPC(phisic, x, y, h, aspect, d, hp, speed * (0.8 + (Math.random() * 0.2)));

	this.type = type;

	/**
	 * Мертв ли
	 */
	this.dead = false;

	this.setD = function(d) {
		this.__proto__.setD(d);

	}

	this.getLastD = function() {
		return this.__proto__.getLastD();
	}

	this.init = function() {
		this.__proto__.init();

	}

	this.run = function(fps) {
		this.__proto__.run(fps);

	}
}

/**
 * Эльф, управляется игроком
 */
function Elf(phisic, x, y, h, aspect, d) {
	this.__proto__ = new NPC(phisic, x, y, h, aspect, d, 100, 200);

	/**
	 * энергия
	 */
	this.mp = 100;

	this.elf = true;

	/**
	 * регенерация здоровья в сек
	 */
	this.regenHP = 2;
	/**
	 * регенерация энергии в сек
	 */
	this.regenMP = 5;

	/**
	 * Максимальное количество жизней
	 */
	this.maxHP = this.hp;

	/**
	 *  Максимальное количество энергии
	 */
	this.maxMP = this.mp;

	this.init = function() {
		this.__proto__.init();

	}

	this.run = function(fps) {
		this.__proto__.run(fps);

		var setX = this.x + ((this.speed * (fps.timeFrame / 1000.0)) * this.d);

		this.move(setX, this.y);

	}
}

/**
 * Когда нужно использовать навык, то ставим setUse
 * run - ставим в ране.
 * Для проверки перезарядки procReady
 * для проверки готовности использовать новый, можно ли его использовать - isReady
 */
function SkillElf(skillId, timeReload, damage, mp) {

	/**
	 * Какой скил
	 */
	this.skillId = skillId;

	/**
	 * Время перезарядки в миллисекундах
	 */
	this.timeReload = timeReload;

	/**
	 * Урон
	 */
	this.damage = damage;

	/**
	 * Сколько тратит энергии
	 */
	this.mp = mp;

	/**
	 * Готов ли к использованию
	 */
	this.isReady = true;

	/**
	 * Время использования
	 */
	this.timeUse = 0;
	/**
	 * Процент готовности навыка 100 - готов к использованию
	 */
	this.procReady = 100;

	/**
	 * Поставит что навык использован
	 */
	this.setUse = function(fps) {

		this.timeUse = fps.thistime;
		this.isReady = false;

	}
	/**
	 * Ставить в ране
	 */
	this.run = function(fps) {
		var timepass = fps.thistime - this.timeUse;
		if(timepass >= this.timeReload) {
			this.isReady = true;
			this.procReady = 100;

		} else {
			this.isReady = false;
			this.procReady = Math.min(100, 100 * (timepass / this.timeReload));
		}
	}
}

/**
 * d dy зажато между -1 0 1
 * speed - единиц в секунду
 *
 * typeSkill = тип скила. что бы показывать нужную картинку стрелы
 */
function Sparrow(phisic, x, y, w, h, d, dy, speed, typeSkill) {
	this.__proto__ = new NPC(phisic, x, y, h, w / h, d, 0, speed);

	this.sp = true;

	/**
	 * направление перемещения
	 */
	this.dy = dy;

	/**
	 * Каких объектов повредила
	 */
	this.damaget = new Array();
	/**
	 * К какому скилу относится
	 */
	this.typeSkill = typeSkill;

	/**
	 * Для стрел нету ограничений по миру
	 */
	this.isCheckBorder = false;

	/*
	 this.setD = function(d) {
	 this.__proto__.setD(d);

	 }

	 this.getLastD=function(){
	 return this.__proto__.getLastD();
	 }
	 */
	this.run = function(fps) {
		//this.__proto__.run(fps);
		//========передвигаем  объект
		//на сколько
		var movex = this.speed * (fps.timeFrame / 1000);

		this.move(this.x + (movex * this.d), this.y + (movex * this.dy));

		//ограничение стрел
		if(this.x < phisic.leftBorder - this.w || this.x > phisic.rightBorder - this.w || this.y < 0) {
			//стрела за пределами мира
			this.dead = true;
		}

	}
}

function ParamNPC(hp, damage, aspect) {
	/**
	 * Жизни
	 */
	this.hp = hp;
	/**
	 * Наноси урон
	 */
	this.damage = damage;

       /*
       */
	this.aspect = aspect;

	this.speed = 50;

}