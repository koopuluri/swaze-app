const BASE_URL = 'https://us-central1-swaze-d8f83.cloudfunctions.net/';
//const BASE_URL = 'http://localhost:5001/swaze-d8f83/us-central1/';

import axios from 'axios';

export async function createZoomMeeting(userToken, title, startTime, duration) {
  return await axios.post(BASE_URL + 'zoomMeeting', {
    userToken: userToken,
    title: title,
    startTime: startTime,
    duration: duration,
  });
}

export async function editZoomMeeting(
  userToken,
  meetingId,
  title,
  startTime,
  duration,
) {
  return await axios.patch(BASE_URL + 'zoomMeeting', {
    userToken: userToken,
    meetingId: meetingId,
    title: title,
    startTime: startTime,
    duration: duration,
  });
}

export async function deleteZoomMeeting(userToken, meetingId) {
  return await axios.delete(
    BASE_URL + 'zoomMeeting?userToken=' + userToken + '&meetingId=' + meetingId,
  );
}
