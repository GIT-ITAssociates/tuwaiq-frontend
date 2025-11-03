"use client";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useFetch } from "@/app/helpers/hooks";
import { fetchAdminAllCases, updateCaseRequest } from "@/app/helpers/backend";
import { useI18n } from "@/app/providers/i18n";
import Table from "@/app/components/common/table/table";
import { Card, Select, Input, message } from "antd";
import { VscLaw } from "react-icons/vsc";

const Page = () => {
  // ✅ Auto-fetches on mount with default { status: "pending" }
  const [data, getData, { loading }] = useFetch(fetchAdminAllCases, {});
  const [searchQuery, setSearchQuery] = useState("");
  const i18n = useI18n();
  const { push } = useRouter();

  const langFromLocalStorage =
    typeof localStorage !== "undefined" ? localStorage.getItem("lang") : null;

  const currentLanguage = i18n?.languages?.find(
    (lang) => lang?._id === langFromLocalStorage
  )?.name;

  // ✅ Fetch filtered pending cases whenever search changes
  useEffect(() => {
    getData({ search: searchQuery.trim() });
  }, [searchQuery]);

  const handleSearch = (e) => setSearchQuery(e.target.value);

  const columns = [
     {
      text: "Reference #",
      dataField: "reference_id",
      formatter: (_, d) => <span>{d?.reference_id}</span>,
    },
    {
      text: "Court Name",
      dataField: "court_name",
      formatter: (_, d) => <span>{d?.court_name}</span>,
    },
    {
      text: "Case Type",
      dataField: "case_type",
      formatter: (_, d) => <span>{d?.case_type}</span>,
    },
    {
      text: "Client Name",
      dataField: "user_name",
      formatter: (_, d) => <span>{d?.user?.name}</span>,
    },
    {
      text: "Created Date",
      dataField: "createdAt",
      formatter: (_, d) => (
        <span>{dayjs(d?.createdAt).format("DD MMMM YYYY")}</span>
      ),
    },
    {
      text: "Case Status",
      dataField: "status",
      formatter: (_, d) => {
        const handleChange = async (newStatus) => {
          try {
            const res = await updateCaseRequest({
              _id: d._id,
              status: newStatus,
            });

            if (res?.error) {
              message.error(res?.msg || res?.message);
            } else {
              message.success(res?.msg || res?.message);
              getData({ search: searchQuery.trim() }); // ✅ refetch only pending
            }
          } catch {
            message.error("Failed to update status");
          }
        };

        return (
          <Select
            value={d?.status}
            onChange={handleChange}
            className="capitalize"
          >
            <Select.Option value="pending">Pending</Select.Option>
            <Select.Option value="accept">Accepted</Select.Option>
            <Select.Option value="decline">Rejected</Select.Option>
          </Select>
        );
      },
    },
  ];

  return (
    <div>
      <Card className="mb-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex gap-4 items-center">
            <VscLaw className="text-3xl text-primary" />
            <h1 className="text-xl text-primary font-work capitalize font-semibold">
              {i18n?.t(
                currentLanguage === "Arabic" ? "طلبات جديدة" : "New Requests"
              )}
            </h1>
          </div>

          {/* ✅ Search Input */}
          <Input
            placeholder={i18n?.t(
              currentLanguage === "Arabic"
                ? "ابحث عن القضايا..."
                : "Search cases..."
            )}
            value={searchQuery}
            onChange={handleSearch}
            className="w-[260px] border border-gray-300 rounded-md"
            allowClear
          />
        </div>
      </Card>

      <Table
        data={data}
        onReload={() => getData({ search: searchQuery.trim() })}
        columns={columns}
        pagination
        loading={loading}
        onView={(row) => {
          push(`/admin/our-cases/${row?._id || row?.id}`);
        }}
      />
    </div>
  );
};

export default Page;
