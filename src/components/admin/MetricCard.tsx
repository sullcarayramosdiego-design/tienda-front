import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { ArrowDownIcon, ArrowUpIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  loading?: boolean;
}

export function MetricCard({ title, value, trend, trendLabel, loading }: MetricCardProps) {
  const isPositive = trend !== undefined && trend >= 0;
  
  return (
    <Card className="shadow-sm border-muted/40 bg-transparent">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-24 bg-muted animate-pulse rounded" />
        ) : (
          <div className="flex flex-col gap-1">
            <div className="text-3xl font-semibold tracking-tight">{value}</div>
            {trend !== undefined && (
              <div className="flex items-center text-xs mt-1">
                <span
                  className={cn(
                    "flex items-center font-medium",
                    isPositive ? "text-emerald-600/80 dark:text-emerald-400/80" : "text-rose-600/80 dark:text-rose-400/80"
                  )}
                >
                  {isPositive ? <ArrowUpIcon className="mr-1 h-3 w-3" /> : <ArrowDownIcon className="mr-1 h-3 w-3" />}
                  {Math.abs(trend)}%
                </span>
                {trendLabel && <span className="ml-1.5 text-muted-foreground">{trendLabel}</span>}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
