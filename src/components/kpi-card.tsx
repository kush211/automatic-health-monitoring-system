import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";

type KpiCardProps = {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  description: string;
};

export function KpiCard({ title, value, change, icon, description }: KpiCardProps) {
  const isPositive = change.startsWith("+");
  const isNegative = change.startsWith("-");
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {change && (
            <p className={`text-xs mt-1 ${isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-muted-foreground'}`}>
                {change} from last month
            </p>
        )}
      </CardContent>
    </Card>
  );
}
