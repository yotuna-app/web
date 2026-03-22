import { gql } from "@apollo/client";

export const GET_STATIONS = gql`
  query GetItems($query: String!, $offset: Int!, $limit: Int!) {
    getStations(query: $query, limit: $limit, offset: $offset) {
      stations {
        id
        playlistAvailable
        name
        stream {
          sd
        }
        imageUrl
        websiteUrl
        rating
        genres
        social {
          facebook
          twitter
          instagram
        }
      }
      total
    }
  }
`;

export const GET_FAVORITE_STATIONS = gql`
  query GetFavoriteStations($stationIds: [String]) {
    getStationsById(stationIds: $stationIds) {
      stations {
        id
        playlistAvailable
        name
        stream {
          sd
        }
        imageUrl
        websiteUrl
        rating
        genres
        social {
          facebook
          twitter
          instagram
        }
      }
      total
    }
  }
`;

export const GET_STATION_PLAYLIST = gql`
  query getStationPlaylist($stationId: ID!, $from: String!, $to: String!) {
    getStationPlaylist(stationId: $stationId, from: $from, to: $to) {
      entries {
        startedAt
        title
        artists
        imageUrl
        album
        deezerTrackId
        tidalTrackId
        spotifyTrackId
        appleTrackId
      }
      total
    }
  }
`;

export const GET_APP_CONFIG = gql`
  query GetAppConfig {
    getAppConfig {
      enableSubscriptions
      favoritesLimit
      stationsPageLimit
      discord {
        inviteUrl
      }
      review {
        milestones
      }
      store {
        appleId
        androidPackage
      }
      playlistDaysBack
      websiteUrl
      privacyUrl
    }
  }
`;
