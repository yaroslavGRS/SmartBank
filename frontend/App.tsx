import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { Provider as PaperProvider } from 'react-native-paper';
import store from './app/store';
import RootNavigator from './app/navigation/RootNavigator';

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </ReduxProvider>
  );
}
