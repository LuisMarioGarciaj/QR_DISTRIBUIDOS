import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api, { LoginResponse } from "../config/api";
import "../global.css";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async (): Promise<void> => {
    // Validar campos
    if (!email || !password) {
      Alert.alert("Error", "Completa todos los campos");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email: email.trim(),
        password: password,
      });

      if (response.data.success) {
        // Guardar token y datos del usuario
        await AsyncStorage.setItem("@auth_token", response.data.token);
        await AsyncStorage.setItem(
          "@user_data",
          JSON.stringify(response.data.user),
        );

        // Navegar a la pantalla principal
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Error",
          response.data.message || "Error al iniciar sesión",
        );
      }
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response) {
        // El servidor respondió con un error
        Alert.alert(
          "Error",
          error.response.data?.message || "Credenciales inválidas",
        );
      } else if (error.request) {
        // No se recibió respuesta del servidor
        Alert.alert(
          "Error de conexión",
          "No se pudo conectar al servidor. Verifica tu conexión a internet.",
        );
      } else {
        // Error en la configuración de la petición
        Alert.alert("Error", "Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0, 28, 89, 1)" }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            paddingHorizontal: 24,
          }}
        >
          {/* Header */}
          <View className="items-center mb-10">
            <View
              className="w-24 h-24 rounded-3xl items-center justify-center shadow-lg"
              style={{ backgroundColor: "rgba(0, 228, 250, 1)" }}
            >
              <Text className="text-white text-3xl font-bold">D.QR</Text>
            </View>
            <Text className="text-3xl font-bold mt-6 text-white">
              Bienvenido
            </Text>
            <Text
              className="mt-2 text-center"
              style={{ color: "rgba(255, 255, 255, 0.8)" }}
            >
              Sistema de Control de Patrullajes
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-5">
            <View>
              <Text className="mb-2 font-medium text-white">
                Correo electrónico
              </Text>
              <TextInput
                style={{
                  backgroundColor: "rgba(0, 37, 123, 1)",
                  borderColor: "rgba(0, 228, 250, 0.3)",
                  color: "white",
                }}
                className="border rounded-2xl px-4 py-4"
                placeholder="ejemplo@email.com"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            <View>
              <Text className="mb-2 font-medium text-white">Contraseña</Text>
              <TextInput
                style={{
                  backgroundColor: "rgba(0, 37, 123, 1)",
                  borderColor: "rgba(0, 228, 250, 0.3)",
                  color: "white",
                }}
                className="border rounded-2xl px-4 py-4"
                placeholder="********"
                placeholderTextColor="rgba(255, 255, 255, 0.5)"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
            </View>

            <TouchableOpacity className="self-end" disabled={loading}>
              <Text
                style={{ color: "rgba(0, 228, 250, 1)" }}
                className="font-medium"
              >
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#666" : "rgba(0, 228, 250, 1)",
                opacity: loading ? 0.5 : 1,
              }}
              className="rounded-2xl py-4 mt-6 shadow-lg active:opacity-80"
            >
              {loading ? (
                <ActivityIndicator color="rgba(0, 28, 89, 1)" />
              ) : (
                <Text
                  className="text-center font-semibold text-lg"
                  style={{ color: "rgba(0, 28, 89, 1)" }}
                >
                  Iniciar sesión
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Versión de la app */}
          <Text className="text-center text-white/50 text-xs mt-8">
            Versión 1.0.0
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
