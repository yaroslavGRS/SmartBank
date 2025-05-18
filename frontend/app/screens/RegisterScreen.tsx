import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, ActivityIndicator } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../store/authSlice';
import { AppDispatch, RootState } from '../store';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/RootNavigator';

const schema = z
  .object({
    email: z.string().email('Invalid email address'),
    phone: z.string().min(10, 'Phone must have at least 10 digits'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string().min(6, 'Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

type FormData = z.infer<typeof schema>;

export default function RegisterScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { token, loading, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (token) {
      navigation.replace('Home');
    }
  }, [token]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = (data: FormData) => {
    const { confirmPassword, ...userData } = data;
    dispatch(registerUser(userData));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create a SmartBank Account</Text>
      <Text style={styles.subtitle}>Register securely to start banking</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Email Address"
            value={value}
            onChangeText={onChange}
            error={!!errors.email}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Phone Number"
            value={value}
            onChangeText={onChange}
            error={!!errors.phone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
            left={<TextInput.Icon icon="phone" />}
          />
        )}
      />
      {errors.phone && <Text style={styles.error}>{errors.phone.message}</Text>}

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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Confirm Password"
            value={value}
            onChangeText={onChange}
            error={!!errors.confirmPassword}
            secureTextEntry
            style={styles.input}
            mode="outlined"
            left={<TextInput.Icon icon="lock-check" />}
          />
        )}
      />
      {errors.confirmPassword && (
        <Text style={styles.error}>{errors.confirmPassword.message}</Text>
      )}

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator animating color="#6200ee" style={{ marginTop: 20 }} />
      ) : (
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.button}
          contentStyle={{ paddingVertical: 8 }}
          icon="account-plus"
        >
          Register
        </Button>
      )}

      <Button
        mode="text"
        onPress={() => navigation.navigate('Login')}
        style={{ marginTop: 16 }}
      >
        Already have an account? Sign In
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
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    color: '#121212',
  },
  subtitle: {
    fontSize: 15,
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
    marginTop: -4,
    textAlign: 'left',
    paddingLeft: 4,
  },
});
