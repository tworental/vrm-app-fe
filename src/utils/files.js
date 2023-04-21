export const createFileList = (fileArray) => {
  const dt = new DataTransfer();
  fileArray.forEach((file) => dt.items.add(file));

  return dt.files;
};

export default { createFileList };
