import SpotifyWebApi from 'spotify-web-api-node';

const scopesForApi = [
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-read-email',
  'streaming',
  'user-read-private',
  'user-library-read',
  'user-top-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'user-read-currently-playing',
  'user-read-recently-played',
  'user-follow-read',
].join(',');

const params = {
  scope: scopesForApi,
};

const queryParamObject = new URLSearchParams(params);
export const SPOTIFY_LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamObject.toString()}`;

const spotifyService = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

export default spotifyService;
