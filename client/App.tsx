import { NavigationContainer, NavigationContainerRef, StackRouter, useFocusEffect, useLinkProps, useNavigation } from '@react-navigation/native';
import HomeScreen from './screens/home';
import { useFonts } from 'expo-font';
import Navigation from './components/navigation/navigation';
import React, { useEffect, useState } from 'react';
import { BackHandler, Dimensions, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import 'react-native-gesture-handler';
import AccountScreen from './screens/account';
import ProfileScreen from './screens/profile';
import SurveyScreen from './screens/survey';
import ListingsScreen from './screens/listings';
import MessagesScreen from './screens/messages';
import SearchScreen from './screens/search';
import FiltersScreen from './screens/filters';
import { Color, Content } from './style';
import { Context, env, getLocalStorage, isMobile, linking, NavTo, Page, setLocalStorage, Stack, isLoggedIn as isLoggedInHelper, navProp } from './helper';
import LogoutScreen from './screens/logout';
import LoginScreen from './screens/login';
import _Text from './components/control/text';
import * as DeepLinking from 'expo-linking';
import { Params } from '@fortawesome/fontawesome-svg-core';
import _Button from './components/control/button';
export const ThemeContext = React.createContext(null);
export const App = (props: any) => {
  const [navHeight,setNavHeight] = useState(0);
  const [navWidth,setNavWidth] = useState(0);
  const [containerStyle,setContainerStyle] = useState({});
  const [mobile,setMobile] = useState(false);
  const [adjustedPos,setAdjustedPos] = useState(0);
  const [accountView,setAccountView] = useState();
  const [isMatches,setIsMatches] = useState(false);
  const [ref,setRef] = useState(React.createRef<NavigationContainerRef<Page>>());
  const [isLoggedIn,setIsLoggedIn] = useState(false);
  const [isLoggingOut,setIsLoggingOut] = useState(false);
  const [accountAction,setAccountAction] = useState(false);
  const [init,setInit] = useState(false);
  const [initLink,setInitLink] = useState('');
  const [isSetup,setIsSetup] = useState(false);
  const [isLoaded,setIsLoaded] = useState(false);
  const [prompt,setPrompt] = useState(false);
  const [setupStep,setSetupStep] = useState('');
  const [scrollY,setScrollY] = useState(0);
  const [navSelector,setNavSelector] = useState('');
  const [verifiedDeepLink,setVerifiedDeepLink] = useState(false);
  const [isPasswordReset,setIsPasswordReset] = useState(false);
  const [pageVerified,setPageVerified] = useState(false);
  const [isBackPressed,setIsBackPressed] = useState(false);
  const [isDarkMode,setIsDarkMode] = useState(false);
  const [backCount,setBackCount] = useState(0);
  const [backTimer,setBackTimer] = useState(0);
  const [loginViewChanged,setLoginViewChanged] = useState('');
  const [loaded] = useFonts({
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Thin': require('./assets/fonts/Inter-Thin.ttf'),
  });
  useEffect(() => {
    //setIsDarkMode(true); // ja temp need to implement user defined dark mode
    setMobile(isMobile());
    const dimsChanged = Dimensions.addEventListener("change", (e) => setMobile(isMobile()));
    const back = BackHandler.addEventListener('hardwareBackPress', onBackPress);

    if (!isBackPressed) {
      if (!verifiedDeepLink && !pageVerified) {
        DeepLinking.getInitialURL().then(async (link: any) => {
          if (!initLink) {
            setInitLink(link);
            checkDeepLink(link);
          }
          else
            checkDeepLink(initLink);
        });
      }
      else if (pageVerified) {
        if (verifiedDeepLink)
          setVerifiedDeepLink(false);
        else {
          checkSetup();
        }
      }
      prepareStyle();   
      setIsLoaded(true);
    }
    else {
      setIsBackPressed(false);
    }
  
    return () => {
      back.remove();
      dimsChanged?.remove();
    }
  }, [navHeight, adjustedPos, prompt, navSelector, ref.current, backTimer, backCount]);
  
  if (!loaded) {
    return null;
  }

  const onBackPress = () => {
    setIsBackPressed(true);
    let current = getRouteName();
    let name = getPreviousRouteName();
    if (name) {
      if (current == NavTo.Login) {
        let view = getRouteView();
        if (!view) {
          BackHandler.exitApp();
        }
        else {
          ref?.current?.goBack();
          let uView = getRouteView();
          if (!uView) {
            uView = 'login'
          }
          setLoginViewChanged(uView); 
        }
        return true;
      }
      setNavSelector(name);
    }
    let time = new Date().getTime();
    if (backTimer == 0 || (time - backTimer) < 250) {
      if (backCount == 1) {
        ref.current?.navigate(NavTo.Logout);
        setBackCount(0);
        setBackTimer(0);
      }
      else {
        if (backTimer == 0) {
          setBackTimer(time);
        }
        setBackCount(backCount + 1);
      }
    }
    else {
      setBackCount(1);
      setBackTimer(time);
    }

    return false;
  };

  const getRouteName = () => {
    return ref.current?.getCurrentRoute()?.name;
  }

  const getRouteView = () => {
    let route = ref.current?.getCurrentRoute();
    if (route && route.params) {
      let params = route.params as never;
      if (params['view'])
        return params['view'];
    }
    return '';
  }

  const getPreviousRouteName = () => {
    let routes = ref.current?.getState()?.routes;
    if (routes) {
      if (routes.length > 2) {
        return routes[routes.length - 2].name;
      }
      else if (routes.length == 1) {
        return routes[0].name;
      }
    }
    return NavTo.Profile;
  }

  const logout = async () => {
    let hasError = false;
    try
    {   
        let user = await getLocalStorage();
        if (user && user.refreshToken) {
          let obj = {refreshToken:user.refreshToken};
          let js = JSON.stringify(obj);

          await fetch(`${env.URL}/auth/logout`,
          {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (!res.Error) {
                  await setLocalStorage(null);
                  setIsLoggingOut(true);
                  setIsLoggedIn(false);
                  setIsSetup(false);
              }
              else {
                hasError = true;
              }
          });
      }
    }
    catch(e)
    {
      // Couldn't log out
    } 
  }

  async function checkDeepLink(link: string) {
    if (ref && ref.current) {
      if (link && link.toLowerCase().includes('/auth')) {
        if (!isPasswordReset) {
          setIsPasswordReset(true);
          var cRoute = DeepLinking.parse(link);
          var path = cRoute.path?.substring(cRoute.path?.lastIndexOf('/') + 1);
          if (cRoute?.queryParams)
            cRoute.queryParams.path = path;
          await logout();
          if (!accountAction)
            setAccountAction(true);

          ref.current?.navigate(NavTo.Login, cRoute.queryParams as never);
          return;
        }
        else {
          setIsPasswordReset(false);
        }
      }
      else if (!verifiedDeepLink && !pageVerified) {
        setPageVerified(true);
        checkSetup(true);
      }
      setVerifiedDeepLink(true);
    }
  }

  function checkSetup(force: boolean = false) {
    if (force || pageVerified) {
      checkLoggedIn();
    } 
  }

  const navigateToSetupStep = (step: string) => {
      if (!step)
        step = "info";
      ref.current?.navigate(NavTo.Account, {view: step} as never);
  }

  async function checkLoggedIn() {
    if (!isLoggingOut) {
      let hasError = false;
      let data = await getLocalStorage();
      if (data) {
        let obj = {refreshToken:data.refreshToken, accessToken: data.accessToken};
        let js = JSON.stringify(obj);

        try
        {   
            await fetch(`${env.URL}/auth/checkAuth`,
            {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
              let res = JSON.parse(await ret.text());
              if (res.Error)
              {
                hasError = true;
              }
              else
              {
                let aToken;
                await fetch(`${env.URL}/auth/refreshToken`,
                {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                  let res = JSON.parse(await ret.text());
                  if (res.Error)
                  {
                    hasError = true;
                  }
                  else if (res.accessToken) {
                    aToken = res.accessToken;
                  }
                });

                if (aToken && res)
                  res.accessToken = aToken;
                await setLocalStorage(res);
                let l_isSetup = res.user.is_setup == true ? true : false;
                let l_setupStep = res.user.setup_step != null ? res.user.setup_step : '';
                setIsSetup(l_isSetup);
                setSetupStep(l_setupStep);
                setIsLoggedIn(true);
                if (!l_isSetup)
                  navigateToSetupStep(l_setupStep);
              }
            });
        }
        catch(e)
        {
          hasError = true;
        }   
      }
      else {
        hasError = true;
      }
      if (hasError) {
        if (ref && ref.current) {
          let route = ref.current.getCurrentRoute();
          if (route && route.name !== NavTo.Login) {
            await setLocalStorage(null);
            setIsLoggedIn(false);
            setIsSetup(false);
            ref.current.navigate(NavTo.Login, {timeout: 'yes'} as never);
              try {
                ref.current.resetRoot();
              }
              catch (e) {
                // Can't reset root
              }
            if (isLoggedIn)
              setIsLoggedIn(false);
          }
        }
      }
    }
    else
      setIsLoggingOut(false);
  }

  const getOffset = (scrollView: number) => {
    var window = Dimensions.get("window").width;
      if (scrollView < window) {
        setAdjustedPos((window - scrollView) / 2);
      }
      else {
        setAdjustedPos(0);
      }
  }

  const getScrollDims = (w: number, h: number) => {
    getOffset(w);
  }

  function prepareStyle() {
    var backgroundColor = Color(isDarkMode).background;
    var marginTop = Platform.OS === 'web' ? navHeight : 0;
    if (mobile) {
      backgroundColor = Color(isDarkMode).contentBackgroundSecondary;
    }

    var overflow = 'auto';
    if (prompt) {
      overflow = 'hidden';
    }

    var container = {
      backgroundColor: backgroundColor,
      marginTop: marginTop,
      overflowY: overflow
    }

    setContainerStyle(container);
  }

  const scroll = (e: any) => {
      getOffset(e.nativeEvent.contentSize.width);
      let offset = e.nativeEvent.contentOffset;
      let y = offset.y;
      if (y > 0)
        y -= navHeight;
      setScrollY(y)
  }

  const header = (props: any) => {
    if (Platform.OS !== 'web')
      return <Navigation
      {...props}
      screen={props.options.title} 
      setAccountView={setAccountView}
      height={navHeight}
      setHeight={setNavHeight}
      width={navWidth}
      setWidth={setNavWidth}
      setIsMatches={setIsMatches}
      mobile={mobile}
      isLoaded={isLoaded}
      isSetup={isSetup}
      isLoggedIn={isLoggedIn}
      navSelector={navSelector}
      setNavSelector={setNavSelector}
      isDarkMode={isDarkMode}
      />
    else
      return <View></View>;
  }

  const contentStyle = () => {
    var style = [];
    style.push(styles.contentStyle);
    var paddingTop = (getRouteName() === NavTo.Login) ? 0 : 10;
    var backgroundColor = Color(isDarkMode).background;
    var paddingLeft = 0;
    var paddingRight = 0;
    var translate = !mobile ? adjustedPos : 0;

    if (mobile) {
      backgroundColor = Color(isDarkMode).contentBackgroundSecondary;
      paddingLeft = 10;
      paddingRight = 10;

      // Don't add padding for message app on mobile
      if (getRouteName() == NavTo.Messages) {
        paddingLeft = 0;
        paddingRight = 0;
        paddingTop = 0;
      }
    }

    var content = {
      backgroundColor: backgroundColor,
      paddingLeft: paddingLeft,
      paddingRight: paddingRight,
      transform: [{translateX: translate}],
      paddingTop: paddingTop,
    }
    
    style.push(content);
    return style;
  }

  const scrollParentContainerStyle = () => {
    var style = [];
    style.push(styles.scrollParentContainer);
    return style;
  }

  const getMainStyle = () => {
    let style = [];
    style.push(containerStyle);
    style.push(styles.container);

    return style;
  }

  const checkKeyboardDismiss = () => {
    if (Platform.OS !== 'web')
      Keyboard.dismiss();
  }

  const MyTheme = () => {
    return {
      dark: Color(isDarkMode),
      colors: {
        background: isMobile() ? Color(isDarkMode).contentBackgroundSecondary : Color(isDarkMode).background
      },
    }
  };

  return (
    <NavigationContainer
    linking={linking}
    ref={ref}
    theme={MyTheme()}
    >
      <KeyboardAvoidingView
      behavior='padding'
      style={styles.avoidContainer}>
      <TouchableWithoutFeedback onPress={(e:any) => checkKeyboardDismiss()}>
        <ScrollView
        contentContainerStyle={scrollParentContainerStyle()}
        style={getMainStyle()}
        onScroll={(e) => scroll(e)}
        scrollEventThrottle={100}
        onContentSizeChange={(w, h) => getScrollDims(w, h)}
        keyboardShouldPersistTaps={'handled'}
        >
          <View
          style={styles.stack}
          >
            {/* <_Button isDarkMode={isDarkMode} onPress={() => setIsDarkMode(!isDarkMode)}>Switch</_Button> */}
            <StatusBar
              backgroundColor={Color(isDarkMode).statusBar}
              barStyle={isDarkMode ? "light-content" : "dark-content"}
            />
            <Stack.Navigator
            screenOptions={{header: (e: any) => header(e), contentStyle: contentStyle()}}
            initialRouteName={NavTo.Login}
            >
              <Stack.Screen
                  name={NavTo.Home}
                  options={{title: NavTo.Home, animation: 'none'}}
              >
              {(props: any) => <HomeScreen
              {...props}
              mobile={mobile}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Login}
                  options={{title: NavTo.Login, animation: 'none'}}
              >
                  {(props: any) => <LoginScreen
                  {...props}
                  mobile={mobile}
                  setIsLoggedIn={setIsLoggedIn}
                  setIsSetup={setIsSetup}
                  accountAction={accountAction}
                  setAccountAction={setAccountAction}
                  setNavSelector={setNavSelector}
                  setIsPasswordReset={setIsPasswordReset}
                  loginViewChanged={loginViewChanged}
                  setLoginViewChanged={setLoginViewChanged}
                  isDarkMode={isDarkMode}
                  />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Account}
                  options={{title: NavTo.Account, animation: 'none'}}
              >
              {(props: any) => <AccountScreen
              {...props}
              accountView={accountView}
              setAccountView={setAccountView}
              mobile={mobile}
              isSetup={isSetup}
              setupStep={setupStep}
              setPrompt={setPrompt}
              scrollY={scrollY}
              setIsLoggedIn={setIsLoggedIn}
              setIsSetup={setIsSetup}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Profile}
                  options={{title: NavTo.Profile, animation: 'none'}}
              >
              {(props: any) => <ProfileScreen
              {...props}
              mobile={mobile}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen> 
              <Stack.Screen
                  name={NavTo.Survey}
                  options={{title: NavTo.Survey, animation: 'none'}}
              >
              {(props: any) => <SurveyScreen
              {...props}
              mobile={mobile}
              setIsLoggedIn={setIsLoggedIn}
              setIsSetup={setIsSetup}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Search}
                  options={{title: NavTo.Search, animation: 'none'}}
              > 
              {(props: any) => <SearchScreen
              {...props}
              mobile={mobile}
              isMatches={isMatches}
              setIsMatches={setIsMatches}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Filters}
                  options={{ title: NavTo.Filters, animation: 'none' }}
                >
                  {(props: any) => <FiltersScreen
                    {...props}
                    mobile={mobile}
                    isMatches={isMatches}
                    setIsMatches={setIsMatches}
                    isDarkMode={isDarkMode}
                  />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Listings}
                  options={{title: NavTo.Listings, animation: 'none'}}
              >
              {(props: any) => <ListingsScreen
              {...props}
              mobile={mobile}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen>
              <Stack.Screen
                  name={NavTo.Messages}
                  options={{title: NavTo.Messages, animation: 'none'}}
              >
              {(props: any) => <MessagesScreen
              {...props}
              mobile={mobile}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen> 
              <Stack.Screen
                  name={NavTo.Logout}
                  options={{title: NavTo.Logout, animation: 'none'}}
              >
              {(props: any) => <LogoutScreen
              {...props}
              mobile={mobile}
              setIsLoggedIn={setIsLoggedIn}
              setIsSetup={setIsSetup}
              isDarkMode={isDarkMode}
              />}
              </Stack.Screen>
            </Stack.Navigator>
          </View>
        </ScrollView>
        </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
        {Platform.OS === 'web' ?
        <Navigation
        setAccountView={setAccountView}
        height={navHeight}
        setHeight={setNavHeight}
        width={navWidth}
        setWidth={setNavWidth}
        setIsMatches={setIsMatches}
        mobile={mobile}
        isLoaded={isLoaded}
        isSetup={isSetup}
        isLoggedIn={isLoggedIn}
        navSelector={navSelector}
        setNavSelector={setNavSelector}
        isDarkMode={isDarkMode}
        />
        
        : null} 
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  avoidContainer: {
    flex: 1,
  },
  stack: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    height: '100%',
  },
  scrollParentContainer: {
    height: '100%',
  },
  contentStyle: {
    maxWidth: Content.width,
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '100%',
    height: '100%',
  }
});

export default App;