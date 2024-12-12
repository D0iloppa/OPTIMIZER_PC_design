optimizerPageInit();

function optimizerPageInit() {

  /*
  dictDefaultMessage: `
            <div style='display: flex; align-items: center; flex-direction:column'>
                <svg class="mx-auto mb-2 w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                클릭하여 파일을 첨부하거나, 파일을 끌어오세요
            </div>`,
    */



  //g_optimizer.dropzone = new Dropzone("#optimizer_dropzone", {
  

  g_optimizer.tables = {};


  g_optimizer.typeList = [
    { type: 'all' },
  ];

  let file_types = g_om.file_types;
  for (let type in file_types) {
    g_optimizer.typeList.push({
      type
    });
  }

  /*
  { type : 'image'},
  { type : 'video'},
  { type : 'text'},
  { type : 'font'},
  { type : 'unstructured'}
  */

  
  let summaryHeight = 384;
  let _rowHeight = Math.round(summaryHeight / g_optimizer.typeList.length);

  // Tabulator 높이 계산
  let calculatedHeight = g_optimizer.typeList.length * _rowHeight;

  g_optimizer.tables['summary'] = new Tabulator("#files-summary", {
    data: g_optimizer.typeList,
    layout: "fitColumns",
    height: `${calculatedHeight}px`,
    rowHeight: _rowHeight,
    maxHeight: false, // 스크롤 방지
    virtualDom: false, // 가상 DOM 비활성화 (스크롤 최적화 제거)
    renderComplete: function () {
      // 테이블 렌더링 완료 후 테이블 높이 확인 및 조정
      const tableElement = document.querySelector("#files-summary");
      const actualHeight = tableElement.offsetHeight;
      if (actualHeight > calculatedHeight) {
          tableElement.style.height = `${calculatedHeight - (actualHeight - calculatedHeight)}px`;
      }
    },
    rowFormatter: function (row) {
      // 현재 행의 DOM 요소에 높이를 동적으로 설정
      const element = row.getElement();
      element.classList.add("files-summary-row-style");
   
    },
    columns: [
      {
        title: "",
        field: "card",
        formatter: function (cell) {
          return getCardElem(cell.getData());
        },
        headerSort: false,
        resizable: false
      }
    ],
    headerVisible: false // 헤더를 숨기도록 설정
  });


  g_optimizer.tables['summary'].on("rowClick",function(e, row){
    const file_types = g_om.file_types;
    const {type} = row.getData(); // 클릭된 행의 데이터 가져오기
    const typeInfo = file_types[type];

    if(typeInfo){


      let ext_arr = typeInfo.ext_arr;
      g_optimizer.tables['file-list'].setFilter(function (data) {
        const fileName = data.name;
        return ext_arr.some(ext => fileName.endsWith(ext));
      });


    }else{
      g_optimizer.tables['file-list'].clearFilter();
    }

  }); 


  g_optimizer.tables['file-list'] = new Tabulator("#file-list", {
    data: [],
    layout: "fitColumns",
    height: "287px",
    //rowHeight:20,
    movableColumns: false, 
    placeholder:`
      <div style="text-align: center; padding: 20px; font-size: 12px; color: gray;">
            최적화할 파일을<br>
            <span style="color: #c79334; padding:0; font-size: 12px;">마우스로 끌어서</span> 넣어주세요<br>
            <img src="styles/img/appendix.png" style="width: 50px; display: inline-block; margin-top: 10px;">
      </div>
    `,
    rowFormatter: function (row) {
      // 현재 행의 DOM 요소에 높이를 동적으로 설정
      const element = row.getElement();
      element.classList.add("files-list-row-style");
    },
    columns: [
      {
        title: "삭제",
        field: "del_btn",
        width: "5px",
        resizable: false,
        visible:false,
        titleFormatter: function () {
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
          deleteBtn.onclick = function () {

            const list = g_optimizer.tables['file-list'].getData();
            if(list.length==0) return;

            // 전체 삭제
            swal({
              title: "정말 삭제하시겠습니까?",
              text: "이 작업은 되돌릴 수 없습니다.",
              icon: "warning",
              buttons: ["취소", "삭제"],
              dangerMode: true,
            }).then((willDelete) => {
              if (willDelete) {
                g_optimizer.dropzone.removeAllFiles(true);
              } else {
                console.log('삭제 취소됨');
              }
            });
          };
          return deleteBtn;
        },
        
        formatter: function (cell, formatterParams) {
          const deleteBtn = document.createElement('button');
          deleteBtn.className = 'delete-btn';
          deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
          const file = cell.getData();
          deleteBtn.onclick = function () {
            g_optimizer.dropzone.removeFile(file);
          };
          return deleteBtn;
        },
        headerSort: false
      },
      { 
        title: "", 
        field: "checkbox", 
        hozAlign: "center", 
        headerHozAlign: "center",
        formatter: "rowSelection", 
        titleFormatter: "rowSelection", 
        titleFormatterParams:{
          rowRange:"active" //only toggle the values of the active filtered rows
        },
        headerSort: false, 
        width: 20 // 체크박스 컬럼 너비
      },
      {
        title: "파일명",
        field: "file_name",
        formatter: function (cell) {
          const data = cell.getData();
          const { name, size } = data;
          return name;
        }
      },
      {
        title: "파일 유형",
        field: "file_type",
        hozAlign: "center",
        width: 100, 
        formatter: function (cell) {
          const data = cell.getData();
          const { name, size } = data;

          const ext = getFileExtension(name);
          const type = getFileTypeByExtension(ext);

          let label = "알 수 없음";
          if (type) {
            label = `${type.alias}`;
          }
          let icon = getFileIcon(ext, type);

          return `<span> <i class=${icon}></i> ${label} </span>`;
        }
      },
      {
        title: "파일 크기",
        field: "file_size",
        width: 100, 
        hozAlign: "right",
        formatter: function (cell) {
          const data = cell.getData();
          const { name, size } = data;
          return formatFileSize(size);
        }
      }
    ]
  });

  g_optimizer.tables['file-list'].on("rowClick", function (e, row) {
    // 이미 선택된 상태인지 확인
    if (row.isSelected()) {
        row.deselect(); // 선택 해제
    } else {
        row.select(); // 선택
    }
  });



  g_optimizer.dropzone = new Dropzone("#file-list", {
    url: "/dummy-upload",
    previewsContainer: false,
    autoProcessQueue: false, // 파일을 자동으로 업로드하지 않도록 설정
    clickable: ".upload_btn",
    acceptedFiles: generateAcceptedFilesString(g_om.file_types),
    // events
    init: function () {
      this.on("success", function (file, response) {
        console.log("File uploaded successfully:", response);
      });

      this.on("addedfile", function (file) {
        updateFileStatus();
      });

      this.on("removedfile", function (file) {
        updateFileStatus();
      });

    },
  });





}


