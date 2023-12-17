import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom';
import {useLocation } from 'react-router-dom';
import { GoogleMap, LoadScript, InfoWindow, MarkerF, DirectionsRenderer} from '@react-google-maps/api';
import PlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from 'react-places-autocomplete';
import './App.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const AuthContext = createContext();
const GOOGLE_MAPS_API_KEY = 'AIzaSyAA0p1K8FyfuhCf9B52iQmMPZnjU3FsxZA';
const API_BASE_URL = 'http://127.0.0.1:8000';

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

const PrivateRoute = ({ children }) => {
  let navigate = useNavigate();
  let { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  return isAuthenticated ? children : null;
};

const apiLogin = (username, password) => {
  return axios.post(`${API_BASE_URL}/users/login/`, { username, password });
};

const apiRegister = (username, password, email) => {
  return axios.post(`${API_BASE_URL}/users/register/`, { username, password, email });
};

const apiVerifyEmail = (email, otp) => {
  return axios.post(`${API_BASE_URL}/users/verify_email/`, { email, otp });
};

const apiSearchCarpark = (query, maxDistance) => {
  return axios.get(`${API_BASE_URL}/search/?query=${encodeURIComponent(query)}&max_distance=${maxDistance}`);
};

const apiGetCarparkDetails = (carparkID) => {
  return axios.get(`${API_BASE_URL}/carpark/${carparkID}/`);
};

const apiUpdatePassword = (password, userId) => {
  if (!userId) {
      console.log("User not identified. Try logging in again.");
      return;
  }
  return axios.post(`${API_BASE_URL}/users/${userId}/update_password/`, { password });
};

const apiUpdateEmail = (email, userId) => {
  return axios.post(`${API_BASE_URL}/users/${userId}/update_email/`, { email });
};

const apiGetUserFavorites = (userId) => {
  return axios.get(`${API_BASE_URL}/users/${userId}/favorites/`);
};

const apiAddToFavorites = (userId, carparkID) => {
  return axios.post(`${API_BASE_URL}/users/${userId}/favorites/add/`, { carpark_id: carparkID });
};


function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <h1>Welcome to ParkNow</h1>
      <p>Your ultimate solution for parking.</p>
      <button className="start-button" onClick={() => navigate("/login")}>Start</button>
    </div>
  );
}

