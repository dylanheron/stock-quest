"use client";
import { Box, Modal, IconButton, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Image from "next/image";
import React, { useState } from "react";
import { imagesInfo } from "./ImagesInfo";

export default function Resources() {
  type ModalState = {
    open: boolean;
    content: JSX.Element | null;
    title: string;
    imagePath: string;
    level: string;
    summary: string;
  };

  const [modal, setModal] = useState<ModalState>({
    open: false,
    content: null,
    title: "",
    imagePath: "",
    level: "",
    summary: ""
  });

  const openModal = (imageName: string) => {
    const { title, description, imagePath, level, summary } =
      imagesInfo[imageName];
    setModal({
      open: true,
      content: description,
      title: title,
      imagePath: imagePath,
      level: level,
      summary: summary
    });
  };

  const closeModal = () => {
    setModal({
      open: false,
      content: null,
      title: "",
      imagePath: "",
      level: "",
      summary: ""
    });
  };

  const levelColor = (level: string) => {
    switch (level) {
      case "Beginner":
        return "text-green-500";
      case "Intermediate":
        return "text-yellow-500";
      case "Advanced":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-10 overflow-hidden">
      <div className="w-full flex flex-col items-center">
        <h1 className="text-7xl font-bold mb-4">Learning Resources Page</h1>
        <div className=" text-[#2AB4E3] text-xl mb-5 max-w-4xl">
          <ul>
            <li>
              <strong>• Welcome to the Learning Resources Page!</strong>
            </li>
            <li>• Explore images illustrating various trading patterns.</li>
            <li>
              <strong>• Click on an image</strong> to see more details about the
              pattern.
            </li>
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-3 grid-rows-2 gap-8 my-auto">
        {Object.entries(imagesInfo).map(([imageName, info], index) => (
          <div
            className="flex flex-col items-center bg-white text-gray-800 p-8 rounded-lg shadow-lg hover:-translate-y-2.5 hover:shadow-2xl transition-transform transition-shadow"
            onClick={() => openModal(imageName)}
            key={index}
          >
            <div className="w-full  justify-between ">
              <h2 className="text-3xl font-bol">{info.title}</h2>
              <span className={`text-sm ${levelColor(info.level)}`}>
                {info.level}
              </span>
            </div>
            <p className="text-sm mb-2">{info.summary}...</p>
            <Image
              width={300}
              height={300}
              src={info.imagePath}
              alt={info.title}
              className="w-full rounded cursor-zoom-in"
            />
          </div>
        ))}
      </div>
      <Modal
        open={modal.open}
        onClose={closeModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 1200,
            bgcolor: "rgb(38 38 38)",
            boxShadow: 24,
            p: 4,
            textAlign: "left",
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            borderRadius: "16px"
          }}
        >
          <Box sx={{ width: 400, marginRight: 4 }}>
            <IconButton
              aria-label="close"
              onClick={closeModal}
              sx={{
                position: "absolute",
                right: 8,
                top: 8,
                color: "white"
              }}
            >
              <CloseIcon />
            </IconButton>
            <h1 className="text-[#2AB4E3] text-5xl mb-1 font-bold">
              {modal.title}
            </h1>
            <span
              className={`text-sm text-2xl pb-3 ${levelColor(modal.level)}`}
            >
              {modal.level}
            </span>
            <p className="text-lg">{modal.content}</p>
          </Box>
          <Image
            width={800}
            height={800}
            src={modal.imagePath}
            alt={modal.title}
            className="rounded"
          />
        </Box>
      </Modal>
    </div>
  );
}
