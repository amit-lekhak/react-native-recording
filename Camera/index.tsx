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
import PagerView from 'react-native-pager-view';
// import { ProcessingManager } from 'react-native-video-processing';
import Gallery from '../Gallery';
import { createThumbnail } from 'react-native-create-thumbnail';
import { RNFFmpeg } from 'react-native-ffmpeg';

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
        maxDuration: 5,
        mute: false,
        quality: '288p',
      });

      setRecording(false);
      setProcessing(true);

      let uri = video?.uri;

      if (uri) {
        const compressedUri = await compressVideo(uri);

        if (compressedUri) {
          uri = compressedUri.path;
        }

        const response = await saveRecording(uri);
        response && setSelectedVideoUri(response);
      }

      // setProcessing(false);
    } catch (error) {
      console.log(error);
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

  const loadVideosHandler = () => {
    if (recording) return;
    if (processing) return;

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

  async function compressVideo(path: string) {
    // console.log(`begin compressing ${path}`);
    // const origin = await ProcessingManager.getVideoInfo(path);
    // const result = await ProcessingManager.compress(path, {
    //   width: origin.size && origin.size.width / 1,
    //   height: origin.size && origin.size.height / 1,
    //   bitrateMultiplier: 7,
    //   minimumBitrate: 300000,
    // });

    // RNFFmpeg.executeWithArguments([
    //   '-i',
    //   path,
    //   '-c:v',
    //   'mpeg4',
    //   `file:///storage/emulated/0/DCIM/Camera/VID_${Date.now()}.mp4`,
    // ]).then(result => console.log(`FFmpeg process exited with rc=${result}.`));

    // const thumbnail = await getThumbnail(result.source);

    return { path: path, thumbnail: '' };
  }

  const getThumbnail = (path: string) => {
    return createThumbnail({
      url: path,
      timeStamp: 3000,
    })
      .then(response => response.path)
      .catch(err => console.log({ err }));
  };

  const playVideoHandler = () => {
    setEnableScroll(prev => !prev);
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
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

  pagerView: {
    flex: 1,
  },
});

export default Camera;
