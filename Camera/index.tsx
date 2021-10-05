import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native';

// packages
import { RNCamera } from 'react-native-camera';
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import PagerView from 'react-native-pager-view';

// styles
import styles from './styles';

// components
import Gallery from '../Gallery';
import Upload from '../Upload';

const Camera = (): JSX.Element => {
  const cameraRef = useRef<null | RNCamera>(null);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [videos, setVideos] = useState<PhotoIdentifier[]>([]);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>('');

  const [enableScroll, setEnableScroll] = useState(true);

  const startRecording = async () => {
    if (!isCameraReady) return;

    setRecording(true);

    try {
      const video = await cameraRef.current?.recordAsync({
        maxDuration: 30,
        mute: false,
        quality: '480p',
      });

      setRecording(false);
      setProcessing(true);

      if (video?.uri) {
        const response = await saveRecording(video.uri);
        response && setSelectedVideoUri(response);
      }
    } catch (error) {
      console.log(error);
      setRecording(false);
    } finally {
      setProcessing(false);
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
    if (processing) return;

    if (Platform.OS === 'android' && !(await hasAndroidPermission('read'))) {
      return;
    }
    getVideosLocally();

    // const albumsList = await CameraRoll.getAlbums({ assetType: 'Videos' });
    // console.log(albumsList);
  };

  const getVideosLocally = () => {
    setVideos([]);

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

  const selectVideoHandler = (uri: string) => {
    uri && setSelectedVideoUri(uri);
    setShowGallery(false);
    setEnableScroll(true);
  };

  const getButton = (onPress: () => void, text: string): JSX.Element => {
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

  const hasAndroidPermission = async (type: string) => {
    let permission;
    // if (type === 'read') {
    //   permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
    // } else {
    //   permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
    // }

    switch (type) {
      case 'read':
        permission = PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE;
        break;

      case 'write':
        permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;
        break;

      case 'camera':
        permission = PermissionsAndroid.PERMISSIONS.CAMERA;
        break;

      case 'audio':
        permission = PermissionsAndroid.PERMISSIONS.RECORD_AUDIO;
        break;

      default:
        return false;
    }

    const hasPermission = await PermissionsAndroid.check(permission);
    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(permission);
    return status === 'granted';
  };

  const saveRecording = async (videoUri: string) => {
    if (Platform.OS === 'android' && !(await hasAndroidPermission('write'))) {
      return;
    }

    return await CameraRoll.save(videoUri, { type: 'video' });
  };

  const playVideoHandler = () => {
    setEnableScroll(prev => !prev);
  };

  console.log(selectedVideoUri);

  useEffect(() => {
    hasAndroidPermission('camera');
    hasAndroidPermission('audio');
  }, []);

  return (
    <View style={[styles.container]}>
      {selectedVideoUri && selectedVideoUri?.length !== 0 ? (
        <Upload uri={selectedVideoUri} />
      ) : !showGallery ? (
        <>
          <RNCamera
            style={{ flex: 1 }}
            ref={cameraRef}
            type={cameraType}
            onCameraReady={() => {
              setIsCameraReady(true);
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
          <PagerView scrollEnabled={enableScroll} style={styles.pagerView} initialPage={0}>
            {videos.map((vid, i) => {
              return (
                <View key={i}>
                  <Gallery
                    handleScroll={playVideoHandler}
                    getButton={getButton}
                    source={vid.node.image.uri}
                    selectVideoHandler={selectVideoHandler}
                  />
                </View>
              );
            })}
          </PagerView>
        </>
      )}
    </View>
  );
};

export default Camera;
