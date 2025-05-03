import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Platform,
  StatusBar,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { setSelectedNavigationCard } from '../utils/SelectedNavigationCard';

const popularRooms = [
  {
    id: '1',
    name: 'Canteen',
    image: require('../../assets/images/canteenImage.jpeg'),
    liked: false,
    description: 'Our spacious canteen offers a variety of fresh, healthy meals daily. With modern facilities and comfortable seating, it\'s the perfect place for lunch or casual meetings.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '2',
    name: 'Campus Cafe',
    image: require('../../assets/images/campusCafeImage.jpeg'),
    liked: false,
    description: 'A cozy spot for coffee, snacks, and light meals. Features specialty coffee drinks and fresh pastries daily. Popular meeting spot for students and faculty.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '3',
    name: 'Music Room',
    image: require('../../assets/images/MusicRoomImage.jpg'),
    liked: false,
    description: 'A soundproofed space equipped with various musical instruments and recording equipment. Perfect for practice sessions and small performances.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '4',
    name: 'Maker Space',
    image: require('../../assets/images/makerSpaceImage.jpg'),
    liked: false,
    description: 'An innovative workspace equipped with 3D printers, laser cutters, and various tools for creative projects. Ideal for prototyping and hands-on learning.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '5',
    name: 'Auditorium',
    image: require('../../assets/images/auditoriumImage.jpg'),
    liked: false,
    description: 'Our state-of-the-art auditorium features excellent acoustics and modern AV equipment. Perfect for lectures, performances, and large gatherings.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '6',
    name: 'Podcast Room',
    image: require('../../assets/images/podcastRoomImage.jpg'),
    liked: false,
    description: 'A professional-grade podcast studio with high-quality microphones and recording equipment. Ideal for podcast production and voice recording.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '7',
    name: 'IT Support',
    image: require('../../assets/images/itSupportImage.jpg'),
    liked: false,
    description: 'Our IT support center provides technical assistance and troubleshooting services. Staffed with experienced professionals ready to help with any tech issues.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '8',
    name: 'Drama Room',
    image: require('../../assets/images/dramaRoomImage.jpg'),
    liked: false,
    description: 'A versatile performance space equipped with stage lighting and sound systems. Perfect for drama rehearsals, performances, and creative workshops.',
    schedule: 'Mon-Fri, 8:00-17:00'
  },
  {
    id: '9',
    name: 'Reception',
    image: require('../../assets/images/receptionImage.jpg'),
    liked: false,
    description: 'The main reception area providing information and assistance to visitors. Staffed with friendly personnel ready to help with directions and general inquiries.',
    schedule: 'Mon-Fri, 8:00-17:00'
  }
];

const filterOptions = ['Most Visited', 'Nearby', 'Liked'];

