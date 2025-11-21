"use client";
import "./globals.css";
import Header from "@/components/layouts/header";
import Footer from "@/components/layouts/footer";
import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { AnimatePresence } from "framer-motion";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { useAutoLogin } from "@/hooks/useAutoLogin";

function AppWrapper({ children }: { children: React.ReactNode }) {
  useAutoLogin();
  return <>{children}</>;
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith("/admin");
  const isInformation = pathname.startsWith("/information");
  const isSuccessRoute = pathname.startsWith("/success");
  const isFailRoute = pathname.startsWith("/fail");
  const isNotFoundRoute = pathname.startsWith("/notfound");
  const isAuthRoute = pathname.startsWith("/auth");

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <AppWrapper>
            <Toaster />
            {isAdminRoute || isSuccessRoute || isFailRoute || isNotFoundRoute ? (
              <div>{children}</div>
            ) :
              isAuthRoute || isInformation ? (
                <AnimatePresence mode="wait">
                  <div key={pathname}>{children}</div>
                </AnimatePresence>
              ) : (
                <>
                  <Header />
                  {children}
                  <Footer />
                </>
              )}
          </AppWrapper>
        </Provider>
      </body>
    </html>
  );
}
