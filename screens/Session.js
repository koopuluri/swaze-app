import React, {Component} from 'react';

import {View, Text, StyleSheet, Clipboard} from 'react-native';
import Button from '../components/Button';
import LoadingSpinner from '../components/LoadingSpinner';
import moment from 'moment';
import AttendeeList from '../components/AttendeeList';

import {getUrlForSession} from '../UTIL';
import {TouchableHighlight, ScrollView} from 'react-native-gesture-handler';

import {deleteZoomMeeting} from '../api/zoom';
import Icon from 'react-native-vector-icons/FontAwesome';

class Session extends Component {
  state = {
    isLoading: true,
    session: null,
    error: '',
    copied: false,
  };

  componentDidMount = async () => {
    let {db} = this.props;
    let id = this.props.route.params.id;
    let unsubscribe = db
      .collection('sessions')
      .doc(id)
      .onSnapshot(doc => {
        let data = doc.data();
        this.setState({
          session: {
            ...data,
            startTime: moment(data.startTime.seconds * 1000).format(
              'MMMM Do YYYY, h:mm a',
            ),
            id: doc.id,
          },
          isLoading: false,
        });
      });
    this.setState({unsubscribe: unsubscribe});
  };

  componentWillUnmount = () =>
    this.state.unsubscribe ? this.state.unsubscribe() : null;

  getUrlToCopy = () => {
    let {session, copied} = this.state;
    let url = getUrlForSession(session.id);
    return (
      <TouchableHighlight
        onPress={() => {
          Clipboard.setString(url);
          this.setState({copied: true});
        }}
        underlayColor="#d3d3d3"
        style={styles.url}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={styles.urlText}>{url}</Text>
          {!copied ? (
            <Icon name="copy" size={24} color="gray" />
          ) : (
            <Icon name="check-circle" size={24} color="#00cc00" />
          )}
        </View>
      </TouchableHighlight>
    );
  };

  delete = async () => {
    let {firebase, navigation} = this.props;
    let {session} = this.state;

    try {
      this.setState({isLoading: true});
      let userToken = await firebase.auth().currentUser.getIdToken(true);
      console.log(
        'attempting to delete zoomMeetingId: ',
        session.zoomMeetingId,
      );
      let resp = await deleteZoomMeeting(userToken, session.zoomMeetingId);
      console.log('zoom meeting successfully deleted: ', resp.data.id);

      this.state.unsubscribe();
      // deleting the firestore object:
      await firebase
        .firestore()
        .collection('sessions')
        .doc(session.id)
        .delete();

      console.log('session successfully deleted!');
      navigation.navigate('Home');
    } catch (e) {
      console.error('error deleting the session: ', e);
    }
  };

  render() {
    let {session, isLoading, error} = this.state;
    if (isLoading) return <LoadingSpinner />;
    if (!session) return null;
    return (
      <ScrollView
        contentContainerStyle={{paddingBottom: 50}}
        style={styles.container}>
        {error ? <Text>{error}</Text> : null}
        <View style={styles.topSection}>
          <Text style={styles.title}>{session.title}</Text>
          <Text style={styles.startTime}>{session.startTime}</Text>
          <Text style={styles.duration}>
            {session.duration ? session.duration + ' minutes' : 'No duration'}
          </Text>
          <Text style={styles.price}>
            {'$' +
              session.price +
              ' x ' +
              session.totalAttendees +
              ' = $' +
              session.totalMoney}
          </Text>
          {this.getUrlToCopy()}
          <Text style={styles.description}>{session.description}</Text>
        </View>
        <View style={{marginTop: 40, marginBottom: 60}}>
          <Text style={styles.label}>ATTENDEES</Text>
          <AttendeeList sessionId={session.id} db={this.props.db} />
        </View>
        {session.totalAttendees === 0 ? (
          <Button
            onPress={this.delete}
            title="Delete this session"
            backgroundColor="red"
            textColor="white"
            padding={7}
          />
        ) : null}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    textAlign: 'center',
    padding: 20,
    height: '100%',
    backgroundColor: 'white',
    paddingBottom: 60,
  },

  duration: {
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 20,
    opacity: 0.5,
  },

  topSection: {
    backgroundColor: 'rgba(85, 14, 141, 0.06)',
    padding: 20,
    borderRadius: 20,
  },

  url: {
    textAlign: 'center',
    padding: 10,
    borderTopColor: '#e8e8e8',
    borderTopWidth: 1,
    borderBottomColor: '#e8e8e8',
    borderBottomWidth: 1,
    paddingTop: 20,
    paddingBottom: 20,
    marginBottom: 20,
  },
  urlText: {
    fontSize: 15,
    opacity: 0.7,
  },

  label: {
    textAlign: 'center',
    fontSize: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 15,
    opacity: 0.85,
  },
  startTime: {
    marginBottom: 20,
    fontWeight: '300',
    fontSize: 20,
    color: '#5a6169',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    opacity: 0.7,
  },
  sectionHeader: {
    padding: 10,
  },
  price: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'green',
    opacity: 0.7,
  },
  sectionHeaderText: {
    fontSize: 24,
  },
});

export default Session;
