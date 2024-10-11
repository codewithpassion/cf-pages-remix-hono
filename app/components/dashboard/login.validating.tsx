import { useAuth } from "@/components/dashboard/AuthProvider";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Spinner } from "@/components/ui/spinner";
import { useEffect, useRef, useState } from "react";

export function LoginValidating({
  open,
  token,
}: {
  open: boolean;
  token: string | null;
}) {
  const isValidating = useRef(false);
  const { validateMagicToken } = useAuth();
  const [invalid, setInvalid] = useState(false);

  useEffect(() => {
    if (token && open && !isValidating.current) {
      console.log("Validating token", token);
      isValidating.current = true;

      validateMagicToken(token).then((res) => {
        if (res.ok) {
          console.log("Token validated");
          setInvalid(false);
        } else {
          setInvalid(true);
          console.log("Failed to validate token");
        }
      });
    }
  }, [token, open, validateMagicToken]);

  return (
    <Dialog open={open} modal>
      <DialogContent className="sm:max-w-[425px]" hideClose>
        <DialogHeader>
          <DialogTitle>Validating login</DialogTitle>
          {/* <DialogDescription>Validating...</DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <p className="text-center col-span-4">
              {!invalid && <Spinner />}
              {invalid && (
                <>
                  <span className="text-red-500 text-xl">Invalid token</span>
                  <br />
                  <span>Please check your link.</span>
                </>
              )}
            </p>

            {/* <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input id="name" defaultValue="Pedro Duarte" className="col-span-3" /> */}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            {/* <Label htmlFor="username" className="text-right">
            Username
          </Label>
          <Input
            id="username"
            defaultValue="@peduarte"
            className="col-span-3"
          /> */}
          </div>
        </div>
        <DialogFooter>
          {/* <Button type="submit">Save changes</Button> */}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
