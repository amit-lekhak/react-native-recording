import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  bottomRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
    bottom: 0,
    height: 60,
    alignItems: 'center',
  },
  button: {
    margin: 10,
  },
  playRecordOptions: {
    position: 'absolute',
    right: 0,
    left: '40%',
    bottom: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cameraOptions: {
    position: 'absolute',
    margin: 10,
    right: 0,
    top: 20,
  },
  textColor: {
    color: '#fff',
  },
  optionIcon: {
    fontSize: 24,
    color: '#fff',
  },
  galleryIcon: {
    fontSize: 30,
  },
  recordButton: {
    height: 76,
    width: 76,
    borderWidth: 4,
    borderColor: '#CB4141',
    backgroundColor: '#F75555',
    borderRadius: 38,
  },
  stopButton: {
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopIcon: {
    height: 30,
    width: 30,
    borderRadius: 4,
    backgroundColor: '#F75555',
  },
  closeIcon: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  pagerView: {
    flex: 1,
  },
});

export default styles;
