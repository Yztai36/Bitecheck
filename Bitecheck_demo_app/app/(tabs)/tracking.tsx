import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import { TrendingUp, TrendingDown, Calendar, Camera, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock, Plus, ArrowRight, Stethoscope, Activity, Target } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

interface ProgressPhoto {
  id: string;
  date: string;
  time: string;
  imageUrl: string;
  severity: number; // 1-10 scale
  symptoms: string[];
  notes?: string;
  aiAnalysis: {
    healing: 'improving' | 'stable' | 'worsening';
    confidence: number;
    recommendations: string[];
    urgency: 'low' | 'medium' | 'high' | 'emergency';
  };
}

interface TrackingCase {
  id: string;
  title: string;
  startDate: string;
  insectType: string;
  initialSeverity: number;
  currentSeverity: number;
  photos: ProgressPhoto[];
  status: 'active' | 'healed' | 'needs_attention';
  lastUpdate: string;
}

const mockTrackingData: TrackingCase[] = [
  {
    id: '1',
    title: 'Sivrisinek Isırığı - Sol Kol',
    startDate: '2024-01-10',
    insectType: 'Sivrisinek',
    initialSeverity: 6,
    currentSeverity: 3,
    lastUpdate: '2024-01-15',
    status: 'active',
    photos: [
      {
        id: '1a',
        date: '2024-01-10',
        time: '14:30',
        imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        severity: 6,
        symptoms: ['Kızarıklık', 'Şişlik', 'Kaşıntı'],
        aiAnalysis: {
          healing: 'stable',
          confidence: 85,
          recommendations: ['Soğuk kompres', 'Antihistaminik krem'],
          urgency: 'medium'
        }
      },
      {
        id: '1b',
        date: '2024-01-12',
        time: '16:15',
        imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        severity: 4,
        symptoms: ['Hafif kızarıklık', 'Kaşıntı'],
        aiAnalysis: {
          healing: 'improving',
          confidence: 92,
          recommendations: ['Tedaviye devam', 'Nemlendiricili krem'],
          urgency: 'low'
        }
      },
      {
        id: '1c',
        date: '2024-01-15',
        time: '09:45',
        imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        severity: 3,
        symptoms: ['Çok hafif kızarıklık'],
        aiAnalysis: {
          healing: 'improving',
          confidence: 88,
          recommendations: ['İyileşme devam ediyor', 'Güneşten koruyun'],
          urgency: 'low'
        }
      }
    ]
  },
  {
    id: '2',
    title: 'Arı Sokması - Sağ El',
    startDate: '2024-01-08',
    insectType: 'Arı',
    initialSeverity: 8,
    currentSeverity: 9,
    lastUpdate: '2024-01-14',
    status: 'needs_attention',
    photos: [
      {
        id: '2a',
        date: '2024-01-08',
        time: '11:20',
        imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        severity: 8,
        symptoms: ['Şiddetli şişlik', 'Ağrı', 'Kızarıklık'],
        aiAnalysis: {
          healing: 'stable',
          confidence: 90,
          recommendations: ['Soğuk uygulama', 'Ağrı kesici'],
          urgency: 'high'
        }
      },
      {
        id: '2b',
        date: '2024-01-14',
        time: '13:30',
        imageUrl: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=400',
        severity: 9,
        symptoms: ['Artan şişlik', 'Ateş', 'Yaygın kızarıklık'],
        aiAnalysis: {
          healing: 'worsening',
          confidence: 95,
          recommendations: ['ACİL DOKTOR MÜDAHALESİ GEREKLİ'],
          urgency: 'emergency'
        }
      }
    ]
  }
];

