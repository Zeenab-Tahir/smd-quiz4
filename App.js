import { useRef, useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
import { auth, firebaseConfig } from "./firebaseConfig";

export default function App() {
  const recaptchaVerifier = useRef(null);
  const [phone, setPhone] = useState("+92");
  const [code, setCode] = useState("");
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // {type: 'success'|'error'|'info', msg}

  const sendOtp = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const provider = new PhoneAuthProvider(auth);
      const id = await provider.verifyPhoneNumber(phone, recaptchaVerifier.current);
      setVerificationId(id);
      setStatus({ type: "info", msg: "OTP sent to " + phone });
    } catch (e) {
      setStatus({ type: "error", msg: e.message });
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    Keyboard.dismiss();
    setLoading(true);
    setStatus(null);
    try {
      const credential = PhoneAuthProvider.credential(verificationId, code);
      await signInWithCredential(auth, credential);
      setStatus({ type: "success", msg: "✅ Verification Successful! Phone number verified." });
    } catch (e) {
      setStatus({ type: "error", msg: "❌ Verification Failed: wrong or expired OTP." });
    }
    setLoading(false);
  };

  const reset = () => {
    setVerificationId(null);
    setCode("");
    setStatus(null);
  };

  const color = status?.type === "success" ? "#16a34a" : status?.type === "error" ? "#dc2626" : "#2563eb";

  return (
    <KeyboardAvoidingView style={s.c} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <FirebaseRecaptchaVerifierModal ref={recaptchaVerifier} firebaseConfig={firebaseConfig} />
      <Text style={s.t}>Phone Verification</Text>

      {!verificationId ? (
        <>
          <TextInput style={s.i} value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+923001234567" />
          <TouchableOpacity style={s.b} onPress={sendOtp} disabled={loading}>
            <Text style={s.bt}>Send OTP</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={{ marginBottom: 8 }}>Enter the 6-digit OTP</Text>
          <TextInput style={s.i} value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} placeholder="123456" />
          <TouchableOpacity style={s.b} onPress={verifyOtp} disabled={loading}>
            <Text style={s.bt}>Verify OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={reset} style={{ marginTop: 16 }}>
            <Text style={{ textAlign: "center", color: "#2563eb" }}>Change number / Resend</Text>
          </TouchableOpacity>
        </>
      )}

      {loading && <ActivityIndicator style={{ marginTop: 16 }} />}
      {status && <Text style={{ marginTop: 20, fontSize: 16, textAlign: "center", color }}>{status.msg}</Text>}
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  c: { flex: 1, justifyContent: "center", padding: 24 },
  t: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  i: { borderWidth: 1, borderColor: "#999", borderRadius: 8, padding: 12, fontSize: 18 },
  b: { backgroundColor: "#2563eb", padding: 14, borderRadius: 8, marginTop: 16 },
  bt: { color: "#fff", textAlign: "center", fontSize: 18 },
});

