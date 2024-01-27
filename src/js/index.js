import * as Capacitor from 'https://esm.run/@capacitor/core';
import 'https://esm.run/@capacitor/app';
import 'https://esm.run/@capacitor/toast';
import 'https://esm.run/@capacitor/haptics';
import 'https://esm.run/@capacitor/camera';
import 'https://esm.run/@capacitor/splash-screen';
import 'https://esm.run/@capacitor/share';
import 'https://esm.run/@capacitor/action-sheet';
import 'https://esm.run/@capacitor/app-launcher';
import 'https://esm.run/@capacitor/browser';
import 'https://esm.run/@capacitor/device';
import 'https://esm.run/@capacitor/dialog';
import 'https://esm.run/@capacitor/geolocation';
import 'https://esm.run/@capacitor/network';
import 'https://esm.run/@capacitor/live-updates';
// import * as LiveUpdates from '@capacitor/live-updates';

Capacitor.Plugins.SplashScreen.show({
  autoHide: false,
}).then();

setTimeout(async () => {
  await Capacitor.Plugins.SplashScreen.hide();
}, 3500);

document.querySelector('#share-btn').addEventListener('click', async function (e) {
  await Capacitor.Plugins.Share.share({
    title: 'See cool stuff',
    text: 'Really awesome thing you need to see right meow',
    url: 'http://ionicframework.com/',
    dialogTitle: 'Share with buddies',
  });
});

document.querySelector('#show-toast').addEventListener('click', async function (e) {
  await Capacitor.Plugins.Toast.show({
    text: 'Hello!',
  });

  await Capacitor.Plugins.Haptics.vibrate();
});

document.querySelector('#take-photo').addEventListener('click', async function (e) {
  try {
    const photo = await Capacitor.Plugins.Camera.getPhoto({
      resultType: 'uri',
    });

    const image = self.shadowRoot.querySelector('#image');
    if (!image) {
      return;
    }

    image.src = photo.webPath;
  } catch (e) {
    console.warn('User cancelled', e);
  }
});

const showActions = async () => {
  const result = await Capacitor.Plugins.ActionSheet.showActions({
    title: 'Photo Options',
    message: 'Select an option to perform',
    options: [
      {
        title: 'Upload',
      },
      {
        title: 'Share',
      },
      {
        title: 'Remove',
        // style: ActionSheetButtonStyle.Destructive,
      },
    ],
  });

  console.log('Action Sheet result:', result);
};

document.querySelector('#show-actions-btn').addEventListener('click', async function (e) {
  await showActions();
});

document.querySelector('#app-launcher-btn').addEventListener('click', async function (e) {
  await openHalloMarkt();
});

const openHalloMarkt = async () => {
  await Capacitor.Plugins.AppLauncher.openUrl({ url: 'com.whyzr.order.whyzrmarket' });
};

document.querySelector('#open-browser-btn').addEventListener('click', async function (e) {
  await openBrowser();
});
const openBrowser = async () => {
  await Capacitor.Plugins.Browser.open({ url: 'http://capacitorjs.com/' });
};

document.querySelector('#confirm-btn').addEventListener('click', async function (e) {
  await showConfirm();
});

const showConfirm = async () => {
  const { value } = await Capacitor.Plugins.Dialog.confirm({
    title: 'Confirm',
    message: `Are you sure you'd like to press the red button?`,
  });

  console.log('Confirmed:', value);
};

document.querySelector('#location-btn').addEventListener('click', async function (e) {
  await printCurrentPosition();
});

const printCurrentPosition = async () => {
  const coordinates = await Capacitor.Plugins.Geolocation.getCurrentPosition();

  console.log('Current position:', coordinates);
};

setTimeout(() => {
  logCurrentNetworkStatus();
  Capacitor.Plugins.Network.addListener('networkStatusChange', async status => {
    console.log('Network status changed', status);
    // await Capacitor.Plugins.Dialog.alert({
    //   title: 'Network status changed',
    //   message: JSON.stringify(status),
    // });
  });
}, 0);
const logCurrentNetworkStatus = async () => {
  const status = await Capacitor.Plugins.Network.getStatus();

  console.log('Network status:', status);
  // await Capacitor.Plugins.Dialog.alert({
  //   title: 'Network status',
  //   message: JSON.stringify(status),
  // });
};

document.querySelector('#device-btn').addEventListener('click', async function (e) {
  await printDeviceInfo();
}
);
async function printDeviceInfo() {
  const info = await Capacitor.Plugins.Device.getInfo();
  console.log('Device info:', info);
}

async function checkLiveUpdates() {
  const result = await Capacitor.Plugins.LiveUpdates.sync();
  console.log('result: ', result)
  if (result.activeApplicationPathChanged) {
    await Capacitor.Plugins.LiveUpdates.reload();
  }
  else {
    await Capacitor.Plugins.SplashScreen.hide();
  }
}

checkLiveUpdates().then();

async function getAppVersion() {
  const info = await Capacitor.Plugins.App.getInfo();
  
  console.log('App info:', info);
  document.querySelector('#app-version').innerHTML = info.version;
}

getAppVersion().then();