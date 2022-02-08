import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from 'react';

import { throttle } from 'lodash';

import './app.css';
import useAnimator from './hooks/useAnimation';

function App() {
  const [targetRef1, animator1] = useAnimator();
  const targetRef2 = useRef();

  const onShow = useCallback(() => {
    animator1.fadeIn({ x: 200, y: 200 });
    targetRef2.current.fadeIn();

    const target1FadeOut = () => animator1.fadeOut({ x: -200 });

    targetRef1.current.addEventListener('click', target1FadeOut);

    return () => {
      targetRef1.current.removeEventListener('click', target1FadeOut);
    };
  }, [targetRef1, animator1]);

  useEffect(() => {
    const timer = setTimeout(onShow, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      <div className="balls">
        <div className="balls__ball" ref={targetRef1}></div>

        <Circle key={1} level={1} ref={targetRef2} />
        <Circle key={2} level={2} />
        <Circle key={3} level={3} />
        <Circle key={4} level={4} />
      </div>
    </div>
  );
}

export default App;

const Circle = forwardRef((props, ref) => {
  const [targetRef, animator] = useAnimator();

  useImperativeHandle(
    ref,
    () => ({
      fadeIn() {
        animator.fadeIn({ x: 200, y: -200 });
      },
      fadeOut() {
        animator.fadeOut({ x: -200 });
      },
    }),
    [animator],
  );

  useEffect(() => {
    const level = props.level || 1;

    const followMouse = throttle((e) => {
      animator.to({ x: e.clientX, y: e.clientY });
    }, 250 - level * 60);

    document.addEventListener('mousemove', followMouse);

    return () => {
      document.removeEventListener('mousemove', followMouse);
    };
  }, [animator, props.level]);

  const levelStyle = useMemo(() => {
    const level = props.level || 1;
    return {
      width: `${120 - level * 20}px`,
      height: `${120 - level * 20}px`,
      opacity: `${0.5 - level * 0.1}`,
      backgroundColor: `hsl(${(level * 360) / 4}, 100%, 50%)`,
    };
  }, [props.level]);

  return (
    <div
      className="balls__ball"
      ref={targetRef}
      {...props}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'translate(-50%, -50%)',
        ...levelStyle,
      }}
    ></div>
  );
});
