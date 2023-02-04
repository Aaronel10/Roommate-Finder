import "../styles/globals.css";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { type AppType } from "next/dist/shared/lib/utils";
const queryClient = new QueryClient();
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

import AuthRedirectWrapper from "../components/AuthRedirectWrapper";
import Nav from "../components/nav";
const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AuthRedirectWrapper>
          {!router.pathname.includes("/auth") && <Nav />}
          <Component {...pageProps} />
          <ReactQueryDevtools initialIsOpen={true} position="bottom-right" />
          <Toaster
            position={"bottom-center"}
            containerClassName={"!bottom-16 !select-none !text-center"}
            gutter={16}
            toastOptions={{
              duration: 5000,
              className:
                "!bg-slate-900/80 !text-slate-50 !backdrop-blur-md dark:!bg-slate-100/90 dark:!text-slate-900",
              success: {
                className:
                  "!bg-emerald-900/80 !text-emerald-50 !backdrop-blur-md dark:!bg-emerald-100/90 dark:!text-emerald-900",
              },
              error: {
                className:
                  "!bg-red-900/80 !text-red-50 !backdrop-blur-md dark:!bg-red-100/90 dark:!text-red-900",
                icon: "🚨",
              },
            }}
          />
        </AuthRedirectWrapper>
      </QueryClientProvider>
    </>
  );
};

export default MyApp;
