import type { Property, Roommate, Maid, Service, Conversation, Notification, User } from '../types';

// ==================== PROPERTY LISTINGS ====================
export const properties: Property[] = [
  {
    id: 'p1', name: 'UrbanNest PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&h=400&fit=crop', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Vartak Nagar', address: '12 MG Road, Vartak Nagar, Thane', lat: 19.2183, lng: 72.9781 },
    rent: 8500, deposit: 17000, roomType: 'double', gender: 'boys', ac: true,
    amenities: ['Wi-Fi', 'Food', 'Laundry', 'AC', 'Parking', 'Power Backup'],
    distance: 1.2, rating: 4.7, reviewCount: 128, available: true, availableFrom: '2026-10-01',
    furnished: 'fully', foodIncluded: true, foodType: 'both',
    owner: { name: 'Rajesh Kumar', email: 'rajesh.kumar@roomroot.app', verified: true, phone: '+91 98765 43210' },
    rules: ['No smoking', 'Visitors allowed till 9 PM', 'Quiet hours 10 PM - 7 AM'],
    nearby: [{ name: 'VIT Mumbai', type: 'College', distance: '1.2 km' }, { name: 'Thane Station', type: 'Railway', distance: '2.1 km' }],
    verified: true, description: 'Premium boys PG with modern amenities and home-cooked meals. Located in the heart of Vartak Nagar.'
  },
  {
    id: 'p2', name: 'Sunshine Ladies Hostel', type: 'hostel',
    coverImage: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Dadar', address: '45 Shivaji Park Road, Dadar West', lat: 19.0176, lng: 72.8478 },
    rent: 12000, deposit: 24000, roomType: 'single', gender: 'girls', ac: true,
    amenities: ['Wi-Fi', 'Food', 'Laundry', 'AC', 'CCTV', 'Security Guard', 'Power Backup'],
    distance: 2.5, rating: 4.8, reviewCount: 89, available: true, availableFrom: '2026-10-15',
    furnished: 'fully', foodIncluded: true, foodType: 'veg',
    owner: { name: 'Priya Mehta', verified: true, phone: '+91 98765 43211' },
    rules: ['Strict no male visitors', 'Entry by 9 PM', 'Meals at scheduled times'],
    nearby: [{ name: 'Sathaye College', type: 'College', distance: '0.8 km' }, { name: 'Dadar Station', type: 'Railway', distance: '1.0 km' }],
    verified: true, description: 'Safe and comfortable ladies hostel with 24/7 security and nutritious home food.'
  },
  {
    id: 'p3', name: 'CoLiving Spaces Navi Mumbai', type: 'flat',
    coverImage: 'https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&h=400&fit=crop'],
    location: { city: 'Navi Mumbai', area: 'Vashi', address: 'Plot 23, Sector 17, Vashi', lat: 19.0596, lng: 72.9994 },
    rent: 15000, deposit: 30000, roomType: 'single', gender: 'unisex', ac: true,
    amenities: ['Wi-Fi', 'Gym', 'Common Kitchen', 'AC', 'Housekeeping', 'Parking', 'Cafeteria'],
    distance: 3.8, rating: 4.5, reviewCount: 201, available: true, availableFrom: '2026-10-01',
    furnished: 'fully', foodIncluded: false,
    owner: { name: 'CoLiving Inc.', verified: true, phone: '+91 98765 43212' },
    rules: ['No smoking on premises', 'Quiet hours after 11 PM', 'Shared spaces to be kept clean'],
    nearby: [{ name: 'DY Patil College', type: 'College', distance: '2.0 km' }, { name: 'Vashi Station', type: 'Railway', distance: '0.5 km' }],
    verified: true, description: 'Modern co-living space with private rooms and shared premium amenities.'
  },
  {
    id: 'p4', name: 'Student Inn Boys PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Andheri', address: '78 link Road, Andheri West', lat: 19.1364, lng: 72.8296 },
    rent: 7000, deposit: 14000, roomType: 'triple', gender: 'boys', ac: false,
    amenities: ['Wi-Fi', 'Food', 'Laundry', 'Water Purifier'],
    distance: 4.2, rating: 3.9, reviewCount: 67, available: true, availableFrom: '2026-09-15',
    furnished: 'semi', foodIncluded: true, foodType: 'both',
    owner: { name: 'Suresh Patil', verified: false, phone: '+91 98765 43213' },
    rules: ['No alcohol', 'Visitors by 8 PM'],
    nearby: [{ name: 'Mithibai College', type: 'College', distance: '1.5 km' }, { name: 'Andheri Station', type: 'Railway', distance: '2.0 km' }],
    verified: false, description: 'Budget-friendly boys PG near Andheri with basic amenities and home food.'
  },
  {
    id: 'p5', name: 'BluNest Student Housing', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&h=400&fit=crop'],
    location: { city: 'Pune', area: 'Kothrud', address: '34 Karve Road, Kothrud', lat: 18.5074, lng: 73.8077 },
    rent: 9500, deposit: 19000, roomType: 'double', gender: 'unisex', ac: true,
    amenities: ['Wi-Fi', 'Food', 'AC', 'Gym', 'Study Room', 'Laundry', 'Rooftop Garden'],
    distance: 0.8, rating: 4.6, reviewCount: 156, available: true, availableFrom: '2026-10-01',
    furnished: 'fully', foodIncluded: true, foodType: 'both',
    owner: { name: 'Anita Deshmukh', verified: true, phone: '+91 98765 43214' },
    rules: ['No smoking', 'Study hours respected', 'Pets not allowed'],
    nearby: [{ name: 'SPPU', type: 'College', distance: '2.3 km' }, { name: 'Kothrud Bus Stop', type: 'Bus Stop', distance: '0.3 km' }],
    verified: true, description: 'Premium student housing in Pune with rooftop garden and dedicated study spaces.'
  },
  {
    id: 'p6', name: 'Green View Hostel', type: 'hostel',
    coverImage: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Powai', address: '15 Hiranandani Gardens, Powai', lat: 19.1197, lng: 72.9052 },
    rent: 18000, deposit: 36000, roomType: 'single', gender: 'girls', ac: true,
    amenities: ['Wi-Fi', 'Food', 'AC', 'Gym', 'Swimming Pool', 'CCTV', '24/7 Security', 'Power Backup'],
    distance: 1.5, rating: 4.9, reviewCount: 234, available: false, availableFrom: '2026-12-01',
    furnished: 'fully', foodIncluded: true, foodType: 'veg',
    owner: { name: 'Hiranandani Housing', verified: true, phone: '+91 98765 43215' },
    rules: ['No outside food', 'Visitors allowed in lobby only', 'Monthly inspection'],
    nearby: [{ name: 'IIT Bombay', type: 'College', distance: '3.0 km' }, { name: 'Powai Lake', type: 'Landmark', distance: '0.5 km' }],
    verified: true, description: 'Luxury ladies hostel with resort-like amenities in the heart of Powai.'
  },
  {
    id: 'p7', name: 'BudgetStay Boys PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Borivali', address: '89 SV Road, Borivali West', lat: 19.2307, lng: 72.8567 },
    rent: 5500, deposit: 11000, roomType: 'quad', gender: 'boys', ac: false,
    amenities: ['Wi-Fi', 'Water Purifier', 'Common Kitchen'],
    distance: 5.8, rating: 3.5, reviewCount: 34, available: true, availableFrom: '2026-09-01',
    furnished: 'unfurnished', foodIncluded: false,
    owner: { name: 'Mohammed Khan', verified: false, phone: '+91 98765 43216' },
    rules: ['No smoking', 'Quiet after 10 PM'],
    nearby: [{ name: 'KC College', type: 'College', distance: '2.5 km' }, { name: 'Borivali Station', type: 'Railway', distance: '1.2 km' }],
    verified: false, description: 'Most affordable option in Borivali. Basic but clean accommodation.'
  },
  {
    id: 'p8', name: 'Zen Student Living', type: 'flat',
    coverImage: 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1560185007-cde436f6a4d0?w=600&h=400&fit=crop'],
    location: { city: 'Thane', area: 'Ghodbunder', address: '56 Ghodbunder Road, Thane', lat: 19.2855, lng: 72.9634 },
    rent: 11000, deposit: 22000, roomType: 'double', gender: 'unisex', ac: true,
    amenities: ['Wi-Fi', 'AC', 'Balcony', 'Modular Kitchen', 'Power Backup', 'Parking'],
    distance: 3.1, rating: 4.3, reviewCount: 89, available: true, availableFrom: '2026-10-15',
    furnished: 'semi', foodIncluded: false,
    owner: { name: 'Vikram Singh', verified: true, phone: '+91 98765 43217' },
    rules: ['No smoking indoors', 'Shared cooking responsibilities', 'Rent split equally'],
    nearby: [{ name: 'Thane Engineering College', type: 'College', distance: '1.8 km' }, { name: 'Ghodbunder Mall', type: 'Shopping', distance: '0.6 km' }],
    verified: true, description: 'Spacious flat with balcony views. Perfect for students who like cooking their own meals.'
  },
  {
    id: 'p9', name: 'TechPark Ladies PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop'],
    location: { city: 'Pune', area: 'Hinjewadi', address: '12 Phase 2, Hinjewadi IT Park', lat: 18.5904, lng: 73.7397 },
    rent: 10000, deposit: 20000, roomType: 'double', gender: 'girls', ac: true,
    amenities: ['Wi-Fi', 'Food', 'AC', 'CCTV', 'Housekeeping', 'Gym'],
    distance: 2.0, rating: 4.4, reviewCount: 112, available: true, availableFrom: '2026-10-01',
    furnished: 'fully', foodIncluded: true, foodType: 'veg',
    owner: { name: 'Sneha Joshi', verified: true, phone: '+91 98765 43218' },
    rules: ['No male visitors', 'Curfew 9:30 PM', 'Monthly mess charges included'],
    nearby: [{ name: 'MIT WPU', type: 'College', distance: '4.0 km' }, { name: 'Hinjewadi Phase 2', type: 'IT Park', distance: '0.5 km' }],
    verified: true, description: 'Ideal for working students in IT Park area with all meals included.'
  },
  {
    id: 'p10', name: 'HomeBox Shared Room', type: 'room',
    coverImage: 'https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1630699144867-37acec97df5a?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Juhu', address: '7 Carter Road, Juhu', lat: 19.1322, lng: 72.8264 },
    rent: 20000, deposit: 40000, roomType: 'double', gender: 'unisex', ac: true,
    amenities: ['Wi-Fi', 'AC', 'Balcony', 'Sea View', 'Furnished'],
    distance: 3.5, rating: 4.6, reviewCount: 45, available: true, availableFrom: '2026-11-01',
    furnished: 'fully', foodIncluded: false,
    owner: { name: 'Arjun Kapoor', verified: true, phone: '+91 98765 43219' },
    rules: ['No parties', 'Guests must leave by 10 PM'],
    nearby: [{ name: 'Mithibai College', type: 'College', distance: '1.0 km' }, { name: 'Juhu Beach', type: 'Landmark', distance: '0.3 km' }],
    verified: true, description: 'Sea-facing room in prime Juhu location. Premium but worth it for the views.'
  },
  {
    id: 'p11', name: 'Scholar\'s Den PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1615874959474-d609969a20ed?w=600&h=400&fit=crop'],
    location: { city: 'Thane', area: 'Majiwada', address: '30 Ghodbunder Road, Majiwada', lat: 19.2467, lng: 72.9731 },
    rent: 6500, deposit: 13000, roomType: 'triple', gender: 'boys', ac: false,
    amenities: ['Wi-Fi', 'Food', 'Study Room', 'Laundry'],
    distance: 1.8, rating: 4.1, reviewCount: 78, available: true, availableFrom: '2026-09-15',
    furnished: 'semi', foodIncluded: true, foodType: 'both',
    owner: { name: 'Deepak Sharma', verified: true, phone: '+91 98765 43220' },
    rules: ['Study hours 8 AM - 10 AM', 'No alcohol', 'Meals on time'],
    nearby: [{ name: 'Thane College', type: 'College', distance: '1.2 km' }, { name: 'Majiwada Junction', type: 'Bus Stop', distance: '0.2 km' }],
    verified: true, description: 'Scholar-friendly PG with dedicated study hours and quiet environment.'
  },
  {
    id: 'p12', name: 'Harmony Ladies Hostel', type: 'hostel',
    coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&h=400&fit=crop'],
    location: { city: 'Navi Mumbai', area: 'Kharghar', address: '8 Hill Road, Sector 12, Kharghar', lat: 19.0474, lng: 73.0699 },
    rent: 8000, deposit: 16000, roomType: 'double', gender: 'girls', ac: false,
    amenities: ['Wi-Fi', 'Food', 'Laundry', 'CCTV', 'Water Purifier'],
    distance: 4.5, rating: 4.2, reviewCount: 56, available: true, availableFrom: '2026-10-01',
    furnished: 'semi', foodIncluded: true, foodType: 'veg',
    owner: { name: 'Lata Kulkarni', verified: true, phone: '+91 98765 43221' },
    rules: ['No male visitors', 'Entry by 8:30 PM', 'Weekend outings with permission'],
    nearby: [{ name: 'Kharghar IT Park', type: 'IT Park', distance: '1.5 km' }, { name: 'Kharghar Station', type: 'Railway', distance: '0.8 km' }],
    verified: true, description: 'Affordable and safe ladies hostel in Kharghar with vegetarian meals.'
  },
  {
    id: 'p13', name: 'Metro Heights PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Goregaon', address: '42 Goregaon East, Mindspace', lat: 19.1663, lng: 72.8526 },
    rent: 11500, deposit: 23000, roomType: 'single', gender: 'boys', ac: true,
    amenities: ['Wi-Fi', 'Food', 'AC', 'Gym', 'Cafe', 'Housekeeping', 'Parking'],
    distance: 2.8, rating: 4.5, reviewCount: 143, available: true, availableFrom: '2026-10-15',
    furnished: 'fully', foodIncluded: true, foodType: 'both',
    owner: { name: 'Metro Living Corp.', verified: true, phone: '+91 98765 43222' },
    rules: ['No smoking', 'Visitors in common area only', 'Monthly deep cleaning'],
    nearby: [{ name: 'Goregaon Film City', type: 'Landmark', distance: '2.0 km' }, { name: 'Goregaon Station', type: 'Railway', distance: '1.5 km' }],
    verified: true, description: 'Corporate-style PG for serious students and young professionals.'
  },
  {
    id: 'p14', name: 'Cloud9 Student Flat', type: 'flat',
    coverImage: 'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=600&h=400&fit=crop'],
    location: { city: 'Thane', area: 'Wagle Estate', address: '19 MIDC Road, Wagle Estate', lat: 19.2122, lng: 72.9681 },
    rent: 9000, deposit: 18000, roomType: 'double', gender: 'boys', ac: false,
    amenities: ['Wi-Fi', 'Furnished', 'Parking', 'Power Backup'],
    distance: 1.0, rating: 4.0, reviewCount: 32, available: true, availableFrom: '2026-09-20',
    furnished: 'semi', foodIncluded: false,
    owner: { name: 'Manoj Tiwari', verified: false, phone: '+91 98765 43223' },
    rules: ['Keep common areas clean', 'Electricity split equally'],
    nearby: [{ name: 'Thane College', type: 'College', distance: '0.8 km' }, { name: 'Wagle Estate Market', type: 'Market', distance: '0.3 km' }],
    verified: false, description: 'Simple flat near Thane College. Great for students who want independence.'
  },
  {
    id: 'p15', name: 'Royal residency Hostel', type: 'hostel',
    coverImage: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Bandra', address: '5 Hill Road, Bandra West', lat: 19.0544, lng: 72.8403 },
    rent: 16000, deposit: 32000, roomType: 'single', gender: 'unisex', ac: true,
    amenities: ['Wi-Fi', 'Food', 'AC', 'Gym', 'TV Lounge', 'CCTV', 'Laundry'],
    distance: 3.2, rating: 4.7, reviewCount: 178, available: true, availableFrom: '2026-10-01',
    furnished: 'fully', foodIncluded: true, foodType: 'both',
    owner: { name: 'Royal Hospitality', verified: true, phone: '+91 98765 43224' },
    rules: ['Smart casual dress code', 'No cooking in rooms', 'Monthly social events'],
    nearby: [{ name: 'St. Xavier\'s College', type: 'College', distance: '4.5 km' }, { name: 'Bandra Station', type: 'Railway', distance: '0.8 km' }],
    verified: true, description: 'Premium hostel in Bandra with hotel-like facilities and community events.'
  },
  {
    id: 'p16', name: 'Campus Corner PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&h=400&fit=crop'],
    location: { city: 'Pune', area: 'Viman Nagar', address: '23 Airport Road, Viman Nagar', lat: 18.5679, lng: 73.9143 },
    rent: 8000, deposit: 16000, roomType: 'double', gender: 'boys', ac: true,
    amenities: ['Wi-Fi', 'Food', 'AC', 'Study Room', 'Laundry'],
    distance: 1.5, rating: 4.3, reviewCount: 91, available: true, availableFrom: '2026-10-01',
    furnished: 'fully', foodIncluded: true, foodType: 'both',
    owner: { name: 'Arun Bhatt', verified: true, phone: '+91 98765 43225' },
    rules: ['Study hours respected', 'No loud music after 10 PM'],
    nearby: [{ name: 'Symbiosis College', type: 'College', distance: '1.5 km' }, { name: 'Viman Nagar Metro', type: 'Metro', distance: '0.5 km' }],
    verified: true, description: 'Closest PG to Symbiosis campus. Walking distance to college!'
  },
  {
    id: 'p17', name: 'Green Meadows Boys PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Mulund', address: '67 LBS Road, Mulund East', lat: 19.1726, lng: 72.9567 },
    rent: 6000, deposit: 12000, roomType: 'triple', gender: 'boys', ac: false,
    amenities: ['Wi-Fi', 'Water Purifier', 'Common Kitchen'],
    distance: 4.0, rating: 3.8, reviewCount: 45, available: true, availableFrom: '2026-09-01',
    furnished: 'unfurnished', foodIncluded: false,
    owner: { name: 'Ram Das', verified: false, phone: '+91 98765 43226' },
    rules: ['Cooking allowed', 'Electricity per unit'],
    nearby: [{ name: 'Mulund College', type: 'College', distance: '1.0 km' }, { name: 'Mulund Station', type: 'Railway', distance: '0.7 km' }],
    verified: false, description: 'No-frills accommodation for budget-conscious students.'
  },
  {
    id: 'p18', name: 'The Haven Ladies Flat', type: 'flat',
    coverImage: 'https://images.unsplash.com/photo-1600566753376-12c8ab7c56d1?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600566753376-12c8ab7c56d1?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Santacruz', address: '14 Vakola Pipeline Road, Santacruz East', lat: 19.0822, lng: 72.8546 },
    rent: 14000, deposit: 28000, roomType: 'double', gender: 'girls', ac: true,
    amenities: ['Wi-Fi', 'AC', 'Furnished', 'Parking', 'CCTV', 'Modular Kitchen'],
    distance: 2.0, rating: 4.6, reviewCount: 67, available: true, availableFrom: '2026-10-15',
    furnished: 'fully', foodIncluded: false,
    owner: { name: 'Nisha Agarwal', verified: true, phone: '+91 98765 43227' },
    rules: ['No male visitors inside', 'Shared grocery expenses', 'Monthly cleaning included'],
    nearby: [{ name: 'ICAI Mumbai', type: 'Office', distance: '1.0 km' }, { name: 'Santacruz Station', type: 'Railway', distance: '0.6 km' }],
    verified: true, description: 'Beautiful flat for girls near Santacruz station. Self-catering with modular kitchen.'
  },
  {
    id: 'p19', name: 'College Road PG', type: 'pg',
    coverImage: 'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600210492493-0946911123ea?w=600&h=400&fit=crop'],
    location: { city: 'Thane', area: 'Naupada', address: '8 College Road, Naupada', lat: 19.2094, lng: 72.9778 },
    rent: 7500, deposit: 15000, roomType: 'double', gender: 'boys', ac: false,
    amenities: ['Wi-Fi', 'Food', 'Laundry', 'Water Purifier'],
    distance: 0.5, rating: 4.0, reviewCount: 56, available: true, availableFrom: '2026-10-01',
    furnished: 'semi', foodIncluded: true, foodType: 'both',
    owner: { name: 'Ashok Jain', verified: true, phone: '+91 98765 43228' },
    rules: ['Timely meals', 'No smoking', 'Visitors allowed'],
    nearby: [{ name: 'Thane College', type: 'College', distance: '0.3 km' }, { name: 'Thane Station', type: 'Railway', distance: '1.5 km' }],
    verified: true, description: 'Literally across the road from Thane College. Best for lazy mornings!'
  },
  {
    id: 'p20', name: 'Skyline Premium Hostel', type: 'hostel',
    coverImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop',
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&h=400&fit=crop'],
    location: { city: 'Mumbai', area: 'Lower Parel', address: '1 Kamala Mills Compound, Lower Parel', lat: 19.0027, lng: 72.8309 },
    rent: 22000, deposit: 44000, roomType: 'single', gender: 'unisex', ac: true,
    amenities: ['Wi-Fi', 'Food', 'AC', 'Gym', 'Pool', 'Spa', 'Cafe', 'Co-working', 'Laundry', '24/7 Security'],
    distance: 5.0, rating: 4.9, reviewCount: 312, available: true, availableFrom: '2026-11-15',
    furnished: 'fully', foodIncluded: true, foodType: 'both',
    owner: { name: 'Skyline Living Pvt. Ltd.', verified: true, phone: '+91 98765 43229' },
    rules: ['No smoking', 'Professional environment', 'Smart casual dress code'],
    nearby: [{ name: 'NMIMS', type: 'College', distance: '2.0 km' }, { name: 'Lower Parel Station', type: 'Railway', distance: '0.3 km' }],
    verified: true, description: 'Ultra-premium hostel for the discerning student. Basically a 5-star for students.'
  }
];