export default function NavigateScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('Most Visited');
  const [likedRooms, setLikedRooms] = useState({});
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [imageLoadingStates, setImageLoadingStates] = useState(
    popularRooms.reduce((acc, room) => ({
      ...acc,
      [room.id]: true
    }), {})
  );

  // Preload icons
  useEffect(() => {
    const icons = [
      require('../../assets/icons/likeIcon.png'),
      require('../../assets/icons/locationIcon.png')
    ];
    
    icons.forEach(icon => {
      if (Platform.OS === 'ios') {
        Image.prefetch(Image.resolveAssetSource(icon).uri);
      }
    });
  }, []);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 700); // 300ms delay

    return () => clearTimeout(timer);
  }, [searchText]);

  const toggleLike = (roomId) => {
    setLikedRooms(prev => ({
      ...prev,
      [roomId]: !prev[roomId]
    }));
  };

  const handleSearch = () => {
    Keyboard.dismiss();
  };

  const getFilteredRooms = useCallback(() => {
    let filteredRooms = popularRooms;

    // First apply search filter if there's search text
    if (debouncedSearchText.trim()) {
      filteredRooms = filteredRooms.filter(room => 
        room.name.toLowerCase().includes(debouncedSearchText.toLowerCase())
      );
    }
    
    // Then apply category filter
    if (activeFilter === 'Liked') {
      return filteredRooms.filter(room => likedRooms[room.id]);
    }
    if (activeFilter === 'Nearby') {
      return filteredRooms.filter(room => 
        ['Campus Cafe', 'Auditorium', 'Maker Space'].includes(room.name)
      );
    }
    return filteredRooms;
  }, [debouncedSearchText, activeFilter, likedRooms]);

  const renderRoomCard = ({ item }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => {
        setSelectedNavigationCard(item);
        navigation.navigate('RoomOverview', { 
          room: item,
          isLiked: likedRooms[item.id] || false,
          onLikeChange: (newLikedState) => {
            setLikedRooms(prev => ({
              ...prev,
              [item.id]: newLikedState
            }));
          },
          selectedLocation: item.name === 'Auditorium' ? 'A01.01 Auditorium 1' : item.name
        });
      }}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={item.image}
          style={styles.cardImage}
          onLoadEnd={() => {
            setImageLoadingStates(prev => ({
              ...prev,
              [item.id]: false
            }));
          }}
        />
        {imageLoadingStates[item.id] && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#2563EB" />
          </View>
        )}
      </View>
      <TouchableOpacity 
        style={styles.heartButton}
        onPress={() => toggleLike(item.id)}
      >
        <Image 
          source={require('../../assets/icons/likeIcon.png')} 
          style={[
            styles.heartIcon,
            { tintColor: likedRooms[item.id] ? '#FF0000' : '#FFFFFF' }
          ]}
          defaultSource={require('../../assets/icons/likeIcon.png')}
        />
      </TouchableOpacity>
      <View style={styles.cardContent}>
        <Image 
          source={require('../../assets/icons/locationIcon.png')} 
          style={[styles.locationIcon, { tintColor: '#2563EB' }]}
          defaultSource={require('../../assets/icons/locationIcon.png')}
        />
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderRow = (rowData) => (
    <View style={styles.rowContainer}>
      <FlatList
        data={rowData}
        renderItem={renderRoomCard}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.rowList}
      />
    </View>
  );

  const getRowData = () => {
    const filteredRooms = getFilteredRooms();
    const rows = [];
    for (let i = 0; i < filteredRooms.length; i += 4) {
      rows.push(filteredRooms.slice(i, i + 4));
    }
    return rows;
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Navigate</Text>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => navigation.navigate('Profile')}
          activeOpacity={0.6}
        >
          <Image
            source={require('../../assets/icons/profileIcon.png')}
            style={styles.profileIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={styles.title}>Are you Lost?</Text>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <TextInput
            placeholder="Search room..."
            placeholderTextColor="#A9A9A9"
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />
          <View style={styles.searchIconsContainer}>
            <View style={styles.verticalLine} />
            <TouchableOpacity 
              style={styles.settingsButton}
              onPress={() => {}}
            >
              <Image 
                source={require('../../assets/icons/settingIcon.png')} 
                style={styles.searchIcon}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Rooms Title */}
        <Text style={[styles.sectionTitle, { marginBottom: hp(2) }]}>Popular Places</Text>

        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {filterOptions.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton,
              ]}
              onPress={() => setActiveFilter(filter)}
            >
              <Text
                style={[
                  styles.filterText,
                  activeFilter === filter && styles.activeFilterText,
                ]}
              >
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Render rows of cards */}
        {getRowData().map((rowData, index) => (
          <View key={index}>
            {renderRow(rowData)}
          </View>
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
    resizeMode: 'contain',
  },
  content: {
    flex: 1,
    backgroundColor: '#E1E1E1',
  },
  contentContainer: {
    padding: wp(4),
    paddingBottom: hp(12),
  },
  title: {
    fontFamily: 'Poppins-Black',
    fontSize: 23,
    color: '#000000',
    marginBottom: hp(0.8),
    marginLeft: wp(1.7),
    marginTop: hp(2),
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(5),
    borderWidth: 3.5,
    borderColor: '#D1D5DB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(4),
    paddingVertical: hp(1.5),
    marginBottom: hp(4),
  },
  searchInput: {
    flex: 1,
    fontFamily: 'Poppins-Black',
    fontSize: 16,
    paddingVertical: 0,
  },
  searchIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  verticalLine: {
    width: 1,
    height: hp(3),
    backgroundColor: '#D1D5DB',
    marginHorizontal: wp(3),
  },
  settingsButton: {
    padding: wp(1),
  },
  searchIcon: {
    width: wp(5),
    height: wp(5),
  },
  filterDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: wp(2),
    height: wp(2),
    borderRadius: wp(30),
    backgroundColor: '#D1D5DB',
    marginLeft: wp(1),
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: hp(2),
  },
  filterButton: {
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
    borderRadius: wp(6),
    backgroundColor: '#F3F4F6',
  },
  activeFilterButton: {
    backgroundColor: '#000000',
  },
  filterText: {
    fontFamily: 'Poppins-Black',
    fontSize: 14,
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: 'Poppins-Black',
    fontSize: 23,
    color: '#000000',
    marginLeft: wp(2),
  },
  rowContainer: {
   
  },
  rowList: {
    paddingLeft: wp(1.5),
    paddingVertical: hp(2),
  },
  card: {
    width: wp(50),
    height: hp(35),
    marginRight: wp(4),
    borderRadius: wp(15),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
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
    backgroundColor: 'rgba(243, 244, 246, 0.7)',
  },
  cardImage: {
    width: '100%',
    height: '100%',
    borderRadius: wp(5),
  },
  heartButton: {
    position: 'absolute',
    top: hp(2),
    right: wp(4),
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 0,
  },
  heartIcon: {
    width: wp(5.5),
    height: wp(5.5),
    tintColor: '#FFFFFF',
    resizeMode: 'contain',
  },
  cardContent: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: hp(0.8),
    paddingHorizontal: wp(3),
    borderRadius: wp(4),
  },
  locationIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2),
    tintColor: '#2563EB',
  },
  cardTitle: {
    fontFamily: 'Poppins-Black',
    fontSize: 14,
    color: '#FFFFFF',
  },
}); 