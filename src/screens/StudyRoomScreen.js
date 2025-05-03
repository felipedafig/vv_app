import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  StatusBar,
  Keyboard,
  FlatList,
  Modal,
  Image,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

const initialRooms = [
  { id: '1', name: 'C02.04', status: 'Available' },
  { id: '2', name: 'C02.05', status: 'Available' },
  { id: '3', name: 'C02.06', status: 'Available' },
  { id: '4', name: 'C02.07', status: 'Available' },
  { id: '5', name: 'C02.08', status: 'Available' },
  { id: '6', name: 'C02.09', status: 'Available' },
  { id: '7', name: 'C02.10', status: 'Available' },
  { id: '8', name: 'C02.11', status: 'Available' },
  { id: '9', name: 'C02.12', status: 'Available' },
  { id: '10', name: 'C02.13', status: 'Available' },
];

const filterOptions = ['All', 'Available', 'Occupied'];

export default function StudyRoomScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [rooms, setRooms] = useState(initialRooms);
  const [occupiedRoom, setOccupiedRoom] = useState(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);

  // Debounce search text
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchText(searchText);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchText]);

  const handleSearch = () => {
    Keyboard.dismiss();
  };

  const handleRoomPress = (room) => {
    if (room.status === 'Available') {
      // If no room is occupied, occupy this one
      if (!occupiedRoom) {
        setRooms(prevRooms => prevRooms.map(r =>
          r.id === room.id ? { ...r, status: 'Occupied' } : r
        ));
        setOccupiedRoom({ ...room, status: 'Occupied' });
      } else {
        // Do nothing if already in a room
        return;
      }
    } else if (room.status === 'Occupied' && occupiedRoom && room.id === occupiedRoom.id) {
      setShowLeaveModal(true);
    }
  };

  const handleLeaveRoom = () => {
    if (occupiedRoom) {
      setRooms(prevRooms => prevRooms.map(r =>
        r.id === occupiedRoom.id ? { ...r, status: 'Available' } : r
      ));
      setOccupiedRoom(null);
      setShowLeaveModal(false);
    }
  };

  const getFilteredRooms = useCallback(() => {
    let filteredRooms = rooms;

    // First apply search filter if there's search text
    if (debouncedSearchText.trim()) {
      filteredRooms = filteredRooms.filter(room => 
        room.name.toLowerCase().includes(debouncedSearchText.toLowerCase())
      );
    }
    
    // Then apply status filter
    if (activeFilter === 'Available') {
      return filteredRooms.filter(room => room.status === 'Available');
    }
    if (activeFilter === 'Occupied') {
      return filteredRooms.filter(room => 
        room.status === 'Occupied' || 
        (occupiedRoom && room.id === occupiedRoom.id)
      );
    }
    return filteredRooms;
  }, [debouncedSearchText, activeFilter, occupiedRoom, rooms]);

  // Helper to get rooms for grid
  const getRoomsForGrid = () => {
    let rooms = getFilteredRooms();
    // Transform to column-major order: group into pairs for each row
    const rows = [];
    for (let i = 0; i < rooms.length; i += 2) {
      rows.push([rooms[i], rooms[i + 1] || null]);
    }
    return rows;
  };

  // Render a row with up to two rooms
  const renderRoomRow = ({ item, index }) => (
    <View style={styles.row} key={`row-${index}`}>
      {item.map((room, idx) =>
        room ? (
          <TouchableOpacity
            key={`room-${room.id}`}
            style={[
              styles.card,
              { 
                backgroundColor:
                  occupiedRoom && room.id === occupiedRoom.id
                    ? '#FFEBEE'
                    : room.status === 'Occupied'
                      ? '#FFF3E0'
                      : '#E8F5E9',
              },
            ]}
            onPress={() => handleRoomPress(room)}
          >
            <Text style={styles.roomName}>{room.name}</Text>
            <Text
              style={[
                styles.roomStatus,
                {
                  color:
                    occupiedRoom && room.id === occupiedRoom.id
                      ? '#C62828'
                      : room.status === 'Occupied'
                        ? '#E65100'
                        : '#2E7D32',
                },
              ]}
            >
              {occupiedRoom && room.id === occupiedRoom.id
                ? 'Occupied (You)'
                : room.status}
            </Text>
          </TouchableOpacity>
        ) : (
          <View key={`empty-${index}-${idx}`} style={[styles.card, { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0 }]} />
        )
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Study Rooms</Text>
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
      <FlatList
        data={getRoomsForGrid()}
        renderItem={renderRoomRow}
        keyExtractor={(_, idx) => `row-${idx}`}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.roomListContainer}
        ListHeaderComponent={
          <View style={styles.contentContainer}>
            {occupiedRoom && (
              <TouchableOpacity 
                style={styles.occupiedBanner}
                onPress={() => setShowLeaveModal(true)}
              >
                <Text style={styles.occupiedBannerText}>
                  You are currently in room {occupiedRoom.name}
                </Text>
                <Text style={styles.leaveRoomText}>Tap to leave</Text>
              </TouchableOpacity>
            )}
            <Text style={styles.title}>Find a Study Room</Text>
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
          </View>
        }
        ListHeaderComponentStyle={{ paddingBottom: 0 }}
      />
      {/* Leave Room Modal */}
      <Modal
        visible={showLeaveModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowLeaveModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you leaving?</Text>
            <Text style={styles.modalText}>
              Do you want to leave room {occupiedRoom?.name}?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowLeaveModal(false)}
              >
                <Text style={styles.modalButtonText}>No</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleLeaveRoom}
              >
                <Text style={[styles.modalButtonText, styles.confirmButtonText]}>Yes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: wp(4),
    paddingBottom: 0,
  },
  title: {
    fontFamily: 'Poppins-Black',
    fontSize: 23,
    color: '#000000',
    marginBottom: hp(1),
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 0,
    marginBottom: hp(1),
  },
  card: {
    width: wp(48),
    padding: wp(4),
    borderRadius: wp(3),
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    marginHorizontal: wp(0.25),
    marginBottom: 0,
  },
  roomName: {
    fontFamily: 'Poppins-Black',
    fontSize: 18,
    color: '#000000',
    marginBottom: hp(0.5),
  },
  roomStatus: {
    fontFamily: 'Poppins-Black',
    fontSize: 14,
  },
  occupiedBanner: {
    backgroundColor: '#2563EB',
    padding: wp(4),
    borderRadius: wp(3),
    marginBottom: hp(2),
  },
  occupiedBannerText: {
    fontFamily: 'Poppins-Black',
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: hp(0.5),
  },
  leaveRoomText: {
    fontFamily: 'Poppins-Black',
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: wp(4),
    padding: wp(6),
    width: wp(80),
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Poppins-Black',
    fontSize: 20,
    color: '#000000',
    marginBottom: hp(1),
  },
  modalText: {
    fontFamily: 'Poppins-Black',
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
    marginBottom: hp(3),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    paddingVertical: hp(1.5),
    paddingHorizontal: wp(6),
    borderRadius: wp(3),
    minWidth: wp(30),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  confirmButton: {
    backgroundColor: '#2563EB',
  },
  modalButtonText: {
    fontFamily: 'Poppins-Black',
    fontSize: 16,
    color: '#4B5563',
  },
  confirmButtonText: {
    color: '#FFFFFF',
  },
  roomListContainer: {
    paddingBottom: hp(4),
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#1F2937',
    fontFamily: 'Poppins-Black',
  },
}); 