// import { ActionCable, Cable } from '@kesha-antonov/react-native-action-cable';
// import ActionCable from '../service/Cable/action_cable/ActionCable';
import { Cable, ActionCable } from '../service/Cable';
import { ROUTER } from '../util';
import { getChatApis } from '../util/api';
import WsReuestHelper from './WsReuestHelper';
// import { getChatApis } from '../../util/api';

const cable = new Cable({});

const channelName = 'RoomChannel';
const PRESENCE_INTERVAL = 20000;

class BaseActionCableConnector {
  constructor(pubSubToken, accountId, userId) {
    const apis = getChatApis(ROUTER.CHAT.CABLE, { accountId, userId });
    const connectActionCable = ActionCable.createConsumer(apis.url);
    console.log("connectActionCable", apis.url);
    // Cable


    const channel = cable.setChannel(
      channelName,
      connectActionCable.subscriptions.create(
        {
          channel: channelName,
          pubsub_token: pubSubToken,
          account_id: accountId,
          user_id: userId,
        },
        {
          updatePresence() {
            this.perform('update_presence');
          },
        },
      ),
    );
    console.log("channel", channel);
    channel.on('received', this.onReceived);
    channel.on('connected', this.handleConnected);
    channel.on('disconnect', this.handleDisconnected);
    channel.on('rejected', (error) => {
      console.log("error", error);
    })


    // WsReuestHelper

    // this.wsReuestHelper = new WsReuestHelper(apis.url);
    // this.wsReuestHelper.init();

    this.events = {};
    this.accountId = accountId;
    this.isAValidEvent = data => {
      const { account_id } = data;
      return this.accountId === account_id;
    };
    // setInterval(() => {
    //   cable.channel(channelName).perform('update_presence');
    // }, PRESENCE_INTERVAL);
  }

  onReceived = ({ event, data } = {}) => {
    // if (this.isAValidEvent(data)) {
    //   if (this.events[event] && typeof this.events[event] === 'function') {
    //     this.events[event](data);
    //   }
    // }
  };
  handleConnected = () => {
    console.log('Connected to ActionCable');
  };
  // TODO: handle disconnected
  handleDisconnected = () => {
    console.log('Disconnected from ActionCable');
  };
}

export default BaseActionCableConnector;
