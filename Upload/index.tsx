import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';

type Props = {
  uri: string;
};

const categories = [
  {
    icon: 'https://cdn-icons-png.flaticon.com/512/196/196067.png',
    name: 'sports',
  },
  {
    icon: 'https://previews.123rf.com/images/martialred/martialred1507/martialred150700644/42613209-music-note-flat-icon-for-apps-and-websites.jpg',
    name: 'music',
  },
  {
    icon: 'https://www.clipartmax.com/png/middle/8-88403_size-movie-icon.png',
    name: 'movies',
  },
  {
    icon: 'https://library.kissclipart.com/20180927/ose/kissclipart-news-icon-noun-project-clipart-computer-icons-news-a894a9621477b389.png',
    name: 'current events',
  },
  {
    icon: 'https://icon-library.com/images/relationships-icon/relationships-icon-16.jpg',
    name: 'relationships',
  },
  {
    icon: 'https://static.thenounproject.com/png/955295-200.png',
    name: 'politics',
  },
];

const options = [
  {
    icon: 'https://cdn3.iconfinder.com/data/icons/network-server-and-hosting-set-1/100/a-13-512.png',
    text: 'Add kolyders',
    button: true,
  },
  {
    icon: 'https://cdn3.iconfinder.com/data/icons/network-server-and-hosting-set-1/100/a-13-512.png',
    text: 'Add to group',
    button: true,
  },
  {
    icon: 'https://png.pngtree.com/png-vector/20191024/ourlarge/pngtree-lock-line-icon-vector-png-image_1859174.jpg',
    text: 'Who can respond',
    button: true,
  },
  {
    icon: 'https://e7.pngegg.com/pngimages/830/47/png-clipart-font-awesome-computer-icons-user-interface-font-comment-computer-program-data-thumbnail.png',
    text: 'Allow comments',
    button: false,
  },
  {
    icon: 'https://thumbs.dreamstime.com/b/location-icon-thin-line-pin-point-isolated-white-background-140380332.jpg',
    text: 'Add location',
    button: true,
  },
  {
    icon: '',
    text: 'Feature my post',
    button: true,
  },
];

const Upload: React.FC<Props> = ({ uri }) => {
  const [thumbnail, setThumbnail] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/English_Cocker_Spaniel_4.jpg/800px-English_Cocker_Spaniel_4.jpg',
  );
  const [loadingThumbnail, setLoadingThumbnail] = useState(true);

  const getThumbnail = () => {
    createThumbnail({
      url: uri,
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

  const getOptionsRow = (icon: string, text: string, button: boolean) => {
    return (
      <View key={text} style={styles.optionsRow}>
        <View style={{ flexDirection: 'row' }}>
          {icon !== '' ? <Image source={{ uri: icon }} style={styles.icon} /> : null}
          <Text style={styles.text}>{text}</Text>
        </View>
        {button ? (
          <TouchableOpacity>
            <Image
              source={{
                uri: 'https://w7.pngwing.com/pngs/66/875/png-transparent-arrow-computer-icons-right-arrow-angle-text-rectangle.png',
              }}
              style={styles.icon}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity>
            <Text>Switch</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const getCategory = (icon: string, name: string) => {
    return (
      <View key={name} style={styles.categoryCell}>
        <TouchableOpacity>
          <Image
            source={{
              uri: icon,
            }}
            style={styles.categoryIcon}
          />
        </TouchableOpacity>
        <Text>{name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {/* Header Component / Status bar */}
          <Text>Kolyde Details</Text>
          <View style={styles.horizontalLine} />

          <View style={styles.descriptionContainer}>
            <View style={styles.thumbnailContainer}>
              <Image
                resizeMode={'cover'}
                source={{ uri: thumbnail }}
                style={styles.thumbnail}
                onLoadStart={() => {
                  loadingThumbnail && getThumbnail();
                }}
              />
            </View>
            <View style={styles.descriptionInput}>
              <TextInput multiline={true} maxLength={100} placeholder={'Post your opinion'} />
            </View>
          </View>

          <View style={styles.horizontalLine} />

          {options.map(option => getOptionsRow(option.icon, option.text, option.button))}

          <View style={styles.categoryContainer}>
            <Text style={styles.text}>Pick a category</Text>

            <View style={styles.categoryRow}>{categories.map(cat => getCategory(cat.icon, cat.name))}</View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
    alignItems: 'center',
  },
  descriptionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    height: 141,
  },
  thumbnailContainer: {
    width: '30%',
    marginHorizontal: 2,
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  descriptionInput: {
    width: '60%',
  },
  horizontalLine: {
    width: '80%',
    borderTopWidth: 1,
    borderTopColor: '#dddddd',
    marginVertical: 10,
  },
  optionsRow: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    margin: 10,
  },
  icon: {
    height: 24,
    width: 24,
    marginHorizontal: 4,
  },
  categoryContainer: {
    justifyContent: 'center',
    width: '85%',
  },
  categoryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 20,
    justifyContent: 'space-between'
  },
  categoryCell: {
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: 'center',
  },
  categoryIcon: {
    height: 50,
    width: 50,
    marginBottom: 5,
  },
  text: {
    color: '#AAAAAA',
  },
});
