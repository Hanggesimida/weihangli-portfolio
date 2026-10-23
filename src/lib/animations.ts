export const EASE_IN_OUT = [0.76, 0, 0.24, 1] as const;
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// 页面入场动画统一时间轴常量
export const INTRO = {
  delay: 0.15,
  duration: 0.8,
  ease: EASE_IN_OUT,
};

// Hero 各元素入场时机基准点（遮罩结束前 0.2s 开始交叠）
const HERO_BASE_DELAY = INTRO.delay + INTRO.duration - 0.2;

export const HERO_VARIANTS = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: HERO_BASE_DELAY + i * 0.1,
      duration: 0.7,
      ease: INTRO.ease,
    },
  }),
};

// 图片单独用 clipPath 揭开效果
export const HERO_IMAGE_VARIANTS = {
  hidden: { clipPath: "inset(100% 0% 0% 0%)" },
  visible: (i: number) => ({
    clipPath: "inset(0% 0% 0% 0%)",
    transition: {
      delay: HERO_BASE_DELAY + i * 0.1,
      duration: 0.9,
      ease: INTRO.ease,
    },
  }),
};
