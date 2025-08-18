package com.bnksc.collection.web;

import com.bnksc.collection.service.CollectionService;
import com.bnksc.common.web.BaseController;
import com.bnksc.utils.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.annotations.Param;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import javax.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.Map;

@Controller
public class CollectionController extends BaseController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Resource(name="collectionService")
    private CollectionService collectionService;

    private final ExcelService excelService;

    @Autowired
    public CollectionController(ExcelService excelService) {
        this.excelService = excelService;
    }


    @RequestMapping(value="/collection/nonpaymentPage.do")
    public String nonpaymentPage(HttpServletRequest request, Model model) {
        return "/collection/nonpayment";
    }

    @RequestMapping(value="/collection/nonpaymentDetailPage.do")
    public String nonpaymentDetailPage(HttpServletRequest request, Model model) {

        Map<String, Object> params = getParams(request);

        return "/collection/nonpaymentDetail";
    }


    /**
     * 미납안내 상세정보 조회
     * @param params
     * @param model
     * @return
     */
    @RequestMapping(value="/collection/selectMstrCallOne.do")
    public String selectMstrCallOne(@RequestParam Map<String, Object> params, Model model) {

        try {
            Object result = collectionService.selectMstrCallOne(params);

            model.addAttribute("status", "success");
            model.addAttribute("data", result);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }

    /**
     * 미납안내 목록 조회
     * @param params
     * @param sortOrder
     * @param model
     * @return
     */
    @RequestMapping(value="/collection/selectMstrNonpayList.do")
    public String selectMstrNonpayList(@RequestParam Map<String, Object> params, @RequestParam(required = false) String sortOrder, Model model) {

        try {
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

            Object result = collectionService.selectMstrNonpayList(params);
            model.addAttribute("status", "success");
            model.addAttribute("data", result);
        } catch (Exception e) {
            e.printStackTrace();
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
    @RequestMapping(value="/collection/downloadNonpaymentDetail.do", method=RequestMethod.POST)
    public ResponseEntity<byte[]> downloadNonpaymentDetail(@RequestBody Map<String, Object> data) {
        try {
            // Excel 파일 생성 로직
            byte[] excelFile = excelService.createNonpaymentDetailExcel(data);

            // 응답 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDispositionFormData("attachment", "상담정보.xlsx");

            return new ResponseEntity<>(excelFile, headers, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 사후해피콜 페이지
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value="/collection/afterHappyCallPage.do")
    public String afterHappyCallPage(HttpServletRequest request, Model model) {
        return "/collection/afterHappyCall";
    }

    /**
     * 사후해피콜 상세화면
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value="/collection/afterHappyCallDetailPage.do")
    public String afterHappyCallDetailPage(HttpServletRequest request, Model model) {
        return "/collection/afterHappyCallDetail";
    }

    @RequestMapping(value="/collection/selectProductList.do")
    public String selectProductList(@RequestParam Map<String, Object> params, Model model) {
            log.debug("params :=> " + params);
        try {

            Object result = collectionService.selectProductList(params);
            model.addAttribute("status", "success");
            model.addAttribute("data", result);
        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }
        return "jsonView";
    }

    /**
     * 채권추심 페이지
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value="/collection/debtCollectionPage.do")
    public String debtCollectionPage(HttpServletRequest request, Model model) {
        return "/collection/debtCollection";
    }

}