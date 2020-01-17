/**
 * @ulyanoff_A
 */


function FPS(){
	
	
	/**
	 * Получить миллисекунды
	 */
	this.millis=function(){
		return new Date().getTime();
	}
	
	/**
	 * Кадров в секунду. Показывает сколько кадров в секунду
	 */
	this.fps=0;
	
	/**
	 * Сколько времени прошло с прошлого кадра например
	 */
	this.timeFrame=0;
	
	
	/**
	 * Текущее время
	 */
	this.thistime=this.millis();
	
	/**
	 * Время в прошлом кадре
	 */
	this.timeLast=this.thistime;
	
	/**
	 * Скайлинг некоторых значений. Если нужно что либо тратить в секунду, то то, на сколько
	 * нужно потратить умножаем на sc
	 */
	this.sc=this.timeFrame/1000;
	
	
	
	/**
	 * Вызывать в каждом кадре один раз
	 */
	this.run=function(){
		
		
			this.timeLast=this.thistime;
			this.thistime=this.millis();
			
			this.timeFrame=this.thistime-this.timeLast;
			
			//если прошло очень мало, то ставим что что-то прошло минимально мало
			if(this.timeFrame>0){
				this.fps=1000/this.timeFrame;
			}
			
			this.sc=this.timeFrame/1000;
			
	}
	
	
	
}