import React from 'react';
import HomeScreen from './screens/HomeScreen';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import NewProjectScreen from './screens/NewProjectScreen';
import {TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

function App(): React.JSX.Element {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name={'Builder'}
          options={{headerShown: false}}
          component={HomeScreen}
        />
        <Stack.Screen
          name={'NewProjectScreen'}
          options={{
            headerShown: false,
            headerTintColor: '#257ae7',
            title: 'Новый проект',
            headerRight: () => (
              <TouchableOpacity>
                <Icon size={24} name="save" color="#257ae7" />
              </TouchableOpacity>
            ),
          }}
          component={NewProjectScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
