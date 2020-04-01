import React, {Component, useState} from 'react';

import {View, Text, Slider, StyleSheet, Button} from 'react-native';
import TextInput from '../components/TextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import LoadingSpinner from '../components/LoadingSpinner';

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
    if (!title) errors.title = 'Please set a title for your session.';
    if (!description) errors.description = 'Please set a description.';
    if (!startTime)
      errors.startTime = 'Please pick a start time for your session';
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
      let {db, user, navigation} = this.props;
      try {
        this.setState({isLoading: true});
        let doc = await db.collection('sessions').add({
          creatorId: user.id,
          title: title,
          description: description,
          startTime: startTime,
          price: price,
          totalAttendees: 0,
          totalMoney: 0,
        });
        navigation.navigate('Home');
      } catch (e) {
        console.log('error saving');
        this.setState({title: 'ERROR SAVING! ' + e.message, isLoading: false});
      }
    } else {
      this.validate();
    }
  };

  save = async () => {
    let {title, description, startTime, price} = this.state;
    let {db, navigation, route} = this.props;
    try {
      this.setState({isLoading: true});
      let saved = await db
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
      this.setState({title: 'ERROR SAVING! ' + e.message, isLoading: false});
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
      <View style={styles.container}>
        <View style={styles.formSection}>
          <Text style={styles.title}>Title</Text>
          <TextInput
            onChangeText={title => this.setState({title})}
            value={title}
            title="Title"
            placeholder="My dance class"
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
            <Text style={styles.errorMessage}>
              Set a start time for your session.
            </Text>
          ) : null}
        </View>

        <View style={styles.formSection}>
          <Text style={styles.title}>Description</Text>
          <TextInput
            value={description}
            onChangeText={description => this.setState({description})}
            title="Description"
            multiline={true}
            placeholder="I'm going to teach: ... for an hour and half"
            numberOfLines={4}
            error={errors.description}
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
          <Button title="Save" onPress={() => this.submit()} />
        ) : (
          <LoadingSpinner />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  priceMessage: {
    marginLeft: 10,
    marginTop: 5,
  },
  container: {
    height: '100%',
    padding: 20,
    backgroundColor: 'white',
  },
  formSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
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