// ==================== ROOMMATES ====================
export const roommates: Roommate[] = [
  {
    id: 'r1', name: 'Arjun Sharma', age: 20, gender: 'male', avatar: '',
    college: 'Thane College', course: 'B.Com', year: '2nd Year',
    location: 'Thane', currentRent: 7500, totalRoomRent: 22500, amountPerPerson: 7500,
    spotsAvailable: 2, preferredGender: 'male', moveInDate: '2026-10-01',
    lifestyle: { smoking: 'no', food: 'both', sleepSchedule: 'early', studyHabits: 'quiet', cleanliness: 'very', noise: 'quiet' },
    compatibility: 92, description: 'Looking for 2 more boys to share a triple room. Budget-friendly option near Thane College.'
  },
  {
    id: 'r2', name: 'Priya Nair', age: 19, gender: 'female', avatar: '',
    college: 'Mithibai College', course: 'BSc IT', year: '1st Year',
    location: 'Andheri', currentRent: 10000, totalRoomRent: 20000, amountPerPerson: 10000,
    spotsAvailable: 1, preferredGender: 'female', moveInDate: '2026-10-15',
    lifestyle: { smoking: 'no', food: 'veg', sleepSchedule: 'early', studyHabits: 'quiet', cleanliness: 'very', noise: 'quiet' },
    compatibility: 88, description: 'Need one more veg, non-smoking roommate for a comfortable 2BHK near Mithibai.'
  },
  {
    id: 'r3', name: 'Rahul Verma', age: 21, gender: 'male', avatar: '',
    college: 'SPPU', course: 'BE Computer', year: '3rd Year',
    location: 'Kothrud, Pune', currentRent: 9500, totalRoomRent: 19000, amountPerPerson: 9500,
    spotsAvailable: 1, preferredGender: 'male', moveInDate: '2026-10-01',
    lifestyle: { smoking: 'no', food: 'non-veg', sleepSchedule: 'late', studyHabits: 'music', cleanliness: 'normal', noise: 'moderate' },
    compatibility: 78, description: 'Chill roommate wanted for BluNest PG. Late sleeper here, music is okay.'
  },
  {
    id: 'r4', name: 'Ananya Desai', age: 20, gender: 'female', avatar: '',
    college: 'DY Patil College', course: 'BBA', year: '2nd Year',
    location: 'Vashi', currentRent: 12000, totalRoomRent: 24000, amountPerPerson: 12000,
    spotsAvailable: 1, preferredGender: 'female', moveInDate: '2026-11-01',
    lifestyle: { smoking: 'no', food: 'both', sleepSchedule: 'flexible', studyHabits: 'normal', cleanliness: 'very', noise: 'quiet' },
    compatibility: 85, description: 'Looking for a responsible, clean roommate for a luxury 2-sharing room in Vashi.'
  },
  {
    id: 'r5', name: 'Vikram Joshi', age: 22, gender: 'male', avatar: '',
    college: 'VIT Mumbai', course: 'MCA', year: '1st Year',
    location: 'Vartak Nagar, Thane', currentRent: 8500, totalRoomRent: 17000, amountPerPerson: 8500,
    spotsAvailable: 1, preferredGender: 'male', moveInDate: '2026-10-15',
    lifestyle: { smoking: 'no', food: 'both', sleepSchedule: 'early', studyHabits: 'quiet', cleanliness: 'normal', noise: 'quiet' },
    compatibility: 90, description: 'MCA student looking for a studious roommate. Early morning classes mean early bedtime.'
  },
  {
    id: 'r6', name: 'Meera Patel', age: 19, gender: 'female', avatar: '',
    college: 'Symbiosis Pune', course: 'BBA LLB', year: '1st Year',
    location: 'Viman Nagar, Pune', currentRent: 8000, totalRoomRent: 16000, amountPerPerson: 8000,
    spotsAvailable: 2, preferredGender: 'female', moveInDate: '2026-10-01',
    lifestyle: { smoking: 'no', food: 'veg', sleepSchedule: 'early', studyHabits: 'quiet', cleanliness: 'very', noise: 'quiet' },
    compatibility: 95, description: 'Law student looking for 2 veg roommates. Quiet study environment is a must.'
  },
  {
    id: 'r7', name: 'Karan Singh', age: 21, gender: 'male', avatar: '',
    college: 'Mithibai College', course: 'BMM', year: '3rd Year',
    location: 'Juhu', currentRent: 20000, totalRoomRent: 40000, amountPerPerson: 20000,
    spotsAvailable: 1, preferredGender: 'male', moveInDate: '2026-11-15',
    lifestyle: { smoking: 'occasionally', food: 'non-veg', sleepSchedule: 'late', studyHabits: 'music', cleanliness: 'relaxed', noise: 'moderate' },
    compatibility: 65, description: 'BMM student looking for a creative, easy-going roommate near Juhu Beach.'
  },
  {
    id: 'r8', name: 'Sakshi Gupta', age: 20, gender: 'female', avatar: '',
    college: 'KJ Somaiya', course: 'BSc CS', year: '2nd Year',
    location: 'Goregaon', currentRent: 11500, totalRoomRent: 23000, amountPerPerson: 11500,
    spotsAvailable: 1, preferredGender: 'female', moveInDate: '2026-10-15',
    lifestyle: { smoking: 'no', food: 'both', sleepSchedule: 'late', studyHabits: 'normal', cleanliness: 'normal', noise: 'quiet' },
    compatibility: 82, description: 'CS student who codes till late night. Need a roommate who respects quiet study time.'
  },
  {
    id: 'r9', name: 'Aditya Kulkarni', age: 22, gender: 'male', avatar: '',
    college: 'Pune University', course: 'MBA', year: '1st Year',
    location: 'Hinjewadi, Pune', currentRent: 10000, totalRoomRent: 20000, amountPerPerson: 10000,
    spotsAvailable: 2, preferredGender: 'male', moveInDate: '2026-10-01',
    lifestyle: { smoking: 'no', food: 'both', sleepSchedule: 'early', studyHabits: 'quiet', cleanliness: 'very', noise: 'quiet' },
    compatibility: 87, description: 'MBA student seeking focused roommates. Network building starts at home!'
  },
  {
    id: 'r10', name: 'Nisha Reddy', age: 19, gender: 'female', avatar: '',
    college: 'Thane College', course: 'BCA', year: '1st Year',
    location: 'Thane', currentRent: 6500, totalRoomRent: 19500, amountPerPerson: 6500,
    spotsAvailable: 2, preferredGender: 'female', moveInDate: '2026-09-15',
    lifestyle: { smoking: 'no', food: 'veg', sleepSchedule: 'early', studyHabits: 'quiet', cleanliness: 'normal', noise: 'quiet' },
    compatibility: 91, description: 'Fresh out of 12th! Need 2 more veg girls for a triple sharing room. Let\'s grow together!'
  }
];

