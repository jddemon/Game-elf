/**
 * @ulyanoff_A
 */

function Geolocation() {

    this.listeners=new Array();

	this.init = function() {

	}
	
	/**
	 * передается объект, в котором методы onPosition и onError
	 * в метод onPosition передается параметер position
	 * "lat=" + position.coords.latitude + ", lon=" + position.coords.longitude
	 * в onError - объект ошибки, или undefiend
	 * 
	 */
	this.addEventListener=function(listener){
		this.listeners.push(listener);
	}

	// на успешность

	this.onPosition=function(position){
		for (var i=0; i < this.listeners.length; i++) {
		  this.listeners[i].onPosition(position);
		  
		};
	}

	//не определенно
	this.onError=function(e){
		for (var i=0; i < this.listeners.length; i++) {
		  this.listeners[i].onError(e);
		  
		};
	}

    /*
    * Функция проверки координат
    */
	this.check = function() {

		if("geolocation" in navigator) {

            navigator.geolocation_classApi=this;
			navigator.geolocation.getCurrentPosition(function(position) {
				 //alert("lat=" + position.coords.latitude + ", lon=" + position.coords.longitude);
				 navigator.geolocation_classApi.onPosition(position);
			}, function(e) {
				navigator.geolocation_classApi.onError(e);
			});
		} else {
			navigator.geolocation_classApi.onError(e);
		}

	}
}