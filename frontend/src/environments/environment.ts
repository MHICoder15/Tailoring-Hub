export const environment = {
  production: false,
};

export const apis = {
  // baseUrl: 'https://www.tailoringhub.com/api',
  baseUrl: 'http://localhost:6030/api',
  googleApiKey: 'YOUR_GOOGLE_API_KEY',
  googleCaptchaSiteKey: '6LcOuyYTAAAAAHTjFuqhA52fmfJ_j5iFk5PsfXaU',
};

export const socialLoginUrls = {
  google: `${apis.baseUrl}/public/login/google`,
  facebook: `${apis.baseUrl}/public/login/facebook`,
};

export const appURL = 'https://www.tailoringhub.com';
