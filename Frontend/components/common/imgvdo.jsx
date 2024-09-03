import Image from "next/image";

//File
import { isEmpty } from "@/actions/common";

import { useEffect, useState } from "react";

export default function ImgAudVideo({
  file,
  type,
  classname,
  thumb,
  origFile,
  height,
  width,
  data_bs_toggle,
  data_bs_target,
  from,
  noimg,
}) {
  useEffect(() => {
    const preventContextMenu = (event) => {
      event.preventDefault();
    };

    const images = document.querySelectorAll("img");

    images.forEach((image) => {
      image.addEventListener("contextmenu", preventContextMenu);
    });

    return () => {
      images.forEach((image) => {
        image.removeEventListener("contextmenu", preventContextMenu);
      });
    };
  }, []);
  // console.log("fileeeeeee",file,type)
  var [Check, setCheck] = useState(false);
  const Audioaction = () => {
    var aud = document.getElementById("nftaudio");
    if (Check == false) {
      aud.play();
      setCheck(!Check);
    } else {
      aud.pause();
      setCheck(!Check);
    }
  };
  console.log("filessss", type , file);

  return type && file ? (
    type === "image" ? (
      <Image
        width={width ?? 230}
        height={height ?? 230}
        src={isEmpty(file) ? "/img/products/item_5.jpg" : file ? file.includes('undefined') ?  "/img/products/item_5.jpg" :  file : "/img/products/item_5.jpg"}
        alt="item 5"
        className={classname ? classname : "w-full rounded-[0.625rem] imgset"}
        loading="lazy"
        onError={(event) => {
          event.target.src = origFile;
        }}
         data-bs-toggle={data_bs_toggle ?? ""}
                data-bs-target={data_bs_target ?? ""}
      />
    ) : type === "video" ? (
      <video
        loop={true}
        controlsList="nodownload"
        autoPlay={true}
        controls
        poster={thumb}
        muted
        // onContextMenu="return false;"
        type="video/*"
        src={file}
        width={width ?? 230}
        height={height ?? 230}
        preload="none"
        className={classname ? classname :"w-full rounded-[0.625rem] imgset"}
        onError={(event) => {
          event.target.src = origFile;
        }}
        data-bs-toggle={data_bs_toggle ?? ""}
        data-bs-target={data_bs_target ?? ""}
      ></video>
    ) : type === "audio" ? (
      <>
        {" "}
        <img
          src={thumb}
          alt="favicon"
          onClick={Audioaction}
          className={classname}
        />
        <audio
          controlsList="nodownload"
          id="nftaudio"
          controls
          autoPlay
          type="audio/*"
          className={classname ? classname :"w-full rounded-[0.625rem] imgset"}
          muted
          src={file}
        >
          {/* <source  type="audio/*" /> */}
        </audio>
      </>
    ) : (
      <Image
        width={width ?? 230}
        height={height ?? 230}
        src={isEmpty(file) ? "/img/products/item_5.jpg" : file}
        alt="item 5"
        className={classname ? classname :"w-full rounded-[0.625rem] imgset"}
        loading="lazy"
        data-bs-toggle={data_bs_toggle ?? ""}
        data-bs-target={data_bs_target ?? ""}
      />
    )
  ) : (
    <Image
      width={width ?? 230}
      height={height ?? 230}
      src={isEmpty(file) ? "/img/products/item_5.jpg" : file ? file.includes('undefined') ?  "/img/products/item_5.jpg" :  file : "/img/products/item_5.jpg"}
      alt="item 5"
      className={classname ? classname :"w-full rounded-[0.625rem] imgset"}
      loading="lazy"
      data-bs-toggle={data_bs_toggle ?? ""}
      data-bs-target={data_bs_target ?? ""}
    />
  );
}