// ==================== MAIDS ====================
export const maids: Maid[] = [
  {
    id: 'm1', name: 'Sunita Sharma', age: 38, avatar: '',
    location: 'Vartak Nagar, Thane', experience: 5, services: ['Cleaning', 'Sweeping', 'Mopping', 'Utensils', 'Laundry'],
    monthlyPay: 3500, availability: 'Mon-Sat', workingHours: '8:00 AM - 11:00 AM',
    languages: ['Hindi', 'Marathi'], verified: true, rating: 4.8, reviewCount: 34, description: 'Experienced maid with excellent reviews. Very thorough with cleaning.'
  },
  {
    id: 'm2', name: 'Kamla Devi', age: 45, avatar: '',
    location: 'Dadar, Mumbai', experience: 12, services: ['Cleaning', 'Cooking', 'Sweeping', 'Mopping', 'Utensils', 'Grocery Shopping'],
    monthlyPay: 5000, availability: 'Mon-Sat', workingHours: '7:00 AM - 1:00 PM',
    languages: ['Hindi', 'Marathi', 'Gujarati'], verified: true, rating: 4.9, reviewCount: 56, description: 'Can cook excellent Indian food. Handles everything from cleaning to cooking.'
  },
  {
    id: 'm3', name: 'Rekha Patil', age: 32, avatar: '',
    location: 'Kothrud, Pune', experience: 3, services: ['Cleaning', 'Sweeping', 'Mopping', 'Utensils'],
    monthlyPay: 2800, availability: 'Mon-Sat', workingHours: '9:00 AM - 12:00 PM',
    languages: ['Hindi', 'Marathi'], verified: false, rating: 4.2, reviewCount: 12, description: 'Reliable and punctual. Good for basic cleaning needs.'
  },
  {
    id: 'm4', name: 'Lata Jadhav', age: 40, avatar: '',
    location: 'Powai, Mumbai', experience: 8, services: ['Cleaning', 'Ironing', 'Laundry', 'Utensils', 'Sweeping', 'Mopping'],
    monthlyPay: 4000, availability: 'Mon-Sat', workingHours: '6:00 AM - 10:00 AM',
    languages: ['Hindi', 'Marathi', 'Kannada'], verified: true, rating: 4.6, reviewCount: 28, description: 'Early morning worker. Great for hostel residents who leave early.'
  },
  {
    id: 'm5', name: 'Geeta Yadav', age: 35, avatar: '',
    location: 'Andheri, Mumbai', experience: 6, services: ['Cleaning', 'Cooking', 'Sweeping', 'Mopping', 'Baby Sitting'],
    monthlyPay: 4500, availability: 'Mon-Sun', workingHours: '8:00 AM - 2:00 PM',
    languages: ['Hindi', 'English'], verified: true, rating: 4.7, reviewCount: 41, description: 'Multi-talented. Can cook and also provides babysitting services.'
  },
  {
    id: 'm6', name: 'Savita Bhoir', age: 28, avatar: '',
    location: 'Vashi, Navi Mumbai', experience: 2, services: ['Cleaning', 'Sweeping', 'Mopping'],
    monthlyPay: 2500, availability: 'Mon-Fri', workingHours: '10:00 AM - 1:00 PM',
    languages: ['Hindi', 'Marathi'], verified: false, rating: 4.0, reviewCount: 8, description: 'Newer but very enthusiastic and hardworking.'
  },
  {
    id: 'm7', name: 'Parvati Kamble', age: 50, avatar: '',
    location: 'Thane', experience: 15, services: ['Cleaning', 'Cooking', 'Sweeping', 'Mopping', 'Utensils', 'Grocery Shopping', 'Laundry'],
    monthlyPay: 5500, availability: 'Mon-Sat', workingHours: '6:00 AM - 2:00 PM',
    languages: ['Hindi', 'Marathi', 'English'], verified: true, rating: 4.9, reviewCount: 72, description: 'Most experienced maid in the area. Can manage entire household.'
  },
  {
    id: 'm8', name: 'Anita More', age: 30, avatar: '',
    location: 'Goregaon, Mumbai', experience: 4, services: ['Cleaning', 'Sweeping', 'Mopping', 'Utensils', 'Dish Washing'],
    monthlyPay: 3200, availability: 'Mon-Sat', workingHours: '7:00 AM - 11:00 AM',
    languages: ['Hindi', 'Marathi'], verified: true, rating: 4.5, reviewCount: 19, description: 'Quick and efficient. Specializes in kitchen cleaning.'
  }
];

