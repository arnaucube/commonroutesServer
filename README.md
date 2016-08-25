#ComunalCar app


**Backend:**
    Nodejs + Express + MongoDB

**Frontend:**
    Angularjs + Materializecss


##Project Structure:
```
comunalcar/
	server/
		controllers/
			userController.js
			travelController.js
			carController.js
			askfortravelController.js
		models/
			userModel.js
			travelModel.js
			carModel.js
			needtravelModel.js
		node_modules/
		config.js
		server.js
		package.js
		README.md
```


##To Do List:
**Backend:**
```
-signup user			--> done
-loggin user			--> done
-update user profile	--> done
-create new travel		--> done
-update travel			--> done
-delete travel			--> done
-create offeringCar
-update offeringCar
-delete offeringCar
-create askingForTravel (needtravel)
-update askingForTravel
-delete askgingForTravel
-user joins a car
-user joins travel
```

**Frontend:**
```
-signup user
-loggin user
-update user profile
-create new travel
-update travel
-delete travel
-create offeringCar
-update offeringCar
-delete offeringCar
-create askingForTravel
-update askingForTravel
-delete askgingForTravel
```
--------------------
####**PARA LA BASE DE DATOS** [para definir como queremos q esté estructurado, pensando en las funcionalidades que queremos tener]:

**user**:
-username
-password
-description
-icon/avatar
-mail
-phone

**travel**: (seria cuando un user publica un nuevo trayecto que va a hacer)
-title
-description
-owner (user q ha publicado el viaje)
-from
-to
-date
-description
-generateddate (cuando el user genera el aviso)
-seats (plazas de coche disponibles)

**car**: (cuando un user tiene un coche disponible para hacer viajes que se necesiten)
-title
-description
-owner (user q ha publicado el viaje)
-zone (la zona por la que está)
-available (cuando el user esta disponible, marca que esta disponible, si unos dias no podrá, lo desactiva)
-generateddate
-seats (plazas de coche disponibles)

**needtravel**: (cuando un user no dispone de coche y necesita hacer un travel)
-title
-description
-owner (user q ha publicado el asking travel)
-from
-to
-date (las fechas para cuando se necesita el viaje)
-generateddate (cuando el user genera el aviso)
-seats (plazas de coche necesarias)

**collectivizedCar**: (los coches/furgos comunales) --> quizás esto no hace falta, solo usar 'offeringCar' normal con un añadido para notificar que es un coche colectivizado
-owner (user q publica el coche)
-title
-seats (plazas de coche disponibles)

--------------------



####**OTRAS COSAS**:
lo de poner o no un mapa, de entrada no destinaria esfuerzos en eso. Para la primera versión de la aplicación no hace falta, solo añade confort visual, para ver el recorrido, pero de entrada para una app q pone en contacto personas para compartir coche, no es algo imprescindible quizás



####**RESOURCES to use**:

    car icons [http://www.flaticon.com/packs/transportation-7](http://www.flaticon.com/packs/transportation-7)

    css para la app: matterializeCSS [http://materializecss.com/](http://materializecss.com/)

    avatars users: [http://www.flaticon.com/packs/animal-icon-collection](http://www.flaticon.com/packs/animal-icon-collection)
