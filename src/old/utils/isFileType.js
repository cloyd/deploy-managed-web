export const isFileImage = (filename) =>
  /\.bmp|\.gif|\.jpeg|\.jpg|\.png|\.svg|\.tiff/i.test(filename);

export const isFilePdf = (filename) => /\.pdf/i.test(filename);

export const isFileVideo = (filename) =>
  /\.avi|\.flv|\.m4v|\.mov|\.mp4|\.ogg|\.webm|\.wmv/i.test(filename);
