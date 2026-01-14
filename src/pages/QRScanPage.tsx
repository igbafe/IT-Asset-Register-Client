import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { InfoRow } from "@/components/InfoRow";
import { useLaptopQRStore } from "@/store/useQrcodeStore";
import { LaptopStatusBadge } from "@/components/table/laptopDetails/laptopStatusBadge";
import type { LaptopStatus } from "@/types/types";
import { User, Mail, Building2, Calendar, CalendarClock } from "lucide-react";

export default function LaptopQRScanPage() {
  const { serialNumber } = useParams<{ serialNumber: string }>();

  const { selectedQRCode, loading, error, fetchQRCodeBySerial } =
    useLaptopQRStore();

  useEffect(() => {
    if (!serialNumber) return;

    // Only fetch if we don't have data or if the serial number changed
    if (!selectedQRCode || selectedQRCode.serialNumber !== serialNumber) {
      fetchQRCodeBySerial(serialNumber);
    }
  }, [serialNumber, selectedQRCode, fetchQRCodeBySerial]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading laptop details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-destructive font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!selectedQRCode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Laptop not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6">
          <h1 className="text-2xl font-bold text-foreground text-center mb-4">
            Laptop Information
          </h1>

          <div className="bg-background rounded-lg p-6 border border-border w-fit mx-auto">
            <img
              src={selectedQRCode.qrCode}
              alt="Laptop QR Code"
              className="w-40 h-40"
            />
          </div>
        </div>

        {/* Device Details Card */}
        <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-3">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Device Details
          </h2>

          <InfoRow label="System Name" value={selectedQRCode.systemName} />
          <InfoRow label="Brand" value={selectedQRCode.brand} />
          <InfoRow label="Model" value={selectedQRCode.model} />
          <InfoRow label="Serial Number" value={selectedQRCode.serialNumber} />
          <InfoRow label="RAM" value={selectedQRCode.ram} />
          <InfoRow label="Storage" value={selectedQRCode.rom} />
          <InfoRow label="Operating System" value={selectedQRCode.os} />

          <div className="pt-2">
            <InfoRow
              label="Status"
              value={
                <div className="flex items-center gap-2">
                  <LaptopStatusBadge
                    status={selectedQRCode.status as LaptopStatus}
                  />
                </div>
              }
            />
          </div>

          {selectedQRCode.retirementDate && (
            <InfoRow
              label="Retirement Date"
              value={new Date(
                selectedQRCode.retirementDate
              ).toLocaleDateString()}
            />
          )}
        </div>

        {/* Current User Card */}
        {selectedQRCode.currentUser && (
          <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-3">
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Current User
            </h2>

            <InfoRow
              label="First Name"
              value={selectedQRCode.currentUser.firstName}
            />
            <InfoRow
              label="Last Name"
              value={selectedQRCode.currentUser.lastName}
            />
            <InfoRow label="Email" value={selectedQRCode.currentUser.email} />
            <InfoRow
              label="Department"
              value={selectedQRCode.currentUser.department}
            />
            <InfoRow
              label="Assigned Date"
              value={new Date(
                selectedQRCode.currentUser.assignedDate
              ).toLocaleDateString()}
            />
          </div>
        )}

        {/* Previous Users Card - Enhanced */}
        {selectedQRCode.previousUser &&
          selectedQRCode.previousUser.length > 0 && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-6">
              <h2 className="text-lg font-semibold text-foreground">
                Assignment History
              </h2>

              <div className="space-y-4">
                {selectedQRCode.previousUser.map((user, index) => (
                  <div
                    key={index}
                    className="relative bg-muted/30 dark:bg-muted/10 rounded-lg p-5 border-l-4 border-[oklch(0.488_0.243_264.376)] hover:bg-muted/50 dark:hover:bg-muted/20 transition-colors"
                  >
                    {/* User number badge */}
                    <div className="absolute -top-3 left-4 bg-[oklch(0.488_0.243_264.376)] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                      User #{selectedQRCode.previousUser!.length - index}
                    </div>

                    <div className="mt-2 space-y-4">
                      {/* Name and Email Section */}
                      <div className="grid grid-cols-1 gap-4">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-[oklch(0.488_0.243_264.376)]/10 dark:bg-[oklch(0.488_0.243_264.376)]/20 p-2 rounded-lg">
                            <User className="w-4 h-4 text-[oklch(0.488_0.243_264.376)]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Full Name
                            </p>
                            <p className="text-sm font-semibold text-foreground">
                              {user.firstName} {user.lastName}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="mt-1 bg-[oklch(0.488_0.243_264.376)]/10 dark:bg-[oklch(0.488_0.243_264.376)]/20 p-2 rounded-lg">
                            <Mail className="w-4 h-4 text-[oklch(0.488_0.243_264.376)]" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-muted-foreground mb-1">
                              Email
                            </p>
                            <p className="text-sm font-semibold text-foreground break-all">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Department */}
                      <div className="flex items-start gap-3">
                        <div className="mt-1 bg-[oklch(0.488_0.243_264.376)]/10 dark:bg-[oklch(0.488_0.243_264.376)]/20 p-2 rounded-lg">
                          <Building2 className="w-4 h-4 text-[oklch(0.488_0.243_264.376)]" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-medium text-muted-foreground mb-1">
                            Department
                          </p>
                          <p className="text-sm font-semibold text-foreground">
                            {user.department}
                          </p>
                        </div>
                      </div>

                      {/* Dates Section */}
                      <div className="pt-3 border-t border-border/50">
                        <div className="grid grid-cols-1 gap-4">
                          <div className="flex items-start gap-3">
                            <div className="mt-1 bg-green-500/10 dark:bg-green-500/20 p-2 rounded-lg">
                              <Calendar className="w-4 h-4 text-green-600 dark:text-green-400" />
                            </div>
                            <div className="flex-1">
                              <p className="text-xs font-medium text-muted-foreground mb-1">
                                Assigned Date
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {new Date(user.assignedDate).toLocaleDateString(
                                  "en-US",
                                  {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  }
                                )}
                              </p>
                            </div>
                          </div>

                          {user.returnedDate && (
                            <div className="flex items-start gap-3">
                              <div className="mt-1 bg-orange-500/10 dark:bg-orange-500/20 p-2 rounded-lg">
                                <CalendarClock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs font-medium text-muted-foreground mb-1">
                                  Returned Date
                                </p>
                                <p className="text-sm font-semibold text-foreground">
                                  {new Date(
                                    user.returnedDate
                                  ).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                  })}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        <p className="text-xs text-center text-muted-foreground">
          This information is read-only
        </p>
      </div>
    </div>
  );
}
