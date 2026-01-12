import { useState } from "react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import type { Photo } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { isPlatform } from "@ionic/react";
import { Capacitor } from "@capacitor/core";

export interface UserPhoto {
  filepath: string;
  webviewPath?: string;
}

export function usePhotoGallery() {
  const [photos, setPhotos] = useState<UserPhoto[]>([]);

  const addNewToGallery = async () => {
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100,
    });

    const fileName = Date.now() + ".jpeg";
    const savedImageFile = await savePicture(capturedPhoto, fileName);

    setPhotos([savedImageFile, ...photos]);
  };

  const savePicture = async (
    photo: Photo,
    fileName: string
  ): Promise<UserPhoto> => {
    let base64Data: string | Blob;

    if (isPlatform("hybrid")) {
      const readFile = await Filesystem.readFile({
        path: photo.path!,
      });
      base64Data = readFile.data;
    } else {
      const response = await fetch(photo.webPath!);
      const blob = await response.blob();
      base64Data = await convertBlobToBase64(blob);
    }

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data,
    });

    return isPlatform("hybrid")
      ? {
          filepath: savedFile.uri,
          webviewPath: Capacitor.convertFileSrc(savedFile.uri),
        }
      : {
          filepath: fileName,
          webviewPath: photo.webPath,
        };
  };

  const convertBlobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  };

  return {
    addNewToGallery,
    photos,
  };
}