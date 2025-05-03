import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const popularItems = [
  {
    id: '1',
    name: 'Monday',
    image: require('../../assets/images/paella-valenciana-tradicional.jpg'),
    description: 'Monday\'s special menu and dishes available for the day.',
  },
  {
    id: '2',
    name: 'Tuesday',
    image: require('../../assets/images/Papasarrugadas.jpg'),
    description: 'Tuesday\'s special menu and dishes available for the day.',
  },
  {
    id: '3',
    name: 'Wednesday',
    image: require('../../assets/images/Salmorejo-cordobes-casero.jpg'),
    description: 'Wednesday\'s special menu and dishes available for the day.',
  },
  {
    id: '4',
    name: 'Thursday',
    image: require('../../assets/images/Tortilla-de-patatas.jpg'),
    description: 'Thursday\'s special menu and dishes available for the day.',
  },
  {
    id: '5',
    name: 'Friday',
    image: require('../../assets/images/pulpo-a-la-gallega.jpg'),
    description: 'Friday\'s special menu and dishes available for the day.',
  },
];

export default function FoodScreen({ navigation }) {
  const [imageLoadingStates, setImageLoadingStates] = useState(
    popularItems.reduce((acc, item) => ({ ...acc, [item.id]: true }), {})
  );

  const renderItemCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ItemOverview', { item })}
    >
      <View style={styles.imageContainer}>
        <Image
          source={item.image}
          style={styles.cardImage}
          onLoadEnd={() =>
            setImageLoadingStates(prev => ({ ...prev, [item.id]: false }))
          }
        />
        {imageLoadingStates[item.id] && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  // Group into rows of 2 items
  const rows = [];
  for (let i = 0; i < popularItems.length; i += 2) {
    rows.push(popularItems.slice(i, i + 2));
  }

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Lunch</Text>
        <TouchableOpacity
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.7}
        >
          <Image
            source={require('../../assets/icons/profileIcon.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>
  
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {rows.map((row, idx) => (
          <FlatList
            key={idx}
            data={row}
            renderItem={renderItemCard}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.rowList}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingTop: Platform.OS === 'ios' ? hp(6) : hp(3),
    paddingBottom: hp(),
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontFamily: 'Poppins-Black',
    fontSize: 23,
    color: '#000000',
    marginBottom: hp(0.8),
    marginLeft: wp(1.7),
    marginTop: hp(2),
  },

  headerTitle: {
    fontFamily: 'Poppins-Black',
    fontSize: 27,
    color: '#000000',
    marginTop: hp(2),
    marginBottom: hp(0.8),
  },
  profileButton: {
    width: wp(12),
    height: wp(12),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileIcon: {
    width: wp(9),
    height: wp(9),
  },
  content: {
    flex: 1,
    backgroundColor: '#E1E1E1',
  },
  contentContainer: {
    padding: wp(4),
    paddingBottom: hp(12),
  },
  rowList: {
    paddingLeft: wp(1.5),
    paddingVertical: hp(2),
  },
  card: {
    width: wp(43), // adjusted for two per row
    height: hp(35),
    marginRight: wp(4),
    borderRadius: wp(5),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 8,
  },
  imageContainer: {
    width: '100%',
    height: '100%',
    borderRadius: wp(5),
    overflow: 'hidden',
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(243,244,246,0.7)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(5),
  },
  cardContent: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(4),
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: wp(4),
  },
  cardTitle: {
    fontFamily: 'Poppins-Black',
    fontSize: 14,
    color: '#FFFFFF',
  },
});
