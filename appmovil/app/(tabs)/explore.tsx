import { Image } from 'expo-image';
import { StyleSheet, View, Dimensions, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Header con gradiente */}
      <LinearGradient
        colors={["#001C59", "rgba(0, 28, 89, 0.95)"]}
        style={styles.header}
      >
        <SafeAreaView edges={['top']} style={styles.safeHeader}>
          <View style={styles.headerContent}>
            <View style={styles.headerTitleContainer}>
              <Ionicons name="map-outline" size={28} color="#00E4FA" />
              <View>
                <Text style={styles.headerTitle}>Mapa de Rutas</Text>
                <Text style={styles.headerSubtitle}>Puntos de control</Text>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Contenedor del mapa */}
      <View style={styles.mapContainer}>
        <Image
          source={require('@/assets/images/mapa.png')}
          style={styles.mapImage}
          contentFit="contain"
          transition={300}
        />
      </View>

      {/* Footer con leyenda */}
      <LinearGradient
        colors={["rgba(0, 28, 89, 0.95)", "#001C59"]}
        style={styles.footer}
      >
        <View style={styles.footerContent}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#00E4FA' }]} />
            <Text style={styles.legendText}>Puntos completados</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF6B6B' }]} />
            <Text style={styles.legendText}>Puntos pendientes</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#001C59',
  },
  header: {
    paddingTop: 20,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 228, 250, 0.2)',
  },
  safeHeader: {
    width: '100%',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
  },
  mapContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(0, 228, 250, 0.3)',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 228, 250, 0.2)',
  },
  footerContent: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});