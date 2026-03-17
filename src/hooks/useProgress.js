import { useState, useEffect, useRef } from 'react';
import { campaignService } from '../services/campaignService';

export function useProgress(campaignId, interval = 10000) {
  const [progress, setProgress] = useState(null);
  const timerRef = useRef(null);

  const fetch = async () => {
    try {
      const { data } = await campaignService.getProgress(campaignId);
      setProgress(data);
    } catch {
      // silent — fall back to campaign data
    }
  };

  useEffect(() => {
    if (!campaignId) return;
    fetch();
    timerRef.current = setInterval(fetch, interval);
    return () => clearInterval(timerRef.current);
  }, [campaignId, interval]);

  return progress;
}
