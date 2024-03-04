"use client";

import React, { useState, useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { DialogTitle } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";

async function fetchmetaData(ipfsHash: string) {
  try {
    const response = await fetch(`https://ipfs.io/ipfs/${ipfsHash}`);
    if (!response.ok) {
      // Handle response error
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const json = await response.json();
    const image = json.image; // Adjust this according to the actual structure
    const name = json.name; // Adjust this according to the actual structure
    return { name, image };
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}
interface NFTDialogProps {
  onRefresh: () => Promise<void>;
}
const initialFormState = {
  userGender: "",
  userAge: 0,
  dogeAge: 0,
  dogeGender: "",
  dogeBreed: "",
  dogeColor: "",
  dogeName: "",
};

function GPTDialog({ onRefresh }: NFTDialogProps) {
  const [formData, setFormData] = useState(initialFormState);
  const [open, setOpen] = React.useState(false);
  const [IPFSHash, setIPFSHash] = useState("");
  const [imageData, setImageData] = useState("");
  const [name, setName] = useState("");
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  useEffect(() => {
    const fetchProductData = async () => {
      if (IPFSHash !== "") {
        const data = await fetchmetaData(IPFSHash);
        if (data) {
          const { name, image } = data;
          setImageData(image);
          setName(name);
        }
      }
    };
    fetchProductData();
  }, [IPFSHash]);

  // Define handleChange to update formData
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    // Update formData with the new value
    const updatedValue =
      name === "userAge" || name === "dogeAge" ? parseInt(value, 10) : value;

    setFormData((prevState) => ({
      ...prevState,
      [name]: updatedValue,
    }));
  };

  // Define handleSubmit to create a new event
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Submitting:", formData);

    try {
      const response = await fetch(`/api/createPhoto`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData.error);
      } else {
        const data = await response.json();
        await onRefresh();
        console.log("Data:", data);
        setIPFSHash(data.ipfsHash);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <button
        className="h-15 m-4 flex w-64 items-center justify-center rounded-2xl bg-dark-blue p-4 text-xl font-bold text-white"
        onClick={handleClickOpen}
      >
        Generate Image
      </button>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"md"}
      >
        <DialogTitle>Generate Image</DialogTitle>
        <DialogContent className="space-y-2">
          <InputLabel htmlFor="userAge">User Age : </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="userAge"
            name="userAge"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <InputLabel htmlFor="userGender">userGender : </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="userGender"
            name="userGender"
            type="text"
            variant="standard"
            onChange={handleChange}
            fullWidth
            required
            className="pb-2"
          />
          <InputLabel htmlFor="dogeName">Doge Name : </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="dogeName"
            name="dogeName"
            type="string"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <InputLabel htmlFor="dogeAge">Doge Age : </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="dogeAge"
            name="dogeAge"
            type="number"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <InputLabel htmlFor="name">dogeGender : </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="dogeGender"
            name="dogeGender"
            type="string"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <InputLabel htmlFor="breed">Doge Breed : </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="dogeBreed"
            name="dogeBreed"
            type="string"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          <InputLabel htmlFor="dogeColor">Doge Color : </InputLabel>
          <TextField
            autoFocus
            margin="dense"
            id="dogeColor"
            name="dogeColor"
            type="string"
            fullWidth
            variant="standard"
            onChange={handleChange}
            required
            className="pb-2"
          />
          {IPFSHash && (
            <Link
              href={`https://ipfs.io/ipfs/${IPFSHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              IPFS Hash: {IPFSHash}
            </Link>
          )}
          {name && <p>Doggy : {name}</p>}
          {imageData && <Image
            src={imageData}
            alt="generated image"
            width={400}
            height={400}
            className="p-5"
          />}
        </DialogContent>
        <form onSubmit={handleSubmit} className="flex justify-center">
          <Button type="submit">Generate Image</Button>
        </form>

        <Button onClick={handleClose}>Cancel</Button>
      </Dialog>
    </React.Fragment>
  );
}
export default GPTDialog;
