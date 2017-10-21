# commonroutesServer

- server code: https://github.com/arnaucode/commonroutesServer
- frontend app code: https://github.com/arnaucode/commonroutesApp
- frontend webapp code: https://github.com/arnaucode/commonroutesWebApp
- images server: https://github.com/arnaucode/goImgServer
- admin web: https://github.com/arnaucode/commonroutesAdminWeb
- landing page: https://github.com/arnaucode/commonroutesLandingPage

**Backend:**

- Nodejs + Express + MongoDB
- Go --> for the images server

**Frontend:**

- Angularjs + Ionic



App:

![commonroutes](https://raw.githubusercontent.com/arnaucode/commonroutesApp/master/commonroutes.png "commonroutes")
code: https://github.com/arnaucode/commonroutesApp

--------------------


**To Do Backend and Frontend:**
```
- pagination search
- https (tls/ssl)
```

### Configuration before run:
In the file adminConfig.js, put the sha256 of the password that allows to create new admins:
```js
module.exports = {
    'passwordHash': 'Bzij4hEeEUpmXTWyS+X0LR+YcA8WFjP2P7qhW0sxA6s='/*password raw: adminPassword*/
};
```


#### RESOURCES using:

initial avatars users: [http://www.flaticon.com/packs/animal-icon-collection](http://www.flaticon.com/packs/animal-icon-collection)
