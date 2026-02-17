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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../config/api";

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

          // Si completó todos los puntos
          if (response.data.data.progress.completed) {
            Alert.alert(
              "🎉 ¡Turno Completado!",
              "Has escaneado todos los puntos de control. ¡Excelente trabajo!",
              [{ text: "OK" }],
            );
          }

          // Auto-cerrar modal después de 2 segundos
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

  if (!permission) {
    return (
      <View className="flex-1 justify-center items-center bg-[#001C59]">
        <ActivityIndicator size="large" color="#00E4FA" />
        <Text className="text-white mt-4">
          Solicitando permiso de cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 justify-center items-center bg-[#001C59] p-6">
        <MaterialIcons name="cameraswitch" size={60} color="#00E4FA" />
        <Text className="text-white text-xl font-bold mt-4 text-center">
          Permiso de cámara requerido
        </Text>
        <Text className="text-white/70 text-center mt-2 mb-6">
          Necesitamos acceso a la cámara para escanear los códigos QR de los
          puntos de control.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="bg-[#00E4FA] rounded-2xl py-4 px-8"
        >
          <Text className="text-[#001C59] font-semibold text-lg">
            Conceder permiso
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#001C59]">
      {/* Header con información del usuario y progreso */}
      <View className="px-6 pt-4 pb-6 bg-[#001C59] border-b border-[#00E4FA]/20">
        <View className="flex-row justify-between items-center mb-4">
          <View>
            <Text className="text-[#00E4FA] text-2xl font-bold">
              D.QR Scanner
            </Text>
            {userName && (
              <Text className="text-white/90 text-base mt-1">
                👤 {userName}
              </Text>
            )}
          </View>
          <TouchableOpacity
            onPress={async () => {
              await AsyncStorage.multiRemove(["@auth_token", "@user_data"]);
              router.replace("/login");
            }}
            className="bg-red-500/20 rounded-full p-3"
          >
            <MaterialIcons name="logout" size={24} color="#FF6B6B" />
          </TouchableOpacity>
        </View>

        {/* Barra de progreso */}
        {progress && (
          <View className="mt-2">
            <View className="flex-row justify-between mb-2">
              <Text className="text-white/80">Progreso del día</Text>
              <Text className="text-[#00E4FA] font-bold">
                {progress.scanned}/{progress.total}
              </Text>
            </View>
            <View className="h-3 bg-white/20 rounded-full overflow-hidden">
              <View
                className="h-full bg-[#00E4FA] rounded-full"
                style={{ width: `${progress.percentage}%` }}
              />
            </View>
            <Text className="text-white/60 text-sm mt-2">
              {progress.completed
                ? "✅ ¡Completaste todos los puntos hoy!"
                : `⏳ Te faltan ${progress.remaining} puntos`}
            </Text>
          </View>
        )}
      </View>

      {/* Scanner */}
      <View className="flex-1 m-4 rounded-3xl overflow-hidden border-2 border-[#00E4FA]/30">
        <CameraView
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          style={{ flex: 1 }}
        >
          {/* Overlay del escáner */}
          <View className="flex-1 bg-black/50 justify-center items-center">
            <View className="w-64 h-64">
              {/* Marco del escáner */}
              <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-[#00E4FA]" />
              <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-[#00E4FA]" />
              <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-[#00E4FA]" />
              <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-[#00E4FA]" />
            </View>

            <Text className="text-white text-center mt-8 text-lg font-semibold">
              {loading ? "Procesando..." : "Apunta al código QR"}
            </Text>
            <Text className="text-white/70 text-center mt-2 px-8">
              Escanea los códigos QR en los puntos de control para registrar tu
              ronda
            </Text>
          </View>

          {/* Loading overlay */}
          {loading && (
            <View className="absolute inset-0 bg-black/70 justify-center items-center">
              <ActivityIndicator size="large" color="#00E4FA" />
              <Text className="text-white mt-4">Registrando escaneo...</Text>
            </View>
          )}
        </CameraView>
      </View>

      {/* Modal de éxito */}
      <Modal visible={showSuccess} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black/70">
          <View className="bg-white rounded-3xl p-8 w-4/5 max-w-sm">
            <View className="items-center">
              <View className="w-20 h-20 bg-green-100 rounded-full justify-center items-center mb-4">
                <Ionicons name="checkmark-circle" size={50} color="#00E4FA" />
              </View>

              <Text className="text-2xl font-bold text-[#001C59] mb-2">
                ¡Escaneado!
              </Text>

              {lastScanData && (
                <>
                  <Text className="text-gray-600 text-center text-lg font-semibold mb-2">
                    {lastScanData.scan?.checkpoint?.name}
                  </Text>

                  <Text className="text-gray-500 text-sm mb-4">
                    {new Date(lastScanData.scan?.scanTime).toLocaleTimeString()}
                  </Text>

                  <View className="w-full bg-gray-100 rounded-xl p-4">
                    <View className="flex-row justify-between mb-2">
                      <Text className="text-gray-500">Progreso:</Text>
                      <Text className="text-[#001C59] font-bold">
                        {lastScanData.progress?.scanned} /{" "}
                        {lastScanData.progress?.total}
                      </Text>
                    </View>

                    <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <View
                        className="h-full bg-[#00E4FA] rounded-full"
                        style={{
                          width: `${(lastScanData.progress?.scanned / lastScanData.progress?.total) * 100}%`,
                        }}
                      />
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Instrucciones flotantes */}
      <View className="px-6 py-4 bg-[#001C59] flex-row justify-around">
        <View className="items-center">
          <Ionicons name="camera-outline" size={20} color="#00E4FA" />
          <Text className="text-white/70 text-xs mt-1">Escanear QR</Text>
        </View>
        <View className="items-center">
          <Ionicons name="location-outline" size={20} color="#00E4FA" />
          <Text className="text-white/70 text-xs mt-1">
            Registrar ubicación
          </Text>
        </View>
        <View className="items-center">
          <Ionicons name="time-outline" size={20} color="#00E4FA" />
          <Text className="text-white/70 text-xs mt-1">Hora exacta</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
