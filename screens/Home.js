import React, {Component} from 'react';
import {View, Text, SectionList, StyleSheet} from 'react-native';
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
              past.push(doc);
            } else {
              upcoming.push(doc);
            }
          });
          this.setState({past: past, upcoming: upcoming, isLoading: false});
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

  render() {
    if (!this.props.user) return null;
    if (this.state.isLoading) return <LoadingSpinner />;
    return (
      <View style={styles.container}>
        <Button
          style={{marginTop: 60}}
          title="Create Session"
          onPress={() => this.props.navigation.navigate('Create Session')}
        />
        <View style={styles.sectionListContainer}>
          <SectionList
            contentContainerStyle={{paddingBottom: 300}}
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
            renderSectionHeader={({section}) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index}
          />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
  },
  sectionHeader: {
    padding: 10,
  },
  sectionHeaderText: {
    fontSize: 24,
    color: 'white',
  },
  sectionListContainer: {},
});

export default Home;
