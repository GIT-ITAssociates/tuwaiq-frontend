import { ModalProvider } from "./context/modalContext";
import { UserProvider } from "./context/userContext";
import I18nProvider from "./providers/i18n";
import "./styles/global.scss";


export async function generateMetadata() {
  try {
    const res = await fetch(`${process.env.backend_url}api/settings`, {
      cache: "no-store",
    });
    console.log("🚀 ~ generateMetadata ~ res:", res)

    if (!res.ok) {
      throw new Error(
        `Failed to fetch metadata: ${res.status} ${res.statusText}`
      );
    }

    const data = await res.json();
    console.log("🚀 ~ generateMetadata ~ data:setting", data);

    return {
      title: data?.data?.meta_title || "Tuwaiq Law Firm",
      description: data?.data?.meta_description || "Tuwaiq Law Firm",
      icons: {
        icon: data?.data?.favicon || "/favicon.ico",
      },
    };
  } catch (error) {
    console.error("Metadata fetch error:", error);
    return {
      title: "Tuwaiq Law Firm",
      description: "Tuwaiq Law Firm",
      icons: {
        icon: "/favicon.ico",
      },
    };
  }
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" type="image/x-icon" href="/images/favimage.png" />
        <title>Lawfirm Management System</title>
      </head>
      <body
        suppressHydrationWarning
      >
        <I18nProvider>
          <UserProvider>
            <ModalProvider>
              {children}
            </ModalProvider>
          </UserProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
