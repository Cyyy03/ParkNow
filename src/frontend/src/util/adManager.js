import stripAnsi from 'strip-ansi';
import isFullwidthCodePoint from 'is-fullwidth-code-point';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { randArray, responseNoticeMessage, getAdConfigs, responseErrorMessage, responseSuccessMessage } from './tool';
import { NativeModules, NativeEventEmitter, requireNativeComponent } from 'react-native';
import { get } from 'lodash';

const { AdManager, SplashAd, FullScreenVideo, UnifiedInterstitialFullScreenVideo, RewardVideo, UnifiedBanner } =
  NativeModules;
let eventEmitter = null;

export function getAdConfigData(action, ads, ad_provider = null) {
  let adConfig = null;
  if (ad_provider) {
    adConfig = ads[action].filter((d) => d.provider === ad_provider);
    if (adConfig.length > 0) {
      adConfig = adConfig[0];
    }
  } else {
    adConfig = randArray(ads[action]);
  }
  // let adConfig = ad_provider ? ads[action].filter((d) => d.provider === ad_provider) : randArray(ads[action]);
  return adConfig;
}

export function showAdPage(
  user_id,
  screen_page,
  source_type,
  global,
  initAdHandler,
  task_id = 0,
  updateAdHandler = null,
  ad_provider = null,
  errorHanlder = null,
) {
  return;
  const { adPos, adGlobalConfig } = getAdConfigs(global);
  const adConfig = getAdConfigData(source_type, adPos, ad_provider);
  if (ad_provider) {
    responseNoticeMessage('adConfig' + JSON.stringify({ adConfig }), 100000);
  }

  if (!adConfig || !adConfig.id) {
    return;
  }
  // responseErrorMessage(JSON.stringify({ user_id, id: adConfig.id, source_type, task_id, screen_page, payload }));
  const payload = { source_type, adConfig, adGlobalConfig, screen_page };
  initAdHandler(user_id, adConfig.id, source_type, task_id, screen_page, payload, (response) => {
    const ad_id = get(response, 'data.data.id', '') + '';
    if (response.code === 0) {
      if (ad_id && ad_id !== '') {
        // console.log('adConfig', adConfig, adGlobalConfig, ad_id);
        const currentConfig = showAd(source_type, adConfig, adGlobalConfig, ad_id, screen_page, () => { }, true);
        updateAdHandler && updateAdHandler(ad_id, task_id, currentConfig);
        // console.log('adConfig', adConfig, adGlobalConfig, ad_id);
      }
    } else {
      if (response.code === -102 || response.code === -104) {
      } else {
        responseErrorMessage(response.message);
      }

      if (errorHanlder) {
        errorHanlder();
      }
    }
  });
}

export function showAd(action, adConfig, globalConfig, ad_id, screen_page, callback, isLoad) {
  if (isLoad) {
    AdManager.init(globalConfig);
  }

  if (action === 'splash') {
    return showSplashAd(
      { ...adConfig, ...{ screen_page, ad_id, appid: globalConfig[`${adConfig.provider}_appid`] } },
      callback,
    );
  }

  if (action === 'unified_interstitial') {
    // responseSuccessMessage('???????????????', 10000);
    return showUnifiedInterstitialFullScreenVideoAd(
      { ...adConfig, ...{ screen_page, ad_id, appid: globalConfig[`${adConfig.provider}_appid`] } },
      callback,
    );
  }

  if (action === 'unified_banner') {
    return showUnifiedInterstitialFullScreenVideoAd(
      { ...adConfig, ...{ screen_page, ad_id, appid: globalConfig[`${adConfig.provider}_appid`] } },
      callback,
    );
  }

  if (action === 'fullvideo') {
    return showFullVideoAd(
      { ...adConfig, ...{ screen_page, ad_id, appid: globalConfig[`${adConfig.provider}_appid`] } },
      callback,
    );
  }

  if (action === 'reward') {
    // responseErrorMessage(
    //   JSON.stringify({ ...adConfig, ...{ screen_page, ad_id, appid: globalConfig[`${adConfig.provider}_appid`] } }),
    // );
    return showRewardAd(
      { ...adConfig, ...{ screen_page, ad_id, appid: globalConfig[`${adConfig.provider}_appid`] } },
      callback,
    );
  }
}

function showSplashAd(adConfig, listenerCache) {
  console.log('showSplashAd', adConfig);
  SplashAd.loadSplashAd(adConfig);
  return adConfig;
}

export function showRewardAd(adConfig) {
  // responseNoticeMessage(JSON.stringify(adConfig));
  RewardVideo.startAd(adConfig);
  return adConfig;
}

export function showFullVideoAd(adConfig) {
  // responseNoticeMessage(JSON.stringify(adConfig));
  FullScreenVideo.startAd(adConfig);
  return adConfig;
}

export function showUnifiedInterstitialFullScreenVideoAd(adConfig) {
  // responseNoticeMessage(JSON.stringify(adConfig), 100000);
  // adConfig = {
  //   appid: '1200024493',
  //   codeid: '9012367203554193',
  //   provider: 'tx',
  //   orientation: '',
  // };
  UnifiedInterstitialFullScreenVideo.startAd(adConfig);
  console.log('adConfig', adConfig);
  return adConfig;
}

export function showUnifiedInterstitialBannerScreenVideoAd(adConfig) {
  // responseNoticeMessage(JSON.stringify(adConfig), 100000);
  // adConfig = {
  //   appid: '1200024493',
  //   codeid: '9012367203554193',
  //   provider: 'tx',
  //   orientation: '',
  // };
  UnifiedBanner.startAd(adConfig);
  console.log('adConfig', adConfig);
  return adConfig;
}
