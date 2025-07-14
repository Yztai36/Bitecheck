import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Bug, Shield, Zap, ChartBar as BarChart3, MapPin, Bell, Sparkles, Heart } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleTranslateY = useRef(new Animated.Value(30)).current;
  const sloganOpacity = useRef(new Animated.Value(0)).current;
  const featuresOpacity = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;
  const backgroundOpacity = useRef(new Animated.Value(0)).current;
  const sparkleAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Sparkle animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(sparkleAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(sparkleAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    const animationSequence = Animated.sequence([
      // Background fade in
      Animated.timing(backgroundOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      
      // Logo animation
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(logoRotate, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
      
      // Title animation
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslateY, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
      
      // Slogan animation
      Animated.timing(sloganOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      
      // Features animation
      Animated.timing(featuresOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      
      // Progress bar animation
      Animated.timing(progressWidth, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: false,
      }),
    ]);

    animationSequence.start(() => {
      setTimeout(() => {
        onFinish?.();
      }, 500);
    });
  }, []);

  const logoRotateInterpolate = logoRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressWidthInterpolate = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const sparkleOpacity = sparkleAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  const sparkleScale = sparkleAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.8, 1.2, 0.8],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.backgroundContainer, { opacity: backgroundOpacity }]}>
        <LinearGradient
          colors={['#7C3AED', '#A855F7', '#EC4899', '#F472B6']}
          style={styles.gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
        
        {/* Background floating icons */}
        <View style={styles.backgroundIcons}>
          <Animated.View style={[styles.floatingIcon, styles.icon1, { opacity: sparkleOpacity }]}>
            <Bug size={24} color="rgba(255,255,255,0.2)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon2, { opacity: sparkleOpacity }]}>
            <Shield size={20} color="rgba(255,255,255,0.2)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon3, { opacity: sparkleOpacity }]}>
            <Zap size={18} color="rgba(255,255,255,0.2)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon4, { opacity: sparkleOpacity }]}>
            <BarChart3 size={22} color="rgba(255,255,255,0.2)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon5, { opacity: sparkleOpacity }]}>
            <MapPin size={16} color="rgba(255,255,255,0.2)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon6, { opacity: sparkleOpacity }]}>
            <Bell size={20} color="rgba(255,255,255,0.2)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon7, { opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>
            <Sparkles size={16} color="rgba(236, 72, 153, 0.8)" />
          </Animated.View>
          <Animated.View style={[styles.floatingIcon, styles.icon8, { opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>
            <Heart size={18} color="rgba(236, 72, 153, 0.8)" />
          </Animated.View>
        </View>
      </Animated.View>

      <View style={styles.content}>
        {/* Logo */}
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              transform: [
                { scale: logoScale },
                { rotate: logoRotateInterpolate }
              ]
            }
          ]}
        >
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.3)', 'rgba(255, 255, 255, 0.1)']}
            style={styles.logoBackground}
          >
            <Bug size={48} color="#FFFFFF" strokeWidth={2} />
          </LinearGradient>
          <LinearGradient
            colors={['#EC4899', '#F472B6']}
            style={styles.shieldOverlay}
          >
            <Shield size={32} color="#FFFFFF" strokeWidth={2.5} />
          </LinearGradient>
        </Animated.View>

        {/* Title */}
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleTranslateY }]
            }
          ]}
        >
          <Text style={styles.title}>BITECHECK</Text>
          <Animated.View style={[styles.sparkleContainer, { opacity: sparkleOpacity, transform: [{ scale: sparkleScale }] }]}>
            <Sparkles size={24} color="#EC4899" />
          </Animated.View>
        </Animated.View>

        {/* Slogan */}
        <Animated.View style={[styles.sloganContainer, { opacity: sloganOpacity }]}>
          <Text style={styles.slogan}>Böcek Isırığı Analiz Uzmanı</Text>
          <Text style={styles.subSlogan}>AI Destekli Sağlık Asistanı</Text>
        </Animated.View>

        {/* Features */}
        <Animated.View style={[styles.featuresContainer, { opacity: featuresOpacity }]}>
          <View style={styles.featureRow}>
            <View style={styles.feature}>
              <LinearGradient
                colors={['rgba(236, 72, 153, 0.3)', 'rgba(244, 114, 182, 0.3)']}
                style={styles.featureIcon}
              >
                <Zap size={16} color="#EC4899" />
              </LinearGradient>
              <Text style={styles.featureText}>Hızlı Analiz</Text>
            </View>
            <View style={styles.feature}>
              <LinearGradient
                colors={['rgba(236, 72, 153, 0.3)', 'rgba(244, 114, 182, 0.3)']}
                style={styles.featureIcon}
              >
                <BarChart3 size={16} color="#EC4899" />
              </LinearGradient>
              <Text style={styles.featureText}>Takip</Text>
            </View>
            <View style={styles.feature}>
              <LinearGradient
                colors={['rgba(236, 72, 153, 0.3)', 'rgba(244, 114, 182, 0.3)']}
                style={styles.featureIcon}
              >
                <Bell size={16} color="#EC4899" />
              </LinearGradient>
              <Text style={styles.featureText}>Uyarılar</Text>
            </View>
          </View>
        </Animated.View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View 
              style={[
                styles.progressFill,
                { width: progressWidthInterpolate }
              ]} 
            />
          </View>
          <Text style={styles.loadingText}>Yükleniyor...</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  backgroundContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradient: {
    flex: 1,
  },
  backgroundIcons: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingIcon: {
    position: 'absolute',
  },
  icon1: {
    top: '15%',
    left: '10%',
  },
  icon2: {
    top: '25%',
    right: '15%',
  },
  icon3: {
    top: '45%',
    left: '5%',
  },
  icon4: {
    top: '60%',
    right: '10%',
  },
  icon5: {
    top: '75%',
    left: '20%',
  },
  icon6: {
    top: '35%',
    right: '25%',
  },
  icon7: {
    top: '20%',
    left: '50%',
  },
  icon8: {
    top: '70%',
    right: '40%',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    zIndex: 1,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logoBackground: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  shieldOverlay: {
    position: 'absolute',
    top: -10,
    right: -10,
    borderRadius: 20,
    padding: 8,
    shadowColor: '#EC4899',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  titleContainer: {
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 2,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  sparkleContainer: {
    marginTop: -8,
  },
  sloganContainer: {
    marginBottom: 40,
    alignItems: 'center',
  },
  slogan: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FDF2F8',
    textAlign: 'center',
    marginBottom: 8,
  },
  subSlogan: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FCE7F3',
    textAlign: 'center',
  },
  featuresContainer: {
    marginBottom: 60,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
  },
  feature: {
    alignItems: 'center',
    gap: 8,
  },
  featureIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  featureText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FDF2F8',
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '80%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#EC4899',
    borderRadius: 2,
  },
  loadingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#FDF2F8',
  },
});