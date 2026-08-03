import Reactotron from 'reactotron-react-native';
import { reactotronRedux } from 'reactotron-redux';

const reactotron = Reactotron.configure({ name: 'ProjectTiamat' })
  .useReactNative()
  .use(reactotronRedux())
  .connect();

export default reactotron;
