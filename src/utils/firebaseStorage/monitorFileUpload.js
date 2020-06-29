import {uploadProgress} from 'utils';

export default monitorFileUpload = (uploadTask, setuploadProgress) => {
  uploadTask.on('state_changed', (snapshot) => {
    const progress = uploadProgress(
      snapshot.bytesTransferred / snapshot.totalBytes,
    );

    switch (snapshot.state) {
      case 'running':
        console.log('UPLOAD IS RUNNING');
        setuploadProgress(progress);
        break;
      case 'success':
        console.log('UPLOAD IS SUCCESSFUL');
        // snapshot.ref.getDownloadURL().then((downloadURL) => {
        //   setImageURI({uri: downloadURL});
        // });
        break;
      default:
        break;
    }
  });
};
