import { useState } from "react";
import { Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Brand } from "@/types/types";
import { ModelsModal } from "./modelsModal";

interface ModelsCellProps {
  brand: Brand;
}

export const ModelsCell = ({ brand }: ModelsCellProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modelCount = brand.models.length;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {modelCount > 0 ? (
          <>
            <Badge
              variant="secondary"
              className="bg-white dark:bg-gray-800"
            >
              {modelCount} model{modelCount > 1 ? "s" : ""}
            </Badge>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsModalOpen(true)}
              className="h-7 bg-blue-50 border-blue-200 text-blue-700
                         hover:bg-blue-100 hover:border-blue-300 hover:text-blue-800
                         dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300
                         dark:hover:bg-blue-900 dark:hover:border-blue-700"
            >
              <Eye className="h-3 w-3 mr-1" />
              View models
            </Button>
          </>
        ) : (
          <span className="text-muted-foreground text-sm italic">
            No models
          </span>
        )}
      </div>

      <ModelsModal
        brand={brand}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};
