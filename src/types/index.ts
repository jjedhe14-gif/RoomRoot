export interface Property {
  id: string;
  name: string;
  type: 'pg' | 'hostel' | 'flat' | 'room';
  images: string[];
  coverImage: string;
  location: {
    city: string;
    area: string;
    address: string;
    lat: number;
    lng: number;
  };
  rent: number;
  deposit: number;
  roomType: 'single' | 'double' | 'triple' | 'quad';
  gender: 'boys' | 'girls' | 'unisex';
  ac: boolean;
  amenities: string[];
  distance: number;
  rating: number;
  reviewCount: number;
  available: boolean;
  availableFrom: string;
  furnished: 'fully' | 'semi' | 'unfurnished';
  foodIncluded: boolean;
  foodType?: 'veg' | 'non-veg' | 'both';
  owner: {
    name: string;
    email?: string;
    verified: boolean;
    phone: string;
  };
  rules: string[];
  nearby: { name: string; type: string; distance: string }[];
  verified: boolean;
  description: string;
}

export interface Roommate {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  avatar: string;
  college: string;
  course: string;
  year: string;
  location: string;
  currentRent: number;
  totalRoomRent: number;
  amountPerPerson: number;
  spotsAvailable: number;
  preferredGender: 'male' | 'female' | 'any';
  moveInDate: string;
  lifestyle: {
    smoking: 'yes' | 'no' | 'occasionally';
    food: 'veg' | 'non-veg' | 'both';
    sleepSchedule: 'early' | 'late' | 'flexible';
    studyHabits: 'quiet' | 'normal' | 'music';
    cleanliness: 'very' | 'normal' | 'relaxed';
    noise: 'quiet' | 'moderate' | 'loud';
  };
  compatibility?: number;
  description: string;
}

export interface Maid {
  id: string;
  name: string;
  age: number;
  avatar: string;
  location: string;
  experience: number;
  services: string[];
  monthlyPay: number;
  availability: string;
  workingHours: string;
  languages: string[];
  verified: boolean;
  rating: number;
  reviewCount: number;
  description: string;
}

export interface Service {
  id: string;
  name: string;
  icon: string;
  description: string;
  startingPrice: number;
  availability: string;
  rating: number;
  reviewCount: number;
  providers: ServiceProvider[];
}

export interface ServiceProvider {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  completedJobs: number;
  verified: boolean;
  price: number;
}

export interface ServiceRequest {
  id: string;
  serviceType: string;
  status: 'requested' | 'assigned' | 'on-the-way' | 'in-progress' | 'completed';
  provider?: string;
  date: string;
  estimatedPrice: number;
}

export interface Message {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  image?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastTime: string;
  unread: number;
  online: boolean;
  isGroup: boolean;
  members?: string[];
  messages: Message[];
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  date: string;
}

export interface Notification {
  id: string;
  type: 'roommate' | 'listing' | 'service' | 'message' | 'system';
  title: string;
  body: string;
  time: string;
  read: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  college: string;
  course: string;
  year: string;
  gender: string;
  city: string;
  budget: { min: number; max: number };
  preferredLocation: string;
  roomPreference: string;
  lifestyle: string[];
  savedRooms: string[];
  roommateRequests: string[];
  serviceRequests: ServiceRequest[];
}

export interface FilterState {
  budget: [number, number];
  gender: string[];
  roomType: string[];
  amenities: string[];
  ac: boolean | null;
  foodIncluded: boolean | null;
  furnished: string[];
  searchQuery: string;
}
