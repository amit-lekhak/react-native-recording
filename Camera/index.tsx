import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, PermissionsAndroid, Platform, Text, TouchableOpacity, View } from 'react-native';

// packages
import { RNCamera } from 'react-native-camera';
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import PagerView from 'react-native-pager-view';
import Icon from 'react-native-vector-icons/Ionicons';

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [flashMode, setFlashMode] = useState(RNCamera.Constants.FlashMode.off);

  useEffect(() => {
    hasAndroidPermission('camera');
    hasAndroidPermission('audio');
  }, []);

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

  const toggleFlashHandler = () => {
    flashMode === RNCamera.Constants.FlashMode.off
      ? setFlashMode(RNCamera.Constants.FlashMode.torch)
      : setFlashMode(RNCamera.Constants.FlashMode.off);
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

  const getCameraOptionButton = (onpress: () => void, text: string, iconName: string): JSX.Element => {
    return (
      <TouchableOpacity onPress={onpress} style={styles.button}>
        <View style={{ alignItems: 'center' }}>
          <Icon name={iconName} style={styles.optionIcon} />
          <Text style={styles.textColor}>{text}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const getRecordingTypeButton = (onpress: () => void, text: string, isActive: boolean) => {
    return (
      <TouchableOpacity onPress={onpress} style={styles.button}>
        <Text style={isActive ? styles.textColor : styles.textInactive}>{text}</Text>
        {isActive && <View style={styles.dot} />}
      </TouchableOpacity>
    );
  };

  const hasAndroidPermission = async (type: string) => {
    let permission;

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

  let recordButton = (
    <TouchableOpacity onPress={startRecording}>
      <View style={styles.recordButton} />
    </TouchableOpacity>
  );

  if (recording) {
    recordButton = (
      <TouchableOpacity onPress={stopRecording}>
        <View style={[styles.recordButton, styles.stopButton]}>
          <View style={styles.stopIcon} />
        </View>
      </TouchableOpacity>
    );
  }

  if (processing) {
    recordButton = (
      <View style={[styles.recordButton, styles.stopButton]}>
        <ActivityIndicator color={'#F75555'} animating size={30} />
      </View>
    );
  }

  const galleryButton = (
    <TouchableOpacity onPress={loadVideosHandler} style={[styles.button, styles.galleryView]}>
      <Icon name={'images'} style={[styles.optionIcon, styles.galleryIcon]} />
    </TouchableOpacity>
  );

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
            flashMode={flashMode}
            onCameraReady={() => {
              setIsCameraReady(true);
            }}
          />
          <View style={[styles.bottomRow]}>
            {getRecordingTypeButton(() => console.log('clicked'), 'Video', activeIndex === 0)}
            {getRecordingTypeButton(() => console.log('clicked'), 'Audio only', activeIndex === 1)}
            {getRecordingTypeButton(() => console.log('clicked'), 'Text', activeIndex === 2)}
          </View>

          <View style={[styles.cameraOptions]}>
            {getCameraOptionButton(flipHandler, 'Flip', 'camera-reverse-outline')}
            {getCameraOptionButton(toggleFlashHandler, 'Flash', 'flash-outline')}
          </View>

          <View style={styles.playRecordOptions}>
            {recordButton}
            {galleryButton}
          </View>

          <View style={styles.closeIcon}>
            <TouchableOpacity onPress={() => console.log('close')}>
              <Icon name={'close'} style={styles.optionIcon} />
            </TouchableOpacity>
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
