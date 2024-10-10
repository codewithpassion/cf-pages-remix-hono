import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";

/**
 * The main application layout.
 */
export function MainLayout(): JSX.Element {
  return (
    <Fragment>
      <div className="h-screen w-screen items-stretch justify-stretch flex bg-secondary-one">
        <div className="flex flex-col items-stretch justify-stretch content-stretch md:pt-[60px] w-full h-full">
          {/* New centered div */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full md:w-[90vw] lg:w-[70vw] h-full md:h-[90vh] lg:h-[80vh] bg-white rounded-2xl p-4">
              <Suspense>
                <Outlet />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
