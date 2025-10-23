// 로딩 관련 전역 변수
let loadingTimeout;
let sortOrder = [];

// 다중 정렬 처리
function handleMultiSort(column) {
    const existingSort = sortOrder.find(s => s.column === column);

    if (existingSort) {
        // 이미 정렬 중인 컬럼이면 방향만 변경
        existingSort.direction = existingSort.direction === 'asc' ? 'desc' : 'asc';
    } else {
        // 새로운 정렬 조건 추가
        sortOrder.push({
            column: column,
            direction: 'asc',
            order: sortOrder.length + 1
        });
    }

}

// 정렬 UI 업데이트
function updateSortUI() {
    // 모든 정렬 아이콘 초기화
    $('.sortable .sort-icon').attr('data-direction', 'none');
    $('.sortable .sort-order').hide();
    $('.sortable th').removeClass('active');

    // 현재 정렬 상태 표시
    sortOrder.forEach((sort, index) => {
        const th = $(`.sortable th[data-sort="${sort.column}"]`);
        th.addClass('active');

        // 정렬 방향 아이콘 설정
        th.find('.sort-icon').attr('data-direction', sort.direction);

        // 다중 정렬일 경우 순서 표시
        if (sortOrder.length > 1) {
            const orderSpan = th.find('.sort-order');
            // orderSpan.text(index + 1).show();
        }
    });

}

//정렬 초기화
function resetSort() {
    sortOrder = [];
    updateSortUI();

}


