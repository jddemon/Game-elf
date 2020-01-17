/**
 * @ulyanoff_A
 */

function DisplayGame() {
	this.__proto__ = new Display();

	/**
	 * Для жизней
	 */
	this.game_box_hp = null;
	/**
	 * Для шкалиы энергии
	 */
	this.game_box_mp = null;

	/**
	 * Имя игрока
	 */
	this.game_box_name = null;
	/**
	 * Для таймера
	 */
	this.game_box_timer = null;
	/**
	 * Для умений
	 */
	this.game_box_skills = null;
	/**
	 * для всего интерфейса
	 */
	this.game_box_ui = null;
	/**
	 * Для отображения игрового мира
	 */
	this.forviewer = null;
	/**
	 * Для таймера
	 */
	this.fortimer = null;
	/**
	 * Кнопка начать заново
	 */
	this.newgame
	this.balls
	this.viewer = null;
	/**
	 * Физика мира
	 */
	this.phisic = null;
	/**
	 * Для проверки клавиш. Свойства это клавиши, нажата или нет
	 * keys[27] - esc
	 */
	this.keys = new Array();
	/**
	 * Первый раз ли нажата кнопка
	 */
	this.keysFirst = new Array();

	/**
	 * Жизни
	 */
	this.scaleHP = null
	/**
	 * Энергия
	 */
	this.scaleMP = null;

	/**
	 * массив объектов Skill
	 * стрела, блок, 3 стрлы, град стрел
	 */
	this.skills = new Array();

	/**
	 * Таймер
	 */
	this.timer
	this.imgElf = null;

	/**
	 * Картинки гоблинов орков и тролей
	 */
	this.imgGOT = null;

	/**
	 * Картинки скилов
	 */
	this.imgSkills = null;

	/**
	 * Фоновоая картинка
	 */
	this.imgBG = null;

	/**
	 * На паузе ли
	 */
	this.pause = false;

	/**
	 * Щит
	 */
	this.viewObjectGuard
	this.zIndexBG = 0;
	this.zIndexElf = 3;
	this.zIndexGuard = 4;

    this.timeRequestLocation;

	/**
	 * Где на экране линия, по которой передвигаются персонажи. 0.5 означает посредине
	 */
	this.zeroPosition = 0.7;

	this.init = function(patternid) {
		this.__proto__.init(patternid);

		//==========Элементы
		this.game_box_hp = this.getElementById("game_box_hp");
		this.game_box_mp = this.getElementById("game_box_mp");
		this.game_box_name = this.getElementById("game_box_name");
		this.game_box_timer = this.getElementById("game_box_timer");
		this.game_box_skills = this.getElementById("game_box_skills");
		this.game_box_ui = this.getElementById("game_box_ui");
		this.forviewer = this.getElementById("forviewer");
		this.fortimer = this.getElementById("fortimer");
		this.balls = this.getElementById("balls");
		this.newgame = this.getElementById("newgame");

		//==========события
		window.displayGame = this;
		window.addEventListener("keydown", this.onKeyDown);
		window.addEventListener("keyup", this.onKeyUp);

		/**
		// регистрация пользователя на клик
		*/
		this.newgame.thiso = this;
		this.newgame.addEventListener("click", this.onClick);

		//=========картинки
		this.imgElf = this.createImage("elf");

		this.imgGOT = new Array();
		this.imgGOT.push(this.createImage("goblin"));
		this.imgGOT.push(this.createImage("orck"));
		this.imgGOT.push(this.createImage("troll"));

		this.imgSkills = new Array();

		for(var i = 1; i < 5; i++) {
			this.imgSkills.push(this.createImage("skill" + i)); [i]
		};

		this.imgBG = this.createImage("bg");

		//==========другие объекты
		this.viewer = new Viewer();

		this.phisic = new Phisic();
		this.phisic.init();

	}
	/**
	 * Создать изображение
	 */
	this.createImage = function(name) {
		var ele = document.createElement("img");
		ele.setAttribute("src", "./img/" + name + ".png");

		return ele;
	}

	this.onAdd = function() {

		this.setWH(this.game_box_ui, this.game.w, this.game.h);

		//====================отображение мира
		this.viewer.init("viewer", this.game.w, this.game.h);
		this.viewer.setCamera(100);

		//помещает отображаться мир
		this.forviewer.appendChild(this.viewer.ele);

		//====имя игрока
		this.game_box_name.innerHTML = this.game.nameGamer;

		//=====================шкалы

		this.scaleHP = new Scale();
		this.scaleHP.init("pattern_scale", this.game.w / 5, "20pt", 100, false);

		this.scaleMP = new Scale();
		this.scaleMP.init("pattern_scale", this.game.w / 5, "20pt", 100, new Array("#99f", "#ccf", "#ccf", "#fff"));
		this.scaleMP.setColorText("black");

		this.game_box_hp.appendChild(this.scaleHP.ele);
		this.game_box_mp.appendChild(this.scaleMP.ele);

		this.scaleHP.setValue(100);
		this.scaleMP.setValue(100);

		//================таймер
		this.timer = new Timer(this.fortimer);
		this.timer.init();
		//запустим таймер
		this.timer.startSec(this.phisic.fps.thistime);

		//========картинка эльфа
		this.attachImageForViewer(this.phisic.elf, this.imgElf);
		this.phisic.elf.viewobject.z = this.zIndexElf;

		//========Щит
		this.attachImageForViewer(this.phisic.guard, this.imgSkills[1]);
		this.viewObjectGuard = this.phisic.guard.viewobject;
		this.viewObjectGuard.setOpacity(0);
		this.viewObjectGuard.z = this.zIndexGuard;

		//====фон
		for(var i = 0; i < this.phisic.bgObjects.length; i++) {
			var objp = this.phisic.bgObjects[i];
			//размер фона
			this.setSizeBackgroundObject(objp, this.game.h);
			//прикрепить к вьюверу
			this.attachImageForViewer(objp, this.imgBG);
			objp.viewobject.z = this.zIndexBG;

		};
		
		this.phisic.checkPositionBackground();

		//=================скилы
		for(var i = 0; i < 4; i++) {
			var idSkill = i + 1;
			var skill = new Skill();
			skill.init("pattern_skill", "./img/skill" + idSkill + ".png", idSkill);
			var forSkill = this.getElementById("forskill" + idSkill);

			forSkill.appendChild(skill.ele);
			this.skills.push(skill);
			skill.setScaleSkill(400 * (i / 100));
		};

	}
	/**
	 * Поток дисплея
	 */
	this.run = function() {
		this.__proto__.run();

		this.phisic.run(this.keys, this.viewer.x - (this.game.w / 2), this.viewer.x + (this.game.w / 2));

		var thistime = this.phisic.fps.thistime;

		this.timer.run(thistime);

		this.viewer.run();

		//============шкалы
		this.scaleHP.setValue(Math.floor(this.phisic.elf.hp));
		this.scaleMP.setValue(Math.floor(this.phisic.elf.mp));

		//===========баллы
		this.balls.innerHTML = this.phisic.points;

		//=============навыки
		this.skills[0].setScaleSkill(100 - this.phisic.skills[1].procReady);
		this.skills[1].setScaleSkill(100 - this.phisic.skills[2].procReady);
		this.skills[2].setScaleSkill(100 - this.phisic.skills[3].procReady);
		this.skills[3].setScaleSkill(100 - this.phisic.skills[4].procReady);

		/*
		=============Показать объекты
		====эльф
		*/

		this.setObjectByPhis(this.phisic.elf);

		//====другие (все кроме эльфа)
		for(var i = 0; i < this.phisic.objects.length; i++) {
			var obj = this.phisic.objects[i];
			if(obj) {
				if(obj.type) {
					if(!obj.viewobject) {
						//картинка не привязана к объекту
						this.attachImageForViewer(obj, this.imgGOT[obj.type - 1]);
					}
				}

				if(obj.sp) {
					//стрелы
					if(!obj.viewobject) {
						//картинка не привязана к объекту
						this.attachImageForViewer(obj, this.imgSkills[obj.typeSkill - 1]);
					}
				}
				if(obj.viewobject) {
					this.setObjectByPhis(obj);
				}
			}
		};

		//==========щит ( если активен вывести, если нет)
		if(this.phisic.block) {
			this.viewObjectGuard.opacity = 1;
		} else {
			this.viewObjectGuard.opacity = 0;
		}

		//===========камера
		//камера следит за игроком
		//левая граница для камеры
		var leftB = this.phisic.leftBorder + (this.game.w / 2);
		//правая граница для камеры
		var rightB = this.phisic.rightBorder - (this.game.w / 2);
		this.viewer.setCamera(Math.max(leftB, Math.min(rightB, this.phisic.elf.x)));

		//===========удаление объектов
		//если есть объекты, которые мертвы, например, то их можно удалить
		for(var i = 0; i < this.phisic.objects.length; i++) {
			var obj = this.phisic.objects[i];
			if(obj.dead) {

				//в физике
				this.phisic.removeObject(obj);
				//в отображении
				this.viewer.removeObject(obj.viewobject);
			}
		};

		//===============проверка на конец игры
		if(this.phisic.gameover) {
			//конец игры
			//Ставим таймер на паузу
			if(!this.timer.isPause) {
				this.timer.pause(thistime);
			}
			//игру на паузу
			this.pause();
			//Прежде чем показать результат - определим местоположение
			if(!this.timeRequestLocation){
				this.timeRequestLocation=this.phisic.fps.thistime;
				this.checkGeolocation();
			}
		}

		//=============пауза
		if(this.phisic.pause) {
			if(!this.timer.isPause) {
				this.timer.pause(thistime);
			}
		} else {
			if(this.timer.isPause) {
				this.timer.resume(thistime);
			}
		}

	}

    /*проверка геолокации */
	this.checkGeolocation = function() {
		var g = new Geolocation();
		g.init();
		var obj=this;
		g.addEventListener(obj);
		g.check();
	}

	this.onPosition = function(p) {
		this.endGame("" + p.coords.latitude + "," + p.coords.longitude);
	}
	this.onError = function(e) {
		this.endGame("Не определено");
	}

    /**
     * закончить игру и показать экран результатов
     */
	this.endGame = function(geoloc) {
		//добавляем результат
		this.game.score.addResult(new ResultObject(this.game.nameGamer, this.phisic.points, this.timer.getTime(this.phisic.fps.thistime), geoloc));
		//установить экран результатов
		this.game.setDisplayResult();
	}

    /**
     * Установить нужный размер фону
     */
	this.setSizeBackgroundObject = function(obj, hbg) {
		var y = (hbg / 2) + (this.game * (1 - this.zeroPosition));
		var w = hbg * obj.aspectBgObject;
		obj.y = y;
		obj.w = w;
		obj.h = hbg;
	}

	/**
	 * Соединить отображаемй объект с объектом в мире
	 */
	this.attachImageForViewer = function(obj, img) {
		var eleImage = img.cloneNode(true);
		obj.viewobject = this.viewer.addObject(eleImage);
		obj.viewobject.w = obj.w + "px";
		obj.viewobject.h = obj.h + "px";

		this.setObjectByPhis(obj);

		//сразу обновить представление
		obj.viewobject.refresh();
	}

	/**
	 * x,y, - координаты в физическом мире
	 */
	this.setObjectByPhis = function(obj) {
		obj.viewobject.x = obj.x;
		obj.viewobject.y = this.yFormPhisToView(obj.y);

		if(obj.getLastD) {
			var d = obj.getLastD();
			if(d == 0) {
				d = 1;
			}
			obj.viewobject.mirrorX = d;
		}
	}

	/**
	 * Координата 'y' в ноле с физического мира в отображаемый
	 */
	this.yFormPhisToView = function(y) {
		return (this.game.h * this.zeroPosition) - y;
	}

	/**
	 * Установить баллы
	 */
	this.setBalls = function(balls) {
		this.balls.innerHTML = balls;
	}

	/**
	 * Вызывается, когда определённая клавиша отпущена
	 */
	this.onKeyUp = function(e) {
		kc = e.keyCode;
		var displayGame=window.game.displayGame;
		displayGame.keys[kc] = false;
	}

	/**
	 * Вызывается, когда определённая клавиша нажата
	 */
	this.onKeyDown = function(e) {
		kc = e.keyCode;
		var displayGame=window.game.displayGame;
		displayGame.keys[kc] = true;

		if(kc == 27) {

			if(!displayGame.phisic.pause) {
				displayGame.pause();
			} else {
				
				displayGame.resume();
			}
		}
	}

	this.pause = function() {
		this.phisic.pause = true;
	}

	this.resume = function() {
		//при конце игры ставим на паузу
		//и не снимаем.
		if(!this.phisic.gameover) {
			this.phisic.pause = false;
		}
	}

	this.onClick = function(e) {
		var th = this.thiso;

		if(this == th.newgame) {
			//играть заново
			th.game.setDisplayGame();
		}
	}
}