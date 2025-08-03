import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Clock, MapPin, ChevronRight, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Zap, Calendar, Bug, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface AnalysisRecord {
  id: string;
  date: string;
  time: string;
  insect: string;
  severity: 'Düşük' | 'Orta' | 'Yüksek';
  location: string;
  confidence: number;
  symptoms: string[];
}

const mockData: AnalysisRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    time: '14:30',
    insect: 'Sivrisinek',
    severity: 'Düşük',
    location: 'İstanbul, Beşiktaş',
    confidence: 92,
    symptoms: ['Kaşıntı', 'Kızarıklık'],
  },
  {
    id: '2',
    date: '2024-01-12',
    time: '09:15',
    insect: 'Arı',
    severity: 'Orta',
    location: 'İstanbul, Sarıyer',
    confidence: 87,
    symptoms: ['Şişlik', 'Ağrı', 'Kızarıklık'],
  },
  {
    id: '3',
    date: '2024-01-08',
    time: '18:45',
    insect: 'Kene',
    severity: 'Yüksek',
    location: 'Ankara, Çankaya',
    confidence: 95,
    symptoms: ['Ateş', 'Baş ağrısı', 'Kas ağrısı'],
  },
  {
    id: '4',
    date: '2024-01-05',
    time: '11:20',
    insect: 'Karasinek',
    severity: 'Düşük',
    location: 'İzmir, Konak',
    confidence: 78,
    symptoms: ['Hafif irritasyon'],
  },
];

export default function History() {
  const [selectedRecord, setSelectedRecord] = useState<string | null>(null);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Düşük': return '#10B981';
      case 'Orta': return '#F59E0B';
      case 'Yüksek': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Düşük': return <CheckCircle size={16} color="#10B981" />;
      case 'Orta': return <AlertTriangle size={16} color="#F59E0B" />;
      case 'Yüksek': return <Zap size={16} color="#EF4444" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const renderRecord = ({ item }: { item: AnalysisRecord }) => (
    <TouchableOpacity
      style={styles.recordCard}
      onPress={() => setSelectedRecord(selectedRecord === item.id ? null : item.id)}
    >
      <LinearGradient
        colors={['#FFFFFF', '#F8FAFC']}
        style={styles.recordGradient}
      >
        <View style={styles.recordHeader}>
          <View style={styles.recordInfo}>
            <Text style={styles.insectName}>{item.insect}</Text>
            <View style={styles.dateContainer}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.dateText}>{formatDate(item.date)}</Text>
              <Clock size={14} color="#6B7280" />
              <Text style={styles.timeText}>{item.time}</Text>
            </View>
          </View>
          <View style={styles.recordMeta}>
            <LinearGradient
              colors={[getSeverityColor(item.severity) + '20', getSeverityColor(item.severity) + '10']}
              style={styles.severityBadge}
            >
              {getSeverityIcon(item.severity)}
              <Text style={[styles.severityText, { color: getSeverityColor(item.severity) }]}>
                {item.severity}
              </Text>
            </LinearGradient>
            <ChevronRight 
              size={20} 
              color="#9CA3AF" 
              style={{ 
                transform: [{ rotate: selectedRecord === item.id ? '90deg' : '0deg' }] 
              }} 
            />
          </View>
        </View>

        {selectedRecord === item.id && (
          <View style={styles.recordDetails}>
            <View style={styles.detailRow}>
              <MapPin size={16} color="#6B7280" />
              <Text style={styles.locationText}>{item.location}</Text>
            </View>
            
            <LinearGradient
              colors={['#F3E8FF', '#E0E7FF']}
              style={styles.confidenceContainer}
            >
              <Text style={styles.confidenceLabel}>Güven Oranı:</Text>
              <Text style={styles.confidenceValue}>%{item.confidence}</Text>
            </LinearGradient>
            
            <View style={styles.symptomsContainer}>
              <Text style={styles.symptomsLabel}>Belirtiler:</Text>
              <View style={styles.symptomsGrid}>
                {item.symptoms.map((symptom, index) => (
                  <LinearGradient
                    key={index}
                    colors={['#FDF2F8', '#FCE7F3']}
                    style={styles.symptomTag}
                  >
                    <Text style={styles.symptomText}>{symptom}</Text>
                  </LinearGradient>
                ))}
              </View>
            </View>
          </View>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );

  const getWeeklyStats = () => {
    const thisWeek = mockData.filter(record => {
      const recordDate = new Date(record.date);
      const today = new Date();
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      return recordDate >= weekAgo;
    });

    return {
      total: thisWeek.length,
      high: thisWeek.filter(r => r.severity === 'Yüksek').length,
      medium: thisWeek.filter(r => r.severity === 'Orta').length,
      low: thisWeek.filter(r => r.severity === 'Düşük').length,
    };
  };

  const stats = getWeeklyStats();

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F3E8FF', '#E0E7FF', '#FFFFFF']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.headerContent}>
          <View style={styles.brandContainer}>
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              style={styles.logoMini}
            >
              <Bug size={20} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
            <Text style={styles.brandName}>BITECHECK</Text>
            <Sparkles size={14} color="#EC4899" />
          </View>
          <Text style={styles.headerTitle}>Analiz Geçmişi</Text>
          <Text style={styles.headerSubtitle}>
            Geçmiş böcek ısırığı analizlerinizi görüntüleyin
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <LinearGradient
          colors={['#FFFFFF', '#F8FAFC']}
          style={styles.statsCard}
        >
          <Text style={styles.statsTitle}>Bu Hafta</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Toplam</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]}>
              <Text style={[styles.statNumber, { color: '#EF4444' }]}>{stats.high}</Text>
              <Text style={styles.statLabel}>Yüksek</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.medium}</Text>
              <Text style={styles.statLabel}>Orta</Text>
            </View>
            <View style={[styles.statItem, styles.statDivider]}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.low}</Text>
              <Text style={styles.statLabel}>Düşük</Text>
            </View>
          </View>
        </LinearGradient>
      </View>

      <View style={styles.recordsContainer}>
        <FlatList
          data={mockData}
          renderItem={renderRecord}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.recordsList}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingTop: 40,
  },
  headerContent: {
    gap: 8,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoMini: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 18,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 1,
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
    borderRadius: 16,
    padding: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
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
  recordsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  recordsList: {
    paddingBottom: 20,
  },
  recordCard: {
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  recordGradient: {
    borderRadius: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  recordInfo: {
    flex: 1,
  },
  insectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  recordMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  severityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  severityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordDetails: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  confidenceValue: {
    fontSize: 16,
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
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  symptomText: {
    fontSize: 12,
    color: '#BE185D',
    fontWeight: '500',
  },
});