import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import * as firebaseui from 'firebaseui';

const onLoginListeners: any[] = [];
const onLogoutListeners: any[] = [];

firebase.initializeApp({
  apiKey: 'AIzaSyBrpmUa1y5cQxSv0hvt5fJLVwf1OteyJ2g',
  authDomain: 'neuroshima-hex-311119.firebaseapp.com',
  projectId: 'neuroshima-hex-311119',
  storageBucket: 'neuroshima-hex-311119.appspot.com',
  messagingSenderId: '607303186346',
  appId: '1:607303186346:web:3801965553235dfa7e1dd3',
});


const successUrl = new URL('http://localhost:8080/');
successUrl.search = window.location.search;

// https://github.com/firebase/firebaseui-web/blob/master/README.md
const uiConfig = {
  signInSuccessUrl: successUrl.toString(),
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
  tosUrl: 'http://localhost:8080',
  privacyPolicyUrl() {
    window.location.assign('http://localhost:8080');
  },
};

const ui = new firebaseui.auth.AuthUI(firebase.auth());

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // https://firebase.google.com/docs/reference/js/firebase.User
    onLoginListeners.forEach(cb => cb(user));
  } else {
    onLogoutListeners.forEach(cb => cb());
  }
});

window.addEventListener('load', () => {
  ui.start('#login', uiConfig);
});

const firebaseDb = firebase.firestore();

export const onLogin = (cb: any) => onLoginListeners.push(cb);
export const onLogout = (cb: any) => onLogoutListeners.push(cb);
export const db = firebaseDb;
export const firestore = firebase.firestore;
