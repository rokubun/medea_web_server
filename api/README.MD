<h1 align="center" style="color: #52d36c;">Medea API (Back-End)</h1>

![Version](https://d25lcipzij17d.cloudfront.net/badge.svg?id=gh&type=6&v=0.0.1)

The goal of the api is to manage an open software called rtklib to pass information in real-time to all clients connected.

Written with javascript using node.js


##  Getting Started
### **Pre-requisites**
- Node.js (recommended v10.1.0)

### **Installation**
Use the following command to install all the dependencies :

```
npm install
```


### **How to use it**
There are three main scripts that you can run :

* starts the api (used in prod)
```
npm start
``` 

* autoreloads the api when there are changes (used in dev)
```
npm run dev
``` 

* runs tests to check if all is ok
```
npm test
``` 

### **Environment variables**
You can use an .env file inside root folder.
(This env is mainly used to show logs on console or save them on logs folder)
```
NODE_ENV=production
```

## How to debug the API remotely
Sometimes we want to debug the API remotely, for that we will need to some do stuff.

First, to debug easily the medea device you must use a port forwarding via ssh :
```ssh -f -o ExitOnForwardFailure=yes -L 5858:127.0.0.1:5858 user@medeaip sleep 10```

Next step, configure your IDE to point to localhost, in this case we are using visual studio code :
```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Medea Forwarding",
      "port": 5858
    }
  ]
}
```

Remember before to launch the attach, via ssh use ```npm run``` and pass it a script name to run it properly, check the available scripts in package.json.

## Technologies
---------------------------------------
<p align="center">
  <a href="https://github.com/eslint/eslint" alt="ESLint">
    <img height="70" src="https://user-images.githubusercontent.com/4168389/45922421-e71ee400-becb-11e8-9134-22cc476008f3.png" />
  </a>
  <a href="https://github.com/mochajs/mocha" alt="Mocha">
    <img height="70" src="https://user-images.githubusercontent.com/4168389/45922483-3fa2b100-becd-11e8-9ffa-1e5f3f789c5c.png" />
  </a>
  <a href="https://github.com/expressjs/express" alt="Express">
    <img height="70" src="https://camo.githubusercontent.com/fc61dcbdb7a6e49d3adecc12194b24ab20dfa25b/68747470733a2f2f692e636c6f756475702e636f6d2f7a6659366c4c376546612d3330303078333030302e706e67" />
  </a>
  <a href="https://github.com/infusion/GPS.js" alt="Mocha">
    <img height="70" src="https://github.com/infusion/GPS.js/raw/master/res/logo.png?raw=true" />
  </a>
  <a href="https://github.com/socketio/socket.io" alt="Socket">
    <img height="70" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYDugQxNV9L2f5GbANLfoJAivFvcGbsrlmk63GUCUaOfkjNiYUEg" />
  </a>

</p>





