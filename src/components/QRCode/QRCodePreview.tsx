import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useLaptopQRStore } from "@/store/useQrcodeStore";

export function QRCodePreview() {
  const navigate = useNavigate();

  const { selectedQRCode, downloadQRCode, setSelectedQRCode } =
    useLaptopQRStore();

  if (!selectedQRCode) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => setSelectedQRCode(null)}
    >
      <div
        className="bg-card border border-border rounded-lg w-full max-w-md shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 space-y-5">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold text-foreground">
              {selectedQRCode.systemName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Serial: {selectedQRCode.serialNumber}
            </p>
          </div>

          <div className="bg-background rounded-lg p-6 border border-border">
            <img
              src={selectedQRCode.qrCode}
              alt="Laptop QR Code"
              className="mx-auto w-48 h-48"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => {
                setSelectedQRCode(null);
                navigate(`/laptops/qr/${selectedQRCode.serialNumber}`);
              }}
              className="w-full"
            >
              Open Scan Page
            </Button>

            <div className="flex gap-2">
              <Button
                variant="secondary"
                className="bg-indigo-600 hover:bg-indigo-700 text-white flex-1"
                onClick={() => downloadQRCode(selectedQRCode.serialNumber)}
              >
                Download
              </Button>

              <Button
                variant="outline"
                className="flex-1 "
                onClick={() => setSelectedQRCode(null)}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
