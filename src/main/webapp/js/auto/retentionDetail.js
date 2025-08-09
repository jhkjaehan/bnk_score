function downloadDetails() {
    // 현재 페이지의 데이터 수집
    const data = {
        // 대표정보
        basicInfo: {
            consultationDate: document.querySelector('[data-field="consultationDate"]').textContent,
            customerNumber: document.querySelector('[data-field="customerNumber"]').textContent,
            counselorNumber: document.querySelector('[data-field="counselorNumber"]').textContent,
            counselorName: document.querySelector('[data-field="counselorName"]').textContent,
            callNumber: document.querySelector('[data-field="callNumber"]').textContent
        },
        // 스크립트 Score
        scoreInfo: {
            total: document.querySelector('[data-field="totalScore"]').textContent,
            identification: document.querySelector('[data-field="identificationScore"]').textContent,
            greeting: document.querySelector('[data-field="greetingScore"]').textContent,
            closing: document.querySelector('[data-field="closingScore"]').textContent,
            essential: document.querySelector('[data-field="essentialScore"]').textContent,
            mistake: document.querySelector('[data-field="mistakeScore"]').textContent
        },
        // 평가내용
        evaluationInfo: []
    };

    // 평가내용 테이블의 데이터 수집
    const evaluationRows = document.querySelectorAll('[data-evaluation-row]');
    evaluationRows.forEach(row => {
        data.evaluationInfo.push({
            category: row.querySelector('[data-field="category"]').textContent,
            item: row.querySelector('[data-field="item"]').textContent,
            content: row.querySelector('[data-field="content"]').textContent,
            result: row.querySelector('[data-field="result"]').textContent
        });
    });

    // Excel 다운로드 요청
    $.ajax({
        url: '/collection/downloadNonpaymentDetail.do',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        xhrFields: {
            responseType: 'blob'
        },
        success: function(blob) {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `상담정보_${data.basicInfo.callNumber}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        },
        error: function(xhr, status, error) {
            alert('다운로드 중 오류가 발생했습니다.');
            console.error('Download error:', error);
        }
    });
}