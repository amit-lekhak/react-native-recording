import React, { useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { RNCamera } from 'react-native-camera';

const Camera = (): JSX.Element => {
  const cameraRef = useRef<null | RNCamera>(null);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const startRecording = async () => {
    if (!isCameraReady) return;

    setRecording(true);

    try {
      const data = await cameraRef.current?.recordAsync({
        maxDuration: 5,
        mute: false,
        quality: '288p',
      });

      console.log(data?.uri);

      setRecording(false);
      setProcessing(true);

      setTimeout(() => {
        setProcessing(false);
      }, 1000);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = async () => {
    await cameraRef.current?.stopRecording();
  };

  const flipHandler = () => {
    if (recording) return;

    cameraType === RNCamera.Constants.Type.front
      ? setCameraType(RNCamera.Constants.Type.back)
      : setCameraType(RNCamera.Constants.Type.front);
  };

  const getButton = (onPress: () => void, text: string) => {
    return (
      <TouchableOpacity onPress={onPress} style={styles.capture}>
        <Text style={styles.textColor}> {text} </Text>
      </TouchableOpacity>
    );
  };

  let button = getButton(startRecording, 'RECORD');

  if (recording) {
    button = getButton(stopRecording, 'STOP');
  }

  if (processing) {
    button = (
      <View style={styles.capture}>
        <ActivityIndicator color={'#ff0000'} animating size={18} />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <RNCamera
        style={{ flex: 1 }}
        ref={cameraRef}
        type={cameraType}
        onCameraReady={() => {
          setIsCameraReady(true);
        }}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
      />
      <View style={[styles.bottomRow]}>
        {button}
        {getButton(flipHandler, 'FLIP')}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
  capture: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    margin: 20,
    borderWidth: 2,
    padding: 15,
  },
  textColor: {
    color: '#ff0000',
    fontSize: 14,
  },
});

export default Camera;
