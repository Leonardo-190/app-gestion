import { View, Text,StyleSheet } from 'react-native'
import React from 'react'

export default function Ajustes() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Próximamente</Text>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,                
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
}); 