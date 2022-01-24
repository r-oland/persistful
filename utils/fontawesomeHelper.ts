import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faAlienMonster,
  faBookSpells,
  faDumbbell,
  faFileCode,
  faFrenchFries,
  faGamepad,
  faGuitarElectric,
  faLeaf,
  faPalette,
  faPencil,
  faSackDollar,
  faTooth,
  faWatchFitness,
  faWaveform,
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
    faGuitarElectric
  );
};

export const icons = [
  'file-code',
  'watch-fitness',
  'waveform',
  'book-spells',
  'french-fries',
  'sack-dollar',
  'tooth',
  'palette',
  'pencil',
  'dumbbell',
  'leaf',
  'alien-monster',
  'gamepad',
  'guitar-electric',
];
