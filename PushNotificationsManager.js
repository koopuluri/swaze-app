import React from 'react';
import {Platform, View} from 'react-native';
import {Notifications} from 'react-native-notifications';

export default class PushNotificationManager extends React.Component {
  componentDidMount() {
    this.registerDevice();
    this.registerNotificationEvents();
  }

  registerDevice = () => {
    Notifications.events().registerRemoteNotificationsRegistered(event => {
      // TODO: Send the token to my server so it could send back push notifications...
      this.props.onDeviceTokenReceived(event.deviceToken);
    });

    Notifications.events().registerRemoteNotificationsRegistrationFailed(
      event => {
        console.error(event);
      },
    );

    Notifications.registerRemoteNotifications();
  };

  registerNotificationEvents = () => {
    Notifications.events().registerNotificationReceivedForeground(
      (notification, completion) => {
        console.log('Notification Received - Foreground', notification);
        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: true});
      },
    );

    Notifications.events().registerNotificationOpened(
      (notification, completion) => {
        // console.log('Notification opened by device user', notification);
        // console.log(
        //   `Notification opened with an action identifier: ${
        //     notification.identifier
        //   }`,
        // );

        // let whatNotificationLooksLike = {
        //   identifier: '392ECAFB-29BC-43EC-A9C2-C83FF5E2DC78',
        //   payload: {
        //     aps: {alert: [Object]},
        //     body: "Bob Marley joined 'Raghav's dance session.' for $5",
        //     category: '',
        //     date: '2020-04-15T03:29:24.996+05:30',
        //     identifier: '392ECAFB-29BC-43EC-A9C2-C83FF5E2DC78',
        //     sessionId: 'zVE3Pt8mqegfBpc4rOi6',
        //     thread: '',
        //     title: 'New attendee!',
        //   },
        // };

        let sessionId = notification.payload.sessionId;
        console.log('Got the notification! ', notification);
        if (sessionId) this.props.navigateToSession(sessionId);
        completion();
      },
    );

    Notifications.events().registerNotificationReceivedBackground(
      (notification, completion) => {
        console.log('Notification Received - Background', notification);

        // Calling completion on iOS with `alert: true` will present the native iOS inApp notification.
        completion({alert: true, sound: true, badge: false});
      },
    );

    Notifications.getInitialNotification()
      .then(notification => {
        console.log('Initial notification was:', notification || 'N/A');
        if (notification && notification.payload) {
          let sessionId = notification.payload.sessionId;
          if (sessionId) this.props.navigateToSession(sessionId, true);
        }
      })
      .catch(err => console.error('getInitialNotifiation() failed', err));
  };

  render() {
    const {children} = this.props;
    return <View style={{flex: 1}}>{children}</View>;
  }
}
