package com.bnksc.utils;

import com.mysql.cj.util.StringUtils;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.util.StringUtil;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExcelService {

    public byte[] createListExcel(Object result,Map<String, Object> params) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("상담 목록");

        // 헤더 스타일 설정
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setBorderBottom(BorderStyle.THIN);

        String headerNames = params.get("headerNames").toString();
        String headerKey = params.get("headerKeys").toString();
        String[] headerKeys = headerKey.split(",");
        // 헤더 생성
        String[] headers = {
                "상담일자", "고객번호", "상담사번호", "상담사명", "Call 번호",
                "스크립트 Score", "오안내", "금지문구", "불법추심", "납부의사"
        };

        //헤더 정보 있을 시 정보 교쳬
        if(StringUtil.isNotBlank(headerNames)) {
            headers = headerNames.split(",");
        }

        Row headerRow = sheet.createRow(0);
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
            sheet.setColumnWidth(i, 4000); // 컬럼 너비 설정
        }

        // 데이터 입력
        if (result instanceof Map) {
            Map<String, Object> resultMap = (Map<String, Object>) result;
            List<Map<String, Object>> list = (List<Map<String, Object>>) resultMap.get("list");

            int rowNum = 1;
            for (Map<String, Object> item : list) {
                Row row = sheet.createRow(rowNum++);
                for (int i = 0; i < headerKeys.length; i++) {
                    if(String.valueOf(item.get(headerKeys[i])).equals("null")) {
                        row.createCell(i).setCellValue("");
                    } else {
                        row.createCell(i).setCellValue(String.valueOf(item.get(headerKeys[i])));
                    }
                }
//                row.createCell(0).setCellValue(String.valueOf(item.get("callDt")));
//                row.createCell(1).setCellValue(String.valueOf(item.get("custNum")));
//                row.createCell(2).setCellValue(String.valueOf(item.get("counselorCd")));
//                row.createCell(3).setCellValue(String.valueOf(item.get("counselorName")));
//                row.createCell(4).setCellValue(String.valueOf(item.get("callId")));
//                row.createCell(5).setCellValue(String.valueOf(item.get("scoreValue")));
//                row.createCell(6).setCellValue(String.valueOf(item.get("item05")));
//                row.createCell(7).setCellValue(String.valueOf(item.get("item06")));
//                row.createCell(8).setCellValue(String.valueOf(item.get("item07")));
//                row.createCell(9).setCellValue(String.valueOf(item.get("item08")));
            }
        }

        // 엑셀 파일을 바이트 배열로 변환
        ByteArrayOutputStream bos = new ByteArrayOutputStream();
        workbook.write(bos);
        workbook.close();

        return bos.toByteArray();
    }


    public byte[] createDetailExcel(Map<String, Object> data) throws Exception {
        try {
            Workbook workbook = new XSSFWorkbook();
            // 스타일 정의
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle scoreStyle = createScoreStyle(workbook);

            // 1. 대표정보 시트 생성
            Sheet basicInfoSheet = workbook.createSheet("상세정보");
            createBasicInfoSheet(basicInfoSheet, (Map<String, String>) data.get("basicInfo"), headerStyle, dataStyle);

            // 2. 스크립트 Score 시트 생성
//            Sheet scoreSheet = workbook.createSheet("스크립트 Score");
            createScoreSheet(basicInfoSheet, (ArrayList<Map<String,Object>>) data.get("scoreInfo"), headerStyle, scoreStyle);

            // 3. 평가내용 시트 생성
//            Sheet evaluationSheet = workbook.createSheet("평가내용");
            createEvaluationSheet(basicInfoSheet, (List<Map<String, String>>) data.get("evaluationInfo"), headerStyle, dataStyle);

            // 모든 시트의 컬럼 너비 자동 조정
            autoSizeColumns(workbook);

            // 엑셀 파일을 바이트 배열로 변환
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }

    }

    private CellStyle createHeaderStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
        style.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);

        Font font = workbook.createFont();
        font.setBold(true);
        style.setFont(font);

        return style;
    }

    private CellStyle createDataStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.LEFT);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private CellStyle createScoreStyle(Workbook workbook) {
        CellStyle style = workbook.createCellStyle();
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setAlignment(HorizontalAlignment.CENTER);
        style.setVerticalAlignment(VerticalAlignment.CENTER);
        return style;
    }

    private void createBasicInfoSheet(Sheet sheet, Map<String, String> basicInfo, CellStyle headerStyle, CellStyle dataStyle) {
        String[][] headers = {
                {"상담일시", basicInfo.get("callDt")},
                {"고객번호", basicInfo.get("custNum")},
                {"상담원번호", basicInfo.get("counselorCd")},
                {"상담원명", basicInfo.get("counselorName")},
                {"콜ID", basicInfo.get("callId")},
                {"업무구분", basicInfo.get("taskName")}

        };

        for (int i = 0; i < headers.length; i++) {
            Row row = sheet.createRow(i);
            Cell headerCell = row.createCell(0);
            Cell dataCell = row.createCell(1);

            headerCell.setCellValue(headers[i][0]);
            headerCell.setCellStyle(headerStyle);

            dataCell.setCellValue(headers[i][1]);
            dataCell.setCellStyle(dataStyle);
        }
    }

    private void createScoreSheet(Sheet sheet, ArrayList<Map<String,Object>> scoreInfo, CellStyle headerStyle, CellStyle scoreStyle) {
        // 헤더 행 생성
        Row headerRow = sheet.createRow(10);

        for (int i = 0; i < scoreInfo.size(); i++) {
            String type = (String)scoreInfo.get(i).get("type");
            String data = (String)scoreInfo.get(i).get("data");
            int order = (Integer)scoreInfo.get(i).get("order");
            if(type.equals("col")) {
                Cell cell = headerRow.createCell(order);
                cell.setCellValue(data);
                cell.setCellStyle(headerStyle);
            }
        }


        // 배점 행 생성
        Row scoreRow = sheet.createRow(11);

        for (int i = 0; i < scoreInfo.size(); i++) {
            String type = (String)scoreInfo.get(i).get("type");
            String data = (String)scoreInfo.get(i).get("data");
            int order = (Integer)scoreInfo.get(i).get("order");
            if(type.equals("row")) {
                Cell cell = scoreRow.createCell(order);
                cell.setCellValue(data);
                cell.setCellStyle(scoreStyle);
            }
        }

    }

    private void createEvaluationSheet(Sheet sheet, List<Map<String, String>> evaluationInfo, CellStyle headerStyle, CellStyle dataStyle) {
        // 헤더 행 생성
        Row headerRow = sheet.createRow(16);
        String[] headers = {"평가구분", "평가항목", "평가내용", "평가결과"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // 데이터 행 생성
        int rowNum = 17;
        for (Map<String, String> evaluation : evaluationInfo) {
            Row row = sheet.createRow(rowNum++);

            Cell categoryCell = row.createCell(0);
            categoryCell.setCellValue(evaluation.get("typeName"));
            categoryCell.setCellStyle(dataStyle);

            Cell itemCell = row.createCell(1);
            itemCell.setCellValue(evaluation.get("itemName"));
            itemCell.setCellStyle(dataStyle);

            Cell contentCell = row.createCell(2);
            contentCell.setCellValue(evaluation.get("contentName"));
            contentCell.setCellStyle(dataStyle);

            Cell resultCell = row.createCell(3);
            resultCell.setCellValue(evaluation.get("evaluationResult"));
            resultCell.setCellStyle(dataStyle);
        }
    }

    private void autoSizeColumns(Workbook workbook) {
        for (int i = 0; i < workbook.getNumberOfSheets(); i++) {
            Sheet sheet = workbook.getSheetAt(i);
            if (sheet.getPhysicalNumberOfRows() > 0) {
                Row row = sheet.getRow(sheet.getFirstRowNum());
                for (int j = 0; j < row.getLastCellNum(); j++) {
                    sheet.autoSizeColumn(j);
                }
            }
        }
    }
}