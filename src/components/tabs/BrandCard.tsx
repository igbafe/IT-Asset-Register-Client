import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { Package } from "lucide-react";

interface BrandCardProps {
  brandName: string;
  models: string[];
  onDeleteBrand: (brandName: string) => void;
  onDeleteModel: (brandName: string, model: string) => void;
  onAddModel: (brandName: string) => void;
}

const MODELS_PER_PAGE = 10;

export function BrandCard({
  brandName,
  models,
  onDeleteBrand,
  onDeleteModel,
  onAddModel,
}: BrandCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(models.length / MODELS_PER_PAGE);
  const startIndex = (currentPage - 1) * MODELS_PER_PAGE;
  const endIndex = startIndex + MODELS_PER_PAGE;
  const paginatedModels = models.slice(startIndex, endIndex);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    setCurrentPage(1); // Reset to first page when toggling
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <div className="border-l-4 border-indigo-500">
        <CardHeader className="bg-gray-50 dark:bg-gray-900/50">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3 flex-1">
              <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                <Package className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="flex-1">
                <CardTitle className="text-xl">{brandName}</CardTitle>
                <CardDescription className="mt-1">
                  {models.length} {models.length === 1 ? "model" : "models"}{" "}
                  available
                </CardDescription>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddModel(brandName)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Model
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDeleteBrand(brandName)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {models.length > 0 && (
          <div className="border-t">
            <button
              onClick={handleToggle}
              className="w-full px-6 py-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
            >
              <span className="text-sm font-medium">
                {isExpanded ? "Hide Models" : "Show Models"}
              </span>
              {isExpanded ? (
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              )}
            </button>

            {isExpanded && (
              <CardContent className="pt-4 pb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                  {paginatedModels.map((model) => (
                    <div
                      key={model}
                      className="group flex items-center justify-between p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-all"
                    >
                      <span className="text-sm font-medium truncate pr-2">
                        {model}
                      </span>
                      <button
                        onClick={() => onDeleteModel(brandName, model)}
                        className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-all flex-shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-6 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to{" "}
                      {Math.min(endIndex, models.length)} of {models.length}{" "}
                      models
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </div>
        )}

        {models.length === 0 && (
          <CardContent className="text-center py-8">
            <p className="text-sm text-muted-foreground mb-3">
              No models added yet
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onAddModel(brandName)}
              className="flex items-center gap-2 mx-auto"
            >
              <Plus className="h-4 w-4" />
              Add First Model
            </Button>
          </CardContent>
        )}
      </div>
    </Card>
  );
}
