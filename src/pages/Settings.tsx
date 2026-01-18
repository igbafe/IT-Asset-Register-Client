import { useState, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import { UserAvatar } from "@/components/Avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import useBrandStore from "@/store/useBrandStore";
import { toast } from "react-toastify";
import CreateBrand from "@/components/form/brands/createBrand";
import { BrandCard } from "@/components/tabs/BrandCard";
import { AddModelDialog } from "@/components/tabs/AddModelDialog";
import { DeleteConfirmationDialog } from "@/components/tabs/DeleteConfirmation";

const SettingsPage = () => {
  const {
    brand,
    fetchBrands,
    deleteBrand,
    removeModelFromBrand,
    addModelToBrand,
    loading,
  } = useBrandStore();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addModelDialogOpen, setAddModelDialogOpen] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [deleteType, setDeleteType] = useState<"brand" | "model">("brand");
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const handleDeleteBrand = (brandName: string) => {
    setSelectedBrand(brandName);
    setDeleteType("brand");
    setDeleteDialogOpen(true);
  };

  const handleDeleteModel = (brandName: string, model: string) => {
    setSelectedBrand(brandName);
    setSelectedModel(model);
    setDeleteType("model");
    setDeleteDialogOpen(true);
  };

  const handleAddModelClick = (brandName: string) => {
    setSelectedBrand(brandName);
    setAddModelDialogOpen(true);
  };

  const handleAddModel = async (models: string[]) => {
    if (!selectedBrand || models.length === 0) return;

    try {
      // Add each model one by one
      let successCount = 0;

      for (const model of models) {
        const result = await addModelToBrand(selectedBrand, model);
        if (result.success) {
          successCount++;
        } else {
          toast.error(`Failed to add ${model}: ${result.error}`);
        }
      } 
      if (successCount > 0) {
        toast.success(
          `Successfully added ${successCount} model${successCount > 1 ? "s" : ""}`,
        );
        await fetchBrands();
        setAddModelDialogOpen(false);
      }
    } catch (error) {
      toast.error("An error occurred while adding models");
      console.error("Add model error:", error);
    }
  };

  const confirmDelete = async () => {
    if (!selectedBrand) return;

    setIsDeleting(true);
    try {
      if (deleteType === "brand") {
        const result = await deleteBrand(selectedBrand);
        if (result.success) {
          toast.success(result.message || "Brand deleted successfully");
          // Refetch to get fresh data
          await fetchBrands();
          setDeleteDialogOpen(false);
          setSelectedBrand(null);
        } else {
          toast.error(result.error || "Failed to delete brand");
        }
      } else if (deleteType === "model" && selectedModel) {
        const result = await removeModelFromBrand(selectedBrand, selectedModel);
        if (result.success) {
          toast.success(result.message || "Model removed successfully");
          // Refetch to get fresh data
          await fetchBrands();
          setDeleteDialogOpen(false);
          setSelectedBrand(null);
          setSelectedModel(null);
        } else {
          toast.error(result.error || "Failed to remove model");
        }
      }
    } catch (error) {
      toast.error("An error occurred during deletion");
      console.error("Delete error:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Ensure brand is always an array
  const brandList = Array.isArray(brand) ? brand : [];

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <AppSidebar />

        <div className="flex-1 p-5 flex flex-col min-w-0">
          <header className="flex mb-5 justify-between w-full sm:p-4 p-3 border-b dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-10">
            <h1 className="text-2xl sm:text-4xl font-bold truncate pr-4">
              Settings
            </h1>

            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <UserAvatar />
            </div>
          </header>

          <main className="flex-1 flex flex-col gap-7 w-full p-4 sm:p-6 overflow-y-auto hide-scrollbar">
            <Tabs defaultValue="brands" className="w-full ">
              <TabsList className="grid w-full max-w-md grid-cols-3 bg-white dark:bg-gray-900 dark:border-gray-800 border rounded-md">
                <TabsTrigger value="brands">Brands</TabsTrigger>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="brands" className="space-y-6 mt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-semibold">Brand Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add, edit, and manage laptop brands and models
                    </p>
                  </div>
                  <CreateBrand />
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : brandList.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Package className="h-12 w-12 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-4">
                        No brands found
                      </p>
                      <CreateBrand />
                    </CardContent>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {brandList.map((item) => (
                      <BrandCard
                        key={item.brandName}
                        brandName={item.brandName}
                        models={item.models}
                        onDeleteBrand={handleDeleteBrand}
                        onDeleteModel={handleDeleteModel}
                        onAddModel={handleAddModelClick}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="general" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>General Settings</CardTitle>
                    <CardDescription>
                      Manage your general application settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      General settings content goes here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="space-y-6 mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>
                      Manage your account preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      Account settings content goes here
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      <AddModelDialog
        open={addModelDialogOpen}
        onOpenChange={setAddModelDialogOpen}
        brandName={selectedBrand}
        onAddModel={handleAddModel}
      />

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        deleteType={deleteType}
        brandName={selectedBrand}
        modelName={selectedModel}
        onConfirm={confirmDelete}
        isDeleting={isDeleting}
      />
    </SidebarProvider>
  );
};

export default SettingsPage;