function LoginForm() {
  const navigate = useNavigate(); 
  const [userId, setUserId] = useState(localStorage.getItem('id') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { setIsAuthenticated } = useAuth();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleLogin = async () => {
    try {
      const response = await apiLogin(username, password);

      if (response.data.success) {
        // Save the token somewhere, either in state, local storage, or some state management library
        const token = response.headers['auth'];
        setUserId(response.data.data.id); // Assuming the API returns the user's id in the data field named 'id'.
        localStorage.setItem('id', response.data.data.id); 
        console.log("Logged in successfully with token:", token);
        setIsLoggedIn(true);
        setIsAuthenticated(true);
      } else {
        console.error(response.data.mess);
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await apiRegister(username, password, email);

      if (response.data.success) {
        console.log("Registered successfully");
        setOtpSent(true);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error registering:", error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await apiVerifyEmail(email, otp);

      if (response.status === 200) {
        console.log("Email verified successfully");
        setIsRegistering(false);
        setIsLoggedIn(true); // Automatically log in after email verification
        setIsAuthenticated(true);
        navigate("/search");  // Navigate using the hook
      } else {
        console.error("Email verification failed");
      }
    } catch (error) {
      console.error("Error verifying email:", error);
    }
  };

  if (isLoggedIn) {
    return navigate("/home");
  }  

  if (isRegistering) {
    return (
      <div className="register-form">
        {otpSent ? (
          <div>
            <h2>Verify Email</h2>
            <form onSubmit={e => e.preventDefault()}>
              <div>
                <label htmlFor="otp">Enter OTP:</label>
                <input 
                  type="text" 
                  id="otp"
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                />
              </div>
              <button type="submit" onClick={handleVerifyEmail}>Verify Email</button>
            </form>
          </div>
        ) : (
          <div>
            <h2>Register</h2>
            <form onSubmit={e => e.preventDefault()}>
              <div>
                <label htmlFor="username">Username:</label>
                <input 
                  type="text" 
                  id="username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
              </div>
    
              <div>
                <label htmlFor="email">Email:</label>
                <input 
                  type="email" 
                  id="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
    
              <div>
                <label htmlFor="password">Password:</label>
                <input 
                  type="password" 
                  id="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
    
              <button type="submit" onClick={handleRegister}>Register</button>
            </form>
          </div>
        )}
    
        <p>Already have an account? <button onClick={() => setIsRegistering(false)}>Login here</button></p>
      </div>
    );
  }


  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={e => e.preventDefault()}>
        <div>
          <label htmlFor="username">Username:</label>
          <input 
            type="text" 
            id="username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password:</label>
          <input 
            type="password" 
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" onClick={handleLogin}>Login</button>
      </form>

      <p>Don't have an account? <button onClick={() => setIsRegistering(true)}>Register here</button></p>
    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  
  return (
    <div className="home-page">
      <div class="button-container">
        <h1>Welcome Back to ParkNow</h1>
        <p>Your ultimate solution for parking.</p>
        <button className="profile-button" onClick={() => navigate("/profile")}>Profile</button>
        <button className="search-button" onClick={() => navigate("/search")}>Search for Parking</button>
      </div>
    </div>
  );
}

function ProfilePage() {
  const userId = localStorage.getItem('id');
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [message, setMessage] = useState('');
  const { setIsAuthenticated } = useAuth();

  const handleUpdatePassword = async () => {
    try {
      const response = await apiUpdatePassword(password, userId);

      if (response.data.success) {
        setMessage("Password changed successfully.");
      } else {
        setMessage(response.data.message || 'Error updating password.');
      }
    } catch (error) {
      setMessage("Error updating password. Try again later.");
      console.error("Error updating password:", error);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      const response = await apiUpdateEmail(email, userId);

      if (response.data.success) {
        setMessage("OTP sent to new email. Please verify to complete the update.");
        setIsOtpSent(true);
      } else {
        setMessage(response.data.message || 'Error updating email.');
      }
    } catch (error) {
      setMessage("Error updating email. Try again later.");
      console.error("Error updating email:", error);
    }
  };

  const handleVerifyEmail = async () => {
    try {
      const response = await apiVerifyEmail(email, otp);

      if (response.status === 200) {
        setMessage("Email updated and verified successfully!");
        setIsOtpSent(false);
      } else {
        setMessage("Email verification failed.");
      }
    } catch (error) {
      setMessage("Error verifying email.");
      console.error("Error verifying email:", error);
    }
  };

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>

      <div>
        <label>Email:</label>
        <input 
          type="email" 
          value={email}
          onChange={e => setEmail(e.target.value)}
        />
      </div>

      {isOtpSent ? (
        <div>
          <label>Enter OTP:</label>
          <input 
            type="text"
            value={otp}
            onChange={e => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyEmail}>Verify OTP</button>
        </div>
      ) : (
        <button onClick={handleUpdateEmail}>Update Email</button>
      )}

      <p>{message}</p>

      <div>
        <label>New Password:</label>
        <input 
          type="password" 
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
      </div>

      <button onClick={handleUpdatePassword}>Update Password</button>

      <button onClick={() => navigate('/favorites')}>View Favorites</button>

      <button onClick={() => setIsAuthenticated(false)}>Exit Account</button>
    </div>
  );
}

function FavoritesPage() {
  const userId = localStorage.getItem('id'); // or the appropriate way you handle authentication
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await apiGetUserFavorites(userId);
        setFavorites(response.data.carparks);
      } catch (error) {
        console.error('Error fetching favorite carparks:', error);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  return (
    <div className="favorites-page">
      <h2>Your Favorite Carparks</h2>
      <ul>
        {favorites.map((carpark, index) => (
          <li key={index}>{carpark.name} - {carpark.location}</li> // assuming these fields exist
        ))}
      </ul>
    </div>
  );
}

function SearchPage() {
  const [address, setAddress] = useState(''); // This will be the address from the autocomplete
  const [maxDistance, setMaxDistance] = useState(1);  // state for maximum distance
  const [results, setResults] = useState([]);

  const handleAddressChange = (value) => {
    console.log('Address changed:', value);
    setAddress(value);
  };

  const handleSelect = async (value) => {
    console.log('Selected address:', value);
    geocodeByAddress(value)
      .then((results) => {
        console.log('Geocode results:', results);
        return getLatLng(results[0]);
      })
      .then((latLng) => {
        console.log('Success - latLng:', latLng);
        setAddress(value);
      })
      .catch((error) => console.error('Error', error));
  };

  const searchOptions = {
    types: ['address'],
    componentRestrictions: { country: 'sg' } // Example for Singapore
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted with address:', address, 'and maxDistance:', maxDistance);
    try {
      const response = await apiSearchCarpark(address, maxDistance);
      console.log('API Response:', response.data);
      if (response.data && response.data.nearby_carparks) {
        setResults(response.data.nearby_carparks);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <div>
      <h2>Search Page</h2>
      <form onSubmit={handleSubmit}>
        <PlacesAutocomplete
          value={address}
          onChange={handleAddressChange}
          onSelect={handleSelect}
          searchOptions={searchOptions}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => {
            // Log loading state and suggestions state
            console.log('Loading:', loading);
            console.log('Suggestions:', suggestions);
            return (
              <div>
                <input
                  {...getInputProps({
                    placeholder: 'Search Places...',
                    className: 'location-search-input',
                  })}
                />
                <div className="autocomplete-dropdown-container">
                  {loading && <div>Loading...</div>}
                  {suggestions.map((suggestion) => (
                    <div
                      {...getSuggestionItemProps(suggestion, {
                        className: suggestion.active
                          ? 'suggestion-item--active'
                          : 'suggestion-item',
                      })}
                    >
                      <span>{suggestion.description}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          }}
        </PlacesAutocomplete>
        <input
          type="number"
          placeholder="Max distance (km)"
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
      <CarparkList results={results} />
    </div>
  );
}

function SearchResults({ match }) {
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);
  const searchQuery = match.params.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiSearchCarpark(searchQuery);
        if (response.data && response.data.nearby_carparks) {
          setResults(response.data.nearby_carparks);
          setError(null);
        }
      } catch (error) {
        console.error("Error fetching carpark results:", error);
        setError("Failed to retrieve carpark results. Please try again.");
      }
    };
    
    fetchData();
  }, [searchQuery]);

  return (
    <div>
      <h2>Search Results for: {searchQuery}</h2>
      {error && <p className="error">{error}</p>}
      <CarparkList results={results} />
    </div>
  );
}

function CarparkList({ results }) {

  const navigate = useNavigate(); 
  
  const handleCarparkClick = (carpark) => {
    navigate(`/carpark/${carpark.CarParkID}`);
};

  return (
    <div>
      {results.map((carpark, index) => (
        <button key={index} onClick={() => handleCarparkClick(carpark)} className="carpark-button">
          <h2>{carpark.CarParkName}</h2>
          <p><strong>ID:</strong> {carpark.CarParkID}</p>
          <p><strong>Address:</strong> {carpark.Address}</p> {/* Added line for address */}
          <p><strong>Availability:</strong> {carpark.Availability} out of {carpark.TotalLots}</p>
          <p><strong>Parking System:</strong> {carpark.parkingSystem}</p>
          <p><strong>Operating Hours:</strong> {carpark.startTime} - {carpark.endTime}</p>
          <p><strong>Weekday Rate:</strong> {carpark.weekdayMin} mins for {carpark.weekdayRate}</p>
          <p><strong>Saturday Rate:</strong> {carpark.satdayMin} mins for {carpark.satdayRate}</p>
          <p><strong>Sunday/PH Rate:</strong> {carpark.sunPHMin} mins for {carpark.sunPHRate}</p>
        </button>
      ))}
    </div>
  )
}

const getLatLngFromAddress = async (address) => {
  const endpoint = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`;
  const response = await axios.get(endpoint);
  if (response.data.status === 'OK') {
    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } else {
    throw new Error('Failed to get lat/lng from address');
  }
};

function CarparkDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const [carpark, setCarpark] = useState(null);
  const [showInfo, setShowInfo] = useState(false); 
  const carparkID = location.pathname.split("/")[2];
  const [startPoint, setStartPoint] = useState('');
  const [endPoint, setEndPoint] = useState(''); // default to carpark name
  const [startPointSuggestions, setStartPointSuggestions] = useState([]);
  const [links, setLinks] = useState({});
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = async () => {
    const userId = parseInt(localStorage.getItem('id')); // Adjust how you retrieve the user's ID
    try {
      if (!isFavorite) {
        await apiAddToFavorites(userId, carparkID);
      } else {
        // Logic to remove from favorites
      }
      setIsFavorite(!isFavorite); // Toggle favorite state
      // Display a notification based on the new state
      alert(isFavorite ? 'Carpark removed from favorites.' : 'Carpark added to favorites.');
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleSelectStartPoint = async (value) => {
    try {
      const results = await geocodeByAddress(value);
      const latLng = await getLatLng(results[0]);
      setStartPoint(value);
      console.log('Success', latLng);
    } catch (error) {
      console.error('Error', error);
    }
  };

  const handleChangeStartPoint = (value) => {
    setStartPoint(value);
  };

  const handleRouteSearch = async () => {
    try {
      // Convert start and end points to lat/lng
      const startLatLng = await getLatLngFromAddress(startPoint);
      const endLatLng = carpark ? await getLatLngFromAddress(endPoint || carpark.CarParkName) : null;
      if (startLatLng && endLatLng) {
        navigate(`/navigate/${startLatLng.lat},${startLatLng.lng},${endLatLng.lat},${endLatLng.lng}`);
      }
    } catch (error) {
      console.error("Error converting address to lat/lng:", error);
    }
  };

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const detailsResponse = await apiGetCarparkDetails(carparkID);
        if (detailsResponse.data.carpark.coordinates && detailsResponse.data.carpark.coordinates.length === 2) {
          setCarpark(detailsResponse.data.carpark);
          setEndPoint(detailsResponse.data.carpark.CarParkName); // Update endPoint here

          // Generate links directly using the carpark's name
          const encodedCarparkName = encodeURIComponent(detailsResponse.data.carpark.CarParkName);
          const googleMapsLink = `https://www.google.com/maps/search/?api=1&query=${encodedCarparkName}`;
          const appleMapsLink = `http://maps.apple.com/?q=${encodedCarparkName}`;
          const carparkUrl = window.location.href; // Current page URL

          setLinks({
            'google_maps': googleMapsLink,
            'apple_maps': appleMapsLink,
            'url_link': carparkUrl
          });

        } else {
          console.error("Error fetching coordinates from the response data.");
        }
      } catch (error) {
        console.error("Error fetching carpark details:", error);
      }
    };
  
    fetchDetails();
  }, [carparkID]); // This will run when 'carparkID' changes

  if (!carpark) {
    return <p>Loading...</p>;
  }

  // Add this function inside the CarparkDetails component
  const addToFavorites = async () => {
    const userId = parseInt(localStorage.getItem('id')); // Adjust how you retrieve the user's ID
    try {
      await apiAddToFavorites(userId, carparkID);
      alert('Carpark added to favorites.'); // You might want to handle this more gracefully
    } catch (error) {
      console.error('Error adding carpark to favorites:', error);
    }
  };

  const handleCopyLink = (linkType) => {
    const link = links[linkType];
    if (link) {
      navigator.clipboard.writeText(link).then(() => {
        alert(`${linkType} link copied to clipboard!`); // Or use a nicer notification
      }, (err) => {
        console.error('Could not copy text: ', err);
      });
    }
  };

  return (
    <div className="carpark-details-container">
      <div className={`left-bar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? '>' : '<'} {/* Icons or text to indicate action */}
        </button>
        <div className="search-container">
        <PlacesAutocomplete
          value={startPoint}
          onChange={handleChangeStartPoint}
          onSelect={handleSelectStartPoint}
        >
          {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
            <div>
              <input
                {...getInputProps({
                  placeholder: 'Enter your starting point...',
                  className: 'location-search-input',
                })}
              />
              <div className="autocomplete-dropdown-container">
                {loading && <div>Loading...</div>}
                {suggestions.map((suggestion) => (
                  <div
                    {...getSuggestionItemProps(suggestion, {
                      className: 'suggestion-item',
                    })}
                  >
                    {suggestion.description}
                  </div>
                ))}
              </div>
            </div>
          )}
        </PlacesAutocomplete>

          <input 
              type="text"
              placeholder={carpark.CarParkName}
              value={endPoint}
              onChange={(e) => setEndPoint(e.target.value)}
          />
          <button onClick={handleRouteSearch}>Search</button>
          {/* Toggleable Favorite Button */}
          <button className={`favorite-button ${isFavorite ? 'favorite' : ''}`} onClick={toggleFavorite}>
            ★ {/* Star character as an icon */}
          </button>
        </div>
        <div className="carpark-info">
          <h2>{carpark.CarParkName}</h2>
          <p><strong>ID:</strong> {carpark.CarParkID}</p>
          <p><strong>Availability:</strong> {carpark.Availability} out of {carpark.TotalLots}</p>
          <p><strong>Parking System:</strong> {carpark.parkingSystem}</p>
          <p><strong>Operating Hours:</strong> {carpark.startTime} - {carpark.endTime}</p>
          <p><strong>Weekday Rate:</strong> {carpark.weekdayMin} mins for {carpark.weekdayRate}</p>
          <p><strong>Saturday Rate:</strong> {carpark.satdayMin} mins for {carpark.satdayRate}</p>
          <p><strong>Sunday/PH Rate:</strong> {carpark.sunPHMin} mins for {carpark.sunPHRate}</p>
        </div>
        <div className="link-generation-dropdown">
          <button className="dropdown-button">Generate Link</button>
          <div className="dropdown-content">
            <button onClick={() => handleCopyLink('google_maps')}>Google Maps</button>
            <button onClick={() => handleCopyLink('apple_maps')}>Apple Maps</button>
            <button onClick={() => handleCopyLink('url_link')}>URL Link</button>
        </div>
      </div>
      </div>
      <div className="map-container">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            zoom={15}
            center={{ lat: carpark.coordinates[0], lng: carpark.coordinates[1] }}
          >
            <MarkerF 
              position={{ lat: carpark.coordinates[0], lng: carpark.coordinates[1] }}
              onClick={() => setShowInfo(!showInfo)}
            >
              {showInfo && (
                <InfoWindow onCloseClick={() => setShowInfo(false)}>
                  <div>
                    {carpark.CarParkName}
                  </div>
                </InfoWindow>
              )}
            </MarkerF>
          </GoogleMap>
      </div>
    </div>
  );
}

function RoutePage() {
  const location = useLocation();
  const [route, setRoute] = useState(null);
  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const [coordinates, startLat, startLng, endLat, endLng] = useMemo(() => {
    const coords = location.pathname.split("/")[2].split(",");
    return [
        coords,
        parseFloat(coords[0]),
        parseFloat(coords[1]),
        parseFloat(coords[2]),
        parseFloat(coords[3])
    ];
  }, [location.pathname]);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/navigate/${startLat},${startLng},${endLat},${endLng}`);
        if (response.data) {
          setRoute(response.data);

          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route({
            origin: { lat: startLat, lng: startLng },
            destination: { lat: endLat, lng: endLng },
            travelMode: 'DRIVING'
          }, (result, status) => {
            if (status === 'OK') {
              setDirections(result);

              // Extract the distance from the directions result
              const routeDistance = result.routes[0].legs[0].distance.text;
              setDistance(routeDistance);
            } else {
              console.error(`Error fetching directions ${result}`);
            }
          });
        }
      } catch (error) {
        console.error("Error fetching the route:", error);
      }
    };

    fetchRoute();
  }, [coordinates, startLat, startLng, endLat, endLng]);

  return (
    <div className="carpark-details-container">
      
      <div className={`left-bar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <button className="toggle-button" onClick={toggleSidebar}>
          {isSidebarCollapsed ? '>' : '<'} {/* Icons or text to indicate action */}
        </button>
      <h2>Route Details</h2>
        <div className="search-container">
          {distance && <p>Estimated Distance: {distance}</p>}
        </div>
        <div className="navigate-button-container">
          <button>Enter Navigation Mode</button>
        </div>
      </div>
      <div className="map-container">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          zoom={10}
          center={{ lat: startLat, lng: startLng }}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
    </div>
  );
}

function App() {
  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY} libraries={["places"]}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />
            <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
            <Route path="/favorites" element={<PrivateRoute><FavoritesPage /></PrivateRoute>} />
            <Route path="/search" element={<PrivateRoute><SearchPage /></PrivateRoute>} />
            <Route path="/results/:query" element={<PrivateRoute><SearchResults /></PrivateRoute>} />
            <Route path="/carpark/:carparkID" element={<PrivateRoute><CarparkDetails /></PrivateRoute>} />
            <Route path="/navigate/:coordinates" element={<PrivateRoute><RoutePage /></PrivateRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </LoadScript>
  );
}

export default App;