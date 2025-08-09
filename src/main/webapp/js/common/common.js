

function getCounselorList(taskName) {
    $.ajax({
        url: '/common/selectCounselorList.do',
        method: 'POST',
        data: {taskName : taskName},
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