import moment from 'moment';
import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import { zhCN } from 'date-fns/locale';
import { unix } from '../util/tool';

export const messageStamp = ({ time, dateFormat = 'MM/dd/yyyy' }) => {
  // const now = 
  const now = unix();

  const instance = now - time;

  if (instance > 0 && instance < 10) {
    return `刚刚`
  }

  if (instance > 10 && instance < 60) {
    return `${instance}秒前`
  }

  if (instance > 60 && instance < 60 * 60) {
    return `${(Math.ceil(instance / 60))}分前`
  }

  if (instance > 60 * 60 && instance < 60 * 60 * 24) {
    return `${(Math.ceil(instance / 60 * 60))}小时前`
  }

  // unix
  const unixTime = fromUnixTime(time);
  return format(unixTime, dateFormat, {
    locale: zhCN
  });
};

export const dynamicTime = ({ time }) => {
  const unixTime = fromUnixTime(time);
  return formatDistanceToNow(unixTime, { addSuffix: true });
};

export const timeAgo = ({ time }) => {
  const createdAt = moment(time * 1000);
  return createdAt.fromNow();
};
