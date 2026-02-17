import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraType, CameraView, useCameraPermissions } from "expo-camera";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
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
  data: {
    scan: {
      id: string;
      guardia: any;
      checkpoint: {
        id: string;
        name: string;
        description: string;
      };
      scanTime: string;
      fecha: string;
    };
    progress: {
      scanned: number;
      total: number;
      completed: boolean;
      remaining: number;
    };
  };
}

export default function ScanScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, setLocationPermission] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [loading, setLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState<{
    scanned: number;
    total: number;
    remaining: number;
    completed: boolean;
  } | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastScan, setLastScan] = useState<any>(null);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    getUserData();
    requestLocationPermission();
    checkTodayProgress();
  }, []);

  const getUserData = async () => {
    try {
      const userData = await AsyncStorage.getItem("@user_data");
      if (userData) {
        const user = JSON.parse(userData);
        setUserName(user.fullName || user.name);
      }
    } catch (error) {
      console.error("Error getting user data:", error);
    }
  };

  const requestLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setLocationPermission(status === "granted");
  };

  const checkTodayProgress = async () => {
    try {
      const response = await api.get("/scan/status");
      if (response.data.success) {
        setScanProgress(response.data.status);
      }
    } catch (error) {
      console.error("Error checking progress:", error);
    }
  };

  const getCurrentLocation = async () => {
    if (!locationPermission) {
      Alert.alert("Error", "Se necesita permiso de ubicación");
      return null;
    }

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
    return (
      `${Device.brand || ""} ${Device.modelName || ""}`.trim() ||
      "Dispositivo móvil"
    );
  };

  const handleBarCodeScanned = async ({
    type,
    data,
  }: {
    type: string;
    data: string;
  }) => {
    if (scanned || loading) return;

    setScanned(true);
    Vibration.vibrate(100);

    try {
      setLoading(true);
      const location = await getCurrentLocation();

      const response = await api.post<ScanResponse>("/scan", {
        qrCodeValue: data,
        location: location,
        deviceInfo: getDeviceInfo(),
      });

      if (response.data.success) {
        setLastScan(response.data.data.scan);
        setScanProgress(response.data.data.progress);
        setShowSuccessModal(true);

        if (response.data.data.progress.completed) {
          Alert.alert(
            "🎉 ¡Turno Completado!",
            "Has escaneado todos los puntos de control. ¡Buen trabajo!",
            [{ text: "OK" }],
          );
        }

        await checkTodayProgress();
      }
    } catch (error: any) {
      console.error("Scan error:", error);

      let message = "Error al registrar el escaneo";
      if (error.response?.data?.message) {
        message = error.response.data.message;
      }

      Alert.alert("Error", message);
      setTimeout(() => setScanned(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  const resetScanner = () => {
    setScanned(false);
    setShowSuccessModal(false);
  };

  if (!permission) {
    return (
      <View className="flex-1 bg-[#001c59] items-center justify-center">
        <Text className="text-white text-lg">
          Solicitando permiso de cámara...
        </Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-[#001c59] items-center justify-center p-5">
        <Text className="text-white text-lg text-center mb-5">
          Necesitamos acceso a tu cámara
        </Text>
        <TouchableOpacity
          className="bg-[#00e4fa] px-8 py-4 rounded-xl"
          onPress={requestPermission}
        >
          <Text className="text-[#001c59] font-bold text-base">
            Conceder permiso
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar style="light" />

      {/* Header */}
      <View className="bg-[#001c59]/95 px-5 pt-5 pb-4 rounded-b-3xl">
        <View className="mb-4">
          <Text className="text-white text-lg font-bold">
            {userName || "Guardia"}
          </Text>
          <Text className="text-[#00e4fa] text-sm">Turno activo</Text>
        </View>

        {scanProgress && (
          <View>
            <View className="h-2 bg-white/20 rounded-full overflow-hidden">
              <View
                className="h-full bg-[#00e4fa]"
                style={{
                  width: `${(scanProgress.scanned / scanProgress.total) * 100}%`,
                }}
              />
            </View>
            <Text className="text-white text-xs mt-1 text-right">
              {scanProgress.scanned}/{scanProgress.total} puntos
            </Text>
          </View>
        )}
      </View>

      {/* Cámara */}
      <CameraView
        className="flex-1"
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      >
        <View className="flex-1 bg-black/50 items-center justify-center">
          <View className="w-64 h-64 relative">
            <View className="absolute top-0 left-0 w-10 h-10 border-t-3 border-l-3 border-[#00e4fa]" />
            <View className="absolute top-0 right-0 w-10 h-10 border-t-3 border-r-3 border-[#00e4fa]" />
            <View className="absolute bottom-0 left-0 w-10 h-10 border-b-3 border-l-3 border-[#00e4fa]" />
            <View className="absolute bottom-0 right-0 w-10 h-10 border-b-3 border-r-3 border-[#00e4fa]" />
          </View>

          <Text className="text-white text-sm mt-8 bg-black/70 px-5 py-2.5 rounded-full">
            {scanned && !loading
              ? "Escaneo registrado. Espera..."
              : loading
                ? "Procesando..."
                : "Coloca el código QR dentro del recuadro"}
          </Text>

          {loading && (
            <View className="absolute inset-0 bg-black/70 items-center justify-center">
              <ActivityIndicator size="large" color="#00e4fa" />
            </View>
          )}
        </View>
      </CameraView>

      {/* Modal de éxito */}
      <Modal visible={showSuccessModal} transparent animationType="slide">
        <View className="flex-1 bg-black/80 items-center justify-center">
          <View className="bg-[#001c59] rounded-3xl p-8 w-4/5 items-center">
            <Text className="text-5xl text-[#00e4fa] mb-4">✓</Text>
            <Text className="text-white text-2xl font-bold mb-5">
              ¡Escaneo exitoso!
            </Text>

            {lastScan && (
              <>
                <Text className="text-[#00e4fa] text-lg font-bold text-center mb-2">
                  {lastScan.checkpoint.name}
                </Text>
                <Text className="text-white/70 text-sm mb-5">
                  {new Date(lastScan.scanTime).toLocaleTimeString()}
                </Text>
              </>
            )}

            {scanProgress && (
              <View className="w-full mb-6">
                <Text className="text-white text-sm mb-1">
                  Progreso: {scanProgress.scanned}/{scanProgress.total}
                </Text>
                <View className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-[#00e4fa]"
                    style={{
                      width: `${(scanProgress.scanned / scanProgress.total) * 100}%`,
                    }}
                  />
                </View>
              </View>
            )}

            <TouchableOpacity
              className="bg-[#00e4fa] px-8 py-3 rounded-full w-full"
              onPress={resetScanner}
            >
              <Text className="text-[#001c59] font-bold text-base text-center">
                Escanear otro QR
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Botón historial */}
      <TouchableOpacity
        className="absolute bottom-8 right-5 bg-[#00e4fa] w-14 h-14 rounded-full items-center justify-center shadow-lg"
        // onPress={() => router.push("/history")}
      >
        <Text className="text-2xl">📋</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
