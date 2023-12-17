/**
 * Copyright (c) 2017-present, Liu Jinyong
 * All rights reserved.
 *
 * https://github.com/huanxsd/MeiTuan
 * @flow
 */

// System
import { Platform } from 'react-native';
const DEFAUL_LEVELS = [
  {
    name: 'A0',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
  {
    name: 'A0',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
  {
    name: 'A1',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
  {
    name: 'A2',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
  {
    name: 'C1',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
  {
    name: 'D1',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
  {
    name: 'E1',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
  {
    name: 'G1',
    text: require('../assets/images/home/level1.png'),
    tree: require('../assets/images/home/tree1.png'),
  },
];

export const getLevel = (index) => {
  if (index === -1) {
    return require('../assets/images/home/level1.png');
  }
  return DEFAUL_LEVELS[index];
};
