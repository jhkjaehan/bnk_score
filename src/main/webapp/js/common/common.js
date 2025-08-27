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


