import { useLaptopStore } from "@/store/useLaptopStore";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  User,
  Mail,
  Building2,
  Calendar,
  CalendarClock,
  AlertCircle,
  Eye,
} from "lucide-react";
import { LaptopStatus } from "@/types/types";
import type { LaptopQRCode } from "@/types/types";
import { useLaptopQRStore } from "@/store/useQrcodeStore";

type laptopdetailsprops = {
  serialNumber?: string;
};

const LaptopDetailsModal = ({ serialNumber }: laptopdetailsprops) => {
  const { laptops } = useLaptopStore();
  const { downloadQRCode, fetchQRCodeBySerial } = useLaptopQRStore();
  const [open, setOpen] = useState(false);
  const [qrData, setQrData] = useState<LaptopQRCode | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !serialNumber) return;
    setLoading(true);
    fetchQRCodeBySerial(serialNumber)
      .then((result) => {
        if (result.success) {
          setQrData(result.data || null);
        }
      })
      .finally(() => setLoading(false));
  }, [open, serialNumber, fetchQRCodeBySerial]);

  const laptop = laptops.find((l) => l.serialNumber === serialNumber);

  const getStatusColor = (status?: LaptopStatus) => {
    switch (status) {
      case LaptopStatus.AVAILABLE:
        return "bg-green-500";
      case LaptopStatus.ASSIGNED:
        return "bg-blue-500";
      case LaptopStatus.RETURNED:
        return "bg-yellow-500";
      case LaptopStatus.DECOMMISSIONED:
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const formatDate = (date?: Date | string) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (!laptop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 border-b">
            <DialogTitle>Laptop Not Found</DialogTitle>
            <DialogDescription>
              The laptop with serial number "{serialNumber}" could not be found.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 cursor-pointer dark:text-indigo-400 dark:hover:bg-indigo-950 flex items-center gap-1.5"
        >
          <Eye size={14} />
          View More
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <div className="flex-1">
              <DialogTitle className="text-2xl">
                {laptop.systemName}
              </DialogTitle>
              <DialogDescription className="mt-1 text-base">
                {laptop.brand} {laptop.model}
              </DialogDescription>
            </div>
            <Badge
              className={`${getStatusColor(laptop.status)} text-white`}
            >
              {laptop.status || "Unknown"}
            </Badge>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex items-center justify-center py-12 px-6">
            <p>Loading QR Code...</p>
          </div>
        )}

        {!loading && qrData && (
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="space-y-6">
              {/* System Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">System Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Primary Info */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Serial Number
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-all">
                            {laptop.serialNumber}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            System Name
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.systemName}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Brand
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.brand}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Model
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.model}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Operating System
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.os}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            RAM
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.ram}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Storage
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.rom}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Purchase Date
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {formatDate(laptop.purchaseDate)}
                          </p>
                        </div>
                        <div className="sm:col-span-2 lg:col-span-1">
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            End of Life Date
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {formatDate(laptop.endOfLifeDate)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column - QR Code */}
                    <div className="flex flex-col items-center justify-center gap-4 mt-4 lg:mt-0">
                      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                        <img
                          src={qrData?.qrCode}
                          alt="Laptop QR Code"
                          className="w-44 h-44 object-contain"
                        />
                      </div>
                      <Button
                        className="w-full max-w-[200px] bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white"
                        onClick={() =>
                          qrData && downloadQRCode(qrData.serialNumber)
                        }
                      >
                        Download QR Code
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current User */}
              {laptop.currentUser && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg text-blue-900 dark:text-blue-400">
                      Current User
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Full Name
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-words">
                            {laptop.currentUser.firstName}{" "}
                            {laptop.currentUser.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Email
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100 break-all">
                            {laptop.currentUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div className="flex items-start gap-3">
                          <Building2 className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              Department
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {laptop.currentUser.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              Assigned Date
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {formatDate(laptop.currentUser.assignedDate)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Previous Users */}
              {laptop.previousUser && laptop.previousUser.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Assignment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {laptop.previousUser.map((user, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition-colors"
                        >
                          <div className="space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                              <div className="flex items-start gap-3 flex-1 min-w-0">
                                <User className="w-5 h-5 text-gray-600 dark:text-gray-300 mt-0.5 shrink-0" />
                                <div className="min-w-0 flex-1">
                                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300 break-all">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-sm w-fit">
                                {user.department}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                              <div className="flex items-start gap-2">
                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Assigned
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {formatDate(user.assignedDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-start gap-2">
                                <CalendarClock className="w-4 h-4 text-gray-500 dark:text-gray-400 mt-0.5 shrink-0" />
                                <div className="min-w-0">
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Returned
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {formatDate(user.returnedDate)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Retirement Information */}
              {laptop.status === LaptopStatus.DECOMMISSIONED && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <CardTitle className="text-lg text-red-500">
                        Decommissioned Information
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-red-400">
                            Decommissioned Date
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {formatDate(laptop.decommissionDate)}
                          </p>
                        </div>
                      </div>

                      {laptop.decommissionNote && (
                        <div className="rounded-lg p-4 border border-red-200 dark:border-red-800">
                          <p className="text-sm font-medium text-red-400 mb-2">
                            Decommissioned Note
                          </p>
                          <p className="text-base text-gray-900 dark:text-gray-100 break-words">
                            {laptop.decommissionNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LaptopDetailsModal;