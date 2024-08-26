import React, { useEffect, useState, useCallback } from 'react';
import { useDropzone, FileWithPath } from 'react-dropzone';

const thumbsContainer: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
  justifyContent: 'center'
};

const thumb: React.CSSProperties = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 300,
  height: 300,
  padding: 4,
  boxSizing: 'border-box'
  
};

const thumbInner: React.CSSProperties = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden',
};

const img: React.CSSProperties = {
  display: 'block',
  width: 'auto',
  height: '100%',
};

interface DropzoneComponentProps {
  // add any additional props here
  onDrop: (acceptedFiles: File[]) => void;
}
type FileWithPreview = FileWithPath & {
  preview: string;
};


const DropzoneComponent: React.FC<DropzoneComponentProps> = ({onDrop, ...props}) => {
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
    [onDrop]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDropAccepted,
    accept: {
      'image/*': []
    },
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })) as FileWithPreview[]);
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img
          src={file.preview}
          style={img}
          // Revoke data uri after image is loaded
          onLoad={() => { URL.revokeObjectURL(file.preview) }}
        />
      </div>
    </div>
  ));

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () => files.forEach(file => URL.revokeObjectURL(file.preview));
  }, []);

  return (
    <>
    <section className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center drop-shadow-lg bg-zinc-200">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag and Drop, or upload an image here.</p>
      </div>
    </section>
    <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </>
  );
}

export default DropzoneComponent
 