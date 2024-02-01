import React, { useState } from "react";
import axios from "axios";

const ImageUploader = () => {
  const [imageFile, setImageFile] = useState(null);
  const [upScaledImage, setUpScaledImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
  };

  const upScaleImage = async () => {
    const formData = new FormData();
    formData.append("image", imageFile);
    formData.append("sizeFactor", "4");
    formData.append("imageStyle", "default");
    formData.append("noiseCancellationFactor", "0");

    const options = {
      method: "POST",
      url: "https://ai-picture-upscaler.p.rapidapi.com/supersize-image",
      headers: {
        "X-RapidAPI-Key": import.meta.env.VITE_X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "ai-picture-upscaler.p.rapidapi.com",
        "Content-Type": "multipart/form-data",
      },
      data: formData,
      responseType: "arraybuffer",
    };

    try {
      setLoading(true);
      const response = await axios.request(options);

      const baseImage = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      setUpScaledImage(baseImage);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const byteCharacters = atob(upScaledImage);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "image/jpeg" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "upscaled_image.jpg";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container mx-auto mt-10 p-4 bg-gray-200 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Image Upscaler</h1>

      <div className="mb-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="border p-2"
        />
      </div>

      <button
        onClick={upScaleImage}
        disabled={!imageFile || loading}
        className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
      >
        {loading ? "Uploading..." : "Upload Image"}
      </button>

      {upScaledImage && (
        <div className="mt-4">
          <img
            src={`data:image/jpeg;base64,${upScaledImage}`}
            alt="Upscaled Image"
            className="w-1/5 block m-auto rounded-lg"
          />
          <button
            onClick={handleDownload}
            className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
          >
            Download Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
