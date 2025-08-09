<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/jsp/inc/head.jsp"/>
    <script type="text/javascript" src="${pageContext.request.contextPath}/js/collection/afterHappyCallDetail.js"></script>
</head>
<body class="bg-gray-100">

<div class="container-custom mx-auto px-4 py-4">
    <!-- 페이지 제목 -->
    <div class="mb-4 flex justify-between items-center">
        <h1 class="text-xl font-bold text-gray-900">사후해피콜 상세</h1>
        <button onclick="downloadDetail()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700">
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
            </svg>
            다운로드
        </button>
    </div>

    <!-- 대표정보 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">대표정보</h2>
        <div class="grid grid-cols-3 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-700">상담일자</label>
                <p class="mt-1 text-sm text-gray-900" id="counselDate">2025-07-21</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">고객번호</label>
                <p class="mt-1 text-sm text-gray-900" id="customerNumber">1234567</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">상담사번호</label>
                <p class="mt-1 text-sm text-gray-900" id="counselorNumber">A001</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">상담사명</label>
                <p class="mt-1 text-sm text-gray-900" id="counselorName">홍길동</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">Call 번호</label>
                <p class="mt-1 text-sm text-gray-900" id="callNumber">CALL-001</p>
            </div>
            <div>
                <label class="block text-sm font-medium text-gray-700">상품</label>
                <p class="mt-1 text-sm text-gray-900" id="product">오토_신차</p>
            </div>
        </div>
    </div>

    <!-- 스크립트 Score -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">스크립트 Score</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">항목</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Score</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">첫인사</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">본인확인</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">스크립트 준수</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">종료인사</th>
                </tr>
                </thead>
                <tbody id="scriptScoreBody">
                <!-- 데이터는 JavaScript로 동적 생성 -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- 평가내용 -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">평가내용</h2>
        <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                <tr>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">평가구분</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">평가항목</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">평가내용</th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">평가결과</th>
                </tr>
                </thead>
                <tbody id="evaluationBody">
                <!-- 데이터는 JavaScript로 동적 생성 -->
                </tbody>
            </table>
        </div>
    </div>

    <!-- 고객과 대화내용 -->
    <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
            <svg class="w-6 h-6 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
            고객과 대화내용
        </h2>
        <div class="space-y-4">
            <!-- 상담사 대화 -->
            <div class="flex items-start space-x-3">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                        <span class="text-white text-sm font-medium">상담</span>
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