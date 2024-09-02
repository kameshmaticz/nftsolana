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
          {/* <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon={elm.icon}
            // data-icon={`${config.IMG_URL}/socialimg/${elm?.img}`}

            className="h-5 w-5 fill-jacarta-300 group-hover:fill-accent dark:group-hover:fill-white"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox={elm.icon == "discord" ? "0 0 640 512" : "0 0 512 512"}
          >
            <path d={elm.svgPath}></path>
          </svg> */}
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
