/**
 * @ulyanoff_A
 */

function Timer(ele){
	
	
	this.eleBackTime=ele;
	this.toTime;
	this.timeStart;
	
	/**
	 * 00000 ли на таймере
	 */
	this.isEnd=false;
	
	this.listenersEnd=new Array();
	
	/**
	 * Сколько времени на паузе
	 */
	this.timePause=0;
	
	/**
	 * Время, когда нажали на паузу
	 */
	this.timeStsrtPause;
	
	/**
	 * На паузе ли 
	 */
	this.isPause;
	
	/**
	 * Текущее время
	 */
	this.thisTime=null;
	
	this.init=function(){
		window.thisObjTimer=this;
	    
	}
	
	/**
	 * Добавить прослушиватель события конца таймера
	 * addListenerEnd(function(BackTime){});
	 */
	this.addListenerEnd=function(listener){
		this.listenersEnd.push(listener);
	}
	
	
	/**
	 * начать секундомер
	 */
	this.startSec=function(time){
		this.timePause=0;
		this.isPause=false;
		this.timeStart=time;
		
	}
	
	/**
	 * Поставить на паузу
	 */
	this.pause=function(time){
		 this.timeStsrtPause=this.thisTime;
		 this.isPause=true;
	}
	
	/**
	 * продолжить таймер
	 */
	this.resume=function(){
		this.timePause+=this.thisTime-this.timeStsrtPause;
		this.isPause=false;
	}

/*
	this.setToTime=function(toTime){
		this.isEnd=false;
		this.toTime=toTime;
	}
*/
	/*
	* Метод ддя установки текста элемену предназначенному для показа времени
	*/
	this.setStrTime=function(str){
		this.eleBackTime.innerHTML=str;
	}

	/**
	 * timeback - какое время показать
	 * метод времени в миллисекундах
	 */
	this.getTimeString=function(timeback){

		var strtime="00:00";
		if(timeback>0){
			strtime="";
		var arr=new Array(60*1000,1000);
		var isnull=true;
		for(var i=0;i<arr.length;i++){
                var d=arr[i];  //
                var os=timeback%d; //остаток от деления
                var h=(timeback/d); //для целой части от деления
                if(h<0){
                    h=0;
                }
                var newh=Math.round(h);
                if(newh>h){
                    h=newh-1;
                }

                h=Math.round(h);
                if(h>0){
                    isnull=false;
                }
                    if(strtime!=""){
                        strtime+=":";
                    }
                    var strh=""+h;
                    if(strh.length==1){
                        strh="0"+strh;
                    }
                    strtime+=strh;
                    timeback=os;

            }
		}
		var obj=new Object();
		obj.strtime=strtime;
		obj.isnull=isnull;
		return obj
}
	
	/**
	 * Вернуть время на таймере в миллисекундах
	 */
	this.getTime=function(time){
		var timeback=time-this.timeStart;
		//======учет паузы
		timeback-=this.timePause;
		if(this.isPause){
			//если на паузе
			timeback-=time-this.timeStsrtPause;
		}
		return timeback;
	}

	this.run=function(time){
		var th=window.thisObjTimer;
		th.thisTime=time;
		var time=th.getTime(time);
		var retu=th.getTimeString(time);
		var strtime=retu.strtime;
		th.setStrTime(strtime);
	}
}
