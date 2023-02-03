import { Pressable, View, StyleSheet, Image, Text, TouchableHighlight, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import _Text from '../control/text';
import _Group from '../control/group';
import { Color, Style } from '../../style';
import _Button from '../control/button';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { useEffect, useState } from 'react';

const ListingCard = (props: any) => {

  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    setIsFavorite(true) // props.item.isFavorite
  }, [props.item.isFavorite]);

  const styles = StyleSheet.create({
    container: {
      padding: 10,
      backgroundColor: Color(props.isDarkMode).white,
      borderRadius: 10,
      marginBottom: 40,
      shadowColor: '#000',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
    },
    image: {
      width: '100%',
      height: 200,
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    },
    header: {
      fontSize: 22,
      fontWeight: 'bold',
      marginTop: 10,
    },
    subheader: {
      fontSize: 16,
      color: 'gray',
      marginTop: 5,
    },
    description: {
      fontSize: 16,
      marginTop: 10,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      marginTop: 10,
    },
    petsAllowed: {
      fontSize: 16,
      marginTop: 10,
    },
    viewListingButton: {
      backgroundColor: Color(props.isDarkMode).black,
      padding: 10,
      borderRadius: 5,
      marginTop: 20,
      alignSelf: 'flex-end',
    },
    viewListingButtonText: {
      color: Color(props.isDarkMode).white,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    favorite: {
      position: 'absolute',
      top: 10,
      right: 10,
    },
    icon: {
      ...Platform.select({
        web:{
          outlineStyle: 'none'
        }
      }),
      position: 'absolute',
    },
    iconBorder: {
      ...Platform.select({
        web:{
          outlineStyle: 'none'
        }
      }),
    }
  });

  const viewListing = () => {
    props.setCurrentListing(props.item)
  };

  const sendFavorite = () => {
    setIsFavorite(!isFavorite)
  };

  const favoriteColor = () => {
    return isFavorite ? Color(props.isDarkMode).gold : Color(props.isDarkMode).actualWhite;
  }

  return (
    <View style={styles.container}>
      <View>
      <Image source={{ uri: props.item.images[0] }} style={styles.image} />
      <Pressable style = {styles.favorite} onPress = {() => sendFavorite()}>
        <FontAwesomeIcon  style = {styles.icon} icon='star' size={30} color={favoriteColor()}/>
        <FontAwesomeIcon  style = {styles.iconBorder} icon='star' size={32} color='#000000b3'/>
      </Pressable>
      </View>
      <_Text isDarkMode={props.isDarkMode} style={styles.header}>{props.item.name}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.subheader}>{props.item.city}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.description}>{props.item.description}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.price}>{props.item.price}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.petsAllowed}>
        Pets Allowed: {props.item.petsAllowed ? 'Yes' : 'No'}
      </_Text>
      <_Button onPress = {() => viewListing()} style = {Style(props.isDarkMode).buttonGold}> View Listing </_Button> 
    </View>
  );
};

export default ListingCard;
