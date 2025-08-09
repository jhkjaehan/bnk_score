package com.bnksc.collection.web;

import com.bnksc.collection.service.CollectionService;
import com.bnksc.common.web.BaseController;
import com.bnksc.utils.ExcelService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
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

    @RequestMapping(value="/collection/getCounselorList.do")
    public String getCounselorList(@RequestParam Map<String, Object> params, Model model) {

        try {
//            List<Map<String, Object>> counselors = collectionService.getCounselorList(params);

//            model.addAttribute("status", "success");
//            model.addAttribute("data", counselors);
//            model.addAttribute("totalCount", counselors.size());

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }


        return "jsonView";
    }

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

    @RequestMapping(value="/collection/selectMstrNonpayList.do")
    public String selectMstrNonpayList(@RequestParam Map<String, Object> params, @RequestParam(required = false) String sortOrder,  Model model) {

        try {
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
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }
        return "jsonView";
    }

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

    @RequestMapping(value="/collection/afterHappyCallPage.do")
    public String afterHappyCallPage(HttpServletRequest request, Model model) {
        return "/collection/afterHappyCall";
    }

    @RequestMapping(value="/collection/afterHappyCallDetailPage.do")
    public String afterHappyCallDetailPage(HttpServletRequest request, Model model) {
        return "/collection/afterHappyCallDetail";
    }

    @RequestMapping(value="/collection/debtCollectionPage.do")
    public String debtCollectionPage(HttpServletRequest request, Model model) {
        return "/collection/debtCollection";
    }


    /*private Map<String, Object> getParams(HttpServletRequest request) {
        Map<String, Object> params = new HashMap<>();

        request.getParameterMap().forEach((key, values) -> {
            if (values.length > 1) {
                params.put(key, values); // 배열 그대로 저장
            } else {
                params.put(key, values[0]); // 단일 값 저장
            }
        });


        request.setAttribute("params", params);
        return params;
    }*/
}