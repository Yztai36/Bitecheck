import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { MapPin, TriangleAlert as AlertTriangle, Bug, TrendingUp, Thermometer, Droplets, Wind, Eye, RefreshCw } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';

interface InsectData {
  id: string;
  name: string;
  risk: 'Düşük' | 'Orta' | 'Yüksek';
  prevalence: number;
  season: string;
  symptoms: string[];
  description: string;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  windSpeed: number;
  condition: string;
}

const mockInsectData: InsectData[] = [
  {
    id: '1',
    name: 'Sivrisinek',
    risk: 'Orta',
    prevalence: 85,
    season: 'Yaz-Sonbahar',
    symptoms: ['Kaşıntı', 'Kızarıklık', 'Şişlik'],
    description: 'Su birikintilerinin yakınında yaygın'
  },
  {
    id: '2',
    name: 'Kene',
    risk: 'Yüksek',
    prevalence: 45,
    season: 'İlkbahar-Yaz',
    symptoms: ['Ateş', 'Baş ağrısı', 'Kas ağrısı'],
    description: 'Ormanlık ve çalılık alanlarda aktif'
  },
  {
    id: '3',
    name: 'Arı',
    risk: 'Orta',
    prevalence: 65,
    season: 'İlkbahar-Yaz',
    symptoms: ['Ağrı', 'Şişlik', 'Alerjik reaksiyon'],
    description: 'Çiçekli alanların yakınında bulunur'
  },
  {
    id: '4',
    name: 'Eşek Arısı',
    risk: 'Yüksek',
    prevalence: 30,
    season: 'Yaz',
    symptoms: ['Şiddetli ağrı', 'Büyük şişlik', 'Alerjik şok'],
    description: 'Toprak içinde yaşar, rahatsız edildiğinde saldırgan'
  },
];

const mockWeatherData: WeatherData = {
  temperature: 24,
  humidity: 68,
  windSpeed: 12,
  condition: 'Parçalı bulutlu'
};

export default function LocationInsights() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [address, setAddress] = useState<string>('Konum alınıyor...');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLocation();
  }, []);

  const getLocation = async () => {
    try {
      setIsLoading(true);
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status !== 'granted') {
        setAddress('Konum izni verilmedi');
        setIsLoading(false);
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const geocode = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (geocode.length > 0) {
        const { city, district, country } = geocode[0];
        setAddress(`${district}, ${city}, ${country}`);
      }
    } catch (error) {
      Alert.alert('Hata', 'Konum alınırken bir hata oluştu');
      setAddress('Konum alınamadı');
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'Düşük': return '#16A34A';
      case 'Orta': return '#F59E0B';
      case 'Yüksek': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'Yüksek': return <AlertTriangle size={16} color="#DC2626" />;
      default: return <Bug size={16} color={getRiskColor(risk)} />;
    }
  };

  const getPrevalenceColor = (prevalence: number) => {
    if (prevalence >= 70) return '#DC2626';
    if (prevalence >= 40) return '#F59E0B';
    return '#16A34A';
  };

  const renderInsectCard = ({ item }: { item: InsectData }) => (
    <View style={styles.insectCard}>
      <View style={styles.insectHeader}>
        <View style={styles.insectInfo}>
          <Text style={styles.insectName}>{item.name}</Text>
          <Text style={styles.insectDescription}>{item.description}</Text>
        </View>
        <View style={styles.riskBadge}>
          {getRiskIcon(item.risk)}
          <Text style={[styles.riskText, { color: getRiskColor(item.risk) }]}>
            {item.risk}
          </Text>
        </View>
      </View>

      <View style={styles.prevalenceContainer}>
        <View style={styles.prevalenceHeader}>
          <TrendingUp size={16} color="#6B7280" />
          <Text style={styles.prevalenceLabel}>Yaygınlık Oranı</Text>
        </View>
        <View style={styles.prevalenceBar}>
          <View 
            style={[
              styles.prevalenceFill,
              { 
                width: `${item.prevalence}%`,
                backgroundColor: getPrevalenceColor(item.prevalence)
              }
            ]} 
          />
        </View>
        <Text style={[styles.prevalenceValue, { color: getPrevalenceColor(item.prevalence) }]}>
          %{item.prevalence}
        </Text>
      </View>

      <View style={styles.seasonContainer}>
        <Text style={styles.seasonLabel}>Aktif Sezon: </Text>
        <Text style={styles.seasonValue}>{item.season}</Text>
      </View>

      <View style={styles.symptomsContainer}>
        <Text style={styles.symptomsLabel}>Belirtiler:</Text>
        <View style={styles.symptomsGrid}>
          {item.symptoms.map((symptom, index) => (
            <View key={index} style={styles.symptomTag}>
              <Text style={styles.symptomText}>{symptom}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EFF6FF', '#FFFFFF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Konum Analizi</Text>
        <Text style={styles.headerSubtitle}>
          Bulunduğunuz bölgedeki böcek aktivitesi
        </Text>
      </LinearGradient>

      <View style={styles.locationContainer}>
        <View style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <View style={styles.locationInfo}>
              <MapPin size={20} color="#2563EB" />
              <Text style={styles.locationText}>{address}</Text>
            </View>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={getLocation}
              disabled={isLoading}
            >
              <RefreshCw 
                size={16} 
                color="#6B7280" 
                style={{ opacity: isLoading ? 0.5 : 1 }} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.weatherContainer}>
        <View style={styles.weatherCard}>
          <Text style={styles.weatherTitle}>Hava Durumu</Text>
          <View style={styles.weatherGrid}>
            <View style={styles.weatherItem}>
              <Thermometer size={16} color="#F59E0B" />
              <Text style={styles.weatherValue}>{mockWeatherData.temperature}°C</Text>
            </View>
            <View style={styles.weatherItem}>
              <Droplets size={16} color="#3B82F6" />
              <Text style={styles.weatherValue}>%{mockWeatherData.humidity}</Text>
            </View>
            <View style={styles.weatherItem}>
              <Wind size={16} color="#6B7280" />
              <Text style={styles.weatherValue}>{mockWeatherData.windSpeed} km/h</Text>
            </View>
            <View style={styles.weatherItem}>
              <Eye size={16} color="#8B5CF6" />
              <Text style={styles.weatherValueSmall}>{mockWeatherData.condition}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.insectsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Bölgesel Böcek Aktivitesi</Text>
          <Text style={styles.sectionSubtitle}>Dikkat edilmesi gereken türler</Text>
        </View>
        
        <FlatList
          data={mockInsectData}
          renderItem={renderInsectCard}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.insectsList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  locationContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  locationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  locationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  weatherContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  weatherTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  weatherGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherItem: {
    alignItems: 'center',
    gap: 4,
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  weatherValueSmall: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1F2937',
    textAlign: 'center',
  },
  insectsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  insectsList: {
    paddingBottom: 20,
  },
  insectCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  insectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  insectInfo: {
    flex: 1,
    marginRight: 12,
  },
  insectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  insectDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  riskBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  riskText: {
    fontSize: 12,
    fontWeight: '600',
  },
  prevalenceContainer: {
    marginBottom: 16,
  },
  prevalenceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  prevalenceLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  prevalenceBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    marginBottom: 4,
  },
  prevalenceFill: {
    height: '100%',
    borderRadius: 4,
  },
  prevalenceValue: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
  seasonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F3F4F6',
    padding: 10,
    borderRadius: 8,
  },
  seasonLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  seasonValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  symptomsContainer: {
    gap: 8,
  },
  symptomsLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomTag: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  symptomText: {
    fontSize: 12,
    color: '#92400E',
    fontWeight: '500',
  },
});