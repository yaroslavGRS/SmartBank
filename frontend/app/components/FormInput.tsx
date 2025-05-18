import React from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { Controller } from 'react-hook-form';

interface FormInputProps {
  control: any;
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
}

export default function FormInput({
  control,
  name,
  placeholder,
  secureTextEntry,
}: FormInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => (
        <View style={styles.container}>
          <TextInput
            style={[styles.input, error && styles.inputError]}
            placeholder={placeholder}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            secureTextEntry={secureTextEntry}
          />
          {error && <Text style={styles.errorText}>{error.message}</Text>}
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    marginTop: 4,
    color: 'red',
    fontSize: 12,
  },
});
