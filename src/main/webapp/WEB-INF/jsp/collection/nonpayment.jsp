<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <jsp:include page="/WEB-INF/jsp/inc/head.jsp"/>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/collection/nonpayment.js"></script>
</head>
<body class="bg-gray-100">
<jsp:include page="/WEB-INF/jsp/inc/header.jsp"/>

<div class="container-custom mx-auto px-4 py-4">
  <!-- 페이지 제목 -->
  <div class="mb-4">
    <h1 class="text-xl font-bold text-gray-900">미납안내</h1>
  </div>

    <jsp:include page="/WEB-INF/jsp/inc/tabMenu.jsp"/>

    <!-- CALL 리스트 탭 컨텐츠 -->
    <div id="listTab" class="tab-content active">
        <div class="bg-blue-50 rounded-xl shadow-lg p-4 mb-4 text-sm">
            <h2 class="text-lg font-semibold text-black-800 mb-4">검색 조건</h2>
            <form id="searchForm" class="space-y-4">
                <!-- 상단 검색 옵션 -->
                <div class="grid grid-cols-3 gap-4">
                    <div class="flex items-center">
                        <label class="w-24 font-medium">고객번호</label>
                        <input type="text" name="custNum" class="bg-white border border-gray-300 flex-1 border rounded px-2 py-1">
                    </div>
                    <div class="flex items-center">
                        <label class="w-24 font-medium">상담사</label>
                        <select name="counselor" class="bg-white border border-gray-300 flex-1 border rounded px-2 py-1">
                            <option value="">선택하세요</option>
                        </select>
                    </div>
                    <div class="flex items-center">
                        <label class="w-24 font-medium">기간설정</label>
                        <input type="date" name="startDate" class="bg-white border border-gray-300 border rounded px-2 py-1">
                        <span class="mx-2">~</span>
                        <input type="date" name="endDate" class="bg-white border border-gray-300 border rounded px-2 py-1">
                    </div>
                </div>

                <!-- 라디오 버튼 그룹들 - 한 줄로 배치 -->
                <div class="search-option-group">
                    <div class="grid grid-cols-5 gap-4">
                        <!-- 오안내 -->
                        <%--<div class="flex items-center">
                            <label class="w-24 font-medium">오안내</label>
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input type="radio" name="wrongGuide" value="" class="mr-1" checked>
                                    <span class="radio-text">전체</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="wrongGuide" value="Y" class="mr-1">
                                    <span class="radio-text">Y</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="wrongGuide" value="N" class="mr-1">
                                    <span class="radio-text">N</span>
                                </label>
                            </div>
                        </div>--%>

                        <!-- 금지문구 -->
                        <div class="flex items-center">
                            <label class="w-24 font-medium">금지문구</label>
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input type="radio" name="banned" value="" class="mr-1" checked>
                                    <span class="radio-text">전체</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="banned" value="Y" class="mr-1">
                                    <span class="radio-text">Y</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="banned" value="N" class="mr-1">
                                    <span class="radio-text">N</span>
                                </label>
                            </div>
                        </div>

                        <!-- 불법추심 -->
                        <div class="flex items-center">
                            <label class="w-24 font-medium">불법추심</label>
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input type="radio" name="illegal" value="" class="mr-1" checked>
                                    <span class="radio-text">전체</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="illegal" value="Y" class="mr-1">
                                    <span class="radio-text">Y</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="illegal" value="N" class="mr-1">
                                    <span class="radio-text">N</span>
                                </label>
                            </div>
                        </div>

                        <!-- 납부의사 -->
                        <div class="flex items-center col-span-2">
                            <label class="w-24 font-medium">납부의사</label>
                            <div class="flex space-x-4">
                                <label class="inline-flex items-center">
                                    <input type="radio" name="paymentWill" value="" class="mr-1" checked>
                                    <span class="radio-text">전체</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="paymentWill" value="Y" class="mr-1">
                                    <span class="radio-text">Y</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" name="paymentWill" value="N" class="mr-1">
                                    <span class="radio-text">N</span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- 검색 버튼 -->
                <div class="flex justify-end space-x-2">
                    <button type="reset" class="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        초기화
                    </button>
                    <button type="submit" class="px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        검색
                    </button>
                </div>
            </form>
        </div>

        <!-- 검색 결과 테이블 -->
        <div class="bg-white rounded-xl shadow-lg overflow-hidden table-container">
            <div class="px-4 py-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-white">
                <div class="flex justify-between items-center">
                    <div class="flex items-center space-x-4">
                        <h2 class="text-lg font-semibold text-gray-800">검색 결과</h2>
                        <span class="totalCount text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                            총 <span class="font-bold">2,430</span>건
                        </span>
                    </div>
                    <div class="flex space-x-2"> <!-- 버튼 그룹 추가 -->
                        <button type="button" id="resetSortBtn" class="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            정렬 초기화
                        </button>
                        <button type="button" class="download-list-btn inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                            <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            목록다운로드
                        </button>
                    </div>
                </div>
            </div>

            <div class="overflow-x-auto">
                <table id="mstrListTable" class="sortable min-w-full divide-y divide-gray-200">
                    <thead class="bg-gray-50">
                    <tr>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" data-sort="callDt">
                            상담일자
                            <span class="sort-icon" data-direction="none"></span>
                            <span class="sort-order"></span>
                        </th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" data-sort="custNum">
                            고객번호
                            <span class="sort-icon" data-direction="none"></span>
                            <span class="sort-order"></span>
                        </th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" data-sort="counselorCd">
                            상담사번호
                            <span class="sort-icon" data-direction="none"></span>
                            <span class="sort-order"></span>
                        </th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" data-sort="counselorName">
                            상담사명
                            <span class="sort-icon" data-direction="none"></span>
                            <span class="sort-order"></span>
                        </th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" data-sort="callId">
                            Call 번호
                            <span class="sort-icon" data-direction="none"></span>
                            <span class="sort-order"></span>
                        </th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" data-sort="scoreValue">
                            Score
                            <span class="sort-icon" data-direction="none"></span>
                            <span class="sort-order"></span>
                            <br>(20)
                        </th>
                        <%--<th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" data-sort="item05">
                            오안내<br>(-5)
                        </th>--%>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" data-sort="item07">
                            금지문구
                        </th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" data-sort="item06">
                            불법추심
                        </th>
                        <th scope="col" class="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider" data-sort="item08">
                            납부의사
                        </th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200">
                    </tbody>
                </table>
            </div>

            <!-- 페이징 추가 -->
            <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex items-center text-sm text-gray-700">
                        <label class="mr-2">페이지당 행:</label>
                        <select name="pageSize" class="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </div>
                    <div class="flex items-center justify-center">
                        <nav class="pagination relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span class="sr-only">이전</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                                </svg>
                            </a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50">1</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">4</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">5</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">6</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">7</a>
                            <%--<span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">...</span>--%>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">8</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">9</a>
                            <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">10</a>
                            <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                <span class="sr-only">다음</span>
                                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                                </svg>
                            </a>
                        </nav>
                    </div>
                    <div class="flex items-center text-sm text-gray-700">
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 현황 탭 컨텐츠 -->
    <div id="statsTab" class="tab-content hidden">
        <!-- 검색 조건 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <form id="statsSearchForm" class="grid grid-cols-3 gap-4">
                <div class="col-span-2">
                    <label class="block text-sm font-medium text-gray-700">기간 설정</label>
                    <div class="mt-1 flex space-x-4">
                        <input type="date" name="startDate" class="bg-white border shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                        <span class="self-center">~</span>
                        <input type="date" name="endDate" class="bg-white border shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
                    </div>
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700">상담사</label>
                    <select name="counselor" class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                        <option value="">전체</option>
                    </select>
                </div>
                <div class="col-span-3 flex justify-end space-x-2">
                    <button type="reset" class="px-3 py-1.5 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        초기화
                    </button>
                    <button type="submit" class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        조회
                    </button>
                </div>
            </form>
        </div>


        <!-- 그래프 영역 -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-6">
            <div class="grid grid-cols-3 gap-6">
                <!-- 콜수/고객수/상담수 차트 -->
                <div class="w-full">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">상담 현황</h3>
                    <canvas id="callsChart"></canvas>
                </div>
                <!-- 평균 스크립트 Score 차트 -->
                <div class="w-full">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">스크립트 점수</h3>
                    <canvas id="scoreChart"></canvas>
                </div>
                <!-- 문제소지 콜수 비중 차트 -->
                <div class="w-full">
                    <h3 class="text-lg font-medium text-gray-900 mb-4">문제소지 콜 비중</h3>
                    <canvas id="issueChart"></canvas>
                </div>
            </div>
        </div>


        <!-- 그리드 -->
        <!-- 상세 통계 그리드 -->
        <div class="bg-white rounded-lg shadow-md p-6 mt-6">
            <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold">상세 통계</h3>
                <button onclick="downloadStats()"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                    엑셀 다운로드
                </button>
            </div>
            <div class="overflow-x-auto">
                <table id="mstrStatsTable" class="min-w-full divide-y divide-gray-200">
                    <thead>
                    <tr class="bg-gray-50">
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-header="category">구분</th>
                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" data-header="item">항목</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" data-header="measure">측정치</th>
                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider" data-header="ratio">비중(%)</th>
                    </tr>
                    </thead>
                    <tbody class="bg-white divide-y divide-gray-200" id="statsDetailGrid">
                    <!-- 데이터는 JavaScript로 동적 생성 -->
                    </tbody>
                </table>
            </div>
        </div>

