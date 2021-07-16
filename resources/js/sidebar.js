 function openNav() {
	  document.getElementById("sidebar").style.width = "320px";
	}

	function closeNav() {
	  document.getElementById("sidebar").style.width = "0";
	}
	
	function openconfiguration() {
		window.open('https://'+window.location.hostname+':9469/gui', '_blank');
	}	