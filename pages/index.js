import { Inter } from "next/font/google";
import Layout from "@/components/Layout";
import Products from "./products";
import { useSession } from "next-auth/react";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="text-blue-900 flex justify-between">
        <h1>
          Hello : <b> {session?.user?.name}</b>
        </h1>
        <div className="flex bg-gray-300 gap 1 text-black rounded-lg overflow-hidden">
          {/* <Image src={session?.user?.image} alt="photo" className="w-6 h-6" /> */}
          <span className=" px-2"> </span>
          {session?.user?.name}
        </div>
      </div>
    </Layout>
  );
}
