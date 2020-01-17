/**
 * @ulyanoff_A
 */

/**
 * Шкала для жизней и энергии
 */
function Scale() {
	this.__proto__ = new Ui();

	/**
	 * Ширина шкалы
	 */
	this.w
	/**
	 * Высота шкалы
	 */
	this.h

	/**
	 * Фон для шкалы
	 */
	this.scale_background
	/**
	 * Значение для шкалы
	 */
	this.scale_value

	/**
	 * элемент для текста
	 */
	this.scale_text

	/**
	 * Максимальное значение в шкале
	 */
	this.maxVal

	/**
	 * Цвета для фонов шкал
	 */
	this.backgroundColors

	/**
	 * patternid - ид паттерна
	 * w,h ширина и высота шкалы
	 * maxVal - максимальное значение в шкале
	 * backgroundColors - фновые цвета для градиента фона. первая половина это для фона фона. Вторая  - для фона показания.
	 */
	this.init = function(patternid, w, h, maxVal, backgroundColors) {
		this.__proto__.init(patternid);

		this.scale_background = this.getElementById("scale_background");
		this.scale_value = this.getElementById("scale_value");
		this.scale_text = this.getElementById("scale_text");

		//устанавливаем размер
		this.setSize(w, h, maxVal);

		//фоновые цвета
		if(backgroundColors) {
			this.backgroundColors=backgroundColors;
			this.scale_background.style.background = this.getColor(0, backgroundColors.length / 2);
			this.scale_value.style.background = this.getColor(backgroundColors.length / 2, backgroundColors.length);
		}

	}
	
	/**
	 * Установить цвет для текста
	 */
	this.setColorText=function(color){
		this.scale_text.style.color=color;
	}

	this.getColor = function(s, f) {
		var strcolors;
		for(var i = s; i < f; i++) {
			if(strcolors) {
				strcolors += ",";
			}else{
				strcolors = "linear-gradient(";
			}
			strcolors += this.backgroundColors[i];

		};
		strcolors += ")";
		
		return strcolors;
	}
	/**
	 * Установить новые значения размер для шкалы
	 */
	this.setSize = function(w, h, maxVal) {

		this.w = w;
		this.h = h;
		this.maxVal = maxVal;

		//размеры элементам
		this.setWH(this.scale_background, w, h);
		this.setWH(this.scale_value, w, h);

	}
	/**
	 * Установить значение шкале
	 */
	this.setValue = function(val) {

		var setVal = Math.max(0, Math.min(this.maxVal, val));

		var setW = this.w * (setVal / this.maxVal);

		//установим размер
		this.setWH(this.scale_value, setW, this.h);

		//текст
		this.scale_text.innerHTML = val;

		//округление углов
		this.ele.style.borderRadius = (this.h / 3) + "px";

	}
}