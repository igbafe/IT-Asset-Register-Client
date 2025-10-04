import * as React from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export function PasskeyModal() {
  const { verifyOtp, resendOtp, loading, user } = useAuthStore();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.email) return;
    await verifyOtp(user.email, otp);
    navigate("/dashboard");
  };

  const handleResend = async () => {
    if (!user?.email) return;
    await resendOtp(user.email);
    setTimeLeft(60); // reset timer
  };

  // countdown effect
  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-md shadow-lg p-6">
        <CardHeader className="text-center">
          <CardTitle className="text-xl font-bold">Verify OTP</CardTitle>
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit code sent to your email
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="flex justify-center">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
              >
                <InputOTPGroup>
                  {[...Array(6)].map((_, index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="h-12 w-12 text-lg rounded-md border border-input shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-400"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>

            {/* <div className="text-center text-sm text-muted-foreground">
              {otp === "" ? (
                <>Please enter your one-time password</>
              ) : (
                <>
                  You entered: <span className="font-semibold">{v}</span>
                </>
              )}
            </div> */}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>

            {/* Resend code link */}
            <div className="text-center text-sm">
              {timeLeft > 0 ? (
                <span className="text-muted-foreground">
                  Resend available in {timeLeft}s
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResend}
                  className="text-blue-500 hover:underline"
                >
                  Resend Code
                </button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
