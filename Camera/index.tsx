import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { RNCamera } from 'react-native-camera';
import CameraRoll, { PhotoIdentifier } from '@react-native-community/cameraroll';
import PagerView, { PagerViewOnPageSelectedEvent } from 'react-native-pager-view';
import { ProcessingManager, VideoPlayer } from 'react-native-video-processing';
import Video from 'react-native-video';

const Camera = (): JSX.Element => {
  const cameraRef = useRef<null | RNCamera>(null);
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [cameraType, setCameraType] = useState(RNCamera.Constants.Type.front);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [videos, setVideos] = useState<PhotoIdentifier[]>([]);
  const [selectedVideoUri, setSelectedVideoUri] = useState<string | undefined>('');
  const [thumbnails, setThumbnails] = useState<string[]>([]);

  const [playVideo, setPlayVideo] = useState(false);
  const [enableScroll, setEnableScroll] = useState(true);
  const videoRef = useRef<VideoPlayer | null>(null);

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
        const compressedUri = await compressVideo(video.uri);

        if (compressedUri) {
          const response = await saveRecording(compressedUri.path);
          response && setSelectedVideoUri(response);
        }
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

  const loadVideosHandler = () => {
    if (recording) return;
    if (processing) return;

    getVideosLocally();

    // const albumsList = await CameraRoll.getAlbums({ assetType: 'Videos' });
    // console.log(albumsList);
  };

  const getVideosLocally = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Videos',
    })
      .then(r => {
        setVideos(r.edges);

        r.edges.map(async vid => {
          const thumbnail =
            'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/English_Cocker_Spaniel_4.jpg/800px-English_Cocker_Spaniel_4.jpg';

          // console.log('here');

          // thumbnail = await getThumbnail(vid.node.image.uri);
          // if (!thumbnail) {
          //   thumbnail =
          //     'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/English_Cocker_Spaniel_4.jpg/800px-English_Cocker_Spaniel_4.jpg';
          // }
          setThumbnails(arr => [...arr, thumbnail]);
        });

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
    setPlayVideo(false);
    setEnableScroll(true);
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

  async function compressVideo(path: string) {
    console.log(`begin compressing ${path}`);
    const origin = await ProcessingManager.getVideoInfo(path);
    const result = await ProcessingManager.compress(path, {
      width: origin.size && origin.size.width / 1,
      height: origin.size && origin.size.height / 1,
      bitrateMultiplier: 7,
      minimumBitrate: 300000,
    });
    let thumbnail = '';
    if (origin.duration > 1) {
      thumbnail = await getThumbnail(result.source);
    }
    return { path: result.source, thumbnail };
  }

  const getThumbnail = async (path: string) => {
    try {
      return await ProcessingManager.getPreviewForSecond(path);
    } catch (error) {
      console.log(error);
    }
  };

  const playVideoHandler = () => {
    setEnableScroll(prev => !prev);
    setPlayVideo(prev => !prev);
  };

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
          <PagerView
            scrollEnabled={enableScroll}
            onPageSelected={pageSelectedHandler}
            style={styles.pagerView}
            initialPage={0}
          >
            {videos.map((vid, i) => {
              return (
                <View key={i}>
                  {playVideo && videos && (
                    <VideoPlayer
                      ref={videoRef}
                      play={playVideo}
                      style={styles.video}
                      source={vid.node.image.uri}
                      resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
                    />
                  )}

                  {!playVideo && (
                    <Image
                      style={styles.thumbnail}
                      source={{
                        uri: thumbnails[i],
                      }}
                    />
                  )}
                </View>
              );
            })}
          </PagerView>
          <View style={[styles.bottomRow]}>
            {getButton(playVideoHandler, playVideo ? 'STOP' : 'PLAY')}
            {getButton(selectVideoHandler, 'SELECT')}
          </View>
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
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  thumbnail: {
    position: 'absolute',
    top: 100,
    left: 0,
    bottom: 100,
    right: 0,
  },
  pagerView: {
    flex: 1,
  },
});

export default Camera;
