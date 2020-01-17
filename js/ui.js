/**
 * @ulyanoff_A
 */

function Ui(){
	
	/**
	 * Элемент, вставлять куда угодно можно
	 */
	this.ele;
	/**
	 * ширина по умолчанию
	 */
	this.w="100%";
	/**
	 * Высота по умолчанию
	 */
	this.h="100%";


	this.init=function(patternid){
		var elepattern=document.getElementById(patternid);
		this.ele=elepattern.cloneNode(true);
		//очистка идентификатора
		this.ele.id="";
		this.ele.style.animation="0.3s cubic-bezier(.29, 1.01, 1, -0.68) 0s 1 normal backwards openui";
	}
	
	
	
	this.open=function(){
		if(this.ele){
			this.ele.style.width=this.w;
			this.ele.style.height=this.h;
			this.ele.style.visibility="visible";
		}
	}
	
	this.close=function(){
		if(this.ele){
			this.w=this.ele.style.width;
			this.h=this.ele.style.height;
			this.ele.style.width="0px";
			this.ele.style.height="0px";
			this.ele.style.visibility="visible";
		}
	}
	

	/**
	 * Вернуть элемент с текущей ui по id
	 */
	this.getElementById=function(id){
		return this.ele.querySelectorAll("#"+id)[0];
	}
	
	/**
	 * Установить ширину элементу
	 * w - просто число
	 */
	this.setW=function(ele,w){
		ele.style.width=w+"px";
	}
	/**
	 * Установить высоту элементу
	 * h - просто число
	 */
	this.setH=function(ele,h){
		ele.style.height=h+"px";
	}
	
	/**
	 * Установить размеры элементу
	 * w h просто цифры
	 */
	this.setWH=function(ele,w,h){
		this.setW(ele,w);
		this.setH(ele,h);
	}
}
