import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as Location from "expo-location";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  Vibration,
  View,
  Dimensions,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from 'expo-linear-gradient';
import api from "../../config/api";

const { width, height } = Dimensions.get("window");

// Función para escalado responsivo
const scale = Math.min(width, height) / 375;
const normalize = (size: number) => Math.round(size * scale);

interface ScanResponse {
  success: boolean;
  message: string;
  data?: {
    scan: {
      id: string;
      guardia: {
        id: string;
        nombreCompleto: string;
      };
      checkpoint: {
        id: string;
        name: string;
        description: string;
      };
      scanTime: string;
      fecha: string;
      location?: {
        lat: number;
        lng: number;
      };
    };
    progress: {
      scanned: number;
      total: number;
      completed: boolean;
      remaining: number;
    };
    today: string;
  };
}

interface ProgressStatus {
  scanned: number;
  total: number;
  completed: boolean;
  remaining: number;
  percentage: number;
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastScanData, setLastScanData] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const [progress, setProgress] = useState<ProgressStatus | null>(null);
  const qrLock = useRef(false);

  useEffect(() => {
    loadUserData();
    requestLocationPermission();
    checkTodayProgress();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("@user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.fullName || user.name);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      setLocationPermission(status === "granted");
    } catch (error) {
      console.error("Error requesting location permission:", error);
    }
  };

  const checkTodayProgress = async () => {
    try {
      const response = await api.get("/scan/status");
      if (response.data.success) {
        setProgress(response.data.status);
      }
    } catch (error) {
      console.error("Error checking progress:", error);
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) return null;

    try {
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    } catch (error) {
      console.error("Error getting location:", error);
      return null;
    }
  };

  const getDeviceInfo = () => {
    return `${Platform.OS} - ${Platform.Model || "Dispositivo móvil"}`;
  };

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanned && !qrLock.current && !loading) {
      qrLock.current = true;
      setScanned(true);
      setLoading(true);
      Vibration.vibrate(100);

      try {
        const location = await getCurrentLocation();

        const response = await api.post<ScanResponse>("/scan", {
          qrCodeValue: data,
          location: location,
          deviceInfo: getDeviceInfo(),
        });

        if (response.data.success && response.data.data) {
          setLastScanData(response.data.data);
          setProgress({
            scanned: response.data.data.progress.scanned,
            total: response.data.data.progress.total,
            completed: response.data.data.progress.completed,
            remaining: response.data.data.progress.remaining,
            percentage: Math.round(
              (response.data.data.progress.scanned /
                response.data.data.progress.total) *
                100,
            ),
          });
          setShowSuccess(true);

          if (response.data.data.progress.completed) {
            Alert.alert(
              "🎉 ¡Turno Completado!",
              "Has escaneado todos los puntos de control. ¡Excelente trabajo!",
              [{ text: "OK" }],
            );
          }

          setTimeout(() => {
            setShowSuccess(false);
            resetScanner();
          }, 2000);
        }
      } catch (error: any) {
        console.error("Error en escaneo:", error);

        let message = "Error al registrar el escaneo";
        if (error.response?.data?.message) {
          message = error.response.data.message;
        }

        Alert.alert("Error", message);
        resetScanner();
      }
    }
  };

  const resetScanner = () => {
    setTimeout(() => {
      setScanned(false);
      setLoading(false);
      qrLock.current = false;
    }, 1500);
  };

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Estás seguro que deseas salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Salir",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.multiRemove(["@auth_token", "@user_data"]);
            router.replace("/login");
          },
        },
      ]
    );
  };

  const scannerFrameSize = Math.min(width * 0.7, 280);

  if (!permission) {
    return (
      <LinearGradient
        colors={["#001C59", "#00257b"]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      >
        <ActivityIndicator size="large" color="#00E4FA" />
        <Text style={{ color: 'white', marginTop: normalize(16), fontSize: normalize(14) }}>
          Solicitando permiso de cámara...
        </Text>
      </LinearGradient>
    );
  }

  if (!permission.granted) {
    return (
      <LinearGradient
        colors={["#001C59", "#00257b"]}
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: normalize(24) }}
      >
        <View style={{
          width: normalize(80),
          height: normalize(80),
          borderRadius: normalize(20),
          backgroundColor: 'rgba(0, 228, 250, 0.2)',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: normalize(24)
        }}>
          <MaterialIcons name="cameraswitch" size={normalize(40)} color="#00E4FA" />
        </View>
        <Text style={{
          color: 'white',
          fontSize: normalize(20),
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: normalize(8)
        }}>
          Permiso de cámara requerido
        </Text>
        <Text style={{
          color: 'rgba(255,255,255,0.7)',
          textAlign: 'center',
          marginBottom: normalize(24),
          fontSize: normalize(14)
        }}>
          Necesitamos acceso a la cámara para escanear los códigos QR de los puntos de control.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{
            backgroundColor: '#00E4FA',
            borderRadius: normalize(12),
            paddingVertical: normalize(12),
            paddingHorizontal: normalize(24),
          }}
          activeOpacity={0.8}
        >
          <Text style={{ color: '#001C59', fontWeight: '600', fontSize: normalize(16) }}>
            Conceder permiso
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#001C59' }}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
        {/* Header mejorado con gradiente */}
        <LinearGradient
          colors={["#001C59", "rgba(0, 28, 89, 0.95)"]}
          style={{
            paddingTop: normalize(8),
            paddingBottom: normalize(16),
            paddingHorizontal: normalize(20),
            borderBottomWidth: 1,
            borderBottomColor: 'rgba(0, 228, 250, 0.2)',
          }}
        >
          <View style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: normalize(12)
          }}>
            <View>
              <Text style={{ color: '#00E4FA', fontSize: normalize(24), fontWeight: 'bold' }}>
                D.QR Scanner
              </Text>
              {userName && (
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(4) }}>
                  <View style={{
                    width: normalize(24),
                    height: normalize(24),
                    borderRadius: normalize(12),
                    backgroundColor: 'rgba(0, 228, 250, 0.2)',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginRight: normalize(6)
                  }}>
                    <Text style={{ color: '#00E4FA', fontSize: normalize(12), fontWeight: 'bold' }}>
                      {userName.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={{ color: 'white', fontSize: normalize(14) }}>{userName}</Text>
                </View>
              )}
            </View>
            
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                backgroundColor: 'rgba(255, 107, 107, 0.2)',
                borderRadius: normalize(10),
                padding: normalize(8),
              }}
              activeOpacity={0.7}
            >
              <MaterialIcons name="logout" size={normalize(20)} color="#FF6B6B" />
            </TouchableOpacity>
          </View>

          {/* Barra de progreso */}
          {progress && (
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: normalize(6) }}>
                <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: normalize(12) }}>
                  Progreso del día
                </Text>
                <Text style={{ color: '#00E4FA', fontWeight: 'bold', fontSize: normalize(14) }}>
                  {progress.scanned}/{progress.total}
                </Text>
              </View>
              <View style={{
                height: normalize(6),
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: normalize(3),
                overflow: 'hidden',
              }}>
                <View
                  style={{
                    height: '100%',
                    backgroundColor: '#00E4FA',
                    width: `${progress.percentage}%`,
                  }}
                />
              </View>
              <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: normalize(10), marginTop: normalize(6) }}>
                {progress.completed
                  ? "✅ ¡Completaste todos los puntos hoy!"
                  : `⏳ Te faltan ${progress.remaining} puntos`}
              </Text>
            </View>
          )}
        </LinearGradient>

        {/* Scanner - SIN ANIMACIONES DE MOVIMIENTO */}
        <View style={{
          flex: 1,
          margin: normalize(16),
          borderRadius: normalize(20),
          overflow: 'hidden',
          borderWidth: 2,
          borderColor: 'rgba(0, 228, 250, 0.3)',
        }}>
          <CameraView
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{
              barcodeTypes: ["qr"],
            }}
            style={{ flex: 1 }}
          >
            {/* Overlay del escáner - ESTÁTICO */}
            <View style={{
              flex: 1,
              backgroundColor: 'rgba(0,0,0,0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              {/* Marco del escáner fijo - SIN ANIMACIÓN */}
              <View style={{
                width: scannerFrameSize,
                height: scannerFrameSize,
              }}>
                {/* Esquinas del marco - ESTÁTICAS */}
                <View style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: normalize(30),
                  height: normalize(30),
                  borderTopWidth: 3,
                  borderLeftWidth: 3,
                  borderColor: '#00E4FA',
                  borderTopLeftRadius: normalize(12),
                }} />
                <View style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: normalize(30),
                  height: normalize(30),
                  borderTopWidth: 3,
                  borderRightWidth: 3,
                  borderColor: '#00E4FA',
                  borderTopRightRadius: normalize(12),
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: normalize(30),
                  height: normalize(30),
                  borderBottomWidth: 3,
                  borderLeftWidth: 3,
                  borderColor: '#00E4FA',
                  borderBottomLeftRadius: normalize(12),
                }} />
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: normalize(30),
                  height: normalize(30),
                  borderBottomWidth: 3,
                  borderRightWidth: 3,
                  borderColor: '#00E4FA',
                  borderBottomRightRadius: normalize(12),
                }} />
              </View>

              {/* Texto de instrucción estático */}
              <View style={{
                marginTop: normalize(24),
                backgroundColor: 'rgba(0,0,0,0.7)',
                paddingHorizontal: normalize(20),
                paddingVertical: normalize(8),
                borderRadius: normalize(20),
              }}>
                <Text style={{ color: 'white', fontSize: normalize(12) }}>
                  {loading ? "Procesando..." : "Apunta al código QR"}
                </Text>
              </View>

              <Text style={{
                color: 'rgba(255,255,255,0.7)',
                textAlign: 'center',
                marginTop: normalize(8),
                paddingHorizontal: normalize(20),
                fontSize: normalize(10)
              }}>
                Escanea los códigos QR en los puntos de control
              </Text>
            </View>

            {/* Loading overlay */}
            {loading && (
              <View style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.8)',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <View style={{
                  backgroundColor: '#001C59',
                  padding: normalize(20),
                  borderRadius: normalize(16),
                  alignItems: 'center',
                }}>
                  <ActivityIndicator size="large" color="#00E4FA" />
                  <Text style={{ color: 'white', marginTop: normalize(12), fontSize: normalize(14) }}>
                    Registrando escaneo...
                  </Text>
                </View>
              </View>
            )}
          </CameraView>
        </View>

        {/* Footer con características */}
        <LinearGradient
          colors={["rgba(0, 28, 89, 0.95)", "#001C59"]}
          style={{
            paddingHorizontal: normalize(20),
            paddingVertical: normalize(12),
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderTopWidth: 1,
            borderTopColor: 'rgba(0, 228, 250, 0.2)',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: normalize(32),
              height: normalize(32),
              borderRadius: normalize(16),
              backgroundColor: 'rgba(0, 228, 250, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(4),
            }}>
              <Ionicons name="camera-outline" size={normalize(16)} color="#00E4FA" />
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: normalize(9) }}>
              Escanear QR
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: normalize(32),
              height: normalize(32),
              borderRadius: normalize(16),
              backgroundColor: 'rgba(0, 228, 250, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(4),
            }}>
              <Ionicons name="location-outline" size={normalize(16)} color="#00E4FA" />
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: normalize(9) }}>
              Geo-localización
            </Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{
              width: normalize(32),
              height: normalize(32),
              borderRadius: normalize(16),
              backgroundColor: 'rgba(0, 228, 250, 0.2)',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: normalize(4),
            }}>
              <Ionicons name="time-outline" size={normalize(16)} color="#00E4FA" />
            </View>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: normalize(9) }}>
              Hora exacta
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>

      {/* Modal de éxito */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0,0,0,0.7)',
        }}>
          <View style={{
            backgroundColor: 'white',
            borderRadius: normalize(20),
            padding: normalize(24),
            width: width * 0.85,
            maxWidth: 350,
          }}>
            <View style={{ alignItems: 'center' }}>
              <View style={{
                width: normalize(70),
                height: normalize(70),
                borderRadius: normalize(35),
                backgroundColor: '#4CAF50',
                opacity: 0.1,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: normalize(16),
              }}>
                <View style={{
                  width: normalize(56),
                  height: normalize(56),
                  borderRadius: normalize(28),
                  backgroundColor: '#00E4FA',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                  <Ionicons name="checkmark" size={normalize(28)} color="#001C59" />
                </View>
              </View>

              <Text style={{
                fontSize: normalize(20),
                fontWeight: 'bold',
                color: '#001C59',
                marginBottom: normalize(12),
              }}>
                ¡Escaneado!
              </Text>

              {lastScanData && (
                <>
                  <View style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: normalize(12),
                    padding: normalize(16),
                    width: '100%',
                    marginBottom: normalize(12),
                  }}>
                    <Text style={{
                      color: '#00E4FA',
                      fontSize: normalize(16),
                      fontWeight: 'bold',
                      textAlign: 'center',
                      marginBottom: normalize(4),
                    }}>
                      {lastScanData.scan?.checkpoint?.name}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                      <Ionicons name="time-outline" size={normalize(12)} color="#666" />
                      <Text style={{
                        color: '#666',
                        fontSize: normalize(11),
                        marginLeft: normalize(4),
                      }}>
                        {new Date(lastScanData.scan?.scanTime).toLocaleTimeString()}
                      </Text>
                    </View>
                  </View>

                  <View style={{
                    backgroundColor: '#F5F5F5',
                    borderRadius: normalize(12),
                    padding: normalize(12),
                    width: '100%',
                  }}>
                    <View style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: normalize(6),
                    }}>
                      <Text style={{ color: '#666', fontSize: normalize(11) }}>Progreso:</Text>
                      <Text style={{ color: '#001C59', fontWeight: 'bold', fontSize: normalize(14) }}>
                        {lastScanData.progress?.scanned} / {lastScanData.progress?.total}
                      </Text>
                    </View>

                    <View style={{
                      height: normalize(6),
                      backgroundColor: '#E0E0E0',
                      borderRadius: normalize(3),
                      overflow: 'hidden',
                    }}>
                      <View
                        style={{
                          height: '100%',
                          backgroundColor: '#00E4FA',
                          width: `${(lastScanData.progress?.scanned / lastScanData.progress?.total) * 100}%`,
                        }}
                      />
                    </View>
                  </View>
                </>
              )}

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: normalize(16) }}>
                <ActivityIndicator size="small" color="#00E4FA" />
                <Text style={{ color: '#999', fontSize: normalize(10), marginLeft: normalize(8) }}>
                  Cerrando...
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}