import React, {Component} from 'react';
import {View, Text, Button, SectionList, StyleSheet} from 'react-native';
import SessionListItem from '../components/SessionListItem';

class Home extends Component {
  state = {
    sessions: [],
    unsubscribeListener: null,
  };

  componentDidMount() {
    let {db, user} = this.props;
    let unsubscribe = db
      .collection('sessions')
      .where('creatorId', '==', user.id)
      .onSnapshot(querySnapshot => {
        var sessions = [];
        querySnapshot.forEach(function(doc) {
          sessions.push(doc.data());
        });
        this.setState({sessions: sessions});
      });

    this.setState({unsubscribeListener: unsubscribe});
  }

  componentWillUnmount() {
    if (this.state.unsubscribeListener) this.state.unsubscribeListener();
  }

  render() {
    if (!this.props.user) return null;
    return (
      <View style={styles.container}>
        <Button
          title="Create Session"
          onPress={() => this.props.navigation.navigate('Create Session')}
        />
        <SectionList
          sections={[{title: 'Upcoming', data: this.state.sessions}]}
          renderItem={sesh => (
            <SessionListItem
              onPress={() => this.props.navigation.navigate('Session')}
              session={sesh.item}
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
  },
});

export default Home;
