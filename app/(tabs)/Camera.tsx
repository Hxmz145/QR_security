import { CameraView, CameraType, useCameraPermissions,Camera } from 'expo-camera';
import { useState } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';



const api_key = 'AIzaSyANI7GrlX5St9vbavssfvR0QtafSiGmhwY'

const safeBrowsingApiUrl = `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${api_key}`


export default function App() {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();

  const [data,setdata] = useState<string>()
  const [urlresult,seturlresult] = useState<string>()

  const [threattype,setthreattype] = useState<string>("No Threat")

  const colorresult = urlresult === "Not Safe" ? 'red' : 'black';

  const [airesult,setairesult] = useState<string>()

  const [realurl, setrealurl] = useState<string>()

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }


  const urlshow = async (data: string) => {
    setdata(data);
    const aimodelurl = `http://127.0.0.1:5000/machinelearning?url=${data}`

    const body = {
        client: {
            clientId: "yourClientID",
            clientVersion: "1.0"
        },
        threatInfo: {
            threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
            platformTypes: ["ANY_PLATFORM"],
            threatEntryTypes: ["URL"],
            threatEntries: [{ url: data }]
        }
    };

    try {
        const response = await fetch(safeBrowsingApiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });

        const response2 = await fetch(aimodelurl, {
            method: 'GET',
        });


        if (!response.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        if (!response2.ok) {
            console.error(`Error: ${response.statusText}`);
            return;
        }

        const result = await response.json();
        const result2 = await response2.json();
        console.log(result);
        console.log(result2)
        setairesult(result2.result)
        setrealurl(result2.url)
        if (result.matches){
            seturlresult("Not Safe")
            setthreattype(result["matches"][0]['threatType'])
        } else {
            seturlresult("Safe")
        } // This will log the result of the Safe Browsing check
        if (result2.result == "Malicious"){
            seturlresult("Not Safe")
        }

        
    } catch (error) {
        console.error('Error checking URL safety:', error);
    }
};
  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  return (
    <View style={styles.container}>
      <ThemedView>
        <ThemedText style={styles.top} type="title">QR Code Scanner</ThemedText>
      </ThemedView>
      <CameraView
       style={styles.camera}
       facing={facing}
       onBarcodeScanned={(BarcodeScanningResult) => {
        urlshow(BarcodeScanningResult.data);
      }}
      
       barcodeScannerSettings={{
        barcodeTypes: ["qr"],
        }}>
      </CameraView>
      <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraFacing}>
            <Text style={styles.text}>Flip Camera</Text>
            <Text style={styles.text}>ThreatType:{threattype}</Text>
            <Text style={styles.text}>url:{data}</Text><br/>
            <Text style={styles.text}>AI model descision:{airesult} </Text>
            <Text style={styles.text}>Real url:{realurl}</Text>
            
          </TouchableOpacity>
          
        </View>
      <ThemedView style={styles.bottom}>
        <ThemedText style={{color:colorresult}} type='title'>result:{urlresult}</ThemedText>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 5,
    justifyContent: 'center',
    backgroundColor:'white'
  },
  top: {
    backgroundColor:'white',
    color:'black',
    textAlign:'center'
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    width: 300,   // Set the desired width
    height: 300,  // Set the desired height
    margin: 70,
    alignSelf: 'center', 

  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 10,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
  },
  bottom: {
    backgroundColor:'white',
    textAlign:'center',
  }
});
