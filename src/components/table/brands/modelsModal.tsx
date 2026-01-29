import { useState } from "react";
import {
  Edit2,
  Trash2,
  Check,
  Plus,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBrandStore from "@/store/useBrandStore";
import type { Brand } from "@/types/types";
import { toast } from "react-toastify";

interface ModelsModalProps {
  brand: Brand;
  isOpen: boolean;
  onClose: () => void;
}

export const ModelsModal = ({ brand, isOpen, onClose }: ModelsModalProps) => {
  const {
    updateModelInBrand,
    removeModelFromBrand,
    addModelToBrand,
    fetchBrands,
  } = useBrandStore();

  const [editingModel, setEditingModel] = useState<string | null>(null);
  const [editModelName, setEditModelName] = useState("");
  const [isAddingModel, setIsAddingModel] = useState(false);
  const [newModelName, setNewModelName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [modelToDelete, setModelToDelete] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const filteredModels = brand.models.filter((model) =>
    model.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentModels = filteredModels.slice(startIndex, endIndex);

  // Reset to first page when search changes
  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleUpdateModel = async (oldModel: string) => {
    if (!editModelName.trim()) {
      toast.error("Model name cannot be empty");
      return;
    }

    setLoading(true);
    const result = await updateModelInBrand(
      brand.brandName,
      oldModel,
      editModelName,
    );
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      await fetchBrands();
      setEditingModel(null);
      setEditModelName("");
    } else {
      toast.error(result.error);
    }
  };

  const handleDeleteModel = async () => {
    if (!modelToDelete) return;

    setLoading(true);
    const result = await removeModelFromBrand(brand.brandName, modelToDelete);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      await fetchBrands();

      // Adjust page if needed after deletion
      const newTotalPages = Math.ceil(
        (filteredModels.length - 1) / itemsPerPage,
      );
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    } else {
      toast.error(result.error);
    }

    setDeleteDialogOpen(false);
    setModelToDelete(null);
  };

  const handleAddModel = async () => {
    if (!newModelName.trim()) {
      toast.error("Model name cannot be empty");
      return;
    }

    setLoading(true);
    const result = await addModelToBrand(brand.brandName, newModelName);
    setLoading(false);

    if (result.success) {
      toast.success(result.message);
      await fetchBrands();
      setNewModelName("");
      setIsAddingModel(false);
    } else {
      toast.error(result.error);
    }
  };

  const openDeleteDialog = (model: string) => {
    setModelToDelete(model);
    setDeleteDialogOpen(true);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle className="text-2xl">
              {brand.brandName} Models
            </DialogTitle>
            <DialogDescription>
              {brand.models.length} total models
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-4">
              {/* Search and Add Button */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search models..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button
                  onClick={() => setIsAddingModel(true)}
                  disabled={loading}
                  className="whitespace-nowrap"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Model
                </Button>
              </div>

              {/* Add Model Form */}
              {isAddingModel && (
                <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
                  <h3 className="text-sm font-semibold mb-2">Add New Model</h3>
                  <div className="flex gap-2">
                    <Input
                      value={newModelName}
                      onChange={(e) => setNewModelName(e.target.value)}
                      placeholder="Model name"
                      disabled={loading}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAddModel();
                      }}
                    />
                    <Button
                      onClick={handleAddModel}
                      disabled={loading}
                      size="icon"
                      variant="default"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => {
                        setIsAddingModel(false);
                        setNewModelName("");
                      }}
                      disabled={loading}
                      size="icon"
                      variant="secondary"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Models Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentModels.map((model, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-3 rounded-lg border hover:border-primary transition"
                  >
                    {editingModel === model ? (
                      <>
                        <Input
                          value={editModelName}
                          onChange={(e) => setEditModelName(e.target.value)}
                          className="flex-1 h-9"
                          disabled={loading}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleUpdateModel(model);
                            if (e.key === "Escape") {
                              setEditingModel(null);
                              setEditModelName("");
                            }
                          }}
                        />
                        <Button
                          onClick={() => handleUpdateModel(model)}
                          disabled={loading}
                          size="icon"
                          variant="default"
                          className="h-9 w-9 shrink-0"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingModel(null);
                            setEditModelName("");
                          }}
                          disabled={loading}
                          size="icon"
                          variant="secondary"
                          className="h-9 w-9 shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <span
                          className="flex-1 text-sm break-words min-w-0"
                          title={model}
                        >
                          {model}
                        </span>
                        <div className="flex gap-1 shrink-0">
                          <Button
                            onClick={() => {
                              setEditingModel(model);
                              setEditModelName(model);
                            }}
                            disabled={loading}
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => openDeleteDialog(model)}
                            disabled={loading}
                            size="icon"
                            variant="ghost"
                            className="h-9 w-9 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {filteredModels.length === 0 && (
                  <div className="col-span-full text-center py-8 text-muted-foreground">
                    {searchTerm
                      ? "No models match your search"
                      : "No models yet"}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-
                    {Math.min(endIndex, filteredModels.length)} of{" "}
                    {filteredModels.length}
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="hidden sm:inline ml-1">Previous</span>
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <Button
                                key={page}
                                variant={
                                  currentPage === page ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() => goToPage(page)}
                                className="w-9"
                              >
                                {page}
                              </Button>
                            );
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-1">
                                ...
                              </span>
                            );
                          }
                          return null;
                        },
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <span className="hidden sm:inline mr-1">Next</span>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove <strong>{modelToDelete}</strong> from{" "}
              <strong>{brand.brandName}</strong>. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              disabled={loading}
              className="w-full sm:w-auto m-0"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteModel}
              disabled={loading}
              className="w-full sm:w-auto bg-destructive text-destructive-foreground hover:bg-destructive/90 m-0"
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
