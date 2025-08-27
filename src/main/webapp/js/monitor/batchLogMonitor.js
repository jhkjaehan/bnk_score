const PAGES_TO_SHOW = 5;


$(document).ready(function() {
    // 이벤트 바인딩
    bindEvent();

    // 초기 데이터 로드
    searchBatchLogs();
});

function searchBatchLogs(page) {
    // AJAX 호출로 배치 로그 데이터 조회
    const formData = $('#searchForm').serializeArray();
    const pageSize = $("#pageSize").val();
    var page = page || 1;

    formData.push({name: 'currentPage', value: page});
    formData.push({name: 'pageSize', value: pageSize});

    $.ajax({
        url: '/monitor/selectBatchLogList.do',
        data: formData,
        success: function(response) {
            renderBatchLogs(response.data.list);
            updatePagination(response.data.totalCount, page, pageSize);
        },
        error: function(xhr) {
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    });
}

function renderBatchLogs(logs) {
    const tbody = $('#batchLogList');
    tbody.empty();

    logs.forEach(log => {
        const tr = $('<tr>').addClass('hover:bg-gray-50');

        const executeButton = $('<button>')
            .addClass('px-3 py-1 text-sm rounded-md shadow-sm ' +
                (log.status === 'FAIL' ?
                    'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-blue-600 hover:bg-blue-700 text-white'))
            .text('재실행')
            .on('click', function() {
                executeBatch(log.callId);
                // executeBatch();
            });


        tr.append([
            $('<td>').addClass('px-6 py-4 whitespace-nowrap text-sm text-gray-900').text(log.raiseDt),
            $('<td>').addClass('px-6 py-4 whitespace-nowrap text-sm text-gray-900').text(log.callId),
            $('<td>').addClass('px-6 py-4 whitespace-nowrap text-sm').append(
                getStatusBadge(log.status)
            ),
            $('<td>').addClass('px-6 py-4 text-sm text-gray-500').text(log.errMsg || '-'),
            $('<td>').addClass('px-6 py-4 whitespace-nowrap text-sm').append(executeButton)
        ]);

        tbody.append(tr);
    });
}

// 배치 실행 함수
function executeBatch(callId) {
    if (!confirm('배치를 재실행하시겠습니까?')) {
        return;
    }

    // 로딩 표시
    const loadingToast = showToast('배치를 실행중입니다...', 'info');

    $.ajax({
        url: '/monitor/executeBatch.do',
        method: 'GET',
        data: { callId: callId },
        success: function(response) {
            // 로딩 토스트 제거
            loadingToast.dismiss();

            if (response.status === 'success') {
                showToast('배치가 성공적으로 실행되었습니다.', 'success');
                // 테이블 새로고침
                searchBatchLogs();
            } else {
                showToast('배치 실행 중 오류가 발생했습니다: ' + response.message, 'error');
            }
        },
        error: function(xhr, status, error) {
            loadingToast.dismiss();
            showToast('배치 실행 요청 중 오류가 발생했습니다.', 'error');
        }
    });
}

// 토스트 메시지 표시 함수
function showToast(message, type = 'info') {
    const toast = $('<div>')
        .addClass('fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg text-white ' +
            (type === 'success' ? 'bg-green-600' :
                type === 'error' ? 'bg-red-600' :
                    'bg-blue-600'))
        .text(message)
        .appendTo('body');

    // 3초 후 자동으로 사라짐
    setTimeout(() => {
        toast.remove();
    }, 3000);

    return {
        dismiss: () => toast.remove()
    };
}


function getStatusBadge(status) {
    const classes = {
        'SUCCESS': 'bg-green-100 text-green-800',
        'FAIL': 'bg-red-100 text-red-800',
        'RUNNING': 'bg-yellow-100 text-yellow-800'
    };

    return $('<span>')
        .addClass(`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${classes[status]}`)
        .text(status);
}

// 페이징 처리
function updatePagination(totalCount, currentPage, pageSize) {
    const totalPages = Math.ceil(totalCount / pageSize);
    const container = document.querySelector('.pagination-container');

    let startPage = Math.max(1, currentPage - Math.floor(PAGES_TO_SHOW / 2));
    let endPage = Math.min(totalPages, startPage + PAGES_TO_SHOW - 1);

    // 페이지 범위 조정
    if (endPage - startPage + 1 < PAGES_TO_SHOW) {
        startPage = Math.max(1, endPage - PAGES_TO_SHOW + 1);
    }

    let html = `
        <div class="flex items-center gap-1">
            ${currentPage > 1 ? `
                <button onclick="searchBatchLogs(1)" class="px-3 py-1 rounded border hover:bg-gray-100">
                    &lt;&lt;
                </button>
                <button onclick="searchBatchLogs(${currentPage - 1})" class="px-3 py-1 rounded border hover:bg-gray-100">
                    &lt;
                </button>
            ` : ''}
    `;

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button onclick="searchBatchLogs(${i})" 
                class="px-3 py-1 rounded border ${i === currentPage
            ? 'bg-blue-600 text-white'
            : 'hover:bg-gray-100'}">
                ${i}
            </button>
        `;
    }

    html += `
            ${currentPage < totalPages ? `
                <button onclick="searchBatchLogs(${currentPage + 1})" class="px-3 py-1 rounded border hover:bg-gray-100">
                    &gt;
                </button>
                <button onclick="searchBatchLogs(${totalPages})" class="px-3 py-1 rounded border hover:bg-gray-100">
                    &gt;&gt;
                </button>
            ` : ''}
        </div>
    `;

    container.innerHTML = html;

    //총 검색 건수
    $("#totalCount span").text(numberWithCommas(totalCount));
}


function downloadBatchLogs() {
    const formData = $('#searchForm').serialize();
    const downloadUrl = '/monitor/downloadBatchLogList.do?' + formData;

    // GET 요청으로 파일 다운로드
    fetch(downloadUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('다운로드 중 오류가 발생했습니다.');
            }
            return response.blob();
        })
        .then(blob => {
            // 파일 다운로드
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;

            // Content-Disposition 헤더에서 파일명 추출 시도
            const filename = '배치로그.xlsx';
            a.download = filename;

            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('파일 다운로드 중 오류가 발생했습니다.');
        });

}

function bindEvent() {
    // 검색 폼 제출
    $('#searchForm').submit(function(e) {
        e.preventDefault();
        searchBatchLogs();
    });

    //페이지 사이즈 변경시
    $("#pageSize").on("change", function() {
        searchBatchLogs();
    });

    // 다운로드 버튼 클릭
    $('#downloadBtn').click(function() {
        downloadBatchLogs();
    });
}