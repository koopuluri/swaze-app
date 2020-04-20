import React, {Component} from 'react';
import {
  View,
  Text,
  SectionList,
  StyleSheet,
  TouchableHighlight,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import Button from '../components/Button';
import SessionListItem from '../components/SessionListItem';
import LoadingSpinner from '../components/LoadingSpinner';

class Home extends Component {
  state = {
    sessions: [],
    unsubscribeListener: null,
    isLoading: true,
  };

  componentDidMount() {
    let {db, user} = this.props;
    let unsubscribe = db
      .collection('sessions')
      .orderBy('startTime')
      .where('creatorId', '==', user.id)
      .onSnapshot(
        querySnapshot => {
          let upcoming = [];
          let past = [];
          querySnapshot.forEach(function(doc) {
            let data = doc.data();
            let now = new Date() / 1000;
            if (data.startTime.seconds < now) {
              past.unshift(doc);
            } else {
              upcoming.unshift(doc);
            }
          });
          this.setState({past: past, upcoming, isLoading: false});
        },
        error => {
          if (this.state.unsubscribeListener) this.state.unsubscribeListener();
        },
      );
    this.setState({unsubscribeListener: unsubscribe});
  }

  componentWillUnmount() {
    if (this.state.unsubscribeListener) this.state.unsubscribeListener();
  }

  getBankErrorMessage = () => {
    return (
      <Text
        style={{
          fontSize: 16,
          color: 'red',
          textAlign: 'center',
          paddingLeft: 20,
          paddingRight: 20,
        }}>
        Please connect your card in settings to be able to create sessions and
        accept money from viewers.{' '}
      </Text>
    );
  };

  render() {
    let {user} = this.props;
    if (!user) return null;
    if (this.state.isLoading) return <LoadingSpinner />;
    return (
      <SafeAreaView style={styles.container} flex={1}>
        <Button
          disabled={!user.stripe || !user.stripe.stripe_user_id}
          style={{marginTop: 20}}
          title="Create Session"
          onPress={() => this.props.navigation.navigate('Create Session')}
        />
        {!user.stripe || !user.stripe.stripe_user_id
          ? this.getBankErrorMessage()
          : null}
        <View style={{...styles.sectionListContainer, flex: 1}}>
          <SectionList
            stickySectionHeadersEnabled={false}
            sections={[
              {title: 'Upcoming', data: this.state.upcoming},
              {title: 'Completed', data: this.state.past},
            ]}
            renderItem={sesh => (
              <SessionListItem
                onPress={() => {
                  this.props.navigation.navigate('Session', {id: sesh.item.id});
                }}
                session={sesh.item.data()}
              />
            )}
            renderSectionHeader={({section}) => {
              if (
                section.title === 'Upcoming' &&
                (!this.state.upcoming || this.state.upcoming.length === 0)
              )
                return null;
              if (
                section.title === 'Completed' &&
                (!this.state.past || this.state.upcoming.length === 0)
              )
                return null;
              return (
                <View style={{...styles.sectionHeader, marginTop: 20}}>
                  <Text style={styles.sectionHeaderText}>{section.title}</Text>
                </View>
              );
            }}
            keyExtractor={(item, index) => index}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
  },
  sectionHeader: {
    padding: 10,
  },
  sectionHeaderText: {
    fontSize: 24,
    color: 'black',
    opacity: 0.9,
    fontWeight: '600',
    marginLeft: 10,
  },
  sectionListContainer: {},
});

export default Home;
