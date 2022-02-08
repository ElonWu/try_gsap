import gsap from 'gsap';
import { useMemo, useRef } from 'react';

export const to = (target, vars) => {
  return gsap.to(target, Object.assign({}, vars));
};

export const fadeIn = (target, vars) => {
  return gsap.from(target, Object.assign({ opacity: 0 }, vars));
};

export const fadeOut = (target, vars) => {
  return gsap.to(target, Object.assign({ opacity: 0 }, vars));
};

const useAnimator = (anims = {}) => {
  const targetRef = useRef();

  const animator = useMemo(() => {
    const animator = {
      to(vars) {
        return to(targetRef.current, vars);
      },
      fadeIn(vars) {
        return fadeIn(targetRef.current, vars);
      },
      fadeOut(vars) {
        return fadeOut(targetRef.current, vars);
      },
    };

    for (let key in anims) {
      animator[key] = (vars) => {
        anims[key](targetRef.current, vars);
      };
    }

    return animator;
  }, [anims]);

  return [targetRef, animator];
};

export default useAnimator;
