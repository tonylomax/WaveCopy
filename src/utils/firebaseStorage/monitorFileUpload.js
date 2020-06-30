import {uploadProgress} from 'utils';

export default monitorFileUpload = (uploadTask, setuploadProgress) => {
  uploadTask.on('state_changed', (snapshot) => {
    const progress = uploadProgress(
      snapshot.bytesTransferred / snapshot.totalBytes,
    );

    switch (snapshot.state) {
      case 'running':
        console.log('UPLOAD IS RUNNING');
        setuploadProgress(progress / 100);
        break;
      case 'success':
        console.log('UPLOAD IS SUCCESSFUL');
        break;
      default:
        break;
    }
  });
};
