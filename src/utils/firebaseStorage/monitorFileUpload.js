import {uploadProgress} from 'utils';

export default monitorFileUpload = (
  uploadTask,
  setuploadProgress,
  newProfilePicUploadComplete,
  setNewProfilePicUploadComplete,
) => {
  return new Promise((resolve, reject) => {
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
          setNewProfilePicUploadComplete(
            (newProfilePicUploadComplete) => !newProfilePicUploadComplete,
          );
          resolve('Upload completed');
          break;
        default:
          reject('something bad happend to file upload');
          break;
      }
    });
  });
};
