// 전역 변수로 차트 인스턴스 관리
let callsChart = null;
let scoreChart = null;
let issueChart = null;

// 데이터 예시
const sampleData = [
    { category: '전체', item: '콜 수', measure: 1000, ratio: 100.0, rowspan:3 },
    { category: '전체', item: '고객 수', measure: 955, ratio: null, rowspan:3 },
    { category: '전체', item: '상담사 수', measure: 10, ratio: null, rowspan:3 },
    { category: '평균 스크립트 Score', item: '전체', measure: 17, ratio: null, rowspan:5 },
    { category: '평균 스크립트 Score', item: '본인확인', measure: 4.25, ratio: null, rowspan:5 },
    { category: '평균 스크립트 Score', item: '첫인사', measure: 4.38, ratio: null, rowspan:5 },
    { category: '평균 스크립트 Score', item: '끝인사', measure: 4.44, ratio: null, rowspan:5 },
    { category: '평균 스크립트 Score', item: '필수안내', measure: 3.92, ratio: null, rowspan:5 },
    { category: '문제소지 콜', item: '전체', measure: 7, ratio: 0.7, rowspan:4 },
    { category: '문제소지 콜', item: '오안내', measure: 5, ratio: 0.5, rowspan:4 },
    { category: '문제소지 콜', item: '불법추심', measure: 1, ratio: 0.1, rowspan:4 },
    { category: '문제소지 콜', item: '금지문구', measure: 1, ratio: 0.1, rowspan:4 }
];

$(document).ready(function() {
    // 이벤트 바인딩
    bindEvent();

    renderStatsDetailGrid(sampleData);

    // 상담사 목록
    getCounselorList()
});

function openDetailPage(callId) {
    const width = 1024;
    const height = 768;
    const left = (window.screen.width / 2) - (width / 2);
    const top = (window.screen.height / 2) - (height / 2);

    window.open(
        `/retail/excellentLoanDetailPage.do?callId=${callId}`,
        'DetailView',
        `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
    );
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


function initializeCharts() {
    // 기존 차트 제거
    destroyCharts();

    // 콜수/고객수/상담수 차트
    callsChart = new Chart($('#callsChart'), {
        type: 'bar',
        data: {
            labels: ['상담사수', '고객수', '콜수'],
            datasets: [{
                data: [450, 800, 1100],
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
                    max: 1200,
                    title: {
                        display: true,
                        text: 'Count'
                    }
                }
            }
        }
    });

    // 평균 스크립트 Score 차트
    scoreChart = new Chart($('#scoreChart'), {
        type: 'bar',
        data: {
            labels: ['불량', '미흡', '보통', '우수', '최우수'],
            datasets: [{
                data: [5, 10, 45, 30, 10],
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

    // 문제소지 콜수 비중 차트
    issueChart = new Chart($('#issueChart'), {
        type: 'bar',
        data: {
            labels: ['정상', '오안내', '금지어', '불법추심'],
            datasets: [{
                data: [70, 15, 10, 5],
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

// 차트 데이터 업데이트 함수
function updateCharts(newData) {
    // 기존 차트들이 존재하는지 확인하고 업데이트
    if (!callsChart || !scoreChart || !issueChart) {
        initializeCharts();
        return;
    }

    // 각 차트 데이터 업데이트
    callsChart.data = newData.callsData;
    callsChart.update();

    scoreChart.data = newData.scoreData;
    scoreChart.update();

    issueChart.data = newData.issueData;
    issueChart.update();
}


// 검색 조건 초기화 함수
function resetSearchForm() {
    $('#statsSearchForm')[0].reset();
    destroyCharts();
    initializeCharts();
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
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// AJAX 성공 시 데이터 렌더링
function updateStatsDetail(response) {
    renderStatsDetailGrid(response.data);
}

function bindEvent() {
    // 탭 전환 로직
    $('.tab-link').on('click', function(e) {
        e.preventDefault();
        const target = $(this).data('tab');

        // 탭 스타일 변경
        $('.tab-link').removeClass('active');
        $(this).addClass('active');

        // 컨텐츠 전환
        $('.tab-content').addClass('hidden');
        $('.tab-content').removeClass('active');
        $(`#${target}Tab`).removeClass('hidden');
        $(`#${target}Tab`).addClass('active');

        // 현황 탭 선택 시 차트 초기화
        if (target === 'stats') {
            initializeCharts();
        }
    });

    // 통계 검색 폼 제출
    $('#statsSearchForm').on('submit', function(e) {
        e.preventDefault();
        initializeCharts(); // 새로운 차트 생성

    });
}