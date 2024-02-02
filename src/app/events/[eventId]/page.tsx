"use client";

import { useEffect, useState } from "react";

import Image from "next/image";
import { useParams } from "next/navigation";

import Clock from "../../../components/Clock";
import ProductIntro from "../../../components/ProductIntro";
import { Button } from "@mui/material";
import { CircularProgress } from "@mui/material";
import type { CircularProgressProps } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import NoSsr from "@mui/material/NoSsr";
import Typography from "@mui/material/Typography";
import { useContractRead } from "wagmi";

import type { eventDetailDto } from "@/lib/types/db";
import { PoolABI } from "@/utils/abis/Pool";

import FundDialog from "./_components/FundDialog";
import VoteDialog from "./_components/VoteDialog";

function CircularProgressWithLabel(
  props: CircularProgressProps & { value: number },
) {
  console.log(props.value);
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }}>
      <CircularProgress
        variant="determinate"
        value={props.value >= 100 ? 100 : props.value}
        size="6rem"
      />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="dark-blue"
          className="text-xl font-bold"
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

function EventsIdPage() {
  const params = useParams();
  const [dbEvent, setDbEvent] = useState<eventDetailDto | null>(null);
  const [withdrawRate, setWithdrawRate] = useState<number>(0);
  // const [oppositionRate, setOppositionRate] = useState<number>(0);
  const { data: oppositionRate } = useContractRead({
    address: dbEvent?.eventAddress as `0x${string}`,
    abi: PoolABI,
    functionName: "firstPhaseOppose",
  });
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`/api/events/${params.eventId}`);
      const data = await response.json();
      setDbEvent(data);
    };
    setWithdrawRate(0);
    fetchData();
  }, [params.eventId]);

  function formatTimestamp(timestamp: number) {
    const date = new Date(Number(timestamp));
    return date.toLocaleDateString();
  }

  if (!dbEvent) {
    return <div>loading...</div>;
  }
  const closed = dbEvent.endDate < new Date().getTime();
  const timeExpect =
    dbEvent.startDate > new Date().getTime()
      ? dbEvent.startDate
      : dbEvent.endDate;

  const refreshData = async () => {
    const response = await fetch(`/api/events/${params.eventId}`);
    const data = await response.json();
    setDbEvent(data);
  };

  return (
    <div className="flex min-h-screen flex-col items-center">
      <div className="flex flex-row justify-center">
        <div className="pr-24">
          <Image
            src="/events.jpeg"
            alt="event"
            width={400}
            height={400}
            className="p-5 "
          />
        </div>
        {!closed ? (
          <div className="flex flex-col justify-center">
            <p className="p-4 text-6xl font-bold">{dbEvent?.title}</p>
            <div className="flex flex-row items-center p-4">
              <CircularProgressWithLabel
                value={(dbEvent.currentValue / dbEvent.targetValue) * 100}
              />
              <div className="pl-8">
                <p className="text-md pb-2">{`Target Amount: ${dbEvent?.currency}$ ${dbEvent?.targetValue}`}</p>
                <p className="pt-2 text-xl font-bold">{`Current Amount: ${dbEvent?.currency}$ ${dbEvent?.currentValue}`}</p>
              </div>
            </div>
            <p className="text-md p-2">
              {`duration: ${formatTimestamp(
                dbEvent.startDate,
              )} – ${formatTimestamp(dbEvent.endDate)}`}
            </p>
            <NoSsr>
              <Clock targetDate={timeExpect} />
            </NoSsr>
            <FundDialog
              eventId={dbEvent.displayId}
              poolAddress={dbEvent.eventAddress}
              nfts={dbEvent.nfts}
              onRefresh={refreshData}
            />
          </div>
        ) : (
          <div className="flex flex-col justify-center">
            <p className="p-4 text-6xl font-bold">{dbEvent?.title}</p>
            <div className="flex flex-row items-center p-4">
              <div className="mr-5">
                <p className="mb-2 text-lg font-bold">{"Withdraw Rate"}</p>
                <CircularProgressWithLabel value={withdrawRate} />
              </div>
              <div className="ml-5">
                <p className=" mb-2 text-lg font-bold">{"Opposition Rate"}</p>
                <CircularProgressWithLabel value={Number(oppositionRate)<100 ? Number(oppositionRate) : 100} />
              </div>
            </div>
            <p className="p-2 text-xl font-bold">{`Total Vault : ${dbEvent?.currency}$ ${dbEvent?.currentValue}`}</p>
            <p className="text-md p-2">
              {`Duration: ${formatTimestamp(
                dbEvent.startDate,
              )} – ${formatTimestamp(dbEvent.endDate)}`}
            </p>
            {Number(oppositionRate) > 0 ? (
              <Button 
              className="w-30 m-4 flex h-10 items-center justify-center rounded-2xl bg-dark-blue p-4 pb-2 pb-2 pt-2 pt-2 text-xl font-bold text-white hover:bg-light-blue"
              >
                {" "}
                Withdraw
              </Button>
            ) : (
              <VoteDialog
                poolAddress={dbEvent.eventAddress}
                onRefresh={refreshData}
              />
            )}
          </div>
        )}
      </div>
      <div className="flex w-[50%] flex-col justify-start p-8">
        <p className="flex justify-start p-2 text-4xl font-bold">Description</p>
        <Divider
          variant="middle"
          orientation="horizontal"
          sx={{ borderWidth: 1 }}
        />
        <p className="break-all p-2 text-xl">{dbEvent.description}</p>
      </div>
      <div className="justify-cent flex w-[50%] flex-col p-10">
        <ProductIntro nfts={dbEvent.nfts} />
      </div>
    </div>
  );
}

export default EventsIdPage;
