import React, { useState } from 'react';
import { ActivityIndicator, Image, View } from 'react-native';

// packages
import { createThumbnail } from 'react-native-create-thumbnail';
import Video from 'react-native-video';

// styles
import styles from './styles';

type Props = {
  source: string;
  getButton: (onPress: () => void, text: string) => JSX.Element;
  handleScroll: () => void;
  selectVideoHandler: (uri: string) => void;
};

const Gallery = ({ source, getButton, handleScroll, selectVideoHandler }: Props): JSX.Element => {
  const [playVideo, setPlayVideo] = useState(false);
  const [loadingThumbnail, setLoadingThumbnail] = useState(true);
  const [thumbnail, setThumbnail] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/English_Cocker_Spaniel_4.jpg/800px-English_Cocker_Spaniel_4.jpg',
  );

  const getThumbnails = () => {
    createThumbnail({
      url: source,
      timeStamp: 3000,
    })
      .then(response => {
        setThumbnail(response.path);
        setLoadingThumbnail(false);
      })
      .catch(err => {
        console.log({ err });
        setLoadingThumbnail(false);
      });
  };

  const playVideoHandler = () => {
    setPlayVideo(prev => !prev);
    handleScroll();
  };

  return (
    <>
      {playVideo ? (
        <Video
          onEnd={playVideoHandler}
          paused={false}
          controls={false}
          style={styles.video}
          source={{ uri: source }}
          resizeMode={'contain'}
        />
      ) : (
        <Image
          style={[styles.video, styles.thumbnail]}
          source={{
            uri: thumbnail,
          }}
          onLoadStart={() => {
            loadingThumbnail && getThumbnails();
          }}
        />
      )}

      <View style={[styles.bottomRow]}>
        {getButton(playVideoHandler, playVideo ? 'STOP' : 'PLAY')}
        {getButton(() => selectVideoHandler(source), 'SELECT')}
        <ActivityIndicator animating={loadingThumbnail} />
      </View>
    </>
  );
};

export default Gallery;
