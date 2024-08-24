"use client";

import Card from "@/components/home/card";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="z-10 w-full max-w-xl px-5 xl:px-0 text-center">
        <h1 className="bg-gradient-to-br from-black to-stone-500 bg-clip-text text-center font-display text-4xl font-bold tracking-[-0.02em] text-transparent drop-shadow-sm md:text-7xl md:leading-[5rem]">
          Welcome to ChefConnect
        </h1>
        <p className="mt-6 text-center text-gray-500 md:text-xl">
          Whether you want to cater or find catering services, we are here to
          connect you!
        </p>
      </div>

      <div className="mt-10 grid w-full max-w-screen-xl grid-cols-1 gap-5 px-5 md:grid-cols-2 xl:px-0">
        <Card
          title="Find Catering Services"
          description="Looking to hire a chef or find catering services for your next event? Click here to browse available chefs."
          demo={
            <Link href="/chefs/browse">
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
                Browse Chefs
              </button>
            </Link>
          }
        />

        <Card
          title="Offer Catering Services"
          description="Are you a chef looking to offer catering services? Click here to set up your profile and start connecting with clients."
          demo={
            <Link href="/chefs/profile">
              <button className="bg-green-500 text-white px-4 py-2 rounded-lg">
                Become a Chef
              </button>
            </Link>
          }
        />
      </div>
    </>
  );
}
