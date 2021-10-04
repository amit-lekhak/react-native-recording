import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  uri: string;
};

const Upload: React.FC<Props> = ({ uri }) => {
  return (
    <View style={styles.container}>
      <Text>Hello world</Text>
    </View>
  );
};

export default Upload;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
