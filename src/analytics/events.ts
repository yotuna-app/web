export const AnalyticsEvents = {
  // Navigation
  PAGE_VIEW: "page_view",

  // Audio
  AUDIO_PLAY: "audio_play",
  AUDIO_PAUSE: "audio_pause",
  AUDIO_STOP: "audio_stop",

  // Station
  STATION_FAVORITE: "station_favorite",
  STATION_UNFAVORITE: "station_unfavorite",
  STATION_FAVORITE_FAILED: "station_favorite_failed",
  STATION_DETAILS_VIEW: "station_details_view",

  // Search
  SEARCH_PERFORMED: "search_performed",
  SEARCH_CLEARED: "search_cleared",

  // Settings
  THEME_CHANGED: "theme_changed",
  LANGUAGE_CHANGED: "language_changed",

  // Device
  DEVICE_ID_COPIED: "device_id_copied",

  // Community
  DISCORD_LINK_CLICKED: "discord_link_clicked",

  // Social
  SOCIAL_LINK_CLICKED: "social_link_clicked",
  WEBSITE_CLICKED: "website_clicked",

  // Playlist
  PLAYLIST_TRACK_COPIED: "playlist_track_copied",
  STREAMING_LINK_CLICKED: "streaming_link_clicked",

  // Error events
  ERROR_OCCURRED: "error_occurred",
  NETWORK_ERROR: "network_error",

  // GDPR
  GDPR_CONSENT_GIVEN: "gdpr_consent_given",
  GDPR_CONSENT_DECLINED: "gdpr_consent_declined",
  GDPR_CONSENT_CHANGE: "gdpr_consent_change",
} as const;

export type AnalyticsEvent = (typeof AnalyticsEvents)[keyof typeof AnalyticsEvents];
