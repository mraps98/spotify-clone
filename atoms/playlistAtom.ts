import { atom, RecoilState } from 'recoil';

export const playlistState: RecoilState<SpotifyApi.SinglePlaylistResponse> =
  atom({
    key: 'playlistState',
    default: {} as SpotifyApi.SinglePlaylistResponse,
  });

export const playlistIdState = atom({
  key: 'playlistIdState',
  default: '5UTIdG0S4XK9c2wu2q2T9R',
});
