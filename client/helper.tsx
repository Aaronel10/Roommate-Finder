import { library } from "@fortawesome/fontawesome-svg-core";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StackNavigationProp } from "@react-navigation/stack";
import { createContext } from "react";
import { Dimensions } from "react-native";
import { Content } from "./style";
import * as DeepLinking from 'expo-linking';
import { faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe, faSignOut, faUserPlus, faArrowLeft, faRefresh, faStar } from '@fortawesome/free-solid-svg-icons'
import AsyncStorage from "@react-native-async-storage/async-storage";
library.add(faRefresh, faArrowLeft, faUserPlus, faCheck, faXmark, faMessage, faCaretDown, faUser, faPoll, faHouseFlag, faCheckDouble, faEdit, faGlobe, faSignOut, faStar)

export const Stack = createNativeStackNavigator<Page>();

export const isMobile = () => {
    return Dimensions.get('window').width < Content.mobileWidth;
}

const prod = {
    URL: "https://roomfin.xyz"
};

const dev = {
   URL: "http://localhost:8080"
};
export const env = process.env.NODE_ENV === "development" ? dev : prod;

export const validateEmail = (email: string) => {
    return String(email)
    .toLowerCase()
    .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@knights.ucf.edu$/
    );
};

export const acceptableSymbols = () => {
    return '(!, @, #, $, %, &, ?)';
}

export const includesSymbol = (text: string) => {
    return /[!@#$%&?]/.test(text);
};

export const isAtLeastEightChars = (text: string) => {
    return text.length >= 8;
};

export const includesUpperContains = (text: string) => {
    return /[A-Z]/.test(text);    
}

export const textMatches = (text1: string, text2: string) => {
    return text1 === text2 && text1.length > 0 && text2.length > 0;
}

export const Context = createContext({} as any); 
export type navProp = StackNavigationProp<Page>;
export const NavTo = {
  Home: 'Home' as never,
  Login: 'Login' as never,
  ConfirmEmail: 'Login' as never,
  Account: 'Account' as never,
  Profile: 'Profile' as never,
  Survey: 'Survey' as never,
  Search: 'Search' as never,
  Listings: 'Listings' as never,
  Messages: 'Messages' as never,
  Logout: 'Logout' as never,
}

export type Page = {
  Home: undefined;
  Login: undefined;
  Account: undefined;
  Profile: undefined;
  Survey: undefined;
  Search: undefined;
  Listings: undefined;
  Messages: undefined;
  Logout: undefined;
}

export const config = {
  screens: {
    Home: '/',
    Login: '/login',
    Account: '/account',
    Profile: '/profile',
    Survey: '/survey',
    Matches: '/matches',
    Search: '/search',
    Listings: '/listings',
    Messages: '/messages',
    Logout: '/logout',
  },
};

const prefix = DeepLinking.createURL('/');
export const linking = {
  prefixes: [prefix],
  config,
};

export const enum AccountScreenType {
  none, info, about, survey
}

export const getLocalStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_data');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  }
  catch {
    return null;
  }
}

export const setLocalStorage = async (data: Object | null) => {
  try {
    const jsonValue = !data ? '' : JSON.stringify(data);
    await AsyncStorage.setItem('@user_data', jsonValue);
    return true;
  }
  catch {
    return false;
  }
}

export const isLoggedIn = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('@user_data');
    const data = jsonValue != null ? JSON.parse(jsonValue) : null;
    if (data) {
      return data.refreshToken ? true : false;
    }
    else {
      return false;
    }
  }
  catch {
    return false;
  }
}

export const authTokenHeader = async () => {
  let data = await getLocalStorage();
  if (data) {
    return `token ${data.accessToken}`;
  }
  return '';
}