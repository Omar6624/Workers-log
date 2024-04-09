export interface PostOfficeInfo {
  query?: Query;
  results?: { [key: string]: Result[] };
}

export interface Query {
  codes?: string[];
  country?: string;
}

export interface Result {
  postal_code?: string;
  country_code?: string;
  latitude?: string;
  longitude?: string;
  city?: string;
  state?: string;
  city_en?: string;
  state_en?: string;
  state_code?: string;
  province?: string;
  province_code?: string;
}
