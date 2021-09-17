import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Button, Image, Dimensions, TouchableHighlight,PermissionsAndroid, Alert } from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


export async function request_storage_runtime_permission() {
 
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        'title': 'ReactNativeCode Storage Permission',
        'message': 'ReactNativeCode App needs access to your storage to download Photos.'
      }
    )
  } catch (err) {
    console.warn(err)
  }
}


export default class App extends React.Component {

  async componentDidMount() {
 
    await request_storage_runtime_permission()
 
  }

  constructor(props) {
    super(props);
    this.state = {
      resourcePath: {},
      imageUrl: null,
      imgUri: null,
    };
  }

  analizEt = () => {
    if(this.state.isUpload){
      this.setState({
        imgUri: this.state.imageUrl,
        analizPress: true
      });
      console.log(this.state.imgUri);
      this.state.isUpload = false;
    }
  }

  cameraLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchCamera(options, (res) => {
      console.log('Response = ', res);
      this.setState({
        isUpload: false
      });
      if (res.didCancel) {
        console.log('İptal edildi');
      } else if (res.error) {
        console.log('ImagePicker Hatası: ', res.error);
      } else if (res.customButton) {
        console.log('Custom butona tıklandı: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        console.log('response', JSON.stringify(res));
        let formdata = new FormData();
        formdata.append("image", {uri: res.uri, name:res.fileName, type: 'image/jpeg'})
        fetch('http://34.91.101.180/uploads',{
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata
        }).then((response) => response.json())
        .then((json) => {
          this.setState({
            imageUrl: json.name,
            isUpload: true,
          });
          console.log(json.name);
        })
        this.setState({
          filePath: res,
          fileData: res.data,
          fileUri: res.uri,
          resourcePath: source,
          imgUri: res.uri
        });
      }
    });
  }

  imageGalleryLaunch = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    launchImageLibrary(options, (res) => {
      console.log('Response = ', res);
      this.setState({
        isUpload: false
      });
      if (res.didCancel) {
        console.log('İptal edildi');
      } else if (res.error) {
        console.log('ImagePicker Hatası: ', res.error);
      } else if (res.customButton) {
        console.log('Custom butona tıklandı: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        console.log('response', JSON.stringify(res));
        
        let formdata = new FormData();
        formdata.append("image", {uri: res.uri, name:res.fileName, type: 'image/jpeg'})
        fetch('http://34.91.101.180/uploads',{
          method: 'post',
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          body: formdata
        }).then((response) => response.json())
        .then((json) => {
          this.setState({
            imageUrl: json.name,
            isUpload: true,
          });
          console.log(json.name);
        })
        this.setState({
          filePath: res,
          fileData: res.data,
          fileUri: res.uri,
          resourcePath: source,
          imgUri: res.uri
        });
      }
    });
  }  

  downloadImage = () => {
    if(this.state.analizPress){
    var date = new Date();
    var image_URL = this.state.imgUri;
    var ext = 'jpg';
    ext = "." + ext[0];
    const { config, fs } = RNFetchBlob;
    let PictureDir = fs.dirs.PictureDir
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        path: PictureDir + "/image_" + Math.floor(date.getTime()
          + date.getSeconds() / 2) + ext,
        description: 'Image'
      }
    }
    config(options).fetch('GET', image_URL).then((res) => {
     // Alert.alert("Image Downloaded Successfully.");
    });
    this.setState({
      analizPress: false
    });
  }
  }

  render() {
    return (
    <ScrollView style={styles.scrollView}>
      <View style={styles.container}>
        <View style={styles.container}>

      <TouchableOpacity disabled={!(this.state.analizPress)} onPress = {this.downloadImage} >
        <Image
            source={{ uri: this.state.imgUri }}
            style={this.state.imgUri ? {width:windowWidth, height: windowHeight/1.8, resizeMode: 'contain', marginBottom: windowHeight/200*4} :null}
        />
        <Text style= {this.state.imgUri ? null :{padding:windowHeight/15, textAlign: 'center', fontSize: windowWidth/20, width:windowWidth }}>  {this.state.imgUri ? null : "Başlamak için bir resim yükleyin."}</Text>
      </TouchableOpacity>

        <TouchableOpacity onPress = {this.cameraLaunch} style={styles.button}  >
            <Text style={styles.buttonText}>Kamerayı başlat</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.imageGalleryLaunch} style={styles.button}  >
            <Text style={styles.buttonText}>Galeriden fotoğraf seç</Text>
        </TouchableOpacity>
        <TouchableHighlight disabled={!(this.state.isUpload)}  onPress={this.analizEt} style={this.state.isUpload ? styles.button : styles.button1} >
            <Text style={styles.buttonText}>Analiz et</Text>
        </TouchableHighlight>
        </View>
      </View>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#e5c3d1'
  },
  container: {
    flex: 1,
    padding: windowHeight/200*4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5c3d1'
  },
  button: {
    width: windowWidth/5*4,
    height: windowHeight/50*4,
    backgroundColor: '#613f75',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowWidth/200*4,
    marginBottom:windowHeight/200*4
  },
  button1: {
    opacity: 0.3,
    width: windowWidth/5*4,
    height: windowHeight/50*4,
    backgroundColor: '#613f75',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: windowWidth/200*4,
    marginBottom:windowHeight/200*4
  },
  buttonText: {
    textAlign: 'center',
    fontSize: windowWidth/100*4,
    color: '#fff'
  },
});