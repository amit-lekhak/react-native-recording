import React, { useState } from 'react';
import { Button, View } from 'react-native';
import Camera from './Camera';
import Upload from './Upload';

const App = (): JSX.Element => {
  const [showCamera, setShowCamera] = useState(false);
  return (
    <>
      {!showCamera ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Button title={'Open Camera'} onPress={() => setShowCamera(true)} />
        </View>
      ) : (
        <Camera />
      )}

      {/* <Upload
      uri={''}
      /> */}
    </>
  );
};

export default App;
