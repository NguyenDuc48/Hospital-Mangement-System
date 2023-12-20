import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/css/owl.carousel.min.css';
// import 'bootstrap/dist/css/slicknav.css';
// // import 'bootstrap/dist/css/flaticon.css';
// import 'bootstrap/dist/css/gijgo.css';
// // import 'bootstrap/dist/css/animate.min.css';
// // import 'bootstrap/dist/css/animated-headline.css';
// import 'bootstrap/dist/css/magnific-popup.css';
// // import 'bootstrap/dist/css/fontawesome-all.min.css';
// import 'bootstrap/dist/css/themify-icons.css';
// import 'bootstrap/dist/css/slick.css';
// import 'bootstrap/dist/css/nice-select.css';
// import 'bootstrap/dist/css/style.css';
// import 'bootstrap/dist/css/ourstyle.css';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
