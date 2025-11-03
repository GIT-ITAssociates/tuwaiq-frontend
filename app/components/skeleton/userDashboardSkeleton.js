"use client";
import { IoMdMenu } from "react-icons/io";
import { Drawer, Space, Skeleton } from "antd";
const UserDashboardSkeleton = ({
  open,
  showDrawer,
  onClose,
  isSidebarOpen,
  toggleSidebar,
}) => {
  return (
    <div className="custom-container lg:pt-[150px] pt-[150px] lg:pb-[150px] pb-[100px]">
      {/* Small Screen Sidebar */}
      <div className="flex items-end justify-between mb-[56px]">
        <div className="md:w-[353px] w-[300px]">
          <Skeleton active paragraph={{ rows: 1 }} className="pb-[24px]" />
          <Skeleton active paragraph={{ rows: 2 }} />
        </div>
        <Space className="lg:hidden block">
          <IoMdMenu className="text-[40px]" onClick={showDrawer} />
        </Space>

        <Drawer
          placement={"right"}
          closable={false}
          onClose={onClose}
          open={open}
        >
          <Skeleton active paragraph={{ rows: 6 }} />
        </Drawer>
      </div>

      <div className="w-full flex lg:flex-row flex-col gap-6">
        {/* Large Screen Sidebar */}
        <div className="hidden lg:block lg:w-1/4 w-full border rounded-[20px] pb-[113px] shadow-md overflow-hidden">
          <div className="animate-pulse">
            <div className="bg-[#EDEDED]">
              <div className="flex justify-start ps-4 items-center gap-[10px] py-[34px]">
                <div className="w-[48px] h-[48px] rounded-full bg-gray-300"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-300 rounded mb-2"></div>
                  <div className="h-3 w-32 bg-gray-300 rounded"></div>
                </div>
              </div>
            </div>
            <div className="pt-[40px] mx-auto px-4 w-[242px]">
              <nav className="space-y-[27px]">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="flex items-center gap-[15px]">
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </div>
                ))}
                <div className="pt-[50px] space-y-[27px]">
                  <div className="flex items-center gap-[15px]">
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </div>
                  <div className="flex items-center gap-[15px]">
                    <div className="h-6 w-6 bg-gray-300 rounded"></div>
                    <div className="h-4 w-24 bg-gray-300 rounded"></div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>

        {/* Backdrop for Small Screens */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-40"
            onClick={toggleSidebar}
          ></div>
        )}

        {/* Content Section */}
        <div className="lg:w-3/4 w-full shadow-md rounded-[20px] border overflow-hidden p-6">
        <div>
        <Skeleton active paragraph={{ rows: 1 }} />
      <div className="pt-10">
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6 ">
          {[...Array(5)].map((_, index) => (
            <DashboardCardSkeleton key={index} />
          ))}
        </div>

        <div className="grid xl:grid-cols-2 grid-cols-1 gap-[22px] md:mt-[60px] mt-[50px] lg:pb-[38px] pb-5">
          <SkeletonBlock height="180px" />
          <SkeletonBlock height="180px" />
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboardSkeleton;
const DashboardCardSkeleton = () => {
  return (
    <div className="lg:w-[208px] w-full h-[132px] p-6 border rounded-[10px] shadow-lg cursor-pointer animate-pulse bg-gray-200">
      <div className="flex items-center gap-3">
        <div className="rounded-full h-10 w-10 bg-gray-300" />
        <div className="w-24 h-5 bg-gray-300 rounded-md" />
      </div>
      <div className="ml-10 w-16 h-6 bg-gray-300 rounded-md mt-3" />
    </div>
  );
};

const SkeletonBlock = ({ height }) => {
  return (
    <div
      className="w-full bg-gray-200 animate-pulse rounded-[10px]"
      style={{ height }}
    />
  );
};