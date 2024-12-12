function formatFileSize(fileSizeInBytes) {
    if (fileSizeInBytes >= 1073741824) {
      return (fileSizeInBytes / 1073741824).toFixed(2) + ' GB';
    } else if (fileSizeInBytes >= 1048576) {
      return (fileSizeInBytes / 1048576).toFixed(2) + ' MB';
    } else if (fileSizeInBytes >= 1024) {
        return (fileSizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
        return fileSizeInBytes + ' bytes';
    }
}


function simpleFormattedTime(date) {
    // date가 timestamp 형태면 Date 객체로 변환
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    // YYYY-MM-DD HH:MM:SS 포맷으로 변환
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, '0');
    let day = String(date.getDate()).padStart(2, '0');
    let hours = String(date.getHours()).padStart(2, '0');
    let minutes = String(date.getMinutes()).padStart(2, '0');
    let seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

function getFileIcon(ext, type){
    // 확장자에 대한 아이콘이 없는 경우 type아이콘으로 제공
    // 최종적으로 알 수 없는 경우 unknown으로 default 제공

    let icon = false;
    // 확장자에 대한 처리
    const lowerExt = ext.toLowerCase();

    if (lowerExt.includes("hwp")) {
        icon = "ri-file-hwp-line";
    } else if (lowerExt.includes("ppt")) {
        icon = "ri-file-ppt-2-line";
    } else if (lowerExt.includes("xls")) {
        icon = "ri-file-excel-2-line";
    } else if (lowerExt.includes("doc")) {
        icon = "ri-file-word-2-line";
    } else if (lowerExt.includes("pdf")) {
        icon = "ri-file-pdf-line";
    }

    // type에 대한 처리
    if (!icon) {
        icon = type.type_icon || false;
    }

    // 최종 미확인 처리
    if (!icon) {
        icon = "ri-file-unknow-line";
    }


    return icon;


}

// 파일 유형 구하기 함수
function getFileTypeByExtension(ext) {
    ext = ext.toLowerCase();
    let FILE_TYPES = g_om.file_types;
  
    for (const [type, item] of Object.entries(FILE_TYPES)) {
      if (item.ext_arr.includes(ext)) {
        return item;
      }
    }
    return false;
  }

function getFileExtension(filename) {
    return filename.split('.').pop().toLowerCase();
}