let CONTENT_LIST_DATA = null;

$(document).ready(function() {
    selectMstrCallOne();
    selectMstrScore();
    selectMstrContentList();
    selectMstrConversation();
});

//상세화면 다운로드
function downloadDetail() {
    // 현재 페이지의 데이터 수집
    const data = {
        // 대표정보 수집
        basicInfo: {
            callDt: $("#detailMstrInfo").find("span[data-field=callDt]").text().trim(),
            custNum: $("#detailMstrInfo").find("span[data-field=custNum]").text().trim(),
            counselorCd: $("#detailMstrInfo").find("span[data-field=counselorCd]").text().trim(),
            counselorName: $("#detailMstrInfo").find("span[data-field=counselorName]").text().trim(),
            callId: $("#detailMstrInfo").find("span[data-field=callId]").text().trim(),
            taskName: $("#detailMstrInfo").find("span[data-field=taskName]").text().trim()
        },
        // 스크립트 점수 수집
        scoreInfo: [],
        // 평가내용 수집
        evaluationInfo: []
    };


    // 스크립트 점수 데이터 수집
    $("#scoreTable tr").each(function() {
        $(this).find("th,td").each(function(i) {
            $(this).prop("tagName");
            const score = {
                order: i,
                type: $(this).prop("tagName") == "TH" ? "col" : "row",
                data: $(this).text().trim()
            };
            data.scoreInfo.push(score);
        })
    });

    // 평가내용 데이터
    data.evaluationInfo = CONTENT_LIST_DATA;

    // 서버로 데이터 전송
    $.ajax({
        url: '/common/downloadDetail.do',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        xhrFields: {
            responseType: 'blob'
        },
        success: function(blob) {
            // 파일 다운로드 처리
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `리텐션_${data.basicInfo.callId}.xlsx`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            a.remove();
        },
        error: function(xhr, status, error) {
            console.error('다운로드 실패:', error);
            alert('다운로드 중 오류가 발생했습니다.');
        }
    });
}

