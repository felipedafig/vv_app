import React, { useState, useRef, useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Node coordinates from map_graph.json
const NODE_COORDINATES = {
  'A': { x: 420, y: 360, "name": "Auditorium" },
  'B': { x: 360, y: 320, "name": "Center" },
  'C': { x: 225, y: 360, "name": "Canteen" },
  'D': { x: 285, y: 425, "name": "Entrance" },
  'E': { x: 370, y: 500, "name": "Drama Room" },
  'F': { x: 420, y: 490, "name": "Music Room" },
  'G': { x: 250, y: 220, "name": "IT Support" },
  'H': { x: 300, y: 300, "name": "Reception" },
  'I': { x: 270, y: 180, "name": "Podcast Room" },
  'J': { x: 390, y: 360, "name": "Maker Space" },
  'L': { x: 255, y: 295, "name": "Right Reception" }
};

// Define edges between nodes with weights (distances)
const EDGES = [
  { from: 'A', to: 'B', weight: calculateDistance('A', 'B') },
  { from: 'A', to: 'J', weight: calculateDistance('A', 'J') },
  { from: 'B', to: 'C', weight: calculateDistance('B', 'C') },
  { from: 'B', to: 'D', weight: calculateDistance('B', 'D') },
  { from: 'C', to: 'D', weight: calculateDistance('C', 'D') },
  { from: 'D', to: 'E', weight: calculateDistance('D', 'E') },
  { from: 'E', to: 'F', weight: calculateDistance('E', 'F') },
  { from: 'F', to: 'A', weight: calculateDistance('F', 'A') },
  { from: 'H', to: 'B', weight: calculateDistance('H', 'B') },
  { from: 'I', to: 'B', weight: calculateDistance('I', 'B') },
  { from: 'J', to: 'B', weight: calculateDistance('J', 'B') },
  { from: 'L', to: 'C', weight: calculateDistance('L', 'C') },
  { from: 'L', to: 'D', weight: calculateDistance('L', 'D') },
  { from: 'L', to: 'G', weight: calculateDistance('L', 'G') },
  { from: 'L', to: 'H', weight: calculateDistance('L', 'H') },
  { from: 'G', to: 'I', weight: calculateDistance('G', 'I') },
  { from: 'L', to: 'J', weight: calculateDistance('L', 'J') },
  { from: 'L', to: 'B', weight: calculateDistance('L', 'B') }
];

// Function to calculate Euclidean distance between two nodes
function calculateDistance(node1, node2) {
  const coord1 = NODE_COORDINATES[node1];
  const coord2 = NODE_COORDINATES[node2];
  
  // Add safety checks
  if (!coord1 || !coord2) {
    console.warn(`Invalid nodes: ${node1} or ${node2} not found in NODE_COORDINATES`);
    return Infinity; // Return a large value for invalid nodes
  }
  
  return Math.sqrt(
    Math.pow(coord2.x - coord1.x, 2) + 
    Math.pow(coord2.y - coord1.y, 2)
  );
}

const MAX_COORDINATE = 597; // Updated maximum coordinate value
const MARGIN_MULTIPLIER = 0.5; // 50% margin on each side
const POSITION_OFFSET_X = 0; // Adjust marker position left
const POSITION_OFFSET_Y = 0; // Adjust marker position up

const MapScreen = ({ route }) => {
  // Safely extract route parameters with default values
  const start = route?.params?.start || 'A'; // Default to Auditorium
  const destination = route?.params?.destination || 'C'; // Default to Canteen

  const [mapSize, setMapSize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const lastDistance = useRef(0);
  const lastTouchX = useRef(0);
  const lastTouchY = useRef(0);
  const isPanning = useRef(false);
  const pathOpacity = useRef(new Animated.Value(0)).current;

  // Get coordinates for start and destination nodes
  const startCoords = NODE_COORDINATES[start];
  const endCoords = NODE_COORDINATES[destination];

  // Scale coordinates based on map dimensions
  const scaleCoordinate = (coord, dimension) => {
    return (coord / MAX_COORDINATE) * dimension;
  };

  const handleTouchStart = (event) => {
    const touch = event.nativeEvent.touches[0];
    lastTouchX.current = touch.pageX;
    lastTouchY.current = touch.pageY;
    isPanning.current = true;

    if (event.nativeEvent.touches.length === 2) {
      const touch1 = event.nativeEvent.touches[0];
      const touch2 = event.nativeEvent.touches[1];
      lastDistance.current = Math.sqrt(
        Math.pow(touch2.pageX - touch1.pageX, 2) +
        Math.pow(touch2.pageY - touch1.pageY, 2)
      );
    }
  };

  const handleTouchMove = (event) => {
    if (event.nativeEvent.touches.length === 1 && isPanning.current) {
      const touch = event.nativeEvent.touches[0];
      const dx = touch.pageX - lastTouchX.current;
      const dy = touch.pageY - lastTouchY.current;

      // Calculate maximum offset based on current scale and margin
      const maxOffsetX = (mapSize.width * (scale - 1 + MARGIN_MULTIPLIER)) / 2;
      const maxOffsetY = (mapSize.height * (scale - 1 + MARGIN_MULTIPLIER)) / 2;

      // Update offset with bounds checking
      setOffsetX(prev => {
        const newOffset = prev + dx;
        return Math.min(Math.max(newOffset, -maxOffsetX), maxOffsetX);
      });
      setOffsetY(prev => {
        const newOffset = prev + dy;
        return Math.min(Math.max(newOffset, -maxOffsetY), maxOffsetY);
      });

      lastTouchX.current = touch.pageX;
      lastTouchY.current = touch.pageY;
    } else if (event.nativeEvent.touches.length === 2) {
      const touch1 = event.nativeEvent.touches[0];
      const touch2 = event.nativeEvent.touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.pageX - touch1.pageX, 2) +
        Math.pow(touch2.pageY - touch1.pageY, 2)
      );

      if (lastDistance.current > 0) {
        const newScale = scale * (currentDistance / lastDistance.current);
        setScale(Math.min(Math.max(newScale, 1), 3));
      }
      lastDistance.current = currentDistance;
    }
  };

  const handleTouchEnd = () => {
    lastDistance.current = 0;
    isPanning.current = false;
  };

  // Calculate marker positions based on current viewport
  const getMarkerPosition = (coords) => {
    if (!mapSize.width || !mapSize.height) return { left: 0, top: 0 };
    
    const x = scaleCoordinate(coords.x, mapSize.width);
    const y = scaleCoordinate(coords.y, mapSize.height);
    
    return {
      left: x - 25 + POSITION_OFFSET_X,
      top: y - 25 + POSITION_OFFSET_Y,
    };
  };

  // Dijkstra's algorithm implementation
  const findShortestPath = (start, end) => {
    const distances = {};
    const previous = {};
    const unvisited = new Set();
    const visited = new Set();

    // Initialize distances
    Object.keys(NODE_COORDINATES).forEach(node => {
      distances[node] = node === start ? 0 : Infinity;
      previous[node] = null;
      unvisited.add(node);
    });

    while (unvisited.size > 0) {
      // Find the unvisited node with the smallest distance
      let current = null;
      let smallestDistance = Infinity;
      
      unvisited.forEach(node => {
        if (distances[node] < smallestDistance) {
          smallestDistance = distances[node];
          current = node;
        }
      });

      if (current === null || current === end) break;

      unvisited.delete(current);
      visited.add(current);

      // Update distances to neighbors
      EDGES.forEach(edge => {
        if (edge.from === current && !visited.has(edge.to)) {
          const distance = distances[current] + edge.weight;
          if (distance < distances[edge.to]) {
            distances[edge.to] = distance;
            previous[edge.to] = current;
          }
        } else if (edge.to === current && !visited.has(edge.from)) {
          const distance = distances[current] + edge.weight;
          if (distance < distances[edge.from]) {
            distances[edge.from] = distance;
            previous[edge.from] = current;
          }
        }
      });
    }

    // Reconstruct the path
    const path = [];
    let current = end;
    while (current !== null) {
      path.unshift(current);
      current = previous[current];
    }

    // Convert path to edges
    const pathEdges = [];
    for (let i = 0; i < path.length - 1; i++) {
      const from = path[i];
      const to = path[i + 1];
      const edge = EDGES.find(e => 
        (e.from === from && e.to === to) || 
        (e.from === to && e.to === from)
      );
      if (edge) {
        pathEdges.push(edge);
      }
    }

    return pathEdges;
  };

  // Function to get path data for SVG
  const getPathData = (start, end) => {
    const startCoords = NODE_COORDINATES[start];
    const endCoords = NODE_COORDINATES[end];
    
    if (!startCoords || !endCoords) return '';
    
    const startX = scaleCoordinate(startCoords.x, mapSize.width) + POSITION_OFFSET_X;
    const startY = scaleCoordinate(startCoords.y, mapSize.height) + POSITION_OFFSET_Y;
    const endX = scaleCoordinate(endCoords.x, mapSize.width) + POSITION_OFFSET_X;
    const endY = scaleCoordinate(endCoords.y, mapSize.height) + POSITION_OFFSET_Y;
    
    return `M ${startX} ${startY} L ${endX} ${endY}`;
  };

  useEffect(() => {
    // Reset opacity when path changes
    pathOpacity.setValue(0);
    // Animate path opacity
    Animated.timing(pathOpacity, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();
  }, [start, destination]);

  return (
    <View style={styles.container}>
      <View style={styles.markerLegendContainer}>
        <Text style={styles.legendTitle}>Navigation Markers</Text>
        <View style={styles.legendItem}>
          <View style={styles.legendMarkerContainer}>
            <View style={styles.greenCircle} />
          </View>
          <Text style={styles.legendText}>Starting Point</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendMarkerContainer}>
            <View style={styles.redXContainer}>
              <View style={[styles.redXLine, { transform: [{ rotate: '45deg' }] }]} />
              <View style={[styles.redXLine, { transform: [{ rotate: '-45deg' }] }]} />
            </View>
          </View>
          <Text style={styles.legendText}>Destination</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={styles.legendMarkerContainer}>
            <View style={styles.dottedLineContainer}>
              {[...Array(5)].map((_, index) => (
                <View key={index} style={styles.dottedLineSegment} />
              ))}
            </View>
          </View>
          <Text style={styles.legendText}>Path</Text>
        </View>
      </View>

      <View style={styles.mapWrapper}>
        <View
          style={[
            styles.mapContainer,
            {
              transform: [
                { translateX: offsetX },
                { translateY: offsetY },
                { scale },
              ],
            },
          ]}
          onLayout={(e) => {
            const { width, height } = e.nativeEvent.layout;
            setMapSize({ width, height });
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Map Image */}
          <Image
            source={require('../../assets/images/simplifiedMap.png')}
            style={styles.map}
            resizeMode="cover"
          />
          
          {/* Path Lines */}
          {mapSize.width > 0 && (
            <Animated.View style={{ opacity: pathOpacity }}>
              <Svg
                style={StyleSheet.absoluteFill}
                width={mapSize.width}
                height={mapSize.height}
              >
                {findShortestPath(start, destination).map((edge, index) => (
                  <Path
                    key={index}
                    d={getPathData(edge.from, edge.to)}
                    stroke="#2563EB"
                    strokeWidth="3"
                    strokeDasharray="5,5"
                    fill="none"
                  />
                ))}
              </Svg>
            </Animated.View>
          )}
          
          {/* Start marker (green circle) */}
          {startCoords && mapSize.width > 0 && (
            <View
              style={[
                styles.markerContainer,
                getMarkerPosition(startCoords),
              ]}
            >
              <View style={styles.greenCircle} />
            </View>
          )}

          {/* End marker (red X) */}
          {endCoords && mapSize.width > 0 && (
            <View
              style={[
                styles.markerContainer,
                getMarkerPosition(endCoords),
              ]}
            >
              <View style={styles.redXContainer}>
                <View style={[styles.redXLine, { transform: [{ rotate: '45deg' }] }]} />
                <View style={[styles.redXLine, { transform: [{ rotate: '-45deg' }] }]} />
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Map Legend</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F76B6B' }]} />
          <Text style={styles.legendText}>Hub A</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#387EF2' }]} />
          <Text style={styles.legendText}>Hub B</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#FAEC52' }]} />
          <Text style={styles.legendText}>Hub C</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapWrapper: {
    width: '90%',
    aspectRatio: 1,
    borderWidth: 2,
    borderColor: '#000000',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#F5F5F5',
  },
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  markerContainer: {
    position: 'absolute',
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  greenCircle: {
    width: 20,
    height: 20,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  redXContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  redXLine: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: '#F44336',
    borderRadius: 1,
  },
  legendContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    width: '90%',
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1F2937',
    fontFamily: 'Poppins-Bold',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  legendText: {
    fontSize: 14,
    color: '#4B5563',
    fontFamily: 'Poppins-Bold',
  },
  markerLegendContainer: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    width: '90%',
  },
  legendMarkerContainer: {
    width: 20,
    height: 20,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dottedLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 30,
    justifyContent: 'space-between',
  },
  dottedLineSegment: {
    width: 4,
    height: 2,
    backgroundColor: '#2563EB',
    borderRadius: 1,
  },
});

export default MapScreen; 