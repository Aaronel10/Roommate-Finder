import { useNavigation } from '@react-navigation/native';
import { Image, StyleSheet, Text, View  } from 'react-native';
import { Color, Style } from '../../style';
import _Button from '../control/button';
import _Text from '../control/text';

const ListingView = (props: any) => {

  const onClose = () => {
    props.setCurrentListing(null)
  };

  const styles = StyleSheet.create({
    container: {
      padding: 20,
      backgroundColor: Color(props.isDarkMode).black,
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
  });

  return (
    <View>
      <Image source={{ uri: props.currentListing.images[0] }} style={styles.image} />
      <_Text isDarkMode={props.isDarkMode} style={styles.header}>{props.currentListing.name}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.subheader}>{props.currentListing.city}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.description}>{props.currentListing.description}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.price}>{props.currentListing.price}</_Text>
      <_Text isDarkMode={props.isDarkMode} style={styles.petsAllowed}>
        Pets Allowed: {props.currentListing.petsAllowed ? 'Yes' : 'No'}
      </_Text>
      <_Button onPress = {() => onClose()} style = {Style(props.isDarkMode).buttonDanger}>Close</_Button>
    </View>
  );
};

export default ListingView;
