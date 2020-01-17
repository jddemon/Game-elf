/**
 * @ulyanoff_A
 */



function Display(){
	this.__proto__=new Ui();
	
	
	/**
	 * Ссыка на игру.
	 */
	this.game;
	
	
	this.init=function(patternid){
		this.__proto__.init(patternid);
		
		this.ele.style.background="left 0% / 100% 100% repeat-x url(\"./img/bgpages.png\")";
		
		
	}
	
	/**
	 * Вызывается когда дисплей добавлен
	 */
	this.onAdd=function(){
		
	}
	/**
	 * Вызывается когда дисплей убран
	 */
	this.onRemove=function(){
		
	}
	
	/**
	 * Поток дисплея
	 */
	this.run=function(){
		
	}
	
	/**
	 * Удалить все ресурсы созданные для экрана, если этот экран уже не будет нужен
	 */
	this.recicle=function(){
		
	}
	
	/**
	 * @public
	 * Вызывается, когда определённая клавиша отпущена
	 */
	this.onKeyUp=function(e){
		
	}
	/**
	 * @public
	 * Вызывается, когда определённая клавиша нажата
	 */
	this.onKeyDown=function(e){
		
	}
}







