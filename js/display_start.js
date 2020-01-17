/**
 * @ulyanoff_A
 */


function DisplayStart(){
	this.__proto__=new Display();
	
	
	/**
	 * Инструкция
	 */
	this.instruction;
	/**
	 * Кнопка начать игру
	 */
	this.buttonstartgame;
	/**
	 * поле вода имени
	 */
	this.inputusername;
	
	/**
	 * Лого игры
	 */
	this.logogame;
	
	/**
	 * Активна ли кнопка
	 */
	this.isActiveBUtton;
	
	
	this.init=function(patternid){
		this.__proto__.init(patternid);
		
		
		this.instruction=this.getElementById("instruction");
		this.buttonstartgame=this.getElementById("buttonstartgame");
		this.inputusername=this.getElementById("inputusername");
		
		this.logogame=this.getElementById("logogame");


		this.buttonstartgame.thiso=this;
		this.buttonstartgame.addEventListener("click",this.onClick);
		

		this.inputusername.thiso=this;
		this.inputusername.addEventListener("keyup",this.onTextCahage);
		
		
		this.buttonstartgame.style.opacity=0.5; //прозрачность кнопки
	}
	
	this.onAdd=function(){
		this.__proto__.onAdd();
		
		this.logogame.style.width=(this.game.w*0.7)+"px";
	}
	
	
	this.setActiveButton=function(){
		this.buttonstartgame.style.opacity=1;
		this.isActiveBUtton=true;
	}
	
	
	this.setDeactiveButton=function(){
		
		this.buttonstartgame.style.opacity=0.5;
		this.isActiveBUtton=false;
	}
	
	
	/**
	 * Вернуть имя с поля ввода
	 */
	this.getNameFromInput=function(){
		return this.inputusername.value;
	}
	/**
	 * Проверить введённое имя, по длине введеной
	 */
	this.checkName=function(){
		   
		   var name=this.getNameFromInput();
			if(name.length>1){
				return true;
			}
	}
	
	/**
	 * 
	 * Вызывается, когда меняется текст в текстовом поле
	 * 
	 */
	this.onTextCahage=function(){
		var thiso=this.thiso;
		
		
		if(this==thiso.inputusername){
			
			if(thiso.checkName()){
				//активируем кнопку
				thiso.setActiveButton();
			}else{
				//деактивируем кнопку
				thiso.setDeactiveButton();
			}
		}
	}
	
	/**
	 * Вызывается при клике на объекте
	 */
	this.onClick=function(){
		
		 var thiso=this.thiso;
		
		 if(this==thiso.buttonstartgame){
		 	//клик по кнопке начала игры
		 	if(thiso.isActiveBUtton){
		 		//проверить имя
		 		if(thiso.checkName()){
		 			//устанавливаем имя игрока
		 			thiso.game.nameGamer=thiso.getNameFromInput();
		 			//кнопка активна, можно запустить игру
		 		    thiso.game.setDisplayGame();
		 		}
		 		
		 	}
		 }
	}
	
}
