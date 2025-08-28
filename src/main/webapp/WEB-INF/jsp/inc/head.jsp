<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>

<!-- 공통 스타일 -->
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/css/style.css" />
<link rel="stylesheet" href="${pageContext.request.contextPath}/js/jquery/ui/jquery-ui.min.css" />

<!-- JS 라이브러리 및 공통 유틸 -->
<script src="${pageContext.request.contextPath}/js/jquery/jquery-3.5.1.min.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery/jquery-ui-1.12.1.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery/json.min.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery/jquery.form.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery/jquery.cookie.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery/jquery.meio.mask.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery/jquery.money.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery.placeholder.js"></script>
<script src="${pageContext.request.contextPath}/js/jquery/jquery.fileDownload.js"></script>
<%--<script src="${pageContext.request.contextPath}/js/portal/lib/jquery.bx.js"></script>--%>
<%--<script src="https://cdn.tailwindcss.com"></script>--%>
<%-- 로컬 Tailwind CSS 추가 --%>
<link rel="stylesheet" href="${pageContext.request.contextPath}/css/tailwind/output.css" />


<script type="text/javascript" src="${pageContext.request.contextPath}/js/common/common.js"></script>
<%--
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">--%>

<title>대화 분석 스코어링 시스템</title>