function updateFileStatus() {
  let fileList = getFileList();

  g_optimizer.tables['file-list'].setData(fileList);
  g_optimizer.tables['summary'].setData(g_optimizer.typeList);
}

function getFileList() {
  return [];
}

function getCardElem(data) {

  const { type = false, om_algorithm = 'OPTIMIZER 최적화' } = data;

  let result = '카드';



  let fileList = getFileList();
  let fullSize = fileList.length;
  let totalFileSize = fileList.reduce((acc, file) => acc + file.upload.total, 0);

  const { totalFiles, totalSize } = getFileSummary(fileList, type);

  let label = "";
  let icon = "ri-file-zip-line";

  let useSetting = true;
  switch (type) {
    case 'all':
      //label = `모든 파일 (${totalFiles} Files)`;
      label = `모든 파일`;
      icon = "ri-folder-3-line";
      useSetting = false;
      break;
    case 'image':
      //label = `이미지 (${totalFiles} Files)`;
      label = `이미지`;
      icon = "ri-image-2-line";
      break;
    case 'video':
      //label = `비디오 (${totalFiles} Files)`;
      label = `비디오`;
      icon = "ri-video-line";
      break;
    case 'text':
      //label = `텍스트 (${totalFiles} Files)`;
      label = `텍스트`;
      icon = "ri-file-text-line";
      break;
    case 'font':
      //label = `폰트 (${totalFiles} Files)`;
      label = `폰트`;
      icon = "ri-font-size";
      break;
    case 'unstructured':
      //label = `비정형 (${totalFiles} Files)`;
      label = `문서 파일`;
      icon = "ri-file-unknow-line";
      break;
  }

  let labelDiv = (useSetting) ? `
      <span>${label} | </span>
      <span style="margin-left: 3px; margin-right:5px; font-size: 9px; line-height: 20px; color: #54d242;">${om_algorithm}</span>
      <i style="font-size: 9px; line-height: 20px;" class="ri-settings-5-line"></i>` : `
      <span>${label}</span>
      `;


  result = `
        <div class="panel-body note-link">
            <a href="#note1" data-toggle="tab">
              <h5 style="font-weight:bold; font-size:15px; color:#6a6c6f;">${label}</h5>
              <div class="custom-progress-bar-container">
                  <div class="custom-progress-bar" 
                      style="width: ${totalFileSize == 0 ? 0 : (totalSize / totalFileSize) * 100}%;">
                  </div>
              </div>
              <div class="" style="color:#6a6c6f; margin-top:10px; font-size:18px; font-weight:600;">
                ${totalFiles}건 <span class="bar">|</span> 
                <span style="font-size:15px;">${formatFileSize(totalSize)}</span>
              </div>
            </a>
        </div>
    `;



  return result;
}



