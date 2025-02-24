import React from 'react';
import ModalImage from 'react-modal-image';

const MyImagePreview = ({ imageUrl, keterangan }) => {
  return (
    <ModalImage
      small={imageUrl} // URL gambar kecil (thumbnail)
      large={imageUrl} // URL gambar utama (besar)
      alt={keterangan}
      hideDownload={false} // Sembunyikan opsi unduh
      hideRotate={false} // Tampilkan opsi putar
      showRotate={true}
      zoom
    />
  );
};

export default MyImagePreview;
