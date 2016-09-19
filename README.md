#CollectiveCar app

frontend app code: https://github.com/idoctnef/collectivecarApp

**Backend:**
    Nodejs + Express + MongoDB

**Frontend:**
    Angularjs + Ionic + MaterialDesign




##To Do List:
**Backend and Frontend:**
```
-signup user	                                                  		--> done
-loggin user	                                                  		--> done
-update user profile                                              	--> done
-create new travel	                                               	--> done
-update travel		                                                 	--> done
-delete travel		                                                 	--> done
-create offeringCar                                                	--> done
-update offeringCar
-delete offeringCar                                                 --> done
-create askingForTravel (needtravel)                                --> done
-update askingForTravel
-delete askgingForTravel                                            --> done
-create askingPackage (need transport package)                      --> done
-update askingPackage
-delete askgingPackage                                              --> done
-user joins a car                                                   --> done
-user offer car to a travel                                         --> done
-user offer car to a askingpackage                                  --> done
-user unjoins a car                                                 --> done
-user unoffer car to a travel                                       --> done
-user unoffer car to a askingpackage                                --> done
-comment publication(car, travel, package)                          --> done
-valorating users system

-UX design
-interface graphic design
-icons
-api more secure and robust (comprovations, hash passwords, ...)

-web page (webapp) --> (de moment es pot penjar la app en versió web tal qual,
  que es podrà fer servir des d'un navegador com si fós la app)
```


--------------------
####**PARA LA BASE DE DATOS** [para definir como queremos q esté estructurado, pensando en las funcionalidades que queremos tener]:


```
var userSchema = new Schema({
    username: { type: String },
    password: { type: String },
    description:   { type: String },
    avatar:   { type: String },
    mail:   { type: String },
    phone: { type: String },
    telegram: { type: String }
})
var travelSchema = new Schema({
    title: { type: String },
    description: { type: String },
    owner:   { type: String },
    from: { type: String },
    to: { type: String },
    date: { type: Date },
    periodic: { type: Boolean },
    generateddate: { type: Date },
    seats: { type: Number },
    package: { type: Boolean },
    icon: { type: String },
    phone: { type: Number },
    telegram: { type: String },
    collectivized: { type: Boolean },
    modality: { type: String } //if is an offering travel or asking for travel
})
var joinSchema = new Schema({
    travelId: { type: String },
    joinedUserId: { type: String },
    joinedUsername: { type: String },
    acceptedUserId: { type: String },
    joinedAvatar: { type: String }

});
var commentSchema = new Schema({
    travelId: { type: String },
    commentUserId: { type: String },
    commentUsername: { type: String },
    comment: { type: String },
    commentAvatar: { type: String }

});
```
--------------------


####**RESOURCES using**:

car icons [http://www.flaticon.com/packs/transportation-7](http://www.flaticon.com/packs/transportation-7)

css para la app: matterializeCSS [http://materializecss.com/](http://materializecss.com/)

avatars users: [http://www.flaticon.com/packs/animal-icon-collection](http://www.flaticon.com/packs/animal-icon-collection)





mirar per fer hash de passwords https://www.npmjs.com/package/bcrypt-nodejs
