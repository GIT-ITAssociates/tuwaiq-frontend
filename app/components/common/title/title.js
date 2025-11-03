"use client";
import { useI18n } from "@/app/providers/i18n";
import { Card } from "antd";
import { VscLaw } from "react-icons/vsc";

const PageTitle = ({ title }) => {
    const i18n = useI18n()

    return (
        <Card className=" mb-4 ">
            <div className="!flex gap-4 items-center"> 
            <VscLaw className="text-3xl text-primary"/>
            <h1 className="text-xl !text-primary !font-work capitalize font-semibold">{(i18n?.t(title))}</h1>
            </div>
        </Card>
    )
}

export default PageTitle