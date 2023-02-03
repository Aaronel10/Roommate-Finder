import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableHighlight, Platform } from 'react-native';
import FavoriteListings from '../listings/favorite-listings';
import CreateListing from '../listings/create-listing';
import ListingsScreen, { Listings_Screen } from '../../screens/listings';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faSearch, faStar, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Color, Radius } from '../../style';

const BottomNavbar = (props: any) => {
  const [isListingScreenOpen, setIsListingScreenOpen] = React.useState(false);

  useEffect(() => {
  }, [props.currentScreen]);

  const onSearch = () => {
    props.setCurrentScreen(Listings_Screen.all)
    setIsListingScreenOpen(!isListingScreenOpen);
  }

  const onFavorite = () => {
    props.setCurrentScreen(Listings_Screen.favorites)
    setIsListingScreenOpen(!isListingScreenOpen)
  }

  const onCreate = () => {
    props.setCurrentScreen(Listings_Screen.create)
    setIsListingScreenOpen(!isListingScreenOpen)
  }

  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 5,
      backgroundColor: Color(props.isDarkMode).contentBackgroundSecondary,
      borderTopWidth: 1,
      borderTopColor: Color(props.isDarkMode).separator,
      
    },
    button: {
      alignItems: 'center',
      padding: 10,
      borderRadius: Radius.default,
      width: '33%',
    },
    icon: {
      ...Platform.select({
        web:{
          outlineStyle: 'none'
        }
      })
    }
  });

  return (
    <View style={styles.container}>
      
      <TouchableHighlight 
        onPress={() => {
          onSearch()
        }} 
        underlayColor = {Color(props.isDarkMode).contentDialogBackground} style={styles.button}>
        <FontAwesomeIcon style = {styles.icon} icon={faSearch} size={24} color={props.currentScreen === Listings_Screen.all ? Color(props.isDarkMode).gold : Color(props.isDarkMode).black} />
      </TouchableHighlight>
      <TouchableHighlight underlayColor = {Color(props.isDarkMode).contentDialogBackground} onPress={() => onFavorite()} style={styles.button}>
        <FontAwesomeIcon style = {styles.icon} icon={faStar} size={24} color={props.currentScreen === Listings_Screen.favorites ? Color(props.isDarkMode).gold : Color(props.isDarkMode).black} />
      </TouchableHighlight>
      <TouchableHighlight underlayColor = {Color(props.isDarkMode).contentDialogBackground} onPress={() => onCreate()} style={styles.button}>
        <FontAwesomeIcon style = {styles.icon} icon={faPlusCircle} size={24} color={props.currentScreen === Listings_Screen.create ? Color(props.isDarkMode).gold : Color(props.isDarkMode).black} />
      </TouchableHighlight>
    </View>
  );
};

export default BottomNavbar;