// ==================== SERVICES ====================
export const services: Service[] = [
  {
    id: 's1', name: 'Plumbing', icon: '🔧', description: 'Fix leaks, blocked drains, pipe installation, faucet replacement',
    startingPrice: 299, availability: '24/7', rating: 4.5, reviewCount: 156,
    providers: [
      { id: 'sp1', name: 'Ramesh Plumbing', avatar: '', rating: 4.7, completedJobs: 234, verified: true, price: 299 },
      { id: 'sp2', name: 'QuickFix Plumbers', avatar: '', rating: 4.3, completedJobs: 145, verified: true, price: 349 }
    ]
  },
  {
    id: 's2', name: 'Electrical Repair', icon: '⚡', description: 'Wiring issues, fan repair, switch replacement, MCB problems',
    startingPrice: 399, availability: '9 AM - 9 PM', rating: 4.4, reviewCount: 123,
    providers: [
      { id: 'sp3', name: 'PowerFix Electricians', avatar: '', rating: 4.6, completedJobs: 189, verified: true, price: 399 },
      { id: 'sp4', name: 'A1 Electricals', avatar: '', rating: 4.2, completedJobs: 98, verified: false, price: 349 }
    ]
  },
  {
    id: 's3', name: 'AC Repair', icon: '❄️', description: 'AC servicing, gas refill, installation, deep cleaning',
    startingPrice: 499, availability: '9 AM - 6 PM', rating: 4.6, reviewCount: 89,
    providers: [
      { id: 'sp5', name: 'CoolBreeze AC Services', avatar: '', rating: 4.8, completedJobs: 312, verified: true, price: 499 }
    ]
  },
  {
    id: 's4', name: 'Wi-Fi Repair', icon: '📶', description: 'Router setup, range issues, speed problems, new connection',
    startingPrice: 199, availability: '10 AM - 8 PM', rating: 4.3, reviewCount: 67,
    providers: [
      { id: 'sp6', name: 'NetConnect Solutions', avatar: '', rating: 4.4, completedJobs: 156, verified: true, price: 199 }
    ]
  },
  {
    id: 's5', name: 'Cleaning', icon: '🧹', description: 'Deep cleaning, bathroom cleaning, kitchen cleaning, post-party cleanup',
    startingPrice: 349, availability: '8 AM - 6 PM', rating: 4.7, reviewCount: 234,
    providers: [
      { id: 'sp7', name: 'SparkleClean Services', avatar: '', rating: 4.8, completedJobs: 456, verified: true, price: 349 },
      { id: 'sp8', name: 'FreshHome Cleaning', avatar: '', rating: 4.5, completedJobs: 213, verified: true, price: 299 }
    ]
  },
  {
    id: 's6', name: 'Pest Control', icon: '🐛', description: 'Cockroach, mosquito, rat, lizard treatment',
    startingPrice: 599, availability: '9 AM - 5 PM', rating: 4.5, reviewCount: 98,
    providers: [
      { id: 'sp9', name: 'SafePest Solutions', avatar: '', rating: 4.6, completedJobs: 178, verified: true, price: 599 }
    ]
  },
  {
    id: 's7', name: 'Washing Machine Repair', icon: '👕', description: 'Motor repair, drum cleaning, belt replacement, water issues',
    startingPrice: 449, availability: '10 AM - 7 PM', rating: 4.4, reviewCount: 76,
    providers: [
      { id: 'sp10', name: 'ApplianceCare', avatar: '', rating: 4.5, completedJobs: 134, verified: true, price: 449 }
    ]
  },
  {
    id: 's8', name: 'Furniture Repair', icon: '🪑', description: 'Table repair, chair fixing, bed frame, shelf installation',
    startingPrice: 249, availability: '10 AM - 6 PM', rating: 4.3, reviewCount: 54,
    providers: [
      { id: 'sp11', name: 'WoodWorks Repair', avatar: '', rating: 4.4, completedJobs: 89, verified: true, price: 249 }
    ]
  },
  {
    id: 's9', name: 'Water Tanker', icon: '💧', description: 'Water tanker supply, tank cleaning, pipe leakage',
    startingPrice: 199, availability: '6 AM - 8 PM', rating: 4.2, reviewCount: 167,
    providers: [
      { id: 'sp12', name: 'AquaSupply', avatar: '', rating: 4.3, completedJobs: 567, verified: true, price: 199 }
    ]
  },
  {
    id: 's10', name: 'Laundry', icon: '🧺', description: 'Wash & fold, dry cleaning, ironing, stain removal',
    startingPrice: 50, availability: '8 AM - 8 PM', rating: 4.6, reviewCount: 289,
    providers: [
      { id: 'sp13', name: 'QuickWash Laundry', avatar: '', rating: 4.7, completedJobs: 890, verified: true, price: 50 },
      { id: 'sp14', name: 'FreshPress Laundry', avatar: '', rating: 4.5, completedJobs: 432, verified: true, price: 60 }
    ]
  },
  {
    id: 's11', name: 'Food', icon: '🍔', description: 'Fresh home-style meals, tiffin delivery, snacks, and beverages',
    startingPrice: 80, availability: '7 AM - 11 PM', rating: 4.7, reviewCount: 312,
    providers: [
      { id: 'sp15', name: 'GharKaKhana Tiffins', avatar: '', rating: 4.8, completedJobs: 678, verified: true, price: 80 },
      { id: 'sp16', name: 'Campus Bites', avatar: '', rating: 4.6, completedJobs: 421, verified: true, price: 99 }
    ]
  }
];

