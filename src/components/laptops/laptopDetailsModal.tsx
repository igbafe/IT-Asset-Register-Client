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
import { useNavigate } from "react-router-dom";

type laptopdetailsprops = {
  serialNumber?: string;
};

const LaptopDetailsModal = ({ serialNumber }: laptopdetailsprops) => {
  const { laptops } = useLaptopStore();
  const { downloadQRCode, fetchQRCodeBySerial } = useLaptopQRStore();
  const [open, setOpen] = useState(false);
  const [qrData, setQrData] = useState<LaptopQRCode | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      case LaptopStatus.RETIRED:
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
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
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {loading && <p>Loading QR Code...</p>}
        {!loading && qrData && (
          <>
            <DialogHeader>
              <div className="flex items-start justify-between">
                <div>
                  <DialogTitle className="text-2xl">
                    {laptop.systemName}
                  </DialogTitle>
                  <DialogDescription className="mt-1 text-base">
                    {laptop.brand} {laptop.model}
                  </DialogDescription>
                </div>
                <Badge
                  className={`${getStatusColor(laptop.status)} text-white mr-4`}
                >
                  {laptop.status || "Unknown"}
                </Badge>
              </div>
            </DialogHeader>

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
                      <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                        <div>
                          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                            Serial Number
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
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
                      </div>
                    </div>

                    {/* Right Column - QR Code */}
                    <div className="flex flex-col items-center justify-center gap-4">
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
                      <Button
                        onClick={() => {
                          if (qrData) {
                            navigate(`/laptops/qr/${qrData.serialNumber}`);
                          }
                        }}
                        className="w-full"
                      >
                        Open Scan Page
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Current User */}
              {laptop.currentUser && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-blue-900">
                        Current Assignment
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <User className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Full Name
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.currentUser.firstName}{" "}
                            {laptop.currentUser.lastName}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                            Email
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {laptop.currentUser.email}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="flex items-center gap-3">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                              Department
                            </p>
                            <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                              {laptop.currentUser.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar className="w-5 h-5 text-blue-600" />
                          <div className="flex-1">
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
                          className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
                        >
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3 flex-1">
                                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                                <div>
                                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                                    {user.firstName} {user.lastName}
                                  </p>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {user.email}
                                  </p>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-sm">
                                {user.department}
                              </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
                                    Assigned
                                  </p>
                                  <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                                    {formatDate(user.assignedDate)}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-2">
                                <CalendarClock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                                <div>
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
              {laptop.status === LaptopStatus.RETIRED && (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <CardTitle className="text-lg text-red-500">
                        Retirement Information
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-5 h-5 text-red-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium text-red-400">
                            Retirement Date
                          </p>
                          <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                            {formatDate(laptop.retirementDate)}
                          </p>
                        </div>
                      </div>

                      {laptop.retirementNote && (
                        <div className=" rounded-lg p-4 border border-red-200">
                          <p className="text-sm font-medium text-red-400 mb-2">
                            Retirement Note
                          </p>
                          <p className="text-base text-gray-900 dark:text-gray-100">
                            {laptop.retirementNote}
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Metadata
          <Card className="bg-gray-50">
            <CardContent className="pt-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Created
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(laptop.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Last Updated
                  </p>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {formatDate(laptop.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LaptopDetailsModal;
