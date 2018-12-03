<h1 align="center" style="color: #52d36c;">Medea API (Back-End)</h1>

The api goal is to provide different ways to manage the Medea device and get information about the receptor through websockets and http methods.


##  Getting Started
### **Pre-requisites**
- Node.js version 10
- [Yarn package manager](https://yarnpkg.com/en/docs/install#debian-stable)

### **Installation**
Use the following command to install all the dependencies :

```
yarn
```

### **How to use it**
There are three main scripts that you can run :

* starts the api (used in prod)
```
yarn start
``` 

* autoreloads the api when there are changes (used in dev)
```
yarn run dev
``` 

* runs tests to check if all is ok
```
yarn test
``` 

### **Environment variables**
You can use an .env file inside root folder.
(This env is mainly used to show logs on console or save them on logs folder)
```
NODE_ENV=production
```

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





