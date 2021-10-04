import { StyleSheet } from 'react-native';

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
    alignItems: 'center',
    margin: 10,
  },
  optionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
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
    justifyContent: 'space-between',
  },
  categoryCell: {
    marginVertical: 10,
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
  categoryIcon: {
    height: 50,
    width: 50,
    marginBottom: 5,
  },
  text: {
    color: '#AAAAAA',
  },
  buttonRow: {
    flexDirection: 'row',
    width: '50%',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
  },
  button: {
    borderRadius: 8,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default styles;
