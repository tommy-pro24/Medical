import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "@/components/ui/date-range-picker"
import TotalBox from "@/components/dashboard/totalBox";
import DashboardBarChart from "@/components/dashboard/DashboardBarChart";
import { useEffect, useState } from "react";
import { useData } from "@/context/DataContext";
import { useWebSocketContext } from '@/context/WebSocketContext';
import { DateRange } from "react-day-picker";
import React from "react";
import { subDays } from "date-fns";
import { request } from "@/lib/request";
import TotalProduct from "@/components/ui/totalProduct";
import LowProducts from "@/components/ui/lowProducts";
import Orders from "@/components/ui/orders";
import Transit from "@/components/ui/transit";

export default function Home() {
  const { getCurrentUser } = useData();
  const { sendMessage } = useWebSocketContext();
  const [cards, setCards] = useState([
    {
      title: "Total Products",
      value: "0 types, 0 pieces",
      desc: "Items in inventory",
      Icon: TotalProduct,
      style: 0
    },
    {
      title: "Low Stock Alert",
      value: "0 types",
      desc: "Items need restock",
      Icon: LowProducts,
      style: 1
    },
    {
      title: "Stock in",
      value: "0 pieces",
      desc: "Items in inventory",
      Icon: TotalProduct,
      style: 0
    },
    {
      title: "Stock out",
      value: "0 pieces",
      desc: "Items in inventory",
      Icon: TotalProduct,
      style: 0
    },
  ]);
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 7),
    to: new Date(),
  })

  const [orderCards, setOrderCards] = useState([
    {
      title: "Pending",
      value: "5",
      desc: "Awaiting processing",
      Icon: Orders,
      style: 2
    },
    {
      title: "Dispatched",
      value: "5",
      desc: "Currently in delivery",
      Icon: Transit,
      style: 3
    },
    {
      title: "in-transit",
      value: "5",
      desc: "Completed deliveries",
      Icon: Orders,
      style: 4
    },
    {
      title: "confirmed",
      value: "5",
      desc: "Completed deliveries",
      Icon: Orders,
      style: 4
    },
    {
      title: "cancelled",
      value: "5",
      desc: "Completed deliveries",
      Icon: Orders,
      style: 4
    }
  ])


  useEffect(() => {
    if (getCurrentUser() && date) onLoad();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getCurrentUser(), date]);

  const onLoad = async () => {
    sendMessage({
      type: "GET_ORDERS",
      payload: {
        token: getCurrentUser()?.token
      },
      timestamp: Date.now(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await request({
      method: "POST",
      url: '/dashboard/getData',
      data: {
        from: date?.from,
        to: date?.to
      },
      headers: {
        'Content-Type': 'application/json',
      }
    })

    if (response) {

      setCards(prevCards => [
        {
          ...prevCards[0],
          value: `${response.totalProductTypes} types, ${response.totalProducts} pieces`
        },
        {
          ...prevCards[1],
          value: `${response.lowStockProductTypes} types`
        },
        {
          ...prevCards[2],
          value: `${response.stockCounts?.['stock-in']?.typeCount ?? 0} types, ${response.stockCounts?.['stock-in']?.quantity ?? 0} pieces`
        },
        {
          ...prevCards[3],
          value: `${response.stockCounts?.['stock-out']?.typeCount ?? 0} types, ${response.stockCounts?.['stock-out']?.quantity ?? 0} pieces`
        }
      ]);

      setOrderCards(prevCards => [
        {
          ...prevCards[0],
          value: `${response?.orders?.pending}`
        },
        {
          ...prevCards[1],
          value: `${response?.orders?.dispatched}`
        },
        {
          ...prevCards[2],
          value: `${response?.orders?.transit}`
        },
        {
          ...prevCards[3],
          value: `${response?.orders?.confirmed}`
        },
        {
          ...prevCards[4],
          value: `${response?.orders?.cancelled}`
        }
      ])

    }
  };

  return (
    <main className="m-0 px-4 sm:px-8 md:px-12 lg:px-20 bg-[#0f1729] w-full flex flex-col gap-5 min-h-screen text-white">
      <div className="flex flex-col sm:flex-row w-full py-4 sm:py-6 md:py-8 items-center justify-between px-2 md:px-6 gap-4">
        <p className="text-gray-100 font-bold text-xl sm:text-2xl md:text-[25px] c459m cbtcb">Dashboard</p>
        <DateRangePicker setDate={setDate} date={date} />
      </div>
      <div className="flex flex-col gap-10 sm:gap-16 md:gap-20">
        <div className="flex flex-col px-2 pb-3 border-b border-b-[#ffffff49]">
          <p className="text-gray-100 font-bold text-sm sm:text-[15px] ml-2 md:ml-6 c459m cbtcb">Inventory</p>
          <TotalBox cards={cards} />
        </div>
        <div className="flex flex-col px-2 pb-3 border-b border-b-[#ffffff49]">
          <p className="text-gray-100 font-bold text-sm sm:text-[15px] ml-2 md:ml-6 c459m cbtcb">Orders</p>
          <TotalBox cards={orderCards} />
        </div>
      </div>
      <div className="flex w-full overflow-x-auto">
        <DashboardBarChart />
      </div>
    </main>
  );
}
