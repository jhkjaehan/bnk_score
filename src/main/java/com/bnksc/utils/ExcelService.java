package com.bnksc.utils;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class ExcelService {

    public byte[] createNonpaymentDetailExcel(Map<String, Object> data) throws Exception {
        try (Workbook workbook = new XSSFWorkbook()) {
            // 스타일 정의
            CellStyle headerStyle = createHeaderStyle(workbook);
            CellStyle dataStyle = createDataStyle(workbook);
            CellStyle scoreStyle = createScoreStyle(workbook);

            // 1. 대표정보 시트 생성
            Sheet basicInfoSheet = workbook.createSheet("대표정보");
            createBasicInfoSheet(basicInfoSheet, (Map<String, String>) data.get("basicInfo"), headerStyle, dataStyle);

            // 2. 스크립트 Score 시트 생성
            Sheet scoreSheet = workbook.createSheet("스크립트 Score");
            createScoreSheet(scoreSheet, (Map<String, String>) data.get("scoreInfo"), headerStyle, scoreStyle);

            // 3. 평가내용 시트 생성
            Sheet evaluationSheet = workbook.createSheet("평가내용");
            createEvaluationSheet(evaluationSheet, (List<Map<String, String>>) data.get("evaluationInfo"), headerStyle, dataStyle);

            // 모든 시트의 컬럼 너비 자동 조정
            autoSizeColumns(workbook);

            // 엑셀 파일을 바이트 배열로 변환
            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            workbook.write(outputStream);
            return outputStream.toByteArray();
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
                {"상담일자", basicInfo.get("consultationDate")},
                {"고객번호", basicInfo.get("customerNumber")},
                {"상담사번호", basicInfo.get("counselorNumber")},
                {"상담사명", basicInfo.get("counselorName")},
                {"Call 번호", basicInfo.get("callNumber")}
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

    private void createScoreSheet(Sheet sheet, Map<String, String> scoreInfo, CellStyle headerStyle, CellStyle scoreStyle) {
        // 헤더 행 생성
        Row headerRow = sheet.createRow(0);
        String[] headers = {"항목", "총점", "본인확인", "첫인사", "끝인사", "필수안내", "오안내"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // 배점 행 생성
        Row scoreRow = sheet.createRow(1);
        String[] scores = {"배점", "25", "5", "5", "5", "5", "5"};

        for (int i = 0; i < scores.length; i++) {
            Cell cell = scoreRow.createCell(i);
            cell.setCellValue(scores[i]);
            cell.setCellStyle(scoreStyle);
        }

        // 실제 점수 행 생성
        Row actualScoreRow = sheet.createRow(2);
        String[] scoreKeys = {"", "total", "identification", "greeting", "closing", "essential", "mistake"};

        for (int i = 0; i < scoreKeys.length; i++) {
            Cell cell = actualScoreRow.createCell(i);
            if (i == 0) {
                cell.setCellValue("득점");
            } else {
                cell.setCellValue(scoreInfo.get(scoreKeys[i]));
            }
            cell.setCellStyle(scoreStyle);
        }
    }

    private void createEvaluationSheet(Sheet sheet, List<Map<String, String>> evaluationInfo, CellStyle headerStyle, CellStyle dataStyle) {
        // 헤더 행 생성
        Row headerRow = sheet.createRow(0);
        String[] headers = {"평가구분", "평가항목", "평가내용", "평가결과"};

        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // 데이터 행 생성
        int rowNum = 1;
        for (Map<String, String> evaluation : evaluationInfo) {
            Row row = sheet.createRow(rowNum++);

            Cell categoryCell = row.createCell(0);
            categoryCell.setCellValue(evaluation.get("category"));
            categoryCell.setCellStyle(dataStyle);

            Cell itemCell = row.createCell(1);
            itemCell.setCellValue(evaluation.get("item"));
            itemCell.setCellStyle(dataStyle);

            Cell contentCell = row.createCell(2);
            contentCell.setCellValue(evaluation.get("content"));
            contentCell.setCellStyle(dataStyle);

            Cell resultCell = row.createCell(3);
            resultCell.setCellValue(evaluation.get("result"));
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