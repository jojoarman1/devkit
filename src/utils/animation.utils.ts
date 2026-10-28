import { NO_REDUCED_MOTION_QUERY } from '@/constants/animation.constants'

export const isMotionAllowed = () => window.matchMedia(NO_REDUCED_MOTION_QUERY).matches
