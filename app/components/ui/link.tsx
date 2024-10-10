import * as React from "react";

import { cn } from "@/lib/utils";

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <a
        className={cn("flex items-center gap-2 font-semibold", className)}
        ref={ref}
        {...props}
      >
        {children}
      </a>
    );
  }
);
Link.displayName = "Input";

export { Link };