// ==================== CONVERSATIONS ====================
export const conversations: Conversation[] = [
  {
    id: 'c1', name: 'Arjun Sharma', avatar: '', lastMessage: 'What\'s the total rent?', lastTime: '2 min ago', unread: 2, online: true, isGroup: false,
    messages: [
      { id: 'msg1', senderId: 'current', text: 'Hey, I saw your roommate listing. Tell me more about it.', timestamp: '10:30 AM', read: true },
      { id: 'msg2', senderId: 'arjun', text: 'Hey! We\'re looking for 2 more boys for our room in Thane.', timestamp: '10:32 AM', read: true },
      { id: 'msg3', senderId: 'current', text: 'Nice! What location exactly?', timestamp: '10:35 AM', read: true },
      { id: 'msg4', senderId: 'arjun', text: 'Vartak Nagar, near Thane College. Walking distance!', timestamp: '10:36 AM', read: true },
      { id: 'msg5', senderId: 'current', text: 'That\'s great. What\'s the total rent?', timestamp: '10:38 AM', read: true },
      { id: 'msg6', senderId: 'arjun', text: '₹18,000 total, so ₹6,000 each for 3 people.', timestamp: '10:39 AM', read: false },
      { id: 'msg7', senderId: 'arjun', text: 'Includes food and Wi-Fi!', timestamp: '10:39 AM', read: false }
    ]
  },
  {
    id: 'c2', name: 'Priya Nair', avatar: '', lastMessage: 'That sounds perfect!', lastTime: '15 min ago', unread: 1, online: false, isGroup: false,
    messages: [
      { id: 'msg8', senderId: 'priya', text: 'Hi! Are you interested in the Andheri room?', timestamp: '9:00 AM', read: true },
      { id: 'msg9', senderId: 'current', text: 'Yes! Can you share more details?', timestamp: '9:05 AM', read: true },
      { id: 'msg10', senderId: 'priya', text: 'It\'s a 2BHK near Mithibai College. ₹10,000 per person.', timestamp: '9:10 AM', read: true },
      { id: 'msg11', senderId: 'current', text: 'Sounds good. Is it veg only?', timestamp: '9:12 AM', read: true },
      { id: 'msg12', senderId: 'priya', text: 'Yes, veg only. And no smoking allowed.', timestamp: '9:15 AM', read: true },
      { id: 'msg13', senderId: 'current', text: 'Perfect, I\'m fine with that.', timestamp: '9:18 AM', read: true },
      { id: 'msg14', senderId: 'priya', text: 'That sounds perfect!', timestamp: '9:20 AM', read: false }
    ]
  },
  {
    id: 'c3', name: 'Room #302 Group', avatar: '', lastMessage: 'Jay: Let\'s decide on grocery shopping this weekend', lastTime: '1 hr ago', unread: 0, online: false, isGroup: true, members: ['Rahul', 'Jay', 'Arjun'],
    messages: [
      { id: 'msg15', senderId: 'rahul', text: 'Hey everyone! Welcome to Room #302 chat 🏠', timestamp: 'Yesterday', read: true },
      { id: 'msg16', senderId: 'arjun', text: 'Hey Rahul, when can we move in?', timestamp: 'Yesterday', read: true },
      { id: 'msg17', senderId: 'rahul', text: 'October 1st works for the landlord.', timestamp: 'Yesterday', read: true },
      { id: 'msg18', senderId: 'jay', text: 'Perfect! Let\'s coordinate grocery shopping this weekend', timestamp: '11:00 AM', read: true }
    ]
  },
  {
    id: 'c4', name: 'Rajesh Kumar (PG Owner)', avatar: '', lastMessage: 'Visit is scheduled for Saturday', lastTime: '3 hrs ago', unread: 0, online: false, isGroup: false,
    messages: [
      { id: 'msg19', senderId: 'current', text: 'Hi, I\'d like to visit UrbanNest PG this weekend.', timestamp: 'Yesterday', read: true },
      { id: 'msg20', senderId: 'rajesh', text: 'Sure! When are you free?', timestamp: 'Yesterday', read: true },
      { id: 'msg21', senderId: 'current', text: 'Saturday afternoon?', timestamp: 'Yesterday', read: true },
      { id: 'msg22', senderId: 'rajesh', text: 'Visit is scheduled for Saturday. See you at 3 PM! 📍', timestamp: '8:00 AM', read: true }
    ]
  },
  {
    id: 'c5', name: 'Sunita Sharma (Maid)', avatar: '', lastMessage: 'I\'ll come at 8 AM tomorrow', lastTime: '5 hrs ago', unread: 0, online: true, isGroup: false,
    messages: [
      { id: 'msg23', senderId: 'current', text: 'Hi Sunita ji, can you come for cleaning tomorrow?', timestamp: 'Yesterday', read: true },
      { id: 'msg24', senderId: 'sunita', text: 'Yes, what time?', timestamp: 'Yesterday', read: true },
      { id: 'msg25', senderId: 'current', text: '8 AM if possible', timestamp: 'Yesterday', read: true },
      { id: 'msg26', senderId: 'sunita', text: 'I\'ll come at 8 AM tomorrow', timestamp: '7:00 AM', read: true }
    ]
  }
];

