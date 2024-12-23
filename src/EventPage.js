import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardActions,
  Snackbar,
  Alert,
  Container,
  Paper,
  LinearProgress,
} from "@mui/material";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ImageIcon from "@mui/icons-material/Image";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import DownloadIcon from "@mui/icons-material/Download";

const socket = io("http://localhost:4000");


const EventPage = () => {
  const { eventCode } = useParams();
  const [photos, setPhotos] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSnackbarOpen, setIsSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [userPhotoCount, setUserPhotoCount] = useState(0);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    socket.emit("joinEvent", eventCode);

    socket.on("photoUploaded", (newPhoto) => {
      setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);
    });

    const fetchPhotos = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/events/${eventCode}/photos`);
        const data = await response.json();
        setPhotos(data);

        const userUploadedPhotos = data.filter((photo) => photo.userId === getCurrentUserId()).length;
        setUserPhotoCount(userUploadedPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
    };

    fetchPhotos();

    return () => {
      socket.disconnect();
    };
  }, [eventCode]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = () => {
    if (userPhotoCount >= 5) {
      setSnackbarMessage("You've reached the maximum of 5 photo uploads");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
      return;
    }

    if (!selectedFile) {
      setSnackbarMessage("Please select a photo to upload");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("photo", selectedFile);
    formData.append("eventCode", eventCode);
    formData.append("userId", getCurrentUserId());

    fetch("http://localhost:4000/api/upload-photo", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload photo");
        }
        return response.json();
      })
      .then((data) => {
        const newPhoto = {
          ...data,
          photoPath: data.photoPath || selectedFile.name,
          userId: getCurrentUserId(),
        };

        setPhotos((prevPhotos) => [newPhoto, ...prevPhotos]);

        setSnackbarMessage("Photo uploaded successfully");
        setSnackbarSeverity("success");
        setIsSnackbarOpen(true);
        setSelectedFile(null);
        setPreviewUrl(null);
        setUserPhotoCount((prev) => prev + 1);
      })
      .catch((error) => {
        console.error("Error uploading photo:", error);
        setSnackbarMessage("Failed to upload photo");
        setSnackbarSeverity("error");
        setIsSnackbarOpen(true);
      })
      .finally(() => {
        setIsUploading(false);
      });
  };

  const handleDelete = async (photoId) => {
    if (!photoId) {
      setSnackbarMessage("Invalid photo ID. Cannot delete.");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:4000/api/photos/${photoId}`, {
        method: "DELETE",
      });
  
      if (!response.ok) {
        const errorText = await response.text(); // Capture backend error message
        throw new Error(errorText || "Failed to delete photo");
      }
  
      // Update the state after successful deletion
      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo._id !== photoId));
      setUserPhotoCount((prev) => prev - 1);
  
      // Success feedback
      setSnackbarMessage("Photo deleted successfully");
      setSnackbarSeverity("success");
      setIsSnackbarOpen(true);
    } catch (error) {
      console.error("Error deleting photo:", error);
      setSnackbarMessage(`Failed to delete photo: ${error.message}`);
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
    }
  };
  
  
  const handleDownload = (photoPath) => {
    if (!photoPath) {
      setSnackbarMessage("Invalid photo path. Download failed.");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
      return;
    }
  
    try {
      const link = document.createElement("a");
      link.href = `http://localhost:4000/${photoPath}`;
      link.download = photoPath.split("/").pop(); // Extract filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  
      // Optional: Show success message
      setSnackbarMessage("Photo downloaded successfully");
      setSnackbarSeverity("success");
      setIsSnackbarOpen(true);
    } catch (error) {
      console.error("Error downloading photo:", error);
  
      // Display error message
      setSnackbarMessage("Failed to download photo.");
      setSnackbarSeverity("error");
      setIsSnackbarOpen(true);
    }
  };
  

  const getCurrentUserId = () => {
    return "user123";
  };

  return (
    <Container maxWidth="lg">
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          marginTop: "20px",
          background: "linear-gradient(145deg, #f0f0f0 0%, #e6e6e6 100%)",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#333",
            fontWeight: "bold",
            marginBottom: "30px",
          }}
        >
          {eventCode} CapTog
        </Typography>
        <Typography
        
          gutterBottom
          sx={{
            textAlign: "center",
            color: "#333",
            marginBottom: "30px",
          }}
        >
         Wedding photos: "The beginning of a beautiful journey together, surrounded by love, laughter, and cherished memories."

        </Typography>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <input
              accept="image/*"
              type="file"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="upload-photo"
            />
            <label htmlFor="upload-photo">
              <Button
                variant="contained"
                component="span"
                startIcon={<PhotoCameraIcon />}
                sx={{
                  backgroundColor: "#4a90e2",
                  "&:hover": { backgroundColor: "#357abd" },
                }}
              >
                Choose Photo
              </Button>
            </label>
            <Button
              variant="contained"
              startIcon={<CloudUploadIcon />}
              onClick={handleUpload}
              disabled={!selectedFile || userPhotoCount >= 5 || isUploading}
              sx={{
                backgroundColor: "#2ecc71",
                "&:hover": { backgroundColor: "#27ae60" },
                "&.Mui-disabled": {
                  backgroundColor: "#95a5a6",
                  color: "#fff",
                },
              }}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </Box>

          <Box sx={{ width: "100%", marginTop: "10px", textAlign: "center" }}>
            <Typography variant="caption" color="textSecondary">
              Photos Uploaded: {userPhotoCount}/5
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(userPhotoCount / 5) * 100}
              color="primary"
              sx={{ height: 10, borderRadius: 5 }}
            />
          </Box>

          {previewUrl && (
            <Box
              sx={{
                marginTop: "20px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle1">Photo Preview</Typography>
              <img
                src={previewUrl}
                alt="Preview"
                style={{
                  maxWidth: "300px",
                  maxHeight: "300px",
                  borderRadius: "10px",
                  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                }}
              />
            </Box>
          )}
        </Box>

        {photos.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <ImageIcon sx={{ fontSize: 80, color: "#bdc3c7" }} />
            <Typography variant="h6" color="textSecondary">
              No photos uploaded yet
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {photos.map((photo, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.3s ease-in-out",
                    "&:hover": {
                      transform: "scale(1.05)",
                      boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`http://localhost:4000/${photo.photoPath}`}
                    alt="Event photo"
                    sx={{
                      height: 180,
                      objectFit: "cover",
                    }}
                  />
                  <CardActions sx={{ justifyContent: "space-between" }}>
                    <Button
                      size="small"
                      color="error"
                      startIcon={<DeleteIcon />}
                      onClick={() => handleDelete(photo._id)}
                    >
                      Delete
                    </Button>
                    <Button
                      size="small"
                      color="primary"
                      startIcon={<DownloadIcon />}
                      onClick={() => handleDownload(photo.photoPath)}
                    >
                      Download
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Snackbar
          open={isSnackbarOpen}
          autoHideDuration={3000}
          onClose={() => setIsSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity={snackbarSeverity} sx={{ width: "100%" }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Container>
  );
};

export default EventPage;