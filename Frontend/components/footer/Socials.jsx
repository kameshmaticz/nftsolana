import { Sociallinks } from "@/actions/axios/cmsAxios";
import { socials } from "@/data/socials";
import { useEffect, useState } from "react";
import config from '../../Config/config'
import Image from "next/image";
export default function Socials() {
  const [link, setLink] = useState([]);
  useEffect(() => {
    Getlink()
  }, [])
  const Getlink = async () => {

    let link_res = await Sociallinks();
    console.log("linkss", link_res?.msg);
    setLink(link_res?.msg ?? [])
  }
  // {`${config.IMG_URL}/socialimg/${elm?.img}`}
  return (
    <>
      {link.map((elm, i) => (
        <a key={i} href={elm.link}  className="group inline-flex h-10 w-10 items-center justify-center rounded-full border border-jacarta-100 bg-white transition-colors hover:border-transparent hover:bg-accent dark:border-jacarta-600 dark:bg-jacarta-700 dark:hover:bg-accent" target="blank">
          <Image
            width={350}
            height={250}
            src={`${config.IMG_URL}/socialimg/${elm?.img}`}
            alt="post 2"
            className="w-[20px] h-[20px] object-cover "
          />
        </a>
      ))}
    </>
  );
}
