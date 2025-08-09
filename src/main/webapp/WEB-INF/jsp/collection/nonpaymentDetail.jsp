<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <title>미납안내 상세정보</title>
    <jsp:include page="/WEB-INF/jsp/inc/head.jsp"/>
<script type="text/javascript" src="${pageContext.request.contextPath}/js/collection/nonpaymentDetail.js"></script>
</head>
<body class="bg-gray-50">
<form method="POST" action="" id="detailForm">
    <input type="hidden" name="callId" value="${params.callId}"/>
</form>
<!-- 페이지 최상단에 다운로드 버튼 추가 -->
<div class="max-w-6xl mx-auto p-6 space-y-6">
    <div class="flex justify-end">
        <button onclick="downloadDetails()" class="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            상담 정보 다운로드
        </button>
    </div>
    <!-- 기존 컨텐츠 -->
    <!-- 1. 대표정보 섹션 -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
            </svg>
            대표정보
        </h2>
        <div class="grid grid-cols-4 gap-4" id="detailMstrInfo">
            <div class="flex items-center space-x-2">
                <span class="text-gray-600 font-medium">상담일자:</span>
                <span data-field="callDt">2025-07-21</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-gray-600 font-medium">고객번호:</span>
                <span data-field="custNum">1234567890</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-gray-600 font-medium">상담사번호:</span>
                <span data-field="counselorCd">AG001</span>
            </div>
            <div class="flex items-center space-x-2">
                <span class="text-gray-600 font-medium">상담사명:</span>
                <span data-field="counselorName">홍길동</span>
            </div>
            <div class="flex items-center space-x-2 col-span-2">
                <span class="text-gray-600 font-medium">Call 번호:</span>
                <span data-field="callId">CALL-2025-07-21-001</span>
            </div>
            <div class="flex items-center space-x-2 col-span-2">
                <span class="text-gray-600 font-medium">업무:</span>
                <span data-field="taskName"></span>
            </div>
        </div>
    </div>

    <!-- 2. 스크립트 Score 섹션 -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
            </svg>
            스크립트 Score
        </h2>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200" id="scoreTable">
                <thead>
                <tr class="bg-gray-50">
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">항목</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">총점</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">본인확인(+)</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">첫인사(+)</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">끝인사(+)</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">필수안내(+)</th>
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">오안내(-)</th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <tr class="bg-blue-50">
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">배점</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">20</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">5</td>
                </tr>
                <%--
                <tr>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">점수</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-blue-600 font-bold" data-scoreId="S0001" data-field="totalScore">15</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900" data-scoreId="S0002">5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900" >4</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-900">5</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-center text-red-600">4</td>
                </tr>
                --%>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 3. 평가내용 섹션 -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            평가내용
        </h2>
        <div class="overflow-x-auto">
            <table id="mstrListTable" class="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr class="bg-gray-50">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평가구분</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평가항목</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평가내용</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">평가결과</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                <!-- 평가내용 행들 -->
                    <%--
                    <tr>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">필수안내</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">본인확인</td>
                        <td class="px-6 py-4 text-sm text-gray-900">고객 본인 확인 완료</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-green-600">적합</td>
                    </tr>
                    --%>
                </tbody>
            </table>
        </div>
    </div>

    <!-- 4. 대화내용 섹션 -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
            고객과 대화내용
        </h2>
        <div id="conversationBox" class="space-y-4">
            <!-- 상담사 대화 -->
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span class="text-white text-sm font-medium">상담사</span>
                    </div>
                </div>
                <div class="flex-1 bg-blue-50 rounded-lg p-4">
                    <p class="text-sm text-gray-900">안녕하세요. ○○은행 상담사 홍길동입니다.</p>
                    <span class="text-xs text-gray-500 mt-1">10:00:15</span>
                </div>
            </div>
            <!-- 고객 대화 -->
            <div class="flex items-start space-x-3 justify-end">
                <div class="flex-1 bg-gray-100 rounded-lg p-4">
                    <p class="text-sm text-gray-900">네, 안녕하세요.</p>
                    <span class="text-xs text-gray-500 mt-1">10:00:20</span>
                </div>
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center">
                        <span class="text-white text-sm font-medium">고객</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</body>
</html>