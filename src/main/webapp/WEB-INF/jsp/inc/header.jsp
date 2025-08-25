<%--
  Created by IntelliJ IDEA.
  User: kimjaehan
  Date: 2025. 6. 4.
  Time: 15:06
  To change this template use File | Settings | File Templates.
--%>
<%@ page contentType="text/html;charset=UTF-8" pageEncoding="UTF-8" language="java" %>

<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<%--<header id="header">
    <div class="header">
        <div class="gnb-area">
            <div class="gnb-box">
                <ul class="left">
                </ul>
                <ul class="right">
                    <li>
                        <a href="${pageContext.request.contextPath}/main/mainPage.do">
                            홈으로
                        </a>
                    </li>
                </ul>
            </div>
        </div>
        <div class="header-area">
            <div class="header-box">
                <ul class="top-menu">
                    <li>
                        <a href="${pageContext.request.contextPath}/collection/nonpaymentPage.do">콜렉션센터</a>
                        <ul class="subDep">
                            <li><a href="${pageContext.request.contextPath}/collection/nonpaymentPage.do">미납안내</a></li>
                            <li><a href="${pageContext.request.contextPath}/#">사후해피콜</a></li>
                            <li><a href="${pageContext.request.contextPath}/#">채권추심</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="${pageContext.request.contextPath}/#">소매다이렉트영업팀</a>
                        <ul class="subDep">
                            <li><a href="${pageContext.request.contextPath}/#">우수추가대출</a></li>
                            <li><a href="${pageContext.request.contextPath}/#">대출취급약정안내</a></li>
                        </ul>
                    </li>
                    <li>
                        <a href="${pageContext.request.contextPath}/#">오토채널운영팀</a>
                        <ul class="subDep">
                            <li><a href="${pageContext.request.contextPath}/#">리텐션</a></li>
                            <li><a href="${pageContext.request.contextPath}/#">사전해피콜</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</header>--%>
<script>
    function gotoPage(url) {
        var url = url ? url : "/main/mainPage.do";
        location.href = url;
    }
</script>
<header id="header" class="bg-white shadow sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
            <!-- 왼쪽: 로고 or 타이틀 -->
            <div class="flex items-center space-x-4">
                <a href="${pageContext.request.contextPath}/main/mainPage.do" class="text-xl font-bold text-blue-700">
                    대화 분석 스코어링 시스템
                </a>
                <nav class="hidden md:flex space-x-6">
                    <!-- 메뉴 1 -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-blue-600 font-medium" onclick="gotoPage('/collection/nonpaymentPage.do');">콜렉션센터</button>
                        <div class="absolute left-0 w-48 bg-white border rounded shadow-lg hidden group-hover:block z-50">
                            <a href="${pageContext.request.contextPath}/collection/nonpaymentPage.do" class="block px-4 py-2 text-sm hover:bg-gray-100">미납안내</a>
                            <a href="${pageContext.request.contextPath}/collection/afterHappyCallPage.do" class="block px-4 py-2 text-sm hover:bg-gray-100">사후해피콜</a>
                            <a href="javascript:void(0);" class="block px-4 py-2 text-sm hover:bg-gray-100">채권추심(향후 오픈)</a>
                        </div>
                    </div>

                    <!-- 메뉴 2 -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-blue-600 font-medium" onclick="gotoPage('/retail/excellentLoanPage.do');">소매다이렉트영업팀</button>
                        <div class="absolute left-0 w-56 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 invisible group-hover:visible">
                            <a href="${pageContext.request.contextPath}/retail/excellentLoanPage.do" class="block px-4 py-2 text-sm hover:bg-gray-100">우수고객추가대출</a>
                            <a href="javascript:void(0);" class="block px-4 py-2 text-sm hover:bg-gray-100">대출취급약정안내(향후 오픈)</a>
                        </div>
                    </div>

                    <!-- 메뉴 3 -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-blue-600 font-medium" onclick="gotoPage('/auto/retentionPage.do');">오토채널운영팀</button>
                        <div class="absolute left-0 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 invisible group-hover:visible">
                            <a href="${pageContext.request.contextPath}/auto/retentionPage.do" class="block px-4 py-2 text-sm hover:bg-gray-100">리텐션</a>
                            <a href="javascript:void(0);" class="block px-4 py-2 text-sm hover:bg-gray-100">사전해피콜(향후 오픈)</a>
                        </div>
                    </div>

                    <!-- 메뉴 4 -->
                    <div class="relative group">
                        <button class="text-gray-700 hover:text-blue-600 font-medium" onclick="gotoPage('/monitor/batchLogMonitorPage.do');">로그</button>
                        <div class="absolute left-0 w-48 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition duration-200 invisible group-hover:visible">
                            <a href="${pageContext.request.contextPath}/monitor/batchLogMonitorPage.do" class="block px-4 py-2 text-sm hover:bg-gray-100">배치로그</a>
                        </div>
                    </div>
                </nav>
            </div>

            <!-- 오른쪽: 홈으로 버튼 -->
            <div>
                <a href="${pageContext.request.contextPath}/main/mainPage.do" class="text-sm text-blue-600 hover:underline font-medium">홈으로</a>
            </div>
        </div>
    </div>
</header>
