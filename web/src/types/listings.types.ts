export interface ListingInfo {
  id: string;
  name: string;
  images: string[];
  city: string;
  housing_type: string;
  price: number;
  petsAllowed: boolean;
  userId: string;
  address?: string;
  bathrooms?: number;
  rooms?: number;
  size?: number;
  description: string;
  distanceToUcf?: number;
}

export interface ListingData {
  listing: ListingInfo;
}
