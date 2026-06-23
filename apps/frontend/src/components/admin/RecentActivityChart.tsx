"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Skeleton } from "@/components/ui/Skeleton";

interface ChartData {
  date: string;
  blogs: number;
  comments: number;
}

export function RecentActivityChart() {
  const { data: session } = useSession();
  const [data, setData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const token = (session as any)?.accessToken;
        if (!token) return;

        const response = await fetch("http://localhost:4000/api/dashboard/chart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.data) {
            setData(result.data);
          }
        }
      } catch (error) {
        console.error("Failed to fetch chart data", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (session) {
      fetchChartData();
    }
  }, [session]);

  if (isLoading) {
    return (
      <div className="h-64 sm:h-80 w-full border border-white/5 rounded-2xl bg-[#111111] p-6 flex flex-col justify-end gap-2">
        <Skeleton className="h-4/5 w-full rounded-xl bg-white/5" />
        <div className="flex justify-between">
          {[...Array(7)].map((_, i) => (
            <Skeleton key={i} className="h-4 w-12 rounded bg-white/5" />
          ))}
        </div>
      </div>
    );
  }

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#18181b] border border-white/10 p-4 rounded-xl shadow-2xl">
          <p className="text-white/80 text-sm mb-3 font-medium">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center gap-3 mb-1.5 last:mb-0">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-text-muted capitalize">
                {entry.name}:
              </span>
              <span className="text-sm font-semibold text-white">
                {entry.value}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="border border-white/5 rounded-2xl bg-[#111111] p-6 transition-colors hover:border-white/10">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white tracking-tight">Recent Activity</h3>
          <p className="text-sm text-text-muted mt-1 font-light">Blogs created and comments received in the last 7 days</p>
        </div>
      </div>
      
      <div className="h-64 sm:h-80 w-full min-w-[1px] min-h-[1px]">
        <ResponsiveContainer width="100%" height="100%" minWidth={1} minHeight={1}>
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBlogs" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ff6b00" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorComments" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#a1a1aa" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0} />
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.05)" 
              vertical={false} 
            />
            
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              dy={10}
            />
            
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
              allowDecimals={false}
            />
            
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.1)', strokeWidth: 1, strokeDasharray: '3 3' }} />
            
            <Area 
              type="monotone" 
              dataKey="comments" 
              name="Comments"
              stroke="#a1a1aa" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorComments)" 
            />
            
            <Area 
              type="monotone" 
              dataKey="blogs" 
              name="Blogs"
              stroke="#ff6b00" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorBlogs)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
