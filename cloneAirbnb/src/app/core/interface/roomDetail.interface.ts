export interface RoomDetail {
  id: number;
  title: string;
  host: string[];
  address: string;
  state: number;
  postal_code: string;
  mobile: number;
  image: string;
  image_1: string;
  image_2: string;
  image_3: string;
  image_4: string;
  image_5: string;
  check_in: string;
  check_out: string;
  total_rating: number;
  capacity: number;
  space: string;
  room_type: string;
  bedroom: number;
  beds: number;
  bath_type: string;
  bathroom: number;
  cancellation: string;
  min_stay: number;
  max_stay: number;
  description: string;
  locational_description: string;
  price: number;
  facilities: string[][];
  reservations: string[][];
  updated_at: string;
  created_at: string;
  label: string;
  accuracy_score: number;
  location_score: number;
  communication_score: number;
  checkin_score: number;
  clean_score: number;
  value_score: number;
  super_host: string;
  reviews: string[];
}