export default function ProgressTracking() {
  const [selectedCase, setSelectedCase] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return '#2563EB';
      case 'healed': return '#16A34A';
      case 'needs_attention': return '#DC2626';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Takip Ediliyor';
      case 'healed': return 'İyileşti';
      case 'needs_attention': return 'Dikkat Gerekli';
      default: return 'Bilinmiyor';
    }
  };

  const getHealingIcon = (healing: string) => {
    switch (healing) {
      case 'improving': return <TrendingUp size={16} color="#16A34A" />;
      case 'worsening': return <TrendingDown size={16} color="#DC2626" />;
      default: return <Activity size={16} color="#F59E0B" />;
    }
  };

  const getHealingText = (healing: string) => {
    switch (healing) {
      case 'improving': return 'İyileşiyor';
      case 'worsening': return 'Kötüleşiyor';
      default: return 'Stabil';
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return '#DC2626';
      case 'high': return '#F59E0B';
      case 'medium': return '#2563EB';
      default: return '#16A34A';
    }
  };

  const showEmergencyAlert = (caseItem: TrackingCase) => {
    const latestPhoto = caseItem.photos[caseItem.photos.length - 1];
    if (latestPhoto.aiAnalysis.urgency === 'emergency') {
      Alert.alert(
        '🚨 ACİL DURUM',
        'Böcek ısırığınızda ciddi kötüleşme tespit edildi. Derhal bir sağlık kuruluşuna başvurun!',
        [
          { text: 'Acil Servis Ara', style: 'destructive' },
          { text: 'Anladım', style: 'default' }
        ]
      );
    }
  };

  const addNewPhoto = () => {
    Alert.alert('Yeni Fotoğraf', 'Kamera açılacak ve yeni takip fotoğrafı çekilecek.');
  };

  const renderProgressChart = (caseItem: TrackingCase) => {
    const maxSeverity = Math.max(...caseItem.photos.map(p => p.severity));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>İyileşme Grafiği</Text>
        <View style={styles.chart}>
          {caseItem.photos.map((photo, index) => (
            <View key={photo.id} style={styles.chartPoint}>
              <View 
                style={[
                  styles.chartBar,
                  { 
                    height: (photo.severity / maxSeverity) * 60,
                    backgroundColor: photo.severity > 6 ? '#DC2626' : photo.severity > 3 ? '#F59E0B' : '#16A34A'
                  }
                ]} 
              />
              <Text style={styles.chartDate}>
                {new Date(photo.date).getDate()}/{new Date(photo.date).getMonth() + 1}
              </Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderPhotoTimeline = (photos: ProgressPhoto[]) => (
    <View style={styles.timelineContainer}>
      <Text style={styles.timelineTitle}>Fotoğraf Zaman Çizelgesi</Text>
      {photos.map((photo, index) => (
        <View key={photo.id} style={styles.timelineItem}>
          <View style={styles.timelineImageContainer}>
            <Image source={{ uri: photo.imageUrl }} style={styles.timelineImage} />
            <View style={styles.timelineDate}>
              <Calendar size={12} color="#FFFFFF" />
              <Text style={styles.timelineDateText}>
                {new Date(photo.date).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>
          
          <View style={styles.timelineContent}>
            <View style={styles.timelineHeader}>
              <View style={styles.healingIndicator}>
                {getHealingIcon(photo.aiAnalysis.healing)}
                <Text style={[styles.healingText, { color: photo.aiAnalysis.healing === 'improving' ? '#16A34A' : photo.aiAnalysis.healing === 'worsening' ? '#DC2626' : '#F59E0B' }]}>
                  {getHealingText(photo.aiAnalysis.healing)}
                </Text>
              </View>
              <Text style={styles.severityScore}>Şiddet: {photo.severity}/10</Text>
            </View>
            
            <View style={styles.symptomsContainer}>
              {photo.symptoms.map((symptom, idx) => (
                <View key={idx} style={styles.symptomTag}>
                  <Text style={styles.symptomText}>{symptom}</Text>
                </View>
              ))}
            </View>
            
            {photo.aiAnalysis.urgency === 'emergency' && (
              <View style={styles.emergencyAlert}>
                <AlertTriangle size={16} color="#DC2626" />
                <Text style={styles.emergencyText}>ACİL DOKTOR MÜDAHALESİ GEREKLİ</Text>
              </View>
            )}
            
            <View style={styles.recommendationsContainer}>
              <Text style={styles.recommendationsTitle}>AI Önerileri:</Text>
              {photo.aiAnalysis.recommendations.map((rec, idx) => (
                <Text key={idx} style={styles.recommendation}>• {rec}</Text>
              ))}
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTrackingCase = ({ item }: { item: TrackingCase }) => {
    const isExpanded = selectedCase === item.id;
    const latestPhoto = item.photos[item.photos.length - 1];
    
    return (
      <View style={styles.caseCard}>
        <TouchableOpacity
          style={styles.caseHeader}
          onPress={() => {
            setSelectedCase(isExpanded ? null : item.id);
            if (item.status === 'needs_attention') {
              showEmergencyAlert(item);
            }
          }}
        >
          <View style={styles.caseInfo}>
            <Text style={styles.caseTitle}>{item.title}</Text>
            <View style={styles.caseMetadata}>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.caseDate}>
                Başlangıç: {new Date(item.startDate).toLocaleDateString('tr-TR')}
              </Text>
            </View>
            <View style={styles.caseMetadata}>
              <Target size={14} color="#6B7280" />
              <Text style={styles.caseDate}>
                Son güncelleme: {new Date(item.lastUpdate).toLocaleDateString('tr-TR')}
              </Text>
            </View>
          </View>
          
          <View style={styles.caseStatus}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
              <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
            </View>
            <View style={styles.severityChange}>
              {item.currentSeverity < item.initialSeverity ? (
                <TrendingUp size={16} color="#16A34A" />
              ) : item.currentSeverity > item.initialSeverity ? (
                <TrendingDown size={16} color="#DC2626" />
              ) : (
                <Activity size={16} color="#F59E0B" />
              )}
              <Text style={styles.severityText}>
                {item.initialSeverity} → {item.currentSeverity}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={styles.expandedContent}>
            {renderProgressChart(item)}
            {renderPhotoTimeline(item.photos)}
            
            <TouchableOpacity style={styles.addPhotoButton} onPress={addNewPhoto}>
              <Plus size={20} color="#FFFFFF" />
              <Text style={styles.addPhotoText}>Yeni Fotoğraf Ekle</Text>
            </TouchableOpacity>
            
            {latestPhoto.aiAnalysis.urgency === 'emergency' && (
              <TouchableOpacity style={styles.doctorButton}>
                <Stethoscope size={20} color="#FFFFFF" />
                <Text style={styles.doctorButtonText}>Doktor Önerisi Al</Text>
                <ArrowRight size={16} color="#FFFFFF" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    );
  };

  const getOverallStats = () => {
    const total = mockTrackingData.length;
    const improving = mockTrackingData.filter(c => {
      const latest = c.photos[c.photos.length - 1];
      return latest.aiAnalysis.healing === 'improving';
    }).length;
    const needsAttention = mockTrackingData.filter(c => c.status === 'needs_attention').length;
    
    return { total, improving, needsAttention };
  };

  const stats = getOverallStats();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EFF6FF', '#FFFFFF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>İyileşme Takibi</Text>
        <Text style={styles.headerSubtitle}>
          Böcek ısırıklarınızın iyileşme sürecini takip edin
        </Text>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <Text style={styles.statsTitle}>Genel Durum</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Aktif Takip</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]}>
              <Text style={[styles.statNumber, { color: '#16A34A' }]}>{stats.improving}</Text>
              <Text style={styles.statLabel}>İyileşiyor</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]}>
              <Text style={[styles.statNumber, { color: '#DC2626' }]}>{stats.needsAttention}</Text>
              <Text style={styles.statLabel}>Dikkat</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.casesContainer}>
        <FlatList
          data={mockTrackingData}
          renderItem={renderTrackingCase}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.casesList}
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
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    borderLeftWidth: 1,
    borderLeftColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  casesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  casesList: {
    paddingBottom: 20,
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  caseInfo: {
    flex: 1,
    marginRight: 12,
  },
  caseTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  caseMetadata: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  caseDate: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  caseStatus: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  severityChange: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  severityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  expandedContent: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    padding: 16,
    gap: 20,
  },
  chartContainer: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 80,
  },
  chartPoint: {
    alignItems: 'center',
    gap: 8,
  },
  chartBar: {
    width: 20,
    borderRadius: 4,
  },
  chartDate: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  timelineContainer: {
    gap: 16,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  timelineItem: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
  },
  timelineImageContainer: {
    position: 'relative',
  },
  timelineImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  timelineDate: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    right: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 4,
    padding: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  timelineDateText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  timelineContent: {
    flex: 1,
    gap: 8,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  healingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  healingText: {
    fontSize: 14,
    fontWeight: '600',
  },
  severityScore: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  symptomsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  symptomTag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  symptomText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  emergencyAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 8,
    borderRadius: 6,
  },
  emergencyText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
  recommendationsContainer: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
  },
  recommendationsTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  recommendation: {
    fontSize: 12,
    color: '#374151',
    lineHeight: 16,
  },
  addPhotoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 8,
  },
  addPhotoText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  doctorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
  },
  doctorButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});