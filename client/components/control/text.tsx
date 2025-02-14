import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { navProp } from '../../helper';
import { Color, Style } from '../../style';

const _Text = (props: any) => {
  /* Props:
  style: Add custom styles
  error: Set true/false if error text
  errorMessage: if no error message is provided, the default is "is required" else a custom message is used
  navigate: Navigate to a location inb the stack using NavTo
  onPress: Trigger your function
  children: Uses the value from the nested text as the text value
  required: Marks the text to end in an * mark
  containerStyle: Give the outside container a custom style
  */
  const navigation = useNavigation<navProp>();
  const style = () => {
    var style = [];
    style.push(Style(props.isDarkMode).textDefault);
    if (props.style)
      style.push(props.style);
    if (props.error)
      style.push(styles.error);

    return style;
  }

  const press = () => {
    if (props.navigate) {
        navigation.navigate(props.navigate);
    }
    else if (props.onPress) {
        props.onPress();
    }
  }

  const errorMessage = () => {
    if (!props.errorMessage) {
      return "is required"
    }
    else {
      return props.errorMessage;
    }
  }

  const styles = StyleSheet.create({
    text: {
        gap: 5,
        display: 'flex',
        flexDirection: 'row'
    },
    error: {
      color: Color(props.isDarkMode).danger
    }
  });
  

  return (
    <View
    style={props.containerStyle}>
      {(props.onPress != null || props.navigate) ?
      <Pressable
      onPress={() => press()}
      >
        <View
        style={styles.text}
        >
          <Text
          numberOfLines={props.numberOfLines}
          onPress={() => press()}
          style={style()}>
            {props.children}
          </Text>
          {props.error ?
          <Text
          style={style()}
          >
            {errorMessage()}
          </Text>
          : null
          }
          {props.required ?
          <Text
          onPress={() => press()}
          style={style()}>
            *
          </Text>
          : null
          }
        </View>
      </Pressable>
      :
      <View
      style={[styles.text, props.innerContainerStyle]}
      >
        <Text
          numberOfLines={props.numberOfLines}
          style={style()}
        >
          {props.children}
        </Text>
        {props.error ?
        <Text
        style={style()}
        >
          {errorMessage()}
        </Text>
        : null
        }
        {props.required ?
          <Text
          style={style()}>
            *
          </Text>
          : null
          }
      </View>
      }
    </View>
  );
};

export default _Text;