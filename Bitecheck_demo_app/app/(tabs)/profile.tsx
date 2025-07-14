import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  Alert,
} from 'react-native';
import { User, Bell, Shield, CircleHelp as HelpCircle, Settings, ChevronRight, MapPin, Smartphone, Heart, TriangleAlert as AlertTriangle, Star, Share2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface SettingItem {
  id: string;
  title: string;
  subtitle?: string;
  icon: React.ReactNode;
  type: 'navigation' | 'toggle' | 'info';
  value?: boolean;
  onPress?: () => void;
  onToggle?: (value: boolean) => void;
}

export default function Profile() {
  const [notifications, setNotifications] = useState(true);
  const [locationServices, setLocationServices] = useState(true);
  const [emergencyAlerts, setEmergencyAlerts] = useState(true);

  const handleNotificationToggle = (value: boolean) => {
    setNotifications(value);
    // Implement notification settings logic
  };

  const handleLocationToggle = (value: boolean) => {
    setLocationServices(value);
    // Implement location services logic
  };

  const handleEmergencyToggle = (value: boolean) => {
    setEmergencyAlerts(value);
    // Implement emergency alerts logic
  };

  const showComingSoon = () => {
    Alert.alert('Yakında', 'Bu özellik yakında kullanıma sunulacak!');
  };

  const settingsItems: SettingItem[] = [
    {
      id: '1',
      title: 'Bildirimler',
      subtitle: 'Analiz sonuçları ve uyarılar',
      icon: <Bell size={20} color="#2563EB" />,
      type: 'toggle',
      value: notifications,
      onToggle: handleNotificationToggle,
    },
    {
      id: '2',
      title: 'Konum Servisleri',
      subtitle: 'Bölgesel böcek analizi için',
      icon: <MapPin size={20} color="#2563EB" />,
      type: 'toggle',
      value: locationServices,
      onToggle: handleLocationToggle,
    },
    {
      id: '3',
      title: 'Acil Durumu Uyarılar',
      subtitle: 'Yüksek riskli durumlar için',
      icon: <AlertTriangle size={20} color="#DC2626" />,
      type: 'toggle',
      value: emergencyAlerts,
      onToggle: handleEmergencyToggle,
    },
    {
      id: '4',
      title: 'Veri ve Gizlilik',
      subtitle: 'Kişisel veri yönetimi',
      icon: <Shield size={20} color="#6B7280" />,
      type: 'navigation',
      onPress: showComingSoon,
    },
    {
      id: '5',
      title: 'Yardım ve Destek',
      subtitle: 'SSS ve iletişim',
      icon: <HelpCircle size={20} color="#6B7280" />,
      type: 'navigation',
      onPress: showComingSoon,
    },
    {
      id: '6',
      title: 'Uygulamayı Değerlendirin',
      subtitle: 'App Store\'da puan verin',
      icon: <Star size={20} color="#F59E0B" />,
      type: 'navigation',
      onPress: showComingSoon,
    },
    {
      id: '7',
      title: 'Uygulamayı Paylaşın',
      subtitle: 'Arkadaşlarınızla paylaşın',
      icon: <Share2 size={20} color="#16A34A" />,
      type: 'navigation',
      onPress: showComingSoon,
    },
  ];

  const renderSettingItem = (item: SettingItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.settingItem}
      onPress={item.onPress}
      disabled={item.type === 'toggle'}
    >
      <View style={styles.settingIcon}>
        {item.icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{item.title}</Text>
        {item.subtitle && (
          <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
        )}
      </View>
      <View style={styles.settingAction}>
        {item.type === 'toggle' ? (
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: '#E5E7EB', true: '#DBEAFE' }}
            thumbColor={item.value ? '#2563EB' : '#9CA3AF'}
          />
        ) : (
          <ChevronRight size={20} color="#9CA3AF" />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EFF6FF', '#FFFFFF']}
        style={styles.header}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <User size={40} color="#2563EB" strokeWidth={1.5} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Kullanıcı</Text>
            <Text style={styles.profileEmail}>Premium Üye</Text>
          </View>
        </View>
      </LinearGradient>

      <View style={styles.statsContainer}>
        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>23</Text>
            <Text style={styles.statLabel}>Analiz</Text>
          </View>
          <View style={[styles.statItem, styles.statDivider]}>
            <Text style={[styles.statNumber, { color: '#16A34A' }]}>18</Text>
            <Text style={styles.statLabel}>Güvenli</Text>
          </View>
          <View style={[styles.statItem, styles.statDivider]}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>4</Text>
            <Text style={styles.statLabel}>Dikkat</Text>
          </View>
          <View style={[styles.statItem, styles.statDivider]}>
            <Text style={[styles.statNumber, { color: '#DC2626' }]}>1</Text>
            <Text style={styles.statLabel}>Acil</Text>
          </View>
        </View>
      </View>

      <View style={styles.settingsContainer}>
        <Text style={styles.sectionTitle}>Ayarlar</Text>
        <View style={styles.settingsList}>
          {settingsItems.map(renderSettingItem)}
        </View>
      </View>

      <View style={styles.healthTipContainer}>
        <View style={styles.healthTipCard}>
          <View style={styles.healthTipIcon}>
            <Heart size={24} color="#DC2626" />
          </View>
          <View style={styles.healthTipContent}>
            <Text style={styles.healthTipTitle}>Sağlık İpucu</Text>
            <Text style={styles.healthTipText}>
              Böcek ısırıklarından korunmak için açık alanlarda uzun kollu kıyafetler tercih edin.
            </Text>
          </View>
        </View>
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
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '500',
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  settingsContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
  },
  settingsList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  settingAction: {
    marginLeft: 12,
  },
  healthTipContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  healthTipCard: {
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  healthTipIcon: {
    marginTop: 2,
  },
  healthTipContent: {
    flex: 1,
  },
  healthTipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 4,
  },
  healthTipText: {
    fontSize: 14,
    color: '#7F1D1D',
    lineHeight: 20,
  },
});