export const heroAnimation = {
  hidden: {
    opacity: 0,
    y: 40,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.8,
    },
  },
};

export const containerAnimation = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

export const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
  },

  visible: {
    opacity: 1,
    y: 0,
    scale: 1,

    transition: {
      duration: 0.5,
    },
  },
};