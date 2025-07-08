'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Session } from '@/lib/types';

interface ProgressChartProps {
  sessions: Session[];
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${month}-${day}`;
};

export function ProgressChart({ sessions }: ProgressChartProps) {
  if (!sessions || sessions.length === 0) {
    return (
       <Card>
        <CardHeader>
          <CardTitle>WPM 진행 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-60">
            <p className="text-muted-foreground">차트를 표시할 데이터가 부족합니다.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const chartData = sessions.map(session => ({
    date: formatDate(session.createdAt),
    WPM: session.readingSpeed,
  })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


  return (
    <Card>
      <CardHeader>
        <CardTitle>WPM 진행 상태</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Legend />
            <Line type="monotone" dataKey="WPM" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
} 