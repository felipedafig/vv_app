import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Image, Dimensions } from 'react-native';

const SplashScreen = () => {
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
        }).start();
      }, 600);
    });
  }, []);

  return (
    <View style={styles.container}>
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
  logoBig: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 10,
  },
  logoSmall: {
    width: width * 0.2,
    height: width * 0.2,
    position: 'absolute',
    top: width * 0.18,
    right: width * 0.28,
  },
  textContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  viaText: {
    fontFamily: 'PorterSansBlock',
    fontWeight: '400',
    fontSize: 60, // adjust for mobile
    lineHeight: 60,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#0022B2',
    textShadowColor: '#0000FF',
    textShadowOffset: { width: 2, height: 4 },
    textShadowRadius: 1,
  },
  visionText: {
    fontFamily: 'PorterSansBlock',
    fontWeight: '400',
    fontSize: 32,
    lineHeight: 32,
    letterSpacing: 0,
    textAlign: 'center',
    color: '#0022B2',
    textShadowColor: '#0000FF',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 1,
  },
});

export default SplashScreen;