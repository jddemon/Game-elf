/**
 * @ulyanoff_A
 */

/**
 * Результаты
 */
function Score() {

	/**
	 * таблица для работы
	 */
	this.table
	this.lastResult
	this.init = function() {

		this.table = new Table();
		this.table.init(new Array("points", -1, "times", 1), "elf_adventure_score3");
		//загрузка с хранилища
		this.table.load();

	}
	/**
	 * Добавить результат
	 * resultObject - результат, определяется объектом ResultObject
	 */
	this.addResult = function(resultObject) {

		this.lastResult = resultObject;
		this.table.add(resultObject);

		//сохраним
		this.table.save();

	}
	/**
	 * Вернуть результат в виде строк html таблицы
	 * lastResObj - последний объект добавленный в таблицу, что бы определить
	 * показаны ли результаты с последним результатом
	 */
	this.getResult = function() {

		if(this.table && this.table.lines && this.table.lines.length > 0) {

			var lines = this.table.lines;
			var position = 1;

			//последние полученные значнеия с таблицы
			var points;
			var times;
			//массив результатов эльфа
			var resultEles = new Array();
			//максимально количество результатов
			var maxResult = 10;
			//сколько результатов установлено в таблицу
			var thisres = 0;
			//установлен ли текущий результат
			var setLastResult = false;
			//устнаовили ли результат в таблицу
			var setResult = false;

			var timer = new Timer();

			function createTD(className) {

				var ele = document.createElement("td");
				ele.setAttribute("align", "center");
				ele.setAttribute("valign", "center");
				ele.setAttribute("class", className);
				return ele;
			}

			function addClass(td, className) {
				td.setAttribute("class", td.getAttribute("class") + " " + className);
			}


            //вставить в таблицу ячейку
			function insertTD(tr, className, innerHT, addClassname) {
				var td = createTD(className);
				td.innerHTML = innerHT;
				if(addClassname) {
					addClass(td, addClassname);
				}
				tr.insertAdjacentElement("beforeend", td);

				return td;
			}

			var strStarttd = "labeltableresult";
			var strStarttdResult = "labeltableresultresult";

			//первая добавленная ячейка в линии
			var firstTd;
			//последняя добавленная ячейка в линии
			var lastTd;

			for(var i in lines) {
				//каждый результат от самого большего к самому маленькому

				//объект результата
				var obj = lines[i];
				var timeObject=Math.floor(obj["times"]/1000);

				//============получаем результат
				var tr = document.createElement("tr");
				var classSet = strStarttd;

				if(this.lastResult == obj) {
					setLastResult = true;
				}

				if(setLastResult && !setResult) {
					setResult = true;
					//результат, который нужно показать
					classSet = strStarttdResult;
				}

				//позиция
				firstTd = insertTD(tr, classSet, position, false);
				//свойства (преобразовывания времени)
				for(var i2 in obj) {
					var val = obj[i2];
					if(i2 == "times") {
						//время читабельное нужно установить
						val = timer.getTimeString(val).strtime;
					}
					lastTd = insertTD(tr, classSet, val);

				}

                if(points==undefined){
                	points = obj["points"];
				    times = timeObject;
                }
				//==========позиция результата не меняется, если результат одинаков с предыдущим
				if(obj["points"] != points || timeObject != times) {
					
					position++;
				}
				
				firstTd.innerHTML=position;
				//если в следующем результате будет такое же, то место не увеличивается
				points = obj["points"];
				times = timeObject;

				//==========установка результата в таблицу
				if((thisres < maxResult && setLastResult) || thisres < maxResult-1 || (i==lines.length-1 && thisres < maxResult && !setLastResult)) {
					//можно устанавливать если установлено на 2 меньше максимального количества резуоьтатов,
					//или на 1 меньше, если получен последний результат

					//добавляем результат
					resultEles.push(tr);
					//сколько установлено строк
					thisres++;
				}

				//=======выход, если всё получено
				if(thisres == maxResult) {
					//получены все результаты
					//выход
					break;
				}

			}

            //округлить угол
			if(lastTd) {
				addClass(lastTd, "labeltableresultresult_br");
			}
			//округлить угол
			if(firstTd) {
				addClass(firstTd, "labeltableresultresult_bl");
			}

			return resultEles;
		}
	}
	/**
	 * Есть ли в талице указанное имя
	 */
	this.issetName = function(nameCheck) {
		var lines = this.table.lines;
		for(var i in lines) {
			if(lines[i].name == nameCheck) {
				return true;
			}
		}
	}
}

/*
* результаты объекта нашего игрока
*/
function ResultObject(name, points, times, location) {
	/**
	 * Имя
	 */
	this["name"] = name;
	/**
	 * Баллы
	 */
	this["points"] = points;
	this["times"] = times;
	this["location"] = location;
}