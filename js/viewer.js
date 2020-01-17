/**
 * @ulyanoff_A
 */



function Viewer(){
	this.__proto__=new Ui();

	/**
	 * Объекты в мире
	 */
	this.objects=new Array();
	
	/**
	 * Элемент камера
	 */
	this.camera;
	
	
	/**
	 * Для отображения
	 */
	this.viewport;
	
	/**
	 * Координата камеры
	 */
	this.x=0;
	
	
	this.init=function(patternid,w,h){
		this.__proto__.init(patternid);
		
		this.w=w;
		this.h=h;
		
		this.camera=this.getElementById("camera");
		this.viewport=this.getElementById("viewport");
		
		/**
		 * Устанавливаем размер
		 */
		this.setViewportSize(w,h);
	}
	
	/**
	 * Установить размер для отображения
	 */
	this.setViewportSize=function(w,h){
		
		//установка размеров
		this.setWH(this.ele,w,h);
		this.setWH(this.viewport,w,h);
		this.viewport.style.clip="rect(0px,"+w+"px,"+h+"px,0px)";
	}
	
	
	this.run=function(){
		for(var i in this.objects){
			this.objects[i].refresh();
		}
	}
	
	/**
	 * Добавить объект в мир
	 */
	this.addObject=function(ele){
		
		var obj=new ViewObject(ele);
		this.objects.push(obj);
		this.camera.appendChild(ele);
		return obj;
	}
	
	/**
	 * Удалить объект
	 */
	this.removeObject=function(obj){
		for (var i=0; i < this.objects.length; i++) {
		     var checko=this.objects[i];
		     if(checko==obj){
		     	//удаление с массива объектов
		     	this.objects.splice(i,1);
		     	//удаление с отображения
		     	obj.ele.remove();
		     	break;
		     }
		};
	}
	
	/**
	 * Установить камеру в нужное место
	 */
	this.setCamera=function(x){
		this.x=x;
		this.camera.style.left=(-x+(this.w/2))+"px";
	}
}

/**
 * Объект для отображения
 */
function ViewObject(ele){
	ele.style.position="absolute";
	/**
	 * Элемент представляющий объект
	 */
	this.ele=ele;
	/**
	 * Позиция отображения
	 */
	this.x=0;
	/**
	 * Позиция отображения
	 */
	this.y=0;
	/**
	 * Отдаленность
	 */
	this.z=1;
	/**
	 * Ширина объекта, можно оставить пустым, с еденицами
	 */
	this.w;
	/**
	 * Высота объекта, можно оставить пустым, с еденицами
	 */
	this.h;
	/**
	 * Скайлинг
	 */
	this.scaleX=1;
	/**
	 * Скайлинг
	 */
	this.scaleY=1;
	/**
	 * Отражение 1 - нормально, -1 - отражено
	 */
	this.mirrorX=1;
	/**
	 * Отражение 1 - нормально, -1 - отражено
	 */
	this.mirrorY=1;
	/**
	 * Прозрачность
	 */
	this.opacity=1;

	this.init=function(){
	}
	
	/**
	 * Установить прозрачность
	 */
	this.setOpacity=function(opacity){
		this.opacity=opacity;
		this.ele.style.opacity=this.opacity;
	}
	
	/**
	 * Обновить вид по параметрам
	 */
	this.refresh=function(){
		
		this.ele.style.left=this.x+"px";
		this.ele.style.top=this.y+"px";
		if(this.w){
		   this.ele.style.width=this.w;
		}
		if(this.h){
		   this.ele.style.height=this.h;
		}
		this.setOpacity(this.opacity);
		this.ele.style.zIndex=this.z;
		this.ele.style.transform="scale("+(this.scaleX*this.mirrorX)+","+this.scaleY*this.mirrorY+")";
	}
}




