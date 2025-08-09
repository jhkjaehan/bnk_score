$(document).ready(function() {
    loadDetailData();
});

// 상세 데이터 로드
function loadDetailData() {
    // 실제 환경에서는 AJAX 호출로 대체
    const sampleData = {
        counselDate: '2025-07-21',
        customerNumber: '1234567',
        counselorNumber: 'A001',
        counselorName: '홍길동',
        callNumber: 'CALL-001',
        product: '오토_신차',
        scriptScore: {
            total: 85,
            greeting: 4.5,
            identification: 4.2,
            script: 4.3,
            closing: 4.4
        },
        evaluation: [
            {
                category: '필수안내',
                item: '본인확인',
                content: '고객 본인 확인 완료',
                result: 'Y'
            },
            {
                category: '리스크',
                item: '수수료/이면약정',
                content: '수수료 관련 부적절 발언 없음',
                result: 'N'
            }
            // 추가 평가 항목...
        ],
        conversation: '상담원: 안녕하세요, XX금융 상담원 홍길동입니다...'
    };

    renderDetailData(sampleData);
}

// 상세 데이터 렌더링
function renderDetailData(data) {
    // 대표정보 렌더링
    $('#counselDate').text(data.counselDate);
    $('#customerNumber').text(data.customerNumber);
    $('#counselorNumber').text(data.counselorNumber);
    $('#counselorName').text(data.counselorName);
    $('#callNumber').text(data.callNumber);
    $('#product').text(data.product);

    // 스크립트 Score 렌더링
    const scoreRow = $('<tr>').append([
        $('<td>').addClass('px-6 py-4').text('스크립트 Score'),
        $('<td>').addClass('px-6 py-4').text(data.scriptScore.total),
        $('<td>').addClass('px-6 py-4').text(data.scriptScore.greeting),
        $('<td>').addClass('px-6 py-4').text(data.scriptScore.identification),
        $('<td>').addClass('px-6 py-4').text(data.scriptScore.script),
        $('<td>').addClass('px-6 py-4').text(data.scriptScore.closing)
    ]);
    $('#scriptScoreBody').empty().append(scoreRow);

    // 평가내용 렌더링
    const evaluationBody = $('#evaluationBody');
    evaluationBody.empty();

    data.evaluation.forEach(item => {
        const tr = $('<tr>').append([
            $('<td>').addClass('px-6 py-4').text(item.category),
            $('<td>').addClass('px-6 py-4').text(item.item),
            $('<td>').addClass('px-6 py-4').text(item.content),
            $('<td>').addClass('px-6 py-4').html(
                item.result === 'Y'
                    ? '<span class="px-2 py-1 text-xs font-semibold text-green-800 bg-green-100 rounded-full">정상</span>'
                    : '<span class="px-2 py-1 text-xs font-semibold text-red-800 bg-red-100 rounded-full">부적정</span>'
            )
        ]);
        evaluationBody.append(tr);
    });

    // 대화내용 렌더링
    $('#conversationContent').text(data.conversation);
}

// 상세정보 다운로드
function downloadDetail() {
    const callNumber = $('#callNumber').text();

    // 실제 환경에서는 AJAX 호출로 대체
    $.ajax({
        url: 'downloadAfterHappyCallDetail.do',
        type: 'POST',
        data: JSON.stringify({ callNumber: callNumber }),
        contentType: 'application/json',
        success: function(response) {
            // 다운로드 처리
            console.log('다운로드 성공');
        },
        error: function(error) {
            console.error('다운로드 실패:', error);
            alert('다운로드 중 오류가 발생했습니다.');
        }
    });
}