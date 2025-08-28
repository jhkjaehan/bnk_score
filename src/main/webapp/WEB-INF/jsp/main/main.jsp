<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<!DOCTYPE html>
<html lang="ko">
<head>
    <jsp:include page="/WEB-INF/jsp/inc/head.jsp"/>
</head>
<body class="bg-gray-50">
<jsp:include page="/WEB-INF/jsp/inc/header.jsp"/>

<main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- 환영 메시지 섹션 -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">대화 분석 스코어링 시스템</h1>
        <p class="text-xl text-gray-600">효율적인 상담 품질 관리를 위한 통합 솔루션</p>
    </div>

    <!-- 메인 메뉴 카드 그리드 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <!-- 콜렉션센터 카드 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-blue-600 px-4 py-3">
                <h2 class="text-xl font-semibold text-white">콜렉션센터</h2>
            </div>
            <div class="p-6">
                <ul class="space-y-3">
                    <li>
                        <a href="${pageContext.request.contextPath}/collection/nonpaymentPage.do"
                           class="flex items-center text-gray-700 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                            미납안내
                        </a>
                    </li>
                    <li>
                        <a href="${pageContext.request.contextPath}/collection/afterHappyCallPage.do"
                           class="flex items-center text-gray-700 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                            사후해피콜
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);"
                           class="flex items-center text-gray-700 hover:text-blue-600">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                            채권추심(향후 오픈)
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 소매다이렉트영업팀 카드 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-green-600 px-4 py-3">
                <h2 class="text-xl font-semibold text-white">소매다이렉트영업팀</h2>
            </div>
            <div class="p-6">
                <ul class="space-y-3">
                    <li>
                        <a href="${pageContext.request.contextPath}/retail/excellentLoanPage.do"
                           class="flex items-center text-gray-700 hover:text-green-600">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                            우수고객추가대출
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);"
                           class="flex items-center text-gray-700 hover:text-green-600">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                            대출취급약정안내(향후 오픈)
                        </a>
                    </li>
                </ul>
            </div>
        </div>

        <!-- 오토채널운영팀 카드 -->
        <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <div class="bg-purple-600 px-4 py-3">
                <h2 class="text-xl font-semibold text-white">오토채널운영팀</h2>
            </div>
            <div class="p-6">
                <ul class="space-y-3">
                    <li>
                        <a href="${pageContext.request.contextPath}/auto/retentionPage.do"
                           class="flex items-center text-gray-700 hover:text-purple-600">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                            리텐션
                        </a>
                    </li>
                    <li>
                        <a href="javascript:void(0);"
                           class="flex items-center text-gray-700 hover:text-purple-600">
                            <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"/>
                            </svg>
                            사전해피콜(향후 오픈)
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- 대시보드 섹션 -->
    <%--<div class="bg-white rounded-lg shadow-lg p-6">
        <h2 class="text-2xl font-semibold text-gray-900 mb-6">시스템 현황</h2>
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <!-- 통계 카드들 -->
            <div class="bg-blue-50 rounded-lg p-4">
                <h3 class="text-lg font-medium text-blue-900">오늘의 상담</h3>
                <p class="text-3xl font-bold text-blue-600">127</p>
            </div>
            <div class="bg-green-50 rounded-lg p-4">
                <h3 class="text-lg font-medium text-green-900">평균 스코어</h3>
                <p class="text-3xl font-bold text-green-600">85.5</p>
            </div>
            <div class="bg-yellow-50 rounded-lg p-4">
                <h3 class="text-lg font-medium text-yellow-900">오안내 발생</h3>
                <p class="text-3xl font-bold text-yellow-600">12</p>
            </div>
            <div class="bg-red-50 rounded-lg p-4">
                <h3 class="text-lg font-medium text-red-900">불법추심 의심</h3>
                <p class="text-3xl font-bold text-red-600">3</p>
            </div>
        </div>
    </div>--%>
</main>
</body>
</html>