"use client";
import React, { useEffect } from "react";
import { Button, Card, message } from "antd";
import { VscLaw } from "react-icons/vsc";
import { useI18n } from "@/app/providers/i18n";
import { useFetch } from "@/app/helpers/hooks";
import GenerateContractForm from "@/app/components/contractForm/generateContract";
import { fetchCaseDetail } from "@/app/helpers/backend";

function SendContract({ params }) {
  const [data, getData] = useFetch(fetchCaseDetail);

  useEffect(() => {
    if (params?.id) {
      getData({ _id: params?.id });
    }
  }, [data?._id || data?.id]);

  const i18n = useI18n();

//   console.log("Case Data for Contract:", data);
  return (
    <div>
      <Card className=" mb-4 ">
        <div className="flex justify-between items-center ">
          <div className="!flex gap-4 items-center">
            <VscLaw className="text-3xl text-primary" />
            <h1 className="text-xl !text-primary !font-work capitalize font-semibold">
              {i18n?.t("Send Contract ")}
            </h1>
          </div>
        </div>
      </Card>
      <Card>
        <GenerateContractForm variant="create" userName={data?.user?.name} caseID={data?._id}  />
      </Card>
    </div>
  );
}

export default SendContract;
