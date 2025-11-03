
import I18nProvider from "../providers/i18n";
import "./styles/app.scss"

export const metadata = {
    title: "Lawfirm Management System",
    description: "LawFirm Management System",
};

const RootLayout = ({ children }) => {
    return (
        <>
        <I18nProvider>
            {/* 
                <Providers> */}
                    {children}
                {/* </Providers>
             */}
        </I18nProvider>
        </>
    )
}


export default RootLayout