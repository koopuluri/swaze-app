/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {Component} from 'react';
import {View, Button, Linking, ActivityIndicator} from 'react-native';
import LoginPage from './screens/Login';
import MainNavigationContainer from './components/MainNavigationContainer';

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
    unsubscribe: null,
  };

  fetchAndSetCurrentUser = async () => {
    db = firebase.firestore();
    let id = firebase.auth().currentUser.uid;
    try {
      let unsubscribe = db
        .collection('users')
        .doc(id)
        .onSnapshot(doc => {
          if (doc.exists) {
            this.setState({
              currentUser: {
                ...doc.data(),
                id: id,
              },
            });
            this.setState({isLoading: false});
          }
        });
      this.setState({unsubscribe: unsubscribe});
    } catch (e) {
      console.error(e);
    }
  };

  componentDidMount = async () => {
    firebase.auth().onAuthStateChanged(async user => {
      if (user) {
        this.fetchAndSetCurrentUser();
      } else {
        if (this.state.unsubscribe) this.state.unsubscribe();
        this.setState({currentUser: null});
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

  logout = async () => {
    try {
      if (this.state.unsubscribe) this.state.unsubscribe();
      await firebase.auth().signOut();
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  render() {
    let {currentUser} = this.state;
    if (!currentUser)
      return (
        <LoginPage
          signInWithCustomToken={async token =>
            firebase.auth().signInWithCustomToken(token)
          }
          completeSignIn={this.completeSignIn}
        />
      );

    let db = firebase.firestore();
    if (this.state.isLoading) return <LoadingSpinner />;

    return (
      <MainNavigationContainer
        logout={this.logout}
        currentUser={this.state.currentUser}
        db={db}
      />
    );
  }
}

export default App;
