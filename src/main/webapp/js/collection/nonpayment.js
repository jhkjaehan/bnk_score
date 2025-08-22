// 전역 변수로 차트 인스턴스 관리
let callsChart = null;
let scoreChart = null;
let issueChart = null;
let callsChartData = null;
let scoreChartData = null;
let problemChartData = null;

// 데이터 예시
let sampleData = [];

$(document).ready(function() {
    bindEvent();

    //화면 로드
    loadPage();
    //차트 로드
    loadChartData();
});

function openDetailPage(callId) {
    const width = 1024;
    const height = 768;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    window.open(
        `/collection/nonpaymentDetailPage.do?callId=${callId}`,
        'DetailView',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}

function searchNonpayList(page) {
    var page = page || 1;

    var searchForm = $("#searchForm").serializeArray();

    const data = searchForm;
    data.push({name: 'taskId', value: "TA0001"});
    data.push({name: 'currentPage', value: page});
    data.push({name: 'pageSize', value: $("#listTab").find("select[name=pageSize]").val()});
    data.push({name: 'sortOrder', value: JSON.stringify(sortOrder)});

    $.ajax({
        url: '/collection/selectMstrNonpayList.do',
        method: 'POST',
        data: data,
        success: function(response) {
            const data = response.data;
            loadMstrNonpayList(data);
            updatePagination(data.currentPage, data.totalPages);
        },
        error: function(xhr, status, error) {
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    })
}

//화면 로드
function loadPage() {
    //상담사 목록
    getCounselorList("TA0001");
    //목록조회
    searchNonpayList();
}

function loadMstrNonpayList(data) {
    const mstrNonpayTable = $('#mstrNonpayTable');
    const tdTemplate = "<td class=\"px-4 py-2 whitespace-nowrap\"></td>"
    const trTemplate = "<tr onclick=\"\" class=\"hover:bg-gray-50 text-xs\"></tr>"
    const totalCount = data.totalCount;
    var data = data.list;

    // 총 건수
    $("#listTab").find(".totalCount span").text(totalCount.toLocaleString());

    // 목록 초기화
    $('#mstrNonpayTable tbody').empty();

    if(data == null || data == undefined) {
        console.log("error! 데이터가 없습니다.");
        return false;
    }
    data.forEach(row => {
        const $trTemplate = $(trTemplate);
        $trTemplate.append($(tdTemplate).text(row.callDt));
        $trTemplate.append($(tdTemplate).text(row.custNum));
        $trTemplate.append($(tdTemplate).text(row.counselorCd));
        $trTemplate.append($(tdTemplate).text(row.counselorName));
        $trTemplate.append($(tdTemplate).addClass("cursor-pointer text-blue-600 hover:text-blue-800").on("click",function(){ openDetailPage(row.callId) }).text(row.callId));
        $trTemplate.append($(tdTemplate).text(row.scoreValue));
        $trTemplate.append($(tdTemplate).text(row.item05)); //오안내
        $trTemplate.append($(tdTemplate).text(row.item06)); //금지문구
        $trTemplate.append($(tdTemplate).text(row.item07)); //불법추심
        $trTemplate.append($(tdTemplate).text(row.item08)); //납부의사

        mstrNonpayTable.find("tbody").append($trTemplate);
    })
}

// 페이징 업데이트
function updatePagination(currentPage, totalPages) {
    const $pagination = $(".pagination");
    $pagination.empty();

    // 이전 페이지 버튼
    if(currentPage > 1) {
        $pagination.append(`
            <a href="#" onclick="searchNonpayList(${currentPage - 1})" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">이전</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
            </a>
        `);
    }

    // 페이지 번호들
    for(let i = 1; i <= totalPages; i++) {
        if(i === currentPage) {
            $pagination.append(`
                <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">${i}</span>
            `);
        } else {
            $pagination.append(`
                <a href="#" onclick="searchNonpayList(${i})" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">${i}</a>
            `);
        }
    }

    // 다음 페이지 버튼
    if(currentPage < totalPages) {
        $pagination.append(`
            <a href="#" onclick="searchNonpayList(${currentPage + 1})" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">다음</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
            </a>
        `);
    }
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

    var searchForm = $("#statsSearchForm").serializeArray();

    const data = searchForm;
    data.push({name: 'taskId', value: "TA0001"});
    data.push({name: 'typeId', value: "T0002"});

    $.ajax({
        url: '/common/selectCallChartData.do',
        method: 'POST',
        data: data,
        success: function(response) {
            console.log(response);
            initChartData(response.callChartData,"TA0001","CALL");
            initChartData(response.scoreChartData,"TA0001","SCORE");
            initChartData(response.problemChartData,"TA0001","PROBLEM");

            initSheetData(response);

            initializeCharts();
        },
        error: function(xhr, status, error) {
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
    }

}

function initializeCharts() {
    // 기존 차트 제거
    destroyCharts();

    const callNameList = [];
    const callCntList = [];
    callsChartData.forEach(row => {
        callNameList.push(row.name);
        callCntList.push(row.cnt);
    })
    const callMaxDt = Math.max(...callCntList);

    // 콜수/고객수/상담수 차트
    callsChart = new Chart($('#callsChart'), {
        type: 'bar',
        data: {
            labels: callNameList,
            datasets: [{
                data: callCntList,
                backgroundColor: [
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        },
        options: {
            indexAxis: 'y',  // 가로 막대 차트
            responsive: true,
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
                        text: 'Count'
                    }
                }
            }
        }
    });

    const scoreNameList = [];
    const scoreCntList = [];
    scoreChartData.forEach(row => {
        scoreNameList.push(row.name);
        scoreCntList.push(row.avgScore);
    })
    const scoreMaxDt = Math.max(...scoreCntList);

    // 평균 스크립트 Score 차트
    scoreChart = new Chart($('#scoreChart'), {
        type: 'bar',
        data: {
            labels: scoreNameList,
            datasets: [{
                data: scoreCntList,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(54, 162, 235, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '점수'
                    }
                }
            }
        }
    });

    const problemNameList = [];
    const problemCntList = [];

    problemChartData.forEach(row => {
        problemNameList.push(row.name);
        problemCntList.push(row.ratio);
    })
    //const problemMaxDt = Math.max(...problemCntList);

    // 문제소지 콜수 비중 차트
    issueChart = new Chart($('#issueChart'), {
        type: 'bar',
        data: {
            labels: problemNameList,
            datasets: [{
                data: problemCntList,
                backgroundColor: [
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    title: {
                        display: true,
                        text: '비중(%)'
                    }
                }
            }
        }
    });
}

// 엑셀 다운로드 함수
function downloadStats() {
    $.ajax({
        url: '/collection/downloadStats.do',
        method: 'POST',
        data: $('#statsSearchForm').serialize(),
        success: function(response) {
            // 엑셀 다운로드 처리
            console.log('다운로드 성공');
        },
        error: function(xhr, status, error) {
            alert('엑셀 다운로드 중 오류가 발생했습니다.');
        }
    });
}


// 검색 조건 초기화 함수
function resetSearchForm() {
    $('#statsSearchForm')[0].reset();
    destroyCharts();
    loadChartData();
}

function initSheetData(response) {
    let callSheetData = response.callChartData;
    let scoreSheetData = response.scoreChartData;
    let problemSheetData = response.problemChartData;

    // 미납안내 데이터만 추출
    callSheetData = callSheetData.filter(row => { return row.taskId === 'TA0001'; });

    sampleData = [];

    callSheetData.forEach(row => {
        sampleData.push({category:"전체", item:row.name,measure:row.cnt,ratio:row.ratio,rowspan: callSheetData.length});
    })

    scoreSheetData.forEach(row => {
        sampleData.push({category:"평균 스크립트 Score", item:row.name,measure:row.avgScore,ratio:"",rowspan: scoreSheetData.length});
    })

    problemSheetData.forEach(row => {
        sampleData.push({category:"문제소지 콜", item:row.name,measure:row.cnt,ratio:row.ratio,rowspan: problemSheetData.length});
    })

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

        // 측정치 열
        const tdMeasure = $('<td>').addClass('px-6 py-4 whitespace-nowrap text-right').html(`
            <div class="text-sm text-gray-900">${numberWithCommas(row.measure)}</div>
        `);

        // 비중 열
        const tdRatio = $('<td>').addClass('px-6 py-4 whitespace-nowrap text-right').html(`
            <div class="text-sm text-gray-900">${row.ratio ? row.ratio.toFixed(1) : ''}</div>
        `);

        tr.append(tdCategory, tdItem, tdMeasure, tdRatio);
        tbody.append(tr);
    });
}

// 숫자 포맷팅 함수
function numberWithCommas(x) {
    // 숫자를 문자열로 변환 후 소수점 기준 분리
    const parts = x.toString().split(".");
    // 정수 부분에만 콤마 적용
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    // 소수 부분이 있으면 다시 합침
    return parts.join(".");
}

// AJAX 성공 시 데이터 렌더링
function updateStatsDetail(response) {
    renderStatsDetailGrid(response.data);
}

// 서버에 정렬된 데이터 요청
function fetchSortedData() {
    const params = {
        ...getSearchParams(),
        sort: JSON.stringify(sortOrder)
    };

    $.ajax({
        url: '/api/nonpayment/list',
        method: 'GET',
        data: params,
        success: function(response) {
            updateTableData(response);
        },
        error: function(xhr, status, error) {
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    });
}


// 테이블 데이터 업데이트
function updateTableData(data) {
    const tbody = $('table tbody');
    tbody.empty();

    data.forEach(item => {
        const tr = $('<tr>').addClass('hover:bg-gray-50 cursor-pointer text-xs');

        // 각 컬럼 데이터 추가
        tr.append(`
                <td class="px-4 py-2 whitespace-nowrap">${item.consultDate}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.customerNo}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.counselorNo}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.counselorName}</td>
                <td class="px-4 py-2 whitespace-nowrap text-blue-600">${item.callNo}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.score}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.wrongGuide}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.banned}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.illegal}</td>
                <td class="px-4 py-2 whitespace-nowrap">${item.paymentWill}</td>
            `);

        tbody.append(tr);
    });
}

// 검색 조건 파라미터 가져오기
function getSearchParams() {
    return $('#searchForm').serializeArray().reduce((obj, item) => {
        obj[item.name] = item.value;
        return obj;
    }, {});
}



// 이벤트 바인딩
function bindEvent() {
    commonBindEvent();

    // 통계 검색 폼 제출
    $('#statsSearchForm').on('submit', function(e) {
        e.preventDefault();
        loadChartData(); // 새로운 차트 생성

    });

    $(".sortable th").on("click", function(e) {
        const column = $(this).data('sort');

        //data-sort 가 있는 경우만
        if(column){
            //다중 정렬 추가
            handleMultiSort(column);
            updateSortUI();
            searchNonpayList(1);
        }
        /*
        if(e.shiftKey) {

        } else {
            // 일반 클릭: 단일 정렬
            sortOrder = [{
                column: column,
                direction: 'asc'
            }];
            updateSortUI();
        }
        */

        // 정렬 실행
        //fetchSortedData();
    })


    // 정렬 초기화 버튼 이벤트
    $('#resetSortBtn').on('click', function() {
        resetSort();

        // 시각적 피드백을 위한 애니메이션 효과
        $(this).find("svg").addClass('animate-spin');
        setTimeout(() => {
            $(this).find("svg").removeClass('animate-spin');
        }, 500);

        searchNonpayList();
    });

    //페이지 사이즈 변경 이벤트
    $("#listTab").find("select[name=pageSize]").on("change", function(e) {
        searchNonpayList();
    });

    //미납안내 Call 리스트 목록 검색버튼
    $("#searchForm").on("submit",function(e){
        e.preventDefault();
        searchNonpayList();
    });
}