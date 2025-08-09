<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <jsp:include page="/WEB-INF/jsp/inc/head.jsp"/>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.3.0/dist/chart.umd.min.js"></script>
  <script type="text/javascript" src="${pageContext.request.contextPath}/js/auto/retention.js"></script>
</head>
<body class="bg-gray-100">
<jsp:include page="/WEB-INF/jsp/inc/header.jsp"/>

<div class="container-custom mx-auto px-4 py-4">
  <!-- 페이지 제목 -->
  <div class="mb-4">
    <h1 class="text-xl font-bold text-gray-900">리텐션</h1>
  </div>

  <jsp:include page="/WEB-INF/jsp/inc/tabMenu.jsp"/>

  <!-- CALL 리스트 탭 컨텐츠 -->
  <div id="listTab" class="tab-content active">
    <div class="bg-blue-50 rounded-xl shadow-lg p-4 mb-4 text-sm">
      <h2 class="text-lg font-semibold text-black-800 mb-4">검색 조건</h2>
      <form id="searchForm" class="space-y-4">
        <!-- 첫 번째 줄: 고객번호, 상담사 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center">
            <label class="w-24 font-medium">고객번호</label>
            <input type="text" name="customerNumber" class="flex-1 border rounded px-2 py-1">
          </div>
          <div class="flex items-center">
            <label class="w-24 font-medium">상담사</label>
            <select name="counselor" class="flex-1 border rounded px-2 py-1">
              <option value="">선택하세요</option>
              <option value="1">상담사1</option>
              <option value="2">상담사2</option>
            </select>
          </div>
        </div>

        <!-- 두번째 줄: 기간 -->
        <div class="grid grid-cols-2 gap-4">
          <div class="flex items-center">
            <label class="w-24 font-medium">만기일자</label>
            <input type="date" name="startDate" class="border rounded px-2 py-1">
            <span class="mx-2">~</span>
            <input type="date" name="endDate" class="border rounded px-2 py-1">
          </div>
          <div class="flex items-center">
            <label class="w-24 font-medium">상담일자</label>
            <input type="date" name="startDate" class="border rounded px-2 py-1">
            <span class="mx-2">~</span>
            <input type="date" name="endDate" class="border rounded px-2 py-1">
          </div>
        </div>

        <!-- 세 번째 줄: 라디오 버튼 그룹들 -->
        <div class="grid grid-cols-3 gap-4">
          <!-- 고객의향 -->
          <div class="flex items-center">
            <label class="w-24 font-medium">고객의향</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="checkbox" name="progress" value="all" checked class="mr-1">
                <span>전체</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" name="progress" value="success" class="mr-1">
                <span>인수</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" name="progress" value="reject" class="mr-1">
                <span>반납</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" name="progress" value="hold" class="mr-1">
                <span>연장</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" name="progress" value="hold" class="mr-1">
                <span>승계</span>
              </label>
              <label class="inline-flex items-center">
                <input type="checkbox" name="progress" value="hold" class="mr-1">
                <span>신규차량</span>
              </label>
            </div>
          </div>

          <!-- 결정구분 -->
          <div class="flex items-center">
            <label class="w-24 font-medium">결정구분</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="recall" value="all" checked class="mr-1">
                <span>전체</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="recall" value="Y" class="mr-1">
                <span>연장</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="recall" value="Y" class="mr-1">
                <span>연장 이외</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="recall" value="N" class="mr-1">
                <span>미결정</span>
              </label>
            </div>
          </div>

          <!-- 리콜약속 -->
          <div class="flex items-center">
            <label class="w-24 font-medium">리콜약속</label>
            <div class="flex space-x-4">
              <label class="inline-flex items-center">
                <input type="radio" name="reconfirm" value="all" checked class="mr-1">
                <span>전체</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="reconfirm" value="Y" class="mr-1">
                <span>Y</span>
              </label>
              <label class="inline-flex items-center">
                <input type="radio" name="reconfirm" value="N" class="mr-1">
                <span>N</span>
              </label>
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
            <span class="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                    총 <span class="font-bold">2,430</span>건
                        </span>
          </div>
          <button type="button" class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200">
            <svg class="-ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
            </svg>
            목록다운로드
          </button>
        </div>
      </div>

      <!-- 테이블 부분은 유지 -->

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
          <tr>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담일자</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객번호</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">만기일자</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담사번호</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상담사명</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Call 번호</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">결정구분</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">고객의향</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">리콜약속</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">약속일시</th>
            <th scope="col" class="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">연장가능성<br>Score</th>
          </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
          <tr onclick="openDetailPage()" class="hover:bg-gray-50 cursor-pointer text-xs">
            <td class="px-4 py-2 whitespace-nowrap">2025-04-01</td>
            <td class="px-4 py-2 whitespace-nowrap">01067783418</td>
            <td class="px-4 py-2 whitespace-nowrap">2025-06-15</td>
            <td class="px-4 py-2 whitespace-nowrap">5250023</td>
            <td class="px-4 py-2 whitespace-nowrap">이*자</td>
            <td class="px-4 py-2 whitespace-nowrap text-blue-600 hover:text-blue-800">20250401144201_5250018_0265</td>
            <td class="px-4 py-2 whitespace-nowrap">연장</td>
            <td class="px-4 py-2 whitespace-nowrap">인수,연장</td>
            <td class="px-4 py-2 whitespace-nowrap">N</td>
            <td class="px-4 py-2 whitespace-nowrap">2025-04-02 10:30</td>
            <td class="px-4 py-2 whitespace-nowrap">-</td>
          </tr>
          <tr onclick="openDetailPage()" class="hover:bg-gray-50 cursor-pointer text-xs">
            <td class="px-4 py-2 whitespace-nowrap">2025-04-01</td>
            <td class="px-4 py-2 whitespace-nowrap">01082216452</td>
            <td class="px-4 py-2 whitespace-nowrap">2025-06-10</td>
            <td class="px-4 py-2 whitespace-nowrap">5250023</td>
            <td class="px-4 py-2 whitespace-nowrap">이*자</td>
            <td class="px-4 py-2 whitespace-nowrap text-blue-600 hover:text-blue-800">20250401144201_5250018_0265</td>
            <td class="px-4 py-2 whitespace-nowrap">연장 이외</td>
            <td class="px-4 py-2 whitespace-nowrap">반납</td>
            <td class="px-4 py-2 whitespace-nowrap">N</td>
            <td class="px-4 py-2 whitespace-nowrap">2025-04-02 10:30</td>
            <td class="px-4 py-2 whitespace-nowrap">-</td>
          </tr>
          <tr onclick="openDetailPage()" class="hover:bg-gray-50 cursor-pointer text-xs">
            <td class="px-4 py-2 whitespace-nowrap">2025-04-01</td>
            <td class="px-4 py-2 whitespace-nowrap">01029477196</td>
            <td class="px-4 py-2 whitespace-nowrap">-</td>
            <td class="px-4 py-2 whitespace-nowrap">5250018</td>
            <td class="px-4 py-2 whitespace-nowrap">이*자</td>
            <td class="px-4 py-2 whitespace-nowrap text-blue-600 hover:text-blue-800">20250401144201_5250018_0265</td>
            <td class="px-4 py-2 whitespace-nowrap">미결정</td>
            <td class="px-4 py-2 whitespace-nowrap">인수</td>
            <td class="px-4 py-2 whitespace-nowrap">N</td>
            <td class="px-4 py-2 whitespace-nowrap">2025-04-02 10:30</td>
            <td class="px-4 py-2 whitespace-nowrap">20</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- 페이징 추가 -->
      <div class="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center text-sm text-gray-700">
            <label class="mr-2">페이지당 행:</label>
            <select class="border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500">
              <option>10</option>
              <option>20</option>
              <option>50</option>
              <option>100</option>
            </select>
          </div>
          <div class="flex items-center justify-center">
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <a href="#" class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                <span class="sr-only">이전</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-blue-600 hover:bg-blue-50">1</a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">2</a>
              <a href="#" class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">3</a>
              <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-gray-50 text-sm font-medium text-gray-700">...</span>
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
            <span>1-10 / 총 2,430건</span>
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
        <div>
          <label class="block text-sm font-medium text-gray-700">만기일자</label>
          <div class="mt-1 flex space-x-4">
            <input type="date" name="startDateMatur" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
            <span class="self-center">~</span>
            <input type="date" name="endDateMatur" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">상담일자</label>
          <div class="mt-1 flex space-x-4">
            <input type="date" name="startDateCounsul" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
            <span class="self-center">~</span>
            <input type="date" name="endDateCounsul" class="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">상담사</label>
          <select name="counselor" class="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
            <option value="">전체</option>
            <option value="1">상담사1</option>
            <option value="2">상담사2</option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700">고객의향</label>
          <div class="flex space-x-4">
            <label class="inline-flex items-center">
              <input type="checkbox" name="intention" value="all" checked class="mr-1">
              <span>전체</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" name="intention" value="1" class="mr-1">
              <span>인수</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" name="intention" value="2" class="mr-1">
              <span>반납</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" name="intention" value="3" class="mr-1">
              <span>연장</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" name="intention" value="4" class="mr-1">
              <span>승계</span>
            </label>
            <label class="inline-flex items-center">
              <input type="checkbox" name="intention" value="5" class="mr-1">
              <span>신규차량</span>
            </label>
          </div>
        </div>
        <div class="col-span-3 flex justify-end">
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
        <table class="min-w-full divide-y divide-gray-200">
          <thead>
          <tr class="bg-gray-50">
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">구분</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">항목</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">측정치</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">비중(%)</th>
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