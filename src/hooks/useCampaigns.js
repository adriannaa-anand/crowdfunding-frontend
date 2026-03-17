import { useState, useEffect } from 'react';
import { campaignService } from '../services/campaignService';

export function useCampaigns(params = {}) {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState(null);
  const [meta, setMeta]           = useState({});

  const fetchCampaigns = async () => {
    try {
      setLoading(true);
      const { data } = await campaignService.getAll(params);
      setCampaigns(data.campaigns);
      setMeta({ total: data.total, pages: data.pages, current: data.current_page });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCampaigns(); }, [JSON.stringify(params)]);

  return { campaigns, loading, error, meta, refetch: fetchCampaigns };
}

export function useCampaign(id) {
  const [campaign, setCampaign] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        setLoading(true);
        const { data } = await campaignService.getOne(id);
        setCampaign(data);
      } catch (err) {
        setError(err.response?.data?.error || 'Campaign not found');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  return { campaign, loading, error };
}

export function useMyCampaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading]     = useState(true);

  const fetch = async () => {
    try {
      setLoading(true);
      const { data } = await campaignService.getMy();
      setCampaigns(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []);
  return { campaigns, loading, refetch: fetch };
}
