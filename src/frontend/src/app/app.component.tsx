import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { appMappings, appThemes } from './app-theming';
import { AppIconsPack } from './app-icons-pack';
import { StatusBar } from '../components/status-bar.component';
import { AppNavigator } from '../navigation/app.navigator';
import { AppStorage } from '../services/app-storage.service';
import { Mapping, Theme, Theming } from '../services/theme.service';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import { Provider, useDispatch, useSelector } from 'react-redux';
import indexDataReducer from '../reducers/indexReducers';
import authReducers from '../reducers/authReducers';
import toolsSlice, { userData } from '../reducers/toolsSlice';
import { compareVersion, getAppResourceVersion, getAppVersion } from '../util/tool';
import { getGlobalConfig } from '../actions/index/actions';
import { get } from 'lodash';

export const store = createStore(
  combineReducers({
    global: indexDataReducer,
    tools: toolsSlice,
    auth: authReducers,
  }),
  applyMiddleware(thunk),
);

const defaultConfig: { mapping: Mapping, theme: Theme } = {
  mapping: 'material',
  theme: 'light',
};

const App: React.FC<{ mapping: Mapping, theme: Theme }> = ({ mapping, theme }) => {
  const [mappingContext, currentMapping] = Theming.useMapping(appMappings, mapping);
  const [themeContext, currentTheme] = Theming.useTheming(appThemes, mapping, theme);




  useEffect(() => {

  }, [])




  return (
    <React.Fragment>
      <IconRegistry icons={[EvaIconsPack, AppIconsPack]} />
      <ApplicationProvider {...currentMapping} theme={currentTheme}>
        <Provider store={store}>
          <Theming.MappingContext.Provider value={mappingContext}>
            <Theming.ThemeContext.Provider value={themeContext}>
              <SafeAreaProvider>
                <StatusBar />
                <AppNavigator />
              </SafeAreaProvider>
            </Theming.ThemeContext.Provider>
          </Theming.MappingContext.Provider>
        </Provider>
      </ApplicationProvider>

    </React.Fragment>
  );
};



export default (): React.ReactElement => (
  <App {...defaultConfig} />
);
