// Simple fuzzy matching without external dependencies
class SimpleFuzzy {
  private items: string[];
  
  constructor(items: string[]) {
    this.items = items;
  }
  
  search(query: string, threshold: number = 0.6): Array<{item: string, score: number}> {
    const results: Array<{item: string, score: number}> = [];
    const queryLower = query.toLowerCase();
    
    for (const item of this.items) {
      const itemLower = item.toLowerCase();
      let score = 0;
      
      // Exact match
      if (itemLower === queryLower) {
        score = 1.0;
      }
      // Contains match
      else if (itemLower.includes(queryLower) || queryLower.includes(itemLower)) {
        score = 0.8;
      }
      // Levenshtein distance based similarity
      else {
        const distance = this.levenshteinDistance(queryLower, itemLower);
        const maxLength = Math.max(queryLower.length, itemLower.length);
        score = 1 - (distance / maxLength);
      }
      
      if (score >= threshold) {
        results.push({ item, score });
      }
    }
    
    return results.sort((a, b) => b.score - a.score);
  }
  
  private levenshteinDistance(str1: string, str2: string): number {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }
}

interface LocationInfo {
  city?: string;
  state?: string;
  country?: string;
  fullLocation?: string;
  confidence: number;
}

interface LocationMatch {
  location: string;
  similarity: number;
  distance: 'local' | 'regional' | 'national' | 'international' | 'remote';
}

export class LocationService {
  private static cityDatabase = [
    // Major US Cities
    'New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia',
    'San Antonio', 'San Diego', 'Dallas', 'San Jose', 'Austin', 'Jacksonville',
    'Fort Worth', 'Columbus', 'Charlotte', 'San Francisco', 'Indianapolis',
    'Seattle', 'Denver', 'Washington DC', 'Boston', 'Nashville', 'Baltimore',
    'Oklahoma City', 'Louisville', 'Portland', 'Las Vegas', 'Memphis', 'Detroit',
    'Milwaukee', 'Albuquerque', 'Tucson', 'Fresno', 'Sacramento', 'Kansas City',
    'Mesa', 'Atlanta', 'Colorado Springs', 'Raleigh', 'Omaha', 'Miami', 'Oakland',
    'Minneapolis', 'Tulsa', 'Cleveland', 'Wichita', 'Arlington', 'Tampa',
    
    // Tech Hubs
    'Silicon Valley', 'Palo Alto', 'Mountain View', 'Cupertino', 'Redmond',
    'Cambridge', 'Boulder', 'Research Triangle', 'Ann Arbor',
    
    // International Cities
    'Toronto', 'Vancouver', 'Montreal', 'Ottawa', 'Calgary', 'London', 'Manchester',
    'Edinburgh', 'Dublin', 'Berlin', 'Munich', 'Amsterdam', 'Stockholm', 'Copenhagen',
    'Helsinki', 'Oslo', 'Zurich', 'Geneva', 'Paris', 'Lyon', 'Madrid', 'Barcelona',
    'Rome', 'Milan', 'Vienna', 'Prague', 'Warsaw', 'Budapest', 'Bucharest',
    'Sofia', 'Athens', 'Istanbul', 'Tel Aviv', 'Dubai', 'Riyadh', 'Kuwait City',
    'Doha', 'Abu Dhabi', 'Cairo', 'Casablanca', 'Lagos', 'Nairobi', 'Cape Town',
    'Johannesburg', 'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Pune', 'Kolkata', 'Ahmedabad', 'Surat', 'Jaipur', 'Lucknow', 'Kanpur',
    'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Pimpri', 'Patna',
    'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
    'Meerut', 'Rajkot', 'Kalyan', 'Vasai', 'Varanasi', 'Srinagar', 'Aurangabad',
    'Dhanbad', 'Amritsar', 'Navi Mumbai', 'Allahabad', 'Ranchi', 'Howrah',
    'Coimbatore', 'Jabalpur', 'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai',
    'Raipur', 'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubli', 'Tiruchirappalli',
    'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon', 'Aligarh', 'Jalandhar', 'Bhubaneswar',
    'Salem', 'Warangal', 'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur',
    'Bikaner', 'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack', 'Firozabad',
    'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun', 'Durgapur', 'Asansol',
    'Rourkela', 'Nanded', 'Kolhapur', 'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar',
    'Ujjain', 'Loni', 'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli',
    'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli', 'Malegaon',
    'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala', 'Beijing', 'Shanghai', 'Guangzhou',
    'Shenzhen', 'Chengdu', 'Hangzhou', 'Wuhan', 'Xian', 'Suzhou', 'Zhengzhou',
    'Tokyo', 'Osaka', 'Yokohama', 'Nagoya', 'Sapporo', 'Fukuoka', 'Kobe',
    'Seoul', 'Busan', 'Incheon', 'Daegu', 'Daejeon', 'Gwangju', 'Suwon',
    'Bangkok', 'Ho Chi Minh City', 'Hanoi', 'Manila', 'Quezon City', 'Davao',
    'Cebu City', 'Jakarta', 'Surabaya', 'Bandung', 'Medan', 'Semarang',
    'Palembang', 'Makassar', 'Kuala Lumpur', 'George Town', 'Ipoh', 'Shah Alam',
    'Singapore', 'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide',
    'Gold Coast', 'Newcastle', 'Canberra', 'Auckland', 'Wellington', 'Christchurch',
    'Hamilton', 'Tauranga', 'São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador',
    'Fortaleza', 'Belo Horizonte', 'Manaus', 'Curitiba', 'Recife', 'Porto Alegre',
    'Buenos Aires', 'Córdoba', 'Rosario', 'Mendoza', 'La Plata', 'Santiago',
    'Valparaíso', 'Concepción', 'Lima', 'Arequipa', 'Trujillo', 'Chiclayo',
    'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena', 'Caracas',
    'Maracaibo', 'Valencia', 'Barquisimeto', 'Mexico City', 'Guadalajara',
    'Monterrey', 'Puebla', 'Tijuana', 'León', 'Juárez', 'Torreón', 'Querétaro'
  ];