//상세화면 대표정보 호출
function selectMstrCallOne() {
    const callId = $("#detailForm").find("input[name=callId]").val();

    $.ajax({
        url: '/collection/selectMstrCallOne.do',
        method: 'POST',
        data: {callId : callId},
        success: function(response) {
            loadMstrCallOne(response.data);
        },
        error: function(xhr, status, error) {
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    })
}

function loadMstrCallOne(data) {
    if(data == null || data == undefined) {
        console.log("error! 데이터가 없습니다.");
        return false;
    }

    const keys = Object.keys(data);

    keys.forEach(col => {
        $("#detailMstrInfo").find("span").filter(function () { return $(this).data("field") === col}).text(data[col]);
    })
}

//스크립트 점수 호출
function selectMstrScore() {
    const callId = $("#detailForm").find("input[name=callId]").val();
    const taskId = $("#detailForm").find("input[name=taskId]").val();

    $.ajax({
        url: '/common/selectMstrScore.do',
        method: 'POST',
        data: {taskId : taskId, callId : callId},
        success: function(response) {
            loadMstrScore(response.data);
        },
        error: function(xhr, status, error) {
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    })
}

// 스크립트 스코어 화면 세팅
function loadMstrScore(data) {
    if(data.length < 1) {
        console.log("error! 데이터가 없습니다.");
        return false;
    }

    const template =
        "<tr>" +
        "   <td class=\"px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900\">점수</td>" +
        "</tr>";

    // $("#scoreTable tbody tr").remove();

    let dataRow = $(template);

    data.forEach((col,index) => {
        
        if(index === 0){
            dataRow.append("<td class=\"px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-bold\" data-scoreid=\""+col.scoreId+"\" data-field=\"totalScore\">"+col.scoreValue+"</td>")
        } else if(index === data.length -1) {
            dataRow.append("<td class=\"px-6 py-4 whitespace-nowrap text-sm text-center text-red-600\" data-scoreid=\""+col.scoreId+"\">"+col.scoreValue+"</td>")
        } else {
            dataRow.append("<td class=\"px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900\" data-scoreid=\""+col.scoreId+"\">"+col.scoreValue+"</td>")
        }
    })

    $("#scoreTable tbody").append(dataRow);
}

// 평가내용 호출
function selectMstrContentList() {
    const callId = $("#detailForm").find("input[name=callId]").val();
    const taskId = $("#detailForm").find("input[name=taskId]").val();

    $.ajax({
        url: '/common/selectMstrContentList.do',
        method: 'POST',
        data: {taskId : taskId, callId : callId},
        success: function(response) {
            loadMstrContentList(response.data);
        },
        error: function(xhr, status, error) {
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    })
}

//평가내용 목록
function loadMstrContentList(data) {
    if(data.length < 1) {
        console.log("error! 데이터가 없습니다.");
        return false;
    }

    CONTENT_LIST_DATA = data;

    const template =
        "<tr>" +
        "   <td class=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900 typeName\"></td>" +
        "   <td class=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900 itemName\"></td>" +
        "   <td class=\"px-6 py-4 text-sm text-gray-900 contentName\"></td>" +
        "   <td class=\"px-6 py-4 whitespace-nowrap text-sm text-gray-900 evaluationResult\"></td>" +
        "</tr>"
    ;

    $("#mstrListTable tbody").empty();
    //typeId,itemId 비교용 변수
    let preTypeId = "";
    let preItemId = "";

    data.forEach(row => {
        let $newRow = $(template);

        if(row.typeCnt === 1) {
            $newRow.find(".typeName").text(row.typeName);
        } else
        if(row.typeId != preTypeId && row.typeCnt > 0) {
            $newRow.find(".typeName").attr("rowspan",row.typeCnt);
            $newRow.find(".typeName").text(row.typeName);
        } else {
            $newRow.find(".typeName").remove();
        }

        preTypeId = row.typeId;

        if(row.itemCnt === 1) {
            $newRow.find(".itemName").text(row.itemName);
        } else
        if(row.itemId != preItemId && row.itemCnt > 0) {
            $newRow.find(".itemName").attr("rowspan",row.itemCnt);
            $newRow.find(".itemName").text(row.itemName);
        } else {
            $newRow.find(".itemName").remove();
        }

        preItemId = row.itemId;


        if(row.resultDialogue != undefined && row.resultDialogue != '' && row.resultDialogue != 'N' && row.resultDialogue != null){
            $newRow.find(".contentName").html('<button class="inline-flex items-center text-blue-600 hover:text-blue-800 focus:outline-none focus:underline cursor-pointer transition-colors duration-200">' +
                row.contentName +
                '            <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                '                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' +
                '                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>' +
                '            </svg>' +
                '        </button>');

            // 툴팁 이벤트 추가
            $newRow.find(".contentName button").on("mouseenter", function(e) {
                showTooltip(e.target, row.resultDialogue);
            }).on("mouseleave", function() {
                hideTooltip();
            });

            $newRow.find(".contentName button").on("click", function(e) {
                e.stopPropagation();
                // 클릭 이벤트 처리
                handleContentClick(row.resultDialogue);
            });
        } else {
            $newRow.find(".contentName").text(row.contentName);
        }

        $newRow.find(".evaluationResult").text(row.evaluationResult);
        $("#mstrListTable tbody").append($newRow);
    })
}

// 상담 대화내용 조회
function selectMstrConversation() {
    const callId = $("#detailForm").find("input[name=callId]").val();
    const taskId = $("#detailForm").find("input[name=taskId]").val();

    $.ajax({
        url: '/common/selectMstrConversation.do',
        method: 'POST',
        data: {taskId : taskId, callId : callId},
        success: function(response) {
            loadMstrConversation(response.data.conversations);
        },
        error: function(xhr, status, error) {
            console.error('데이터 조회 실패:', error);
            alert('데이터 조회 중 오류가 발생했습니다.');
        }
    })
}

//상담 내용 출력
function loadMstrConversation(data) {
    if(data == null || data == undefined) {
        console.log("error! 데이터가 없습니다.");
        return false;
    }

    const counselTemplate =
        "<div class=\"flex items-start space-x-3\">" +
        "    <div class=\"flex-shrink-0\">" +
        "        <div class=\"w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center\">" +
        "            <span class=\"text-white text-sm font-medium counsel_speaker\">상담</span>" +
        "        </div>" +
        "    </div>" +
        "    <div class=\"flex-1 bg-blue-50 rounded-lg p-4\">" +
        "        <p class=\"text-sm text-gray-900 counsel_content\">안녕하세요. ○○은행 상담사 홍길동입니다.</p>" +
        "    </div>" +
        "</div>";

    const custTemplate =
        "<div class=\"flex items-start space-x-3 justify-end\">" +
        "    <div class=\"flex-1 bg-gray-100 rounded-lg p-4\">" +
        "        <p class=\"text-sm text-gray-900 counsel_content\">네, 안녕하세요.</p>" +
        "    </div>" +
        "    <div class=\"flex-shrink-0\">" +
        "        <div class=\"w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center\">" +
        "            <span class=\"text-white text-sm font-medium counsel_speaker\">고객</span>" +
        "        </div>" +
        "    </div>" +
        "</div>";

    const conversationBox = $("#conversationBox");
    conversationBox.empty();

    data.forEach((item) => {

        const $counselTemplate = $(counselTemplate);
        const $custTemplate = $(custTemplate);
        if(item.type === "counselor") {
            //$counselTemplate.find(".counsel_speaker").text(item.speaker);
            $counselTemplate.find(".counsel_content").text(item.content);
            conversationBox.append($counselTemplate);
        } else if(item.type === "customer") {
            //$custTemplate.find(".counsel_speaker").text(item.speaker);
            $custTemplate.find(".counsel_content").text(item.content);
            conversationBox.append($custTemplate);
        }

    })
}

// 평가내용 클릭 시 매칭되는 문구 이동
function handleContentClick(conText) {
    //대상 없을 시 리턴
    if(conText === "" || conText === undefined || conText === " ") {
        $("body #conversationBox p span").removeClass("bg-yellow-200");
        return false;
    }

    const $el = $("body #conversationBox p:contains('" + conText + "')").first();
    const $el2 = $("body #conversationBox p:contains('" + conText.substring(0,10) + "')").first();

    if($el.length) {
        $("body #conversationBox p span").removeClass("bg-yellow-200");
        $el.html($el.text().replaceAll(conText,"<span class='bg-yellow-200'>"+conText+"</span>"))
        $el.get(0).scrollIntoView({ behavior: "smooth", block: "center" });
    } else if($el2.length) {
        $("body #conversationBox p span").removeClass("bg-yellow-200");
        $el2.html($el2.text().replaceAll(conText.substring(0,10),"<span class='bg-yellow-200'>"+conText.substring(0,10)+"</span>"))
        $el2.get(0).scrollIntoView({ behavior: "smooth", block: "center" });
    } else {
        $("body #conversationBox p").first().get(0).scrollIntoView({ behavior: "smooth", block: "center" });
    }
}


