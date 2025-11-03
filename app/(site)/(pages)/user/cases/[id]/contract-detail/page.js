"use client";
import { useEffect } from "react";
import ViewContractForm from "@/app/components/contractForm/viewContract";
import { getContractByCaseId, updateCaseRequest } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { Card, message } from "antd";
import React from "react";
import { useUser } from "@/app/context/userContext";
import { useRouter } from "next/navigation";

const ViewContractPage = ({ params }) => {
  const { user } = useUser();
  const { push } = useRouter();

  const [data, getData] = useFetch(getContractByCaseId);
  useEffect(() => {
    if (params?.id) {
      getData({ caseId: params?.id });
    }
  }, [data?.id]);

    // console.log("Case Data for View Contract:", data);

  const caseUpdateHandler = async (status) => {
    try {
      const res = await updateCaseRequest({
        _id: data?.case?._id,
        status: status,
      });

      if (res?.error) {
        message.error(res?.msg || res?.message);
      } else {
        message.success(res?.msg || res?.message);
        push('/user/cases');
      }
    } catch {
      message.error("Failed to update status");
    }
  };


  return (
    <div>
      <Card>
        <ViewContractForm
          variant="view"
          userName={user?.name}
          caseID={data?.case?._id}
          data={data?.contract}
          referenceID={data?.case?.reference_id}
          handleAccept={() => caseUpdateHandler("invoice_pending")}
          handleDecline={() => caseUpdateHandler("contract_reject")}
        />
      </Card>
    </div>
  );
};

export default ViewContractPage;
