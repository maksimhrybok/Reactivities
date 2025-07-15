import { CloudUpload } from "@mui/icons-material";
import { Box, Grid, Typography } from "@mui/material";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import Cropper, { ReactCropperElement } from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function PhotoUploadWidget() {
  const [files, setFiles] = useState<object & { preview: string }[]>([]);
  const cropperRef = useRef<ReactCropperElement>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(
      acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file as Blob),
        })
      )
    );
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Grid container spacing={3}>
      <Grid size={4}>
        <Typography variant="overline" color="secondary">
          Add Photo
        </Typography>
        <Box
          {...getRootProps()}
          sx={{
            border: "3px dashed #eee",
            borderColor: isDragActive ? "green" : "#eee",
            borderRadius: "5px",
            paddingTop: "30px",
            textAlign: "center",
            height: "280px",
          }}
        >
          <input {...getInputProps()} />
          <CloudUpload sx={{ fontSize: 80 }} />
          <Typography variant="h5">Drop image here</Typography>

          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <p>Drag 'n' drop some files here, or click to select files</p>
          )}
        </Box>
      </Grid>
      <Grid size={4}>
        <Typography variant="overline" color="secondary">
          Resize image
        </Typography>
        {files[0]?.preview && (
          <Cropper
            src={files[0]?.preview}
            style={{ height: 300, width: "90%" }}
            initialAspectRatio={1}
            aspectRatio={1}
            preview=".img-preview"
            guides={false}
            viewMode={1}
            background={false}
          />
        )}
      </Grid>
      <Grid size={4}>
        {files[0]?.preview && (
          <>
            <Typography variant="overline" color="secondary">
              Preview & upload
            </Typography>
            <div
              className="img-preview"
              style={{ width: 300, height: 300, overflow: "hidden" }}
            />
          </>
        )}
      </Grid>
    </Grid>
  );
}
