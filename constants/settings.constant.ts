/**
 * Application Settings Keys
 * Mirrors the keys seeded by `api/app/constants/default_settings.ts` — must be kept in sync with the backend.
 * Single source of truth for setting keys used to read values from `useSettingsStore`.
 */
export class SettingKeys {
  // General
  static readonly CLINIC_NAME = 'clinic_name';
  static readonly DEFAULT_CURRENCY = 'default_currency';
  static readonly CURRENCY_SYMBOL = 'currency_symbol';
  static readonly MAINTENANCE_MODE_ENABLED = 'maintenance_mode_enabled';
  static readonly TIMEZONE = 'timezone';

  // Contact
  static readonly CLINIC_ADDRESS = 'clinic_address';
  static readonly CLINIC_MAPS_URL = 'clinic_maps_url';
  static readonly CLINIC_PHONE = 'clinic_phone';
  static readonly CLINIC_WHATSAPP_NUMBER = 'clinic_whatsapp_number';
  static readonly WORKING_HOURS = 'working_hours';

  // Mobile
  static readonly GOOGLE_PLAY_URL = 'google_play_url';
  static readonly APP_STORE_URL = 'app_store_url';
  static readonly ANDROID_FORCE_UPDATE_ENABLED = 'android_force_update_enabled';
  static readonly ANDROID_MIN_VERSION = 'android_min_version';
  static readonly IOS_FORCE_UPDATE_ENABLED = 'ios_force_update_enabled';
  static readonly IOS_MIN_VERSION = 'ios_min_version';
}
