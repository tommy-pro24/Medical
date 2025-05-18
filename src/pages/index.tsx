import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "@/components/ui/date-range-picker"
import TotalBox from "@/components/dashboard/totalBox";
import DashboardBarChart from "@/components/dashboard/DashboardBarChart";
import { useEffect } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export default function Home() {

  const router = useRouter();

  useEffect(() => {

    if (!Cookies.get('_id')) {

      router.push('/login/signin');

    }

  }, [router])

  return (
    <main className="m-0 px-4 sm:px-8 md:px-12 lg:px-20 bg-[#0f1729] w-full flex flex-col gap-5 min-h-screen text-white">
      <div className="flex flex-col sm:flex-row w-full py-4 sm:py-6 md:py-8 items-center justify-between px-2 md:px-6 gap-4">
        <p className="text-gray-100 font-bold text-xl sm:text-2xl md:text-[25px] c459m cbtcb">Dashboard</p>
        <DateRangePicker />
      </div>
      <div className="flex flex-col gap-10 sm:gap-16 md:gap-20">
        <div className="flex flex-col px-2 pb-3 border-b border-b-[#ffffff49]">
          <p className="text-gray-100 font-bold text-sm sm:text-[15px] ml-2 md:ml-6 c459m cbtcb">Inventory</p>
          <TotalBox />
        </div>
        <div className="flex flex-col px-2 pb-3 border-b border-b-[#ffffff49]">
          <p className="text-gray-100 font-bold text-sm sm:text-[15px] ml-2 md:ml-6 c459m cbtcb">Orders</p>
          <TotalBox />
        </div>
      </div>
      <div className="flex w-full overflow-x-auto">
        <DashboardBarChart />
      </div>
    </main>
  );
}
