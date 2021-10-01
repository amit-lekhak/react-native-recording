import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import Video from 'react-native-video';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';

const Camera = (): JSX.Element => {
  const cameraRef = useRef<null | RNCamera>(null);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [videos, setVideos] = useState<PhotoIdentifier[]>([]);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>('');
  const [showControls, setShowControls] = useState(false);

  const videoRef = useRef<Video | null>(null);

  let currentIndex = 0;

  const startRecording = async () => {
    if (!isCameraReady) return;

    setRecording(true);

    try {
      const video = await cameraRef.current?.recordAsync({
        maxDuration: 5,
        mute: false,
        quality: '288p',
      });

      setRecording(false);
      setProcessing(true);

      if (video?.uri) {
        const response = await saveRecording(video.uri);
        response && setSelectedVideoUri(response);
      }

      setProcessing(false);
    } catch (error) {
      console.log(error);
    }
  };

  const stopRecording = () => {
    cameraRef.current?.stopRecording();
  };

  const flipHandler = () => {
    if (recording) return;

    cameraType === RNCamera.Constants.Type.front
      ? setCameraType(RNCamera.Constants.Type.back)
      : setCameraType(RNCamera.Constants.Type.front);
  };

  const loadVideosHandler = async () => {
    if (recording) return;

    handleButtonPress();
    // const albumsList = await CameraRoll.getAlbums({ assetType: 'Videos' });
    // console.log(albumsList);
  };

  const handleButtonPress = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Videos',
    })
      .then(r => {
        setVideos(r.edges);
        setShowGallery(true);
      })
      .catch(err => {
        //Error Loading Images
        console.log(err);
      });
  };

  const selectVideoHandler = () => {
    const uri = videos[currentIndex].node.image.uri;
    uri && setSelectedVideoUri(uri);
    setShowGallery(false);
  };

  const pageSelectedHandler = (e: PagerViewOnPageSelectedEvent) => {
    currentIndex = e.nativeEvent.position;
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

  const hasAndroidPermission = async () => {
    const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const saveRecording = async (videoUri: string) => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission())) {
      return;
    }

    return await CameraRoll.save(videoUri, { type: 'video', album: 'DCIM' });
  };

  console.log(selectedVideoUri);

  return (
    <View style={[styles.container]}>
      {!showGallery ? (
        <>
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
            {getButton(loadVideosHandler, 'VIEW')}
          </View>
        </>
      ) : (
        <>
          <PagerView onPageSelected={pageSelectedHandler} style={styles.pagerView} initialPage={0}>
            {videos.map((p, i) => {
              return (
                <View key={i}>
                  <Video
                    ref={videoRef}
                    poster='https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/English_Cocker_Spaniel_4.jpg/800px-English_Cocker_Spaniel_4.jpg'
                    controls={showControls}
                    onLoad={() => {
                      setShowControls(true);
                    }}
                    paused={true}
                    style={styles.video}
                    source={{ uri: p.node.image.uri }}
                  />
                </View>
              );
            })}
          </PagerView>
          <View style={[styles.bottomRow]}>{getButton(selectVideoHandler, 'SELECT')}</View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  pagerView: {
    flex: 1,
  },
});

export default Camera;
