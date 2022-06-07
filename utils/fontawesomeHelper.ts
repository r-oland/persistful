import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAlarmClock,
  faAlienMonster,
  faAvocado,
  faBookSpells,
  faBrush,
  faDumbbell,
  faFileAlt,
  faFileCode,
  faFrenchFries,
  faGamepad,
  faGuitarElectric,
  faHashtag,
  faHeart,
  faLaptop,
  faLeaf,
  faPalette,
  faPencil,
  faRunning,
  faSackDollar,
  faSmoking,
  faTooth,
  faUniformMartialArts,
  faWatchFitness,
  faWaveform,
  faPersonPraying,
  faYinYang,
  faWineBottle,
  faWhiskeyGlass,
  faShower,
  faMug,
} from '@fortawesome/pro-solid-svg-icons';

export const fontawesomeHelper = () => {
  library.add(
    faFileCode,
    faWatchFitness,
    faWaveform,
    faBookSpells,
    faFrenchFries,
    faSackDollar,
    faTooth,
    faPalette,
    faPencil,
    faDumbbell,
    faLeaf,
    faAlienMonster,
    faGamepad,
    faGuitarElectric,
    faSmoking,
    faLaptop,
    faFileAlt,
    faBrush,
    faAvocado,
    faUniformMartialArts,
    faRunning,
    faHashtag,
    faHeart,
    faAlarmClock,
    faPersonPraying,
    faYinYang,
    faWineBottle,
    faWhiskeyGlass,
    faShower,
    faMug
  );
};

export const icons = [
  // health
  'watch-fitness',
  'dumbbell',
  'uniform-martial-arts',
  'running',
  'leaf',
  'avocado',
  'yin-yang',
  'shower',

  // hobbies
  'heart',
  'book-spells',
  'guitar-electric',
  'waveform',
  'palette',
  'pencil',
  'brush',

  // addictions
  'french-fries',
  'alien-monster',
  'gamepad',
  'hashtag',

  // bad habits
  'wine-bottle',
  'whiskey-glass',
  'mug',
  'smoking',
  'tooth',
  'alarm-clock',

  // productivity
  'file-code',
  'laptop',
  'file-alt',

  // general
  'sack-dollar',
  'person-praying',
];
