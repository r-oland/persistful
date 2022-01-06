import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faBookSpells,
  faFileCode,
  faFrenchFries,
  faSackDollar,
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
    faSackDollar
  );
};
