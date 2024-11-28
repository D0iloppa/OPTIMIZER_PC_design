
function init(){
    // 샘플 데이터 생성
    const tableData = Array.from({ length: 20 }, (_, i) => ({
     id: i + 1,
     file_name: `file${i + 1}.jpg`,
     file_size: Math.floor(Math.random() * 50) + 20,
     file_type: `파일`,
   }));

   // Tabulator 테이블 초기화
   const table = new Tabulator("#upload_table", {
     height: "260px", // 테이블 높이 (스크롤 활성화)
     width:"300px",
     //data: [], // 데이터 배열
     data: tableData,
     layout: "fitColumns", // 컬럼 크기 조정
     rowHeight: 25,
     columns: [
        { 
            title: "", 
            field: "checkbox", 
            hozAlign: "center", 
            headerHozAlign: "center",
            formatter: "rowSelection", 
            titleFormatter: "rowSelection", 
            headerSort: false, 
            width: 50 // 체크박스 컬럼 너비
        },
        { 
            title: "이름", 
            field: "file_name", 
            hozAlign: "left", 
            headerHozAlign: "center",
            sorter: "string" 
        },
        { 
            title: "크기", 
            field: "file_size", 
            headerHozAlign: "center",
            hozAlign: "center", 
            sorter: "number", 
            formatter: "money", 
            formatterParams: { 
                precision: 2, 
                unit: "KB" 
            },
            width: 150, // 체크박스 컬럼 너비
        },
        { 
            title: "종류", 
            field: "file_type", 
            headerHozAlign: "center",
            hozAlign: "center", 
            sorter: "string" ,
            width: 100, // 체크박스 컬럼 너비
        }
     ],
     placeholder: `<div style="text-align: center; padding: 20px; font-size: 16px; color: gray;">
            <strong>업로드할 파일이 없습니다.</strong><br>
            파일을 <span style="color: orange;">드래그 앤 드롭</span>하거나<br>
            <button style="padding: 5px 10px; background-color: #007bff; color: #fff; border: none; border-radius: 4px; cursor: pointer;">
                파일 선택
            </button> 버튼을 클릭하세요.
        </div>`,
   });


   const typeList = [
        {
            "type": "all"
        },
        {
            "type": "image"
        },
        {
            "type": "video"
        },
        {
            "type": "unstructured"
        }
    ];

   const table_2 = new Tabulator("#upload_table_2", {
    data: typeList,
    layout: "fitColumns",
    rowHeight: 65,
    rowFormatter: function (row) {
        // 테이블의 높이를 가져오고, 데이터에 따른 행의 개수를 계산
        const tableElement = document.querySelector("#upload_table_2");
        const tableHeight = tableElement.offsetHeight; // 테이블 높이 가져오기
        const rowCount = typeList.length; // 행의 개수 가져오기
        const rowHeight = tableHeight / rowCount; // 각 행의 높이 계산

        // 현재 행의 DOM 요소에 높이를 동적으로 설정
        const element = row.getElement();
        element.style.height = `${rowHeight}px`;
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


}


function getCardElem(data) {

    const { type = false, om_algorithm = 'OPTIMIZER 최적화' } = data;
  
    let result = '카드';
  
  
  
    // let fileList = getFileList();
    let fileList = [];

    let fullSize = fileList.length;
    let totalFileSize = fileList.reduce((acc, file) => acc + file.upload.total, 0);
  
    //const { totalFiles, totalSize } = getFileSummary(fileList, type);

    let totalFiles = 100; 
    let totalSize = 10000;
  
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
                <h5><i class="fa-solid fa-folder"></i> ${label}</h5>
                <div style="display:flex;">
                    <h1>${totalFiles}건</h1>
                </div>
              </a>
          </div>
      `;
  
  
    return result;
  }




document.addEventListener('DOMContentLoaded', function () {
    init();
});