function filterFilesByType(fileList, type) {
  return fileList.filter(file => {
    const ext = getFileExtension(file.upload.filename).toLowerCase();
    if (type === 'all') {
      return true;
    }


    const FILE_TYPES = g_om.file_types;

    return FILE_TYPES[type]?.ext_arr?.includes(ext) || false;
  });
}



// 파일 목록 요약 함수
function getFileSummary(fileList, type) {
  const filteredFiles = filterFilesByType(fileList, type);
  const totalFiles = filteredFiles.length;
  const totalSize = filteredFiles.reduce((acc, file) => acc + file.upload.total, 0);

  return {
    totalFiles,
    totalSize
  };
}

function selectFileDelete(){
  swal({
    title: "정말 삭제하시겠습니까?",
    text: "이 작업은 되돌릴 수 없습니다.",
    icon: "warning",
    buttons: ["취소", "삭제"],
    dangerMode: true,
  }).then((willDelete) => {
    if (willDelete) {
      let table = g_optimizer.tables['file-list'];
      let fileList = table.getSelectedData();

      for(let file of fileList){
        g_optimizer.dropzone.removeFile(file);
      }
    } else {
      console.log('삭제 취소됨');
    }
  });
}

async function fileSend(selected) {

  let fileList = getFileList();

  if(selected){
    let table = g_optimizer.tables['file-list'];
    fileList = table.getSelectedData();
  }

  if(fileList.length==0){
    swal("최적화를 수행할 파일을 첨부해 주세요");
    return;
  }


  const filePaths = fileList.map(file => ({
    name: file.name,
    size: file.size,
    path: webUtils.getPathForFile(file),
    type: getFileTypeByExtension(getFileExtension(file.name))
  }));

  console.log(filePaths);

  
  try {
    showLoading();
    const result = await ipcRenderer.invoke('file-send', filePaths);
    console.log('백엔드 처리 결과:', result);

    const { status, optimize_id, optimize_sn } = result;
    if (status == 'send') {

      let activeMenuElem = document.querySelector('.menu-item[menuNm="history"]');
      let actualPage = "history_detail";

      loadContent(
        activeMenuElem,
        actualPage,
        {
          pageCallBack: function () {
            hideLoading();
            detailInit({ optimize_id, optimize_sn });
          }
        });


    }
    // 처리 결과에 따라 추가 로직 수행 가능
  } catch (error) {
    hideLoading();
    console.error('파일 전송 중 오류 발생:', error);
  }

}

function generateAcceptedFilesString(fileTypes) {
  // 모든 확장자를 하나의 배열로 병합하고, 형식에 맞게 "*.확장자"로 변환
  const allExtensions = Object.values(fileTypes)
    .flatMap(type => type.ext_arr) // 모든 파일 형식의 확장자 배열을 병합
    .map(ext => `.${ext}`) // 각 확장자 앞에 '.' 추가
    .join(','); // 콤마로 구분된 문자열로 변환

  return allExtensions;
}
