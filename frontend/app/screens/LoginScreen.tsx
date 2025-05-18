import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { loginUser } from '../store/authSlice';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const schema = z.object({
  identifier: z.string().min(3, 'Please enter a valid email or phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;
type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const dispatch = useDispatch<AppDispatch>();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => dispatch(loginUser(data));

  useEffect(() => {
    if (token) navigation.replace('Home');
  }, [token]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to SmartBank</Text>
      <Text style={styles.subtitle}>Secure Login</Text>

      <Controller
        control={control}
        name="identifier"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email or Phone"
            value={value}
            onChangeText={onChange}
            error={!!errors.identifier}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
            left={<TextInput.Icon icon="account" />}
          />
        )}
      />
      {errors.identifier && <Text style={styles.error}>{errors.identifier.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Password"
            value={value}
            onChangeText={onChange}
            error={!!errors.password}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock" />}
          />
        )}
      />
      {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator animating color="#6200ee" style={{ marginTop: 20 }} />
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
          icon="login"
        >
          Sign In
        </Button>
      )}

      <Button
        mode="text"
        onPress={() => navigation.navigate('Register')}
        style={{ marginTop: 16 }}
      >
        Don’t have an account? Register
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#121212',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    color: '#555',
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  button: {
    marginTop: 8,
    borderRadius: 12,
    elevation: 2,
  },
  error: {
    color: '#d32f2f',
    fontSize: 14,
    marginBottom: 8,
    marginTop: -8,
    textAlign: 'left',
    paddingLeft: 4,
  },
});
