"use client";

import { motion } from "framer-motion";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

const MOCK_DATA = [
  { time: "09:00", price: 0.124 },
  { time: "10:00", price: 0.126 },
  { time: "11:00", price: 0.125 },
  { time: "12:00", price: 0.128 },
  { time: "13:00", price: 0.131 },
  { time: "14:00", price: 0.129 },
  { time: "15:00", price: 0.132 },
];

export default function PriceChart() {
  return (
    <div className="h-full w-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-2">
        <div>
          <div className="text-xs text-zinc-500 uppercase font-bold tracking-widest mb-1">XLM / TKNA</div>
          <div className="text-2xl font-bold">0.132 <span className="text-xs text-green-500 font-normal ml-1">+2.4%</span></div>
        </div>
        <div className="flex gap-1">
          {["1H", "1D", "1W"].map(t => (
            <button key={t} className={`px-2 py-1 rounded-md text-[10px] font-bold ${t === "1D" ? "bg-stellar-blue text-white" : "hover:bg-white/5 text-zinc-500"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={MOCK_DATA}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#06B6D4" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              hide 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              hide 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '12px' }}
              itemStyle={{ color: '#fff' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#06B6D4" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: "#06B6D4" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
