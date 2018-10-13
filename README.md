# commonroutesServer

- Current status:
    - Server and App almost done, need to finish details.
    - I'm focusing on having a first stable and usable version
    - The plan is to have the first stable version in the middle of February 2018
- Comments:
  - the code is not a good quality code, as:
    - it was developed in a discontinued way
    - in the process I learned stuff that I didn't know at the beginning
- Future plans:
  - If somebody can do the frontend, maybe we can implement the frontend app in React
  - I can focus on implementing the backend in Go lang

---

- server code: https://github.com/arnaucube/commonroutesServer
- frontend app code: https://github.com/arnaucube/commonroutesApp
- frontend webapp code: https://github.com/arnaucube/commonroutesWebApp
- images server: https://github.com/arnaucube/goImgServer
- admin web: https://github.com/arnaucube/commonroutesAdminWeb
- landing page: https://github.com/arnaucube/commonroutesLandingPage
- telegram bot: https://github.com/arnaucube/commonroutesBot

**Backend:**

- Nodejs + Express + MongoDB
- Go --> for the images server

**Frontend:**

- Angularjs + Ionic



App:

![commonroutes](https://raw.githubusercontent.com/arnaucube/commonroutesApp/master/commonroutes.png "commonroutes")
code: https://github.com/arnaucube/commonroutesApp

---


**To Do Backend and Frontend:**
```
- pagination search
- https (tls/ssl)
```

### Configuration before run:
In controllers/userController.js, define the port of the goImgServer:
```
function postImage(req, res, filename, fileImg) {
    url = "http://127.0.0.1:3001/image";
    [...]
```

#### RESOURCES using:

initial avatars users: [http://www.flaticon.com/packs/animal-icon-collection](http://www.flaticon.com/packs/animal-icon-collection)


---

## API Documentation
This section is not finished.

### GET /travels
Returns a json array with the page travals.
- Pagination option: **/travels?page=2**
    - Each page has a length of 20 travels.

### GET /travels/id/{travelid}
Returns the full json data of a travel.
```json
{
  "_id": "5b582cc8a920010ebdba5445",
  "from": {
    "lat": 43.6170137,
    "long": 13.5170982,
    "name": "Ancona, AN, MAR, Italy"
  },
  "to": {
    "lat": 43.8198253,
    "long": 7.7748827,
    "name": "Sanremo, IM, Liguria, Italy"
  },
  "joins": [],
  "joinPetitions": [],
  "comments": [],
  "title": "Visiting Torri Superiori",
  "user": {
    "_id": "5b3cf604a920010ebdba1111",
    "avatar": "https://imgc.artprintimages.com/img/print/janet-muir-cape-washington-antarctica-adelie-penguin-walks-forward_u-l-pyoufg0.jpg",
    "validated": false,
    "username": "person1",
    "telegram": "person1"
  },
  "date": "2018-08-04T22:00:00.000Z",
  "generateddate": "2018-07-25T07:54:48.000Z",
  "seats": 2,
  "type": "asking",
  "__v": 0
}
```
### GET /users

- Pagination option: **/users?page=2**
    - Each page has a length of 20 users.

### GET /users/id/{userid}

```json
{
  "_id": "5a83528d7ce0482bab4f4111",
  "description": "Hello world",
  "avatar": "https://imgc.artprintimages.com/img/print/janet-muir-cape-washington-antarctica-adelie-penguin-walks-forward_u-l-pyoufg0.jpg",
  "faircoinString": "faircoin address",
  "faircoin": "url/data of QR faircoin address",
  "validated": true,
  "valorations": [],
  "likes": ["5ad4b4f69a32d22cc7848011"],
  "favs": [],
  "travels": [{
    "_id": "5b0a66daab8f07271498a411",
    "from": {
      "lat": 41.816082,
      "long": 2.5138924,
      "name": "Arbúcies, Selva, Girona, Catalonia, 17401, Spain"
    },
    "to": {
      "lat": 41.3828939,
      "long": 2.1774322,
      "name": "Barcelona, BCN, Catalonia, Spain"
    },
    "title": "Arbúcies-Barcelona",
    "date": "2018-05-27T14:00:00.000Z",
    "type": "offering"
  }, {
    "_id": "5b2780f4ab8f07271498a411",
    "from": {
      "lat": 41.3828939,
      "long": 2.1774322,
      "name": "Barcelona, BCN, Catalonia, Spain"
    },
    "to": {
      "lat": 41.1172364,
      "long": 1.2546057,
      "name": "Tarragona, Tarragonès, Tarragona, Catalonia, Spain"
    },
    "title": "going to Tarragona",
    "date": "2018-07-02T08:00:00.000Z",
    "type": "asking"
  }],
  "notifications": [],
  "username": "person2",
  "telegram": "person2",
  "localNode": "Catalunya",
  "__v": 4,
  "validatedBy": {
    "_id": "5a835596c45e042c19d3fb11",
    "username": "commonroutesadmin01"
  }
}
```
