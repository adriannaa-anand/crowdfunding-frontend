import api from './api';

export const donationService = {
  createPaymentIntent: (data) =>
    api.post('/donations/create-payment-intent', data),
  getCampaignDonations: (campaignId) =>
    api.get(`/donations/campaign/${campaignId}`),
  getMyDonations: () => api.get('/donations/my'),
};
