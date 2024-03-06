import {GestureHandlerRootView} from 'react-native-gesture-handler';
import App from './App';

export default () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <App />
    </GestureHandlerRootView>
  );
};