  private static stateDatabase = [
    // US States
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming',
    
    // Canadian Provinces
    'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
    'Northwest Territories', 'Nova Scotia', 'Nunavut', 'Ontario', 'Prince Edward Island',
    'Quebec', 'Saskatchewan', 'Yukon',
    
    // Indian States
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
    'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
    'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
    'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
  ];

  private static countryDatabase = [
    'United States', 'USA', 'US', 'Canada', 'United Kingdom', 'UK', 'England', 'Scotland',
    'Wales', 'Northern Ireland', 'Ireland', 'Germany', 'France', 'Italy', 'Spain',
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark',
    'Finland', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Greece',
    'Portugal', 'Croatia', 'Slovenia', 'Slovakia', 'Estonia', 'Latvia', 'Lithuania',
    'Luxembourg', 'Malta', 'Cyprus', 'Russia', 'Ukraine', 'Belarus', 'Turkey', 'Israel',
    'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon',
    'Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Libya', 'Sudan', 'Ethiopia', 'Kenya',
    'Tanzania', 'Uganda', 'Rwanda', 'Ghana', 'Nigeria', 'South Africa', 'Botswana',
    'Namibia', 'Zambia', 'Zimbabwe', 'Mozambique', 'Madagascar', 'Mauritius', 'India',
    'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Bhutan', 'Maldives', 'Afghanistan',
    'Iran', 'Iraq', 'China', 'Japan', 'South Korea', 'North Korea', 'Mongolia', 'Taiwan',
    'Hong Kong', 'Macau', 'Thailand', 'Vietnam', 'Cambodia', 'Laos', 'Myanmar', 'Malaysia',
    'Singapore', 'Indonesia', 'Philippines', 'Brunei', 'East Timor', 'Papua New Guinea',
    'Australia', 'New Zealand', 'Fiji', 'Samoa', 'Tonga', 'Vanuatu', 'Solomon Islands',
    'Brazil', 'Argentina', 'Chile', 'Peru', 'Colombia', 'Venezuela', 'Ecuador', 'Bolivia',
    'Paraguay', 'Uruguay', 'Guyana', 'Suriname', 'French Guiana', 'Mexico', 'Guatemala',
    'Belize', 'El Salvador', 'Honduras', 'Nicaragua', 'Costa Rica', 'Panama', 'Cuba',
    'Jamaica', 'Haiti', 'Dominican Republic', 'Puerto Rico', 'Trinidad and Tobago',
    'Barbados', 'Bahamas', 'Grenada', 'Saint Lucia', 'Saint Vincent and the Grenadines',
    'Antigua and Barbuda', 'Dominica', 'Saint Kitts and Nevis'
  ];

