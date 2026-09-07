import React, { StyleSheet, TextInput, TextInputProps } from "react-native";


export default function CustomInput(props: TextInputProps) {
    return (
        <TextInput
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...props}
        />
    );
}

const styles = StyleSheet.create({
    input: {
       backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 15,
        color: '#1F2937' 
    }
});