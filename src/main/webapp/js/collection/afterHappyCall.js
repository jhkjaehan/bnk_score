$(document).ready(function() {
    // 이벤트 바인딩
    bindEvent();
    // 초기 데이터 로드
    searchCalls();
    //상담사 목록
    getCounselorList();
});

// Call 리스트 검색
function searchCalls() {
    // 실제 환경에서는 AJAX 호출로 대체
    const sampleData = [
        {
            counselDate: '2025-07-21',
            customerNumber: '1234567',
            counselorNumber: 'A001',
            counselorName: '홍길동',
            callNumber: 'CALL-001',
            product: '오토_신차',
            scriptScore: 85,
            feeIssue: 'N',
            extraSupport: 'N'
        }
        // 추가 샘플 데이터...
    ];

    renderCallList(sampleData);
}

// Call 리스트 렌더링
function renderCallList(data) {
    const tbody = $('#callListBody');
    tbody.empty();

    data.forEach(item => {
        const tr = $('<tr>')
            .addClass('hover:bg-gray-50 cursor-pointer text-xs')
            .click(() => openDetailPage(item.callNumber));

        tr.append([
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.counselDate),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.customerNumber),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.counselorNumber),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.counselorName),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap text-blue-600 hover:text-blue-800').text(item.callNumber),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.product),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.scriptScore),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.feeIssue),
            $('<td>').addClass('px-4 py-2 whitespace-nowrap').text(item.extraSupport)
        ]);

        tbody.append(tr);
    });

    $('#totalCount').text(data.length);
}

// 상세 페이지 이동
function openDetailPage(callNumber) {
    const width = 1024;
    const height = 768;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    window.open(
        `/collection/afterHappyCallDetailPage.do?callId=${callNumber}`,
        'DetailView',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
}

// 차트 초기화
function initializeCharts() {
    // 콜수/고객수/상담수 차트
    const callsChart = new Chart(document.getElementById('callsChart'), {
        type: 'bar',
        data: {
            labels: ['전체', '소매', '오토_신차', '오토_중고차', '오토_렌터카', '오토_리스'],
            datasets: [{
                label: '콜 수',
                data: [1000, 200, 300, 250, 150, 100],
                backgroundColor: 'rgba(59, 130, 246, 0.5)'
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });

    // 스크립트 Score 차트
    const scoreChart = new Chart(document.getElementById('scoreChart'), {
        type: 'line',
        data: {
            labels: ['전체', '소매', '오토_신차', '오토_중고차', '오토_렌터카', '오토_리스'],
            datasets: [{
                label: '평균 스크립트 Score',
                data: [85, 87, 83, 86, 84, 85],
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true
        }
    });

    // 문제소지 콜 차트
    const issueChart = new Chart(document.getElementById('issueChart'), {
        type: 'doughnut',
        data: {
            labels: ['정상', '수수료/이면약정', '계약외지원약속'],
            datasets: [{
                data: [95, 3, 2],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.5)',
                    'rgba(239, 68, 68, 0.5)',
                    'rgba(234, 179, 8, 0.5)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}


function bindEvent() {
    // 탭 전환 이벤트 처리
    $('.tab-link').click(function(e) {
        e.preventDefault();
        const tabId = $(this).data('tab');

        // 탭 활성화 상태 변경
        $('.tab-link').removeClass('active');
        $(this).addClass('active');

        // 컨텐츠 표시/숨김
        $('.tab-content').addClass('hidden');
        $('.tab-content').removeClass('active');
        $(`#${tabId}Tab`).removeClass('hidden');
        $(`#${tabId}Tab`).addClass('active');

        if (tabId === 'stats') {
            initializeCharts();
        }
    });

    // 검색 폼 제출 이벤트
    $('#searchForm').submit(function(e) {
        e.preventDefault();
        searchCalls();
    });

    // 통계 검색 폼 제출 이벤트
    $('#statsSearchForm').submit(function(e) {
        e.preventDefault();
        searchStats();
    });
}