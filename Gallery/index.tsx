import React, { useEffect, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { VideoPlayer } from 'react-native-video-processing';

type Props = {
  source: string;
  getThumbnail: (path: string) => Promise<string>;
  getButton: (onPress: () => void, text: string) => JSX.Element;
  handleScroll: () => void;
  selectVideoHandler: (uri: string) => void;
};

const Gallery = ({ source, getThumbnail, getButton, handleScroll, selectVideoHandler }: Props): JSX.Element => {
  const [playVideo, setPlayVideo] = useState(false);
  const [thumbnail, setThumbnail] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/English_Cocker_Spaniel_4.jpg/800px-English_Cocker_Spaniel_4.jpg',
  );

  useEffect(() => {
    const getPreview = async () => {
      try {
        const b64String = await getThumbnail(source);
        setThumbnail(b64String);
      } catch (err) {
        console.log(err);
      }

      await getPreview();
    };
  }, []);

  const playVideoHandler = () => {
    handleScroll();
    setPlayVideo(prev => !prev);
  };

  return (
    <>
      {playVideo ? (
        <VideoPlayer
          play={playVideo}
          style={styles.video}
          source={source}
          resizeMode={VideoPlayer.Constants.resizeMode.CONTAIN}
        />
      ) : (
        <Image
          style={styles.thumbnail}
          source={{
            uri: thumbnail,
          }}
        />
      )}

      <View style={[styles.bottomRow]}>
        {getButton(playVideoHandler, playVideo ? 'STOP' : 'PLAY')}
        {getButton(() => selectVideoHandler(source), 'SELECT')}
      </View>
    </>
  );
};

export default Gallery;

const styles = StyleSheet.create({
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
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'absolute',
    bottom: 0,
  },
});
