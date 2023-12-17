import { INBOX_TYPES } from '../constants/index';
// import images from '../constants/images';

export const getInboxIconByType = ({ channelType, phoneNumber }) => {
  switch (channelType) {
    case INBOX_TYPES.WEB:
      return 'globe-desktop-outline';

    case INBOX_TYPES.FB:
      return 'brand-facebook';

    case INBOX_TYPES.TWITTER:
      return 'brand-twitter';

    case INBOX_TYPES.TWILIO:
      return phoneNumber?.startsWith('whatsapp') ? 'brand-whatsapp' : 'brand-sms';

    case INBOX_TYPES.WHATSAPP:
      return 'brand-whatsapp';

    case INBOX_TYPES.API:
      return 'cloud-outline';

    case INBOX_TYPES.EMAIL:
      return 'mail-outline';

    case INBOX_TYPES.TELEGRAM:
      return 'brand-telegram';

    case INBOX_TYPES.LINE:
      return 'brand-line';

    default:
      return 'chat-outline';
  }
};
