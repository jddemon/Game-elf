/**
 * @ulyanoff_A
 */


/**
 * Представление умения 
 */
function Skill(){
	this.__proto__=new Ui();
	
	
	/**
	 * Элемент картинки скила
	 */
	this.img_skill;
	/**
	 * перезарядка скила
	 */
	this.scale_skill;
	/**
	 * Текст для скила, для отображения кнопки использования
	 */
	this.text_skill;
	/**
	 * Внутри картинка скила
	 */
	this.forimage;
	
	/**
	 * patternid - какой шаблон для отображения
	 * imgsrc - адрес картинки скила
	 * textskill - кнопка сила
	 */
	this.init=function(patternid,imgsrc,textskill){
		this.__proto__.init(patternid);
		this.img_skill=this.getElementById("img_skill");
		this.scale_skill=this.getElementById("scale_skill");
		this.text_skill=this.getElementById("text_skill");
		this.forimage=this.getElementById("forimage");
		this.img_skill.setAttribute("src",imgsrc);
		this.text_skill.innerHTML=textskill;
	}

	/**
	 * Установить прогресс скила
	 */
	this.setScaleSkill=function(percent){
		this.scale_skill.style.width=percent+"%";
	}
}
