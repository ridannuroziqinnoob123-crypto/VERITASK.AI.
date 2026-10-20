/**
 * VERITASK AI - Modul Forensik Citra Digital (Client-Side In-Browser)
 * 1. Error Level Analysis (ELA): Menyorot kompresi piksel yang tidak wajar akibat tempelan / editan.
 * 2. EXIF & Metadata Inspector: Membaca metadata file biner untuk mendeteksi riwayat software penyunting (Photoshop, Canva, dll) dan perangkat kamera.
 */

const ImageForensics = {
  /**
   * Menjalankan Error Level Analysis (ELA) pada citra
   * @param {HTMLImageElement|File} imageSource - Elemen gambar atau file
   * @param {HTMLCanvasElement} targetCanvas - Kanvas untuk menampilkan hasil ELA
   * @param {number} quality - Kualitas kompresi ulang JPEG (default: 0.90)
   * @param {number} scale - Faktor amplifikasi perbedaan piksel (default: 20)
   * @returns {Promise<object>} Hasil analisis ELA
   */
  async runELA(imageSource, targetCanvas, quality = 0.90, scale = 20) {
    return new Promise((resolve, reject) => {
      let img;
      if (imageSource instanceof File) {
        img = new Image();
        img.onload = () => processImage(img);
        img.onerror = reject;
        img.src = URL.createObjectURL(imageSource);
      } else if (imageSource instanceof HTMLImageElement) {
        img = imageSource;
        if (img.complete) {
          processImage(img);
        } else {
          img.onload = () => processImage(img);
          img.onerror = reject;
        }
      } else {
        reject(new Error("Format sumber gambar tidak didukung"));
      }

      function processImage(loadedImg) {
        try {
          const w = loadedImg.naturalWidth || loadedImg.width;
          const h = loadedImg.naturalHeight || loadedImg.height;

          // Batasi resolusi maksimal untuk efisiensi performa browser
          const maxDim = 1200;
          let renderW = w;
          let renderH = h;
          if (renderW > maxDim || renderH > maxDim) {
            if (renderW > renderH) {
              renderH = Math.round((renderH * maxDim) / renderW);
              renderW = maxDim;
            } else {
              renderW = Math.round((renderW * maxDim) / renderH);
              renderH = maxDim;
            }
          }

          // Kanvas 1: Gambar Asli
          const canvasOrig = document.createElement('canvas');
          canvasOrig.width = renderW;
          canvasOrig.height = renderH;
          const ctxOrig = canvasOrig.getContext('2d');
          ctxOrig.drawImage(loadedImg, 0, 0, renderW, renderH);

          const origData = ctxOrig.getImageData(0, 0, renderW, renderH);

          // Kompres ulang ke JPEG
          const compressedDataUrl = canvasOrig.toDataURL('image/jpeg', quality);
          const compImg = new Image();

          compImg.onload = () => {
            // Kanvas 2: Gambar Hasil Kompresi
            const canvasComp = document.createElement('canvas');
            canvasComp.width = renderW;
            canvasComp.height = renderH;
            const ctxComp = canvasComp.getContext('2d');
            ctxComp.drawImage(compImg, 0, 0, renderW, renderH);

            const compData = ctxComp.getImageData(0, 0, renderW, renderH);

            // Siapkan target canvas
            targetCanvas.width = renderW;
            targetCanvas.height = renderH;
            const targetCtx = targetCanvas.getContext('2d');
            const elaImageData = targetCtx.createImageData(renderW, renderH);

            let totalDiff = 0;
            let maxDiff = 0;
            let highAnomalyPixelCount = 0;
            const pixelCount = renderW * renderH;

            // Hitung perbedaan per piksel dengan amplifikasi kontras
            for (let i = 0; i < origData.data.length; i += 4) {
              const rDiff = Math.abs(origData.data[i] - compData.data[i]) * scale;
              const gDiff = Math.abs(origData.data[i + 1] - compData.data[i + 1]) * scale;
              const bDiff = Math.abs(origData.data[i + 2] - compData.data[i + 2]) * scale;

              const avgDiff = (rDiff + gDiff + bDiff) / 3;
              totalDiff += avgDiff;
              if (avgDiff > maxDiff) maxDiff = avgDiff;

              // Anomali jika deviasi melebihi ambang batas tertentu
              if (avgDiff > 75) {
                highAnomalyPixelCount++;
              }

              // Render visual ELA: bagian anomali akan bersinar terang (Cyber Red & Cyan gradient)
              elaImageData.data[i] = Math.min(255, rDiff);
              elaImageData.data[i + 1] = Math.min(255, gDiff);
              elaImageData.data[i + 2] = Math.min(255, bDiff);
              elaImageData.data[i + 3] = 255; // Alpha penuh
            }

            targetCtx.putImageData(elaImageData, 0, 0);

            const avgError = totalDiff / pixelCount;
            const anomalyRatio = (highAnomalyPixelCount / pixelCount) * 100;
            const isSuspicious = anomalyRatio > 4.5 || maxDiff > 220;

            resolve({
              renderWidth: renderW,
              renderHeight: renderH,
              avgError: avgError.toFixed(2),
              maxDiff: maxDiff.toFixed(0),
              anomalyRatio: anomalyRatio.toFixed(2),
              isSuspicious: isSuspicious,
              status: isSuspicious 
                ? { label: "Potensi Rekayasa Terdeteksi", color: "rose", desc: "Terdapat perbedaan signifikan pada tingkat kompresi piksel. Bagian yang bersinar terang kemungkinan besar merupakan hasil tempelan grafis atau suntingan berlapis." }
                : { label: "Tingkat Kompresi Seragam", color: "sky", desc: "Tingkat degradasi piksel relatif homogen di seluruh area, tidak ditemukan tanda-tanda tempelan grafis kontras tinggi." }
            });
          };

          compImg.onerror = reject;
          compImg.src = compressedDataUrl;
        } catch (err) {
          reject(err);
        }
      }
    });
  },

  /**
   * Mengekstrak dan Menganalisis Metadata EXIF / JFIF dari berkas citra
   * @param {File} file - Berkas gambar yang diunggah
   * @returns {Promise<object>} Laporan metadata dan deteksi software
   */
  async extractMetadata(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = function(e) {
        const buffer = e.target.result;
        const view = new DataView(buffer);

        const result = {
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          fileType: file.type || 'image/jpeg',
          hasExif: false,
          make: null,
          model: null,
          software: null,
          dateTime: null,
          dateTimeOriginal: null,
          photoshopMarker: false,
          isEdited: false,
          anomalies: []
        };

        // Periksa apakah ini berkas JPEG (SOI marker 0xFFD8)
        if (view.byteLength > 2 && view.getUint16(0, false) === 0xFFD8) {
          let offset = 2;
          const length = view.byteLength;

          while (offset < length) {
            if (view.getUint8(offset) !== 0xFF) break;
            const marker = view.getUint8(offset + 1);

            // 0xFFDA: Start of Scan (Hentikan pencarian header)
            if (marker === 0xDA) break;

            const segmentLength = view.getUint16(offset + 2, false);

            // 0xFFED: Photoshop IRB (Image Resource Block) marker
            if (marker === 0xED) {
              const psTag = getString(view, offset + 4, 9);
              if (psTag.startsWith('Photoshop')) {
                result.photoshopMarker = true;
                result.isEdited = true;
                result.anomalies.push("Terdeteksi Photoshop 3.0 IRB Marker di segmen biner");
              }
            }

            // 0xFFE1: APP1 (Exif Marker)
            if (marker === 0xE1) {
              const exifHeader = getString(view, offset + 4, 4);
              if (exifHeader === 'Exif') {
                result.hasExif = true;
                parseExifData(view, offset + 10, result);
              }
            }

            offset += 2 + segmentLength;
          }
        }

        // Analisis teks biner untuk mendeteksi jejak software populer
        try {
          const textChunk = new TextDecoder('utf-8', { fatal: false }).decode(new Uint8Array(buffer.slice(0, Math.min(buffer.byteLength, 65536))));
          
          const softwareSignatures = [
            { name: "Adobe Photoshop", regex: /Photoshop/i },
            { name: "Canva", regex: /Canva/i },
            { name: "GIMP", regex: /GIMP/i },
            { name: "Snapseed", regex: /Snapseed/i },
            { name: "PicsArt", regex: /PicsArt/i },
            { name: "Adobe Lightroom", regex: /Lightroom/i },
            { name: "Pixelmator", regex: /Pixelmator/i }
          ];

          for (const s of softwareSignatures) {
            if (s.regex.test(textChunk)) {
              if (!result.software) result.software = s.name;
              result.isEdited = true;
              if (!result.anomalies.includes(`Terdeteksi jejak biner software grafis: ${s.name}`)) {
                result.anomalies.push(`Terdeteksi jejak biner software grafis: ${s.name}`);
              }
            }
          }
        } catch (e) {
          // Abaikan kesalahan decoding teks
        }

        resolve(result);
      };

      reader.onerror = function() {
        resolve({
          fileName: file.name,
          fileSize: (file.size / 1024).toFixed(1) + ' KB',
          hasExif: false,
          anomalies: ["Gagal membaca data biner berkas"]
        });
      };

      reader.readAsArrayBuffer(file);
    });
  }
};

