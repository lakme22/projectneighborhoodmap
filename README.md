This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

Below you will find some information on how to perform common tasks.<br>
You can find the most recent version of this guide [here](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md).

## Purpose
This app was created for udacity FRONT-END Web Developer Nanodegree.Here you can find the restaurants in Tirunelveli.Also, a search box to filter the places according to the query you type.      

## Folder Structure

After creation, your project should look like this:

```
my-app/
  README.md
  node_modules/
  package.json
  public/
    index.html
    favicon.ico
  src/
    App.css
    App.js
    App.test.js
    index.css
    index.js
    logo.svg
```

For the project to build, **these files must exist with exact filenames**:

- `public/index.html` is the page template;
- `src/index.js` is the JavaScript entry point.

You can delete or rename the other files.

You may create subdirectories inside `src`. For faster rebuilds, only files inside `src` are processed by Webpack.<br>
You need to **put any JS and CSS files inside `src`**, otherwise Webpack won’t see them.

Only files inside `public` can be used from `public/index.html`.<br>
Read instructions below for using assets from JavaScript and HTML.

You can, however, create more top-level directories.<br>
They will not be included in the production build so you can use them for things like documentation.

If you have Git installed and your project is not part of a larger repository, then a new repository will be initialized resulting in an additional `.git/` top-level directory.

## How to Run

In the project directory, you can run:

### `npm install`

Install the dependencies in the local node_modules folder.<br>

In global mode (ie, with -g or --global appended to the command), it installs the current package context (ie, the current working directory) as a global package.


### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](#deployment) for more information.


### `npm install flickrapi --save`

As we have used flickrapi.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `Service Worker`

The service worker works properly in the production mood, not in the development mode.
Trying to fix this issue in future
<https://github.com/facebook/create-react-app/issues/2396>

### `infoWindow`

I have worked oninfowindow,The <click for pictures> link in infowindow is to fetch pictures from flickr, but i couldnot implement my code to fetch data from flickrapi.i am trying to fix this issue in future,I have given the link to <"https://www.tripadvisor.in/Restaurants-g1584851-Tirunelveli_Tirunelveli_District_Tamil_Nadu.html">
  
 