function getCounselorList(taskId) {
    $.ajax({
        url: '/common/selectCounselorList.do',
        method: 'POST',
        data: {taskId : taskId},
        success: function(response) {
            initCounselorList(response.data);
        },
        error: function(xhr, status, error) {
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    });
}

//상담사 명단 세팅
function initCounselorList(data) {
    let counselorList = data;
    let counselorTemplate = "<option></option>";
    //counselorTemplate = $(counselorTemplate);

    /*counselorList = counselorList.filter(counselor => {
        return counselor.taskName === "미납안내";
    })*/

    //$("select[name=counselor]").empty();

    if(counselorList.length > 0) {
        counselorList.forEach(counselor => {
            let newLine = $(counselorTemplate);
            if(counselor.extensionNum === undefined) {
                counselor.extensionNum = "";
            }
            newLine.val(counselor.counselorCd);
            newLine.text("["+counselor.extensionNum+"] "+counselor.name);
            $("select[name=counselor]").append(newLine);
        })
    }

}

// 숫자 포맷팅 함수
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function commonBindEvent() {
    // 탭 전환 로직
    $('.tab-link').on('click', function(e) {
        e.preventDefault();
        const target = $(this).data('tab');

        // 아이콘 색상 변경
        $('.tab-link svg')
            .removeClass('text-blue-500')
            .addClass('text-gray-400');

        $(this).find('svg')
            .removeClass('text-gray-400')
            .addClass('text-blue-500');

        // 탭 스타일 변경
        $('.tab-link').removeClass('active');
        $(this).addClass('active');

        // 컨텐츠 전환
        $('.tab-content').addClass('hidden');
        $('.tab-content').removeClass('active');
        $(`#${target}Tab`).removeClass('hidden');
        $(`#${target}Tab`).addClass('active');

        // 현황 탭 선택 시 차트 초기화
        /*if (target === 'stats') {
            loadChartData();
        }*/
    });
}

function checkboxToggleAll(masterCheckbox, targetName, tagId) {
    if(tagId) {
        const isChecked = $(masterCheckbox).is(':checked');
        $(`#${tagId} input[name='${targetName}']`).prop('checked', isChecked);
    } else {
        const isChecked = $(masterCheckbox).is(':checked');
        $(`input[name='${targetName}']`).prop('checked', isChecked);
    }
}

/**
* 로딩 화면 표시 함수
* @param {string} type - 로딩 타입 ('full', 'table', 'minimal')
* @param {string} message - 로딩 메시지
*/
function showLoading(type = 'table', message = '데이터를 불러오는 중입니다') {
    hideLoading(); // 기존 로딩 제거

    let loadingHtml = '';

    if (type === 'full') {
        // 전체 화면 로딩
        loadingHtml = `
            <div id="loadingOverlay" class="loading-overlay">
                <div class="loading-content">
                    <div class="spinner"></div>
                    <div class="loading-text">${message}<span class="loading-dots"></span></div>
                </div>
            </div>
        `;
        $('body').append(loadingHtml);
    } else if (type === 'table') {
        // 테이블 영역만 로딩
        loadingHtml = `
            <div id="tableLoadingOverlay" class="table-loading-overlay">
                <div class="text-center">
                    <div class="dots-loader">
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>
                    <div class="loading-text">${message}<span class="loading-dots"></span></div>
                </div>
            </div>
        `;
        $('.table-container > .overflow-x-auto').css('position', 'relative').append(loadingHtml);
    } else if (type === 'minimal') {
        // 미니멀 로딩 (프로그레스 바)
        loadingHtml = `
            <div id="minimalLoadingOverlay" class="loading-overlay">
                <div class="loading-content">
                    <div class="progress-bar">
                        <div class="progress-bar-fill"></div>
                    </div>
                    <div class="loading-text">${message}</div>
                </div>
            </div>
        `;
        $('body').append(loadingHtml);
    }

    // 30초 후 자동으로 로딩 제거 (타임아웃 방지)
    loadingTimeout = setTimeout(() => {
        hideLoading();
        console.warn('로딩이 30초 이상 지속되어 자동으로 해제되었습니다.');
    }, 30000);
}

/**
 * 로딩 화면 숨김 함수
 */
function hideLoading() {
    if (loadingTimeout) {
        clearTimeout(loadingTimeout);
        loadingTimeout = null;
    }

    $('#loadingOverlay').remove();
    $('#tableLoadingOverlay').remove();
    $('#minimalLoadingOverlay').remove();
}


/**
 * 토스트 메시지 표시 함수
 * @param {string} message - 메시지 내용
 * @param {string} type - 메시지 타입 ('success', 'error', 'info')
 */
function showToastMessage(message, type = 'info') {
    const toastId = 'toast-' + Date.now();
    const bgColor = type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' : 'bg-blue-500';

    const toastHtml = `
        <div id="${toastId}" class="fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300">
            <div class="flex items-center">
                <span>${message}</span>
                <button onclick="$('#${toastId}').remove()" class="ml-4 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        </div>
    `;

    $('body').append(toastHtml);

    // 애니메이션으로 나타내기
    setTimeout(() => {
        $(`#${toastId}`).removeClass('translate-x-full');
    }, 100);

    // 3초 후 자동 제거
    setTimeout(() => {
        $(`#${toastId}`).addClass('translate-x-full');
        setTimeout(() => {
            $(`#${toastId}`).remove();
        }, 300);
    }, 3000);
}

// 툴팁 표시 함수
function showTooltip(element, text) {
    // 기존 툴팁 제거
    hideTooltip();

    const tooltip = $('<div class="custom-tooltip">' +
        '<div class="tooltip-content">' + text + '</div>' +
        '<div class="tooltip-arrow"></div>' +
        '</div>');

    $('body').append(tooltip);

    const rect = element.getBoundingClientRect();
    const tooltipWidth = tooltip.outerWidth();
    const tooltipHeight = tooltip.outerHeight();

    // 툴팁 위치 계산
    let top = rect.top + window.scrollY - tooltipHeight - 10;
    let left = rect.left + window.scrollX + (rect.width / 2) - (tooltipWidth / 2);

    // 화면 경계 체크 및 조정
    if (left < 10) {
        left = 10;
    } else if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10;
    }

    if (top < 10) {
        // 위쪽 공간이 부족하면 아래쪽에 표시
        top = rect.bottom + window.scrollY + 10;
        tooltip.find('.tooltip-arrow').addClass('arrow-top');
    }

    tooltip.css({
        top: top + 'px',
        left: left + 'px'
    }).fadeIn(150);
}

// 툴팁 숨김 함수
function hideTooltip() {
    $('.custom-tooltip').remove();
}