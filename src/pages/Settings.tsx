import { useEffect } from "react";
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

import CreateBrand from "@/components/form/brands/createBrand";
import { columns } from "@/components/table/brands/brandColumns";
import { DataTable } from "@/components/table/data-table";

const SettingsPage = () => {
  const {
    brand,
    fetchBrands,

    loading,
  } = useBrandStore();

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

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
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold">
                      Brand Management
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1 max-w-xl">
                      Add, edit, and manage laptop brands and models
                    </p>
                  </div>

                  <div className="self-start sm:self-auto">
                    <CreateBrand />
                  </div>
                </div>

                {loading ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  </div>
                ) : brand.length === 0 ? (
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
                  <div className="mt-6">
                    <DataTable columns={columns} data={brand} />
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
    </SidebarProvider>
  );
};

export default SettingsPage;