<%--        <div class="bg-white rounded-lg shadow-md overflow-hidden">--%>
<%--            <div class="p-4 flex justify-between items-center border-b border-gray-200">--%>
<%--                <h3 class="text-lg font-medium text-gray-900">상세 통계</h3>--%>
<%--                --%>
<%--            </div>--%>
<%--            <div class="overflow-x-auto">--%>
<%--                <table class="min-w-full divide-y divide-gray-200">--%>
<%--                    <thead class="bg-gray-50">--%>
<%--                    <tr>--%>
<%--                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>--%>
<%--                        <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">항목</th>--%>
<%--                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">측정치</th>--%>
<%--                        <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">비중(%)</th>--%>
<%--                    </tr>--%>
<%--                    </thead>--%>
<%--                    <tbody class="bg-white divide-y divide-gray-200" id="statsTableBody">--%>
<%--                    <!-- 데이터는 JavaScript로 동적 추가 -->--%>
<%--                    </tbody>--%>
<%--                </table>--%>
<%--            </div>--%>
<%--        </div>--%>
    </div>

</div>


</body>
<%-- 필요한 JavaScript 추가 --%>
<script>
    // 라디오 버튼 애니메이션 효과
    document.querySelectorAll('.radio-input').forEach(radio => {
        radio.addEventListener('change', function() {
            document.querySelectorAll('.radio-text').forEach(text => {
                text.classList.remove('text-blue-600', 'font-medium');
            });
            if (this.checked) {
                this.nextElementSibling.classList.add('text-blue-600', 'font-medium');
            }
        });
    });
</script>
</html>