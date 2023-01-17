import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import _Button from '../../components/control/button';
import _Text from '../../components/control/text';
import { config, env } from '../../helper';
import { Color, FontSize, LoginStyle, Style } from '../../style';
import _TextInput from '../control/text-input';

const ActivateEmailSent = (props: any, {navigation}:any) => {
  const [disabled,setDisabled] = useState(false);
  const [counter,setCounter] = useState('');
  const [message,setMessage] = useState('');
  const [sentMsg,setSentMsg] = useState('');

  useEffect(() => {
      if (props.resendVerify)
          setSentMsg("An unverified email address is already associated with this account. Another activation link has been sent to the address. You must activate your account before you can continue.");
      else
          setSentMsg("An email with a link to activate your account has been sent to you.");
  }, [props.resendVerify]);

  const btnTimer = (disabled: boolean, time: number) => {
    let interval: any;
    if (disabled) {
      interval = setInterval(() => {
            if (Date.now() - time >= 60000) {
                setDisabled(false);
                setCounter("");
                clearInterval(interval);
            }
            else {
                setCounter("Try again in " + Math.abs(Math.round(60 - ((Date.now() - time) / 1000))) + " seconds");
                setDisabled(true);
            }
        }, 1000);
        props.setStopInterval(interval);
    }
    else {
        if (interval)
            clearInterval(interval);
        setCounter("");
        setDisabled(false);
    }
    return interval;
  }

  const disableBtn = (disable: boolean) => {
      setDisabled(disable);
      return btnTimer(disable, disable ? Date.now() : 0);
  }

  const goBackRegister = () => {
    clearInterval(props.stopInterval);
    disableBtn(false);
    setMessage('');
    props.registerPressed();
  }

  const doResendEmail = async () => 
  {
      if (disabled)
        return;

      let interval = disableBtn(true);
      setMessage("");
      if (!props.email) {
          setMessage("You must use a valid email address");
          clearInterval(interval);
          disableBtn(false);
          return;
      }

      let obj = {email:props.email};
      let js = JSON.stringify(obj);

      try
      {    
          await fetch(`${env.URL}/auth/sendConfirmationEmail`,
              {method:'POST',body:js,headers:{'Content-Type': 'application/json'}}).then(async ret => {
                  let res = JSON.parse(await ret.text());
                  if(res.error)
                  {
                      // if (res.error === "Invalid Email") {
                      //     setMessage("You must use a valid email address");
                      //     clearInterval(interval);
                      // }
                      // else
                      setMessage(res.error);
                      disableBtn(false);
                  }
              });
      }
      catch(e)
      {
          disableBtn(false);
          clearInterval(interval);
          setMessage("An error occurred while attempting to send a password reset email!");
          return;
      }    
  };
  
  return (
    <View
    style={props.style}>
      <_Text
      style={[Style.textHuge, Style.boldFont]}
      >
        Activation Email Sent
      </_Text>
      <_Text
      style={[Style.textDefaultTertiary, LoginStyle.actionText]}
      >
        Check your email to verify your account
      </_Text>
      <_Text
      style={LoginStyle.sentText}
      >
        {sentMsg}
      </_Text>
      <View
      style={LoginStyle.mainContent}>
        <_Text
        style={[Style.textSmallSecondary, LoginStyle.resendText]}
        >
            Still haven't received an email yet?
        </_Text>
        <View
        style={Style.alignRight}
        >
            <_Button
            style={[props.btnStyle(disabled), {marginBottom:5}]}
            onPress={() => doResendEmail()}
            disabled={disabled}
            >
            Resend Email
            </_Button>
        </View>
        <_Text
        style={[Style.textTinyTertiary, LoginStyle.timerText]}
        >
          {counter}
        </_Text>
        <_Text
        style={LoginStyle.errorMessage}
        >
            {message}
        </_Text>
      </View>
        <View
        style={LoginStyle.previousPageText}
        >
        <_Text
        style={Style.textDefaultTertiary}
        >
          Go back to
        </_Text>
        <_Text
        style={[Style.textDefaultDefault, Style.boldFont, LoginStyle.previousPageAction]}
        onPress={() => goBackRegister()}
        >register</_Text>
      </View>
    </View>
  );
};

export default ActivateEmailSent;