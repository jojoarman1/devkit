export const NO_REDUCED_MOTION_QUERY = '(prefers-reduced-motion: no-preference)'

export const CARD_PRESS = {
  scale: 0.97,
  duration: 0.15,
  ease: 'power2.out',
  overwrite: 'auto',
} satisfies gsap.TweenVars

// elastic amplitude 1 with a 0.45 period gives one small overshoot, not a wobble
// clearProps: a leftover inline transform would keep the card on its own GPU layer
export const CARD_RELEASE = {
  scale: 1,
  duration: 0.7,
  ease: 'elastic.out(1, 0.45)',
  overwrite: 'auto',
  clearProps: 'transform',
} satisfies gsap.TweenVars
