import React, {Component, useState} from 'react';

import {View, Text, Slider, Button, StyleSheet} from 'react-native';
import SwazeButton from '../components/Button';
import TextInput from '../components/TextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingSpinner from '../components/LoadingSpinner';
import CONSTANTS from '../CONSTANTS';

import {createZoomMeeting, editZoomMeeting} from '../api/zoom';
import {ScrollView} from 'react-native-gesture-handler';

class CreateSession extends Component {
  state = {
    title: '',
    description: '',
    price: 5,
    startTime: 0,
    isLoading: false,
    errors: {
      title: '',
      description: '',
      startTime: '',
    },
    isDatePickerVisible: false,
  };

  componentDidMount = async () => {
    let {route, isEditMode, db} = this.props;
    if (isEditMode) {
      let id = route.params.id;
      // pull the session from FireStore:
      this.setState({isPageLoading: true});
      let doc = await db
        .collection('sessions')
        .doc(id)
        .get();
      let session = doc.data();
      this.setState({
        zoomMeetingId: session.zoomMeetingId,
        isPageLoading: false,
        title: session.title,
        description: session.description,
        startTime: new Date(session.startTime.seconds * 1000),
        price: session.price,
        totalAttendees: session.totalAttendees,
      });
    }
  };

  validate = () => {
    let errors = {};
    let {title, description, startTime} = this.state;
    if (!title) errors.title = 'Please choose a title.';
    if (!description)
      errors.description = 'Please describe your class to your audience.';
    if (!startTime)
      errors.startTime = 'Please pick a valid start time for your session';
    this.setState({errors: errors});
  };

  submit = async () => {
    if (this.props.isEditMode) return this.save();
    return this.create();
  };

  create = async () => {
    // Creating a session in FireStore:
    let {title, description, startTime, price} = this.state;
    if (title && description && startTime) {
      this.validate();
      // submit it:
      let {db, user, navigation, firebase} = this.props;
      try {
        this.setState({isLoading: true});
        let userToken = await firebase.auth().currentUser.getIdToken(true);
        let resp = await createZoomMeeting(userToken, title, startTime);
        let zoomMeetingId = resp.data.id;
        await db.collection('sessions').add({
          creatorId: user.id,
          title: title,
          description: description,
          startTime: startTime,
          price: price,
          totalAttendees: 0,
          totalMoney: 0,
          zoomMeetingId: zoomMeetingId,
        });
        navigation.navigate('Home');
      } catch (e) {
        console.log('error saving');
      }
    } else {
      this.validate();
    }
  };

  save = async () => {
    let {title, description, startTime, price, zoomMeetingId} = this.state;
    let {db, navigation, route, firebase} = this.props;
    try {
      this.setState({isLoading: true});
      let userToken = await firebase.auth().currentUser.getIdToken(true);
      let resp = await editZoomMeeting(
        userToken,
        zoomMeetingId,
        title,
        startTime,
      );
      console.log('zoom meeting edited successfully: ', resp.data.id);
      await db
        .collection('sessions')
        .doc(route.params.id)
        .set(
          {
            title: title,
            description: description,
            startTime: startTime,
            price: price,
          },
          {merge: true},
        );
      navigation.navigate('Session');
    } catch (e) {
      console.log('error saving: ', e);
    }
  };

  render() {
    let {
      title,
      isDatePickerVisible,
      description,
      price,
      startTime,
      errors,
      isPageLoading,
      isLoading,
      totalAttendees,
    } = this.state;

    let {isEditMode} = this.props;
    let canChangePrice = true;
    if (isEditMode && totalAttendees > 0) canChangePrice = false;

    if (isPageLoading) return <LoadingSpinner />;
    return (
      <ScrollView
        contentContainerStyle={{paddingBottom: 50}}
        style={styles.container}>
        <View style={styles.formSection}>
          <Text style={styles.title}>Title</Text>
          <TextInput
            style={styles.input}
            onChangeText={title => this.setState({title})}
            value={title}
            placeholder="My dance class"
            maxLength={CONSTANTS.MAX_TITLE_LENGTH}
            error={errors.title}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Start time</Text>
          {
            <Button
              title={startTime ? startTime.toString() : 'select start time'}
              onPress={() => this.setState({isDatePickerVisible: true})}
            />
          }
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={val => {
              this.setState({startTime: val, isDatePickerVisible: false});
            }}
            onCancel={() => this.setState({isDatePickerVisible: false})}
          />
          {errors.startTime ? (
            <Text style={styles.errorMessage}>{errors.startTime}</Text>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Description</Text>
          <TextInput
            style={styles.input}
            value={description}
            onChangeText={description => this.setState({description})}
            multiline={true}
            placeholder="I'm going to teach: ... for an hour and half"
            numberOfLines={4}
            error={errors.description}
            maxLength={CONSTANTS.MAX_DESCRIPTION_LENGTH}
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Session price</Text>
          {!canChangePrice ? (
            <Text style={styles.priceMessage}>
              An attendee has already signed up, therefore you can't change the
              price. If you'd wish to cancel this session reach out to us and
              we'll help you process refunds.
            </Text>
          ) : null}
          <Slider
            disabled={!canChangePrice}
            step={1}
            minimumValue={0}
            maximumValue={100}
            value={price / 5 - 1}
            onValueChange={priceIndex => {
              if (canChangePrice) this.setState({price: priceIndex * 5 + 5});
            }}
            minimumTrackTintColor="#1fb28a"
            maximumTrackTintColor="#d3d3d3"
            thumbTintColor="#b9e4c9"
          />
          <Text style={styles.price}>${price}</Text>
        </View>
        {!isLoading ? (
          <SwazeButton
            title={isEditMode ? 'Save' : 'Create'}
            onPress={() => this.submit()}
          />
        ) : (
          <LoadingSpinner />
        )}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    borderColor: 'white',
    borderWidth: 0,
  },
  priceMessage: {
    marginLeft: 10,
    marginTop: 5,
  },
  container: {
    height: '100%',
    padding: 20,
    backgroundColor: '#F1F2F6',
  },
  formSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: '400',
    color: '#4E0C6D',
  },
  price: {
    fontSize: 64,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  sectionHeader: {
    padding: 10,
  },
  sectionHeaderText: {
    fontSize: 24,
  },
  errorMessage: {
    color: 'red',
    marginLeft: 10,
    marginTop: 2,
  },
});

export default CreateSession;
