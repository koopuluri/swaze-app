export function getQueryStringParams(query) {
  return query
    ? (/^[?#]/.test(query) ? query.slice(1) : query)
        .split('&')
        .reduce((params, param) => {
          let [key, value] = param.split('=');
          params[key] = value
            ? decodeURIComponent(value.replace(/\+/g, ' '))
            : '';
          return params;
        }, {})
    : {};
}

export function getUrlForSession(sessionId) {
  return 'https://www.swaze.app/' + sessionId;
}

export function getStripeConnectAuthUrl(userToken) {
  // PROD:
  const REDIRECT_URI =
    'https://us-central1-swaze-d8f83.cloudfunctions.net/stripeConnectRedirect';
  //const REDIRECT_URI =
  ('https://ff5c5737.ngrok.io/swaze-d8f83/us-central1/stripeConnectRedirect');
  const STRIPE_CLIENT_ID = 'ca_H1bZF2mvmTpIuGM86Tw5ig5JdkxjsBJY'; // TEST CLIENT ID
  return (
    'https://connect.stripe.com/express/oauth/authorize?redirect_uri=' +
    REDIRECT_URI +
    '&client_id=' +
    STRIPE_CLIENT_ID +
    '&stripe_user[business_type]=individual&state=' +
    userToken
  );
}