/**
 * Utilitas untuk membaca string ASCII dari DataView
 */
function getString(view, offset, length) {
  let str = '';
  for (let i = 0; i < length; i++) {
    if (offset + i < view.byteLength) {
      str += String.fromCharCode(view.getUint8(offset + i));
    }
  }
  return str;
}

/**
 * Parser TIFF / IFD0 sederhana untuk membaca Make, Model, Software, DateTime
 */
function parseExifData(view, tiffStart, result) {
  if (tiffStart + 8 > view.byteLength) return;

  const endianMarker = view.getUint16(tiffStart, false);
  const littleEndian = endianMarker === 0x4949; // 'II'

  const firstIFDOffset = view.getUint32(tiffStart + 4, littleEndian);
  if (tiffStart + firstIFDOffset + 2 > view.byteLength) return;

  const numEntries = view.getUint16(tiffStart + firstIFDOffset, littleEndian);
  let entryOffset = tiffStart + firstIFDOffset + 2;

  for (let i = 0; i < numEntries; i++) {
    if (entryOffset + 12 > view.byteLength) break;

    const tag = view.getUint16(entryOffset, littleEndian);
    const type = view.getUint16(entryOffset + 2, littleEndian);
    const count = view.getUint32(entryOffset + 4, littleEndian);
    const valueOffset = view.getUint32(entryOffset + 8, littleEndian);

    // Tipe 2: ASCII String
    if (type === 2 && count > 0) {
      const dataOffset = count <= 4 ? (entryOffset + 8) : (tiffStart + valueOffset);
      if (dataOffset + count <= view.byteLength) {
        let strVal = getString(view, dataOffset, count).trim().replace(/\0+$/, '');

        switch (tag) {
          case 0x010F: // Make
            result.make = strVal;
            break;
          case 0x0110: // Model
            result.model = strVal;
            break;
          case 0x0131: // Software
            result.software = strVal;
            result.isEdited = true;
            result.anomalies.push(`Metadata Software: ${strVal}`);
            break;
          case 0x0132: // DateTime
            result.dateTime = strVal;
            break;
          case 0x9003: // DateTimeOriginal
            result.dateTimeOriginal = strVal;
            break;
        }
      }
    }

    entryOffset += 12;
  }
}

window.ImageForensics = ImageForensics;
