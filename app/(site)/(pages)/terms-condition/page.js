"use client";
import Banner from "@/app/components/common/banner";
import { fetchSinglePage } from "@/app/helpers/backend";
import { useFetch } from "@/app/helpers/hooks";
import { columnFormatter } from "@/app/helpers/utils";
import { useI18n } from "@/app/providers/i18n";
import { Skeleton } from "antd";

const Page = () => {
  const [page, getPage, { loading }] = useFetch(fetchSinglePage, {
    slug: "terms_&_condition",
  });
  const i18n = useI18n();
  return (
    <div>
      <Banner title={i18n?.t("Terms Condition")} />
      <div className="custom-container ">
        {loading ? (
          <Skeleton active paragraph={{ rows: 6 }} />
        ) : (
          <div
            dangerouslySetInnerHTML={{ __html: columnFormatter(page?.content) }}
            className=" lg:my-[120px] my-16 break-all w-full"
          ></div>
        )}
      </div>{" "}
    </div>
  );
};

export default Page;
