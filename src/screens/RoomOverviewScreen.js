import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Platform,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const RoomOverviewScreen = ({ route, navigation }) => {
  const { room, isLiked: initialIsLiked, onLikeChange } = route.params;
  const [isLiked, setIsLiked] = React.useState(initialIsLiked);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Preload icons and images
  useEffect(() => {
    const assets = [
      require('../../assets/icons/backIcon.png'),
      require('../../assets/icons/likeIcon.png'),
      require('../../assets/icons/locationIcon.png'),
      require('../../assets/icons/clockIcon.png'),
      require('../../assets/icons/findIcon.png'),
    ];
    
    assets.forEach(asset => {
      if (Platform.OS === 'ios') {
        Image.prefetch(Image.resolveAssetSource(asset).uri);
      }
    });
  }, []);

  const handleLikePress = () => {
    const newLikedState = !isLiked;
    setIsLiked(newLikedState);
    onLikeChange(newLikedState);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      
      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {/* Image Card Section */}
        <View style={styles.cardContainer}>
          <View style={styles.imageCard}>
            <Image 
              source={room.image} 
              style={styles.image}
              onLoadEnd={() => setIsImageLoading(false)}
              defaultSource={room.image}
            />
            {isImageLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#2563EB" />
              </View>
            )}
            
            {/* Header Buttons */}
            <View style={styles.headerButtons}>
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigation.goBack()}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image 
                  source={require('../../assets/icons/backIcon.png')}
                  style={styles.headerIcon}
                  defaultSource={require('../../assets/icons/backIcon.png')}
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={handleLikePress}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Image 
                  source={require('../../assets/icons/likeIcon.png')}
                  style={[styles.headerIcon, { tintColor: isLiked ? '#FF0000' : '#FFFFFF' }]}
                  defaultSource={require('../../assets/icons/likeIcon.png')}
                />
              </TouchableOpacity>
            </View>

            {/* Location Badge */}
            <View style={styles.locationBadge}>
              <Image 
                source={require('../../assets/icons/locationIcon.png')}
                style={[styles.locationIcon, { tintColor: '#2563EB' }]}
                defaultSource={require('../../assets/icons/locationIcon.png')}
              />
              <Text style={styles.locationText} numberOfLines={1}>{room.name}</Text>
            </View>
          </View>

          {/* Content Section */}
          <View style={styles.contentContainer}>
            {/* Tabs */}
            <View style={styles.tabContainer}>
              <Text style={[styles.tabText, styles.activeTab]}>Overview</Text>
            </View>

            {/* Schedule */}
            <View style={styles.scheduleContainer}>
              <Image 
                source={require('../../assets/icons/clockIcon.png')}
                style={styles.clockIcon}
                defaultSource={require('../../assets/icons/clockIcon.png')}
              />
              <Text style={styles.scheduleText}>{room.schedule}</Text>
            </View>

            {/* Description */}
            <Text style={styles.description}>
              {room.description}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Find It Now Button */}
      <View style={styles.findButtonContainer}>
        <TouchableOpacity 
          style={styles.findButton}
          onPress={() => {
            // Map room names to their corresponding node IDs
            const roomToNodeMap = {
              'Canteen': 'C',
              'Auditorium': 'A',
              'Drama Room': 'E',
              'Music Room': 'F',
              'IT Support': 'G',
              'Reception': 'H',
              'Podcast Room': 'I',
              'Maker Space': 'J'
            };
            
            const nodeId = roomToNodeMap[room.name];
            navigation.navigate('RouteSelection', { defaultDestination: nodeId });
          }}
        >
          <Image 
            source={require('../../assets/icons/findIcon.png')}
            style={styles.findIcon}
            defaultSource={require('../../assets/icons/findIcon.png')}
          />
          <Text style={styles.findButtonText}>Find It Now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: hp(10), // Add padding to prevent content from being hidden behind the fixed button
  },
  cardContainer: {
    padding: wp(4),
    paddingTop: Platform.OS === 'ios' ? hp(2) : hp(2),
    paddingBottom: wp(4),
    marginHorizontal: wp(2),
  },
  imageCard: {
    width: '100%',
    height: hp(45),
    borderRadius: wp(5),
    backgroundColor: '#FFFFFF',
    elevation: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.55,
    shadowRadius: 10,
    marginVertical: wp(2),
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: wp(5),
  },
  headerButtons: {
    position: 'absolute',
    top: hp(2),
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: wp(4),
  },
  iconButton: {
    width: wp(13),
    height: wp(13),
    borderRadius: wp(6.5),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerIcon: {
    width: '55%',
    height: '55%',
    resizeMode: 'contain',
    tintColor: '#FFFFFF',
  },
  locationBadge: {
    position: 'absolute',
    bottom: hp(2),
    left: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingVertical: hp(1),
    paddingHorizontal: wp(3),
    borderRadius: wp(4),
    maxWidth: '80%',
  },
  locationIcon: {
    width: wp(5),
    height: wp(5),
    marginRight: wp(2),
    tintColor: '#2563EB',
  },
  locationText: {
    fontFamily: 'Poppins-Bold',
    fontSize: wp(4),
    color: '#FFFFFF',
    flexShrink: 1,
  },
  contentContainer: {
    paddingTop: hp(3),
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: hp(3),
  },
  tabText: {
    fontSize: 16,
    marginRight: wp(5),
    color: '#000000',
    fontFamily: 'Poppins-Regular',
  },
  activeTab: {
    color: '#000000',
    fontFamily: 'Poppins-Black',
    fontSize: 28,
  },
  scheduleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: hp(2),
  },
  clockIcon: {
    width: wp(5.5),
    height: wp(5.5),
    marginRight: wp(2.5),
    tintColor: '#000000',
  },
  scheduleText: {
    fontSize: 14,
    color: '#000000',
    fontFamily: 'Poppins-Bold',
  },
  description: {
    fontSize: 14,
    color: '#666666',
    lineHeight: 22,
    marginBottom: hp(4),
    fontFamily: 'Poppins-Bold',
  },
  findButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: wp(4),
    paddingBottom: Platform.OS === 'ios' ? hp(4) : hp(3),
    paddingTop: hp(2),
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.05)',
  },
  findButton: {
    backgroundColor: '#000000',
    borderRadius: wp(3),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: hp(2),
  },
  findIcon: {
    width: wp(7),
    height: wp(7),
    marginRight: wp(2),
    tintColor: '#FFFFFF',
  },
  findButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Black',
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
});

export default RoomOverviewScreen; 