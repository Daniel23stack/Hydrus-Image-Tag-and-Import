"use client"
import React, { useState } from 'react';
import axios from 'axios';
import DropzoneComponent from './DropZoneImage';
const ImageDimensionForm = () => {
  const [image, setImage] = useState<File | null>(null);
  const [tags, setTags] = useState<{} | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement | null >) => {
    event.preventDefault();
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);
    console.log('form data',formData)
    const response = await axios.post('/api/hydrus_single_import', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    console.log('Response', response.data)
    // setDimensions(response.data);
    setTags(response.data)
  };

  const handleDrop = (acceptedFiles: File[]) => {
    // Handle accepted files here
    console.log(acceptedFiles);
    setImage(acceptedFiles[0]);
  };


  return (
    <>
    <form onSubmit={handleSubmit} className="container-lg mx-auto text-center">
      <DropzoneComponent onDrop={handleDrop}/>
      <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
      {tags && <p>Tags: {JSON.stringify(tags)}</p>}
    </form>
    </>
  );
};

export default ImageDimensionForm;
