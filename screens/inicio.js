import {View, Text,StyleSheet } from 'react-native';
import React from 'react';

export default function Inicio() {
    return (    
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Bienvenido</Text>
        </View>
    );
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