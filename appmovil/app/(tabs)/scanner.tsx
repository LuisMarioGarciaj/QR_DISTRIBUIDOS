import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
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
        nombreCompleto: string;
      };
      checkpoint: {
        id: string;
        name: string;
        description: string;
      };
      scanTime: string;
      location: {
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
  };
}

export default function ScannerScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastScanData, setLastScanData] = useState<any>(null);
  const [userName, setUserName] = useState("");
  const qrLock = useRef(false);

  // Obtener nombre del usuario al cargar
  useEffect(() => {
    loadUserData();
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

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (!scanning || qrLock.current || loading) return;

    qrLock.current = true;
    setScanned(true);
    setLoading(true);
    Vibration.vibrate(100); // Feedback táctil

    try {
      console.log("QR escaneado:", data);

      // Obtener ubicación actual
      let location = null;
      try {
        // Aquí puedes agregar la obtención de ubicación si lo deseas
        // location = await getCurrentLocation();
      } catch (error) {
        console.log("Error getting location:", error);
      }

      // Enviar al backend
      const response = await api.post<ScanResponse>("/scan", {
        qrCodeValue: data,
        location: location || { lat: 0, lng: 0 },
        deviceInfo: `Expo - ${Platform.OS}`,
      });

      console.log("Respuesta:", response.data);

      if (response.data.success) {
        setLastScanData(response.data.data);
        setShowSuccess(true);

        // Si completó todos los puntos, mostrar mensaje especial
        if (response.data.data?.progress.completed) {
          Alert.alert(
            "🎉 ¡Turno Completado!",
            "Has escaneado todos los puntos de control. ¡Excelente trabajo!",
            [{ text: "OK" }],
          );
        }

        // Pequeña pausa para mostrar el éxito
        setTimeout(() => {
          setShowSuccess(false);
          setScanned(false);
          setScanning(true);
          qrLock.current = false;
          setLoading(false);
        }, 2000);
      } else {
        Alert.alert("Error", response.data.message || "QR no válido");
        resetScanner();
      }
    } catch (error: any) {
      console.error("Error en escaneo:", error);

      if (error.response?.status === 400) {
        Alert.alert(
          "Atención",
          error.response.data?.message || "Ya escaneaste este punto hoy",
        );
      } else if (error.response?.status === 401) {
        Alert.alert("Sesión expirada", "Por favor inicia sesión nuevamente");
        router.replace("/login");
      } else {
        Alert.alert(
          "Error",
          "No se pudo registrar el escaneo. Intenta nuevamente.",
        );
      }

      resetScanner();
    }
  };

  const resetScanner = () => {
    setTimeout(() => {
      setScanned(false);
      setScanning(true);
      qrLock.current = false;
      setLoading(false);
    }, 1500);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#001C59]">
      {/* Header */}
      <View className="px-6 py-4 bg-[#001C59]">
        <Text className="text-[#00E4FA] text-2xl font-bold">D.QR Scanner</Text>
        {userName ? (
          <Text className="text-white/70 text-sm mt-1">
            Guardia:{" "}
            <Text className="text-white font-semibold">{userName}</Text>
          </Text>
        ) : null}
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
            <View className="w-64 h-64 border-2 border-[#00E4FA] rounded-3xl">
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
                  <Text className="text-gray-600 text-center text-lg font-semibold">
                    {lastScanData.scan?.checkpoint?.name}
                  </Text>

                  <View className="w-full bg-gray-100 rounded-xl p-4 mt-4">
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

                    <Text className="text-center text-gray-500 text-sm mt-2">
                      {lastScanData.progress?.remaining > 0
                        ? `Te faltan ${lastScanData.progress.remaining} puntos`
                        : "¡Completaste todos los puntos!"}
                    </Text>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* Botón para cerrar sesión */}
      <TouchableOpacity
        onPress={async () => {
          await AsyncStorage.removeItem("@auth_token");
          await AsyncStorage.removeItem("@user_data");
          router.replace("/login");
        }}
        className="absolute top-12 right-4 bg-red-500/20 rounded-full p-2"
      >
        <MaterialIcons name="logout" size={24} color="#FF6B6B" />
      </TouchableOpacity>

      {/* Instrucciones */}
      <View className="px-6 py-4 bg-[#001C59]">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Ionicons name="camera-outline" size={24} color="#00E4FA" />
            <Text className="text-white/70 text-xs mt-1">Escanear QR</Text>
          </View>
          <View className="items-center">
            <Ionicons name="location-outline" size={24} color="#00E4FA" />
            <Text className="text-white/70 text-xs mt-1">
              Registrar ubicación
            </Text>
          </View>
          <View className="items-center">
            <Ionicons name="time-outline" size={24} color="#00E4FA" />
            <Text className="text-white/70 text-xs mt-1">Hora exacta</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
