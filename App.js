/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Button, Linking, ActivityIndicator} from 'react-native';
import LoginPage from './pages/Login';
import Home from './pages/Home';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

import {decode, encode} from 'base-64';
import LoadingSpinner from './components/LoadingSpinner';
global.crypto = require('@firebase/firestore');
global.crypto.getRandomValues = byteArray => {
  for (let i = 0; i < byteArray.length; i++) {
    byteArray[i] = Math.floor(256 * Math.random());
  }
};

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

var firebaseConfig = {
  apiKey: 'AIzaSyCxfLEkFeJMxsaX3JxOVAfRODS3vud-TjU',
  authDomain: 'swaze-d8f83.firebaseapp.com',
  databaseURL: 'https://swaze-d8f83.firebaseio.com',
  projectId: 'swaze-d8f83',
  storageBucket: 'swaze-d8f83.appspot.com',
  messagingSenderId: '572770145804',
  appId: '1:572770145804:web:4e20f5dab789de4fa1c029',
  measurementId: 'G-XRH96MQ3WH',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

class App extends Component {
  state = {
    currentUser: null,
    isLoading: true,
  };

  fetchAndSetCurrentUser = async () => {
    db = firebase.firestore();
    let id = firebase.auth().currentUser.uid;
    let doc = await db
      .collection('users')
      .doc(id)
      .get();
    if (doc.exists)
      return this.setState({currentUser: doc.data(), isLoading: false});
    console.log('could not fetch user? ', id);
    this.setState({isLoading: false});
  };

  componentDidMount = async () => {
    if (firebase.auth().currentUser && !this.state.currentUser)
      this.fetchAndSetCurrentUser();

    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        console.log('we now have a signed in user!!!');
        console.log('pulling the user from the user id: ', user.uid);
        // Pull the user and set it to the state:
        this.fetchAndSetCurrentUser();
      } else {
        // No user is signed in.
      }
    });
  };

  signInWithCustomToken = async custom_token => {
    try {
      await firebase.auth().signInWithCustomToken(custom_token);
    } catch (e) {
      console.log('error signing in with custom token: ', e);
    }
  };
  render() {
    if (this.state.isLoading) return <LoadingSpinner />;
    if (!firebase.auth().currentUser) {
      return <LoginPage />;
    } else {
      return <Home user={this.state.currentUser} />;
    }
  }
}
export default App;
