<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
  <jsp:include page="/WEB-INF/jsp/inc/head.jsp"/>
  <title>배치로그</title>
</head>
<body class="bg-gray-50">
<jsp:include page="/WEB-INF/jsp/inc/header.jsp"/>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <!-- 페이지 제목 -->
  <div class="mb-6">
    <h1 class="text-2xl font-bold text-gray-900">배치로그</h1>
  </div>

  <!-- 검색 박스 -->
  <div class="bg-white rounded-lg shadow-lg p-6 mb-6">
    <form id="searchForm" class="space-y-4">
      <div class="grid grid-cols-3 gap-4">
        <!-- 일자(기간) -->
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium text-gray-700">일자</label>
          <input type="date" name="startDate" class="flex-1 border rounded px-3 py-2 mr-2">
          <span class="mx-2">~</span>
          <input type="date" name="endDate" class="flex-1 border rounded px-3 py-2">
        </div>

        <!-- Status -->
        <div class="flex items-center">
          <label class="w-24 text-sm font-medium text-gray-700">Status</label>
          <select name="status" class="flex-1 border rounded px-3 py-2">
            <option value="">전체</option>
            <option value="SUCCESS">성공</option>
            <option value="FAIL">실패</option>
            <option value="RUNNING">실행중</option>
          </select>
        </div>

        <!-- 조회 버튼 -->
        <div class="flex items-center justify-end">
          <button type="submit" class="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
            조회
          </button>
        </div>
      </div>
    </form>
  </div>

  <!-- 결과 박스 -->
  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- 다운로드 버튼 -->
    <div class="flex justify-end mb-4">
      <button type="button" id="downloadBtn" class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
        목록 다운로드
      </button>
    </div>

    <!-- 결과 테이블 -->
    <div class="overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead>
        <tr>
          <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            작업일시
          </th>
          <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Call 번호
          </th>
          <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            Status
          </th>
          <th class="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
            오류메세지
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200" id="batchLogList">
        <!-- 데이터는 JavaScript에서 동적으로 추가됨 -->
        </tbody>
      </table>
    </div>
  </div>
</main>

<script>
  $(document).ready(function() {
    // 검색 폼 제출
    $('#searchForm').submit(function(e) {
      e.preventDefault();
      searchBatchLogs();
    });

    // 다운로드 버튼 클릭
    $('#downloadBtn').click(function() {
      downloadBatchLogs();
    });

    // 초기 데이터 로드
    //searchBatchLogs();
  });

  function searchBatchLogs() {
    // AJAX 호출로 배치 로그 데이터 조회
    const formData = $('#searchForm').serialize();
    $.ajax({
      url: '/api/batch/logs',
      data: formData,
      success: function(response) {
        renderBatchLogs(response);
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

      tr.append([
        $('<td>').addClass('px-6 py-4 whitespace-nowrap text-sm text-gray-900').text(log.executionTime),
        $('<td>').addClass('px-6 py-4 whitespace-nowrap text-sm text-gray-900').text(log.callNumber),
        $('<td>').addClass('px-6 py-4 whitespace-nowrap text-sm').append(
                getStatusBadge(log.status)
        ),
        $('<td>').addClass('px-6 py-4 text-sm text-gray-500').text(log.errorMessage || '-')
      ]);

      tbody.append(tr);
    });
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

  function downloadBatchLogs() {
    const formData = $('#searchForm').serialize();
    location.href = `/api/batch/logs/download?${formData}`;
  }
</script>
</body>
</html>