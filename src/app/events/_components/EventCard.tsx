"use client";

import { AiOutlineUser } from "react-icons/ai";
import { AiOutlineFieldTime } from "react-icons/ai";

import Image from "next/image";
import Link from "next/link";

import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { styled } from "@mui/material/styles";

export type CardListProps = {
  id: string;
  name: string;
  currency: string;
  progress: number;
  money: number;
  person: number;
  time: number;
  isFulfilled: boolean;
  isPending: boolean;
};

export default function EventCard({
  id,
  name,
  currency,
  progress,
  money,
  person,
  time,
  isFulfilled,
  isPending,
}: CardListProps) {
  const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
    width: "100%",
    borderRadius: 5,
    [`&.${linearProgressClasses.colorPrimary}`]: {
      backgroundColor:
        theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
    },
    [`& .${linearProgressClasses.bar}`]: {
      borderRadius: 5,
      backgroundColor: theme.palette.mode === "light" ? "#168ede" : "#308fe8",
    },
  }));

  return (
    <Link href={`/events/${id}`}>
      <Paper className="w-50 p-2 hover:cursor-pointer">
        <div className="flex flex-col items-center justify-center">
          <Image
            src="/events.jpeg"
            alt="event"
            width={300}
            height={300}
            className="p-5 "
          />
          <Typography className="break-all font-bold" variant="h4">
            {name}
          </Typography>
        </div>
        <p className="pl-6 text-xl font-bold text-dark-blue">
          {currency}$ {money}
        </p>
        <div className="flex flex-row items-center p-2">
          <BorderLinearProgress
            variant="determinate"
            className="m-2"
            value={progress > 100 ? 100 : progress}
          />
          <p className="text-light-blue">{progress}%</p>
        </div>
        <div className="flex flex-row items-center justify-end pb-2">
          {isFulfilled && (
            <Typography className="bg-green p-2 font-bold">
              Fulfilled
            </Typography>
          )}
          {isPending && (
            <Typography className="bg-yellow p-2 font-bold">pending</Typography>
          )}
          <AiOutlineUser className="text-dark-blue" />
          <p className="p-2 font-bold text-dark-blue">{person} people</p>
          <AiOutlineFieldTime className="text-dark-blue" />
          <p className="p-2 font-bold text-dark-blue">{time} days</p>
        </div>
      </Paper>
    </Link>
  );
}