// ==================== NOTIFICATIONS ====================
export const notifications: Notification[] = [
  { id: 'n1', type: 'roommate', title: 'New roommate request', body: 'Arjun wants to join your room.', time: '2 min ago', read: false },
  { id: 'n2', type: 'listing', title: 'New listing match', body: 'A PG matching your ₹8,000 budget was added in Thane.', time: '1 hr ago', read: false },
  { id: 'n3', type: 'service', title: 'Service update', body: 'Your plumbing request has been assigned to Ramesh.', time: '3 hrs ago', read: true },
  { id: 'n4', type: 'message', title: 'New message', body: 'Priya sent you a message.', time: '4 hrs ago', read: true },
  { id: 'n5', type: 'system', title: 'Welcome to RoomRoot!', body: 'Complete your profile to get personalized recommendations.', time: '1 day ago', read: true },
  { id: 'n6', type: 'listing', title: 'Price drop alert', body: 'Zen Student Living dropped rent from ₹12,000 to ₹11,000.', time: '2 days ago', read: true },
  { id: 'n7', type: 'roommate', title: 'New roommate match', body: 'Meera from Symbiosis is 95% compatible with you!', time: '2 days ago', read: true }
];

// ==================== CURRENT USER ====================
export const currentUser: User = {
  id: 'u1', name: 'Jay', email: 'jay@college.edu', phone: '+91 98765 43200',
  avatar: '', college: 'Thane College', course: 'computer science and design engineering', year: '2nd Year',
  gender: 'Male', city: 'Thane', budget: { min: 5000, max: 12000 },
  preferredLocation: 'Thane, Anand nagar', roomPreference: '2-sharing with AC',
  lifestyle: ['Non-smoker', 'Early sleeper', 'Veg preferred', 'Quiet environment'],
  savedRooms: ['p1', 'p5', 'p19'], roommateRequests: ['r1', 'r6'],
  serviceRequests: [
    { id: 'sr1', serviceType: 'Plumbing', status: 'in-progress', provider: 'Ramesh Plumbing', date: '2026-09-01', estimatedPrice: 350 },
    { id: 'sr2', serviceType: 'AC Repair', status: 'completed', provider: 'CoolBreeze AC', date: '2026-08-25', estimatedPrice: 599 }
  ]
};
