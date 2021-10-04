import React, { useState } from 'react';
import { Image, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { createThumbnail } from 'react-native-create-thumbnail';

type Props = {
  uri: string;
};

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
      <View style={styles.optionsRow}>
        <View style={{ flexDirection: 'row' }}>
          {icon !== '' ? <Image source={{ uri: icon }} style={styles.icon} /> : null}
          <Text>{text}</Text>
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

          <>
            {getOptionsRow(
              'https://cdn3.iconfinder.com/data/icons/network-server-and-hosting-set-1/100/a-13-512.png',
              'Add kolyders',
              true,
            )}
            {getOptionsRow(
              'https://cdn3.iconfinder.com/data/icons/network-server-and-hosting-set-1/100/a-13-512.png',
              'Add to group',
              true,
            )}
            {getOptionsRow(
              'https://png.pngtree.com/png-vector/20191024/ourlarge/pngtree-lock-line-icon-vector-png-image_1859174.jpg',
              'Who can respond',
              true,
            )}
            {getOptionsRow(
              'https://e7.pngegg.com/pngimages/830/47/png-clipart-font-awesome-computer-icons-user-interface-font-comment-computer-program-data-thumbnail.png',
              'Allow comments',
              false,
            )}
            {getOptionsRow(
              'https://thumbs.dreamstime.com/b/location-icon-thin-line-pin-point-isolated-white-background-140380332.jpg',
              'Add location',
              true,
            )}

            {getOptionsRow('', 'Feature my post', true)}
          </>
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
});
