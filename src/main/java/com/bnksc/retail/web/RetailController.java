package com.bnksc.retail.web;

import com.bnksc.common.web.BaseController;
import com.bnksc.retail.service.RetailService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;
import java.util.Map;

@Controller
public class RetailController extends BaseController {

    Logger log = LoggerFactory.getLogger(this.getClass());

    @Resource(name="retailService")
    private RetailService retailService;

    /**
     * 우수고객 추가대출 화면 이동
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value="/retail/excellentLoanPage.do")
    public String excellentLoanPage(HttpServletRequest request, Model model) {
        return "/retail/excellentLoan";
    }

    /**
     * 우수고객 추가대출 상세화면 이동
     * @param request
     * @param model
     * @return
     */
    @RequestMapping(value="/retail/excellentLoanDetailPage.do")
    public String excellentLoanDetailPage(HttpServletRequest request, Model model) {
        Map<String, Object> params = getParams(request);
        return "/retail/excellentLoanDetail";
    }

    @RequestMapping(value="/retail/selectCallChartData.do")
    public String selectCallChartData(@RequestParam Map<String, Object> params, Model model) {
        try {

            // 서비스 호출
            Object result = retailService.selectCallChartData(params);
            model.addAttribute("status", "success");
            model.addAttribute("data", result);

        } catch (Exception e) {
            model.addAttribute("status", "error");
            model.addAttribute("message", e.getMessage());
        }

        return "jsonView";
    }
}