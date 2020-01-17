/**
 * @ulyanoff_A
 */

function Game(){

	/**
	 * Размер экрана игры width
	 */
	this.w=document.documentElement.clientWidth*0.6;
	
	/**
	 * Размер экрана игры hight
	 */
	this.h=this.w*0.7;
	
	/**
	 * текущий установленный дисплей
	 */
	this.thisDisplay;
	
	/**
	 * Дисплей игры
	 */
	this.displayGame;
	
	/**
	 * Старотовый экран
	 */
	this.displayStart;
	
	/**
	 * Экран результатов
	 */
	this.displayResult;
	
	/**
	 * Контейнер для экранов
	 */
	this.displays;
	
	/**
	 * Результаты
	 */
	this.score;
	
	/**
	 * имя игрока
	 */
	this.nameGamer;
	
	
	this.init=function(){
		
		
		this.displays=document.getElementById("displays");
		
		
		window.game=this;
		window.addEventListener("keydown",this.keyBoardListenerDown);
		window.addEventListener("keyup",this.keyBoardListenerUp);
		window.addEventListener("resize",this.onResize);
		
		//установка размера окна игры
		this.setGameSize();
		
		//загрузка результатов
		this.score=new Score();
		this.score.init();

		//ставим стартовый экран
        this.setDisplayStart();


        window.gameobject=this;
		setInterval(this.run,10);
		
	}
    /**
    * Установить размер игры
    */
	this.setGameSize=function(w,h){
		
		this.displays.style.width=this.w+"px";
		this.displays.style.height=this.h+"px";
	}

    /**
     * Установить начальный дисплей
     */
    this.setDisplayStart=function(){
    	
    	this.displayStart=new DisplayStart();
    	this.displayStart.init("pattern_display_start");
    	
    	//устанавливаем дисплей
    	this.setDisplay(this.displayStart);
    }
    
    /**
     * Установить игровой дисплей
     */
    this.setDisplayGame=function(){
    	
    	this.displayGame=new DisplayGame();
    	this.displayGame.init("pattern_display_game");
    	
    	//устанавливаем дисплей
    	this.setDisplay(this.displayGame);
    }
    
    /**
     * Установить экран результатов
     */
    this.setDisplayResult=function(){
    	
    	this.displayResult=new DisplayResult();
    	this.displayResult.init("pattern_table_result");
    	
    	//устанавливаем дисплей
    	this.setDisplay(this.displayResult);
    }
    
    
    /**
     * поток игры
     */
    this.run=function(){
    	var game=this.gameobject;
    	
    	if(game.thisDisplay){
    	   game.thisDisplay.run();
    	}
    }
	
	
	/**
	 * Установить экран для отображения
	 */
	this.setDisplay=function(dis){
		
		
		if(this.thisDisplay){
			this.thisDisplay.ele.remove();
		}
		
		this.thisDisplay=dis;
		dis.game=this;
		//открываем
		dis.open();
		
		//вставляем экран
		this.displays.appendChild(dis.ele);
		
		//поставили эран
		dis.onAdd();
		
	}
	
	/**
	 * Вызывается, когда поменялся размер окна браузера или ориентация устройства, ли ещё что либо
	 */
	this.onResize=function(){
		
	}
	
	this.keyBoardListenerUp=function(e){
		
		var th=window.game;
		
		if(th.thisDisplay){
			th.thisDisplay.onKeyUp(e.keyCode);
		}
		
	}
	this.keyBoardListenerDown=function(e){
		
		var th=window.game;
		
		if(th.thisDisplay){
			th.thisDisplay.onKeyDown(e.keyCode);
		}
	}
}
new Game().init();



