package com.bnksc.menu.web;

import com.bnksc.menu.service.MonitorService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
public class MonitorController {

    private Logger log = LoggerFactory.getLogger(this.getClass());

    @Resource(name="monitorService")
    private MonitorService monitorService;

    //시스템의 Python 경로
    @Value("${Globals.PythonPath}")
    private String pythonPath;

    //Python 파일 경로
    @Value("${Globals.PythonFilePath}")
    private String pythonFilePath;

    @RequestMapping(value="/monitor/batchLogMonitorPage.do")
    public String batchLogMonitorPage() {
        return "/monitor/batchLogMonitor";
    }

    @RequestMapping(value="/monitor/selectBatchLogList.do")
    public String selectBatchLogList(@RequestParam Map<String, Object> params, Model model) {

        try {
            Object result = monitorService.selectBatchLogList(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", result);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @GetMapping("/monitor/downloadBatchLogList.do")
    public ResponseEntity<byte[]> downloadBatchLogList(@RequestParam Map<String, Object> params) {
        try {
            //전체 데이터 다운로드
            params.put("downloadYn","Y");

            Map<String, Object> result = monitorService.selectBatchLogList(params);
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> list = (List<Map<String, Object>>) result.get("list");

            // Excel 워크북 생성
            try (Workbook workbook = new XSSFWorkbook()) {
                Sheet sheet = workbook.createSheet("배치로그");

                // 헤더 스타일
                CellStyle headerStyle = workbook.createCellStyle();
                headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
                headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
                headerStyle.setBorderBottom(BorderStyle.THIN);
                headerStyle.setBorderTop(BorderStyle.THIN);
                headerStyle.setBorderLeft(BorderStyle.THIN);
                headerStyle.setBorderRight(BorderStyle.THIN);
                Font headerFont = workbook.createFont();
                headerFont.setBold(true);
                headerStyle.setFont(headerFont);

                // 헤더 생성
                String[] headers = {"작업일시", "Call 번호", "Status", "오류메세지"};
                Row headerRow = sheet.createRow(0);
                for (int i = 0; i < headers.length; i++) {
                    Cell cell = headerRow.createCell(i);
                    cell.setCellValue(headers[i]);
                    cell.setCellStyle(headerStyle);
                    sheet.setColumnWidth(i, 256 * 20); // 기본 컬럼 너비 설정
                }

                // 데이터 입력
                int rowNum = 1;
                CellStyle dataStyle = workbook.createCellStyle();
                dataStyle.setBorderBottom(BorderStyle.THIN);
                dataStyle.setBorderTop(BorderStyle.THIN);
                dataStyle.setBorderLeft(BorderStyle.THIN);
                dataStyle.setBorderRight(BorderStyle.THIN);

                for (Map<String, Object> item : list) {
                    Row row = sheet.createRow(rowNum++);

                    Cell cell0 = row.createCell(0);
                    cell0.setCellValue(String.valueOf(item.get("raiseDt")));
                    cell0.setCellStyle(dataStyle);

                    Cell cell1 = row.createCell(1);
                    cell1.setCellValue(String.valueOf(item.get("callId")));
                    cell1.setCellStyle(dataStyle);

                    Cell cell2 = row.createCell(2);
                    cell2.setCellValue(String.valueOf(item.get("status")));
                    cell2.setCellStyle(dataStyle);

                    Cell cell3 = row.createCell(3);
                    cell3.setCellValue(String.valueOf(item.get("errMsg")));
                    cell3.setCellStyle(dataStyle);
                }

                // 파일 생성
                ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
                workbook.write(outputStream);

                // 파일명 생성
                String fileName = "배치로그_" +
                        LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss")) +
                        ".xlsx";
                String encodedFileName = URLEncoder.encode(fileName, StandardCharsets.UTF_8);

                HttpHeaders httpHeaders = new HttpHeaders();
                httpHeaders.setContentType(MediaType.APPLICATION_OCTET_STREAM);
                httpHeaders.setContentDispositionFormData("attachment", encodedFileName);

                return ResponseEntity
                        .ok()
                        .headers(httpHeaders)
                        .body(outputStream.toByteArray());
            }
        } catch (Exception e) {
            log.error("배치로그 다운로드 중 오류 발생", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @RequestMapping(value="/monitor/executeBatch.do")
    @ResponseBody
    public Map<String, Object> executeBatch(@RequestParam String callId) {
        Map<String, Object> response = new HashMap<>();

        try {
//            String pythonPath = "/usr/bin/python3"; // 시스템의 Python 경로
//            String scriptPath = "/Users/kimjaehan/Desktop/workF/testFiles/exTest.py";

            ProcessBuilder processBuilder = new ProcessBuilder(pythonPath, pythonFilePath,"--call_id", callId);
            processBuilder.redirectErrorStream(true); // 에러 스트림을 표준 출력으로 리다이렉트

            Process process = processBuilder.start();

            // Python 스크립트의 출력을 읽음
            try (BufferedReader reader = new BufferedReader(
                    new InputStreamReader(process.getInputStream()))) {
                StringBuilder output = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    output.append(line).append("\n");
                }

                int exitCode = process.waitFor();

                response.put("status", exitCode == 0 ? "success" : "error");
                response.put("output", output.toString());
                if (exitCode != 0) {
                    response.put("message", "실행 중 오류가 발생했습니다.");
                }
            }

        } catch (Exception e) {
            log.error("배치 실행 중 오류 발생", e);
            response.put("status", "error");
            response.put("message", "배치 실행 중 오류가 발생했습니다: " + e.getMessage());
        }

        return response;
    }


}
