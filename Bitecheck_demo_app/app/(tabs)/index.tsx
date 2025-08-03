import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Animated,
  Dimensions,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Camera, FlipHorizontal, Circle, CircleCheck as CheckCircle, TriangleAlert as AlertTriangle, Zap, Info, Bug, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

type AnalysisState = 'idle' | 'analyzing' | 'complete';

export default function CameraAnalysis() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [analysisState, setAnalysisState] = useState<AnalysisState>('idle');
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const analyzeAnimation = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<CameraView>(null);

  if (!permission) {
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <View style={styles.permissionCard}>
          <View style={styles.permissionIconContainer}>
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              style={styles.permissionIconGradient}
            >
              <Bug size={48} color="#FFFFFF" strokeWidth={1.5} />
            </LinearGradient>
            <View style={styles.permissionCameraIcon}>
              <Camera size={24} color="#FFFFFF" strokeWidth={2} />
            </View>
          </View>
          <Text style={styles.permissionTitle}>BITECHECK</Text>
          <Text style={styles.permissionSubtitle}>Kamera İzni Gerekli</Text>
          <Text style={styles.permissionText}>
            Böcek ısırığı analizi yapabilmek için kameraya erişim izni vermeniz gerekiyor.
          </Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <LinearGradient
              colors={['#7C3AED', '#A855F7']}
              style={styles.permissionButtonGradient}
            >
              <Text style={styles.permissionButtonText}>İzin Ver</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  const startAnalysis = async () => {
    if (analysisState === 'analyzing') return;
    
    setAnalysisState('analyzing');
    
    // Animate the analysis indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(analyzeAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(analyzeAnimation, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Simulate analysis process
    setTimeout(() => {
      setAnalysisState('complete');
      analyzeAnimation.stopAnimation();
      setAnalysisResult({
        insect: 'Sivrisinek',
        severity: 'Düşük',
        confidence: 92,
        symptoms: ['Kaşıntı', 'Kızarıklık', 'Hafif şişlik'],
        recommendations: [
          'Soğuk kompres uygulayın',
          'Kaşımaktan kaçının',
          'Antihistaminik krem kullanabilirsiniz'
        ],
        urgency: 'normal'
      });
    }, 3000);
  };

  const resetAnalysis = () => {
    setAnalysisState('idle');
    setAnalysisResult(null);
    analyzeAnimation.setValue(0);
  };

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
      case 'Düşük': return <CheckCircle size={20} color="#10B981" />;
      case 'Orta': return <AlertTriangle size={20} color="#F59E0B" />;
      case 'Yüksek': return <Zap size={20} color="#EF4444" />;
      default: return <Info size={20} color="#6B7280" />;
    }
  };

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
              <Bug size={24} color="#FFFFFF" strokeWidth={2} />
            </LinearGradient>
            <Text style={styles.brandName}>BITECHECK</Text>
            <Sparkles size={16} color="#EC4899" />
          </View>
          <Text style={styles.headerTitle}>Böcek Isırığı Analizi</Text>
          <Text style={styles.headerSubtitle}>
            Isırığı kameraya tutun ve analiz etmek için fotoğraf çekin
          </Text>
        </View>
      </LinearGradient>

      <View style={styles.cameraContainer}>
        <CameraView 
          style={styles.camera} 
          facing={facing}
          ref={cameraRef}
        >
          <View style={styles.cameraOverlay}>
            {/* Viewfinder */}
            <View style={styles.viewfinder}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
              
              {analysisState === 'analyzing' && (
                <Animated.View 
                  style={[
                    styles.analyzeOverlay,
                    {
                      opacity: analyzeAnimation,
                    }
                  ]}
                >
                  <LinearGradient
                    colors={['#7C3AED', '#A855F7']}
                    style={styles.analyzeGradient}
                  >
                    <Bug size={24} color="#FFFFFF" />
                    <Text style={styles.analyzingText}>BITECHECK Analiz Ediyor...</Text>
                    <Sparkles size={16} color="#EC4899" />
                  </LinearGradient>
                </Animated.View>
              )}
            </View>

            {/* Controls */}
            <View style={styles.controls}>
              <TouchableOpacity style={styles.flipButton} onPress={toggleCameraFacing}>
                <FlipHorizontal size={24} color="#FFFFFF" strokeWidth={2} />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[
                  styles.captureButton,
                  analysisState === 'analyzing' && styles.captureButtonDisabled
                ]}
                onPress={startAnalysis}
                disabled={analysisState === 'analyzing'}
              >
                <LinearGradient
                  colors={analysisState === 'analyzing' ? ['#9CA3AF', '#6B7280'] : ['#7C3AED', '#A855F7']}
                  style={styles.captureButtonGradient}
                >
                  <View style={styles.captureButtonInner}>
                    {analysisState === 'analyzing' ? (
                      <Animated.View style={{ transform: [{ rotate: analyzeAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '360deg']
                      })}] }}>
                        <Circle size={32} color="#FFFFFF" strokeWidth={2} />
                      </Animated.View>
                    ) : (
                      <Camera size={32} color="#FFFFFF" strokeWidth={2} />
                    )}
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.flipButton} />
            </View>
          </View>
        </CameraView>
      </View>

      {/* Analysis Results */}
      {analysisResult && (
        <View style={styles.resultsContainer}>
          <View style={styles.resultCard}>
            <LinearGradient
              colors={['#F3E8FF', '#FFFFFF']}
              style={styles.resultCardGradient}
            >
              <View style={styles.resultHeader}>
                <View style={styles.resultBrand}>
                  <Bug size={16} color="#7C3AED" />
                  <Text style={styles.resultTitle}>BITECHECK Analiz Sonucu</Text>
                  <Sparkles size={14} color="#EC4899" />
                </View>
                <TouchableOpacity onPress={resetAnalysis}>
                  <Text style={styles.newAnalysisButton}>Yeni Analiz</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.resultContent}>
                <View style={styles.insectInfo}>
                  <Text style={styles.insectName}>{analysisResult.insect}</Text>
                  <View style={styles.severityContainer}>
                    {getSeverityIcon(analysisResult.severity)}
                    <Text style={[styles.severityText, { color: getSeverityColor(analysisResult.severity) }]}>
                      {analysisResult.severity} Risk
                    </Text>
                  </View>
                </View>
                
                <View style={styles.confidenceContainer}>
                  <LinearGradient
                    colors={['#F3E8FF', '#E0E7FF']}
                    style={styles.confidenceGradient}
                  >
                    <Text style={styles.confidenceText}>
                      AI Güven Oranı: %{analysisResult.confidence}
                    </Text>
                  </LinearGradient>
                </View>
                
                <View style={styles.recommendationsContainer}>
                  <LinearGradient
                    colors={['#FDF2F8', '#FCE7F3']}
                    style={styles.recommendationsGradient}
                  >
                    <Text style={styles.recommendationsTitle}>BITECHECK Önerileri:</Text>
                    {analysisResult.recommendations.map((rec: string, index: number) => (
                      <Text key={index} style={styles.recommendation}>
                        • {rec}
                      </Text>
                    ))}
                  </LinearGradient>
                </View>
              </View>
            </LinearGradient>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    padding: 20,
  },
  permissionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
    maxWidth: 320,
  },
  permissionIconContainer: {
    position: 'relative',
    marginBottom: 24,
  },
  permissionIconGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionCameraIcon: {
    position: 'absolute',
    bottom: -8,
    right: -8,
    backgroundColor: '#EC4899',
    borderRadius: 16,
    padding: 6,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  permissionTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 2,
    marginBottom: 8,
  },
  permissionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  permissionText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  permissionButton: {
    borderRadius: 16,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  permissionButtonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
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
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  brandName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#7C3AED',
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  cameraContainer: {
    flex: 1,
    margin: 20,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#000',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 20,
  },
  viewfinder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#EC4899',
    borderWidth: 3,
  },
  topLeft: {
    top: '30%',
    left: '20%',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: '30%',
    right: '20%',
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: '30%',
    left: '20%',
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: '30%',
    right: '20%',
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  analyzeOverlay: {
    position: 'absolute',
    borderRadius: 25,
  },
  analyzeGradient: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 25,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  analyzingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  flipButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  captureButtonDisabled: {
    shadowColor: '#9CA3AF',
  },
  captureButtonGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsContainer: {
    padding: 20,
  },
  resultCard: {
    borderRadius: 20,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  resultCardGradient: {
    borderRadius: 20,
    padding: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultBrand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  newAnalysisButton: {
    color: '#7C3AED',
    fontSize: 16,
    fontWeight: '600',
  },
  resultContent: {
    gap: 16,
  },
  insectInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insectName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  severityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  severityText: {
    fontSize: 16,
    fontWeight: '600',
  },
  confidenceContainer: {
    borderRadius: 12,
  },
  confidenceGradient: {
    padding: 12,
    borderRadius: 12,
  },
  confidenceText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  recommendationsContainer: {
    borderRadius: 16,
  },
  recommendationsGradient: {
    padding: 16,
    borderRadius: 16,
  },
  recommendationsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  recommendation: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 4,
  },
});