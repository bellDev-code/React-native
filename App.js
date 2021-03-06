import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react'
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Fontisto } from '@expo/vector-icons'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');
// const SCREEN_WIDTH = Dimensions.get('window').width

// 실제 app이라면 서버에 저장 되어야한다.
const API_KEY = "62d024f032d32d6f1f01d39f26529652";

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Rain: "rains",
  Snow: "snow",
  Drizzle: "rain",
  Thunderstorm: "lightning"
}

export default function App() {
  const [city, setCity] = useState("Loading...");
  const [days, setDays] = useState([]);
  const [ok, setOk] = useState(true);

  const getWeather = async() => {
    const {granted} = await Location.requestForegroundPermissionsAsync();

    if(!granted) {
      setOk(false);
    }

    const {
      coords: { latitude, longitude }
    } = await Location.getCurrentPositionAsync({accuracy: 5});

    const location = await Location.reverseGeocodeAsync(
      {latitude, longitude}, 
      {useGoogleMaps: false}
    );
    setCity(location[0].city)

    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`);
    const json = await response.json();
    setDays(json.daily)

  }

  useEffect(() => {
    getWeather();
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        pagingEnabled 
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.weather}
        >
        {days.length === 0 ? (
          <View style={{...styles.day, alignItems: "center"}}>
            <ActivityIndicator 
              color="white" 
              style={{marginTop: 10}} 
              size="large" 
            />
          </View>
        ) : (
          days.map((day, index) => (
            <View key={index} style={styles.day}>
              <View style={{ 
                flexDirection: "flex", 
                alignItems: "center", 
                justifyContent: "space-between", 
                width: "100%"
                }}
              >
                <Text style={styles.temp}>
                  {parseFloat(day.temp.day).toFixed(1)}
                </Text>
                <Fontisto name={icons[day.weather[0].main]} size={80} color="white" />
              </View>
              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
              <Text style={styles.windSpeed}> 바람세기 {day.wind_speed}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "tomato"
  },
  city: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  cityName: {
    fontSize: 68,
    fontWeight: "500",
    color: "white"
  },
  weather: {
    
  },
  day: {
    width: SCREEN_WIDTH,
    alignItems: "center",
  },
  temp: {
    marginTop: 50,
    fontSize: 130,
    color: "white"
  },
  description: {
    marginTop: 5,
    fontSize: 55,
    color: "white"
  },
  tinyText: {
    fontSize: 20,
    color: "white"
  },
  windSpeed: {
    fontSize: 18,
    color: "white"
  }
})