  private static cityFuzzy = new SimpleFuzzy(LocationService.cityDatabase);
  private static stateFuzzy = new SimpleFuzzy(LocationService.stateDatabase);
  private static countryFuzzy = new SimpleFuzzy(LocationService.countryDatabase);

  static extractLocationFromResume(resumeText: string): LocationInfo {
    const text = resumeText.toLowerCase();
    let bestMatch: LocationInfo = { confidence: 0 };

    // Search for cities
    for (const city of this.cityDatabase) {
      const cityRegex = new RegExp(`\\b${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (cityRegex.test(text)) {
        const confidence = 0.8;
        if (confidence > bestMatch.confidence) {
          bestMatch = {
            city: city,
            fullLocation: city,
            confidence: confidence
          };
        }
      }
    }

    // Search for states
    for (const state of this.stateDatabase) {
      const stateRegex = new RegExp(`\\b${state.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (stateRegex.test(text)) {
        const confidence = 0.7;
        if (confidence > bestMatch.confidence || (bestMatch.city && !bestMatch.state)) {
          bestMatch = {
            ...bestMatch,
            state: state,
            fullLocation: bestMatch.city ? `${bestMatch.city}, ${state}` : state,
            confidence: Math.max(confidence, bestMatch.confidence)
          };
        }
      }
    }

    // Search for countries
    for (const country of this.countryDatabase) {
      const countryRegex = new RegExp(`\\b${country.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
      if (countryRegex.test(text)) {
        const confidence = 0.6;
        if (confidence > bestMatch.confidence || (bestMatch.city && !bestMatch.country)) {
          bestMatch = {
            ...bestMatch,
            country: country,
            fullLocation: bestMatch.fullLocation ? `${bestMatch.fullLocation}, ${country}` : country,
            confidence: Math.max(confidence, bestMatch.confidence)
          };
        }
      }
    }

    // Fuzzy matching for partial matches
    const words = text.split(/\s+/);
    for (const word of words) {
      if (word.length > 3) {
        // Check cities with fuzzy matching
        const cityMatches = this.cityFuzzy.search(word, 0.7);
        if (cityMatches.length > 0) {
          const confidence = cityMatches[0].score * 0.6;
          if (confidence > bestMatch.confidence) {
            bestMatch = {
              city: cityMatches[0].item,
              fullLocation: cityMatches[0].item,
              confidence: confidence
            };
          }
        }

        // Check states with fuzzy matching
        const stateMatches = this.stateFuzzy.search(word, 0.8);
        if (stateMatches.length > 0) {
          const confidence = stateMatches[0].score * 0.5;
          if (confidence > bestMatch.confidence || (bestMatch.city && !bestMatch.state)) {
            bestMatch = {
              ...bestMatch,
              state: stateMatches[0].item,
              fullLocation: bestMatch.city ? `${bestMatch.city}, ${stateMatches[0].item}` : stateMatches[0].item,
              confidence: Math.max(confidence, bestMatch.confidence)
            };
          }
        }

        // Check countries with fuzzy matching
        const countryMatches = this.countryFuzzy.search(word, 0.7);
        if (countryMatches.length > 0) {
          const confidence = countryMatches[0].score * 0.4;
          if (confidence > bestMatch.confidence || (bestMatch.city && !bestMatch.country)) {
            bestMatch = {
              ...bestMatch,
              country: countryMatches[0].item,
              fullLocation: bestMatch.fullLocation ? `${bestMatch.fullLocation}, ${countryMatches[0].item}` : countryMatches[0].item,
              confidence: Math.max(confidence, bestMatch.confidence)
            };
          }
        }
      }
    }

    console.log('📍 Location extracted:', bestMatch);
    return bestMatch;
  }

  static calculateLocationMatch(resumeLocation: LocationInfo, jobLocation: string): LocationMatch {
    if (!resumeLocation.fullLocation || resumeLocation.confidence < 0.3) {
      return {
        location: jobLocation,
        similarity: 0.1,
        distance: 'international'
      };
    }

    const resumeLoc = resumeLocation.fullLocation.toLowerCase();
    const jobLoc = jobLocation.toLowerCase();

    // Exact match
    if (resumeLoc === jobLoc) {
      return {
        location: jobLocation,
        similarity: 1.0,
        distance: 'local'
      };
    }

    // Remote work
    if (jobLoc.includes('remote') || jobLoc.includes('work from home') || jobLoc.includes('anywhere')) {
      return {
        location: jobLocation,
        similarity: 0.9,
        distance: 'remote'
      };
    }

    // Same city
    if (resumeLocation.city && jobLoc.includes(resumeLocation.city.toLowerCase())) {
      return {
        location: jobLocation,
        similarity: 0.9,
        distance: 'local'
      };
    }

    // Same state/region
    if (resumeLocation.state && jobLoc.includes(resumeLocation.state.toLowerCase())) {
      return {
        location: jobLocation,
        similarity: 0.7,
        distance: 'regional'
      };
    }

    // Same country
    if (resumeLocation.country && jobLoc.includes(resumeLocation.country.toLowerCase())) {
      return {
        location: jobLocation,
        similarity: 0.5,
        distance: 'national'
      };
    }

    // Fuzzy matching for similar locations
    const cityMatches = this.cityFuzzy.search(jobLoc, 0.6);
    if (cityMatches.length > 0) {
      const similarity = cityMatches[0].score * 0.8;
      return {
        location: jobLocation,
        similarity: similarity,
        distance: similarity > 0.7 ? 'regional' : 'national'
      };
    }

    // Tech hubs proximity (special case for tech jobs)
    const techHubs = {
      'silicon valley': ['san francisco', 'san jose', 'palo alto', 'mountain view', 'cupertino'],
      'seattle': ['redmond', 'bellevue', 'tacoma'],
      'boston': ['cambridge', 'somerville'],
      'new york': ['jersey city', 'brooklyn', 'queens'],
      'austin': ['round rock', 'cedar park'],
      'denver': ['boulder', 'fort collins']
    };

    for (const [hub, cities] of Object.entries(techHubs)) {
      if ((resumeLoc.includes(hub) && cities.some(city => jobLoc.includes(city))) ||
          (jobLoc.includes(hub) && cities.some(city => resumeLoc.includes(city)))) {
        return {
          location: jobLocation,
          similarity: 0.8,
          distance: 'regional'
        };
      }
    }

    return {
      location: jobLocation,
      similarity: 0.2,
      distance: 'international'
    };
  }

  static getLocationBonus(locationMatch: LocationMatch): number {
    switch (locationMatch.distance) {
      case 'local': return 15;
      case 'remote': return 12;
      case 'regional': return 8;
      case 'national': return 4;
      case 'international': return 0;
      default: return 0;
    }
  }
}
