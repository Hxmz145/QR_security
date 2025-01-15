import { CameraView, CameraType, useCameraPermissions,Camera } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { launchImageLibrary } from 'react-native-image-picker';
import { Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system'


const api_key = 'API_KEY'

const safeBrowsingApiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${api_key}`


// Define the type for the photo object
type Photo = {
    uri?: string;
    type?: string;
    fileName?: string;
};


// Define the function with types
const createFormData = (photo: Photo, body: Record<string, any> = {}): FormData => {
  const data = new FormData();

  data.append('photo', {
    name: photo.fileName,
    type: photo.type,
    uri: Platform.OS === 'ios' ? photo.uri?.replace('file://', '') : photo.uri,
  } as unknown as Blob); // Ensure the object is treated as a `Blob`

  Object.keys(body).forEach((key) => {
    data.append(key, body[key]);
  });

  return data;
};



const ImageUpload = () => {
  const [image, setImage] = useState<Photo | null>(null);
  const [uploading, setUploading] = useState(false);

  // Request image picker permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  // Handle image picking
  const pickImage = async () => {
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      alert('You need to grant camera roll permission to select an image');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: false,
      });
      console.log("imagepicker",result)
      
      if (!result.canceled) {
        // Type assertion to ensure result conforms to Photo
        const photo = result as Photo;
        setImage(photo);
      }
  };

  // Upload the image
  const saveImageLocally = async () => {
    try {
      // Launch the image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        base64: false, // No need for base64 if saving the file directly
      });
  
      if (!result.canceled) {
        // Get the file URI
        const pickedImageUri = result.assets[0].uri;
  
        // Define a local path to save the file
        const fileName = pickedImageUri.split('/').pop(); // Extract the file name
        const localUri = `${FileSystem.documentDirectory}${fileName}`;
  
        // Move the file to the app's document directory
        await FileSystem.moveAsync({
          from: pickedImageUri,
          to: localUri,
        });
  
        console.log('File saved locally at:', localUri);
        return localUri;
      } else {
        console.log('Image picking canceled');
      }
    } catch (error) {
      console.error('Error saving file locally:', error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Upload an Image</Text>

      {image ? (
        <View>
          <Text>Selected Image:</Text>
          <Text>{image.uri}</Text>
        </View>
      ) : (
        <Text>No image selected</Text>
      )}

      <Button title="Pick Image" onPress={pickImage} />
      <Button title="Upload Image" onPress={saveImageLocally} disabled={uploading} />
      <input></input>
    </View>
  );
};

export default ImageUpload;
