import { useEffect } from 'react';
import { useRecoilSnapshot } from 'recoil';

const DebugObserver = () => {
  const snapshot = useRecoilSnapshot();
  useEffect(() => {
    for (const node of snapshot.getNodes_UNSTABLE({ isModified: true })) {
      //   console.log(node.key);
      if (node.key === 'tickerReceiveState') {
        // console.debug(node.key, snapshot.getLoadable(node));
      }
    }
  }, [snapshot]);

  return null;
};

export default DebugObserver;
