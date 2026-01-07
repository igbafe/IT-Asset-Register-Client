import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, type LoginFormData } from "@/validation/authValidation";
import { toast } from "react-toastify";

const Login = () => {
  const { login, loading, loginWithGoogle } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  // Setup form validation with Zod
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const result = await login(data.email, data.password);
    if (result.success) {
      toast.success(result.message || "Login successful!");
      navigate(from, { replace: true });
    } else {
      toast.error(result.error || "Login failed");
    }
  };

  const handleGoogleLogin = () => {
    loginWithGoogle(); // Redirects to backend OAuth endpoint
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <h1 className="text-2xl pb-4 font-bold tracking-tight">
            IT Asset Register
          </h1>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email and password to access your account
          </CardDescription>
          <p className="text-sm mt-2">
            Don't have an account?{" "}
            <Link to="/signup" className="text-[#4f46e5] hover:underline">
              Sign Up
            </Link>
          </p>
        </CardHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <CardContent>
            <div className="flex flex-col gap-6">
              {/* Email */}
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <Link
                    to="/forgot-password"
                    className="ml-auto text-sm text-[#4f46e5] hover:underline"
                  >
                    Forgot password?
                  </Link> */}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Your password"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex-col gap-3">
            {/* Email/Password Login Button */}
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#4f46e5] text-white hover:bg-[#4338ca]"
            >
              {loading ? "Loading..." : "Login"}
            </Button>

            {/* Divider */}
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google OAuth Button */}
            <Button
              type="button"
              variant="outline"
              disabled={loading}
              onClick={handleGoogleLogin}
              className="w-full"
            >
              <svg
                className="mr-2 h-4 w-4"
                aria-hidden="true"
                focusable="false"
                data-prefix="fab"
                data-icon="google"
                role="img"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 488 512"
              >
                <path
                  fill="currentColor"
                  d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                ></path>
              </svg>
              Continue with Google
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
