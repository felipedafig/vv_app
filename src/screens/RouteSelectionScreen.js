import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { getSelectedNavigationCard } from '../utils/SelectedNavigationCard';

// Node data from map_graph.json
const NODES = [
  { id: 'A', name: 'Auditorium' },
  { id: 'C', name: 'Canteen' },
  { id: 'E', name: 'Drama Room' },
  { id: 'F', name: 'Music Room' },
  { id: 'G', name: 'IT Support' },
  { id: 'H', name: 'Reception' },
  { id: 'I', name: 'Podcast Room' },
  { id: 'J', name: 'Maker Space' },
  { id: 'L', name: 'Right Reception' }
];

const RouteSelectionScreen = ({ route, navigation }) => {
  const { defaultDestination } = route.params;
  const [startOpen, setStartOpen] = useState(false);
  const [endOpen, setEndOpen] = useState(false);
  const [startNode, setStartNode] = useState(null);
  const [endNode, setEndNode] = useState(null);

  const [startItems, setStartItems] = useState(
    NODES.map(node => ({ label: node.name, value: node.id }))
  );
  const [endItems, setEndItems] = useState(
    NODES.map(node => ({ label: node.name, value: node.id }))
  );

  useEffect(() => {
    const card = getSelectedNavigationCard();
    if (card) {
      // Map room names to their corresponding node IDs
      const roomToNodeMap = {
        'Canteen': 'C',
        'Auditorium': 'A',
        'Drama Room': 'E',
        'Music Room': 'F',
        'IT Support': 'G',
        'Reception': 'H',
        'Podcast Room': 'I',
        'Maker Space': 'J',
        'Right Reception': 'L'
      };
      
      const nodeId = roomToNodeMap[card.name];
      if (nodeId) {
        setEndNode(nodeId);
      }
    }
  }, []);

  const handleFindRoute = () => {
    navigation.navigate('Map', {
      start: startNode,
      destination: endNode
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Route</Text>
      
      <View style={styles.pickerContainer}>
        <Text style={styles.dropdownLabel}>Starting Point:</Text>
        <DropDownPicker
          open={startOpen}
          value={startNode}
          items={startItems}
          setOpen={setStartOpen}
          setValue={setStartNode}
          setItems={setStartItems}
          placeholder="Select starting point..."
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={2000}
        />
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.dropdownLabel}>Destination:</Text>
        <DropDownPicker
          open={endOpen}
          value={endNode}
          items={endItems}
          setOpen={setEndOpen}
          setValue={setEndNode}
          setItems={setEndItems}
          placeholder="Select destination..."
          style={styles.dropdown}
          textStyle={styles.dropdownText}
          dropDownContainerStyle={styles.dropdownContainer}
          zIndex={1000}
        />
      </View>

      <TouchableOpacity 
        style={[styles.button, (!startNode || !endNode) && { opacity: 0.5 }]}
        onPress={handleFindRoute}
        disabled={!startNode || !endNode}
      >
        <Text style={styles.buttonText}>Find Route</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Poppins-Black',
    marginBottom: 30,
    marginTop: 150,
    textAlign: 'center',
    color: '#000000',
  },
  pickerContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: '#1F2937',
    fontFamily: 'Poppins',
  },
  dropdown: {
    marginBottom: 20,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    fontFamily: 'Poppins-Black',
  },
  dropdownText: {
    fontFamily: 'Poppins-Black',
    fontSize: 14,
    color: '#2563EB',
  },
  dropdownLabel: {
    fontFamily: 'Poppins-Black',
    fontSize: 14,
    color: '#000000',
  },
  dropdownContainer: {
    borderColor: '#FFFFFF',
    borderRadius: 8,
  },
  button: {
    backgroundColor: '#2563EB',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Poppins-Black',
  },
});

export default RouteSelectionScreen; 