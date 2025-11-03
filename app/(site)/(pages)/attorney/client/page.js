"use client";
import UserDashboardTable from "@/app/components/common/table/userDashboardTable";
import { getAllClients } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { useI18n } from "@/app/providers/i18n";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IoEyeOutline } from "react-icons/io5";
const Clients = () => {
  const { push } = useRouter();
  const [clients, getClients, { loading: clientLoading }] =
    useFetch(getAllClients);
  const i18n = useI18n();
  const columns = [
    {
      text: "Client Name",
      dataField: "name",
      formatter: (_, d) => {
        return (
          <div className="flex lg:flex-row flex-col gap-2 items-center">
            <Image
              width={100}
              height={100}
              src={d?.user?.image || "/images/defaultimg.jpg"}
              alt="image"
              className="w-[50px] h-[50px] object-center rounded-full"
            />
            <span>{d?.user?.name}</span>
          </div>
        );
      },
    },
    {
      text: "Email",
      dataField: "email",
      formatter: (_, d) => {
        return <span>{d?.user?.email}</span>;
      },
    },
    {
      text: "Phone",
      dataField: "phone",
      formatter: (_, d) => {
        return <span>{d?.user?.phone_no}</span>;
      },
    },
    {
      text: "Action",
      dataField: "action",

      formatter: (_, d) => {
        return (
          <div
            className="grid cursor-pointer place-content-center w-[40px] h-[40px] hover:bg-primary hover:text-white text-[24px] rounded-[10px] border hover:border-primary border-[#E0E0E0]"
            onClick={() => {
              push(`/attorney/client/${d?._id || d?.id}`);
            }}
          >
            <IoEyeOutline />
          </div>
        );
      },
    },
  ];
  return (
    <div>
      <div className="flex sm:flex-row flex-col justify-between mx-5  my-7 items-center sm:gap-0 gap-6 lg:h-[56px] h-auto">
        <h1 className="dashboard-title">{i18n?.t("Client's")}</h1>
      </div>
      <hr />
      <div className=" px-[24px]">
        <UserDashboardTable
          data={clients}
          onReload={getClients}
          loading={clientLoading}
          columns={columns}
          pagination
        />
      </div>
    </div>
  );
};

export default Clients;
