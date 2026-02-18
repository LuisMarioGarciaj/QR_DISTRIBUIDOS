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
  const [rememberMe, setRememberMe] = useState<boolean>(false);

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

        if (rememberMe) {
          await AsyncStorage.setItem("@remember_email", email.trim());
        } else {
          await AsyncStorage.removeItem("@remember_email");
        }

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
        Alert.alert(
          "Error",
          error.response.data?.message || "Credenciales inválidas",
        );
      } else if (error.request) {
        Alert.alert(
          "Error de conexión",
          "No se pudo conectar al servidor. Verifica tu conexión a internet.",
        );
      } else {
        Alert.alert("Error", "Ocurrió un error inesperado");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "rgba(0, 28, 89, 1)" }}>
      {/* Overlay con patrón de puntos decorativos */}
      <View
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          opacity: 0.1,
        }}
      >
        <View
          style={{
            flex: 1,
            flexWrap: "wrap",
            flexDirection: "row",
            alignContent: "flex-start",
            justifyContent: "center",
          }}
        >
          {[...Array(50)].map((_, i) => (
            <View
              key={i}
              style={{
                width: 4,
                height: 4,
                backgroundColor: "rgba(0, 228, 250, 1)",
                margin: 8,
                borderRadius: 2,
                opacity: 0.3,
              }}
            />
          ))}
        </View>
      </View>

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
          showsVerticalScrollIndicator={false}
        >
          {/* Header con logo mejorado */}
          <View className="items-center mb-10">
            <View
              className="w-28 h-28 rounded-3xl items-center justify-center"
              style={{
                backgroundColor: "rgba(0, 228, 250, 1)",
                shadowColor: "#00E4FA",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
                borderWidth: 2,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <Text className="text-white text-4xl font-bold tracking-wider">
                D.QR
              </Text>
            </View>

            {/* Línea decorativa */}
            <View
              style={{
                width: 60,
                height: 2,
                backgroundColor: "rgba(0, 228, 250, 0.3)",
                marginTop: 16,
                borderRadius: 1,
              }}
            />

            <Text className="text-3xl font-bold mt-4 text-white">
              Bienvenido
            </Text>
            <Text
              className="mt-2 text-center text-base"
              style={{ color: "rgba(255, 255, 255, 0.7)" }}
            >
              Sistema de Control de Patrullajes
            </Text>
          </View>

          {/* Formulario */}
          <View className="space-y-5">
            {/* Campo Email */}
            <View>
              <Text
                className="mb-2 text-sm font-medium tracking-wide"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Correo electrónico
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(0, 37, 123, 0.5)",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: email
                    ? "rgba(0, 228, 250, 0.8)"
                    : "rgba(0, 228, 250, 0.3)",
                  overflow: "hidden",
                }}
              >
                <TextInput
                  className="px-4 py-4 text-base"
                  style={{ color: "white" }}
                  placeholder="ejemplo@email.com"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Campo Contraseña */}
            <View>
              <Text
                className="mb-2 text-sm font-medium tracking-wide"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Contraseña
              </Text>
              <View
                style={{
                  backgroundColor: "rgba(0, 37, 123, 0.5)",
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: password
                    ? "rgba(0, 228, 250, 0.8)"
                    : "rgba(0, 228, 250, 0.3)",
                  overflow: "hidden",
                }}
              >
                <TextInput
                  className="px-4 py-4 text-base"
                  style={{ color: "white" }}
                  placeholder="********"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
              </View>
            </View>

            {/* Opciones adicionales */}
            <View className="flex-row justify-between items-center mt-2">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => setRememberMe(!rememberMe)}
                disabled={loading}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: "rgba(0, 228, 250, 0.5)",
                    marginRight: 8,
                    backgroundColor: rememberMe
                      ? "rgba(0, 228, 250, 0.2)"
                      : "transparent",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {rememberMe && (
                    <Text style={{ color: "#00E4FA", fontSize: 12 }}>✓</Text>
                  )}
                </View>
                <Text style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                  Recordar sesión
                </Text>
              </TouchableOpacity>

              <TouchableOpacity disabled={loading}>
                <Text
                  style={{ color: "rgba(0, 228, 250, 1)" }}
                  className="font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Botón de login mejorado */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              activeOpacity={0.8}
              style={{
                backgroundColor: "rgba(0, 228, 250, 1)",
                opacity: loading ? 0.5 : 1,
                shadowColor: "#00E4FA",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 6,
                transform: [{ scale: loading ? 0.98 : 1 }],
              }}
              className="rounded-2xl py-4 mt-8"
            >
              {loading ? (
                <View className="flex-row items-center justify-center">
                  <ActivityIndicator color="rgba(0, 28, 89, 1)" size="small" />
                  <Text
                    style={{ color: "rgba(0, 28, 89, 1)" }}
                    className="ml-2 font-medium"
                  >
                    Iniciando sesión...
                  </Text>
                </View>
              ) : (
                <View className="flex-row items-center justify-center">
                  <Text
                    className="text-center font-semibold text-lg mr-2"
                    style={{ color: "rgba(0, 28, 89, 1)" }}
                  >
                    Iniciar sesión
                  </Text>
                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      backgroundColor: "rgba(0, 28, 89, 0.2)",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ color: "rgba(0, 28, 89, 1)", fontSize: 12 }}>
                      →
                    </Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            {/* Separador para otras opciones */}
            <View className="flex-row items-center my-6">
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              />
              <Text
                style={{ color: "rgba(255, 255, 255, 0.3)" }}
                className="mx-4 text-xs"
              >
                O CONTINÚA CON
              </Text>
              <View
                style={{
                  flex: 1,
                  height: 1,
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                }}
              />
            </View>

            {/* Botones de autenticación alternativa */}
            <View className="flex-row justify-center space-x-4">
              <TouchableOpacity
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 12,
                  padding: 12,
                  width: 60,
                  alignItems: "center",
                }}
                disabled={loading}
              >
                <Text style={{ color: "white", fontSize: 20 }}>G</Text>
              </TouchableOpacity>

              
            </View>
          </View>

          {/* Footer mejorado */}
          <View className="mt-8">
            <Text className="text-center text-white/30 text-xs">
              © 2026 Sistema de Patrullajes
            </Text>
            <View className="flex-row justify-center mt-2">
              <TouchableOpacity disabled={loading}>
                <Text className="text-white/40 text-xs mx-2">Términos</Text>
              </TouchableOpacity>
              <Text className="text-white/20">•</Text>
              <TouchableOpacity disabled={loading}>
                <Text className="text-white/40 text-xs mx-2">Privacidad</Text>
              </TouchableOpacity>
              <Text className="text-white/20">•</Text>
              <TouchableOpacity disabled={loading}>
                <Text className="text-white/40 text-xs mx-2">Soporte</Text>
              </TouchableOpacity>
            </View>
            <Text className="text-center text-white/20 text-xs mt-2">
              Versión 1.0.0
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}