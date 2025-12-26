import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QRCodePreview } from "@/components/QRCode/QRCodePreview";
import { useLaptopQRStore } from "@/store/useQrcodeStore";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { UserAvatar } from "@/components/Avatar";
import { AppSidebar } from "@/components/Sidebar";
import { LaptopStatusBadge } from "@/components/table/laptopDetails/laptopStatusBadge";
import type { LaptopStatus } from "@/types/types";

export default function LaptopQRCodes() {
  const { qrCodes, loading, error, fetchAllQRCodes, setSelectedQRCode } =
    useLaptopQRStore();

  useEffect(() => {
    fetchAllQRCodes();
  }, [fetchAllQRCodes]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading QR codes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">{error}</p>
          <Button onClick={fetchAllQRCodes} variant="outline" size="sm">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-background">
        <AppSidebar />

        <div className="flex-1 flex flex-col min-w-0">
          <header className="flex items-center justify-between px-6 py-4 bg-card border-b border-border sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <h1 className="text-xl font-semibold text-foreground">
                Laptop QR Codes
              </h1>
            </div>
            <UserAvatar />
          </header>

          <main className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Your Devices
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {qrCodes.length}{" "}
                    {qrCodes.length === 1 ? "device" : "devices"} registered
                  </p>
                </div>
              </div>

              {qrCodes.length === 0 ? (
                <div className="text-center py-12 bg-card rounded-lg border border-border">
                  <p className="text-muted-foreground">No QR codes found</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {qrCodes.map((qr) => (
                    <div
                      key={qr.serialNumber}
                      className="bg-card border border-border rounded-lg p-5 hover:shadow-lg hover:border-primary/20 transition-all duration-200"
                    >
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-card-foreground text-lg">
                            {qr.systemName}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1">
                            {qr.serialNumber}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <LaptopStatusBadge
                            status={qr.status as LaptopStatus}
                          />
                        </div>

                        <Button
                          size="sm"
                          onClick={() => setSelectedQRCode(qr)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          View QR Code
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <QRCodePreview />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
