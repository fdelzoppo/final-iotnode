/** fichier json dans lequel on a l'architecture des menus **/
var JSON_FILENAME = "menus.json";

/** tableau contenant chaque niveau dans lequel on navigue **/
var levels = new Array();

/** niveau actuel dans lequel on est **/
var currentLevel;

/** bouton en surbrillance **/
var focusedBtn = 0;


/** au chargement de la page, parser le json et afficher les premiers boutons**/
(function() {
	$.ajax({url: JSON_FILENAME, success: function(result){
        var jsonMenus = JSON.parse(result);
		currentLevel = jsonMenus.root;
		levels.push(currentLevel); // [0] = root
		
		var subLevel = 0;
		$.each( currentLevel, function( key, value ){
			var focusedClass = (subLevel == 0 ? " focused" : ""); // focus le 1er bouton quand la page charge
			$("#body").append("<a class='btn" + focusedClass + "' href='#' id='btn_" + subLevel + "' onclick='printChilds("+subLevel+");'>" + key + "</a>");
			subLevel++;
		});
    }});
})();

/** fonction servant à afficher des boutons enfants et à remonter d'un niveau **/
function printChilds(subLevelAsked) {
	var tmpLevel;
	var found = 0;
	// si le niveau demandé est -1 ca veut dire qu'on remonte d'un niveau en arriere
	if(subLevelAsked == -1) {
		// retirer un niveau dans le tableau
		levels.pop();
		found = 1; // le niveau a été trouvé
		// le niveau actuel sera le niveau parent
		tmpLevel = levels[levels.length - 1];
	}
	
	// si found est toujours à 0
	// alors c'est qu'on cherche à afficher les boutons enfants
	var subLevel = 0;
	if(found == 0) {
		$.each( currentLevel, function( key, value ){
			// si on trouve le bon niveau parmis les enfants
			if(subLevelAsked == subLevel) {
				found = 2; // le niveau a été trouvé
				tmpLevel = value; // le niveau actuel sera le niveau trouvé
				levels.push(value); // on ajoute le niveau dans le tableau
				return false; // break loop
			}
			subLevel++;
		});
	}
	
	// Si on a pu trouver un niveau à afficher
	if(found != 0) {
		$("#body").empty(); // vider le id="body"
		
		// si notre tableau contient plus d'un niveau
		// alors ça veut dire qu'on est toujours pas à la racine
		// donc on affiche un bouton pour remonter au parent
		focusedBtn = -2;
		if(levels.length > 1) {
			focusedBtn = -1; // focus le 1er bouton quand on change le menu
			$("#body").append("<a class='btn focused' href='#' id='btn_-1' onclick='printChilds(-1);'>..</a>");
		}
		
		currentLevel = tmpLevel;
		
		subLevel = 0;
		// pour chaque enfant du niveau actuel
		// afficher un bouton cliquable
		$.each( currentLevel, function( subkey, subvalue ){
			var onclick="";
			
			if(!subkey.startsWith("_")) {
				onclick = " onclick='printChilds("+subLevel+");'";
			}
			// les enfants avec un nom commencant par _ sont des actions qui déclencheront du MQTT
			else {
				onclick = " onclick='alert(69);'";
				subkey = subkey.substring(1);
			}
			
			// Mettre la classe de focus sur le 1er bouton si on a pas eu de bouton ".." (retour) avant
			var focusedClass = (subLevel == 0 && focusedBtn == -2 ? " focused" : "");
			if(focusedClass != "") {
				focusedBtn = 0;
			}
			$("#body").append("<a class='btn" + focusedClass + "' id='btn_" + subLevel + "' href='#'" + onclick + ">" + subkey + "</a>");
			subLevel++;
		});
	}
}

/** Mettre en surbrillance le bouton précédent **/
function prevBtn() {
	$("#btn_"+focusedBtn).removeClass("focused");
	focusedBtn --;
	if(focusedBtn <= -1) {
		focusedBtn = -1;
		if(!$("#btn_"+focusedBtn).length) {
			// btn_-1 existe pas
			// on met btn_0
			focusedBtn = 0;
		}
	}
	$("#btn_"+focusedBtn).addClass("focused");
}

/** Mettre en surbrillance le bouton suivant **/
function nextBtn() {
	$("#btn_"+focusedBtn).removeClass("focused");
	focusedBtn ++;
	if(!$("#btn_"+focusedBtn).length) {
		// btn_X existe pas
		// on met btn_X-1
		focusedBtn --;
	}
	$("#btn_"+focusedBtn).addClass("focused");
}

/** Sélectionner le bouton actuel **/
function clicBtn() {
	var theBtn = document.getElementById('btn_'+focusedBtn);
	theBtn.click();
}

/** Retour au parent ? **/
function backBtn() {
	if($("#btn_-1").length) {
		var theBtn = document.getElementById('btn_-1');
		theBtn.click();
	}
}