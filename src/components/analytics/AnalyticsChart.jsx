import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/format';
import dayjs from 'dayjs';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-surface-200 rounded-xl p-3 shadow-lg text-sm">
      <p className="text-surface-500 mb-1">{dayjs(label).format('DD MMM')}</p>
      <p className="font-semibold text-surface-900">
        {formatCurrency(payload[0]?.value || 0)}
      </p>
      <p className="text-surface-400 text-xs">{payload[1]?.value || 0} donations</p>
    </div>
  );
};

export default function AnalyticsChart({ data = [] }) {
  const chartData = data.map((d) => ({
    date: d.date,
    amount: parseFloat(d.amount || 0),
    count: parseInt(d.count || 0),
  }));

  if (!chartData.length) return (
    <div className="h-48 flex items-center justify-center text-surface-400 text-sm">
      No donation data yet
    </div>
  );

  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#c044ef" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#c044ef" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0ece8" vertical={false} />
        <XAxis
          dataKey="date"
          tickFormatter={(d) => dayjs(d).format('DD MMM')}
          tick={{ fontSize: 11, fill: '#a8a29e', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tickFormatter={(v) => `₹${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
          tick={{ fontSize: 11, fill: '#a8a29e', fontFamily: 'DM Sans' }}
          axisLine={false}
          tickLine={false}
          width={50}
        />
        <Tooltip content={<CustomTooltip />} />
        <Area
          type="monotone"
          dataKey="amount"
          stroke="#c044ef"
          strokeWidth={2}
          fill="url(#colorAmount)"
          dot={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
