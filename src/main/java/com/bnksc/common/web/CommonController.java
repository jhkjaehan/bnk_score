package com.bnksc.common.web;

import com.bnksc.collection.service.CollectionService;
import com.bnksc.common.service.CommonService;
import com.bnksc.utils.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.poi.util.StringUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

@Controller
public class CommonController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Resource(name="commonService")
    private CommonService commonService;

    @Resource(name="collectionService")
    private CollectionService collectionService;

    private final ExcelService excelService;

    @Autowired
    public CommonController(ExcelService excelService) {this.excelService = excelService;}

    @RequestMapping(value="/common/selectCounselorList.do")
    public String getCounselorList(@RequestParam Map<String, Object> params, Model model) {

        try {
            List<Map<String, Object>> counselorList = commonService.selectCounselorList(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", counselorList);
            model.addAttribute("totalCount", counselorList.size());

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectMstrScore.do")
    public String selectMstrScore(@RequestParam Map<String, Object> params, Model model) {
        log.debug("params ::: ",params);

        try {
            List<Map<String, Object>> mstrScore = commonService.selectMstrScore(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", mstrScore);
            model.addAttribute("totalCount", mstrScore.size());

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectMstrContentList.do")
    public String selectMstrContentList(@RequestParam Map<String, Object> params, Model model) {

        try {
            List<Map<String, Object>> mstrContentList = commonService.selectMstrContentList(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", mstrContentList);
            model.addAttribute("totalCount", mstrContentList.size());

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectMstrConversation.do")
    public String selectMstrConversation(@RequestParam Map<String, Object> params, Model model) {
        try {
            String taskId = (String) params.get("taskId");
            String callId = (String) params.get("callId");

            // 서비스 호출
            Object result = commonService.readConversation(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", result);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    @RequestMapping(value="/common/selectCallChartData.do")
    public String selectCallChartData(@RequestParam Map<String, Object> params, Model model) {
        try {
            // 서비스 호출
            model.addAttribute("status", "success");

            // 사후 해피콜 관련 세팅
            Object taskIdObj = params.get("taskId");
            if(taskIdObj != null) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    // JSON 배열 문자열인 경우
                    String[] taskIds = mapper.readValue(taskIdObj.toString(), String[].class);
                    params.put("taskId", taskIds);
                } catch (Exception e) {
                    // 단일 문자열인 경우
                    params.put("taskId", new String[]{taskIdObj.toString()});
                }
            }

            // 사후 해피콜 관련 세팅
            Object typeIdObj = params.get("typeId");
            if(typeIdObj != null) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    // JSON 배열 문자열인 경우
                    String[] typeIds = mapper.readValue(typeIdObj.toString(), String[].class);
                    params.put("typeId", typeIds);
                } catch (Exception e) {
                    // 단일 문자열인 경우
                    params.put("typeId", new String[]{typeIdObj.toString()});
                }
            }

            Object callChartData = commonService.selectCallChartData(params);
            Object scoreChartData = commonService.selectScoreChartData(params);
            Object problemChartData = commonService.selectProblemChartData(params);

            model.addAttribute("callChartData", callChartData);
            model.addAttribute("scoreChartData", scoreChartData);
            model.addAttribute("problemChartData", problemChartData);

            if(StringUtil.isNotBlank((String)params.get("counselor"))) {
                params.remove("counselor");

                Object callAllChartData = commonService.selectCallChartData(params);
                Object scoreAllChartData = commonService.selectScoreChartData(params);
                Object problemAllChartData = commonService.selectProblemChartData(params);

                model.addAttribute("callAllChartData", callAllChartData);
                model.addAttribute("scoreAllChartData", scoreAllChartData);
                model.addAttribute("problemAllChartData", problemAllChartData);
            }

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    /**
     * 미납안내 상세화면 다운로드
     * @param data
     * @return
     */
    @RequestMapping(value="/common/downloadDetail.do", method= RequestMethod.POST)
    public ResponseEntity<byte[]> downloadDetail(@RequestBody Map<String, Object> data) {
        try {
            // Excel 파일 생성 로직
            byte[] excelFile = excelService.createDetailExcel(data);

            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            /*
            headers.setContentDispositionFormData("attachment", "상담정보.xlsx");
            */

            return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value="/common/downloadList.do", method= RequestMethod.POST)
    public ResponseEntity<byte[]> downloadList(@RequestParam Map<String, Object> params, @RequestParam(required = false) String sortOrder) {
        try {

            // 리텐션 - 고객의향 검색조건 관련 세팅
            Object intentionObj = params.get("intentions");
            if(intentionObj != null) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    // JSON 배열 문자열인 경우
                    String[] intentions = mapper.readValue(intentionObj.toString(), String[].class);
                    params.put("intentions", intentions);
                } catch (Exception e) {
                    // 단일 문자열인 경우
                    params.put("intentions", new String[]{intentionObj.toString()});
                }
            }

            // 사후 해피콜 관련 세팅
            Object taskIdObj = params.get("taskId");
            if(taskIdObj != null) {
                ObjectMapper mapper = new ObjectMapper();
                try {
                    // JSON 배열 문자열인 경우
                    String[] taskIds = mapper.readValue(taskIdObj.toString(), String[].class);
                    params.put("taskId", taskIds);
                } catch (Exception e) {
                    // 단일 문자열인 경우
                    params.put("taskId", new String[]{taskIdObj.toString()});
                }
            }

            // JSON 문자열을 List<Map>으로 변환
            if (sortOrder != null && !sortOrder.isEmpty()) {
                ObjectMapper mapper = new ObjectMapper();
                List<Map<String, String>> sortOrderList = mapper.readValue(sortOrder,
                        new TypeReference<List<Map<String, String>>>() {});
                params.put("sortOrder", sortOrderList);
            }

            // 목록 조회 (페이징 제외하고 전체 데이터 조회)
            params.put("pageSize", Integer.MAX_VALUE);  // 전체 데이터 조회
            Object result = collectionService.selectMstrNonpayList(params);

            // Excel 파일 생성
            byte[] excelFile = excelService.createListExcel(result,params);

            // 현재 날짜 구하기
            String fileName = "상담목록_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".xlsx";
            String encodedFileName = URLEncoder.encode(fileName, "UTF-8");

            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", encodedFileName);

            return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }
    
    
    @RequestMapping(value="/common/downloadStats.do", method=RequestMethod.POST)
    public ResponseEntity<byte[]> downloadStats(@RequestBody Map<String, Object> data) {
        try {
            // Excel 파일 생성
            byte[] excelFile = excelService.createStatsExcel(data);
            
            // 현재 날짜 구하기
            String fileName = "통계현황_" + LocalDate.now().format(DateTimeFormatter.ofPattern("yyyyMMdd")) + ".xlsx";
            String encodedFileName = URLEncoder.encode(fileName, "UTF-8");
            
            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", encodedFileName);
            
            return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}