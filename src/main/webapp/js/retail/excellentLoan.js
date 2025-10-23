// 전역 변수로 차트 인스턴스 관리
let callsChart = null;
let scoreChart = null;
let issueChart = null;
let callsChartData = null;
let scoreChartData = null;
let problemChartData = null;
let callsAllChartData = null;
let selectedRowIndex = -1; // 선택된 행의 인덱스 추적

// 데이터 예시
let sampleData = [];

$(document).ready(function() {
    // 이벤트 바인딩
    bindEvent();
    //화면 로드
    loadPage();
    //차트 로드
    // loadChartData();

});

function loadPage() {
    //상담사 목록
    getCounselorList("TA0002");
    //목록조회
    searchList();
}

function openDetailPage(callId,taskId) {
    const width = 1024;
    const height = 768;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    window.open(
        `/retail/excellentLoanDetailPage.do?callId=${callId}&taskId=${taskId}`,
        'DetailView',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}


/**
 * 검색결과 목록 조회
 * @param Page
 */
function searchList(Page) {
    var page = Page || 1;
    var searchForm = $("#searchForm").serializeArray();

    // 페이지 이동인지 새로운 검색인지 구분
    const isNewSearch = page === 1;
    const loadingMessage = isNewSearch ? '검색 중입니다' : `${page}페이지를 불러오는 중입니다`;

    // 로딩 화면 표시
    showLoading('table', loadingMessage);

    const data = searchForm;
    data.push({name: 'taskId', value: 'TA0002'});
    data.push({name: 'currentPage', value: page});
    data.push({name: 'pageSize', value: $("#listTab").find("select[name=pageSize]").val()});
    data.push({name: 'sortOrder', value: JSON.stringify(sortOrder)});

    $.ajax({
        url: '/collection/selectMstrNonpayList.do',
        method: 'POST',
        data: data,
        traditional: false,
        success: function(response) {
            // 최소 500ms 로딩 표시 (너무 빠른 응답 시 깜빡임 방지)
            setTimeout(() => {
                try {
                    const data = response.data;

                    loadMstrSearchList(data);
                    updatePagination(data.currentPage, data.totalPages);

                } catch (error) {
                    console.error('데이터 처리 중 오류:', error);
                    showToastMessage('데이터 처리 중 오류가 발생했습니다.', 'error');
                } finally {
                    hideLoading();
                }
            }, 500);

        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');

            let errorMessage = '데이터 조회 중 오류가 발생했습니다.';
            if (xhr.status === 500) {
                errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.';
            } else if (xhr.status === 404) {
                errorMessage = '요청한 페이지를 찾을 수 없습니다.';
            } else if (xhr.status === 0) {
                errorMessage = '네트워크 연결을 확인해주세요.';
            }

            showToastMessage(errorMessage, 'error');
        }
    })
}

/**
 * 검색결과 데이터 로드
 * @param data
 * @returns {boolean}
 */
function loadMstrSearchList(data) {
    const mstrListTable = $('#mstrListTable');
    const tdTemplate = "<td class=\"px-4 py-2 whitespace-nowrap\"></td>"
    const trTemplate = "<tr onclick=\"\" class=\"hover:bg-gray-50 text-xs\"></tr>"
    const totalCount = data.totalCount;
    const customerCount = data.customerCount;
    var data = data.list;

    // 총 건수
    $("#listTab").find(".totalCount span").text(totalCount.toLocaleString());

    // 총 건수
    $("#listTab").find(".customerCount span").text(customerCount.toLocaleString());

    // 목록 초기화
    $('#mstrListTable tbody').empty();
    selectedRowIndex = -1; // 선택된 행 인덱스 초기화

    if(data == null || data == undefined) {
        console.log("error! 데이터가 없습니다.");
        return false;
    }
    data.forEach((row, index) => {
        const $trTemplate = $(trTemplate);

        // 행 클릭 이벤트 추가 (전체 행 클릭 가능)
        $trTemplate.on("click", function(e) {
            // 이전에 선택된 행의 스타일 제거
            $('#mstrListTable tbody tr').removeClass('selected-row');

            // 현재 행에 선택 스타일 적용
            $(this).addClass('selected-row');
            selectedRowIndex = index;

            // Call 번호 셀을 클릭한 경우에만 상세 페이지 열기
            if ($(e.target).hasClass('call-number-link') || $(e.target).closest('.call-number-cell').length > 0) {
                openDetailPage(row.callId, row.taskId);
            }
        });
        $trTemplate.append($(tdTemplate).text(row.callDt).addClass("text-center"));
        $trTemplate.append($(tdTemplate).text(row.custNum).addClass("text-center"));
        $trTemplate.append($(tdTemplate).text(row.counselorCd).addClass("text-center"));
        $trTemplate.append($(tdTemplate).text(row.counselorName).addClass("text-center"));
        // Call 번호 컬럼에 특별한 클래스 추가
        const callNumberCell = $(tdTemplate)
            .addClass("text-center call-number-cell")
            .append(
                $('<span>')
                    .addClass("call-number-link text-blue-600 hover:text-blue-800")
                    .text(row.callId)
            );
        $trTemplate.append(callNumberCell);
        // $trTemplate.append($(tdTemplate).addClass("cursor-pointer text-blue-600 hover:text-blue-800").on("click",function(){ openDetailPage(row.callId,row.taskId) }).text(row.callId));
        //$trTemplate.append($(tdTemplate).text(row.taskName));
        $trTemplate.append($(tdTemplate).text(row.item04).addClass("text-center")); // 진행상태
        $trTemplate.append($(tdTemplate).text(row.item01).addClass("text-center")); // 리콜약속
        $trTemplate.append($(tdTemplate).text(row.item02)); // 약속일시
        $trTemplate.append($(tdTemplate).text(row.item03).addClass("text-center")); // 재확인필요
        $trTemplate.append($(tdTemplate).text(row.scoreValue).addClass("text-center"));

        mstrListTable.find("tbody").append($trTemplate);
    })
}

// 페이징 업데이트
function updatePagination(currentPage, totalPages) {
    const $pagination = $(".pagination");
    $pagination.empty();

    const pagingIndex = Math.ceil(currentPage /10);
    const pageMax = Math.min(pagingIndex*10,totalPages);
    const pageMin = Math.max((pagingIndex-1)*10,1);

    // 이전 페이지 버튼
    if(currentPage > 1) {
        let prePage = pageMin;

        $pagination.append(`
            <a href="#" onclick="searchList(${prePage})" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">이전</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </a>
        `);
    }

    // 페이지 번호들
    for(let i = (pagingIndex-1)*10+1; i <= pageMax; i++) {
        if(i === currentPage) {
            $pagination.append(`
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">${i}</span>
            `);
        } else {
            $pagination.append(`
                <a href="#" onclick="searchList(${i})" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">${i}</a>
            `);
        }
    }

    // 다음 페이지 버튼
    if(currentPage < totalPages) {
        let nextPage = pageMax;
        if(pageMax === totalPages) {
            nextPage = pageMax;
        } else {
            nextPage = pageMax + 1;
        }
        $pagination.append(`
            <a href="#" onclick="searchList(${nextPage})" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">다음</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </a>
        `);
    }
}


// 목록 다운로드 버튼 클릭 이벤트 핸들러
function downloadList() {
    showLoading('minimal', '엑셀 파일을 생성하는 중입니다');
    // 현재 검색 조건 가져오기
    const searchForm = $("#searchForm").serializeArray();

    const data = searchForm;
    data.push({name: 'taskId', value: "TA0002"});
    data.push({name: 'currentPage', value: 1});
    data.push({name: 'sortOrder', value: JSON.stringify(sortOrder)});
    let headerNames = [];
    let headerKeys = [];
    $("#mstrListTable tr th").each(function() {
        headerNames.push($(this).text().trim());
        headerKeys.push($(this).data("sort"));
    });
    data.push({name:"headerNames", value: headerNames});
    data.push({name:"headerKeys", value: headerKeys});

    // AJAX 요청
    $.ajax({
        url: '/common/downloadList.do',
        method: 'POST',
        data: data,
        xhrFields: {
            responseType: 'blob'
        },
        success: function(blob) {
            hideLoading();
            // 파일 다운로드
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `상담목록_${new Date().toISOString().slice(0, 10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('다운로드 실패:', error);
            alert('목록 다운로드 중 오류가 발생했습니다.');
        }
    });
}

/**
 * ===========================================================
 *  차트 및 시트관련 함수
 * ===========================================================
 */

function loadChartData() {

    selectCallChartData();
    //selectScoreChartData();
    //initializeCharts();
}

function selectCallChartData() {
    showLoading('full');

    var searchForm = $("#statsSearchForm").serializeArray();

    const data = searchForm;
    data.push({name: 'taskId', value: "TA0002"});
    data.push({name: 'typeId', value: "T0002"});

    $.ajax({
        url: '/retail/selectCallChartData.do',
        method: 'POST',
        data: data,
        success: function(response) {
            // 최소 500ms 로딩 표시 (너무 빠른 응답 시 깜빡임 방지)
            setTimeout(() => {
                try {
                    initChartData(response.data,"TA0002","CALL");
                    initChartData(response.allResult,"TA0002","ALL");
                    // initChartData(response.callChartData,"TA0001","CALL");
                    // initChartData(response.scoreChartData,"TA0001","SCORE");
                    // initChartData(response.problemChartData,"TA0001","PROBLEM");

                    initSheetData(response.data);

                    initializeCharts();
                } finally {
                    hideLoading();
                }
            }, 500);

        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    })
}


// 차트 제거 함수
function destroyCharts() {
    // 각 차트 인스턴스가 존재하면 제거
    if (callsChart) {
        callsChart.destroy();
        callsChart = null;
    }
    if (scoreChart) {
        scoreChart.destroy();
        scoreChart = null;
    }
    if (issueChart) {
        issueChart.destroy();
        issueChart = null;
    }
}

function initChartData(data,taskId,type) {
    var taskId = taskId ? taskId : '';
    if(data == null || data == undefined || data.length == 0) {
        console.log("error! 데이터가 없습니다.");
        if(type == "CALL") {
            callsChartData = null;
        } else if(type == "SCORE") {
            scoreChartData = null;
        } else if(type == "PROBLEM") {
            problemChartData = null;
        } else if(type == "ALL") {
            callsAllChartData = null;
        }
        return false;
    }

    let chartData = data;
    /*if(taskId != null && taskId != '') {
        chartData = data.filter(row => {
            return row.taskId == taskId;
        });
    }*/

    if(type == "CALL") {
        callsChartData = chartData;
    } else if(type == "SCORE") {
        scoreChartData = chartData;
    } else if(type == "PROBLEM") {
        problemChartData = chartData;
    } else if(type == "ALL") {
        callsAllChartData = chartData;
    }

}

function initializeCharts() {
    // 기존 차트 제거
    destroyCharts();

    const callNameList = [];
    const callCntList = [];
    const ccData = callsChartData.filter(data => {
        return data.itemId == "I0000";
    });

    let callDatasets = null;
    let callMaxDt = Math.max(ccData[0].callCnt, ccData[0].custCnt);

    if(callsAllChartData != null) {
        const callAllData = callsAllChartData.filter(data => {
            return data.itemId == "I0000";
        });
        callDatasets = [
            {
                label: '전체',
                data: [callAllData[0].custCnt, callAllData[0].callCnt],
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)', // 노란색
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 99, 132, 0.7)'
                ]
            },
            {
                label : '상담사',
                data: [ccData[0].custCnt, ccData[0].callCnt],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }
        ]
        callMaxDt = Math.max(callAllData[0].callCnt, callAllData[0].custCnt)
    } else {
        callDatasets = [
            {
                label : '상담사',
                data: [ccData[0].custCnt, ccData[0].callCnt],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }
        ]
    }

    // 콜수/고객수/상담수 차트
    callsChart = new Chart($('#callsChart'), {
        type: 'bar',
        data: {
            labels: ["고객수", "콜수"],
            datasets: callDatasets
        },
        options: {
            indexAxis: 'y',  // 가로 막대 차트
            responsive: true,
            maintainAspectRatio: false, // 추가: 가로세로 비율 고정 해제
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    max: callMaxDt,
                    title: {
                        display: true,
                        text: '건수'
                    }
                }
            }
        }
    });


    const scoreNameList = [];
    const scoreCntList = [];
    const scData = callsChartData.filter(data => {
        return data.itemId == "I0010";
    });

    scData.forEach(row => {
        scoreNameList.push(row.contentName);
        scoreCntList.push(row.custCnt);
    })
    let scoreMaxDt = Math.max(...scoreCntList);
    let scoreDatasets = null;

    if(callsAllChartData != null) {
        const scoreAllNameList = [];
        const scoreAllCntList = [];
        const callAllData = callsAllChartData.filter(data => {
            return data.itemId == "I0010";
        });

        callAllData.forEach(row => {
            scoreAllNameList.push(row.contentName);
            scoreAllCntList.push(row.custCnt);
        })
        scoreDatasets = [
            {
                label: '전체',
                data: scoreAllCntList,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 180, 136, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ]
            },
            {
                label : '상담사',
                data: scoreCntList,
                backgroundColor: [
                    'rgba(255, 206, 86, 0.7)', // 노란색
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ]
            }
        ]
        scoreMaxDt = Math.max(...scoreAllCntList);
    } else {
        scoreDatasets = [
            {
                label : '전체',
                data: scoreCntList,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 180, 136, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ]
            }
        ]
    }

    // 평균 스크립트 Score 차트
    scoreChart = new Chart($('#scoreChart'), {
        type: 'bar',
        data: {
            labels: scoreNameList,
            datasets: scoreDatasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // 추가: 가로세로 비율 고정 해제
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: scoreMaxDt,
                    title: {
                        display: true,
                        text: '명'
                    }
                }
            }
        }
    });
}


function initSheetData(data) {
    let sheetData = data;
    // let scoreSheetData = response.scoreChartData;
    // let problemSheetData = response.problemChartData;

    // 미납안내 데이터만 추출
    //callSheetData = callSheetData.filter(row => { return row.taskId === 'TA0002'; });

    sampleData = [];

    sheetData.forEach(row => {

        var filteredData = sheetData.filter(d => {
            return d.itemName == row.itemName;
        });

        sampleData.push({category:row.itemName, item:row.contentName,callCnt:row.callCnt,callRto:row.callRto,custCnt:row.custCnt,custRto:row.custRto,rowspan: filteredData.length})
    })

/*
    callSheetData.forEach(row => {
        sampleData.push({category:"전체", item:row.name,measure:row.cnt,ratio:row.ratio,rowspan: callSheetData.length});
    })

    scoreSheetData.forEach(row => {
        sampleData.push({category:"평균 스크립트 Score", item:row.name,measure:row.avgScore,ratio:"",rowspan: scoreSheetData.length});
    })

    problemSheetData.forEach(row => {
        sampleData.push({category:"문제소지 콜", item:row.name,measure:row.cnt,ratio:row.ratio,rowspan: problemSheetData.length});
    })*/

    renderStatsDetailGrid(sampleData);
}

// 상세 통계 그리드 데이터 생성 함수
function renderStatsDetailGrid(data) {
    const tbody = $('#statsDetailGrid');
    tbody.empty();

    // 데이터 그룹화를 위한 현재 구분값 추적
    let currentCategory = '';
    let preCategory = "";


    data.forEach((row, index) => {
        let rowspanYn = true;
        if((row.category === preCategory) || (row.rowspan <= 1)) {
            rowspanYn = false;
        }
        preCategory = row.category;

        const tr = $('<tr>').addClass(index % 2 === 0 ? 'bg-white' : 'bg-gray-50');

        // 구분이 변경될 때마다 스타일 적용
        if (currentCategory !== row.category) {
            currentCategory = row.category;
            tr.addClass('border-t-2 border-gray-300');
        }

        let tdCategory ='';
        if(rowspanYn) {
            tdCategory = $('<td rowspan="'+row.rowspan+'">').addClass('px-6 py-4 whitespace-nowrap bg-indigo-50');
        } else if (row.rowspan === 1) {
            tdCategory = $('<td>').addClass('px-6 py-4 whitespace-nowrap bg-indigo-50');
        }
        // 구분 열
        if (currentCategory === row.category) {
            if(tdCategory != '') {
                // 구분 스타일
                tdCategory.html(`
                    <div class="flex items-center">
                        <div class="text-sm font-medium text-gray-900">${row.category}</div>
                    </div>
                `);
            }
        }

        // 항목 열
        const tdItem = $('<td>').addClass('px-6 py-4 whitespace-nowrap bg-indigo-50').html(`
            <div class="flex items-center">
                <div class="text-sm font-medium text-gray-900">${row.item}</div>
            </div>
        `);

        let tdCallCnt;
        if(row.category === "Score") {
            // 측정치 열
            tdCallCnt = $('<td>').addClass('px-6 py-4 whitespace-nowrap text-right').html(`
            <div class="text-sm text-gray-900">${row.callCnt}</div>
        `);
        } else {
            // 측정치 열
            tdCallCnt = $('<td>').addClass('px-6 py-4 whitespace-nowrap text-right').html(`
            <div class="text-sm text-gray-900">${numberWithCommas(row.callCnt)}</div>
        `);
        }

        // 비중 열
        const tdCallRto = $('<td>').addClass('px-6 py-4 whitespace-nowrap text-right').html(`
            <div class="text-sm text-gray-900">${row.callRto? parseFloat(row.callRto).toFixed(1) : ''}</div>
        `);

        // 측정치 열
        const tdCustCnt = $('<td>').addClass('px-6 py-4 whitespace-nowrap text-right').html(`
            <div class="text-sm text-gray-900">${numberWithCommas(row.custCnt)}</div>
        `);

        // 비중 열
        const tdCustRto = $('<td>').addClass('px-6 py-4 whitespace-nowrap text-right').html(`
            <div class="text-sm text-gray-900">${row.custRto ? parseFloat(row.custRto).toFixed(1) : ''}</div>
        `);

        tr.append(tdCategory, tdItem, tdCallCnt, tdCallRto, tdCustCnt, tdCustRto);
        tbody.append(tr);
    });
}


// 엑셀 다운로드 함수
function downloadStats() {
    showLoading('minimal', '엑셀 파일을 생성하는 중입니다');

    let headerNames = [];
    let headerKeys = [];
    $("#mstrStatsTable tr th").each(function() {
        headerNames.push($(this).text().trim());
        headerKeys.push($(this).data("header"));
    });
    // data.push({name:"headerNames", value: headerNames});
    // data.push({name:"headerKeys", value: headerKeys});

    // 현재 상세 통계 그리드의 데이터 수집
    const statsData = sampleData.map(row => ({
        category: row.category,
        item: row.item,
        callCnt: row.callCnt,
        callRto: row.callRto,
        custCnt: row.custCnt,
        custRto: row.custRto
    }));

    // 검색 조건도 포함
    const data = {
        statsData: statsData,
        searchParams: {
            startDate: $("#statsSearchForm input[name=startDate]").val(),
            endDate: $("#statsSearchForm input[name=endDate]").val(),
            counselor: $("#statsSearchForm select[name=counselor]").val(),
            product: $("#statsSearchForm select[name=product]").val()
        },
        headerNames: headerNames,
        headerKeys: headerKeys
    };

    // 서버로 데이터 전송
    $.ajax({
        url: '/common/downloadStats.do',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        xhrFields: {
            responseType: 'blob'
        },
        success: function(blob) {
            hideLoading();
            // 파일 다운로드
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `상담통계_${new Date().toISOString().slice(0,10)}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        },
        error: function(xhr, status, error) {
            hideLoading();
            console.error('다운로드 실패:', error);
            alert('통계 다운로드 중 오류가 발생했습니다.');
        }
    });
}


function bindEvent() {
    commonBindEvent();

    $('.tab-link').click(function(e) {
        const target = $(this).data('tab');

        if (target === 'stats') {
            loadChartData();
        }
    })

    $(".sortable th").on("click", function(e) {
        const column = $(this).data('sort');

        //data-sort 가 있는 경우만
        if(column){
            //다중 정렬 추가
            handleMultiSort(column);
            updateSortUI();
            searchList(1);
        }
    })

    // 정렬 초기화 버튼 이벤트
    $('#resetSortBtn').on('click', function() {
        // 버튼 로딩 상태 표시
        const $btn = $(this);
        const originalHtml = $btn.html();

        $btn.prop('disabled', true).html(`
            <svg class="w-4 h-4 mr-1 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            정렬 초기화 중...
        `);

        resetSort();

        // 정렬 초기화 후 검색
        // 시각적 피드백을 위한 애니메이션 효과
        setTimeout(() => {
            searchList(1);
            $btn.prop('disabled', false).html(originalHtml);
            showToastMessage('정렬이 초기화되었습니다.', 'info');
        }, 500);

        searchList(1);
    });

    //페이지 사이즈 변경 이벤트
    $("#listTab").find("select[name=pageSize]").on("change", function(e) {
        searchList();
    });

    // 검색 폼 제출 이벤트
    $('#searchForm').submit(function(e) {
        e.preventDefault();
        searchList();
    });

    // 통계 검색 폼 제출
    $('#statsSearchForm').on('submit', function(e) {
        e.preventDefault();
        loadChartData(); // 새로운 차트 생성

    });

    $('.download-list-btn').on('click', downloadList);
}