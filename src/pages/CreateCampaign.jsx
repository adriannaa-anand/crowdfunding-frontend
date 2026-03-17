import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { campaignService } from '../services/campaignService';
import { Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

const CATEGORIES = [
  'Education', 'Health', 'Environment', 'Technology', 'Arts', 'Community',
];

const STEPS = ['Details', 'Media', 'Review'];

export default function CreateCampaign() {
  const navigate = useNavigate();
  const [step,    setStep]    = useState(0);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [file,    setFile]    = useState(null);
  const [form,    setForm]    = useState({
    title: '', description: '', goal_amount: '',
    category: '', deadline: '', media_url: '',
  });

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const uploadMedia = async () => {
    if (!file) return null;
    try {
      const { data } = await campaignService.getUploadUrl(file.name, file.type);
      await axios.put(data.uploadUrl, file, {
        headers: { 'Content-Type': file.type },
      });
      return data.fileUrl;
    } catch {
      toast.error('Media upload failed');
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let mediaUrl = form.media_url;
      if (file) {
        mediaUrl = await uploadMedia();
        if (!mediaUrl) { setLoading(false); return; }
      }
      const { data } = await campaignService.create({ ...form, media_url: mediaUrl });
      toast.success('Campaign created!');
      navigate(`/campaign/${data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to create campaign');
    } finally {
      setLoading(false);
    }
  };

  const valid0 = form.title && form.description && form.goal_amount && form.deadline;

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="font-display text-4xl font-bold text-surface-900 mb-2">
        Start a campaign
      </h1>
      <p className="text-surface-500 mb-8">Fill in the details to launch your fundraiser</p>

      {/* Stepper */}
      <div className="flex items-center gap-3 mb-10">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-3">
            <div className={`flex items-center gap-2`}>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center
                               text-sm font-medium transition-colors
                ${i < step ? 'bg-brand-600 text-white'
                  : i === step ? 'bg-brand-600 text-white ring-4 ring-brand-100'
                  : 'bg-surface-200 text-surface-500'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-sm font-medium ${i === step ? 'text-surface-900' : 'text-surface-400'}`}>
                {s}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-px w-8 ${i < step ? 'bg-brand-600' : 'bg-surface-200'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-surface-200 p-8">
        {/* Step 0 — Details */}
        {step === 0 && (
          <div className="space-y-5 animate-fade-up">
            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Campaign title *
              </label>
              <input value={form.title} onChange={set('title')}
                className="input" placeholder="Give your campaign a clear title" required />
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Description *
              </label>
              <textarea value={form.description} onChange={set('description')}
                rows={5} className="input resize-none"
                placeholder="Tell your story. Why does this matter?" required />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Funding goal (₹) *
                </label>
                <input type="number" value={form.goal_amount} onChange={set('goal_amount')}
                  className="input" placeholder="50000" min="100" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-surface-700 mb-1.5">
                  Deadline *
                </label>
                <input type="date" value={form.deadline} onChange={set('deadline')}
                  className="input" min={new Date().toISOString().split('T')[0]} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-surface-700 mb-1.5">
                Category
              </label>
              <select value={form.category} onChange={set('category')} className="input">
                <option value="">Select a category</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c.toLowerCase()}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Step 1 — Media */}
        {step === 1 && (
          <div className="animate-fade-up">
            <label className="block text-sm font-medium text-surface-700 mb-3">
              Campaign image (optional)
            </label>
            <div className={`border-2 border-dashed rounded-2xl overflow-hidden
                            transition-colors ${preview ? 'border-transparent' : 'border-surface-200 hover:border-brand-300'}`}>
              {preview ? (
                <div className="relative">
                  <img src={preview} alt="preview"
                    className="w-full h-64 object-cover" />
                  <button
                    onClick={() => { setPreview(null); setFile(null); }}
                    className="absolute top-3 right-3 bg-black/50 text-white
                               rounded-full p-1.5 hover:bg-black/70 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center h-48
                                  cursor-pointer text-surface-400 hover:text-surface-600">
                  <Upload size={32} className="mb-3" />
                  <p className="text-sm font-medium">Click to upload image</p>
                  <p className="text-xs mt-1">JPG, PNG up to 10MB</p>
                  <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
                </label>
              )}
            </div>
          </div>
        )}

        {/* Step 2 — Review */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-up">
            <h3 className="font-display font-semibold text-xl text-surface-900">
              Review your campaign
            </h3>
            {preview && (
              <img src={preview} className="w-full h-48 object-cover rounded-xl" alt="" />
            )}
            <div className="space-y-3">
              {[
                ['Title',    form.title],
                ['Goal',     `₹${Number(form.goal_amount).toLocaleString('en-IN')}`],
                ['Deadline', form.deadline],
                ['Category', form.category || '—'],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between py-2 border-b border-surface-100">
                  <span className="text-sm text-surface-500">{label}</span>
                  <span className="text-sm font-medium text-surface-900">{value}</span>
                </div>
              ))}
            </div>
            <div className="bg-surface-50 rounded-xl p-4">
              <p className="text-sm text-surface-700 line-clamp-4">{form.description}</p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8 pt-6 border-t border-surface-100">
          <button
            onClick={() => setStep((s) => s - 1)}
            disabled={step === 0}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed">
            Back
          </button>
          {step < 2 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={step === 0 && !valid0}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
              Continue
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="btn-primary">
              {loading ? 'Launching...' : '🚀 Launch Campaign'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
