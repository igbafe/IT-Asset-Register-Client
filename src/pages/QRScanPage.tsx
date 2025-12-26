import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { InfoRow } from "@/components/InfoRow";
import { useLaptopQRStore } from "@/store/useQrcodeStore";
import { LaptopStatusBadge } from "@/components/table/laptopDetails/laptopStatusBadge";
import type { LaptopStatus } from "@/types/types";

export default function LaptopQRScanPage() {
  const { serialNumber } = useParams<{ serialNumber: string }>();

  const { selectedQRCode, loading, error, fetchQRCodeBySerial } =
    useLaptopQRStore();

  useEffect(() => {
    if (serialNumber) {
      fetchQRCodeBySerial(serialNumber);
    }
  }, [serialNumber, fetchQRCodeBySerial]);

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

            <InfoRow label="Name" value={selectedQRCode.currentUser.fullName} />
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

        {/* Previous Users Card */}
        {selectedQRCode.previousUser &&
          selectedQRCode.previousUser.length > 0 && (
            <div className="bg-card rounded-lg shadow-sm border border-border p-6 space-y-4">
              <h2 className="text-lg font-semibold text-foreground mb-4">
                Previous Users
              </h2>

              {selectedQRCode.previousUser.map((user, index) => (
                <div
                  key={index}
                  className="pb-4 mb-4 border-b border-border last:border-b-0 last:pb-0 last:mb-0 space-y-3"
                >
                  <InfoRow label="Name" value={user.fullName} />
                  <InfoRow label="Email" value={user.email} />
                  <InfoRow label="Department" value={user.department} />
                  <InfoRow
                    label="Assigned Date"
                    value={new Date(user.assignedDate).toLocaleDateString()}
                  />
                  {user.returnedDate && (
                    <InfoRow
                      label="Returned Date"
                      value={new Date(user.returnedDate).toLocaleDateString()}
                    />
                  )}
                </div>
              ))}
            </div>
          )}

        <p className="text-xs text-center text-muted-foreground">
          This information is read-only
        </p>
      </div>
    </div>
  );
}
