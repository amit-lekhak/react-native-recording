import React, { useState } from 'react';
import { Button, Image, SafeAreaView, ScrollView, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';

// packages
import { createThumbnail } from 'react-native-create-thumbnail';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

// styles
import styles from './styles';

// constants
import { categories, options } from '../constants/eng';

type Props = {
  uri: string;
};

const Upload: React.FC<Props> = ({ uri }) => {
  const [thumbnail, setThumbnail] = useState(
    'https://upload.wikimedia.org/wikipedia/commons/thumb/3/34/English_Cocker_Spaniel_4.jpg/800px-English_Cocker_Spaniel_4.jpg',
  );
  const [loadingThumbnail, setLoadingThumbnail] = useState(true);

  const [isSwitchEnabled, setIsSwitchEnabled] = useState(true);

  const toggleSwitch = () => {
    setIsSwitchEnabled(prev => !prev);
  };

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

  const getOptionsRow = (iconName: string, text: string, button: boolean) => {
    return (
      <View key={text} style={styles.optionsRow}>
        <View style={styles.optionGroup}>
          {iconName !== '' ? <Icon name={iconName} style={styles.icon} /> : null}
          <Text style={styles.text}>{text}</Text>
        </View>
        {button ? (
          <TouchableOpacity>
            <Icon name={'angle-right'} style={styles.icon} onPress={() => console.log('pressed')} />
          </TouchableOpacity>
        ) : (
          <Switch
            trackColor={{ false: '#767577', true: '#81bbff' }}
            thumbColor={isSwitchEnabled ? '#81b0ff' : '#f4f3f4'}
            ios_backgroundColor='#3e3e3e'
            onValueChange={toggleSwitch}
            value={isSwitchEnabled}
          />
        )}
      </View>
    );
  };

  const getCategory = (iconName: string, name: string) => {
    return (
      <View key={name} style={styles.categoryCell}>
        <TouchableOpacity>
          <MaterialIcon name={iconName} style={styles.categoryIcon} />
        </TouchableOpacity>
        <Text>{name}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
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

          <View style={styles.buttonRow}>
            <TouchableOpacity>
              <Text>Cancel</Text>
            </TouchableOpacity>

            <Button disabled={true} onPress={() => console.log('Post')} title={'Post'} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Upload;
