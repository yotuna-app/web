/**
 * Shared type definitions for the Yotuna web application.
 * Mirrors the types from the React Native app.
 */

export interface Station {
  id: string;
  name: string;
  playlistAvailable?: boolean;
  stream?: {
    sd?: string;
  };
  imageUrl?: string;
  websiteUrl?: string;
  rating?: number;
  genres?: string[];
  social?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
  };
}

export interface StationsResponse {
  getStations: {
    stations: Station[];
    total: number;
  };
}

export interface PlaylistTrack {
  id?: string;
  startedAt: string;
  title: string;
  artists: string;
  album?: string;
  imageUrl?: string;
  deezerTrackId?: string;
  tidalTrackId?: string;
  spotifyTrackId?: string;
  appleTrackId?: string;
}

export interface StationPlaylistResponse {
  getStationPlaylist: {
    entries: PlaylistTrack[];
    total: number;
  };
}

export interface FavoriteStationsResponse {
  getStationsById: {
    stations: Station[];
  };
}

export interface AppConfig {
  enableSubscriptions: boolean;
  favoritesLimit: number;
  stationsPageLimit: number;
  discord: {
    inviteUrl: string;
  };
  review: {
    milestones: number[];
  };
  store: {
    appleId: string;
    androidPackage: string;
  };
  playlistDaysBack: number;
  websiteUrl: string;
  privacyUrl: string;
}

export interface AppConfigResponse {
  getAppConfig: AppConfig;
}
