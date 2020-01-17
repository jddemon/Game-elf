/**
 * @ulyanoff_A
 */

function DisplayResult() {
	this.__proto__ = new Display();

	/**
	 * Таблица результатов
	 */
	this.table_result=null;
	/**
	 * Кнопка начала новой игры
	 */
	this.button_start_new_game=null;
	
	
	
	this.init = function(patternid) {
		this.__proto__.init(patternid);

		this.table_result = this.getElementById("table_result");
		this.button_start_new_game = this.getElementById("button_start_new_game");
		

		this.button_start_new_game.thiso = this;
		this.button_start_new_game.addEventListener("click", this.onClick);

	}
	/**
	 * Показать результаты
	 */
	this.showResult = function() {

		var elements = this.game.score.getResult();
		for(var i in elements){
			this.table_result.insertAdjacentElement("beforeend", elements[i]);
		}
		

	}

    /**
     * Корректировака размеров елементов
     */
	this.checkSize = function() {

		
		//==========получаем все объекты которым нужно подправить размеры
		var arrClass=new Array("labeltableresult","labeltableresultresult");
		var eles=new Array();
		for (var i=0; i < arrClass.length; i++) {
		    var className=arrClass[i];
		    var elesByClass=this.ele.getElementsByClassName(className);
		    for(var i2 = 0; i2 < elesByClass.length; i2++) {
                  eles.push(elesByClass.item(i2));
			}
		};
		
		
		//=====================размеры
		
		
		var fontSizeSet = 50; // размер шрифта
		var j = true; //для выхода из цикла
		var breakb = 0;// запосный break
		while(j) {

			var b = this.table_result.getBoundingClientRect();
			var w = b.right - b.left;

			if((w > this.game.w * 0.9 || w > this.game.h * 0.7) && fontSizeSet > 8) {
				//необходимо уменшить шрифт
				fontSizeSet--;

				//устанавливаем всем елементам
				for(var i = 0; i < eles.length; i++) {

					var ele = eles[i];
					ele.style.fontSize = fontSizeSet + "pt";

				}

			} else {
				break;
			}
			breakb++;
			if(breakb > 1000) {
				break;
			}

		}

		this.setW(this.table_result, this.game.w * 0.8);

	}

	this.onAdd = function() {
		this.__proto__.onAdd();


        this.showResult();

        this.checkSize();
	}
	/**
	 * Вызывается при клике на объекте
	 */
	this.onClick = function() {

		var thiso = this.thiso;

		if(this == thiso.button_start_new_game) {
			//новая игра
			thiso.game.setDisplayGame();

		}
	}
}