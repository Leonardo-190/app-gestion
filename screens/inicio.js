import {view, text} from 'react-native';
import React from 'react';

export default function Inicio() {
    return (    
        <view style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <text>Bienvenido</text>
        </view>
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