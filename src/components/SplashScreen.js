import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SplashScreen = () => {
  const navigation = useNavigation();
  const [showSmall, setShowSmall] = useState(false);
  const fadeBig = useRef(new Animated.Value(0)).current;
  const fadeSmall = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade in big logo
    Animated.timing(fadeBig, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => {
      setTimeout(() => {
        setShowSmall(true);
        Animated.timing(fadeSmall, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }).start(() => {
          // After both animations, wait a bit and navigate
          setTimeout(() => {
            navigation.replace('MainApp');
          }, 2000); // delay here
        });
      }, 600);
    });
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Animated.Image
          source={require('../../assets/images/V_big.png')}
          style={[styles.logoBig, { opacity: fadeBig }]}
          resizeMode="contain"
        />
        {showSmall && (
          <Animated.Image
            source={require('../../assets/images/V_small.png')}
            style={[styles.logoSmall, { opacity: fadeSmall }]}
            resizeMode="contain"
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.viaText}>VIA</Text>
        <Text style={styles.visionText}>VISION</Text>
      </View>
    </View>
  );
};

const { width } = Dimensions.get('window');
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5', // match your design
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    position: 'relative',
    height: width * 0.4, // ensure enough height for absolute positioning
    width: width * 0.6, // enough width for both logos
  },
  logoBig: {
    width: width * 0.4,
    height: width * 0.4,
    position: 'absolute',
    left: 10,
    
  },
  logoSmall: {
    width: width * 0.2,
    height: width * 0.2,
    position: 'absolute',
    right: 10,
    
  },
  textContainer: {
    marginTop: 60,
    alignItems: 'center',
  },
  viaText: {
    fontFamily: 'PorterSansBlock',
    fontWeight: '400',
    fontSize: 100, // adjust for mobile
    lineHeight: 100,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#0022B2',
    textShadowColor: '#00000040',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
  visionText: {
    fontFamily: 'PorterSansBlock',
    fontWeight: '400',
    fontSize: 43,
    lineHeight: 43,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#0022B2',
    textShadowColor: '#00000040',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 4,
  },
});

export default SplashScreen; 