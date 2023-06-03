import localStorage from 'store';

export const downloadFile = (url, filename, setDownloading) => {
  const fetch = window.fetch;

  fetch(url, {
    headers: {
      Authorization: localStorage.get('authToken'),
    },
  })
    .then((response) => response.blob())
    .then((blob) => URL.createObjectURL(blob))
    .then((uril) => {
      var link = document.createElement('a');
      link.href = uril;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    });
};
