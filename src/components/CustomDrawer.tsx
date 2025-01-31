import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
  ScrollView,
  ScrollViewProps,
} from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import Constants from 'expo-constants';
import * as WebBrowser from 'expo-web-browser';
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import {
  DrawerNavigationState,
  ParamListBase,
  useTheme,
} from "@react-navigation/native";

import { toast } from "@backpackapp-io/react-native-toast";
import {
  DrawerNavigationHelpers,
  DrawerDescriptorMap,
} from "@react-navigation/drawer/lib/typescript/src/types";

// Redux
import { RootState } from '../store';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../store/login';

import RPC from "../../ethersRPC"; // for using ethers.js

const CustomDrawer = (
  props:
    | (JSX.IntrinsicAttributes &
      ScrollViewProps & {
        children: React.ReactNode;
      } & React.RefAttributes<ScrollView>)
    | (JSX.IntrinsicAttributes & {
      state: DrawerNavigationState<ParamListBase>;
      navigation: DrawerNavigationHelpers;
      descriptors: DrawerDescriptorMap;
    })
) => {
  const { colors } = useTheme();
  const [balance, setBalance] = React.useState(0);
  const dispatch = useDispatch();
  const loggedin = useSelector((state: RootState) => state.login.loggedIn); 
  const isGuest = useSelector((state: RootState) => state.login.guest);
  
  const userType = loggedin && !isGuest ? `Member` : `Guest`;
  console.log(`data is ${userType} ${isGuest}`)

  const logout = () => {
    dispatch(setLogout(false));
    console.log(loggedin)
    toast.error("Logged Out", {
      width: 300,
    });
  };

  function shareApp(url: string) {
    WebBrowser.openBrowserAsync(url);
  }

  const getBalance = async (key: string) => {
    const id = toast.loading("Getting Balance...");
    await RPC.getBalance(key).then((bal) => {
      console.log(bal);
      setBalance(bal);
      // setBalance(parseInt(bal.toHexString(), 16))
      setTimeout(() => {
        toast.dismiss(id);
      }, 3000);
    });
  };

  // React.useEffect(() => {
  //   getBalance(key);
  // }, []);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={{ backgroundColor: colors.background }}
      >
        <ImageBackground
          source={{
            uri: "https://media3.giphy.com/avatars/kenaim/eQgeR40yR0o0.gif",
          }}
          style={{ padding: 20 }}
        >
          <Image
            source={{
              uri: "data:image/jpeg;base64,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",
            }}
            style={{
              height: 80,
              width: 80,
              borderRadius: 40,
              marginBottom: 10,
            }}
          />
          <Text
            style={{
              padding: 3,
              fontWeight: "bold",
              textShadowColor: "#fff",
              textShadowRadius: 10,
              color: "#fff",
              fontSize: 18,
              fontFamily: "Roboto-Medium",
              marginBottom: 5,
            }}
          >
            {userType === 'Member' ? "Hi Isabella!" : "No username"}
          </Text>
          <Text
            style={{
              padding: 3,
              fontWeight: "bold",
              textShadowColor: "#fff",
              textShadowRadius: 10,
              color: "#fff",
              fontSize: 18,
              fontFamily: "Roboto-Medium",
              marginBottom: 5,
            }}
          >
            {userType}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontWeight: "bold",
                textShadowColor: "#000",
                textShadowRadius: 10,
                color: "#fff",
                fontFamily: "Roboto-Regular",
                marginRight: 5,
              }}
            >
              {balance > 0 ? `${+Number(balance).toFixed(5)}` : 0}
            </Text>
            <FontAwesome5 name="coins" size={14} color="#FFF" />
          </View>
          <View style={{ flexDirection: "row", paddingTop: 15 }}>
            <Text
              style={{
                fontWeight: "bold",
                textShadowColor: "#000",
                textShadowRadius: 10,
                textShadowOffset: { width: 0.7, height: 1 },
                color: "#fff",
                fontFamily: "Roboto-Regular",
                marginRight: 5,
              }}
            >
              0
            </Text>
            <FontAwesome5 name="wallet" size={14} color="#FFF" />
          </View>
        </ImageBackground>
        <View style={{ flex: 1, backgroundColor: "#fff", paddingTop: 10 }}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View style={{ padding: 20, borderTopWidth: 1, borderTopColor: "#ccc" }}>
        <TouchableOpacity onPress={() => { shareApp(Constants.expoConfig?.githubUrl) }} style={{ paddingVertical: 15 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="share-social-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Roboto-Medium",
                marginLeft: 5,
              }}
            >
              Tell a Friend
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            return logout();
          }}
          style={{ paddingVertical: 15 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="exit-outline" size={22} />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Roboto-Medium",
                marginLeft: 5,
              }}
            >
              Sign Out
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default CustomDrawer;
