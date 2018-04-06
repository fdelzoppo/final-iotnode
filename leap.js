var Cylon = require('cylon');

//Adresse du serveur où se trouve le LeapMotion
var HOST = "127.0.0.1";
//Port du serveur web
var SRV_PORT = 8080;
//Page html à afficher à la racine
var HTML_PAGE = "index.html";

var http = require("http");
var fs = require("fs");
var url = require("url");


//Serveur web
var server = http.createServer(function (request, response) {

    var pathname = url.parse(request.url).pathname;
    if (pathname != "/favicon.ico") {
		console.log("Request for " + pathname + " received.");
	}
    response.writeHead(200);
	//Get sur la racine renvoie la page html
    if(pathname == "/") {
        html = fs.readFileSync(HTML_PAGE, "utf8");
        response.write(html);
    } else {
        try {
			//Get sur les autres fichiers (javascript)
			script = fs.readFileSync("." + pathname, "utf8");
			response.write(script);
		}
		catch(e) {
			if(pathname != "/favicon.ico") {
				console.log("err opening "+ pathname);
			}
		}
    }
    response.end();
}).listen(SRV_PORT);

var io = require('socket.io').listen(server);

//Utilisation de Cylon.JS pour l'utilisation du LeapMotion
Cylon.robot({
  name: 'leap',
  connections: {
    leapmotion: { 
		adaptor: 'leapmotion'
		 ,host: HOST 
	}
	
  },

  devices: {
    leapmotion: { driver: 'leapmotion' }
  },
  
  


  work: function(my) {
  
  //Détection des gestes
 my.leapmotion.on('gesture', function(gesture) {

   
		//On rentre si on fait plus de 0.5 cercle et que l'on stop (en vue)
        if (gesture.type=='circle' && gesture.state=='stop' && gesture.progress > 0.5 ){
		//sens horaire => selection
            if (gesture.normal[2] < 0) {
                console.log("b"+gesture.toString());
				io.local.emit('message', 'clic');
            };
		//sens anti horaire => retour
            if (gesture.normal[2] > 0) {
                console.log("a"+gesture.toString());
				io.local.emit('message', 'back');
            }
        }
		//Si swipe 
        if (gesture.type=='swipe' && gesture.state=='stop' ){
		
		
		//Position[0] => axe x (Longueur LeapMotion)
		//Position[1] => axe z (Hauteur  LeapMotion)
		//Position[2] => axe y (Largeur du LeapMotion)
		
		
		//Pour savoir si on va à gauche ou à droite on fait position - startPosition
		
		 console.log(gesture);
		//si positif on va à droite
          if(gesture.position[0] - gesture.startPosition[0] > 0)
		  {
		  console.log("droite");
		  io.local.emit('message', 'next');
		  }
		  //si négatif on va a gauche
		  if(gesture.position[0] - gesture.startPosition[0] < 0)
		  {
		  console.log("gauche");
		  io.local.emit('message', 'prev'); 
		  }
        }
            
        
		
    });
	

  }
});


Cylon.start();










