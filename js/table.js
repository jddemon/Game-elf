/**
 * @ulyanoff_A
 */


function Table() {

    /**
     * Название таблицы в хранилище для сохранения
     */
    this.nameTableStore;
	/**
	 * Массив объектов, представляющих линии таблицы
	 */
	this.lines = new Array();

	/**
	 * В каком порядке сортировать строки таблицы по полям. Указано поле и как сортировать
	 *
	 * {name,1,name2,-1}
	 *
	 * -1 - это сортировка от большему к меньшему
	 *
	 */
	this.orderSortFiled;

	this.init = function(orderSortFiled,nameTableStore) {

        this.nameTableStore=nameTableStore;
		this.orderSortFiled = orderSortFiled;
	}
	
	
	/**
	 * Сохранить таблицу в хранилище
	 */
	this.save=function(){
		var store=new Storage();
		store.init();
		store.setData("localStorage",this.nameTableStore,this.toJSON());
	}
	/**
	 * Загрузить таблицу с хранилища
	 */
	this.load=function(){
		var store=new Storage();
		store.init();
		
		var str=store.getData("localStorage",this.nameTableStore);
		if(str && str.length>0){
			this.fromJSON(str);
		}
	}
	
	/**
	 * Установить таблицу с JSON
	 */
	this.fromJSON=function(json){
		this.lines= JSON.parse(json);
	}
	
	/**
	 * Преобразовать таблицу в JSON
	 */
	this.toJSON=function(){
		return JSON.stringify(this.lines);
	}


    /**
     * Просмотр таблыцы в тестовом режиме
     */
	this.viewTest = function() {

		var strtable = "";
		var strLabel = "";
		var islabel = false;
		for(var i = 0; i < this.lines.length; i++) {
			strtable += "<tr>";
			if(!islabel) {
				strLabel += "<tr>";
			}
			var obj = this.lines[i];

			for(var k in obj) {
				strtable += "<td>" + obj[k] + "</td>";

				if(!islabel) {
					strLabel += "<td><b>" + k + "</b></td>";
				}
			}

			if(!islabel) {
				strLabel += "</tr>";
				islabel = true;
			}
			strtable += "</tr>";

		};
		strtable = "<table>" + strLabel + strtable + "</table>";
		return strtable;
	}
	
	this.add = function(obj) {
		var j = true;
		//текущая позиция
		var thisP = 0;
		//текущее свойство объекта, по которому добавлять
		var thisr = 0;
		//стартовая позция, в какой промежуток добавлять
		var startp = 0;
		//финишная позция, в какой промежуток добавлять
		var finishp = this.lines.length - 1;

		if(this.lines.length > 0) {
			thisP = startp;
			//как сортировать
			var whatSort = this.orderSortFiled[(thisr * 2) + 1];
			//по какому полю
			var fieldsort = this.orderSortFiled[thisr * 2];
			//значние в добавляемом объекте
			var addVal = obj[fieldsort];
			//========проверка есть ли такое самое значение
			var j2 = true;
			while(j2) {
				var issetval = false;
				//=====находим одинаковые
				var setStartP=thisP;
				var setFinishP=finishp;
				for(var i = thisP; i <= finishp; i++) {
					var val = this.lines[i][fieldsort];
					if(val == addVal) {
						
						if(!issetval) {
							setStartP = i;
						}
						issetval = true;
						setFinishP = i;
					} else {

						if(issetval) {
							break;
						}
					}
				};
				
				thisP=setStartP;
				finishp=setFinishP;

                //=======
				if(!issetval) {
					//небыло одинакового
					break;
				} else {
					//есть, одинаковые, нужно добавлять на другом уровне
					if(thisr < (this.orderSortFiled.length / 2) - 1) {
						thisr++;
						whatSort = this.orderSortFiled[(thisr * 2) + 1];
						//пок какому полю
						fieldsort = this.orderSortFiled[thisr * 2];
						addVal = obj[fieldsort];
					} else {
						//нету уровней
						break;
						j2 = false;
					}
				}
			}

			//===========добавляем запись в заданных промежутках
			for(var i = thisP; i <= finishp; i++) {
				//текущее значение
				var thisval = this.lines[i][fieldsort];
				thisP = i;
				if(thisval * whatSort >= addVal * whatSort) {
					break;
				} else {
					thisP++;
				}
			}
		}
		this.lines.splice(thisP, 0, obj);
	}
}