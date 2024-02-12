export const framerFade = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

export const framerTopNavParent = {
  hidden: {
    opacity: 0,
    height: 50,
    padding: 0,
    transition: {
      opacity: {
        delay: 0.7,
      },
      height: {
        duration: 0.3,
        delay: 0.3,
      },
      padding: {
        delay: 0.2,
      },
    },
  },
  show: {
    opacity: 1,
    height: 312,
    padding: '2.5rem 3rem',
    transition: {
      delayChildren: 0.5,
      opacity: {
        duration: 0.2,
      },
      height: {
        duration: 0.3,
        delay: 0.25,
      },
      padding: {
        delay: 0.2,
      },
    },
  },
};

export const framerTopNavChild = {
  hidden: { opacity: 0, transition: { duration: 0.2 } },
  show: { opacity: 1, transition: { duration: 0.2 } },
};
