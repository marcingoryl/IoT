import * as React from 'react';
import {useState, useEffect} from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Button, TextInput, AsyncStorage  } from 'react-native';
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import ColorPicker from 'react-native-color-picker-ios';
import RNRestart from 'react-native-restart';

function Home() {
  return (
    <RootStack.Navigator>
    <RootStack.Group>
          <RootStack.Screen name="Devices" component={DevicesScreen} />
          <RootStack.Screen name="Connection" component={ConnectionScreen} />
        </RootStack.Group>
        <RootStack.Group screenOptions={{ presentation: 'modal' }}>
        <RootStack.Screen name="New Device" component={ModalScreen} />
      </RootStack.Group>
    </RootStack.Navigator>
  );
}

 function DevicesScreen({route, navigation}) {
 
  const [deviceState, setDeviceState] = React.useState([]);

 /* const get = async () => {
    let k = await getData()
    return k
  } */
  clearAsyncStorage = async() => {
    AsyncStorage.clear();
}
  
  useEffect(()=>{
  
      //get().then(jsonValue => {setDeviceState(jsonValue)})

    if(route.params?.deviceData){
      setDeviceState(route.params?.deviceData)
      //console.log(route.params?.deviceData)
    } 
     
    }, [route.params?.deviceData]) 
    
   
  return (
    <View style={styles.items}>
      { deviceState.map( val => <TouchableOpacity key={val} style={
        {
          flexDirection:"column",
          alignItems: 'center',
          borderWidth: 1,
          borderColor: 'black',
          width: 150,
          height: 150,
          marginVertical: 25,
          backgroundColor: val.color}} >
              <Text  style={{fontFamily: 'PTSerif-Regular', fontSize: 30}}>
                {val.name}
              </Text>
              <Text  style={{fontFamily: 'PTSerif-Regular', fontSize: 20}}>
                {val.place}
              </Text>
            </TouchableOpacity> )}   


      <TouchableOpacity onPress={() => navigation.navigate("New Device")} style = {styles.button}>
        <Text style = {styles.plus}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

function ConnectionScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{fontFamily: 'PTSerif-Italic'}}>Connection!</Text>
    </View>
  );
}


function ModalScreen({ navigation, route }) {
  
  const [state, setState] = React.useState([])

  const handlePress = () => {
    ColorPicker.showColorPicker(
      { supportsAlpha: true, initialColor: 'cyan' },
      (color) => {
        //console.log(color);
        //setColor(color);
        setState({...state, color: color})
      }
    );
  };

  const save = async () => {
    await storeData([state]);
    //navigation.navigate('Devices', {deviceData: [state]});
    navigation.navigate('Devices', {deviceData: await getData()});
    
    
  }

  
  return (
    <View style={styles.modal}>
      <TextInput style = {styles.input} placeholder='Name' value = {state.name} onChangeText={(name) => setState({...state, name})}/>
      <TextInput style = {styles.input} placeholder='Place' value = {state.place} onChangeText={(place) => setState({...state, place})}/>
      <TextInput style = {styles.input} placeholder='Command' value = {state.command} onChangeText={(command) => setState({...state,command})}/>
      <Text style= {{fontFamily: 'PTSerif-Bold', fontSize: 30}}>Color</Text>
      
      <TouchableOpacity style={{
        width: 300,
        height: 150,
        borderWidth: 1,
        backgroundColor: state.color
      }} onPress={handlePress}></TouchableOpacity>
      <View style={styles.horizontalView}>
        <TouchableOpacity style={styles.button1} onPress={() => navigation.goBack()}><Text>Cancel</Text></TouchableOpacity>
        <TouchableOpacity style={styles.button2} onPress={save}><Text>Save</Text></TouchableOpacity>
      </View>
    </View>
  );
}


const storeData = async (value) => {
  try {
    console.log(value)
    var existingValues = await getData();
    var jsonValue = JSON.stringify(value)
    if(existingValues != null){
      existingValues.push(value[0])
      jsonValue = JSON.stringify(existingValues)
      console.log(existingValues)
    }
    
    await AsyncStorage.setItem('key', jsonValue)
  } catch (e) {
    // saving error
  }
}

const getData = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('key')
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch(e) {
    // error reading value
  }
}


const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Devices" component={Home} options={{headerShown: false}}/>
        <Tab.Screen name="Connection" component={ConnectionScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}




const styles = StyleSheet.create ({ 
  items: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginHorizontal: 30,
    marginVertical: 30

  },
  button: {
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    width: 150,
    height: 150,
    marginVertical: 25,
  },
  plus: {
    fontFamily: 'PTSerif-Bold',
    fontSize: 100,
  },
  modal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
    marginHorizontal: 20,
    marginVertical: 20,
  },
  input: {
    height: 40,
    width: 300,
    margin: 12, 
    borderWidth: 1,
    padding: 10
  },
  horizontalView: {
    flexDirection: 'row',
  },
  button1: {
    alignItems: 'center',
    width: 135,
    height: 50,
    borderWidth: 1, 
    marginTop: 30,
    justifyContent: 'center',
    marginRight: 30
  },
  button2: {
    alignItems: 'center',
    width: 135,
    height: 50,
    borderWidth: 1, 
    marginTop: 30,
    justifyContent: 'center'
  }

})