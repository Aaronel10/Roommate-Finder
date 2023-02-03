import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import _Text from '../control/text';
import { Color, Style } from '../../style';
import { env } from '../../helper';

const CreateListing = (props: any) => {
  const [formData, setFormData] = useState({
    name: '',
    images: [],
    city: '',
    housing_type: '',
    description: '',
    price: 0,
    petsAllowed: false,
    address: '',
  });

  const handleChange = (key: string, value: any) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${env.URL}/listings/all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error(err);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      backgroundColor: Color(props.isDarkMode).white,
    },
    input: {
      height: 50,
      marginVertical: 8,
      padding: 8,
      backgroundColor: Color(props.isDarkMode).grey,
      borderRadius: 8,
      fontSize: 16,
    },
    button: {
      backgroundColor: Color(props.isDarkMode).gold,
      height: 50,
      marginTop: 16,
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 16,
    },
    title: {
        fontSize: 16,
        marginVertical: 8,
      },
  });
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Name</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the name"
        value={formData.name}
        onChangeText={(text) => handleChange('name', text)}
      />
  
      <Text style={styles.title}>City</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the city"
        value={formData.city}
        onChangeText={(text) => handleChange('city', text)}
      />
  
      <Text style={styles.title}>Housing Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the housing type"
        value={formData.housing_type}
        onChangeText={(text) => handleChange('housing_type', text)}
      />
  
      <Text style={styles.title}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the description"
        value={formData.description}
        onChangeText={(text) => handleChange('description', text)}
      />
  
      <Text style={styles.title}>Price</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the price"
        value={formData.price.toString()}
        onChangeText={(text) => handleChange('price', parseInt(text))}
      />
  
      <Text style={styles.title}>Address (optional)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the address"
        value={formData.address}
        onChangeText={(text) => handleChange('address', text)}
      />
  
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

export default CreateListing;