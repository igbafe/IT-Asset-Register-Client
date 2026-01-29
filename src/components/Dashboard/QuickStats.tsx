interface QuickStatsCardProps {
  assignedCount: number;
  availableCount: number;
  decommissionedCount: number;
  totalLaptops: number;
}

export default function QuickStatsCard({
  assignedCount,
  availableCount,
  decommissionedCount,
  totalLaptops,
}: QuickStatsCardProps) {
  return (
    <section>
      <div className="bg-card rounded-lg border shadow-sm p-6 h-full">
        <h3 className="font-semibold text-foreground mb-6">Quick Stats</h3>
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">
                Utilization Rate
              </span>
              <span className="font-semibold text-foreground">
                {totalLaptops > 0
                  ? Math.round((assignedCount / totalLaptops) * 100)
                  : 0}
                %
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-green-600 dark:bg-green-500 h-2.5 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    totalLaptops > 0
                      ? (assignedCount / totalLaptops) * 100
                      : 0
                  }%`,
                }}
              />
            </div>
          </div>

          <div className="pt-4 border-t space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-950/30">
              <span className="text-sm font-medium text-foreground">
                Active Assignments
              </span>
              <span className="font-bold text-green-600 dark:text-green-400">
                {assignedCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-purple-50 dark:bg-purple-950/30">
              <span className="text-sm font-medium text-foreground">
                Available
              </span>
              <span className="font-bold text-purple-600 dark:text-purple-400">
                {availableCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
              <span className="text-sm font-medium text-foreground">
                Decommissioned
              </span>
              <span className="font-bold text-gray-600 dark:text-gray-400">
                {decommissionedCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}