import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Image } from "@/components/ui/image";
import { useAuth } from "@/components/dashboard/AuthProvider";
import { Ref, useRef, useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { LoginValidating } from "~/components/dashboard/login.validating";
import { useTheme } from "~/hooks/useTheme";
import { MetaFunction } from "@remix-run/cloudflare";
import logo from "@/assets/login.png"
import { appConfig } from "~/lib/data/constants";

export const description =
  "A login page with two columns. The first column has the login form with email and password. There's a Forgot your passwork link and a link to sign up if you do not have an account. The second column has a cover image.";

export const meta: MetaFunction = () => {
  return [
    { title: `Login | ${appConfig.appName}` },
    { name: "description", content: `Login to ${appConfig.appName}` },
  ];
};

export default function Login() {
  const email: Ref<HTMLInputElement> = useRef(null);
  const [loading, setLoading] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [token, setToken] = useState("");
  const [validating, setValidating] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");

  const { login, isAuthenticated, navigate } = useAuth();

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const searchToken = searchParams.get("token");
    if (searchToken) {
      console.log("token", searchToken);
      setToken(searchToken);
      setValidating(true);
    }
  }, [searchParams]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin");
    } else {
      const savedEmail = localStorage.getItem("userEmail");
      if (savedEmail) {
        setEmailAddress(savedEmail);
      }
    }
  }, [isAuthenticated, navigate]);

  const onLogin = async () => {
    if (email?.current?.value) {
      try {
        setLoading(true);
        setInvalid(false);
        setLoginSuccess(false);
        const res = await login(email.current.value);
        if (res.ok) {
          setLoginSuccess(true);
          localStorage.setItem("userEmail", email.current.value);
        } else {
          setInvalid(true);
          email.current.select();
        }
      } finally {
        setLoading(false);
      }
    }
  };


  return (
    <div className="
      w-full 
      h-screen 
      items-stretch 
      justify-stretch 
      content-stretch 
      flex flex-col 
      lg:grid lg:min-h-[600px] 
      lg:grid-cols-2 
      xl:min-h-[800px]">

      <div className="
      flex 
      lg:hidden 
      lg:h-screen 
      items-center 
      justify-stretch 
      h-[50vh]
      ">
        <Image
          src={logo}
          alt="Image"
          width="auto"
          height="50vh"
          className="block object-cover"
        />

      </div>

      <div className="flex items-center justify-center flex-grow py-12 ">
        <div className="mx-auto grid w-[350px] gap-6 ">
          <div className="grid gap-2 ">
            <h1 className="text-3xl font-bold font-serif text-secondary-two">
              login
            </h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                defaultValue={emailAddress}
                required
                ref={email}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              variant={"default"}
              onClick={onLogin}
              disabled={loading}
            >
              Login
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            {loginSuccess && (
              <p className="text-green-500 text-xl font-semibold">
                Success, please check your email!
              </p>
            )}
            {invalid && <p className="text-red-500 text-xl">Invalid login!</p>}
            {/* Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link> */}
          </div>
        </div>
      </div>
      <LoginValidating open={validating} token={token} />
      <div className="hidden lg:flex h-screen items-stretch justify-center">
        <Image
          src={logo}
          alt="Image"
          width="auto"
          height="auto"
          className="block h-full w-full object-cover"
        />
      </div>
    </div>
  );
}
